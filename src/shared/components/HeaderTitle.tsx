import { colors, spacing, typography } from '@/core/constants/theme'
import React from 'react'
import { Text, View, StyleSheet } from 'react-native'

interface HeaderTitleProps {
	firstItemTitle: string
	secondItemTitle: string
}

export default function HeaderTitle({ firstItemTitle, secondItemTitle }: HeaderTitleProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.textBlack}>{firstItemTitle}</Text>
			<Text style={styles.textBlack}>|</Text>
			<Text style={styles.textAccent}>{secondItemTitle}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: spacing(1),
		paddingVertical: spacing(4),
	},
	textBlack: {
		...typography.h3,
		color: colors.appBlack,
	},
	textAccent: {
		...typography.h3,
		color: colors.appAccent, 
	},
})
