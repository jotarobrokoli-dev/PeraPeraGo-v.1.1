"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface LearningState {
  studentName: string
  kelas: string
  lessonProgress: number
  currentLessonStep: number
  listeningScore: number
  speakingScore: number
  speakingScores: number[]   // individual speaking scores from quiz
  quizScore: number
  isLessonCompleted: boolean
  isListeningCompleted: boolean
  isSpeakingCompleted: boolean
  isQuizCompleted: boolean
  resultSubmitted: boolean   // guards against duplicate sheet submissions
}

interface LearningContextType extends LearningState {
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
}

const defaultState: LearningState = {
  studentName: "",
  kelas: "",
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

const LearningContext = createContext<LearningContextType | undefined>(undefined)

export function LearningProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LearningState>(defaultState)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("peraperago-learning-state")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Merge with defaultState so any new fields added in future
        // versions don't cause undefined errors on old saved data
        setState({ ...defaultState, ...parsed })
      } catch {
        // Corrupt data — start fresh
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
