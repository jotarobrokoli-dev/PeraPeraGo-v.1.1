"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLearning } from "@/lib/learning-context"
import { lessons } from "@/lib/lesson-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Lock, ChevronRight } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const {
    studentName,
    kelas,
    lessonProgress,
    isLessonCompleted,
    isQuizCompleted,
    quizScore,
  } = useLearning()

  useEffect(() => {
    if (!studentName) router.push("/")
  }, [studentName, router])

  if (!studentName) return null

  const unlockedLesson = lessons.find((l) => !l.isLocked)
  const lockedLessons = lessons.filter((l) => l.isLocked)

  const getButtonText = () => {
    if (isQuizCompleted) return "Lihat Hasil"
    if (isLessonCompleted) return "Lanjut ke Quiz"
    if (lessonProgress > 0) return "Lanjutkan Belajar"
    return "Mulai Belajar"
  }

  const handleStartLesson = () => {
    if (!unlockedLesson) return
    if (isQuizCompleted) {
      router.push(`/lesson/${unlockedLesson.id}/result`)
    } else if (isLessonCompleted) {
      router.push(`/lesson/${unlockedLesson.id}/quiz`)
    } else {
      router.push(`/lesson/${unlockedLesson.id}`)
    }
  }

  const overallProgress = isQuizCompleted ? 100 : isLessonCompleted ? 50 : lessonProgress / 2

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">
            こんにちは, {studentName}!
          </h1>
          <p className="text-sm text-muted-foreground">
            {kelas ? `Kelas ${kelas} · ` : ""}Selamat datang di PeraPeraGo
          </p>
        </div>

        {/* Progress Card */}
        {unlockedLesson && (
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Progress Belajar</CardTitle>
              <CardDescription>{unlockedLesson.titleJapanese} — {unlockedLesson.titleRomaji}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Kemajuan</span>
                  <span className="font-medium">{Math.round(overallProgress)}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  { label: "Materi", done: isLessonCompleted },
                  { label: "Quiz", done: isQuizCompleted },
                ].map(({ label, done }) => (
                  <div key={label} className={`p-2 rounded-lg ${done ? "bg-foreground/10" : "bg-muted"}`}>
                    <span className={done ? "text-foreground" : "text-muted-foreground"}>
                      {done ? "✓" : "○"} {label}
                    </span>
                  </div>
                ))}
              </div>
              {isQuizCompleted && (
                <div className="text-center pt-1">
                  <span className="text-sm text-muted-foreground">
                    Skor Quiz: <span className="font-semibold text-foreground">{quizScore}%</span>
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Active Lesson Card */}
        {unlockedLesson && (
          <Card
            className="border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={handleStartLesson}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <CardTitle className="text-xl">{unlockedLesson.titleJapanese}</CardTitle>
                  <p className="text-sm text-muted-foreground">{unlockedLesson.titleRomaji} — {unlockedLesson.titleIndonesian}</p>
                </div>
                <span className="inline-block px-2.5 py-1 text-xs font-medium bg-foreground text-background rounded-full">
                  Aktif
                </span>
              </div>
              <CardDescription className="pt-1">{unlockedLesson.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg">
                {getButtonText()}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Locked Lessons */}
        {lockedLessons.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">Pelajaran Lainnya</h2>
            <div className="grid gap-2">
              {lockedLessons.map((lesson) => (
                <Card key={lesson.id} className="border-border/30 bg-muted/30 opacity-60">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{lesson.titleJapanese}</p>
                        <p className="text-xs text-muted-foreground/70">{lesson.titleIndonesian} — {lesson.description}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">Terkunci</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Back */}
        <div className="pb-4">
          <Button variant="ghost" onClick={() => router.push("/")} className="text-muted-foreground">
            Kembali ke Beranda
          </Button>
        </div>

      </div>
    </main>
  )
}
