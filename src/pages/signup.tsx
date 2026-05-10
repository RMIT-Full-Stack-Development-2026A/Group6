import SignupForm from "@/components/auth/signupForm"

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
        <div className="w-full space-y-10">
          
          <section className="mx-auto max-w-xl text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-emerald-600">Create your account</p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900">Signup</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Enter your details to get started with access to your dashboard.
            </p>
          </section>

          <SignupForm redirectTo="/" />
        </div>
      </div>
    </main>
  )
}
