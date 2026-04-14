import { useEffect } from 'react'
import { View } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, withDelay } from 'react-native-reanimated'

interface AnimatedSplashScreenProps {
	onFinish: () => void
}

export default function AnimatedSplashScreen({ onFinish }: AnimatedSplashScreenProps) {
	const textTranslate = useSharedValue(60)
	const opacity = useSharedValue(0)

	useEffect(() => {
		textTranslate.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.exp) })
		opacity.value = withDelay(100, withTiming(1, { duration: 500 }))

		const timer = setTimeout(() => {
			onFinish()
		}, 2000)

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
		<View className='flex-1 justify-center items-center bg-app-light-gray'>
			<View className='flex-row items-center'>
				<View className='overflow-hidden'>
					<Animated.Text style={leftTextStyle} className='text-h2 text-black'>
						контур
					</Animated.Text>
				</View>
				<View className='w-[2.5px] h-8 bg-black rounded-full mx-2.5' />
				<View className='overflow-hidden'>
					<Animated.Text style={rightTextStyle} className='text-h2 text-black'>
						препод
					</Animated.Text>
				</View>
			</View>
		</View>
	)
}
