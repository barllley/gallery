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
  background: rgb(255, 255, 255);
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

/* увеличения расстояния между пунктами меню */
.p-menubar .p-menubar-root-list {
  display: flex;
  gap: 1rem;
}

.p-menubar .p-menubar-root-list > .p-menuitem {
  margin: 0 0.75rem;
}

.p-inputtext {
  border: 1px solid #ced4da !important;
  border-radius: 0.375rem !important;
  padding: 0.375rem 0.75rem !important;
  font-size: 1rem !important;
  line-height: 1.5 !important;
  color: #495057 !important;
  background-color: #fff !important;
  background-clip: padding-box !important;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out !important;
}

.p-inputtext:focus {
  color: #495057 !important;
  background-color: #fff !important;
  border-color: #86b7fe !important;
  outline: 0 !important;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
}

.p-inputtext.p-invalid {
  border-color: #dc3545 !important;
}

.p-inputtext.p-invalid:focus {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25) !important;
}

.p-inputtext::placeholder {
  color: #6c757d !important;
  opacity: 1 !important;
}

.p-button {
  color: #fff !important;
  background-color: #0d6efd !important;
  border-color: #0d6efd !important;
  border: 1px solid transparent !important;
  padding: 0.375rem 0.75rem !important;
  font-size: 1rem !important;
  font-weight: 400 !important;
  line-height: 1.5 !important;
  border-radius: 0.375rem !important;
  text-align: center !important;
  text-decoration: none !important;
  vertical-align: middle !important;
  cursor: pointer !important;
  user-select: none !important;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
}

.p-button:hover {
  color: #fff !important;
  background-color: #0b5ed7 !important;
  border-color: #0a58ca !important;
}

.p-button:focus {
  color: #fff !important;
  background-color: #0b5ed7 !important;
  border-color: #0a58ca !important;
  outline: 0 !important;
  box-shadow: 0 0 0 0.25rem rgba(49, 132, 253, 0.5) !important;
}

.p-button:active {
  color: #fff !important;
  background-color: #0a58ca !important;
  border-color: #0a53be !important;
}

/* Кнопка Выйти */
.p-button.p-button-text {
  color: #6c757d !important;
  background-color: transparent !important;
  border-color: transparent !important;
}

.p-button.p-button-text:hover {
  color: #fff !important;
  background-color: #6c757d !important;
  border-color: #6c757d !important;
}

/* Размеры полей */
.w-40 {
  width: 190px !important;
}

.error {
  color: #dc3545 !important;
  font-size: 0.875rem !important;
  margin-top: 0.25rem !important;
}

form {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* адаптивные стили для формы */
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
    gap: 0.5rem;
    width: 100%;
  }

  .p-inputtext,
  .p-button {
    width: 100% !important;
    margin-right: 0 !important;
  }

  .w-40 {
    width: 100% !important;
  }

  img[alt="My SVG Icon"] {
    width: 60px !important;
    height: 60px !important;
  }
}

@media (max-width: 480px) {
  .p-menubar {
    padding: 0.5rem !important;
  }

  form {
    gap: 0.25rem;
  }
}

/* Стили для иконок в меню */
.pi {
  font-size: 1rem;
}

.pi-fw {
  width: 1.5em;
  text-align: center;
}

.ml-1 { margin-left: 0.25rem; }
.ml-2 { margin-left: 0.5rem; }
.ml-4 { margin-left: 1rem; }
.ml-6 { margin-left: 1.5rem; }
.mr-1 { margin-right: 0.25rem; }
.mr-4 { margin-right: 1rem; }
.p-4 { padding: 1rem; }
</style>
