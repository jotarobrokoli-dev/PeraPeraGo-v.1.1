// Legacy redirect: /lesson → /lesson/jikoshoukai
import { redirect } from "next/navigation"
export default function LessonRedirect() {
  redirect("/lesson/jikoshoukai")
}
