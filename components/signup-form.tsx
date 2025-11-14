"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { createClient } from "@/utils/supabase/client"

export function SignUp({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("Les mots de passe ne sont pas identiques")
      setLoading(false)
      return
    }

    const supabase = createClient()

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          display_name: email.split("@")[0],
        },
      },
    })

    if (error) {
      console.error("Signup error:", error)
      setError(error.message)
      setLoading(false)
      return
    }

    // Vérifier si l'email doit être confirmé
    if (data?.user && !data.session) {
      setError(
        "Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte. (En mode local, vous pouvez vous connecter directement)",
      )
      setLoading(false)
      // En local, rediriger vers login après 3 secondes
      setTimeout(() => {
        router.push("/login")
      }, 3000)
      return
    }

    // Si session créée directement (email confirmé désactivé), rediriger
    if (data?.session) {
      const redirectTo = searchParams.get("redirectTo") || "/"
      router.push(redirectTo)
      router.refresh()
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Sign up </CardTitle>
          <CardDescription>
            Enter your email and confirm your password below to signup to the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              {error && <div className="text-sm text-red-500 mb-4">{error}</div>}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  disabled={loading}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input id="password" name="password" type="password" required disabled={loading} />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
                </div>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  disabled={loading}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Loading..." : "Login"}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
