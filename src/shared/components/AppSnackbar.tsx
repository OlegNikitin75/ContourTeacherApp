import React, { useEffect, useRef } from 'react'
import { Animated, Text, TouchableOpacity, View } from 'react-native'

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
	actionLabel = 'ОТМЕНА',
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
			style={{ opacity: fadeAnim }}
			className='absolute bottom-6 left-4 right-4 bg-zinc-900 rounded-lg p-4 flex-row items-center justify-between shadow-lg z-50'
		>
			<Text className='text-white font-medium text-sm flex-1 mr-2'>
				{message}
			</Text>
			{onActionPress && (
				<TouchableOpacity onPress={onActionPress}>
					<Text className='text-red-400 font-bold text-sm tracking-wider uppercase'>
						{actionLabel}
					</Text>
				</TouchableOpacity>
			)}
		</Animated.View>
	)
}
