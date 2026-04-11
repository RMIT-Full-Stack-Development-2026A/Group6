import LoginForm from "@/components/auth/loginForm"

export default function LoginPage() {
  return (
    <main>
      <h1>Login page</h1>
      <LoginForm redirectTo="/" />
    </main>
  )
}
