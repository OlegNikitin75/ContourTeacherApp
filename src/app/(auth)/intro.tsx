import HeaderTitle from '@/src/components/HeaderTitle'
import { StatusBar } from 'expo-status-bar'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import AppButton from '@/src/components/AppButton'
import { Link } from 'expo-router'
import { ROUTES } from '@/lib/routes'

export default function Intro() {
	const insets = useSafeAreaInsets()

	return (
		<View className='flex-1 bg-app-light-gray'>
			<StatusBar style='dark' />
			<SafeAreaView style={{ flex: 1 }} edges={['top']}>
				<HeaderTitle firstItemTitle='контур' secondItemTitle='препод' />
				<View className='flex-1 justify-center items-center w-full'>
					<Image
						source={require('../../../assets/images/appImages/intro_image.png')}
						className='w-full h-full'
						resizeMode='contain'
					/>
				</View>
				<View className='bg-app-white w-full px-6 pt-8 rounded-t-4xl' style={{ paddingBottom: insets.bottom + 4 }}>
					<Text className='text-app-black text-h3 font-jetbrains-medium mb-6 text-center'>
						{'удобный помощник\nв вашем телефоне'}
					</Text>
					<AppButton title='зарегистрироваться' href={ROUTES.SIGNUP} />
					<View className='flex-row gap-1 justify-center'>
						<Text className='text-app-gray font-jetbrains-mono'>уже есть аккаунт?</Text>
						<TouchableOpacity>
							<Link href={ROUTES.SIGNIN} asChild>
								<Text className='text-app-black font-jetbrains-medium'>войти</Text>
							</Link>
						</TouchableOpacity>
					</View>
				</View>
			</SafeAreaView>
		</View>
	)
}
