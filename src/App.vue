<template>
  <Menubar :model="items">
    <template #start>
      <span>
        <img src="@/assets/logo_dark.svg" width="120" height="90" alt="My SVG Icon"/>
      </span>
    </template>

    <template #item="{ item, props, hasSubmenu, root }">
      <a class="flex items-center ml-6 p-4">
        <router-link v-if="item.route" :to="item.route" class="flex items-center">
          <span :class="item.icon"/>
          <span class="ml-1">{{ item.label }}</span>
        </router-link>
      </a>
    </template>

    <template #end>
      <div class="flex items-center gap-1">
        <div v-if="authStore.isAuthenticated && authStore.user">
          <span class="pi pi-fw pi-user mr-4"/>
          {{ authStore.user.name }}
          <Button @click="logout" class="ml-4">Выйти</Button>
        </div>
        <div v-else>
          <form @submit.prevent="login">
            <InputText
              v-model="email"
              type="email"
              id="email"
              required
              placeholder="Email"
              class="w-40 mr-1"
              :class="{'p-invalid': authStore.errorMessage}"
            />
            <InputText
              v-model="password"
              type="password"
              id="password"
              required
              placeholder="Пароль"
              class="w-40 mr-1"
              :class="{'p-invalid': authStore.errorMessage}"
            />
            <Button type="submit" class="mr-1">Войти</Button>
            <div class="ml-2">
              <small v-if="authStore.errorMessage" class="error">{{ authStore.errorMessage }}</small>
            </div>
          </form>
        </div>
      </div>
    </template>
  </Menubar>
  <router-view></router-view>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'
import Button from "primevue/button"
import Menubar from "primevue/menubar"
import InputText from "primevue/inputtext"

export default {
  name: 'App',
  components: { Button, Menubar, InputText },
  data() {
    return {
      email: '',
      password: '',
      authStore: useAuthStore(),
      baseItems: [
        {
          label: 'Главная',
          icon: 'pi pi-fw pi-home',
          route: '/'
        },
        {
          label: 'Выставки',
          icon: 'pi pi-fw pi-images',
          route: '/exhibitions'
        },
        {
          label: 'Билеты',
          icon: 'pi pi-fw pi-ticket',
          route: '/tickets'
        },
        {
          label: 'Корзина',
          icon: 'pi pi-fw pi-shopping-cart',
          route: '/cart'
        }
      ]
    }
  },
  computed: {
    items() {
      const items = [...this.baseItems]
      if (this.authStore.isAuthenticated && this.authStore.user && this.authStore.user.is_admin) {
        items.push({
          label: 'Пользователи',
          icon: 'pi pi-fw pi-users',
          route: '/users'
        })
      }

      return items
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
  padding: 1rem 1rem;
}

.error {
  color: #ef4444;
  font-size: 0.875rem;
}

form {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

form .p-inputtext,
form .p-button {
  margin-right: 0.25rem;
}

/* Стили для увеличения расстояния между пунктами меню */
.p-menubar .p-menubar-root-list {
  display: flex;
  gap: 1rem;
}

.p-menubar .p-menubar-root-list > .p-menuitem {
  margin: 0 0.75rem;
}

/* Адаптивные стили для формы */
@media (max-width: 768px) {
  .p-menubar .p-menubar-root-list {
    gap: 0.5rem;
  }

  .p-menubar .p-menubar-root-list > .p-menuitem {
    margin: 0 0.25rem;
  }

  form {
    flex-direction: column;
    align-items: stretch;
  }

  .m-2 {
    margin: 0.25rem 0;
  }

  .sm\\:w-auto {
    width: 100% !important;
  }

  /* Уменьшаем логотип на мобильных */
  img[alt="My SVG Icon"] {
    width: 60px !important;
    height: 60px !important;
  }
}
</style>
