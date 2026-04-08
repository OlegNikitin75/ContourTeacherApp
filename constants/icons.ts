
import home from '@/assets/icons/home.svg'
import courses from '@/assets/icons/courses.svg'
import schedule from '@/assets/icons/schedule.svg'
import search from '@/assets/icons/search.svg'


export const icons = {
	home,
	courses,
	schedule,
	search
	
} as const

export type IconKey = keyof typeof icons
