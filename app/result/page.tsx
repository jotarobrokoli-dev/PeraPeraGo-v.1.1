// Legacy redirect: /result → /lesson/jikoshoukai/result
import { redirect } from "next/navigation"
export default function ResultRedirect() {
  redirect("/lesson/jikoshoukai/result")
}
