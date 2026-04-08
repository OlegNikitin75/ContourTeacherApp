import { Tabs, TabSlot, TabTrigger } from 'expo-router/ui'
import { View, Text, Pressable } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import clsx from 'clsx'

// Импорт ваших SVG компонентов (уже как React компоненты)
import { HomeSvgComponent as HomeIcon, CoursesSvgComponent as CoursesIcon, ScheduleSvgComponent as ScheduleIcon, SearchSvgComponent as SearchIcon } from '@/assets/icons/icons_svg_components'

export default function TabLayout() {
	return (
		<SafeAreaView className='flex-1 bg-white' edges={['bottom']}>
			<StatusBar style='dark' />

			<Tabs className='flex-1'>
				<TabSlot />

				{/* Нижняя панель: табы слева, поиск отдельно справа */}
				<View className='flex-row items-center justify-between px-6 py-3 bg-white border-t border-gray-100'>
					{/* Табы (слева) */}
					<View className='flex-row gap-6'>
						<TabTrigger name='index' href='/'>
							<TabButton Icon={HomeIcon} label='Главная' />
						</TabTrigger>
						<TabTrigger name='courses' href='/courses'>
							<TabButton Icon={CoursesIcon} label='Курсы' />
						</TabTrigger>
						<TabTrigger name='schedule' href='/schedule'>
							<TabButton Icon={ScheduleIcon} label='Расписание' />
						</TabTrigger>
					</View>

					{/* Кнопка поиска (отдельно справа) */}
					<Pressable onPress={() => console.log('Поиск открыт')} className='p-2 -mr-2'>
						<SearchIcon width={24} height={24} color='#000000' />
					</Pressable>
				</View>
			</Tabs>
		</SafeAreaView>
	)
}

// Компонент кнопки таба
function TabButton({ Icon, label, isFocused }) {
	return (
		<View className='items-center'>
			{/* Белый круглый фон для активного таба */}
			<View className={clsx('p-2 rounded-full transition-all duration-200', isFocused ? 'bg-white' : 'bg-transparent')}>
				<Icon width={24} height={24} color={isFocused ? '#000000' : '#9CA3AF'} />
			</View>

			{/* Надпись только для активного таба */}
			{isFocused && <Text className='text-xs font-medium text-black mt-1'>{label}</Text>}
		</View>
	)
}
