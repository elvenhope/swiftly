import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { equal } from "assert";

export async function POST(request: Request) {
	try {
		const { token, userId }: {token: string, userId: string} = await request.json();

		if (!token || !userId) {
			return NextResponse.json({ valid: false }, { status: 400 });
		}

		const session = await prisma.session.findFirst({
			where: {
				token: token,  // replace with the token you want to find
			},
			include: {
				user: true, // if you want the related user
			},
		});


		if (!session || !session.user) {
			return NextResponse.json({ valid: false }, { status: 401 });
		}

		return NextResponse.json({
			valid: true,
			user: {
				id: session.user.id,
				email: session.user.email,
				role: session.user.role,
			},
		});
	} catch (e) {
		console.error("Error verifying session:", e);
		return NextResponse.json({ valid: false }, { status: 500 });
	}
}
