<template>
  <div class="exhibitions">
    <h1>Выставки</h1>
    <div class="exhibition-list">
      <div class="exhibition">
        <h3>Современное искусство 21 века</h3>
        <p>15 января - 15 марта 2024</p>
      </div>
      <div class="exhibition">
        <h3>Абстрактные формы</h3>
        <p>1 февраля - 1 апреля 2024</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Exhibitions'
}
</script>

<style scoped>
.exhibitions {
  padding: 20px;
}

.exhibition-list {
  margin-top: 20px;
}

.exhibition {
  border: 1px solid #ddd;
  padding: 15px;
  margin: 10px 0;
  border-radius: 5px;
}
</style>
