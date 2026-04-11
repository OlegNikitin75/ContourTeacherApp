import { useEffect, useState } from 'react'
import { View, ActivityIndicator } from 'react-native' // Добавили компоненты
import { Stack, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as SplashScreen from 'expo-splash-screen'
import '@/global.css'
import 'react-native-reanimated'
import { useFonts } from 'expo-font'
import { JetBrainsMono_400Regular, JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
	const [session, setSession] = useState<Session | null>(null)
	const [isComplete, setIsComplete] = useState<boolean | null>(null)
	const [initialized, setInitialized] = useState(false)
	const [appReady, setAppReady] = useState(false) // Состояние готовности всего (шрифты + база)

	const segments = useSegments()
	const router = useRouter()

	const [fontsLoaded, fontError] = useFonts({
		'JetBrainsMono-Regular': JetBrainsMono_400Regular,
		'JetBrainsMono-Medium': JetBrainsMono_500Medium
	})

	// 1. Инициализация данных
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
				// При смене состояния (например, вход) перепроверяем флаг
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

	// 2. Скрытие сплэш-скрина и установка готовности
	useEffect(() => {
		if ((fontsLoaded || fontError) && initialized) {
			setAppReady(true)
			SplashScreen.hideAsync()
		}
	}, [fontsLoaded, fontError, initialized])

	// 3. Навигация
	// 3. Навигация
	useEffect(() => {
		if (!appReady) return

		// Приводим к string[], чтобы TS не ругался на отсутствие сегментов
		const routeSegments = segments as string[]
		const inAuthGroup = routeSegments.includes('(auth)')

		if (!session) {
			// Если нет сессии и мы не в auth-группе — на интро
			if (!inAuthGroup) router.replace('/(auth)/intro' as any)
		} else if (isComplete === false) {
			// Если залогинен, но профиль не заполнен
			const isFillingProfile = routeSegments.includes('profile-fill') || routeSegments.includes('access-code')

			if (!isFillingProfile) {
				router.replace('/(auth)/access-code' as any)
			}
		} else if (isComplete === true && inAuthGroup) {
			// Если все заполнено, но мы все еще в auth — на главную
			router.replace('/(tabs)' as any)
		}
	}, [session, isComplete, appReady, segments])

	// Пока всё грузится — показываем индикатор
	if (!appReady) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
				<ActivityIndicator size='large' color='#000' />
			</View>
		)
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider>
				<StatusBar style='auto' />
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name='(auth)' />
					<Stack.Screen name='(tabs)' />
				</Stack>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	)
}
