export const colors = {
	appBlack: '#150D0B',
	appLightGray: '#EAEAEA',
	appGray: '#838383',
	appDarkGray: '#3F3F3F',
	appWhite: '#FFFFFF',
	appAccent: '#998FFB',
	appSuccess: '#366C52',
	appError: '#C93C3D',
	appWarning: '#F8B32f'
} as const

export const spacing = {
	0: 0,
	1: 4,
	2: 8,
	3: 12,
	4: 16,
	5: 20,
	6: 24,
	7: 28,
	8: 32,
	9: 36,
	10: 40,
	11: 44,
	12: 48,
	14: 56,
	16: 64,
	18: 72,
	20: 80,
	24: 96,
	30: 120
} as const

export const corner = {
	2: 8,
	6: 24,
	12: 48,
	25: 100
} as const

export const components = {
	tabBar: {
		height: spacing[16],
		radius: corner[12],
		
		horizontalInset: spacing[5],
		iconFrame: spacing[12],
		itemPaddingVertical: spacing[2]
	}
} as const

export const theme = {
	colors,
	spacing,
	components,
	corner
} as const
