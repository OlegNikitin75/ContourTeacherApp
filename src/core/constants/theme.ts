// theme.ts

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

export const spacing = (multiplier: number) => multiplier * 4
export const corner = (multiplier: number | 'full') => multiplier === 'full' ? 999 : multiplier * 4


const baseText = {
	fontFamily: 'JetBrainsMono-Medium',
	fontWeight: '500' as const,
	textTransform: 'lowercase' as const,
}

export const typography = {
	h1: { ...baseText, fontSize: 30, lineHeight: 38, letterSpacing: 30 * -0.04 },
	h2: { ...baseText, fontSize: 28, lineHeight: 36, letterSpacing: 28 * -0.04 },
	h3: { ...baseText, fontSize: 24, lineHeight: 20, letterSpacing: 24 * -0.04 },
	h4: { ...baseText, fontSize: 16, lineHeight: 20, letterSpacing: 16 * -0.04 },
	
	// Для обычного текста меняем шрифт на Regular
	t1: { ...baseText, fontFamily: 'JetBrainsMono-Regular', fontWeight: '400' as const, fontSize: 16, lineHeight: 18, letterSpacing: 16 * -0.04 },
	t2: { ...baseText, fontFamily: 'JetBrainsMono-Regular', fontWeight: '400' as const, fontSize: 14, lineHeight: 16, letterSpacing: 14 * -0.04 },
	
	l1: { ...baseText, fontSize: 16, lineHeight: 16, letterSpacing: 16 * -0.04 },
	l2: { ...baseText, fontSize: 14, lineHeight: 18, letterSpacing: 14 * -0.04 },
	l3: { ...baseText, fontSize: 12, lineHeight: 18, letterSpacing: 12 * -0.04 },
}

export const theme = {
	colors,
	spacing,
	corner,
	typography,
} as const



