import { ROUTES } from '@/core/lib/routes'
import { supabase } from '@/core/lib/supabase'
import * as Linking from 'expo-linking'
export const authService = {
	// Регистрация нового пользователя
	async signUp(userEmail: string, userPassword: string) {
		// Генерируем ссылку, которая вернет пользователя в приложение
		const redirectTo = Linking.createURL(`/(auth)/${ROUTES.PROFILE_FILL}`)

		const { data, error } = await supabase.auth.signUp({
			email: userEmail,
			password: userPassword,
			options: {
				emailRedirectTo: redirectTo,
				data: {
					role: 'teacher'
				}
			}
		})

		if (error) throw error
		return data
	},

	// Обновление данных профиля и установка флага готовности
	async completeProfile(firstName: string, lastName: string, middleName: string, position: string, department: string) {
		// 1. Получаем сессию пользователя внутри сервиса
		const {
			data: { user },
			error: userError
		} = await supabase.auth.getUser()

		if (userError || !user) throw new Error('Пользователь не найден')

		// 2. Делаем update
		const { error } = await supabase
			.from('profiles')
			.update({
				first_name: firstName,
				last_name: lastName,
				middle_name: middleName,
				position,
				department,
				is_complete: true,
				created_at: new Date()
			})
			.eq('id', user.id)

		if (error) throw error

		await supabase.auth.refreshSession()
		return true
	}
}
