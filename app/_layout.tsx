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

	// 1. Загрузка данных
	useEffect(() => {
		const prepare = async () => {
			const {
				data: { session }
			} = await supabase.auth.getSession()
			setSession(session)
			if (session) {
				const { data } = await supabase.from('profiles').select('is_complete').eq('id', session.user.id).single()
				setIsComplete(data?.is_complete ?? false)
			}
			setInitialized(true)
		}
		prepare()

		const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session)
			if (session) {
				supabase
					.from('profiles')
					.select('is_complete')
					.eq('id', session.user.id)
					.single()
					.then(({ data }) => setIsComplete(data?.is_complete ?? false))
			}
		})
		return () => authListener.subscription.unsubscribe()
	}, [])

	// 2. Навигация (срабатывает только когда контент готов к показу)
	useEffect(() => {
		if (!showContent || !initialized) return

		// Принудительно приводим к массиву строк, чтобы TS не ругался на "never"
		const currentSegments = segments as string[]

		const inAuthGroup = currentSegments.includes('(auth)')

		if (!session) {
			if (!inAuthGroup) router.replace('/(auth)/signup')//intro
		} else if (isComplete === false) {
			// Теперь здесь ошибки не будет
			const isFillingProfile = currentSegments.includes('profile-fill') || currentSegments.includes('access-code')
			if (!isFillingProfile) router.replace('/(auth)/access-code')
		} else if (isComplete === true && inAuthGroup) {
			router.replace('/(tabs)')
		}
	}, [session, isComplete, showContent, initialized, segments])

	// Если шрифты или данные еще не готовы — держим системный сплэш
	if (!fontsLoaded || !initialized) return null

	// Если данные готовы, но мы еще "крутим" красивую анимацию
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
