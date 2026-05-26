import { colors, spacing, corner, typography } from '@/core/constants/theme'
import { Href, useRouter } from 'expo-router'
import React from 'react'
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native'

interface AppButtonProps {
	title: string
	onPress?: () => void
	href?: Href
	isLoading?: boolean
	isDisabled?: boolean
	style?: ViewStyle | ViewStyle[] 
}

export default function AppButton({
	title,
	onPress,
	href,
	isLoading = false,
	isDisabled = false,
	style
}: AppButtonProps) {
	const router = useRouter()

	const handlePress = () => {
		if (isLoading || isDisabled) return

		if (href) {
			router.push(href)
		} else if (onPress) {
			onPress()
		}
	}

	const isButtonDisabled = isLoading || isDisabled

	return (
		<TouchableOpacity
			onPress={handlePress}
			activeOpacity={0.7}
			disabled={isButtonDisabled}
			style={[
				styles.button,
				isLoading && styles.loadingState,
				isDisabled && styles.disabledState,
				style
			]}
		>
			{isLoading ? (
				<ActivityIndicator color={colors.appLightGray} />
			) : (
				<Text style={styles.text}>{title}</Text>
			)}
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	button: {
		width: '100%',
		backgroundColor: colors.appBlack,
		height: spacing(14), 
		borderRadius: corner('full'),
		alignItems: 'center',
		justifyContent: 'center',
	},
	loadingState: {
		opacity: 0.6,
	},
	disabledState: {
		opacity: 0.4, 
	},
	text: {
		...typography.l1,
		color: colors.appWhite,
	},
})
