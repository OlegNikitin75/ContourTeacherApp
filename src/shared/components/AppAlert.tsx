import React from 'react'
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'

interface AppAlertProps {
	visible: boolean
	canceledBtn?: boolean
	title: string
	message: string
	onClose: () => void
	onConfirm: () => void
}

export default function AppAlert({ visible, title, message, canceledBtn = false, onClose, onConfirm }: AppAlertProps) {
	return (
		<Modal visible={visible} transparent animationType='fade'>
			<View className='flex-1 bg-app-black/50 items-center justify-center'>
				<View
					className='bg-app-white rounded-2xl p-6 items-center'
					style={{
						width: Dimensions.get('window').width * 0.8
					}}
				>
					<Text className='text-h3 text-app-black mb-2.5'>{title}</Text>
					<Text className='text-t1 text-app-black mb-6 text-center'>{message}</Text>

					<View className='flex-row w-full justify-between'>
						{canceledBtn && (
							<TouchableOpacity className='' onPress={onClose}>
								<Text className='text-l2 text-app-black'>Отмена</Text>
							</TouchableOpacity>
						)}

						<TouchableOpacity
							className='min-w-22 py-3 px-4 bg-app-black  rounded-full mr-0 ml-auto '
							onPress={onConfirm}
						>
							<Text className='text-l2 text-app-white text-center'>понятно</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	)
}
