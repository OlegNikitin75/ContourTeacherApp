import { colors, spacing, typography } from '@/core/constants/theme'
import React from 'react'
import { Text, View, StyleSheet, ViewStyle } from 'react-native'

interface AppStatusMessageProps {
	message: string | null | undefined
	type?: 'error' | 'success'
	containerStyle?: ViewStyle | ViewStyle[] 
}

export function AppStatusMessage({ 
	message, 
	type = 'error', 
	containerStyle 
}: AppStatusMessageProps) {
	
	if (!message) return <View style={styles.emptyStub} /> 

	return (
		<View style={[styles.container, containerStyle]}>
			<Text
				style={[
					styles.text,
					type === 'success' ? styles.textSuccess : styles.textError
				]}
			>
				{message}
			</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	emptyStub: {
		height: spacing(6),
	},
	container: {
		height: spacing(6), 
		marginBottom: spacing(3), 
		paddingHorizontal: spacing(4), 
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		...typography.l3,
		textAlign: 'center',
	},
	textSuccess: {
		color: colors.appSuccess,
	},
	textError: {
		color: colors.appError,
	},
})
