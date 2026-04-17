import { Text, View, Image, TouchableOpacity, ImageSourcePropType, Platform } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import HeaderTitle from './HeaderTitle'
import AppButton from './AppButton'
import { Href, Link } from 'expo-router'
import React from 'react'
import clsx from 'clsx'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

interface AppScreenAuthLayoutProps {
	sourceImg?: ImageSourcePropType
	width?: number | string
	height?: number | string
	className?: string
	title: string
	subtitle?: string
	titleBtn: string
	hrefBtn?: Href
	actionBtn?: () => void
	isLoading?: boolean
	bottomText?: string
	bottomLinkText?: string
	hrefLink?: Href
	children?: React.ReactNode
}

export default function AppScreenAuthLayout({
	sourceImg,
	width,
	height,
	className,
	title,
	subtitle,
	titleBtn,
	hrefBtn,
	actionBtn,
	isLoading = false,
	bottomText,
	bottomLinkText,
	hrefLink,
	children
}: AppScreenAuthLayoutProps) {
	const insets = useSafeAreaInsets()

	return (
		<View className='flex-1 bg-app-light-gray'>
			<StatusBar style='dark' />
			<SafeAreaView style={{ flex: 1 }} edges={['top']}>
				<HeaderTitle firstItemTitle='контур' secondItemTitle='препод' />

				{sourceImg ? (
					<View className={`justify-center items-center ml-auto mr-auto ${className}`}>
						<Image className='w-full h-full' source={sourceImg} resizeMode='contain' />
					</View>
				) : (
					<View className='h-2.5' />
				)}

				{/* Умная область скролла */}
				<KeyboardAwareScrollView
					// Эта настройка подтягивает экран к активному инпуту
					extraScrollHeight={Platform.OS === 'ios' ? 50 : 20}
					enableOnAndroid={true}
					// Чтобы кнопки и поля не прилипали к клавиатуре
					keyboardShouldPersistTaps='handled'
					contentContainerStyle={{ flexGrow: 1 }}
					style={{ flex: 1 }}
				>
					<View
						className='bg-app-white w-full px-4 pt-8 rounded-t-4xl flex-1'
						style={{
							paddingBottom: Math.max(insets.bottom, 42),
							minHeight: '100%' // Важно для корректного фона
						}}
					>
						<Text className='text-app-black text-h3 text-center mb-4'>{title}</Text>

						{subtitle && <Text className='text-app-gray text-t2 text-center mb-6'>{subtitle}</Text>}

						{/* Поля ввода */}
						<View className='mb-6'>{children}</View>

						{/* Кнопка регистрации/входа */}
						<View className='mb-6'>
							{hrefBtn ? (
								<Link href={hrefBtn} asChild>
									<AppButton title={titleBtn} isLoading={isLoading} />
								</Link>
							) : (
								<AppButton title={titleBtn} onPress={actionBtn} isLoading={isLoading} />
							)}
						</View>

						{/* Ссылка внизу */}
						{(bottomText || bottomLinkText) && (
							<View className='flex-row gap-1 justify-center'>
								<Text className='text-app-gray text-t2'>{bottomText}</Text>
								{hrefLink && bottomLinkText && (
									<Link href={hrefLink} asChild>
										<TouchableOpacity>
											<Text className='text-app-black text-l2 underline'>{bottomLinkText}</Text>
										</TouchableOpacity>
									</Link>
								)}
							</View>
						)}
					</View>
				</KeyboardAwareScrollView>
			</SafeAreaView>
		</View>
	)
}
