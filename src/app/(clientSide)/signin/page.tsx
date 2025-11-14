"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { signIn } from "@/lib/auth-client" // adjust path

interface SignInForm {
    email: string
    password: string
}

// Yup validation schema
const schema = yup
    .object({
        email: yup
            .string()
            .email("Invalid email address")
            .required("Email is required"),
        password: yup
            .string()
            .min(8, "Password must be at least 8 characters")
            .required("Password is required"),
    })
    .required()

export default function SignInPage() {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInForm>({
        resolver: yupResolver(schema),
    })

    const onSubmit = async (data: SignInForm) => {
        try {
            const res = await signIn.email({
                email: data.email,
                password: data.password,
				callbackURL: "/"
            })

            if (res.error) {
                alert(res.error.message || "Something went wrong.")
            } else {
                router.push("/dashboard")
            }
        } catch (err: unknown) {
            if (err instanceof Error) alert(err.message)
            else alert(String(err))
        }
    }

    return (
        <div className="h-screen flex items-center justify-center bg-(--color-background)">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-dark-purple p-8 rounded-xl shadow-lg w-full max-w-md"
            >
                <h1 className="text-sunglow text-2xl font-bold mb-6 text-center">
                    Sign In
                </h1>

                <label className="block mb-4">
                    <span className="text-sunglow">Email</span>
                    <input
                        type="email"
                        {...register("email")}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sunglow focus:outline-none focus:ring-2 focus:ring-english-violet"
                    />
                    {errors.email && (
                        <p className="text-red-crayola mt-1">
                            {errors.email.message}
                        </p>
                    )}
                </label>

                <label className="block mb-6">
                    <span className="text-sunglow">Password</span>
                    <input
                        type="password"
                        {...register("password")}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sunglow focus:outline-none focus:ring-2 focus:ring-english-violet"
                    />
                    {errors.password && (
                        <p className="text-red-crayola mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </label>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-english-violet text-sunglow py-2 rounded-md font-semibold hover:bg-dark-purple transition-colors"
                >
                    {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
            </form>
        </div>
    )
}
