import { JetBrainsMono_400Regular, JetBrainsMono_500Medium, useFonts } from '@expo-google-fonts/jetbrains-mono'
import { Session } from '@supabase/supabase-js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Stack, useRouter, useSegments } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
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
	const [isFetchingProfile, setIsFetchingProfile] = useState(true)
	const [isFirstLoadDone, setIsFirstLoadDone] = useState(false)

	const segments = useSegments()
	const router = useRouter()

	const [fontsLoaded] = useFonts({
		'JetBrainsMono-Regular': JetBrainsMono_400Regular,
		'JetBrainsMono-Medium': JetBrainsMono_500Medium
	})

	const refreshProfileStatus = async (userId: string) => {
		try {
			const { data, error } = await supabase
				.from('profiles')
				.select('is_complete')
				.eq('id', userId)
				.single()
			
			setIsComplete(data?.is_complete ?? false)
		} catch (e) {
			setIsComplete(false)
		} finally {
			setIsFetchingProfile(false)
			setIsFirstLoadDone(true)
		}
	}

		useEffect(() => {
    supabase.auth.signOut()
}, [])

	useEffect(() => {
		const prepare = async () => {
			try {
				const { data: { session: currentSession } } = await supabase.auth.getSession()
				setSession(currentSession)
				
				if (currentSession) {
					await refreshProfileStatus(currentSession.user.id)
				} else {
					setIsFetchingProfile(false)
					setIsFirstLoadDone(true)
				}
			} catch (e) {
				setIsFetchingProfile(false)
				setIsFirstLoadDone(true)
			} finally {
				setInitialized(true)
			}
		}

		prepare()

		const { data: authListener } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
			setSession(currentSession)
			if (currentSession) {
				setIsFetchingProfile(true)
				await refreshProfileStatus(currentSession.user.id)
			} else {
				setIsComplete(null)
				setIsFetchingProfile(false)
				setIsFirstLoadDone(true)
			}
		})

		return () => authListener.subscription.unsubscribe()
	}, [])

	// МОЗГ НАВИГАЦИИ (Auth Guard)
	// Внутри useEffect (МОЗГ НАВИГАЦИИ)
useEffect(() => {
    if (!initialized || !isFirstLoadDone || !showContent || !fontsLoaded) return

    const inAuthGroup = segments[0] === '(auth)'
    const currentScreen = segments[segments.length - 1]

    // Добавляем список экранов, которым мы разрешаем САМИМ управлять навигацией
    const isManualNavScreen = currentScreen === 'signup' || currentScreen === 'access-code'

    if (session) {
        // Если мы на экране регистрации, даем ему завершить анимацию/показать успех
        if (isManualNavScreen) return 

        if (isComplete === false) {
            if (currentScreen !== 'profile-fill') {
                router.replace(`/(auth)${ROUTES.PROFILE_FILL}`)
            }
        } else if (isComplete === true && inAuthGroup) {
            router.replace('/(tabs)')
        }
    } else {
        if (!inAuthGroup) {
            router.replace('/(auth)')
        }
    }
}, [session, isComplete, initialized, isFirstLoadDone, showContent, segments, fontsLoaded])


	const shouldShowSplash = !fontsLoaded || !initialized || !isFirstLoadDone || !showContent

	if (shouldShowSplash) {
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
							{/* Рендерим группы в зависимости от состояния */}
							{!session || isComplete === false ? (
								<Stack.Screen name='(auth)' options={{ animation: 'none' }} />
							) : (
								<Stack.Screen name='(tabs)' options={{ animation: 'none' }} />
							)}
						</Stack>
					</AlertProvider>
				</QueryClientProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	)
}
