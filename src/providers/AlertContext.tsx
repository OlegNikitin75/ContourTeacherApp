import AppAlert from '@/shared/components/AppAlert'
import React, { createContext, useContext, useState } from 'react'

interface AlertContextType {
	showAlert: (title: string, message: string) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [visible, setVisible] = useState(false)
	const [config, setConfig] = useState({ title: '', message: '' })

	const showAlert = (title: string, message: string) => {
		setConfig({ title, message })
		setVisible(true)
	}

	return (
		<AlertContext.Provider value={{ showAlert }}>
			{children}
			<AppAlert
				visible={visible}
				title={config.title}
				message={config.message}
				onClose={() => setVisible(false)}
				onConfirm={() => setVisible(false)}
			/>
		</AlertContext.Provider>
	)
}

export const useAlert = () => {
	const context = useContext(AlertContext)
	if (!context) throw new Error('useAlert must be used within AlertProvider')
	return context
}
