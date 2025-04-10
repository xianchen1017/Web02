<!-- src/components/UserManagement.vue -->
<template>
  <div class="user-management-content">
    <el-card shadow="hover">
      <!-- 你的用户管理表格代码 -->
      <el-table :data="userList">
        <!-- 表格列定义 -->
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 从父组件接收数据或自行管理
const props = defineProps<{
  userList: any[]
}>()
</script>

<style scoped>

</style>