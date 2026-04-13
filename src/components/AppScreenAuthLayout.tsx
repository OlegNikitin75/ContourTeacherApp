import { Text, View, Image, TouchableOpacity, ImageSourcePropType } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import HeaderTitle from './HeaderTitle'
import AppButton from './AppButton'
import { Href, Link } from 'expo-router'
import React from 'react'
import clsx from 'clsx'

interface AppScreenAuthLayoutProps {
	sourceImg?: ImageSourcePropType
	title: string
	subtitle?: string
	titleBtn: string
	hrefBtn?: Href
	actionBtn?: () => void
	bottomText?: string
	bottomLinkText?: string
	hrefLink?: Href
	children?: React.ReactNode
}

export default function AppScreenAuthLayout({
	sourceImg,
	title,
	subtitle,
	titleBtn,
	hrefBtn,
	actionBtn,
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
					<View className='flex-1 justify-center items-center w-full'>
						<Image className='w-full h-full' source={sourceImg} resizeMode='contain' />
					</View>
				) : (
					<View className='h-2.5' />
				)}
				<View
					className={clsx('bg-app-white w-full px-6 pt-6 rounded-t-4xl', !sourceImg && 'flex-1')}
					style={{ paddingBottom: Math.max(insets.bottom, 42) }}
				>
					<Text className='text-app-black text-h3 text-center mb-4'>{title}</Text>
					{subtitle && <Text className='text-app-gray text-base text-center mb-6 lowercase'>{subtitle}</Text>}
					{children}
					<View className='mb-6'>
						{hrefBtn ? (
							<Link href={hrefBtn} asChild>
								<AppButton title={titleBtn} />
							</Link>
						) : (
							<AppButton title={titleBtn} onPress={actionBtn} />
						)}
					</View>

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
			</SafeAreaView>
		</View>
	)
}
