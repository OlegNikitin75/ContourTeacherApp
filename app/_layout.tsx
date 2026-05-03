import { JetBrainsMono_400Regular, JetBrainsMono_500Medium, useFonts } from '@expo-google-fonts/jetbrains-mono'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack, useRouter, useSegments } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { AlertProvider } from '@/providers/AlertContext'
import AnimatedSplashScreen from '@/shared/components/AnimatedSplashScreen'

SplashScreen.preventAutoHideAsync()
const queryClient = new QueryClient()

export default function RootLayout() {
	const [userRole, setUserRole] = useState<string | null>(null)
	const [initialized, setInitialized] = useState(false)
	const [showContent, setShowContent] = useState(false)
	
	// НОВЫЙ СТЕЙТ: Флаг готовности навигации (предотвращает мерцание)
	const [isNavigationReady, setIsNavigationReady] = useState(false)

	const segments = useSegments()
	const router = useRouter()

	const [fontsLoaded] = useFonts({
		'JetBrainsMono-Regular': JetBrainsMono_400Regular,
		'JetBrainsMono-Medium': JetBrainsMono_500Medium
	})

	// 1. Проверяем локальную память при старте
	useEffect(() => {
		async function checkAccess() {
			try {
				const savedRole = await AsyncStorage.getItem('user_role')
				setUserRole(savedRole)
			} catch (e) {
				console.error('Failed to load user role from storage', e)
				setUserRole(null)
			} finally {
				setInitialized(true)
			}
		}
		checkAccess()
	}, [])

	// 2. Навигационный Guard с подтверждением готовности
	useEffect(() => {
		if (!initialized || !fontsLoaded) return

		const inOnboarding = segments[0] === '(onboarding)'

		// Если роль сохранена в телефоне
		if (userRole) {
			if (inOnboarding) {
				router.replace('/(tabs)')
			} else {
				// Маршрут уже правильный, навигация готова!
				setIsNavigationReady(true)
			}
		} 
		// Если роли нет и мы не в онбординге — отправляем на первый запуск
		else if (!inOnboarding) {
			router.replace('/(onboarding)')
		} else {
			// Мы на правильном экране онбординга, навигация готова!
			setIsNavigationReady(true)
		}
	}, [userRole, initialized, segments, fontsLoaded])

	// ИСПРАВЛЕНО: Ждем, пока навигация определит конечный экран
	if (!fontsLoaded || !initialized || !isNavigationReady || !showContent) {
		return (
			<AnimatedSplashScreen
				onFinish={() => {
					setShowContent(true)
					SplashScreen.hideAsync()
				}}
			/>
		)
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider>
				<QueryClientProvider client={queryClient}>
					<AlertProvider>
						<StatusBar style='dark' />
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
