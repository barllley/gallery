<template>
  <div class="create-exhibition">
    <div class="header">
      <Button
        @click="goBack"
        icon="pi pi-arrow-left"
        class="p-button-text p-button-secondary mb-4"
        label="Назад к списку"
      />
      <h1 class="title">Новая выставка</h1>
    </div>

    <Message v-if="errorMessage" severity="error" @close="clearErrorMessage">
      {{ errorMessage }}
    </Message>

    <Message v-if="successMessage" severity="success" @close="clearSuccessMessage">
      {{ successMessage }}
    </Message>

    <form @submit.prevent="submitForm" class="form">
      <label class="label">Название выставки <span class="required">*</span></label>
      <InputText
        v-model="form.title"
        placeholder="Введите название выставки"
        :disabled="loading"
        :class="{ 'p-invalid': formErrors.title }"
        class="input"
      />
      <small v-if="formErrors.title" class="error-text">{{ formErrors.title }}</small>

      <label class="label">Описание <span class="required">*</span></label>
      <Textarea
        v-model="form.description"
        placeholder="Введите описание выставки"
        rows="4"
        :disabled="loading"
        :class="{ 'p-invalid': formErrors.description }"
        class="textarea"
      />
      <small v-if="formErrors.description" class="error-text">{{ formErrors.description }}</small>

      <label class="label">Дата начала <span class="required">*</span></label>
      <Calendar
        v-model="form.start_date"
        :disabled="loading"
        :class="{ 'p-invalid': formErrors.start_date }"
        dateFormat="yy-mm-dd"
        showIcon
        class="calendar"
      />
      <small v-if="formErrors.start_date" class="error-text">{{ formErrors.start_date }}</small>

      <label class="label">Дата окончания <span class="required">*</span></label>
      <Calendar
        v-model="form.end_date"
        :disabled="loading"
        :minDate="form.start_date ? new Date(form.start_date) : null"
        :class="{ 'p-invalid': formErrors.end_date }"
        dateFormat="yy-mm-dd"
        showIcon
        class="calendar"
      />
      <small v-if="formErrors.end_date" class="error-text">{{ formErrors.end_date }}</small>

      <label class="label">Изображение <span class="required">*</span></label>
      <FileUpload
        mode="basic"
        :chooseLabel="form.image ? form.image.name : 'Выберите файл'"
        accept="image/*"
        :maxFileSize="5000000"
        :disabled="loading"
        :class="{ 'p-invalid': formErrors.image }"
        @select="handleFileSelect"
        class="file-upload"
      />
      <small v-if="formErrors.image" class="error-text">{{ formErrors.image }}</small>
      <div class="file-hint">
        Поддерживаемые форматы: JPEG, PNG, GIF, WebP. Максимальный размер: 5MB
      </div>

      <div v-if="previewImage" class="preview-container">
        <p class="preview-label">Предпросмотр:</p>
        <img :src="previewImage" alt="Предпросмотр" class="preview-image">
      </div>

      <div class="buttons">
        <Button
          type="button"
          @click="goBack"
          label="Отмена"
          :disabled="loading"
          class="cancel-button"
        />
        <Button
          type="submit"
          label="Создать выставку"
          :disabled="loading"
          :loading="loading"
          class="submit-button"
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Calendar from 'primevue/calendar'
import FileUpload from 'primevue/fileupload'
import Message from 'primevue/message'

const router = useRouter()

// Состояние формы
const form = reactive({
  title: '',
  description: '',
  start_date: null,
  end_date: null,
  image: null
})

// Состояние ошибок валидации
const formErrors = reactive({
  title: '',
  description: '',
  start_date: '',
  end_date: '',
  image: ''
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const previewImage = ref('')

// Методы
const goBack = () => {
  router.push('/exhibitions')
}

const clearErrorMessage = () => {
  errorMessage.value = ''
}

const clearSuccessMessage = () => {
  successMessage.value = ''
}

const handleFileSelect = (event) => {
  const file = event.files[0]
  if (file) {
    form.image = file
    formErrors.image = ''
    errorMessage.value = ''

    // Создание превью
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImage.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const validateForm = () => {
  let isValid = true
  formErrors.title = ''
  formErrors.description = ''
  formErrors.start_date = ''
  formErrors.end_date = ''
  formErrors.image = ''
  errorMessage.value = ''

  if (!form.title.trim()) {
    formErrors.title = 'Введите название выставки'
    isValid = false
  }

  if (!form.description.trim()) {
    formErrors.description = 'Введите описание выставки'
    isValid = false
  }

  if (!form.start_date) {
    formErrors.start_date = 'Выберите дату начала'
    isValid = false
  }

  if (!form.end_date) {
    formErrors.end_date = 'Выберите дату окончания'
    isValid = false
  } else if (form.start_date && new Date(form.end_date) < new Date(form.start_date)) {
    formErrors.end_date = 'Дата окончания должна быть позже даты начала'
    isValid = false
  }

  if (!form.image) {
    formErrors.image = 'Выберите изображение'
    isValid = false
  }

  return isValid
}

const submitForm = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('description', form.description)
    formData.append('start_date', form.start_date ? new Date(form.start_date).toISOString().split('T')[0] : '')
    formData.append('end_date', form.end_date ? new Date(form.end_date).toISOString().split('T')[0] : '')
    formData.append('image', form.image)

    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('Требуется авторизация')
    }

    const response = await fetch('http://localhost:8000/api/exhibitions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Client-ID': 'TestClient',
        'Client-Secret': 'test_secret'
      },
      body: formData
    })

    const data = await response.json()

    if (response.ok) {
      successMessage.value = 'Выставка успешно создана!'
      resetForm()

      setTimeout(() => {
        router.push('/exhibitions')
      }, 2000)

    } else {
      if (data.errors) {
        const errors = Object.values(data.errors).flat()
        errorMessage.value = errors.join('. ')
      } else if (data.message) {
        errorMessage.value = data.message
      } else {
        errorMessage.value = 'Ошибка при создании выставки'
      }
    }

  } catch (error) {
    console.error('Ошибка:', error)
    if (error.message.includes('Failed to fetch')) {
      errorMessage.value = 'Сервер не отвечает. Проверьте подключение к сети.'
    } else {
      errorMessage.value = error.message || 'Произошла ошибка'
    }
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.start_date = null
  form.end_date = null
  form.image = null
  previewImage.value = ''
}
</script>

<style scoped>
.create-exhibition {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  margin-bottom: 30px;
}

.title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 10px 0 0 0;
}

.form {
  display: flex;
  flex-direction: column;
}

.label {
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  margin-top: 20px;
  font-size: 14px;
}

.required {
  color: #f87171;
}

.input,
.textarea,
.calendar,
.file-upload {
  width: 100%;
  margin-bottom: 4px;
}

.error-text {
  color: #f87171;
  font-size: 12px;
  margin-bottom: 5px;
  display: block;
}

.file-hint {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  margin-bottom: 20px;
}

.preview-container {
  margin-top: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.preview-label {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.preview-image {
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
}

.buttons {
  display: flex;
  gap: 10px;
  margin-top: 30px;
}

.cancel-button {
  flex: 1;
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
}

.cancel-button:hover:not(:disabled) {
  background: #e9ecef;
  border-color: #ced4da;
}

.submit-button {
  flex: 1;
  background: #10b981;
  border-color: #10b981;
}

.submit-button:hover:not(:disabled) {
  background: #059669;
  border-color: #059669;
}

@media (max-width: 768px) {
  .create-exhibition {
    padding: 15px;
  }

  .buttons {
    flex-direction: column;
  }

  .cancel-button,
  .submit-button {
    width: 100%;
  }
}
</style>
