"use client"

import { Suspense } from "react"
import { LoginForm } from "@/components/login-form"

export default function Page() {
  return (
    <div className="flex w-full mt-20 justify-center">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div>Chargement...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
