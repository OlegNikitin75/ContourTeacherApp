import { ROUTES } from '@/core/lib/routes'
import "@/core/styles/global.css"
import AppButton from '@/shared/components/AppButton'
import { Link } from 'expo-router'
import { Text, View } from 'react-native'

export default function App() {
	return (
		<View className='flex-1 items-center justify-center bg-app-light-gray'>
					<Link href={ROUTES.PROFILE} asChild>
												<AppButton title={'профиль'}  />
											</Link>
			<Text className='text-xl font-bold text-blue-500'>Welcome to Nativewind!</Text>
		</View>
	)
}
