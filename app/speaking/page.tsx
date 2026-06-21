"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useLearning } from "@/lib/learning-context"
import { speakingChallenges } from "@/lib/lesson-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, Mic, MicOff, Volume2, RotateCcw } from "lucide-react"
import { calculateSimilarity } from "@/lib/utils"

function getFeedback(score: number): { text: string; color: string } {
  if (score >= 90) return { text: "Excellent!", color: "text-green-600" }
  if (score >= 70) return { text: "Good Try!", color: "text-blue-600" }
  return { text: "Try Again!", color: "text-orange-600" }
}

export default function SpeakingPage() {
  const router = useRouter()
  const { studentName, setSpeakingScore, setIsSpeakingCompleted } = useLearning()

  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [spokenText, setSpokenText] = useState("")
  const [similarity, setSimilarity] = useState<number | null>(null)
  const [scores, setScores] = useState<number[]>([])
  const [hasAttempted, setHasAttempted] = useState(false)

  useEffect(() => {
    if (!studentName) {
      router.push("/")
    }
  }, [studentName, router])

  const challenge = speakingChallenges[currentChallenge]
  const totalChallenges = speakingChallenges.length
  const progress = ((currentChallenge + 1) / totalChallenges) * 100

  // Replace [name] with student name
  const displayJapanese = challenge?.japanese.replace("[name]", studentName) || ""
  const displayRomaji = challenge?.romaji.replace("[name]", studentName) || ""
  const displayTranslation = challenge?.translation.replace("[name]", studentName) || ""

  const playAudio = useCallback(() => {
    if (!challenge || isPlaying) return
    
    setIsPlaying(true)
    const utterance = new SpeechSynthesisUtterance(displayJapanese)
    utterance.lang = "ja-JP"
    utterance.rate = 0.8
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }, [challenge, isPlaying, displayJapanese])

  const startRecording = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Browser tidak mendukung Speech Recognition. Gunakan Chrome untuk fitur ini.")
      return
    }

    const SpeechRecognition = (window as unknown as { SpeechRecognition?: typeof window.SpeechRecognition; webkitSpeechRecognition?: typeof window.SpeechRecognition }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.lang = "ja-JP"
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsRecording(true)
      setSpokenText("")
      setSimilarity(null)
    }
    
    recognition.onend = () => setIsRecording(false)
    recognition.onerror = () => setIsRecording(false)

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript
      setSpokenText(transcript)
      
      // Calculate similarity
      const sim = calculateSimilarity(transcript, displayJapanese)
      setSimilarity(sim)
      setHasAttempted(true)
    }

    recognition.start()
  }, [displayJapanese])

  const handleRetry = () => {
    setSpokenText("")
    setSimilarity(null)
    setHasAttempted(false)
  }

  const handleNext = () => {
    // Save current score
    const currentScore = similarity ?? 0
    const newScores = [...scores, currentScore]
    setScores(newScores)

    if (currentChallenge < totalChallenges - 1) {
      setCurrentChallenge((prev) => prev + 1)
      setSpokenText("")
      setSimilarity(null)
      setHasAttempted(false)
    } else {
      // Calculate average score
      const avgScore = Math.round(newScores.reduce((a, b) => a + b, 0) / newScores.length)
      setSpeakingScore(avgScore)
      setIsSpeakingCompleted(true)
      router.push("/quiz")
    }
  }

  if (!studentName || !challenge) {
    return null
  }

  const feedback = similarity !== null ? getFeedback(similarity) : null

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="text-muted-foreground">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Dashboard
          </Button>
          <span className="text-sm text-muted-foreground">
            Tantangan {currentChallenge + 1} / {totalChallenges}
          </span>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            Speaking Practice
          </p>
        </div>

        {/* Challenge Card */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="text-center pb-4">
            <div className="inline-block px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full mb-2">
              Speaking
            </div>
            <CardTitle className="text-lg">Latihan Berbicara</CardTitle>
            <CardDescription>Ucapkan kalimat berikut dalam bahasa Jepang</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Target Sentence */}
            <div className="text-center space-y-4 py-6 bg-muted/30 rounded-xl">
              <p className="text-3xl md:text-4xl font-medium text-foreground leading-relaxed">
                {displayJapanese}
              </p>
              <p className="text-lg text-muted-foreground italic">
                {displayRomaji}
              </p>
              <p className="text-base text-muted-foreground">
                {displayTranslation}
              </p>
            </div>

            {/* Audio Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={playAudio}
                disabled={isPlaying}
                className="gap-2"
              >
                <Volume2 className={`w-5 h-5 ${isPlaying ? "animate-pulse" : ""}`} />
                {isPlaying ? "Memutar..." : "Dengarkan Contoh"}
              </Button>
            </div>

            {/* Recording Section */}
            <div className="text-center space-y-4">
              <Button
                variant={isRecording ? "destructive" : "default"}
                size="lg"
                onClick={startRecording}
                disabled={isRecording}
                className="gap-2"
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-5 h-5 animate-pulse" />
                    Merekam...
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    Mulai Speaking
                  </>
                )}
              </Button>
              <p className="text-sm text-muted-foreground">
                {isRecording ? "Silakan ucapkan kalimat di atas" : "Klik tombol dan ucapkan kalimat"}
              </p>
            </div>

            {/* Result Section */}
            {spokenText && (
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">Kamu berkata:</p>
                  <p className="text-xl font-medium text-foreground">{spokenText}</p>
                </div>

                {similarity !== null && (
                  <div className="p-6 bg-muted/30 rounded-xl text-center space-y-3">
                    <p className="text-sm text-muted-foreground">Kemiripan Pengucapan:</p>
                    <p className="text-5xl font-bold text-foreground">{similarity}%</p>
                    {feedback && (
                      <p className={`text-lg font-medium ${feedback.color}`}>
                        {feedback.text}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={handleRetry}
                    className="gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Coba Lagi
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-end gap-4">
          <Button
            onClick={handleNext}
            disabled={!hasAttempted}
            className="min-w-32"
          >
            {currentChallenge === totalChallenges - 1 ? "Lanjut ke Quiz" : "Selanjutnya"}
          </Button>
        </div>

        {/* Score Display */}
        {scores.length > 0 && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Rata-rata skor: {Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)}%
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
