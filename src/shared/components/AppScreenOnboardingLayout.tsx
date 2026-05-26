import { colors, spacing, corner, typography } from '@/core/constants/theme'
import { Href, Link } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Image, ImageSourcePropType, Platform, Text, TouchableOpacity, View, StyleSheet } from 'react-native'
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

export default function AppScreenOnboardingLayout({
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
		<View style={styles.container}>
			<StatusBar style='dark' />
			<SafeAreaView style={styles.safeArea} edges={['top']}>
				<HeaderTitle firstItemTitle='контур' secondItemTitle='графика' />

				<KeyboardAwareScrollView
					contentContainerStyle={styles.scrollContent}
					enableOnAndroid={true}
					extraScrollHeight={Platform.OS === 'ios' ? 50 : 100}
					keyboardShouldPersistTaps='handled'
					bounces={false}
				>
					{sourceImg ? (
						<View 
							style={[
								styles.imageWrapper,
								{ 
									flex: imageHeight ? 0 : 1, 
									height: imageHeight || 'auto',
									minHeight: imageHeight || 180 
								}
							]}
						>
							<Image
								source={sourceImg}
								style={styles.image}
								resizeMode='contain'
							/>
						</View>
					) : (
						<View style={styles.emptyImageGap} />
					)}
					
					<View
						style={[
							styles.contentCard,
							{ paddingBottom: insets.bottom + spacing(4) } 
						]}
					>
						<Text style={styles.titleText}>{title}</Text>
						
						{subtitle && (
							<Text style={styles.subtitleText}>
								{subtitle}
							</Text>
						)}
						
						<View>{children}</View>
						
						<View style={styles.buttonContainer}>
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
							<View style={styles.bottomFooter}>
								<Text style={styles.bottomText}>{bottomText}</Text>
								{hrefLink && bottomLinkText && (
									<Link href={hrefLink} asChild>
										<TouchableOpacity activeOpacity={0.7}>
											<Text style={styles.bottomLink}>
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
			
			<View style={[styles.bottomStub, { height: insets.bottom }]} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.appLightGray,
	},
	safeArea: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
	},
	imageWrapper: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: spacing(4),
	},
	image: {
		width: '100%',
		height: '100%',
	},
	emptyImageGap: {
		paddingVertical: spacing(6),
	},
	contentCard: {
		backgroundColor: colors.appWhite,
		width: '100%',
		paddingHorizontal: spacing(4), 
		paddingTop: spacing(6),
		borderTopLeftRadius: corner(6), 
		borderTopRightRadius: corner(6),
		marginTop: 'auto',
	},
	titleText: {
		...typography.h3,
		color: colors.appBlack,
		textAlign: 'center',
		marginBottom: spacing(2), 
	},
	subtitleText: {
		...typography.t2,
		color: colors.appGray,
		textAlign: 'center',
		marginBottom: spacing(4), 
	},
	buttonContainer: {
		marginBottom: spacing(5), 
	},
	bottomFooter: {
		flexDirection: 'row',
		gap: spacing(1), 
		justifyContent: 'center',
		paddingBottom: spacing(2),
	},
	bottomText: {
		...typography.t2,
		color: colors.appGray,
	},
	bottomLink: {
		...typography.l2,
		color: colors.appBlack,
		textDecorationLine: 'underline', 
	},
	bottomStub: {
		backgroundColor: colors.appWhite,
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
	},
})
