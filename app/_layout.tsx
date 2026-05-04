import { JetBrainsMono_400Regular, JetBrainsMono_500Medium, useFonts } from '@expo-google-fonts/jetbrains-mono'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { AlertProvider } from '@/providers/AlertContext'
import AnimatedSplashScreen from '@/shared/components/AnimatedSplashScreen' // Импортируем ваш сплеш

SplashScreen.preventAutoHideAsync()
const queryClient = new QueryClient()

export default function RootLayout() {
	const [showContent, setShowContent] = useState(false) // Управляем показом контента

	const [fontsLoaded] = useFonts({
		'JetBrainsMono-Regular': JetBrainsMono_400Regular,
		'JetBrainsMono-Medium': JetBrainsMono_500Medium
	})

	if (!fontsLoaded) return null

	return (
		<GestureHandlerRootView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
			<SafeAreaProvider>
				<QueryClientProvider client={queryClient}>
					<AlertProvider>
						<StatusBar style='dark' translucent={true} backgroundColor='transparent' />
						
						{!showContent ? (
							/* 1. Сначала показываем вашу красивую анимацию */
							<AnimatedSplashScreen
								onFinish={() => {
									setShowContent(true)
									SplashScreen.hideAsync() // Скрываем нативный сплеш ПОСЛЕ анимации
								}}
							/>
						) : (
							/* 2. Только после анимации открываем навигацию */
							<Stack screenOptions={{ headerShown: false }}>
								<Stack.Screen name='index' />
								<Stack.Screen name='(onboarding)' options={{ animation: 'none' }} />
								<Stack.Screen name='(tabs)' options={{ animation: 'none' }} />
								<Stack.Screen name='(profile)' options={{ presentation: 'modal' }} />
							</Stack>
						)}
					</AlertProvider>
				</QueryClientProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	)
}
