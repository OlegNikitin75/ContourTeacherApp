import { Tabs, usePathname, useRouter } from 'expo-router'
import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { MotiView, AnimatePresence } from 'moti'
import { HomeIcon, CoursesIcon, ScheduleIcon, SearchIcon } from '@/assets/icons/icons_svg_components'
import { BaseIcon } from '@/shared/components/BaseIcon'
import { colors } from '@/core/constants/theme'
const { width } = Dimensions.get('window')

const TABS = [
	{ name: 'index', label: 'главная', icon: HomeIcon },
	{ name: 'courses', label: 'курсы', icon: CoursesIcon },
	{ name: 'schedule', label: 'расписание', icon: ScheduleIcon }
]

export default function TabLayout() {
	const insets = useSafeAreaInsets()
	const pathname = usePathname()
	const router = useRouter()
	const bottomPadding = Math.max(insets.bottom, 20)

	return (
		<View style={{ flex: 1, backgroundColor: colors.appLightGray }}>
			<Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
				<Tabs.Screen name='index' />
				<Tabs.Screen name='courses' />
				<Tabs.Screen name='schedule' />
			</Tabs>

			<View
				style={{
					position: 'absolute',
					bottom: bottomPadding,
					left: 16,
					width: width * 0.7,
					height: 54,
					backgroundColor: colors.appBlack,
					borderRadius: 100,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					// paddingHorizontal: 5
				}}
			>
				{TABS.map(tab => {
					const cleanPath = pathname === '/' ? 'index' : pathname.replace(/^\//, '')
					const isFocused = cleanPath === tab.name || (tab.name === 'index' && cleanPath === '')
					
					return (
						<TouchableOpacity
							key={tab.name}
							onPress={() => {
								const target = tab.name === 'index' ? '/' : `/${tab.name}`
								router.push(target as any)
							}}
							activeOpacity={0.7}
							style={{ marginHorizontal: 4}} 
						>
							<MotiView
							 key={`moti-${tab.name}-${isFocused}`} 
								animate={{
									backgroundColor: isFocused ? '#FFFFFF' : 'transparent',
									paddingHorizontal: isFocused ? 10 : 7
								}}
								transition={{ type: 'timing', duration: 250 }}
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'center',
									height: 44,
									borderRadius: 23
								}}
							>
								<BaseIcon icon={tab.icon} color={isFocused ? colors.appBlack : colors.appGray}/>

								<AnimatePresence>
									{isFocused && (
										<MotiView
											from={{ opacity: 0, width: 0, marginLeft: 0 }}
											animate={{ opacity: 1, width: 'auto', marginLeft: 2 }}
											exit={{ opacity: 0, width: 0, marginLeft: 0 }}
											style={{ overflow: 'hidden' }}
										>
											<Text numberOfLines={1} style={{ color: colors.appBlack, fontSize: 11,paddingBottom:4 }} className='font-jetbrains-mono'>
												{tab.label}
											</Text>
										</MotiView>
									)}
								</AnimatePresence>
							</MotiView>
						</TouchableOpacity>
					)
				})}
			</View>

			<View style={{ position: 'absolute', bottom: bottomPadding, right: 16 }}>
				<TouchableOpacity
					activeOpacity={0.8}
					style={{
						width: 54,
						height: 54,
						borderRadius: 32,
						backgroundColor: colors.appBlack,
						alignItems: 'center',
						justifyContent: 'center'
					}}
					onPress={() => console.log('Search')}
				>
					<BaseIcon icon={SearchIcon} color='white' size={26} />
				</TouchableOpacity>
			</View>
		</View>
	)
}
