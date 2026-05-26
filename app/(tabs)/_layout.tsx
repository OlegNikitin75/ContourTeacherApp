import { colors, spacing, corner, typography } from '@/core/constants/theme'
import { Tabs, usePathname, useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { View, Text, Dimensions, TouchableOpacity, StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { HomeIcon, CoursesIcon, ScheduleIcon, SearchIcon } from '@/assets/icons/icons_svg_components'
import { BaseIcon } from '@/shared/components/BaseIcon'

const { width } = Dimensions.get('window')

const TABS = [
	{ name: 'index', label: 'главная', icon: HomeIcon },
	{ name: 'courses', label: 'курсы', icon: CoursesIcon },
	{ name: 'schedule', label: 'расписание', icon: ScheduleIcon }
]

export default function TabLayout() {
	const insets = useSafeAreaInsets()
	const pathname = usePathname()
	const bottomPadding = Math.max(insets.bottom, spacing(5)) // 20px

	const cleanPath = pathname === '/' ? 'index' : pathname.replace(/^\//, '')

	return (
		<View style={styles.screenContainer}>
			<Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
				<Tabs.Screen name='index' />
				<Tabs.Screen name='courses' />
				<Tabs.Screen name='schedule' />
			</Tabs>

			{/* НАВИГАЦИОННАЯ ПАНЕЛЬ ТАБОВ */}
			<View style={[styles.tabBarContainer, { bottom: bottomPadding }]}>
				{TABS.map(tab => {
					const isFocused = cleanPath === tab.name || (tab.name === 'index' && cleanPath === '')
					return (
						<TabButton 
							key={tab.name} 
							tab={tab} 
							isFocused={isFocused} 
						/>
					)
				})}
			</View>

			{/* ОТДЕЛЬНАЯ КНОПКА ПОИСКА */}
			<View style={[styles.searchButtonContainer, { bottom: bottomPadding }]}>
				<TouchableOpacity
					activeOpacity={0.8}
					style={styles.searchButton}
					onPress={() => console.log('Search')}
				>
					<BaseIcon icon={SearchIcon} color={colors.appWhite} size={26} />
				</TouchableOpacity>
			</View>
		</View>
	)
}

// ВЫДЕЛЕННЫЙ НАДЁЖНЫЙ КОМПОНЕНТ КНОПКИ ТАБА БЕЗ MOTI
interface TabButtonProps {
	tab: typeof TABS[0]
	isFocused: boolean
}

function TabButton({ tab, isFocused }: TabButtonProps) {
	const router = useRouter()

	// Анимируем ширину раскрытия текста и паддинги плашки
	const animatedPillStyle = useAnimatedStyle(() => {
		return {
			backgroundColor: withTiming(isFocused ? colors.appWhite : 'transparent', { duration: 200 }),
			paddingHorizontal: withTiming(isFocused ? spacing(2.5) : spacing(1.75), { duration: 200 })
		}
	})

	const animatedTextStyle = useAnimatedStyle(() => {
		return {
			opacity: withTiming(isFocused ? 1 : 0, { duration: 150 }),
			// Плавное раздвижение по ширине (замена AnimatePresence)
			maxWidth: withTiming(isFocused ? 100 : 0, { duration: 200 }),
			marginLeft: withTiming(isFocused ? spacing(1) : 0, { duration: 200 })
		}
	})

	return (
		<TouchableOpacity
			onPress={() => {
				const target = tab.name === 'index' ? '/' : `/${tab.name}`
				router.push(target as any)
			}}
			activeOpacity={0.7}
			style={styles.tabItem} 
		>
			<Animated.View style={[styles.reanimatedPill, animatedPillStyle]}>
				<BaseIcon 
					icon={tab.icon} 
					color={isFocused ? colors.appBlack : colors.appGray}
				/>
				
				<Animated.View style={[styles.textWrapper, animatedTextStyle]}>
					<Text numberOfLines={1} style={styles.tabLabel}>
						{tab.label}
					</Text>
				</Animated.View>
			</Animated.View>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	screenContainer: {
		flex: 1,
		backgroundColor: colors.appLightGray,
	},
	tabBarContainer: {
		position: 'absolute',
		left: spacing(4),
		width: width * 0.7,
		height: 54,
		backgroundColor: colors.appBlack,
		borderRadius: corner('full'),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: spacing(1),
	},
	tabItem: {
		marginHorizontal: spacing(0.5),
	},
	reanimatedPill: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 44,
		borderRadius: corner('full'),
	},
	textWrapper: {
		overflow: 'hidden',
		flexDirection: 'row',
		alignItems: 'center',
	},
	tabLabel: {
		...typography.l3,
		color: colors.appBlack,
		paddingBottom: spacing(0.5),
	},
	searchButtonContainer: {
		position: 'absolute',
		right: spacing(4),
	},
	searchButton: {
		width: 54,
		height: 54,
		borderRadius: corner('full'),
		backgroundColor: colors.appBlack,
		alignItems: 'center',
		justifyContent: 'center',
	},
})
