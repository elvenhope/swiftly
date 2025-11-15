"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { signUp } from "@/lib/auth-client"

interface SignUpForm {
    name: string
    email: string
    password: string
    repeatPassword: string
}

// Yup validation schema
const schema = yup
    .object({
        name: yup.string().required("Name is required"),
        email: yup
            .string()
            .email("Invalid email")
            .required("Email is required"),
        password: yup
            .string()
            .min(8, "Password must be at least 8 characters")
            .required("Password is required"),
        repeatPassword: yup
            .string()
            .oneOf([yup.ref("password")], "Passwords must match")
            .required("Repeat your password"),
    })
    .required()

export default function SignUpPage() {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpForm>({
        resolver: yupResolver(schema),
    })

    const onSubmit = async (data: SignUpForm) => {
        try {
            const { data: userData, error } = await signUp.email(
                {
                    email: data.email,
                    password: data.password,
                    name: data.name,
					role: "customer",
                    callbackURL: "/", // fallback, redirect handled below
                },
                {
                    onRequest: () => {},
                    onSuccess: () => { router.push("/") },
                    onError: (ctx) => alert(ctx.error.message),
                }
            )

            if (error) {
                alert(error.message)
                return
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
                <h1 className="text-(--color-sunglow) text-2xl font-bold mb-6 text-center">
                    Sign Up
                </h1>

                <label className="block mb-4">
                    <span className="text-(--color-sunglow)">Name</span>
                    <input
                        {...register("name")}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sunglow focus:outline-none focus:ring-2 focus:ring-english-violet"
                    />
                    {errors.name && (
                        <p className="text-red-crayola">
                            {errors.name.message}
                        </p>
                    )}
                </label>

                <label className="block mb-4">
                    <span className="text-(--color-sunglow)">Email</span>
                    <input
                        type="email"
                        {...register("email")}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sunglow focus:outline-none focus:ring-2 focus:ring-english-violet"
                    />
                    {errors.email && (
                        <p className="text-red-crayola">
                            {errors.email.message}
                        </p>
                    )}
                </label>

                <label className="block mb-4">
                    <span className="text-(--color-sunglow)">Password</span>
                    <input
                        type="password"
                        {...register("password")}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sunglow focus:outline-none focus:ring-2 focus:ring-english-violet"
                    />
                    {errors.password && (
                        <p className="text-red-crayola">
                            {errors.password.message}
                        </p>
                    )}
                </label>

                <label className="block mb-6">
                    <span className="text-(--color-sunglow)">
                        Repeat Password
                    </span>
                    <input
                        type="password"
                        {...register("repeatPassword")}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sunglow focus:outline-none focus:ring-2 focus:ring-english-violet"
                    />
                    {errors.repeatPassword && (
                        <p className="text-red-crayola">
                            {errors.repeatPassword.message}
                        </p>
                    )}
                </label>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-english-violet text-(--color-sunglow) py-2 rounded-md font-semibold hover:bg-dark-purple transition-colors"
                >
                    {isSubmitting ? "Signing up..." : "Sign Up"}
                </button>
            </form>
        </div>
    )
}
