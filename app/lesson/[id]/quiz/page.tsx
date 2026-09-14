"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { useLearning } from "@/lib/learning-context"
import { getLessonById } from "@/lib/lesson-data"
import { calculateSimilarity, normalizeJapanese, getSpeakingFeedback } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, Volume2, Mic, MicOff, CheckCircle, XCircle, Shuffle } from "lucide-react"

// ─────────────────────────────────────────────────────────────
// Matching question state
// ─────────────────────────────────────────────────────────────
interface MatchingAttempt {
  selectedLeft: number | null   // index of selected japanese item
  matched: Record<number, number> // leftIdx → rightIdx
  incorrect: number[]            // leftIdx that were wrong
}

function buildShuffledRight(pairs: Array<{ japanese: string; romaji: string; indonesian: string }>) {
  return pairs.map((p, i) => ({ label: p.indonesian, originalIndex: i }))
    .sort(() => Math.random() - 0.5)
}

// ─────────────────────────────────────────────────────────────
// Quiz page
// ─────────────────────────────────────────────────────────────
export default function QuizPage() {
  const router = useRouter()
  const params = useParams()
  const lessonId = params.id as string

  const {
    studentName,
    isLessonUnlocked,
    getLessonRecord,
    updateLessonRecord,
    setQuizScore,
    setIsQuizCompleted,
    addSpeakingScore,
    setListeningScore,
  } = useLearning()

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const correctCountRef = useRef(0)

  // Speaking state
  const [isRecording, setIsRecording] = useState(false)
  const [spokenText, setSpokenText] = useState("")
  const [speakingScore, setSpeakingScore] = useState<number | null>(null)
  const [speakingAttempts, setSpeakingAttempts] = useState(0)
  const speakingAttemptsRef = useRef(0)

  // Listening state
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false)

  // Matching state
  const [matchingAttempt, setMatchingAttempt] = useState<MatchingAttempt>({
    selectedLeft: null,
    matched: {},
    incorrect: [],
  })
  const [shuffledRight, setShuffledRight] = useState<Array<{ label: string; originalIndex: number }>>([])
  const [matchingDone, setMatchingDone] = useState(false)

  // Accumulated scores for weighted result
  const listeningScoresRef = useRef<number[]>([])

  // Holds the currently-active SpeechRecognition instance so it can be
  // aborted on question change / unmount, preventing stale onresult
  // callbacks from firing after the user has moved to a different
  // (non-speaking) question — this was the root cause of the crash
  // that occurred consistently at the speaking→listening transition.
  const recognitionRef = useRef<any>(null)

  const lesson = getLessonById(lessonId)

  useEffect(() => {
    if (!studentName) router.push("/")
  }, [studentName, router])

  useEffect(() => {
    if (lesson && !isLessonUnlocked(lesson.id)) {
      router.push("/dashboard")
    }
  }, [lesson, isLessonUnlocked, router])

  // Reset per-question state when question changes
  useEffect(() => {
    setHasPlayedAudio(false)
    setMatchingAttempt({ selectedLeft: null, matched: {}, incorrect: [] })
    setMatchingDone(false)
    setSpeakingAttempts(0)
    speakingAttemptsRef.current = 0
    if (lesson) {
      const q = lesson.quiz[currentQuestion]
      if (q?.type === "matching" && q.pairs) {
        setShuffledRight(buildShuffledRight(q.pairs))
      }
    }

    // Stop any in-flight speech recognition / synthesis from the
    // previous question before rendering the new one. Without this,
    // a mic session left open from a speaking question can fire its
    // onresult callback after the user has already moved to the next
    // question, updating state for a component that's no longer
    // showing a speaking UI.
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort() } catch {}
        recognitionRef.current = null
      }
      window.speechSynthesis.cancel()
      setIsRecording(false)
      setIsPlaying(false)
    }
  }, [currentQuestion, lesson])

  // Safety net: also clean up on full component unmount (e.g. navigating
  // away via the Dashboard button while a recording is in progress).
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort() } catch {}
        recognitionRef.current = null
      }
      window.speechSynthesis.cancel()
    }
  }, [])

  if (!studentName || !lesson) {
    if (!lesson && studentName) router.push("/dashboard")
    return null
  }

  const questions = lesson.quiz
  const totalQuestions = questions.length
  const question = questions[currentQuestion]
  if (!question) return null

  const progress = ((currentQuestion + 1) / totalQuestions) * 100

  const displayJapanese = question.japanese?.replace("[name]", studentName) ?? ""
  const displayTranslation = question.translation?.replace("[name]", studentName) ?? ""
  const displayCorrectAnswer = typeof question.correctAnswer === "string"
    ? question.correctAnswer.replace("[name]", studentName)
    : ""

  const isMC = question.type === "multiple-choice"
  const isListening = question.type === "listening"
  const isSpeaking = question.type === "speaking"
  const isMatching = question.type === "matching"

  const typeLabel =
    isMC ? "Pilihan Ganda" :
    isListening ? "Listening" :
    isSpeaking ? "Speaking" : "Menjodohkan"

  // ── TTS ────────────────────────────────────────────────────
  const playAudio = useCallback((text: string) => {
    if (isPlaying) return
    setIsPlaying(true)
    setHasPlayedAudio(true)
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "ja-JP"
    utterance.rate = 0.8
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }, [isPlaying])

  // ── Speech Recognition ─────────────────────────────────────
  const startRecording = useCallback(() => {
    if (speakingAttemptsRef.current >= 2) return

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      alert("Browser tidak mendukung Speech Recognition. Gunakan Chrome.")
      return
    }

    // Abort any previous session before starting a new one
    if (recognitionRef.current) {
      try { recognitionRef.current.abort() } catch {}
    }

    const recognition = new SR()
    recognitionRef.current = recognition

    recognition.lang = "ja-JP"
    recognition.continuous = false
    recognition.interimResults = false

    // Guard: only apply state updates if this instance is still the
    // one currently tracked in recognitionRef. If the user has moved
    // to a different question (cleanup effect cleared the ref), any
    // late-firing callback from this old instance is ignored instead
    // of updating state for a question that's no longer showing.
    const isStillCurrent = () => recognitionRef.current === recognition

    recognition.onstart = () => {
      if (!isStillCurrent()) return
      setIsRecording(true)
      setSpokenText("")
      setSpeakingScore(null)
    }
    recognition.onend = () => {
      if (!isStillCurrent()) return
      setIsRecording(false)
    }
    recognition.onerror = () => {
      if (!isStillCurrent()) return
      setIsRecording(false)
    }
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (!isStillCurrent()) return
      const raw = event.results[0][0].transcript
      // Normalize: kanji→hiragana, katakana→hiragana, clean punctuation
      const normalized = normalizeJapanese(raw)
      setSpokenText(normalized)
      const sim = calculateSimilarity(normalized, displayCorrectAnswer)
      setSpeakingScore(sim)

      const currentAttempts = speakingAttemptsRef.current + 1
      speakingAttemptsRef.current = currentAttempts
      setSpeakingAttempts(currentAttempts)

      // Jika sudah 2x berbicara menggunakan mic, langsung otomatis dinilai (benar/salah)
      if (currentAttempts >= 2) {
        if (sim >= 60) {
          correctCountRef.current += 1
          setScore(correctCountRef.current)
        }
        addSpeakingScore(sim)
        const rec = getLessonRecord(lessonId)
        updateLessonRecord(lessonId, {
          speakingScores: [...rec.speakingScores, sim],
        })
        setShowResult(true)
      }
    }
    recognition.start()
  }, [displayCorrectAnswer, lessonId, addSpeakingScore, getLessonRecord, updateLessonRecord])

  // ── Submit handlers ────────────────────────────────────────
  const handleSubmitMC = () => {
    if (selectedAnswer === null) return
    const isCorrect = selectedAnswer === question.correctAnswer
    if (isCorrect) { correctCountRef.current += 1; setScore(correctCountRef.current) }
    if (isListening) {
      listeningScoresRef.current.push(isCorrect ? 100 : 0)
    }
    setShowResult(true)
  }

  const handleSubmitSpeaking = () => {
    if (speakingScore === null || showResult) return
    if (speakingScore >= 60) { correctCountRef.current += 1; setScore(correctCountRef.current) }
    addSpeakingScore(speakingScore)
    const rec = getLessonRecord(lessonId)
    updateLessonRecord(lessonId, {
      speakingScores: [...rec.speakingScores, speakingScore],
    })
    setShowResult(true)
  }

  // ── Matching logic ─────────────────────────────────────────
  const handleMatchLeft = (leftIdx: number) => {
    if (showResult || matchingDone || matchingAttempt.matched[leftIdx] !== undefined) return
    setMatchingAttempt((prev) => ({ ...prev, selectedLeft: leftIdx }))
  }

  const handleMatchRight = (rightIdx: number) => {
    if (showResult || matchingDone) return
    const { selectedLeft, matched } = matchingAttempt
    if (selectedLeft === null) return

    // Check if right is already matched
    const alreadyUsed = Object.values(matched).includes(rightIdx)
    if (alreadyUsed) return

    const rightItem = shuffledRight[rightIdx]
    const isCorrect = rightItem.originalIndex === selectedLeft

    const newMatched = { ...matched }
    const newIncorrect = [...matchingAttempt.incorrect]

    if (isCorrect) {
      newMatched[selectedLeft] = rightIdx
    } else {
      newIncorrect.push(selectedLeft)
    }

    const allMatched = Object.keys(newMatched).length === (question.pairs?.length ?? 0)

    if (allMatched) {
      const matchScore = Math.round((Object.keys(newMatched).length / (question.pairs?.length ?? 1)) * 100)
      correctCountRef.current += matchScore >= 60 ? 1 : 0
      setScore(correctCountRef.current)
      setMatchingDone(true)
      setShowResult(true)
    }

    setMatchingAttempt({ selectedLeft: isCorrect ? null : selectedLeft, matched: newMatched, incorrect: newIncorrect })
  }

  // ── Next question ──────────────────────────────────────────
  const handleNext = () => {
    // Stop any lingering mic/audio session immediately, rather than
    // waiting for the question-change cleanup effect to run.
    if (recognitionRef.current) {
      try { recognitionRef.current.abort() } catch {}
      recognitionRef.current = null
    }
    window.speechSynthesis.cancel()

    setSpeakingAttempts(0)
    speakingAttemptsRef.current = 0

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((p) => p + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setSpokenText("")
      setSpeakingScore(null)
      setIsRecording(false)
      setIsPlaying(false)
    } else {
      const finalQuizRaw = Math.round((correctCountRef.current / totalQuestions) * 100)

      const avgListening = listeningScoresRef.current.length > 0
        ? Math.round(listeningScoresRef.current.reduce((a, b) => a + b, 0) / listeningScoresRef.current.length)
        : 0
      setListeningScore(avgListening)

      updateLessonRecord(lessonId, {
        quizScore: finalQuizRaw,
        listeningScore: avgListening,
        isQuizCompleted: true,
      })

      setQuizScore(finalQuizRaw)
      setIsQuizCompleted(true)
      router.push(`/lesson/${lessonId}/result`)
    }
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="text-muted-foreground">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Dashboard
          </Button>
          <span className="text-sm text-muted-foreground">Soal {currentQuestion + 1} / {totalQuestions}</span>
        </div>

        {/* Progress */}
        <div className="space-y-1">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">Quiz {lesson.titleJapanese}</p>
        </div>

        {/* Question Card */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="text-center pb-3">
            <div className="inline-block px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full mb-2">
              {typeLabel}
            </div>
            <CardTitle className="text-base">Pertanyaan {currentQuestion + 1}</CardTitle>
            <CardDescription>{question.question}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">

            {/* ── MC: Japanese display ── */}
            {(isMC || isListening) && displayJapanese && (
              <div className="text-center py-4 bg-muted/30 rounded-xl space-y-1">
                <p className="text-2xl md:text-3xl font-medium text-foreground">{displayJapanese}</p>
              </div>
            )}

            {/* ── Listening: audio button ── */}
            {isListening && question.audioText && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => playAudio(question.audioText!)}
                  disabled={isPlaying}
                  className="gap-2"
                >
                  <Volume2 className={`w-5 h-5 ${isPlaying ? "animate-pulse" : ""}`} />
                  {isPlaying ? "Memutar..." : hasPlayedAudio ? "Putar Ulang" : "Putar Audio"}
                </Button>
              </div>
            )}

            {/* ── MC + Listening: choices ── */}
            {(isMC || isListening) && question.choices && (
              <div className="space-y-2">
                {question.choices.map((choice, index) => {
                  const isSelected = selectedAnswer === index
                  const isCorrect = index === question.correctAnswer
                  let style = "border-border hover:border-foreground/40 hover:bg-muted/30"
                  if (showResult) {
                    if (isCorrect) style = "border-green-500 bg-green-50 dark:bg-green-950/20"
                    else if (isSelected) style = "border-red-500 bg-red-50 dark:bg-red-950/20"
                    else style = "border-border opacity-50"
                  } else if (isSelected) {
                    style = "border-foreground bg-foreground/5"
                  }
                  return (
                    <button
                      key={index}
                      onClick={() => { if (!showResult) setSelectedAnswer(index) }}
                      disabled={showResult}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${style}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 flex items-center justify-center rounded-full bg-muted text-xs font-medium shrink-0">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-sm text-foreground">{choice}</span>
                        </div>
                        {showResult && isCorrect && <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />}
                        {showResult && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {/* ── MC/Listening result feedback ── */}
            {showResult && (isMC || isListening) && (
              <div className={`p-3 rounded-lg text-center ${selectedAnswer === question.correctAnswer
                ? "bg-green-50 dark:bg-green-950/20"
                : "bg-red-50 dark:bg-red-950/20"}`}
              >
                <p className={`text-sm font-medium ${selectedAnswer === question.correctAnswer
                  ? "text-green-600" : "text-red-600"}`}>
                  {selectedAnswer === question.correctAnswer ? "✓ Benar!" : "✗ Kurang tepat"}
                </p>
                {selectedAnswer !== question.correctAnswer && question.choices && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Jawaban benar: <span className="font-medium">{question.choices[question.correctAnswer as number]}</span>
                  </p>
                )}
              </div>
            )}

            {/* ── Speaking ── */}
            {isSpeaking && (
              <div className="space-y-4">
                {/* Target card with listen + translation */}
                <div className="text-center py-5 bg-muted/30 rounded-xl space-y-2">
                  <p className="text-2xl md:text-3xl font-medium text-foreground">{displayJapanese}</p>
                  {displayTranslation && (
                    <p className="text-xs text-muted-foreground">{displayTranslation}</p>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => playAudio(displayJapanese)}
                    disabled={isPlaying}
                    className="gap-2 text-muted-foreground"
                  >
                    <Volume2 className={`w-4 h-4 ${isPlaying ? "animate-pulse" : ""}`} />
                    {isPlaying ? "Memutar..." : "Dengarkan contoh"}
                  </Button>
                </div>

                {/* Record button */}
                {!showResult && (
                  <div className="text-center space-y-2">
                    <Button
                      variant={isRecording ? "destructive" : "default"}
                      size="lg"
                      onClick={startRecording}
                      disabled={isRecording || speakingAttempts >= 2}
                      className="gap-2"
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="w-5 h-5 animate-pulse" /> Merekam...
                        </>
                      ) : (
                        <>
                          <Mic className="w-5 h-5" />
                          {speakingAttempts === 0
                            ? "Mulai Speaking"
                            : speakingAttempts === 1
                            ? "Rekam Ulang (Percobaan Terakhir)"
                            : "Batas Percobaan Habis"}
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      {speakingAttempts === 0
                        ? "Tekan tombol lalu ucapkan kalimat di atas (Maksimal 2x percobaan)"
                        : "Percobaan 1 selesai · Tekan Kirim atau rekam 1x lagi untuk kesempatan terakhir"}
                    </p>
                  </div>
                )}

                {/* Transcript + score */}
                {spokenText && (
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground mb-1">Kamu berkata:</p>
                      <p className="text-lg font-medium text-foreground">{spokenText}</p>
                    </div>

                    {!showResult && speakingScore !== null && (() => {
                      const fb = getSpeakingFeedback(speakingScore)
                      return (
                        <div
                          className={`p-4 rounded-lg text-center space-y-1 ${
                            speakingScore >= 75
                              ? "bg-green-50 dark:bg-green-950/20"
                              : speakingScore >= 60
                              ? "bg-yellow-50 dark:bg-yellow-950/20"
                              : "bg-orange-50 dark:bg-orange-950/20"
                          }`}
                        >
                          <p className={`text-xl font-bold ${fb.color}`}>{speakingScore}%</p>
                          <p className={`text-sm font-medium ${fb.color}`}>{fb.text}</p>
                        </div>
                      )
                    })()}
                  </div>
                )}

                {/* Speaking result after submit */}
                {showResult && speakingScore !== null && (() => {
                  const fb = getSpeakingFeedback(speakingScore)
                  const isPassed = speakingScore >= 60
                  return (
                    <div
                      className={`p-4 rounded-xl text-center space-y-1.5 ${
                        isPassed
                          ? "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
                          : "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800"
                      }`}
                    >
                      <p
                        className={`text-base font-bold ${
                          isPassed
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {isPassed ? "✓ Benar!" : "✗ Kurang tepat"}
                      </p>
                      <p className="text-2xl font-extrabold text-foreground">{speakingScore}%</p>
                      <p className="text-sm font-medium text-muted-foreground">{fb.text}</p>
                    </div>
                  )
                })()}
              </div>
            )}

            {/* ── Matching ── */}
            {isMatching && question.pairs && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shuffle className="w-3 h-3" />
                  Pilih kalimat Jepang, lalu pilih artinya
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {/* Left: Japanese */}
                  <div className="space-y-2">
                    {question.pairs.map((pair, idx) => {
                      const isMatched = matchingAttempt.matched[idx] !== undefined
                      const isSelected = matchingAttempt.selectedLeft === idx
                      const wasWrong = matchingAttempt.incorrect.includes(idx)
                      let style = "border-border hover:border-foreground/40"
                      if (isMatched) style = "border-green-500 bg-green-50 dark:bg-green-950/20 opacity-60"
                      else if (isSelected) style = "border-foreground bg-foreground/5"
                      else if (wasWrong) style = "border-red-400"
                      return (
                        <button
                          key={idx}
                          onClick={() => handleMatchLeft(idx)}
                          disabled={isMatched || showResult}
                          className={`w-full p-3 text-left rounded-lg border-2 transition-all ${style}`}
                        >
                          <p className="text-sm font-medium text-foreground leading-snug">{pair.japanese}</p>
                        </button>
                      )
                    })}
                  </div>
                  {/* Right: Indonesian */}
                  <div className="space-y-2">
                    {shuffledRight.map((item, idx) => {
                      const isMatched = Object.values(matchingAttempt.matched).includes(idx)
                      let style = "border-border hover:border-foreground/40"
                      if (isMatched) style = "border-green-500 bg-green-50 dark:bg-green-950/20 opacity-60"
                      else if (matchingAttempt.selectedLeft !== null) style = "border-border hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                      return (
                        <button
                          key={idx}
                          onClick={() => handleMatchRight(idx)}
                          disabled={isMatched || showResult}
                          className={`w-full p-3 text-left rounded-lg border-2 transition-all ${style} min-h-[56px]`}
                        >
                          <p className="text-sm text-foreground">{item.label}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>
                {matchingDone && (
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg text-center">
                    <p className="text-sm font-medium text-green-600">
                      ✓ Semua pasangan cocok! Bagus!
                    </p>
                  </div>
                )}
              </div>
            )}

          </CardContent>
        </Card>

        {/* Action bar */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Skor: {score} / {currentQuestion + (showResult ? 1 : 0)}
          </p>
          {!showResult ? (
            <>
              {(isMC || isListening) && (
                <Button onClick={handleSubmitMC} disabled={selectedAnswer === null} className="min-w-28">
                  Jawab
                </Button>
              )}
              {isSpeaking && (
                <Button onClick={handleSubmitSpeaking} disabled={speakingScore === null} className="min-w-28">
                  Kirim
                </Button>
              )}
              {isMatching && (
                <p className="text-xs text-muted-foreground">Jodohkan semua pasangan</p>
              )}
            </>
          ) : (
            <Button onClick={handleNext} className="min-w-28">
              {currentQuestion === totalQuestions - 1 ? "Lihat Hasil" : "Selanjutnya"}
            </Button>
          )}
        </div>

      </div>
    </main>
  )
}
