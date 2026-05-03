import React, { useState, useRef } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import AppSnackbar from '@/shared/components/AppSnackbar'
import { ROUTES } from '@/core/lib/routes'

export default function ProfileScreen() {
	const [snackbarVisible, setSnackbarVisible] = useState(false)
	const logoutTimer = useRef<NodeJS.Timeout | null>(null)

	const triggerLogoutProcess = () => {
    setSnackbarVisible(true)

    logoutTimer.current = setTimeout(async () => {
        try {
            // Очищаем локальное хранилище
            await AsyncStorage.multiRemove(['access_key', 'user_role', 'user_profile'])
            
            // 2. Исправлено: Перенаправляем на заглавный экран Intro
            router.replace(ROUTES.INTRO) 
        } catch (e) {
            console.error(e)
        }
    }, 4000)
}

	const cancelLogout = () => {
		// Очищаем таймер выхода
		if (logoutTimer.current) {
			clearTimeout(logoutTimer.current)
		}
		// Скрываем Snackbar
		setSnackbarVisible(false)
	}

	return (
		<View className='flex-1 justify-between p-4 bg-white'>
			<View>
				{/* Здесь ваш контент профиля */}
				<Text className='text-lg font-bold'>Профиль преподавателя</Text>
			</View>

			{/* Кнопка выхода */}
			<TouchableOpacity 
				onPress={triggerLogoutProcess}
				className='border border-red-200 bg-red-50 rounded-xl p-4 active:bg-red-100 mb-4'
			>
				<Text className='text-red-600 font-bold text-center text-base'>
					Выйти из профиля
				</Text>
			</TouchableOpacity>

			{/* Наш кастомный Snackbar */}
			<AppSnackbar
				visible={snackbarVisible}
				message='Выход из профиля будет выполнен через 4 секунды...'
				actionLabel='ОТМЕНА'
				onActionPress={cancelLogout}
				onDismiss={() => setSnackbarVisible(false)}
				duration={4000}
			/>
		</View>
	)
}
