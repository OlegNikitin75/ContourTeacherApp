import React, { useEffect, useState } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useFonts, JetBrainsMono_400Regular, JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Session } from '@supabase/supabase-js'
import AnimatedSplashScreen from '../src/shared/components/AnimatedSplashScreen'
import { supabase } from '../src/core/lib/supabase'
import { ROUTES } from '@/core/lib/routes'

SplashScreen.preventAutoHideAsync()
const queryClient = new QueryClient()

export default function RootLayout() {
	const [session, setSession] = useState<Session | null>(null)
	const [isComplete, setIsComplete] = useState<boolean | null>(null)
	const [initialized, setInitialized] = useState(false)
	const [showContent, setShowContent] = useState(false)

	const segments = useSegments()
	const router = useRouter()

	const [fontsLoaded] = useFonts({
		'JetBrainsMono-Regular': JetBrainsMono_400Regular,
		'JetBrainsMono-Medium': JetBrainsMono_500Medium
	})

	// Функция обновления статуса профиля
	const refreshProfileStatus = async (userId: string) => {
		const { data } = await supabase.from('profiles').select('is_complete').eq('id', userId).single()
		setIsComplete(data?.is_complete ?? false)
	}

	// 1. Инициализация и отслеживание Auth
	useEffect(() => {
		const prepare = async () => {
			const {
				data: { session }
			} = await supabase.auth.getSession()
			setSession(session)
			if (session) {
				await refreshProfileStatus(session.user.id)
			}
			setInitialized(true)
		}
		prepare()

		const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
			setSession(currentSession)
			if (currentSession) {
				await refreshProfileStatus(currentSession.user.id)
			} else {
				setIsComplete(null) // Сбрасываем при выходе
			}
		})

		return () => authListener.subscription.unsubscribe()
	}, [])

	// 2. Навигационная логика
	useEffect(() => {
		// Не делаем редирект, пока не прошли сплэш или не загрузили данные
		if (!showContent || !initialized) return

		const currentSegments = segments as string[]
		const inAuthGroup = currentSegments.includes('(auth)')

		if (!session) {
			// Если нет сессии и мы не в auth-группе — на Intro
			if (!inAuthGroup) {
				router.replace(`/(auth)${ROUTES.INTRO}`)
			}
		} else {
			// Если сессия есть, проверяем заполненность профиля
			if (isComplete === false) {
				const isOnFillingScreens = currentSegments.includes('profile-fill') || currentSegments.includes('access-code')

				if (!isOnFillingScreens) {
					router.replace(`/(auth)${ROUTES.PROFILE_FILL}`)
				}
			} else if (isComplete === true) {
				// Если профиль готов, а мы всё еще в auth — уходим в табы
				if (inAuthGroup) {
					router.replace('/(tabs)')
				}
			}
		}
	}, [session, isComplete, showContent, initialized, segments])

	if (!fontsLoaded || !initialized) return null

	if (!showContent) {
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
		<GestureHandlerRootView className='flex-1'>
			<SafeAreaProvider>
				<QueryClientProvider client={queryClient}>
					<StatusBar style='dark' />
					<Stack screenOptions={{ headerShown: false }}>
						<Stack.Screen name='(auth)' />
						<Stack.Screen name='(tabs)' />
					</Stack>
				</QueryClientProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	)
}
