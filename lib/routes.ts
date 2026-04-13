export const ROUTES = {
	HOME: '/',
	ACCESS_CODE: '/access-code',
	SIGNIN: '/signin',
	SIGNUP: '/signup',
	// Динамические пути
	USER_DETAILS: (id: string | number) => `/user/${id}`
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
