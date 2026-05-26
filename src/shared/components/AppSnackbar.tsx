import { colors, spacing, corner, typography } from '@/core/constants/theme'
import React, { useEffect, useRef } from 'react'
import { Animated, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface AppSnackbarProps {
	visible: boolean
	message: string
	actionLabel?: string
	onActionPress?: () => void
	duration?: number
	onDismiss: () => void
}

export default function AppSnackbar({
	visible,
	message,
	actionLabel = 'отмена',
	onActionPress,
	duration = 4000,
	onDismiss
}: AppSnackbarProps) {
	const fadeAnim = useRef(new Animated.Value(0)).current

	useEffect(() => {
		if (visible) {
			// Показываем Snackbar
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true
			}).start()

			// Скрываем по истечении времени
			const timer = setTimeout(() => {
				hide()
			}, duration)

			return () => clearTimeout(timer)
		} else {
			hide()
		}
	}, [visible])

	const hide = () => {
		Animated.timing(fadeAnim, {
			toValue: 0,
			duration: 250,
			useNativeDriver: true
		}).start(() => onDismiss())
	}

	if (!visible) return null

	return (
		<Animated.View
			style={[styles.snackbar, { opacity: fadeAnim }]}
		>
			<Text style={styles.messageText}>
				{message}
			</Text>
			{onActionPress && (
				<TouchableOpacity onPress={onActionPress} activeOpacity={0.7}>
					<Text style={styles.actionText}>
						{actionLabel}
					</Text>
				</TouchableOpacity>
			)}
		</Animated.View>
	)
}

const styles = StyleSheet.create({
	snackbar: {
		position: 'absolute',
		bottom: spacing(6),
		left: spacing(4), 
		right: spacing(4), 
		backgroundColor: colors.appDarkGray,
		borderRadius: corner(2), 
		padding: spacing(4), 
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		zIndex: 50, 
		
		// Нативная тень для iOS (shadow-lg)
		shadowColor: colors.appBlack,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 4.65,
		// Тень для Android
		elevation: 8,
	},
	messageText: {
		...typography.t2, 
		color: colors.appWhite, 
		flex: 1,
		marginRight: spacing(2),
	},
	actionText: {
		...typography.l2, 
		color: colors.appError, 
		letterSpacing: 14 * 0.05,
		textTransform: 'uppercase'
	},
})
