import React from 'react'

import { StyleSheet, Text, View, ViewStyle } from 'react-native'

import { colors, spacing, typography } from '@/core/constants/theme'

interface AppStatusMessageProps {
	message: string | null | undefined
	type?: 'error' | 'success'
	containerStyle?: ViewStyle | ViewStyle[]
}

export function AppStatusMessage({ message, type = 'error', containerStyle }: AppStatusMessageProps) {
	// Если сообщения нет, возвращаем пустой контейнер с минимальной высотой
	if (!message) return <View style={[styles.emptyStub, containerStyle]} />

	return (
		<View style={[styles.container, containerStyle]}>
			<Text style={[styles.text, type === 'success' ? styles.textSuccess : styles.textError]}>{message}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	emptyStub: {
		minHeight: spacing(6)
	},
	container: {
		minHeight: spacing(6),
		marginBottom: spacing(3),
		paddingHorizontal: spacing(4),
		justifyContent: 'center',
		alignItems: 'center',

		paddingVertical: spacing(1)
	},
	text: {
		...typography.l3,
		textAlign: 'center',
		flexShrink: 1
	},
	textSuccess: {
		color: colors.appSuccess
	},
	textError: {
		color: colors.appError
	}
})
