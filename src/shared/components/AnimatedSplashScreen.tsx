import { useEffect } from 'react'
import { View } from 'react-native'
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
		<View className='flex-1 justify-center items-center bg-app-light-gray'>
			<View className='flex-row items-center justify-center'>
				
				{/* ЛЕВАЯ СТОРОНА — КОНТУР */}
				<View className='overflow-hidden w-28 items-end pr-2.5'>
					<Animated.Text style={leftTextStyle} className='text-h2 text-app-black'>
						контур
					</Animated.Text>
				</View>

				{/* ВЕРТИКАЛЬНАЯ РАЗДЕЛИТЕЛЬНАЯ ПАЛОЧКА */}
				<View className='w-[2.5px] h-8 bg-app-black rounded-full' />

				{/* ПРАВАЯ СТОРОНА — ГРАФИКА */}
				<View className='overflow-hidden w-28 items-start pl-2.5'>
					<Animated.Text style={rightTextStyle} className='text-h2 text-app-accent'>
						графика
					</Animated.Text>
				</View>

			</View>
		</View>
	)
}
