import { useState } from 'react'

export function useForm<T extends Record<string, string>>(initialValues: T) {
	const [values, setValues] = useState<T>(initialValues)
	const [errors, setErrors] = useState<{ [K in keyof T]?: string }>({})

	const handleChange = (field: keyof T, value: string) => {
		setValues(prev => ({ ...prev, [field]: value }))

		// Если была ошибка для этого поля — удаляем её
		if (errors[field]) {
			setErrors(prev => {
				const newErrors = { ...prev }
				delete newErrors[field]
				return newErrors
			})
		}
	}

	return { values, errors, setErrors, handleChange, setValues }
}
