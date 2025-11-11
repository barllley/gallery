<template>
  <div class="tickets">
    <h1>Билеты</h1>

    <div v-if="isAuthenticated">
      <div class="ticket">
        <h3>Однодневный билет</h3>
        <p class="price">500 руб.</p>
        <button>Купить билет</button>
      </div>
    </div>

    <div v-else>
      <p>Для покупки билетов необходимо войти в систему</p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'Tickets',
  computed: {
    isAuthenticated() {
      const authStore = useAuthStore();
      return authStore.isAuthenticated;
    }
  }
}
</script>

<style scoped>
.tickets {
  padding: 20px;
}

.ticket {
  border: 1px solid #ddd;
  padding: 20px;
  margin: 20px 0;
  border-radius: 5px;
  text-align: center;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #007bff;
  margin: 10px 0;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
