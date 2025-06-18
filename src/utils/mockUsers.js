import { ACCOUNT_TYPE } from './constants';

// Имитационные данные пользователей
export const mockUsers = [
  {
    id: '1',
    firstName: 'Иван',
    lastName: 'Петров',
    email: 'student@example.com',
    password: 'password123',
    accountType: ACCOUNT_TYPE.STUDENT,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student',
  },
  {
    id: '2',
    firstName: 'Елена',
    lastName: 'Смирнова',
    email: 'instructor@example.com',
    password: 'password123',
    accountType: ACCOUNT_TYPE.INSTRUCTOR,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor',
  },
];
