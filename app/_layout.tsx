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
import { AlertProvider } from '@/providers/AlertContext'

SplashScreen.preventAutoHideAsync()
const queryClient = new QueryClient()

export default function RootLayout() {
	const [session, setSession] = useState<Session | null>(null)
	const [isComplete, setIsComplete] = useState<boolean | null>(null)
	const [initialized, setInitialized] = useState(false)
	const [showContent, setShowContent] = useState(false)
	const [isFetchingProfile, setIsFetchingProfile] = useState(true)

	const [isFirstLoadDone, setIsFirstLoadDone] = useState(false)

	const [fontsLoaded] = useFonts({
		'JetBrainsMono-Regular': JetBrainsMono_400Regular,
		'JetBrainsMono-Medium': JetBrainsMono_500Medium
	})

	const refreshProfileStatus = async (userId: string) => {
		try {
			const { data } = await supabase.from('profiles').select('is_complete').eq('id', userId).single()
			setIsComplete(data?.is_complete ?? false)
		} catch (e) {
			setIsComplete(false)
		} finally {
			setIsFetchingProfile(false)
			setIsFirstLoadDone(true)
		}
	}

	// useEffect(() => {
	// 	supabase.auth.signOut()
	// }, [])

	useEffect(() => {
		const prepare = async () => {
			try {
				const {
					data: { session }
				} = await supabase.auth.getSession()
				setSession(session)
				if (session) {
					await refreshProfileStatus(session.user.id)
				} else {
					setIsFetchingProfile(false)
					setIsFirstLoadDone(true)
				}
			} catch (e) {
				setIsFetchingProfile(false)
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
			}
		})
		return () => authListener.subscription.unsubscribe()
	}, [])

	// Ждем полной готовности данных
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
							{/* 
								КЛЮЧЕВОЕ ИЗМЕНЕНИЕ:
								Рендерим ТОЛЬКО ту группу, которая нужна. 
								Это исключает моргание, так как роутер физически не увидит "чужой" экран.
							*/}
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
