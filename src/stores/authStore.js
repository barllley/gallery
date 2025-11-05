import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    errorMessage: ''
  }),

  actions: {
    async login(credentials) {
      try {
        this.errorMessage = '';

        const response = await axios.post(
          `http://localhost:8000/api/login`,
          credentials,
          {
            headers: {
              'Content-Type': 'application/json',
              'Client-ID': 'TestClient',
              'Client-Secret': 'test_secret'
            }
          }
        );

        if (response.data && response.data.token) {
          this.token = response.data.token;
          this.user = response.data.user;
          this.isAuthenticated = true;

          localStorage.setItem('token', this.token);

          return { success: true };
        }
      } catch (error) {
        if (error.response && error.response.data) {
          this.errorMessage = error.response.data.message || 'Ошибка аутентификации';
        } else {
          this.errorMessage = 'Сервер недоступен. Убедитесь, что бэкенд запущен на localhost:8000';
        }
        return { success: false, error: this.errorMessage };
      }
    },

    async getUser() {
      try {
        if (!this.token) {
          throw new Error('Токен отсутствует');
        }

        const response = await axios.get(
          `http://localhost:8000/api/user`,
          {
            headers: {
              'Authorization': `Bearer ${this.token}`,
              'Client-ID': 'TestClient',
              'Client-Secret': 'test_secret'
            }
          }
        );

        if (response.data) {
          this.user = response.data;
          return { success: true };
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.errorMessage = 'Недействительный токен';
          this.logout();
        } else if (error.response && error.response.data) {
          this.errorMessage = error.response.data.message || 'Ошибка получения данных пользователя';
        } else {
          this.errorMessage = 'Сервер недоступен. Убедитесь, что бэкенд запущен на localhost:8000';
        }
        return { success: false, error: this.errorMessage };
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      this.errorMessage = '';

      localStorage.removeItem('token');
    }
  },

  getters: {
    getUserData: (state) => state.user,
    getAuthStatus: (state) => state.isAuthenticated,
    getErrorMessage: (state) => state.errorMessage
  }
});
