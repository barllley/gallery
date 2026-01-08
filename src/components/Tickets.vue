<template>
  <div class="container">
    <DataTable
      :value="tickets"
      :lazy="true"
      :loading="dataStore.loading"
      :paginator="true"
      :rows="perpage"
      :rowsPerPageOptions="[2, 5, 10]"
      :totalRecords="tickets_total"
      @page="onPageChange"
      responsiveLayout="scroll"
      :first="offset"
    >
      <Column field="id" header="ID"/>
      <Column field="type" header="Тип билета">
        <template #body="slotProps">
          {{ getTicketTypeLabel(slotProps.data.type) }}
        </template>
      </Column>
      <Column field="exhibition.title" header="Выставка">
        <template #body="slotProps">
          {{ slotProps.data.exhibition ? slotProps.data.exhibition.title : 'N/A' }}
        </template>
      </Column>
      <Column field="price" header="Цена (руб)">
        <template #body="slotProps">
          {{ formatPrice(slotProps.data.price) }}
        </template>
      </Column>
      <Column field="available_quantity" header="Доступное количество"/>
    </DataTable>
  </div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useDataStore } from '@/stores/dataStore';

export default {
  name: "Tickets",
  components: { DataTable, Column },
  data() {
    return {
      dataStore: useDataStore(),
      perpage: 5,
      offset: 0,
    }
  },
  computed: {
    tickets() {
      return this.dataStore.tickets;
    },
    tickets_total() {
      return this.dataStore.tickets_total;
    }
  },
  mounted() {
    console.log('Tickets component MOUNTED!');
    this.dataStore.get_tickets();
    this.dataStore.get_tickets_total();
    console.log('Tickets:', this.tickets);
  },
  methods: {
    onPageChange(event) {
      this.offset = event.first;
      this.perpage = event.rows;
      this.dataStore.get_tickets(this.offset / this.perpage, this.perpage);
    },
    formatPrice(price) {
      return new Intl.NumberFormat('ru-RU').format(price);
    },
    getTicketTypeLabel(type) {
      const types = {
        'standard': 'Стандартный',
        'vip': 'VIP',
        'child': 'Детский'
      };
      return types[type] || type;
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
    border-radius: 4px;
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

  /* Стили для выбора количества строк на странице */
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
