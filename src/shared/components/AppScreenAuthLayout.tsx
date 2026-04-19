import { Href, Link } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Image, ImageSourcePropType, Platform, Text, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import AppButton from './AppButton'
import HeaderTitle from './HeaderTitle'

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

				<KeyboardAwareScrollView
					contentContainerStyle={{ flexGrow: 1 }}
					enableOnAndroid={true}
					extraScrollHeight={Platform.OS === 'ios' ? 50 : 100}
					keyboardShouldPersistTaps='handled'
					bounces={false}
				>
					{sourceImg ? (
						<View 
							className='items-center justify-center px-4'
							style={{ 
								flex: imageHeight ? 0 : 1, 
								height: imageHeight || 'auto',
								minHeight: imageHeight || 180 
							}}
						>
							<Image
								source={sourceImg}
								style={{ 
									width: '100%', 
									height: '100%',
									aspectRatio: imageHeight ? undefined : 1 
								}}
								resizeMode='contain'
							/>
						</View>
					) : (
						<View className='py-6' />
					)}
					<View
						className='bg-app-white w-full px-4 pt-6 rounded-t-4xl'
						style={{
							marginTop: 'auto', 
							paddingBottom: insets.bottom + 16 
						}}
					>
						<Text className='text-app-black text-h3 text-center mb-2'>{title}</Text>
						{subtitle && (
							<Text className='text-app-gray text-t2 text-center mb-4'>
								{subtitle}
							</Text>
						)}
						<View>{children}</View>
						<View className='mb-5'>
							{hrefBtn ? (
								<Link href={hrefBtn} asChild>
									<AppButton title={titleBtn} isLoading={isLoading} isDisabled={disabled} />
								</Link>
							) : (
								<AppButton 
									title={titleBtn} 
									onPress={actionBtn} 
									isLoading={isLoading} 
									isDisabled={disabled} 
								/>
							)}
						</View>
						{(bottomText || bottomLinkText) && (
							<View className='flex-row gap-1 justify-center pb-2'>
								<Text className='text-app-gray text-t2'>{bottomText}</Text>
								{hrefLink && bottomLinkText && (
									<Link href={hrefLink} asChild>
										<TouchableOpacity activeOpacity={0.7}>
											<Text className='text-app-black text-l2 underline'>
												{bottomLinkText}
											</Text>
										</TouchableOpacity>
									</Link>
								)}
							</View>
						)}
					</View>
				</KeyboardAwareScrollView>
			</SafeAreaView>
			<View 
				style={{ 
					height: insets.bottom, 
					backgroundColor: 'white', 
					position: 'absolute', 
					bottom: 0, 
					left: 0, 
					right: 0 ,
				}} 
			/>
		</View>
	)
}
