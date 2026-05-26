import { Link } from 'expo-router'
import React from 'react'
import { Text, View, StyleSheet } from 'react-native'

import { colors, spacing, typography } from '@/core/constants/theme'
import { ROUTES } from '@/core/lib/routes'
import AppButton from '@/shared/components/AppButton'

export default function App() {
	return (
		<View style={styles.container}>
			<Link href={ROUTES.PROFILE} asChild>
				<AppButton title={'профиль'} style={styles.button} />
			</Link>
			<Text style={styles.title}>welcome to contour!</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.appLightGray,
		paddingHorizontal: spacing(4),
	},
	button: {
		marginBottom: spacing(4)
	},
	title: {
		...typography.h2,
		color: colors.appAccent,
	},
})
