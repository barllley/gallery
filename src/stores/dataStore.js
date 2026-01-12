import { defineStore } from 'pinia';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const useDataStore = defineStore('data', {
    state: () => ({
        exhibitions: [],
        exhibitions_total: 0,
        tickets: [],
        tickets_total: 0,
        errorMessage: "",
        loading: false,
    }),

    actions: {
        async get_exhibitions(page = 0, perpage = 5) {
            this.loading = true;
            this.errorMessage = "";
            try {
                const response = await axios.get(backendUrl + '/exhibitions', {
                    params: {
                        page: page,
                        perpage: perpage
                    }
                });
                this.exhibitions = response.data;
            } catch (error) {
                if (error.response) {
                    this.errorMessage = error.response.data.message;
                    console.log(error);
                } else if (error.request) {
                    this.errorMessage = error.message;
                    console.log(error);
                } else {
                    console.log(error);
                }
            } finally {
                this.loading = false;
            }
        },

        async get_exhibitions_total() {
            this.errorMessage = "";
            try {
                const response = await axios.get(backendUrl + '/exhibitions_total');
                this.exhibitions_total = response.data.total;
            } catch (error) {
                if (error.response) {
                    this.errorMessage = error.response.data.message;
                    console.log(error);
                } else if (error.request) {
                    this.errorMessage = error.message;
                    console.log(error);
                } else {
                    console.log(error);
                }
            }
        },

        async get_tickets(page = 0, perpage = 5) {
            this.loading = true;
            this.errorMessage = "";
            try {
                const response = await axios.get(backendUrl + '/tickets', {
                    params: {
                        page: page,
                        perpage: perpage
                    }
                });
                this.tickets = response.data;
            } catch (error) {
                if (error.response) {
                    this.errorMessage = error.response.data.message;
                    console.log(error);
                } else if (error.request) {
                    this.errorMessage = error.message;
                    console.log(error);
                } else {
                    console.log(error);
                }
            } finally {
                this.loading = false;
            }
        },

        async create_new_exhibition(formData) {
          this.loading = true
          this.errorMessage = ''
          this.uploadProgress = 0

          try {
            // получаем токен из localStorage
            const token = localStorage.getItem('token')

            if (!token) {
              throw new Error('Требуется авторизация')
            }

            const response = await axios.post(`${backendUrl}/exhibitions`, formData, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
                'Client-ID': 'TestClient',
                'Client-Secret': 'test_secret'
              },
              onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                  this.uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                }
              }
            })

            // Добавляем новую выставку в начало списка
            if (response.data.data) {
              this.exhibitions = [response.data.data, ...this.exhibitions]
              this.exhibitions_total += 1
            }

            return {
              success: true,
              data: response.data
            }

          } catch (error) {
            this.handleError(error)
            return {
              success: false,
              error: this.errorMessage
            }
          } finally {
            this.loading = false
            this.uploadProgress = 0
          }
        },

        async get_tickets_total() {
            this.errorMessage = "";
            try {
                const response = await axios.get(backendUrl + '/tickets_total');
                this.tickets_total = response.data.total;
            } catch (error) {
                if (error.response) {
                    this.errorMessage = error.response.data.message;
                    console.log(error);
                } else if (error.request) {
                    this.errorMessage = error.message;
                    console.log(error);
                } else {
                    console.log(error);
                }
            }
        }
    }
});
