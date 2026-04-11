export const ROUTES = {
	HOME: '/',
	SIGNIN: '/signin',
	SIGNUP: '/signup',
	// Динамические пути
	USER_DETAILS: (id: string | number) => `/user/${id}`
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
