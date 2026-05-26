import { colors, spacing, typography } from '@/core/constants/theme'
import { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, withDelay } from 'react-native-reanimated'

interface AnimatedSplashScreenProps {
	onFinish: () => void
}

export default function AnimatedSplashScreen({ onFinish }: AnimatedSplashScreenProps) {
	const textTranslate = useSharedValue(100)
	const opacity = useSharedValue(0)

	useEffect(() => {
		textTranslate.value = withTiming(0, { 
			duration: 2000, 
			easing: Easing.out(Easing.exp) 
		})
		
		opacity.value = withDelay(100, withTiming(1, { 
			duration: 800 
		}))

		const timer = setTimeout(onFinish, 2000)
		return () => clearTimeout(timer)
	}, [])

	const leftTextStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: -textTranslate.value }],
		opacity: opacity.value
	}))

	const rightTextStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: textTranslate.value }],
		opacity: opacity.value
	}))

	return (
		<View style={styles.container}>
			<View style={styles.containerText}>
				<View style={styles.leftSide}>
					<Animated.Text style={[styles.textLeft, leftTextStyle]}>
						контур
					</Animated.Text>
				</View>
				<View style={styles.divider} />
				<View style={styles.rightSide}>
					<Animated.Text style={[styles.textRight, rightTextStyle]}>
						графика
					</Animated.Text>
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.appLightGray,
		alignItems: 'center',
		justifyContent: 'center',
		padding: spacing(5),
	},
	containerText: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	leftSide: {
		overflow: 'hidden',
		width: spacing(28),
		alignItems: 'flex-end',
		paddingRight: spacing(2.5), 
	},
	rightSide: {
		overflow: 'hidden',
		width: spacing(28), 
		alignItems: 'flex-start',
		paddingLeft: spacing(2.5),
	},
	divider: {
		width: 2.5,
		height: spacing(8), 
		backgroundColor: colors.appBlack,
		borderRadius: 999, 
	},
	textLeft: {
		...typography.h2,
		color: colors.appBlack,
	},
	textRight: {
		...typography.h2,
		color: colors.appAccent,
	}
})
