import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

export const { signIn, signUp, signOut, useSession } = createAuthClient({
	baseURL: process.env.BETTER_AUTH_URL,
	plugins: [
		inferAdditionalFields({
			user: {
				role: {
					type: 'string',
					required: true
				}
			}
		})
	]
})