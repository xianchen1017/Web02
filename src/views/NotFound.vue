<template>
  <div class="not-found">
    <h1>404 Not Found</h1>
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'NotFound'
})
</script>

<style scoped>

</style>