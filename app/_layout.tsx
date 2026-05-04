import { JetBrainsMono_400Regular, JetBrainsMono_500Medium, useFonts } from '@expo-google-fonts/jetbrains-mono'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack, useRouter, useSegments } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { AlertProvider } from '@/providers/AlertContext'
import AnimatedSplashScreen from '@/shared/components/AnimatedSplashScreen'
import { getLocalSetting, initLocalDatabase } from '@/core/lib/db'

SplashScreen.preventAutoHideAsync()
const queryClient = new QueryClient()

export default function RootLayout() {
	const [userRole, setUserRole] = useState<string | null>(null)
	const [initialized, setInitialized] = useState(false)
	const [showContent, setShowContent] = useState(false)

	const segments = useSegments()
	const router = useRouter()

	const [fontsLoaded] = useFonts({
		'JetBrainsMono-Regular': JetBrainsMono_400Regular,
		'JetBrainsMono-Medium': JetBrainsMono_500Medium
	})

	// 1. Инициализация базы данных и роли
	useEffect(() => {
		async function checkAccess() {
			try {
				initLocalDatabase()
				const savedRole = getLocalSetting('user_role')
				setUserRole(savedRole)
			} catch (e) {
				console.error('Ошибка при инициализации:', e)
			} finally {
				setInitialized(true)
			}
		}
		checkAccess()
	}, [])

	// 2. Навигационный Guard
	useEffect(() => {
		// Запускаем навигацию только когда шрифты загружены, база готова и анимация закончилась
		if (!initialized || !fontsLoaded || !showContent) return

		const inOnboarding = segments[0] === '(onboarding)' || segments[0] === 'onboarding'

		if (userRole) {
			if (inOnboarding) {
				router.replace('/(tabs)')
			}
		} else if (!inOnboarding) {
			router.replace('/(onboarding)')
		}
	}, [userRole, initialized, segments, fontsLoaded, showContent])

	// 3. Скрываем нативный сплеш, чтобы показать AnimatedSplashScreen
	useEffect(() => {
		if (fontsLoaded && initialized) {
			// Нативный сплеш уходит, уступая место вашему анимированному сплешу
			SplashScreen.hideAsync()
		}
	}, [fontsLoaded, initialized])

	// ИСПРАВЛЕНО: Пока не завершится кастомная анимация, показываем AnimatedSplashScreen
	if (!fontsLoaded || !initialized || !showContent) {
		return (
			<AnimatedSplashScreen
				onFinish={() => {
					setShowContent(true) // Только теперь пускаем в приложение
				}}
			/>
		)
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider>
				<QueryClientProvider client={queryClient}>
					<AlertProvider>
						<StatusBar style='dark' translucent={true} backgroundColor="transparent" />
						<Stack screenOptions={{ headerShown: false }}>
							<Stack.Screen name='(onboarding)' options={{ animation: 'none' }} />
							<Stack.Screen name='(tabs)' options={{ animation: 'none' }} />
							<Stack.Screen name='(profile)' options={{ presentation: 'modal' }} />
						</Stack>
					</AlertProvider>
				</QueryClientProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	)
}
