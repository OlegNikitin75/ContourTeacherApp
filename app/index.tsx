import { Redirect } from 'expo-router'
import { getLocalSetting, initLocalDatabase } from '@/core/lib/db'

export default function RootIndex() {
	// 1. Инициализируем локальную базу данных
	initLocalDatabase()

	// 2. Читаем сохраненную роль
	const savedRole = getLocalSetting('user_role')

	// 3. Выполняем точный редирект на уровне рендера
	if (savedRole) {
		return <Redirect href="/(tabs)" />
	}

	return <Redirect href="/(onboarding)" />
}
