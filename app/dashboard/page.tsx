"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLearning } from "@/lib/learning-context"
import { lessons, Lesson } from "@/lib/lesson-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Lock,
  ChevronRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  ArrowLeft,
  PlayCircle,
  Clock,
  Award,
} from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const {
    studentName,
    kelas,
    completedLessons,
    isLessonUnlocked,
    getLessonRecord,
  } = useLearning()

  useEffect(() => {
    if (!studentName) router.push("/")
  }, [studentName, router])

  if (!studentName) return null

  const playableLessons = lessons.filter((l) => l.steps && l.steps.length > 0)
  const draftLessons = lessons.filter((l) => !l.steps || l.steps.length === 0)

  // Current active lesson: first unlocked lesson not yet completed,
  // or the last completed lesson if all are finished.
  const currentActiveLesson =
    playableLessons.find((l) => isLessonUnlocked(l.id) && !completedLessons.includes(l.id)) ||
    playableLessons[playableLessons.length - 1]

  const activeRecord = currentActiveLesson ? getLessonRecord(currentActiveLesson.id) : null

  const getButtonText = () => {
    if (!activeRecord) return "Mulai Belajar"
    if (activeRecord.isQuizCompleted) return "Lihat Hasil Kuis"
    if (activeRecord.isLessonCompleted) return "Lanjut ke Kuis"
    if (activeRecord.currentLessonStep > 1) {
      return `Lanjutkan Belajar (Langkah ${activeRecord.currentLessonStep})`
    }
    return "Mulai Belajar"
  }

  const handleStartActiveLesson = () => {
    if (!currentActiveLesson) return
    if (activeRecord?.isQuizCompleted) {
      router.push(`/lesson/${currentActiveLesson.id}/result`)
    } else if (activeRecord?.isLessonCompleted) {
      router.push(`/lesson/${currentActiveLesson.id}/quiz`)
    } else {
      router.push(`/lesson/${currentActiveLesson.id}`)
    }
  }

  const handleOpenLesson = (lesson: Lesson) => {
    if (!isLessonUnlocked(lesson.id)) return
    const rec = getLessonRecord(lesson.id)
    if (rec.isQuizCompleted) {
      router.push(`/lesson/${lesson.id}/result`)
    } else if (rec.isLessonCompleted) {
      router.push(`/lesson/${lesson.id}/quiz`)
    } else {
      router.push(`/lesson/${lesson.id}`)
    }
  }

  const totalPlayable = playableLessons.length
  const completedCount = playableLessons.filter((l) => completedLessons.includes(l.id)).length
  const overallProgress = totalPlayable > 0 ? (completedCount / totalPlayable) * 100 : 0

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50/80 via-background to-sky-100/40 dark:from-slate-950 dark:via-background dark:to-sky-950/20 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-7">

        {/* Header with light blue accent badge */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100/80 border border-sky-200/80 text-sky-800 dark:bg-sky-950/70 dark:border-sky-800/60 dark:text-sky-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>Portal Belajar PeraPeraGo</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            こんにちは, <span className="text-sky-600 dark:text-sky-400">{studentName}</span>!
          </h1>
          <p className="text-sm text-muted-foreground">
            {kelas ? `Kelas ${kelas} · ` : ""}Selamat datang di platform belajar kaiwa bahasa Jepang
          </p>
        </div>

        {/* Overall Progress Card */}
        <Card className="border-sky-200/80 dark:border-sky-900/60 bg-white/90 dark:bg-card/90 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-sky-300 transition-all">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-base">Progres</CardTitle>
                  <CardDescription className="text-xs">
                    {completedCount} dari {totalPlayable} materi pokok selesai
                  </CardDescription>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200/70 dark:border-sky-800/50">
                {Math.round(overallProgress)}% Selesai
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Progress
                value={overallProgress}
                className="h-2.5 bg-sky-100/80 dark:bg-sky-950/60 [&>[data-slot=progress-indicator]]:bg-gradient-to-r [&>[data-slot=progress-indicator]]:from-sky-400 [&>[data-slot=progress-indicator]]:to-sky-600"
              />
            </div>

            {/* Quick indicators for playable lessons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {playableLessons.map((l, index) => {
                const isDone = completedLessons.includes(l.id)
                const isCurrent = currentActiveLesson?.id === l.id && !isDone
                const isUnlocked = isLessonUnlocked(l.id)

                let statusBadge = "bg-muted/40 border-border/40 text-muted-foreground"
                if (isDone) {
                  statusBadge = "bg-sky-50 dark:bg-sky-950/40 border-sky-200 text-sky-800 dark:text-sky-200 font-medium"
                } else if (isCurrent) {
                  statusBadge = "bg-sky-100 dark:bg-sky-900/40 border-sky-300 text-sky-900 dark:text-sky-100 font-semibold"
                }

                return (
                  <div
                    key={l.id}
                    className={`flex items-center gap-1.5 p-2 rounded-lg border transition-all ${statusBadge}`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    ) : isUnlocked ? (
                      <span className="w-3.5 h-3.5 rounded-full bg-sky-400 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {index + 1}
                      </span>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                    )}
                    <span className="truncate">{l.titleRomaji}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Featured Active / Next Up Lesson Card */}
        {currentActiveLesson && (
          <Card
            className="group border-sky-300/80 dark:border-sky-700/60 bg-gradient-to-br from-sky-50/80 via-white to-sky-100/50 dark:from-sky-950/40 dark:via-card dark:to-sky-900/20 shadow-sm hover:shadow-lg hover:border-sky-400 transition-all cursor-pointer overflow-hidden relative"
            onClick={handleStartActiveLesson}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-sky-200/40 to-transparent dark:from-sky-700/10 rounded-bl-full pointer-events-none" />
            <CardHeader className="relative pb-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-2xl font-bold text-sky-950 dark:text-sky-50 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {currentActiveLesson.titleJapanese}
                    </CardTitle>
                  </div>
                  <p className="text-sm font-medium text-sky-700 dark:text-sky-300">
                    {currentActiveLesson.titleRomaji} — {currentActiveLesson.titleIndonesian}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-sky-500 text-white rounded-full shadow-sm shadow-sky-500/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  {completedLessons.includes(currentActiveLesson.id) ? "Selesai" : "Materi Terbuka"}
                </span>
              </div>
              <CardDescription className="pt-2 text-muted-foreground leading-relaxed">
                {currentActiveLesson.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Button
                className="w-full h-11 text-base font-medium bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/20 group-hover:shadow-sky-500/30 transition-all"
                size="lg"
              >
                {getButtonText()}
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Learning Path: List of all lessons */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">
              Alur Pembelajaran
            </h2>
            <span className="text-xs text-muted-foreground">
              Materi berikutnya terbuka setelah kuis selesai
            </span>
          </div>

          <div className="grid gap-2.5">
            {playableLessons.map((lesson, idx) => {
              const unlocked = isLessonUnlocked(lesson.id)
              const completed = completedLessons.includes(lesson.id)
              const record = getLessonRecord(lesson.id)
              const prevLesson = idx > 0 ? playableLessons[idx - 1] : null

              if (unlocked) {
                return (
                  <Card
                    key={lesson.id}
                    onClick={() => handleOpenLesson(lesson)}
                    className={`border transition-all cursor-pointer ${
                      completed
                        ? "border-sky-200/90 hover:border-sky-300 bg-white/90 dark:bg-card hover:bg-sky-50/40 shadow-sm"
                        : "border-sky-300 bg-gradient-to-r from-sky-50/70 to-white dark:from-sky-950/30 dark:to-card hover:border-sky-400 shadow-sm"
                    }`}
                  >
                    <CardContent className="flex items-center justify-between p-3.5 sm:p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            completed
                              ? "bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-300"
                              : "bg-sky-500 text-white shadow-sm shadow-sky-500/20"
                          }`}
                        >
                          {completed ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <PlayCircle className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {lesson.titleJapanese}{" "}
                            <span className="text-xs font-normal text-muted-foreground">
                              ({lesson.titleRomaji})
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {lesson.titleIndonesian} — {lesson.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {completed ? (
                          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200/70">
                            {record.quizScore > 0 ? `Nilai: ${record.quizScore}%` : "Selesai ✓"}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-500 text-white shadow-sm shadow-sky-500/20">
                            Buka
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                )
              }

              // Locked playable lesson
              return (
                <Card
                  key={lesson.id}
                  className="border-sky-100/70 dark:border-sky-950/40 bg-white/40 dark:bg-sky-950/10 opacity-65"
                >
                  <CardContent className="flex items-center justify-between p-3.5 sm:p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-sky-100/60 dark:bg-sky-950/50 flex items-center justify-center shrink-0">
                        <Lock className="w-4 h-4 text-sky-400 dark:text-sky-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {lesson.titleJapanese}{" "}
                          <span className="text-xs font-normal text-muted-foreground">
                            ({lesson.titleRomaji})
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground/80">
                          {prevLesson
                            ? `Selesaikan materi ${prevLesson.titleRomaji} terlebih dahulu`
                            : "Materi terkunci"}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-sky-50/80 dark:bg-sky-950/60 text-sky-600/80 dark:text-sky-400/80 border border-sky-100 dark:border-sky-900/40 shrink-0">
                      Terkunci
                    </span>
                  </CardContent>
                </Card>
              )
            })}

            {/* Draft / Coming soon lessons */}
            {draftLessons.map((lesson) => (
              <Card
                key={lesson.id}
                className="border-dashed border-border/50 bg-muted/10 opacity-50"
              >
                <CardContent className="flex items-center justify-between p-3.5 sm:p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {lesson.titleJapanese}{" "}
                        <span className="text-xs font-normal">({lesson.titleRomaji})</span>
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        {lesson.titleIndonesian} — Konten segera hadir
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground shrink-0">
                    Segera Hadir
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Back */}
        <div className="pt-2 pb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="text-muted-foreground hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/40 gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Button>
        </div>

      </div>
    </main>
  )
}
