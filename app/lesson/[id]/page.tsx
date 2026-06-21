"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useLearning } from "@/lib/learning-context"
import { getLessonById } from "@/lib/lesson-data"
import { normalizeJapanese } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Volume2, Mic, MicOff } from "lucide-react"

export default function LessonPage() {
  const router = useRouter()
  const params = useParams()
  const lessonId = params.id as string

  const {
    studentName,
    currentLessonStep,
    setCurrentLessonStep,
    setLessonProgress,
    setIsLessonCompleted,
  } = useLearning()

  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [spokenText, setSpokenText] = useState("")

  const lesson = getLessonById(lessonId)

  useEffect(() => {
    if (!studentName) router.push("/")
  }, [studentName, router])

  useEffect(() => {
    if (lesson && lesson.isLocked) router.push("/dashboard")
  }, [lesson, router])

  if (!studentName || !lesson) {
    if (!lesson && studentName) router.push("/dashboard")
    return null
  }

  const items = lesson.steps
  const totalSteps = items.length
  const currentItem = items[currentLessonStep - 1]
  const progress = (currentLessonStep / totalSteps) * 100

  if (!currentItem) return null

  const displayJapanese = currentItem.japanese.replace("[name]", studentName)
  const displayRomaji = currentItem.romaji.replace("[name]", studentName)
  const displayTranslation = currentItem.translation.replace("[name]", studentName)

  const playAudio = () => {
    if (isPlaying) return
    setIsPlaying(true)
    const utterance = new SpeechSynthesisUtterance(displayJapanese)
    utterance.lang = "ja-JP"
    utterance.rate = 0.8
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

  const startRecording = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      alert("Browser tidak mendukung Speech Recognition. Gunakan Chrome.")
      return
    }
    const recognition = new SR()
    recognition.lang = "ja-JP"
    recognition.continuous = false
    recognition.interimResults = false
    recognition.onstart = () => setIsRecording(true)
    recognition.onend = () => setIsRecording(false)
    recognition.onerror = () => setIsRecording(false)
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const raw = event.results[0][0].transcript
      setSpokenText(normalizeJapanese(raw))
    }
    recognition.start()
  }

  const handlePrevious = () => {
    if (currentLessonStep > 1) {
      setCurrentLessonStep(currentLessonStep - 1)
      setSpokenText("")
    }
  }

  const handleNext = () => {
    if (currentLessonStep < totalSteps) {
      setCurrentLessonStep(currentLessonStep + 1)
      setLessonProgress((currentLessonStep / totalSteps) * 100)
      setSpokenText("")
    } else {
      setLessonProgress(100)
      setIsLessonCompleted(true)
      router.push(`/lesson/${lessonId}/quiz`)
    }
  }

  const typeLabel =
    currentItem.type === "learn" ? "Materi" :
    currentItem.type === "review" ? "Review" : "Ringkasan"

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="text-muted-foreground">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Dashboard
          </Button>
          <span className="text-sm text-muted-foreground">{currentLessonStep} / {totalSteps}</span>
        </div>

        {/* Progress */}
        <div className="space-y-1">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            {lesson.titleJapanese} — {lesson.description}
          </p>
        </div>

        {/* Card */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="text-center pb-3">
            <div className="inline-block px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full mb-2">
              {typeLabel}
            </div>
            <CardTitle className="text-base">{currentItem.title}</CardTitle>
            <CardDescription>Pelajaran {currentLessonStep}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">

            {/* Japanese display */}
            <div className="text-center space-y-3 py-6 bg-muted/30 rounded-xl">
              <p className="text-3xl md:text-4xl font-medium text-foreground leading-relaxed">
                {displayJapanese}
              </p>
              <p className="text-base text-muted-foreground italic">{displayRomaji}</p>
              <p className="text-sm text-muted-foreground">{displayTranslation}</p>
            </div>

            {/* Listen */}
            <div className="flex justify-center">
              <Button variant="outline" size="lg" onClick={playAudio} disabled={isPlaying} className="gap-2">
                <Volume2 className={`w-5 h-5 ${isPlaying ? "animate-pulse" : ""}`} />
                {isPlaying ? "Memutar..." : "Dengarkan"}
              </Button>
            </div>

            {/* Practice */}
            {currentItem.practicePrompt && (
              <div className="bg-muted/50 rounded-lg p-4 text-center space-y-3">
                <p className="text-sm text-muted-foreground">{currentItem.practicePrompt}</p>
                <Button
                  variant={isRecording ? "destructive" : "secondary"}
                  onClick={startRecording}
                  disabled={isRecording}
                  className="gap-2"
                >
                  {isRecording ? (
                    <><MicOff className="w-4 h-4 animate-pulse" /> Merekam...</>
                  ) : (
                    <><Mic className="w-4 h-4" /> Latihan Bicara</>
                  )}
                </Button>
                {spokenText && (
                  <p className="text-sm text-foreground mt-1">
                    Kamu berkata: <span className="font-medium">{spokenText}</span>
                  </p>
                )}
              </div>
            )}

            {/* Review list */}
            {currentItem.type === "review" && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground text-center mb-2">Ringkasan Materi:</p>
                {items.filter((l) => l.type === "learn").map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <span className="text-xs text-muted-foreground w-5 shrink-0">{index + 1}.</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.japanese}</p>
                      <p className="text-xs text-muted-foreground">{item.romaji}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Summary */}
            {currentItem.type === "summary" && (
              <div className="text-center space-y-3 py-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-foreground/10 text-2xl">
                  🎯
                </div>
                <p className="text-muted-foreground text-sm">
                  Kamu telah mempelajari semua materi dasar perkenalan diri!
                </p>
                <p className="text-xs text-muted-foreground">
                  Selanjutnya, kamu akan mengerjakan Quiz.
                </p>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrevious} disabled={currentLessonStep === 1} className="flex-1">
            <ChevronLeft className="w-4 h-4 mr-1" /> Sebelumnya
          </Button>
          <Button onClick={handleNext} className="flex-1">
            {currentLessonStep === totalSteps ? "Lanjut ke Quiz" : "Selanjutnya"}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

      </div>
    </main>
  )
}
