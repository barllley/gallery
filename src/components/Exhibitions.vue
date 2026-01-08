<template>
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
      <Column field="id" header="ID"/>
      <Column field="title" header="Название выставки"/>
      <Column field="description" header="Описание"/>
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
    }
  }
}
</script>

<style scoped>
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
</style>
