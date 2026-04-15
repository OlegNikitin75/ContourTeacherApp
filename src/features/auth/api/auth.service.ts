import { supabase } from '@/core/lib/supabase'

export const authService = {
  // Регистрация нового пользователя
  async signUp(userEmail: string, userPassword: string) {
    const { data, error } = await supabase.auth.signUp({
      email:userEmail,
      password: userPassword,
    });
    if (error) throw error;
    return data;
  },

  // Обновление данных профиля и установка флага готовности
  async completeProfile(userId: string, fullName: string, role: 'teacher' | 'student') {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        full_name: fullName, 
        role: role,
        is_complete: true, // Критически важно для редиректа в RootLayout
        updated_at: new Date() 
      })
      .eq('id', userId);
    
    if (error) throw error;
    
    // Принудительно обновляем сессию, чтобы RootLayout увидел изменения в реальном времени
    await supabase.auth.refreshSession();
  }
};