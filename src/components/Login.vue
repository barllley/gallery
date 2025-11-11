<template>
  <div class="login">
    <h2>Вход в систему</h2>
    <form @submit.prevent="login">
      <div>
        <label>Email:</label>
        <input type="email" v-model="email" required>
      </div>

      <div>
        <label>Пароль:</label>
        <input type="password" v-model="password" required>
      </div>

      <button type="submit">Войти</button>

      <div v-if="authError" class="error">
        {{ authError }}
      </div>
    </form>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  computed: {
    authError() {
      const authStore = useAuthStore();
      return authStore.errorMessage;
    }
  },
  methods: {
    async login() {
      const authStore = useAuthStore();
      const credentials = {
        email: this.email,
        password: this.password
      };

      const result = await authStore.login(credentials);

      if (result.success) {
        // Перенаправляем на главную страницу после успешного входа
        this.$router.push('/');
      }

      this.email = '';
      this.password = '';
    }
  }
}
</script>

<style scoped>
.login {
  padding: 40px 20px;
  max-width: 400px;
  margin: 0 auto;
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
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error {
  color: red;
  margin-top: 15px;
  padding: 10px;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}
</style>
