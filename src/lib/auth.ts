import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql", // or "mysql", "postgresql", ...etc
	}),
	emailAndPassword: {
		enabled: true,
	},
	user: {
		additionalFields: {
			role: {
				type: "string",
				input: false, // users cannot set this themselves
				defaultValue: "customer",
			},
			emailVerified: {
				type: "boolean",
				input: false, // controlled by server, not the client
				defaultValue: false,
			},
			image: {
				type: "string",
				input: true, // optional, can be set during signup
			},
		},
	},
});