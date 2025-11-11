<template>
  <div id="app">
    <header>
      <nav>
        <ul>
          <li><router-link to="/">Главная</router-link></li>
          <li><router-link to="/exhibitions">Выставки</router-link></li>
          <li><router-link to="/tickets">Билеты</router-link></li>
          <li v-if="!authStore.isAuthenticated"><router-link to="/login">Войти</router-link></li>
        </ul>

        <div v-if="authStore.isAuthenticated" class="user-info">
          <span v-if="authStore.user">Добро пожаловать, {{ authStore.user.name }}!</span>
          <button @click="logout">Выйти</button>
        </div>
      </nav>
    </header>

    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'App',
  data() {
    return {
      authStore: useAuthStore()
    };
  },
  async mounted() {

    await this.authStore.checkAuth();
  },
  methods: {
    logout() {
      this.authStore.logout();
    }
  }
};
</script>

<style>
header {
  background: #2c3e50;
  padding: 0 20px;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  height: 60px;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 30px;
  margin: 0;
  padding: 0;
}

nav ul li a {
  color: white;
  text-decoration: none;
}

nav ul li a.router-link-active {
  color: #3498db;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
}

button {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

main {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
