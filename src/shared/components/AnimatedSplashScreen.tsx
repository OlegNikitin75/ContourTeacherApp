import { useEffect } from 'react'

import { StyleSheet, View } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated'

import { colors, spacing, typography } from '@/core/constants/theme'

interface AnimatedSplashScreenProps {
	onFinish: () => void
}

export default function AnimatedSplashScreen({ onFinish }: AnimatedSplashScreenProps) {
	// Анимируем ширину раскрытия текста от 0% до 100%
	const widthProgress = useSharedValue(0)
	const opacity = useSharedValue(0)

	useEffect(() => {
		// Сброс состояния
		widthProgress.value = 0
		opacity.value = 0

		// Плавное появление линий и текста
		opacity.value = withTiming(1, { duration: 400 })

		// Раскрытие текста из-за разделителя
		widthProgress.value = withDelay(
			200,
			withTiming(1, {
				duration: 1200,
				easing: Easing.out(Easing.exp)
			})
		)

		// Время показа экрана (увеличено до 2.5 секунд, чтобы успеть рассмотреть)
		const timer = setTimeout(() => {
			onFinish()
		}, 2500)

		return () => clearTimeout(timer)
	}, [onFinish])

	// Анимация раскрытия для левой стороны
	const leftSideStyle = useAnimatedStyle(() => ({
		// Текст будет плавно появляться из-за шторки, не переносясь на две строки
		maxWidth: withTiming(widthProgress.value * 200, { duration: 0 }), 
		opacity: opacity.value
	}))

	// Анимация раскрытия для правой стороны
	const rightSideStyle = useAnimatedStyle(() => ({
		maxWidth: withTiming(widthProgress.value * 200, { duration: 0 }),
		opacity: opacity.value
	}))

	const dividerStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
		transform: [{ scaleY: opacity.value }]
	}))

	return (
		<View style={styles.container}>
			<View style={styles.containerText}>
				{/* Используем Animated.View для контейнеров, чтобы управлять их шириной */}
				<Animated.View style={[styles.leftSide, leftSideStyle]}>
					<Animated.Text numberOfLines={1} style={styles.textLeft}>контур</Animated.Text>
				</Animated.View>
				
				<Animated.View style={[styles.divider, dividerStyle]} />
				
				<Animated.View style={[styles.rightSide, rightSideStyle]}>
					<Animated.Text numberOfLines={1} style={styles.textRight}>графика</Animated.Text>
				</Animated.View>
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
		padding: spacing(5)
	},
	containerText: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: spacing(10)
	},
	leftSide: {
		overflow: 'hidden',
		alignItems: 'flex-end',
		// Заменили жесткий spacing(28) на динамический отступ
		marginRight: spacing(2.5) 
	},
	rightSide: {
		overflow: 'hidden',
		alignItems: 'flex-start',
		marginLeft: spacing(2.5)
	},
	divider: {
		width: 2.5,
		height: spacing(8),
		backgroundColor: colors.appBlack,
		borderRadius: 999
	},
	textLeft: {
		...typography.h2,
		color: colors.appBlack,
		// Запрещаем перенос слов в компоненте
		flexWrap: 'nowrap' 
	},
	textRight: {
		...typography.h2,
		color: colors.appAccent,
		flexWrap: 'nowrap'
	}
})
