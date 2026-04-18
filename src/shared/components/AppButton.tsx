import { colors } from '@/core/constants/theme'
import { Href, useRouter } from 'expo-router'
import React from 'react'
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native'

interface AppButtonProps {
	title: string
	onPress?: () => void
	href?: Href
	isLoading?: boolean
	className?: string
	isDisabled?: boolean
}

export default function AppButton({
	title,
	onPress,
	href,
	isLoading = false,
	isDisabled,
	className = ''
}: AppButtonProps) {
	const router = useRouter()

	const handlePress = () => {
		if (isLoading) return

		if (href) {
			router.push(href)
		} else if (onPress) {
			onPress()
		}
	}
	return (
		<TouchableOpacity
			onPress={handlePress}
			disabled={isLoading && isDisabled}
			className={`w-full bg-app-black h-16 rounded-4xl items-center justify-center mb-4 active:opacity-70 ${isLoading ? 'opacity-60' : ''} ${className}`}
		>
			{isLoading ? (
				<ActivityIndicator color={colors.appLightGray} />
			) : (
				<Text className='text-app-white font-jetbrains-mono text-l1'>{title}</Text>
			)}
		</TouchableOpacity>
	)
}
