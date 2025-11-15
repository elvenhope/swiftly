import { NextRequest, NextResponse } from "next/server";
import { signUp } from "@/lib/auth-client";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Use the emailAndPassword provider
    const user = await signUp.email({
      email,
      password,
      name,
	  role: "customer"
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err: unknown) {
    let message = "Signup failed";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
