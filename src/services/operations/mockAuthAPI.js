import { toast } from 'react-hot-toast';
import { setLoading, setToken } from '../../slices/authSlice';
import { setUser } from '../../slices/profileSlice';
import { mockUsers } from '../../utils/mockUsers';

// Имитация входа в систему
export function mockLogin(email, password, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      // Имитация задержки сети
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Поиск пользователя по email и паролю
      const user = mockUsers.find(
        (user) => user.email === email && user.password === password
      );
      
      if (!user) {
        toast.error('Неверный email или пароль');
        return;
      }
      
      // Имитация JWT токена (просто строка с датой)
      const token = `mock-token-${Date.now()}`;
      
      // Сохраняем токен в localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Обновляем состояние Redux
      dispatch(setToken(token));
      dispatch(setUser(user));
      
      toast.success('Вход выполнен успешно');
      
      // Перенаправление на страницу профиля
      navigate('/dashboard/my-profile');
    } catch (error) {
      console.log('Ошибка входа:', error);
      toast.error('Что-то пошло не так. Попробуйте позже.');
    }
    dispatch(setLoading(false));
  };
}

// Имитация выхода из системы
export function mockLogout(navigate) {
  return (dispatch) => {
    // Очистка localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Сброс состояния Redux
    dispatch(setToken(null));
    dispatch(setUser(null));
    
    toast.success('Вы вышли из системы');
    
    // Перенаправление на домашнюю страницу
    navigate('/');
  };
}

// Имитация проверки авторизации при загрузке страницы
export function mockLoadUserData() {
  return (dispatch) => {
    try {
      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');
      
      if (token && userString) {
        const user = JSON.parse(userString);
        dispatch(setToken(token));
        dispatch(setUser(user));
      }
    } catch (error) {
      console.log('Ошибка загрузки данных пользователя:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };
}
