import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Define routes with optional role requirements
const protectedRoutes: { path: string; role?: string }[] = [
	{ path: "/dashboard" },
	{ path: "/orders" },
	{ path: "/cart"},
	{ path: "/admin", role: "admin" }, // all /admin/* require admin role
];

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Find the first route that matches the pathname
	const matchedRoute = protectedRoutes.find(route => pathname.startsWith(route.path));

	// If no protected route matches, continue
	if (!matchedRoute) return NextResponse.next();

	// Get session cookie
	const sessionCookie = getSessionCookie(request);
	if (!sessionCookie) {
		return NextResponse.redirect(new URL("/signin", request.url));
	}

	const token = sessionCookie.split('.')[0];

	// Get userId from server session
	const userId = await (async () => {
		"use server";
		const session = await auth.api.getSession({
			headers: await headers(),
		});
		return session?.user?.id;
	})();

	if (!userId) return NextResponse.redirect(new URL("/signin", request.url));

	// Verify session via API
	const verifyRes = await fetch(`${request.nextUrl.origin}/api/auth/verify-session`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ token, userId }),
	});

	if (!verifyRes.ok) return NextResponse.redirect(new URL("/signin", request.url));

	const data = await verifyRes.json();

	if (!data.valid) return NextResponse.redirect(new URL("/signin", request.url));

	// Check if the route requires a specific role
	if (matchedRoute.role && data.user.role !== matchedRoute.role) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	// Session valid → allow request
	return NextResponse.next();
}
