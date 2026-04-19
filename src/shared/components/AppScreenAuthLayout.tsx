import { Text, View, Image, TouchableOpacity, ImageSourcePropType, Platform } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import HeaderTitle from './HeaderTitle'
import AppButton from './AppButton'
import { Href, Link } from 'expo-router'
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

interface AppScreenAuthLayoutProps {
	sourceImg?: ImageSourcePropType
	imageHeight?: number
	title: string
	subtitle?: string
	titleBtn: string
	hrefBtn?: Href
	actionBtn?: () => void
	disabled?: boolean
	isLoading?: boolean
	bottomText?: string
	bottomLinkText?: string
	hrefLink?: Href
	children?: React.ReactNode
}

export default function AppScreenAuthLayout({
	sourceImg,
	imageHeight,
	title,
	subtitle,
	titleBtn,
	disabled,
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

				<View className='flex-1'>
					{sourceImg ? (
						<View
							style={{
								height: imageHeight || 'auto',
								flex: imageHeight ? 0 : 1
							}}
							className='flex-1 justify-center items-center'
						>
							<Image source={sourceImg} style={{ width: '100%', height: '100%' }} resizeMode='contain' />
						</View>
					) : (
						<View className='flex-1' />
					)}
					<View className='flex-none'>
						<KeyboardAwareScrollView
							contentContainerStyle={{ flexGrow: 0 }}
							enableOnAndroid={true}
							extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
							keyboardShouldPersistTaps='handled'
							bounces={false}
						>
							<View
								className='bg-app-white w-full px-4 pt-8 rounded-t-4xl'
								style={{
									// paddingBottom должен учитывать нижнюю безопасную зону
									paddingBottom: Math.max(insets.bottom, 24)
								}}
							>
								<Text className='text-app-black text-h3 text-center mb-2'>{title}</Text>

								{subtitle && <Text className='text-app-gray text-t2 text-center mb-4'>{subtitle}</Text>}

								<View className='mb-4'>{children}</View>

								<View className='mb-6'>
									{hrefBtn ? (
										<Link href={hrefBtn} asChild>
											<AppButton title={titleBtn} isLoading={isLoading} isDisabled={disabled} />
										</Link>
									) : (
										<AppButton title={titleBtn} onPress={actionBtn} isLoading={isLoading} isDisabled={disabled} />
									)}
								</View>

								{(bottomText || bottomLinkText) && (
									<View className='flex-row gap-1 justify-center pb-2'>
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
					</View>
				</View>
			</SafeAreaView>
		</View>
	)
}
