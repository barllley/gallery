<template>
  <div id="app" class="bg-white min-h-screen">
    <Menubar :model="items" class="bg-white shadow-sm border-b">
      <template #start>
        <div class="flex items-center gap-3">
          <img alt="logo" src="@/assets/logo_dark.svg"/>
        </div>
      </template>

      <template #item="{ item }">
        <router-link
          :to="item.route"
          class="p-menuitem-link flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
          :class="{
            'bg-blue-50 text-blue-600': $route.path === item.route,
            'text-gray-700 hover:bg-gray-100': $route.path !== item.route
          }"
        >
          <span :class="item.icon" class="text-lg"></span>
          <span class="font-medium">{{ item.label }}</span>
        </router-link>
      </template>

      <template #end>
        <div class="flex items-center gap-4">
          <div v-if="authStore.isAuthenticated && authStore.user" class="flex items-center gap-3">
            <span class="pi pi-user text-gray-600"></span>
            <span class="text-gray-800 font-medium">{{ authStore.user.name }}</span>
            <Button
              @click="logout"
              label="Выйти"
              text
              class="text-gray-600 hover:text-gray-800"
            />
          </div>
          <div v-else class="flex items-center gap-2">
            <InputText
              v-model="email"
              type="email"
              placeholder="Email"
              class="w-40 border-gray-300"
            />
            <InputText
              v-model="password"
              type="password"
              placeholder="Пароль"
              class="w-40 border-gray-300"
            />
            <Button
              @click="login"
              label="Войти"
              class="bg-blue-600 border-blue-600 hover:bg-blue-700"
            />
            <small v-if="authStore.errorMessage" class="text-red-500 text-sm max-w-xs">
              {{ authStore.errorMessage }}
            </small>
          </div>
        </div>
      </template>
    </Menubar>

    <main class="p-6 bg-gray-50 min-h-screen">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

export default {
  name: 'App',
  components: {
    Menubar,
    Button,
    InputText
  },
  data() {
    return {
      email: '',
      password: '',
      authStore: useAuthStore(),
      items: [
        {
          label: 'Главная',
          icon: 'pi pi-home',
          route: '/'
        },
        {
          label: 'Выставки',
          icon: 'pi pi-images',
          route: '/exhibitions'
        },
        {
          label: 'Билеты',
          icon: 'pi pi-ticket',
          route: '/tickets'
        }
      ]
    }
  },
  async mounted() {
    await this.authStore.checkAuth()
  },
  methods: {
    async login() {
      const credentials = {
        email: this.email,
        password: this.password
      }

      const result = await this.authStore.login(credentials)

      if (result.success) {
        this.email = ''
        this.password = ''
      }
    },
    logout() {
      this.authStore.logout()
    }
  }
}
</script>

<style>
.p-menubar {
  background: white;
  border: none;
  border-bottom: 1px solid #e5e7eb;
  border-radius: 0;
  padding: 0.5rem 1rem;
}

.p-menuitem-link {
  text-decoration: none;
}
</style>
