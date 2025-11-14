import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// List of protected routes
const protectedPaths = ["/dashboard", "/profile-dashboard", "/orders"];

// Get userId from server session
const getUserId = async () => {
	"use server";
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return session?.user?.id;
};

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Skip unprotected paths
	const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
	if (!isProtected) {
		return NextResponse.next();
	}

	// Get session cookie
	const sessionCookie = getSessionCookie(request);
	if (!sessionCookie) {
		// console.log("No session cookie found, redirecting to /signin");
		return NextResponse.redirect(new URL("/signin", request.url));
	}

	const token = sessionCookie.split('.')[0];

	// Get the userId from the server session
	const userId = await getUserId();
	if (!userId) {
		console.log("No userId found in session, redirecting to /signin");
		return NextResponse.redirect(new URL("/signin", request.url));
	}

	// Call your POST /api/verify-session endpoint with token + userId
	const verifyRes = await fetch(`${request.nextUrl.origin}/api/auth/verify-session`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ token: token, userId }),
	});

	if (!verifyRes.ok) {
		return NextResponse.redirect(new URL("/signin", request.url));
	}

	const data = await verifyRes.json();

	if (!data.valid) {
		// console.log("Invalid session, redirecting to /signin");
		return NextResponse.redirect(new URL("/signin", request.url));
	}

	// Session is valid → continue
	return NextResponse.next();
}
