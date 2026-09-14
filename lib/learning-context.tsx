"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { lessons } from "@/lib/lesson-data"

export interface LessonRecord {
  currentLessonStep: number
  lessonProgress: number
  isLessonCompleted: boolean
  isQuizCompleted: boolean
  quizScore: number
  speakingScores: number[]
  listeningScore: number
  resultSubmitted: boolean
}

export const defaultLessonRecord: LessonRecord = {
  currentLessonStep: 1,
  lessonProgress: 0,
  isLessonCompleted: false,
  isQuizCompleted: false,
  quizScore: 0,
  speakingScores: [],
  listeningScore: 0,
  resultSubmitted: false,
}

export interface LearningState {
  studentName: string
  kelas: string
  completedLessons: string[]
  lessonRecords: Record<string, LessonRecord>
  // Backward compatibility fields
  lessonProgress: number
  currentLessonStep: number
  listeningScore: number
  speakingScore: number
  speakingScores: number[]
  quizScore: number
  isLessonCompleted: boolean
  isListeningCompleted: boolean
  isSpeakingCompleted: boolean
  isQuizCompleted: boolean
  resultSubmitted: boolean
}

export interface LearningContextType extends LearningState {
  setStudentName: (name: string) => void
  setKelas: (kelas: string) => void
  setLessonProgress: (progress: number) => void
  setCurrentLessonStep: (step: number) => void
  setListeningScore: (score: number) => void
  setSpeakingScore: (score: number) => void
  addSpeakingScore: (score: number) => void
  setQuizScore: (score: number) => void
  setIsLessonCompleted: (completed: boolean) => void
  setIsListeningCompleted: (completed: boolean) => void
  setIsSpeakingCompleted: (completed: boolean) => void
  setIsQuizCompleted: (completed: boolean) => void
  setResultSubmitted: (submitted: boolean) => void
  resetProgress: () => void

  // Multi-lesson methods
  isLessonUnlocked: (lessonId: string) => boolean
  completeLesson: (lessonId: string) => void
  getLessonRecord: (lessonId: string) => LessonRecord
  updateLessonRecord: (lessonId: string, updates: Partial<LessonRecord>) => void
  resetLessonProgress: (lessonId: string) => void
}

const defaultState: LearningState = {
  studentName: "",
  kelas: "",
  completedLessons: [],
  lessonRecords: {},
  lessonProgress: 0,
  currentLessonStep: 1,
  listeningScore: 0,
  speakingScore: 0,
  speakingScores: [],
  quizScore: 0,
  isLessonCompleted: false,
  isListeningCompleted: false,
  isSpeakingCompleted: false,
  isQuizCompleted: false,
  resultSubmitted: false,
}

export function checkIsLessonUnlocked(lessonId: string, completedLessons: string[]): boolean {
  const playableLessons = lessons.filter((l) => l.steps && l.steps.length > 0)
  const idx = playableLessons.findIndex((l) => l.id === lessonId)
  if (idx === -1) return false
  if (idx === 0) return true
  const prevLesson = playableLessons[idx - 1]
  return completedLessons.includes(prevLesson.id)
}

const LearningContext = createContext<LearningContextType | undefined>(undefined)

export function LearningProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LearningState>(defaultState)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("peraperago-learning-state")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const completed: string[] = Array.isArray(parsed.completedLessons) ? parsed.completedLessons : []
        
        // Backward-compat migration: if student had completed quiz previously
        if (parsed.isQuizCompleted && !completed.includes("aisatsu")) {
          completed.push("aisatsu")
        }

        const records: Record<string, LessonRecord> = parsed.lessonRecords || {}
        if (parsed.isQuizCompleted && !records["aisatsu"]) {
          records["aisatsu"] = {
            currentLessonStep: parsed.currentLessonStep || 1,
            lessonProgress: parsed.lessonProgress || 100,
            isLessonCompleted: parsed.isLessonCompleted ?? true,
            isQuizCompleted: parsed.isQuizCompleted ?? true,
            quizScore: parsed.quizScore || 0,
            speakingScores: parsed.speakingScores || [],
            listeningScore: parsed.listeningScore || 0,
            resultSubmitted: parsed.resultSubmitted ?? false,
          }
        }

        setState({
          ...defaultState,
          ...parsed,
          completedLessons: completed,
          lessonRecords: records,
        })
      } catch {
        localStorage.removeItem("peraperago-learning-state")
      }
    }
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("peraperago-learning-state", JSON.stringify(state))
    }
  }, [state, isHydrated])

  const setStudentName = (name: string) => setState((prev) => ({ ...prev, studentName: name }))
  const setKelas = (kelas: string) => setState((prev) => ({ ...prev, kelas }))
  const setLessonProgress = (progress: number) => setState((prev) => ({ ...prev, lessonProgress: progress }))
  const setCurrentLessonStep = (step: number) => setState((prev) => ({ ...prev, currentLessonStep: step }))
  const setListeningScore = (score: number) => setState((prev) => ({ ...prev, listeningScore: score }))
  const setSpeakingScore = (score: number) => setState((prev) => ({ ...prev, speakingScore: score }))
  const addSpeakingScore = (score: number) => setState((prev) => ({ ...prev, speakingScores: [...prev.speakingScores, score] }))
  const setQuizScore = (score: number) => setState((prev) => ({ ...prev, quizScore: score }))
  const setIsLessonCompleted = (completed: boolean) => setState((prev) => ({ ...prev, isLessonCompleted: completed }))
  const setIsListeningCompleted = (completed: boolean) => setState((prev) => ({ ...prev, isListeningCompleted: completed }))
  const setIsSpeakingCompleted = (completed: boolean) => setState((prev) => ({ ...prev, isSpeakingCompleted: completed }))
  const setIsQuizCompleted = (completed: boolean) => setState((prev) => ({ ...prev, isQuizCompleted: completed }))
  const setResultSubmitted = (submitted: boolean) => setState((prev) => ({ ...prev, resultSubmitted: submitted }))

  const isLessonUnlocked = (lessonId: string) => {
    return checkIsLessonUnlocked(lessonId, state.completedLessons)
  }

  const completeLesson = (lessonId: string) => {
    setState((prev) => {
      const updatedCompleted = prev.completedLessons.includes(lessonId)
        ? prev.completedLessons
        : [...prev.completedLessons, lessonId]

      const existingRecord = prev.lessonRecords[lessonId] || { ...defaultLessonRecord }
      const updatedRecords = {
        ...prev.lessonRecords,
        [lessonId]: {
          ...existingRecord,
          isLessonCompleted: true,
          isQuizCompleted: true,
        },
      }

      return {
        ...prev,
        completedLessons: updatedCompleted,
        lessonRecords: updatedRecords,
        isLessonCompleted: true,
        isQuizCompleted: true,
      }
    })
  }

  const getLessonRecord = (lessonId: string): LessonRecord => {
    return state.lessonRecords[lessonId] || { ...defaultLessonRecord }
  }

  const updateLessonRecord = (lessonId: string, updates: Partial<LessonRecord>) => {
    setState((prev) => {
      const existing = prev.lessonRecords[lessonId] || { ...defaultLessonRecord }
      const updated = { ...existing, ...updates }
      return {
        ...prev,
        lessonRecords: {
          ...prev.lessonRecords,
          [lessonId]: updated,
        },
      }
    })
  }

  const resetLessonProgress = (lessonId: string) => {
    setState((prev) => {
      const newRecords = { ...prev.lessonRecords }
      delete newRecords[lessonId]
      return {
        ...prev,
        lessonRecords: newRecords,
      }
    })
  }

  const resetProgress = () => {
    setState((prev) => ({
      ...defaultState,
      studentName: prev.studentName,
      kelas: prev.kelas,
    }))
  }

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-foreground/20 border-t-foreground/60 animate-spin" />
      </div>
    )
  }

  return (
    <LearningContext.Provider
      value={{
        ...state,
        setStudentName,
        setKelas,
        setLessonProgress,
        setCurrentLessonStep,
        setListeningScore,
        setSpeakingScore,
        addSpeakingScore,
        setQuizScore,
        setIsLessonCompleted,
        setIsListeningCompleted,
        setIsSpeakingCompleted,
        setIsQuizCompleted,
        setResultSubmitted,
        resetProgress,
        isLessonUnlocked,
        completeLesson,
        getLessonRecord,
        updateLessonRecord,
        resetLessonProgress,
      }}
    >
      {children}
    </LearningContext.Provider>
  )
}

export function useLearning() {
  const context = useContext(LearningContext)
  if (context === undefined) {
    throw new Error("useLearning must be used within a LearningProvider")
  }
  return context
}
