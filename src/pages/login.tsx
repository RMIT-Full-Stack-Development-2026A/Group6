import LoginForm from "@/components/auth/loginForm"

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl items-center justify-center">
        <div className="w-full space-y-10">
          
          <section className="mx-auto max-w-xl text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-emerald-600">Welcome back</p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900">Login page</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Enter your email and password to access your dashboard.
            </p>
          </section>

          <LoginForm redirectTo="/home" />
        </div>
      </div>
    </main>
  )
}
