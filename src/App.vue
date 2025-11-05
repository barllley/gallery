<template>
  <div id="app">
    <header>
      <nav>
        <!-- Если пользователь аутентифицирован -->
        <div v-if="isAuthenticated && user">
          <p>Добро пожаловать, {{ user.name }}!</p>
          <button @click="logout">Выйти</button>
        </div>

        <!-- Если пользователь НЕ аутентифицирован -->
        <div v-else>
          <form @submit.prevent="login">
            <h2>Вход в систему</h2>

            <div>
              <label for="email">Email:</label>
              <input
                type="email"
                id="email"
                v-model="email"
                required
                placeholder="Введите ваш email"
              >
            </div>

            <div>
              <label for="password">Пароль:</label>
              <input
                type="password"
                id="password"
                v-model="password"
                required
                placeholder="Введите ваш пароль"
              >
            </div>

            <button type="submit">Войти</button>

            <div v-if="authError" class="error">
              {{ authError }}
            </div>
          </form>
        </div>
      </nav>
    </header>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'App',

  data() {
    return {
      email: '',
      password: '',
      authStore: useAuthStore()
    };
  },

  computed: {
    isAuthenticated() {
      return this.authStore.isAuthenticated;
    },

    user() {
      return this.authStore.user;
    },

    authError() {
      return this.authStore.errorMessage;
    }
  },

  methods: {
    async login() {
      const credentials = {
        email: this.email,
        password: this.password
      };

      await this.authStore.login(credentials);

      this.email = '';
      this.password = '';
    },

    logout() {
      this.authStore.logout();
    }
  },

  mounted() {

    if (this.authStore.token) {
      this.authStore.isAuthenticated = true;

      this.authStore.getUser();
    }
  }
};
</script>

<style>
.error {
  color: red;
  margin-top: 10px;
  padding: 10px;
  border: 1px solid red;
  border-radius: 4px;
}

form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

header {
  padding: 20px;
  border-bottom: 1px solid #141e27;
}

main {
  padding: 20px;
  text-align: center;
}
</style>
