// @/shared/components/AppSnackbar.tsx
import { colors, spacing, corner, typography } from '@/core/constants/theme'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface AppSnackbarProps {
	visible: boolean
	message: string // Можно использовать маркер %seconds% для обратного отсчета
	actionLabel?: string
	onActionPress?: () => void
	duration?: number // Общее время в миллисекундах (например, 4000)
	onDismiss: () => void
}

export default function AppSnackbar({
	visible,
	message,
	actionLabel = 'ОТМЕНА',
	onActionPress,
	duration = 4000,
	onDismiss
}: AppSnackbarProps) {
	const fadeAnim = useRef(new Animated.Value(0)).current
	
	// Локальный стейт для секунд. Переводим миллисекунды в секунды (4000 -> 4)
	const [localCountdown, setLocalCountdown] = useState(Math.ceil(duration / 1000))
	const intervalTimer = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		if (visible) {
			// 1. Сбрасываем счетчик на исходное значение при каждом показе
			setLocalCountdown(Math.ceil(duration / 1000))

			// 2. Анимация появления
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true
			}).start()

			// 3. Запускаем тиканье секунд
			intervalTimer.current = setInterval(() => {
				setLocalCountdown(prev => (prev > 1 ? prev - 1 : 1))
			}, 1000)

			// 4. Таймер закрытия плашки
			const timer = setTimeout(() => {
				hide()
			}, duration)

			return () => {
				clearTimeout(timer)
				if (intervalTimer.current) clearInterval(intervalTimer.current)
			}
		} else {
			hide()
		}
	}, [visible, duration])

	const hide = () => {
		if (intervalTimer.current) clearInterval(intervalTimer.current)
		Animated.timing(fadeAnim, {
			toValue: 0,
			duration: 250,
			useNativeDriver: true
		}).start(() => onDismiss())
	}

	if (!visible) return null

	// Если в тексте есть маркер %seconds%, заменяем его на живую цифру
	const formattedMessage = message.replace('%seconds%', String(localCountdown))

	return (
		<Animated.View style={[styles.snackbar, { opacity: fadeAnim }]}>
			<Text style={styles.messageText}>
				{formattedMessage}
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
		shadowColor: colors.appBlack,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 4.65,
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
		textTransform: 'uppercase',
	},
})
