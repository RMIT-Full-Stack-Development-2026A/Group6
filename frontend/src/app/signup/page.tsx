import React from "react";
import SignupForm from "@/components/auth/signupForm";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <SignupForm redirectTo="/login" />
      </div>
    </div>
  );
}