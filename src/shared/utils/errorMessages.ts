const errorTranslations: Record<string, string> = {
  'invalid login credentials': 'Неверный email или пароль',
  'email not confirmed': 'Почта не подтверждена. Пожалуйста, проверьте ящик',
  'rate limit exceeded': 'Слишком много попыток. Подождите немного',
  'user already registered': 'Этот email уже занят',
  'network request failed': 'Проблема с интернетом. Проверьте соединение',
  'invalid code': 'Код недействителен',
  // Добавляй сюда новые фразы по мере появления
};

export const translateError = (message: string): string => {
  const msg = message.toLowerCase();
  
  // Ищем совпадение в словаре
  const translation = Object.keys(errorTranslations).find(key => msg.includes(key));
  
  return translation ? errorTranslations[translation] : 'Произошла непредвиденная ошибка';
};
