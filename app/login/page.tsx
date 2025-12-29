import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="flex flex-col items-center space-y-6">
          <Image
            src="/images/logo.jpg"
            alt="Aryan Products"
            width={280}
            height={100}
            className="h-auto w-64"
            priority
          />
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome Back</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to access your billing dashboard</p>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
