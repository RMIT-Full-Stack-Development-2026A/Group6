import SignupForm from "@/components/auth/signupForm"

export default function SignupPage() {
  return (
    <main>
      <h1>Signup</h1>
      <SignupForm redirectTo="/" />
    </main>
  )
}
