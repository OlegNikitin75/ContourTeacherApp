import { View, Text, TouchableOpacity, Image, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import HeaderTitle from '@/src/components/HeaderTitle'
import { useEffect } from 'react'
import * as NavigationBar from 'expo-navigation-bar'
import { colors } from '@/constants/theme'

export default function Intro() {
	useEffect(() => {
		 if (Platform.OS === 'android') {
        // 'light' делает кнопки навигации белыми (для темного фона)
        // 'dark' делает кнопки навигации черными (для светлого фона)
        NavigationBar.setStyle('dark'); 
    }
	}, [])
	return (
		<View style={{ flex: 1 }} className='dark:bg-app-black bg-app-light-gray'>
			<StatusBar style='auto' />

			{/* Используем style для гарантии, что отступы и flex сработают */}
			<SafeAreaView style={{ flex: 1, paddingBottom: 20 }}>
				{/* 1. Заголовок */}
				<HeaderTitle firstItemTitle='контур' secondItemTitle='препод' />

				{/* 2. Картинка (теперь она точно растянется) */}
				<View className='flex-1 w-full'>
					<Image
						source={require('../../../assets/images/appImages/intro_image.png')}
						style={{ width: '100%', height: '100%' }}
						resizeMode='contain'
					/>
				</View>

				{/* 3. Нижний блок */}
				<View className='w-full items-center bg-app-white px-6 pt-8 pb-6 rounded-t-4xl'>
					<Text className='dark:text-app-white text-app-black text-h3 font-jetbrains-medium mb-6 text-center'>
						удобный помощник в вашем телефоне
					</Text>

					<TouchableOpacity className='w-full bg-app-accent p-4 rounded-2xl items-center mb-4' activeOpacity={0.8}>
						<Text className='text-app-black font-jetbrains-mono text-lg font-bold'>зарегистрироваться</Text>
					</TouchableOpacity>

					<View className='flex-row gap-1'>
						<Text className='text-app-gray font-jetbrains-mono'>уже есть аккаунт?</Text>
						<TouchableOpacity>
							<Text className='text-app-black font-jetbrains-medium'>войти</Text>
						</TouchableOpacity>
					</View>
				</View>
			</SafeAreaView>
		</View>
	)
}
