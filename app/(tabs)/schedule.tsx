import React from 'react'

import { StyleSheet, Text, View } from 'react-native'

import { colors, typography } from '@/core/constants/theme'

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
		backgroundColor: colors.appLightGray
	},
	title: {
		...typography.h2,
		color: colors.appAccent
	}
})
