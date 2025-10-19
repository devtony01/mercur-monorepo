"use client"
import {
  FieldError,
  FieldValues,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form"
import { Button } from "@components/atoms"
import { zodResolver } from "@hookform/resolvers/zod"
import LocalizedClientLink from "@components/molecules/LocalizedLink/LocalizedLink"
import { LabeledInput } from "@components/cells"
import { GoogleLoginButton } from "@components/molecules/GoogleLoginButton/GoogleLoginButton"
import { loginFormSchema, LoginFormData } from "./schema"
import { useState } from "react"
import { login } from "@lib/data/customer"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"

export const LoginForm = () => {
  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  return (
    <FormProvider {...methods}>
      <Form />
    </FormProvider>
  )
}

const Form = () => {
  const [error, setError] = useState("")
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useFormContext()
  const router = useRouter()
  const { countryCode } = useParams()

  const submit = async (data: FieldValues) => {
    const formData = new FormData()
    formData.append("email", data.email)
    formData.append("password", data.password)

    const res = await login(formData)
    if (res) {
      setError(res)
      return
    }
    setError("")
    router.push(`/${countryCode}/account`)
  }

  return (
    <main className="container">
      <h1 className="heading-xl text-center uppercase my-6">
        Log in to your account
      </h1>
      <div className="w-96 max-w-full mx-auto space-y-6">
        {/* Google Login */}
        <div className="space-y-4">
          <GoogleLoginButton />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>
        </div>

        {/* Email/Password Login */}
        <form onSubmit={handleSubmit(submit)}>
          <div className="space-y-4">
            <LabeledInput
              label="E-mail"
              placeholder="Your e-mail address"
              error={errors.email as FieldError}
              {...register("email")}
            />
            <LabeledInput
              label="Password"
              placeholder="Your password"
              type="password"
              error={errors.password as FieldError}
              {...register("password")}
            />
            {error && <p className="label-md text-negative">{error}</p>}
            <Button className="w-full" disabled={isSubmitting}>
              Log in
            </Button>
            <p className="text-center label-md">
              Don&apos;t have an account yet?{" "}
              <button 
                type="button"
                onClick={() => router.push(`/${countryCode}/account?view=register`)}
                className="underline text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              >
                Sign up!
              </button>
            </p>
          </div>
        </form>
      </div>
    </main>
  )
}