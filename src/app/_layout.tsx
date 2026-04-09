import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as SplashScreen from 'expo-splash-screen'
import '@/global.css'
import 'react-native-reanimated'
import { useFonts } from 'expo-font'
import { JetBrainsMono_400Regular, JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono'

// Удерживаем экран загрузки, пока приложение не готово
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
	const [fontsLoaded, fontError] = useFonts({
		'JetBrainsMono-Regular': JetBrainsMono_400Regular,
		'JetBrainsMono-Medium': JetBrainsMono_500Medium
	})

	// Скрываем сплэш-скрин ТОЛЬКО после загрузки шрифтов
	useEffect(() => {
		if (fontsLoaded || fontError) {
			SplashScreen.hideAsync()
		}
	}, [fontsLoaded, fontError])

	if (!fontsLoaded && !fontError) {
		return null // Показываем ничего, пока шрифты не загрузятся
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaProvider>
				<StatusBar style='auto' />

				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name='(intro)' options={{ headerShown: false }} />
					{/* <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> */}
				</Stack>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	)
}
