export const ROUTES = {
	// Ведет на app/(onboarding)/index.tsx (бывший intro.tsx)
	INTRO: '/(onboarding)', 
	
	// Ведет на app/(onboarding)/access-code.tsx
	ACCESS_CODE: '/(onboarding)/access-code',
	
	// Ведет на app/(onboarding)/profile-fill.tsx
	PROFILE_FILL: '/(onboarding)/profile-fill',
	
	// Ведет на app/(profile)/index.tsx (бывший profile.tsx)
	PROFILE: '/(profile)', 
	
	HOME: '/(tabs)',
	
	// Динамические пути
	USER_DETAILS: (id: string | number) => `/user/${id}`
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]

