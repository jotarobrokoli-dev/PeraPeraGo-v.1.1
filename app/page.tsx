"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLearning } from "@/lib/learning-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Mic, ClipboardList, BarChart2 } from "lucide-react"

const features = [
  {
    icon: BookOpen,
    title: "Pelajaran Interaktif",
    desc: "Materi kaiwa dengan audio dan romaji",
  },
  {
    icon: Mic,
    title: "Latihan Speaking",
    desc: "Ucapkan kalimat dan dapatkan penilaian",
  },
  {
    icon: ClipboardList,
    title: "Quiz",
    desc: "Uji pemahaman setelah belajar",
  },
  {
    icon: BarChart2,
    title: "Progress Belajar",
    desc: "Pantau hasil belajarmu",
  },
]

export default function LandingPage() {
  const [name, setName] = useState("")
  const [kelas, setKelas] = useState("")
  const [errors, setErrors] = useState<{ name?: string; kelas?: string }>({})
  const router = useRouter()
  const { setStudentName, setKelas: saveKelas, studentName } = useLearning()

  const validate = () => {
    const e: { name?: string; kelas?: string } = {}
    if (!name.trim()) e.name = "Nama lengkap wajib diisi."
    if (!kelas.trim()) e.kelas = "Kelas wajib diisi."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleStart = () => {
    if (!validate()) return
    setStudentName(name.trim())
    saveKelas(kelas.trim())
    router.push("/dashboard")
  }

  const handleContinue = () => {
    router.push("/dashboard")
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">

        {/* Logo + Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-foreground text-background text-2xl font-bold select-none">
            ぺ
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">PeraPeraGo</h1>
          <p className="text-base text-muted-foreground">Belajar Berbicara Bahasa Jepang</p>
          <p className="text-sm text-muted-foreground/70">
            Platform belajar kaiwa bahasa Jepang untuk pemula SMA/SMK
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 gap-2">
          {features.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="border-border/40">
              <CardContent className="p-3 space-y-1">
                <Icon className="w-4 h-4 text-foreground/60" />
                <p className="text-xs font-medium text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground leading-snug">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Form */}
        {studentName ? (
          <div className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Selamat datang kembali,{" "}
              <span className="font-medium text-foreground">{studentName}</span>!
            </p>
            <Button onClick={handleContinue} className="w-full h-11 text-base font-medium">
              Lanjutkan Belajar
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">atau daftar baru</span>
              </div>
            </div>
            <StudentForm
              name={name} setName={setName}
              kelas={kelas} setKelas={setKelas}
              errors={errors}
              onSubmit={handleStart}
              submitLabel="Mulai Baru"
              submitVariant="outline"
            />
          </div>
        ) : (
          <StudentForm
            name={name} setName={setName}
            kelas={kelas} setKelas={setKelas}
            errors={errors}
            onSubmit={handleStart}
            submitLabel="Mulai Belajar"
            submitVariant="default"
          />
        )}

        <p className="text-center text-xs text-muted-foreground">Cocok untuk pemula JLPT N5</p>
      </div>
    </main>
  )
}

function StudentForm({
  name, setName, kelas, setKelas, errors, onSubmit, submitLabel, submitVariant,
}: {
  name: string
  setName: (v: string) => void
  kelas: string
  setKelas: (v: string) => void
  errors: { name?: string; kelas?: string }
  onSubmit: () => void
  submitLabel: string
  submitVariant: "default" | "outline"
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">Nama Lengkap</label>
        <Input
          type="text"
          placeholder="Contoh: Budi Santoso"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") onSubmit() }}
          className="h-11"
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">Kelas</label>
        <Input
          type="text"
          placeholder="Contoh: X TKJ 2"
          value={kelas}
          onChange={(e) => setKelas(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") onSubmit() }}
          className="h-11"
        />
        {errors.kelas && <p className="text-xs text-destructive">{errors.kelas}</p>}
      </div>
      <Button
        onClick={onSubmit}
        variant={submitVariant}
        className="w-full h-11 text-base font-medium"
      >
        {submitLabel}
      </Button>
    </div>
  )
}
