import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

import 'primevue/resources/primevue.min.css'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primeicons/primeicons.css'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Toast from 'primevue/toast'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'
import FileUpload from 'primevue/fileupload'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue)
app.use(ToastService)

app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Toast', Toast)
app.component('InputText', InputText)
app.component('Textarea', Textarea)
app.component('Calendar', Calendar)
app.component('Button', Button)
app.component('FileUpload', FileUpload)

app.mount('#app')
