import { icons } from './icons'
import { Href } from 'expo-router'

type Tab = {
	name: string
	title: string
	icon: any
	href: Href
}

export const tabs: Tab[] = [
	{ name: 'index', title: 'главная', icon: icons.home, href: '/(tabs)/' as Href },
	{ name: 'courses', title: 'курсы', icon: icons.courses, href: '/(tabs)/courses' as Href },
	{ name: 'schedule', title: 'расписание', icon: icons.schedule, href: '/(tabs)/schedule' as Href }
]
