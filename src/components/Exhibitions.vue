<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1><i class="pi pi-palette mr-2"></i>Все выставки</h1>
      <router-link to="/CreateExhibitions" class="btn btn-success">
        <i class="pi pi-plus mr-1"></i>Создать выставку
      </router-link>
    </div>
    <div class="container">
      <DataTable
        :value="exhibitions"
        :lazy="true"
        :loading="dataStore.loading"
        :paginator="true"
        :rows="perpage"
        :rowsPerPageOptions="[2, 5, 10]"
        :totalRecords="exhibitions_total"
        @page="onPageChange"
        responsiveLayout="scroll"
        :first="offset"
        class="p-datatable-striped p-datatable-gridlines"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      >
        <Column field="id" header="ID" style="width: 80px;"/>

        <Column header="Изображение" style="width: 100px;">
          <template #body="slotProps">
            <div v-if="slotProps.data.image_url">
              <img
                :src="slotProps.data.image_url"
                :alt="slotProps.data.title"
                class="exhibition-image"
                @click="openImage(slotProps.data.image_url)"
              />
            </div>
            <div v-else class="no-image">
              <i class="pi pi-image" style="font-size: 1.5rem; color: #ccc;"></i>
            </div>
          </template>
        </Column>

        <Column field="title" header="Название выставки"/>
        <Column field="description" header="Описание">
          <template #body="slotProps">
            <div class="description-truncate">
              {{ truncateText(slotProps.data.description, 50) }}
            </div>
          </template>
        </Column>
        <Column field="start_date" header="Дата начала">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.start_date) }}
          </template>
        </Column>
        <Column field="end_date" header="Дата окончания">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.end_date) }}
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useDataStore } from '@/stores/dataStore';

export default {
  name: "Exhibitions",
  components: { DataTable, Column },
  data() {
    return {
      dataStore: useDataStore(),
      perpage: 5,
      offset: 0,
    }
  },
  computed: {
    exhibitions() {
      return this.dataStore.exhibitions;
    },
    exhibitions_total() {
      return this.dataStore.exhibitions_total;
    }
  },
  mounted() {
    console.log('Exhibitions component MOUNTED!');
    this.dataStore.get_exhibitions();
    this.dataStore.get_exhibitions_total();
    console.log('Exhibitions-', this.exhibitions);
  },
  methods: {
    onPageChange(event) {
      this.offset = event.first;
      this.perpage = event.rows;
      this.dataStore.get_exhibitions(this.offset / this.perpage, this.perpage);
    },
    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString('ru-RU');
    },
    truncateText(text, maxLength) {
      if (!text) return '';
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    },
    openImage(imageUrl) {
      window.open(imageUrl, '_blank');
    }
  }
}
</script>

<style scoped>
  .exhibition-image {
    width: 80px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .exhibition-image:hover {
    transform: scale(1.05);
  }

  .no-image {
    width: 80px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f9fa;
    border-radius: 4px;
    border: 1px solid #dee2e6;
  }

  .description-truncate {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Стили для пагинации */
  :deep(.p-paginator) {
    padding: 1rem;
  }

  :deep(.p-paginator .p-paginator-first),
  :deep(.p-paginator .p-paginator-prev),
  :deep(.p-paginator .p-paginator-next),
  :deep(.p-paginator .p-paginator-last),
  :deep(.p-paginator .p-paginator-page) {
    min-width: 2.5rem;
    height: 2.5rem;
    margin: 0.143rem;
    border-radius: 3px;
    transition: background-color 0.2s, border-color 0.2s;
  }

  :deep(.p-paginator .p-paginator-page) {
    background: #ffffff;
    color: #6c757d;
  }

  :deep(.p-paginator .p-paginator-page:hover) {
    background: #e9ecef;
    border-color: #dee2e6;
    color: #6c757d;
  }

  :deep(.p-paginator .p-paginator-page.p-highlight) {
    background: #007bff;
    border-color: #007bff;
    color: #ffffff;
  }

  :deep(.p-paginator .p-paginator-page.p-highlight:hover) {
    background: #0056b3;
    border-color: #0056b3;
    color: #ffffff;
  }

  /* Стили для выбора количества строк на странице*/
  :deep(.p-dropdown) {
    border-radius: 4px;
    transition: border-color 0.2s;
  }

  :deep(.p-dropdown:hover) {
    border-color: #007bff;
  }

  :deep(.p-dropdown.p-focus) {
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }

  :deep(.p-dropdown-panel .p-dropdown-items .p-dropdown-item) {
    padding: 0.5rem 1rem;
    transition: background-color 0.2s;
  }

  :deep(.p-dropdown-panel .p-dropdown-items .p-dropdown-item:hover) {
    background-color: #f8f9fa;
    color: #495057;
  }

  :deep(.p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight) {
    background-color: #007bff;
    color: #ffffff;
  }

  :deep(.p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight:hover) {
    background-color: #0056b3;
    color: #ffffff;
  }

  /* Стили для строк таблицы */
  :deep(.p-datatable .p-datatable-tbody > tr) {
    transition: background-color 0.2s;
  }

  :deep(.p-datatable .p-datatable-tbody > tr:hover) {
    background-color: #f8f9fa;
  }

  :deep(.p-datatable .p-datatable-thead > tr > th) {
    background-color: #f8f9fa;
    font-weight: 600;
  }
</style>
