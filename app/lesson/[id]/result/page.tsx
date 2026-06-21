"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useLearning } from "@/lib/learning-context"
import { getLessonById } from "@/lib/lesson-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, BookOpen, Home, RotateCcw, CheckCircle, Clock, WifiOff } from "lucide-react"

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
    resetProgress,
  } = useLearning()

  const lesson = getLessonById(lessonId)
  const timestampRef = useRef<string>(getNowTimestamp())
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle")

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
      <div className="max-w-2xl mx-auto space-y-5">

        {/* ── Header ── */}
        <div className="text-center space-y-3 pt-6 pb-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-foreground/10">
            <Trophy className="w-8 h-8 text-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Selamat!</h1>
          <p className="text-sm text-muted-foreground">Kamu telah menyelesaikan pelajaran ini</p>
        </div>

        {/* ── Submission status banner ── */}
        {submitStatus === "sending" && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-muted-foreground">
            <div className="w-3 h-3 rounded-full border-2 border-foreground/30 border-t-foreground animate-spin shrink-0" />
            Mengirim hasil ke guru...
          </div>
        )}
        {submitStatus === "sent" && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 text-sm text-green-700 dark:text-green-400">
            <CheckCircle className="w-4 h-4 shrink-0" />
            Hasil berhasil dikirim ke guru.
          </div>
        )}
        {submitStatus === "offline" && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-muted border border-border text-sm text-muted-foreground">
            <WifiOff className="w-4 h-4 shrink-0" />
            Hasil tetap tersimpan di perangkat. Pengiriman ke guru akan dicoba lagi.
          </div>
        )}

        {/* ── Identity card ── */}
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
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-0.5">
                <Clock className="w-3 h-3" />
                {timestampRef.current}
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
          <Button
            variant="outline"
            size="lg"
            className="w-full gap-2"
            onClick={() => router.push(`/lesson/${lessonId}`)}
          >
            <BookOpen className="w-4 h-4" />
            Review Materi
          </Button>
          <Button
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
            onClick={() => { resetProgress(); router.push(`/lesson/${lessonId}`) }}
          >
            <RotateCcw className="w-4 h-4" />
            Ulangi Pelajaran
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground pb-4">
          PeraPeraGo — Belajar Berbicara Bahasa Jepang
        </p>

      </div>
    </main>
  )
}
