
import { JetBrainsMono_400Regular, JetBrainsMono_500Medium, useFonts } from '@expo-google-fonts/jetbrains-mono'
import { Session } from '@supabase/supabase-js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack, useRouter, useSegments } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState, useCallback } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { ROUTES } from '@/core/lib/routes'
import { supabase } from '@/core/lib/supabase'
import { AlertProvider } from '@/providers/AlertContext'
import AnimatedSplashScreen from '@/shared/components/AnimatedSplashScreen'

SplashScreen.preventAutoHideAsync()
const queryClient = new QueryClient()

export default function RootLayout() {
	const [session, setSession] = useState<Session | null>(null)
	const [isComplete, setIsComplete] = useState<boolean | null>(null)
	const [initialized, setInitialized] = useState(false)
	const [showContent, setShowContent] = useState(false)
	const [isFetchingProfile, setIsFetchingProfile] = useState(false)

	const segments = useSegments()
	const router = useRouter()

	const [fontsLoaded] = useFonts({
		'JetBrainsMono-Regular': JetBrainsMono_400Regular,
		'JetBrainsMono-Medium': JetBrainsMono_500Medium
	})

	const refreshProfileStatus = useCallback(async (userId: string) => {
		if (isFetchingProfile) return
		setIsFetchingProfile(true)
		try {
			const { data, error } = await supabase
				.from('profiles')
				.select('is_complete')
				.eq('id', userId)
				.single()

			if (error) throw error
			setIsComplete(data?.is_complete ?? false)
		} catch (e) {
			console.error('Check Profile Error:', e)
			setIsComplete(false)
		} finally {
			setIsFetchingProfile(false)
		}
	}, [isFetchingProfile])

	
// 	useEffect(() => {
//     supabase.auth.signOut()
// }, [])
	// 1. Инициализация сессии и слушатель
	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
			setSession(currentSession)
			if (currentSession) refreshProfileStatus(currentSession.user.id)
			setInitialized(true)
		})

		const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
			setSession(currentSession)
			if (currentSession) {
				refreshProfileStatus(currentSession.user.id)
			} else {
				setIsComplete(null)
			}
		})

		return () => authListener.subscription.unsubscribe()
	}, [])

	// 2. Навигационный Guard (только автоматические редиректы)
	useEffect(() => {
		if (!initialized || !showContent || !fontsLoaded || isFetchingProfile) return

		const inAuthGroup = segments[0] === '(auth)'
		const currentScreen = segments[segments.length - 1]

		// Если пользователь залогинен
		if (session) {
			// Если профиль НЕ заполнен и мы НЕ на экране заполнения — отправляем туда
			if (isComplete === false && currentScreen !== 'profile-fill') {
				// Пропускаем автоматический редирект для экранов регистрации, 
				// чтобы они сами доиграли свои анимации успеха
				if (currentScreen !== 'signup' && currentScreen !== 'access-code') {
					router.replace(`/(auth)${ROUTES.PROFILE_FILL}`)
				}
			} 
			// Если профиль заполнен, но мы всё еще в группе auth (и не на экране заполнения)
			else if (isComplete === true && inAuthGroup && currentScreen !== 'profile-fill') {
				router.replace('/(tabs)')
			}
		} 
		// Если сессии нет и мы не в блоке авторизации — выкидываем на вход
		else if (!inAuthGroup) {
			router.replace('/(auth)')
		}
	}, [session, isComplete, initialized, showContent, segments, fontsLoaded, isFetchingProfile])

	if (!fontsLoaded || !initialized || !showContent) {
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
					
							<Stack.Screen name='(auth)' options={{ animation: 'none' }} />
							<Stack.Screen name='(tabs)' options={{ animation: 'none' }} />
						</Stack>
					</AlertProvider>
				</QueryClientProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	)
}
