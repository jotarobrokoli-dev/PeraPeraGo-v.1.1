"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useLearning } from "@/lib/learning-context"
import { listeningQuestions } from "@/lib/lesson-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, Volume2, CheckCircle, XCircle } from "lucide-react"

export default function ListeningPage() {
  const router = useRouter()
  const { studentName, setListeningScore, setIsListeningCompleted } = useLearning()

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!studentName) {
      router.push("/")
    }
  }, [studentName, router])

  const question = listeningQuestions[currentQuestion]
  const totalQuestions = listeningQuestions.length
  const progress = ((currentQuestion + 1) / totalQuestions) * 100

  const playAudio = useCallback(() => {
    if (!question || isPlaying) return
    
    setIsPlaying(true)
    const utterance = new SpeechSynthesisUtterance(question.audioText)
    utterance.lang = "ja-JP"
    utterance.rate = 0.8
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }, [question, isPlaying])

  const handleAnswerSelect = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
  }

  const handleSubmit = () => {
    if (selectedAnswer === null) return
    
    const isCorrect = selectedAnswer === question.correctIndex
    if (isCorrect) {
      setScore((prev) => prev + 1)
    }
    
    setShowResult(true)
  }

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      // Calculate final score as percentage
      const finalScore = Math.round((score / totalQuestions) * 100)
      setListeningScore(finalScore)
      setIsListeningCompleted(true)
      router.push("/speaking")
    }
  }

  if (!studentName || !question) {
    return null
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
          <span className="text-sm text-muted-foreground">
            Pertanyaan {currentQuestion + 1} / {totalQuestions}
          </span>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            Listening Challenge
          </p>
        </div>

        {/* Question Card */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="text-center pb-4">
            <div className="inline-block px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full mb-2">
              Listening
            </div>
            <CardTitle className="text-lg">Dengarkan dan Jawab</CardTitle>
            <CardDescription>Dengarkan audio, lalu pilih jawaban yang benar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Audio Section */}
            <div className="text-center py-6 bg-muted/30 rounded-xl">
              <Button
                variant="outline"
                size="lg"
                onClick={playAudio}
                disabled={isPlaying}
                className="gap-2"
              >
                <Volume2 className={`w-5 h-5 ${isPlaying ? "animate-pulse" : ""}`} />
                {isPlaying ? "Memutar..." : "Putar Audio"}
              </Button>
              <p className="mt-4 text-sm text-muted-foreground">
                Klik tombol untuk mendengarkan
              </p>
            </div>

            {/* Question */}
            <div className="text-center">
              <p className="text-lg font-medium text-foreground">{question.question}</p>
            </div>

            {/* Choices */}
            <div className="space-y-3">
              {question.choices.map((choice, index) => {
                const isSelected = selectedAnswer === index
                const isCorrect = index === question.correctIndex
                
                let buttonStyle = "border-border hover:border-foreground/50"
                if (showResult) {
                  if (isCorrect) {
                    buttonStyle = "border-green-500 bg-green-50 dark:bg-green-950/20"
                  } else if (isSelected && !isCorrect) {
                    buttonStyle = "border-red-500 bg-red-50 dark:bg-red-950/20"
                  }
                } else if (isSelected) {
                  buttonStyle = "border-foreground bg-foreground/5"
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${buttonStyle}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-muted text-sm font-medium">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-foreground">{choice}</span>
                      </div>
                      {showResult && isCorrect && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Result Feedback */}
            {showResult && (
              <div className={`p-4 rounded-lg text-center ${
                selectedAnswer === question.correctIndex 
                  ? "bg-green-50 dark:bg-green-950/20" 
                  : "bg-red-50 dark:bg-red-950/20"
              }`}>
                <p className={`font-medium ${
                  selectedAnswer === question.correctIndex ? "text-green-600" : "text-red-600"
                }`}>
                  {selectedAnswer === question.correctIndex ? "Benar!" : "Kurang tepat"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Jawaban yang benar: {question.choices[question.correctIndex]}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-end gap-4">
          {!showResult ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="min-w-32"
            >
              Jawab
            </Button>
          ) : (
            <Button onClick={handleNext} className="min-w-32">
              {currentQuestion === totalQuestions - 1 ? "Lanjut ke Speaking" : "Selanjutnya"}
            </Button>
          )}
        </div>

        {/* Score Display */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Skor sementara: {score} / {currentQuestion + (showResult ? 1 : 0)}
          </p>
        </div>
      </div>
    </main>
  )
}
