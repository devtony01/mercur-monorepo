"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { LoginForm, RegisterForm } from "@components/molecules"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const searchParams = useSearchParams()
  const [currentView, setCurrentView] = useState("sign-in")

  useEffect(() => {
    const view = searchParams.get("view")
    if (view === "register") {
      setCurrentView("register")
    } else {
      setCurrentView("sign-in")
    }
  }, [searchParams])

  return (
    <div className="w-full">
      {currentView === "sign-in" ? (
        <LoginForm />
      ) : (
        <RegisterForm />
      )}
    </div>
  )
}

export default LoginTemplate
