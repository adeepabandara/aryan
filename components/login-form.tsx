"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    console.log("Submitting login with:", email)

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password: password,
        redirect: false,
      })

      console.log("SignIn result:", JSON.stringify(result, null, 2))

      if (result?.error) {
        console.error("SignIn error:", result.error)
        setError(`Login failed: ${result.error}`)
        setIsLoading(false)
        return
      }

      if (result?.ok) {
        console.log("Login successful, redirecting...")
        // Get the callback URL from query params
        let callbackUrl = searchParams.get("callbackUrl")
        
        // Filter out invalid callback URLs (error pages, auth endpoints)
        if (!callbackUrl || 
            callbackUrl.includes('/api/auth/error') || 
            callbackUrl.includes('/api/auth/') ||
            callbackUrl === '/login') {
          callbackUrl = "/dashboard"
        }
        
        console.log("Redirecting to:", callbackUrl)
        // Use router.push for better Next.js integration
        router.push(callbackUrl)
        router.refresh()
      } else {
        console.error("Login failed with result:", result)
        setError("Authentication failed. Please try again.")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("SignIn exception:", error)
      setError(`An error occurred: ${error}`)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-11"
            disabled={isLoading}
          />
        </div>
      </div>
      <Button type="submit" className="w-full h-11" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  )
}
