// Legacy redirect: /quiz → /lesson/jikoshoukai/quiz
import { redirect } from "next/navigation"
export default function QuizRedirect() {
  redirect("/lesson/jikoshoukai/quiz")
}
