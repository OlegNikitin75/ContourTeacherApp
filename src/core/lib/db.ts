import * as SQLite from 'expo-sqlite'

export const db = SQLite.openDatabaseSync('kontur_grafika.db')

export const initLocalDatabase = () => {
	try {
		// 1. Таблица для настроек приложения (вместо AsyncStorage)
		db.execSync(`
			CREATE TABLE IF NOT EXISTS local_settings (
				key TEXT PRIMARY KEY,
				value TEXT NOT NULL
			);
		`)

		// 2. Таблица студентов
		db.execSync(`
			CREATE TABLE IF NOT EXISTS local_students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    group_id TEXT NOT NULL, -- Например: "М-11"
    subgroup INTEGER CHECK (subgroup IN (1, 2)), -- 1-я или 2-я подгруппа
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

		`)

		// 3. Таблица посещаемости
		db.execSync(`
			CREATE TABLE IF NOT EXISTS local_attendance (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				student_id INTEGER NOT NULL,
				course_id TEXT NOT NULL,
				date TEXT NOT NULL,
				is_present INTEGER NOT NULL CHECK (is_present IN (0, 1)),
				FOREIGN KEY (student_id) REFERENCES local_students(id) ON DELETE CASCADE
			);
		`)

		// 4. Таблица успеваемости
		db.execSync(`
			CREATE TABLE IF NOT EXISTS local_grades (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				student_id INTEGER NOT NULL,
				course_id TEXT NOT NULL,
				date TEXT NOT NULL,
				grade INTEGER CHECK (grade >= 1 AND grade <= 10),
				comment TEXT,
				FOREIGN KEY (student_id) REFERENCES local_students(id) ON DELETE CASCADE
			);
		`)

		console.log('Все таблицы локальной базы данных успешно инициализированы!')
	} catch (error) {
		console.error('Ошибка инициализации локальной БД:', error)
	}
}
// Сохранить или обновить настройку
export const setLocalSetting = (key: string, value: string) => {
	try {
		db.runSync(
			`INSERT OR REPLACE INTO local_settings (key, value) VALUES (?, ?);`,
			[key, value]
		)
	} catch (error) {
		console.error(`Ошибка записи настройки ${key}:`, error)
	}
}

// Получить настройку
export const getLocalSetting = (key: string): string | null => {
	try {
		const result = db.getFirstSync<{ value: string }>(
			`SELECT value FROM local_settings WHERE key = ?;`,
			[key]
		)
		return result ? result.value : null
	} catch (error) {
		console.error(`Ошибка чтения настройки ${key}:`, error)
		return null
	}
}

// Удалить настройку (например, при выходе)
export const removeLocalSetting = (key: string) => {
	try {
		db.runSync(`DELETE FROM local_settings WHERE key = ?;`, [key])
	} catch (error) {
		console.error(`Ошибка удаления настройки ${key}:`, error)
	}
}

// Очистить все настройки при выходе из профиля
export const clearAllLocalSettings = () => {
	try {
		db.runSync(`DELETE FROM local_settings;`)
	} catch (error) {
		console.error('Ошибка очистки всех настроек:', error)
	}
}

export const insertTestStudents = () => {
	try {
		const countResult = db.getFirstSync<{ count: number }>(
			`SELECT COUNT(*) as count FROM local_students;`
		)

		if (countResult && countResult.count > 0) {
			console.log('Тестовые студенты уже созданы, повторная генерация не требуется.')
			return
		}

		// Студенты для Механического факультета (Группа МК-11)
		const groupMK11 = [
			'Иванов Иван Иванович',
			'Петров Петр Петрович',
			'Сидоров Алексей Николаевич',
			'Смирнов Дмитрий Сергеевич',
			'Кузнецов Андрей Викторович',
			'Волков Сергей Александрович',
			'Попов Роман Игоревич',
			'Васильев Илья Олегович',
			'Соколов Максим Павлович',
			'Михайлов Артем Владимирович'
		]

		// Студенты для Электротехнического факультета (Группа ЭЕ-11)
		const groupET11 = [
			'Новиков Кирилл Дмитриевич',
			'Федоров Даниил Андреевич',
			'Морозов Никита Евгеньевич',
			'Павлов Владислав Олегович',
			'Лебедев Егор Александрович',
			'Козлов Денис Витальевич',
			'Степанов Павел Кириллович',
			'Николаев Матвей Юрьевич',
			'Орлов Тимофей Вадимович',
			'Андреев Богдан Антонович'
		]

		// 1. Вставляем студентов группы М-11 (с разделением на подгруппы)
		groupMK11.forEach((name, index) => {
			// Первые 5 человек в 1-ю подгруппу, остальные во 2-ю
			const subgroup = index < 5 ? 1 : 2 
			db.runSync(
				`INSERT INTO local_students (full_name, group_id, subgroup) VALUES (?, ?, ?);`,
				[name, 'МК-11', subgroup]
			)
		})

		// 2. Вставляем студентов группы Э-11 (с разделением на подгруппы)
		groupET11.forEach((name, index) => {
			// Первые 5 человек в 1-ю подгруппу, остальные во 2-ю
			const subgroup = index < 5 ? 1 : 2
			db.runSync(
				`INSERT INTO local_students (full_name, group_id, subgroup) VALUES (?, ?, ?);`,
				[name, 'ЭТ-11', subgroup]
			)
		})

		console.log('20 тестовых студентов успешно добавлены в SQLite с разделением на подгруппы!')
	} catch (error) {
		console.error('Ошибка при генерации студентов:', error)
	}
}

// Функция для массового импорта студентов из большого текста
export const insertBulkStudents = (bulkText: string, groupId: string, subgroup: number) => {
	try {
		// Разделяем большой текст на отдельные строчки
		const names = bulkText
			.split('\n')                  // Режем по переносу строки
			.map(name => name.trim())     // Убираем лишние пробелы по краям
			.filter(name => name.length > 2) // Игнорируем пустые строки

		if (names.length === 0) return false

		// Записываем всех студентов в SQLite одним пакетным запросом (транзакцией)
		db.withTransactionSync(() => {
			names.forEach(name => {
				db.runSync(
					`INSERT INTO local_students (full_name, group_id, subgroup) VALUES (?, ?, ?);`,
					[name, groupId, subgroup]
				)
			})
		})

		console.log(`Успешно импортировано ${names.length} студентов в группу ${groupId}`)
		return true
	} catch (error) {
		console.error('Ошибка при массовом импорте студентов:', error)
		return false
	}
}
/*📋 Как работает массовый импорт
Вы создаете поле ввода (TextArea), куда преподаватель вставляет список в таком формате:
text
Иванов Иван Иванович
Петров Петр Петрович
Сидоров Алексей Николаевич
Используйте код с осторожностью.
Приложение берет этот текст, разделяет его по строкам и автоматически добавляет каждого студента в локальную базу данных Expo SQLite*/

