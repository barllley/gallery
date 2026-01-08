import { defineStore } from 'pinia';
import axios from 'axios';

// Добавляем строку с использованием переменной окружения
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: false,
    errorMessage: ''
  }),

  actions: {
    async login(credentials) {
      try {
        this.errorMessage = '';

        // Заменяем абсолютный URL на переменную окружения
        const response = await axios.post(
          `${backendUrl}/login`, // Изменено здесь
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
          this.errorMessage = 'Сервер недоступен. Убедитесь, что бэкенд запущен';
        }
        return { success: false, error: this.errorMessage };
      }
    },

    async checkAuth() {
      if (this.token) {
        try {
          // Заменяем абсолютный URL на переменную окружения
          const response = await axios.get(
            `${backendUrl}/user`, // Изменено здесь
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
            this.isAuthenticated = true;
            return true;
          }
        } catch (error) {
          this.logout();
        }
      }
      return false;
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      this.errorMessage = '';

      localStorage.removeItem('token');
    }
  }
});
