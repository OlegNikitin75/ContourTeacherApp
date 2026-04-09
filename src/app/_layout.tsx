import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import '@/global.css'; 
import 'react-native-reanimated';

// Удерживаем экран загрузки, пока приложение не готово
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Скрываем сплэш-скрин после загрузки (здесь можно загружать шрифты)
    SplashScreen.hideAsync();
  }, []);

  return (
    // 1. GestureHandlerRootView необходим для работы библиотеки Moti и Reanimated
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* 2. SafeAreaProvider позволяет нашему таббару знать высоту "челки" и нижней полоски */}
      <SafeAreaProvider>
        {/* 3. StatusBar — делаем иконки в статус-баре темными/светлыми автоматически */}
        <StatusBar style="auto" />
        
        {/* Главный стек навигации */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          
          {/* Здесь можно добавить модальное окно поиска, которое будет открываться на весь экран */}
          <Stack.Screen 
            name="search-modal" 
            options={{ 
              presentation: 'modal',
              headerShown: true,
              title: 'Поиск'
            }} 
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
