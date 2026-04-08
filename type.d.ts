import type { ImageSourcePropType } from 'react-native'

declare global {
	interface TabIconProps {
		focused: boolean
		icon: ImageSourcePropType
		title:string
		href:string
	}
	interface SvgIconComponentProps {
		color: string
		width: number
		height: number
	}
}

export {}
