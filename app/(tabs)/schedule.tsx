import { colors, typography } from '@/core/constants/theme'
import React from 'react'
import { Text, View, StyleSheet } from 'react-native'

export default function Schedule() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>schedule</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: colors.appLightGray,
	},
	title: {
		...typography.h2,
		color: colors.appAccent,
	},
})
