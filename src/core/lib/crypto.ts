import CryptoJS from 'crypto-js'
import { getLocalSetting } from '@/core/lib/db' // Импортируем нашу функцию из SQLite

// Получаем секретный ключ напрямую из SQLite (синхронно)
const getSecretKey = (): string => {
	const key = getLocalSetting('access_key')
	return key || 'default_fallback_secret_key_1975'
}

// 1. Зашифровать текст перед отправкой в Supabase
export const encryptData = (text: string): string => {
	const secret = getSecretKey()
	return CryptoJS.AES.encrypt(text, secret).toString()
}

// 2. Расшифровать текст при получении из Supabase
export const decryptData = (cipherText: string): string => {
	const secret = getSecretKey()
	const bytes = CryptoJS.AES.decrypt(cipherText, secret)
	return bytes.toString(CryptoJS.enc.Utf8)
}
