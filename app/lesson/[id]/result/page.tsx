"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useLearning } from "@/lib/learning-context"
import { lessons, getLessonById } from "@/lib/lesson-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, BookOpen, Home, RotateCcw, CheckCircle, Clock, WifiOff, ChevronRight } from "lucide-react"

// ─────────────────────────────────────────────────────────────
// Feedback per score band (spec-required wording)
// ─────────────────────────────────────────────────────────────
function getFeedback(score: number): { text: string; sub: string; color: string; grade: string } {
  if (score >= 90) return {
    grade: "A",
    text: "Excellent! 🎉",
    sub: "Kaiwa kamu sangat bagus!",
    color: "text-green-600",
  }
  if (score >= 75) return {
    grade: "B",
    text: "Good job! 👍",
    sub: "Tetap latihan ya!",
    color: "text-blue-600",
  }
  if (score >= 60) return {
    grade: "C",
    text: "Nice try! 😊",
    sub: "Kamu sudah berkembang!",
    color: "text-yellow-600",
  }
  return {
    grade: "D",
    text: "Yuk coba lagi! 💪",
    sub: "Semangat belajar bahasa Jepang!",
    color: "text-orange-600",
  }
}

// ─────────────────────────────────────────────────────────────
// Timestamp — local date + time, Indonesian locale
// ─────────────────────────────────────────────────────────────
function getNowTimestamp(): string {
  return new Date().toLocaleString("id-ID", {
    day:    "2-digit",
    month:  "long",
    year:   "numeric",
    hour:   "2-digit",
    minute: "2-digit",
  })
}

// ─────────────────────────────────────────────────────────────
// Submission status type
// ─────────────────────────────────────────────────────────────
type SubmitStatus = "idle" | "sending" | "sent" | "offline"

// ─────────────────────────────────────────────────────────────
// Result Page
// ─────────────────────────────────────────────────────────────
export default function ResultPage() {
  const router = useRouter()
  const params = useParams()
  const lessonId = params.id as string

  const {
    studentName,
    kelas,
    quizScore,
    speakingScores,
    listeningScore,
    resultSubmitted,
    setResultSubmitted,
    completeLesson,
    resetLessonProgress,
    updateLessonRecord,
  } = useLearning()

  const lesson = getLessonById(lessonId)
  const playableLessons = lessons.filter((l) => l.steps.length > 0)
  const currentIndex = playableLessons.findIndex((l) => l.id === lessonId)
  const nextLesson = currentIndex >= 0 && currentIndex < playableLessons.length - 1
    ? playableLessons[currentIndex + 1]
    : null

  const timestampRef = useRef<string>("")
  const [timestamp, setTimestamp] = useState<string>("")
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle")

  // Initialize timestamp on client to prevent server/client locale hydration mismatch
  useEffect(() => {
    const now = getNowTimestamp()
    setTimestamp(now)
    timestampRef.current = now
  }, [])

  // Mark lesson as completed so the next lesson is immediately unlocked
  useEffect(() => {
    if (lessonId) {
      completeLesson(lessonId)
    }
  }, [lessonId])

  useEffect(() => {
    if (!studentName) router.push("/")
    else if (studentName && !lesson) router.push("/dashboard")
  }, [studentName, lesson, router])

  // ── Weighted scores ────────────────────────────────────────
  // Speaking 40% | Listening 20% | Quiz 40%
  // If a component was not attempted (no data), it scores 0 for that weight.
  const speakingAttempted = speakingScores.length > 0
  const listeningAttempted = listeningScore > 0

  const avgSpeaking  = speakingAttempted
    ? Math.round(speakingScores.reduce((a, b) => a + b, 0) / speakingScores.length)
    : 0

  const avgListening = listeningAttempted ? listeningScore : 0

  const finalScore = Math.round(
    avgSpeaking  * 0.40 +
    avgListening * 0.20 +
    quizScore    * 0.40
  )

  const feedback = getFeedback(finalScore)

  // ── Auto-submit to Google Sheets (once only) ───────────────
  useEffect(() => {
    if (!studentName || !lesson) return
    if (resultSubmitted) {
      // Already submitted in a previous render / page revisit — skip
      setSubmitStatus("sent")
      return
    }

    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL
    if (!scriptUrl || scriptUrl.includes("YOUR_SCRIPT_ID_HERE")) {
      // URL not configured — silently skip, don't block the student
      return
    }

    const payload = {
      studentName,
      studentClass: kelas,
      lessonId,
      lessonName:     lesson.titleRomaji,
      speakingScore:  avgSpeaking,
      listeningScore: avgListening,
      quizScore,
      finalScore,
      timestamp:      timestampRef.current,
    }

    setSubmitStatus("sending")

    fetch(scriptUrl, {
      method: "POST",
      // Google Apps Script requires no-cors for cross-origin POST
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(() => {
        // no-cors means we can't read the response body, but a resolved promise
        // means the request reached the server without a network error
        setResultSubmitted(true)
        setSubmitStatus("sent")
      })
      .catch(() => {
        // Network failure — degrade gracefully, don't block the student
        setSubmitStatus("offline")
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // run once on mount only

  if (!studentName || !lesson) return null

  const scoreBreakdown = [
    { label: "Speaking",  value: avgSpeaking,  weight: 40, attempted: speakingAttempted },
    { label: "Listening", value: avgListening, weight: 20, attempted: listeningAttempted },
    { label: "Quiz",      value: quizScore,    weight: 40, attempted: true },
  ]

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ── Submission status alert ── */}
        {submitStatus === "sending" && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 text-xs">
            <span className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
            Menyimpan hasil ke rekap nilai...
          </div>
        )}
        {submitStatus === "sent" && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 text-xs">
            <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0" />
            Hasil berhasil dicatat ke spreadsheet guru!
          </div>
        )}
        {submitStatus === "offline" && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-300 text-xs">
            <WifiOff className="w-3.5 h-3.5 text-yellow-600 shrink-0" />
            Tidak dapat terhubung ke server nilai. Nilai tetap tersimpan di perangkat ini.
          </div>
        )}

        {/* ── Header ── */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-foreground text-background mb-2">
            <Trophy className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Hasil Belajar</h1>
          <p className="text-sm text-muted-foreground">Evaluasi materi dan kuis kaiwa</p>
        </div>

        {/* ── Student info card ── */}
        <Card className="border-border/50 shadow-sm">
          <CardContent className="pt-5 pb-4 space-y-3">
            {/* Lesson badge */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-foreground">{lesson.titleRomaji}</p>
                <p className="text-sm text-muted-foreground">{lesson.titleJapanese}</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-medium bg-foreground text-background rounded-full">
                Selesai
              </span>
            </div>
            <div className="border-t border-border/50 pt-3 space-y-1">
              <p className="font-medium text-foreground">{studentName}</p>
              {kelas && <p className="text-sm text-muted-foreground">Kelas {kelas}</p>}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-0.5" suppressHydrationWarning>
                <Clock className="w-3 h-3" />
                <span suppressHydrationWarning>{timestamp}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Final score ── */}
        <Card className="border-border/50 shadow-sm">
          <CardContent className="pt-6 pb-5 text-center space-y-3">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Nilai Akhir</p>
            <div className="flex items-end justify-center gap-2">
              <span className="text-7xl font-bold text-foreground leading-none">{finalScore}</span>
              <span className="text-xl text-muted-foreground mb-1">/ 100</span>
            </div>
            <div className="space-y-1">
              <p className={`text-lg font-bold ${feedback.color}`}>{feedback.text}</p>
              <p className={`text-sm ${feedback.color} opacity-80`}>{feedback.sub}</p>
            </div>
            <p className="text-xs text-muted-foreground pt-1">Grade {feedback.grade}</p>
          </CardContent>
        </Card>

        {/* ── Score breakdown ── */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Rincian Nilai</CardTitle>
            <CardDescription>Bobot: Speaking 40% · Listening 20% · Quiz 40%</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {scoreBreakdown.map(({ label, value, weight, attempted }) => (
              <div key={label} className="space-y-1.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    {label}
                    <span className="ml-1.5 text-xs text-muted-foreground/50">({weight}%)</span>
                  </span>
                  <span className="font-semibold text-foreground tabular-nums">
                    {attempted ? value : <span className="text-muted-foreground/50 font-normal text-xs">—</span>}
                  </span>
                </div>
                <Progress value={attempted ? value : 0} className="h-1.5" />
              </div>
            ))}
            <div className="border-t border-border pt-3 flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Nilai Akhir</span>
              <span className={`text-base font-bold ${feedback.color}`}>{finalScore}</span>
            </div>
          </CardContent>
        </Card>

        {/* ── Actions ── */}
        <div className="grid gap-3 pb-8">
          {nextLesson && (
            <Button
              size="lg"
              className="w-full gap-2 bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/20 text-base h-12 font-medium"
              onClick={() => router.push(`/lesson/${nextLesson.id}`)}
            >
              Lanjut ke {nextLesson.titleRomaji} ({nextLesson.titleJapanese})
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="outline"
            size="lg"
            className="w-full gap-2 border-border/80 hover:bg-muted/50"
            onClick={() => router.push(`/lesson/${lessonId}`)}
          >
            <BookOpen className="w-4 h-4" />
            Review Materi Ini
          </Button>
          <Button
            variant={nextLesson ? "outline" : "default"}
            size="lg"
            className="w-full gap-2"
            onClick={() => router.push("/dashboard")}
          >
            <Home className="w-4 h-4" />
            Kembali ke Dashboard
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full gap-2 text-muted-foreground"
            onClick={() => { resetLessonProgress(lessonId); router.push(`/lesson/${lessonId}`) }}
          >
            <RotateCcw className="w-4 h-4" />
            Ulangi Pelajaran Ini
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground pb-4">
          PeraPeraGo — Belajar Berbicara Bahasa Jepang
        </p>

      </div>
    </main>
  )
}
