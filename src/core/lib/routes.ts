export const ROUTES = {
	INTRO: '/intro',
	ACCESS_CODE: '/access-code',
	SIGNIN: '/signin',
	SIGNUP: '/signup',
	PROFILE_FILL:'/profile-fill',
	HOME: '/',
	// Динамические пути
	USER_DETAILS: (id: string | number) => `/user/${id}`
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
