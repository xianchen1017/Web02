<!-- src/views/AuthorArticleManagement.vue -->
<template>
  <div class="author-article-management">
    <el-card shadow="hover">
      <!-- 作者信息头部 -->
      <div class="author-header">
        <el-button type="text" @click="goBack" icon="ArrowLeft">返回</el-button>
        <div class="author-info">
          <el-avatar :size="60" :src="currentAuthor.avatar" />
          <div class="info-text">
            <h3>{{ currentAuthor.username }}</h3>
            <p>共发表 {{ articleList.length }} 篇文章</p>
          </div>
        </div>
      </div>

      <!-- 文章管理工具条 -->
      <div class="article-toolbar">
        <el-button type="primary" @click="showAddDialog">
          <el-icon><Plus /></el-icon>新增文章
        </el-button>
        <el-input
            v-model="searchQuery"
            placeholder="搜索文章标题"
            style="width: 300px; margin-left: 10px;"
            clearable
            @clear="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch">
              <el-icon><Search /></el-icon>
            </el-button>
          </template>
        </el-input>
      </div>

      <!-- 文章列表 -->
      <el-table
          :data="filteredArticles"
          v-loading="loading"
          style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="title" label="标题" width="200" />
        <el-table-column prop="category" label="分类" width="120">
          <template #default="{row}">
            <el-tag>{{ row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{row}">
            <el-tag :type="row.status === 'published' ? 'success' : 'warning'">
              {{ row.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 30, 50]"
            :total="totalArticles"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑文章对话框 -->
    <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="50%"
    >
      <el-form
          ref="articleForm"
          :model="formData"
          :rules="formRules"
          label-width="100px"
      >
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item label="文章分类" prop="category">
          <el-select
              v-model="formData.category"
              placeholder="请选择分类"
              style="width: 100%"
          >
            <el-option
                v-for="item in categoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="文章状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="published">已发布</el-radio>
            <el-radio label="draft">草稿</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <el-input
              v-model="formData.content"
              type="textarea"
              :rows="8"
              placeholder="请输入文章内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, ArrowLeft } from '@element-plus/icons-vue'

interface Article {
  id: number
  title: string
  content: string
  category: string
  status: 'published' | 'draft'
  createTime: string
  updateTime: string
  authorId: number
}

const router = useRouter()
const route = useRoute()

// 当前作者信息
const currentAuthor = ref({
  id: parseInt(route.params.authorId as string),
  username: route.query.username as string,
  avatar: route.query.avatar as string
})

// 文章列表相关
const articleList = ref<Article[]>([])
const filteredArticles = ref<Article[]>([])
const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalArticles = ref(0)

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('新增文章')
const formData = ref<Partial<Article>>({
  title: '',
  content: '',
  category: 'technology',
  status: 'draft',
  authorId: currentAuthor.value.id
})

// 表单验证规则
const formRules = ref({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 3, max: 50, message: '长度在3到50个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
    { min: 10, message: '内容至少10个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择文章分类', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择文章状态', trigger: 'change' }
  ]
})

// 分类选项
const categoryOptions = [
  { value: 'technology', label: '技术' },
  { value: 'life', label: '生活' },
  { value: 'travel', label: '旅行' },
  { value: 'food', label: '美食' }
]

// 获取文章列表
const fetchArticles = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    // 模拟数据 - 根据当前作者ID生成文章
    const mockArticles = Array.from({length: 15}, (_, i) => ({
      id: i + 1,
      title: `文章标题${i + 1}`,
      content: `这是文章${i + 1}的内容，作者是${currentAuthor.value.username}`,
      category: ['technology', 'life', 'travel', 'food'][i % 4],
      status: i % 3 === 0 ? 'draft' : 'published',
      createTime: new Date(Date.now() - i * 86400000).toISOString(),
      updateTime: new Date(Date.now() - i * 43200000).toISOString(),
      authorId: currentAuthor.value.id
    }))

    articleList.value = mockArticles
    totalArticles.value = mockArticles.length
    filterArticles()
  } catch (error) {
    ElMessage.error('获取文章列表失败')
  } finally {
    loading.value = false
  }
}

// 过滤文章
const filterArticles = () => {
  let result = [...articleList.value]
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query)
    )
  }
  totalArticles.value = result.length
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  filteredArticles.value = result.slice(start, end)
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  filterArticles()
}

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  filterArticles()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  filterArticles()
}

// 返回文章管理主界面
const goBack = () => {
  router.push('/home?menu=article-management')
}

// 显示新增对话框
const showAddDialog = () => {
  dialogTitle.value = '新增文章'
  formData.value = {
    title: '',
    content: '',
    category: 'technology',
    status: 'draft',
    authorId: currentAuthor.value.id
  }
  dialogVisible.value = true
}

// 编辑文章
const handleEdit = (row: Article) => {
  dialogTitle.value = '编辑文章'
  formData.value = { ...row }
  dialogVisible.value = true
}

// 删除文章
const handleDelete = async (row: Article) => {
  try {
    await ElMessageBox.confirm('确定要删除该文章吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    // 模拟删除操作
    articleList.value = articleList.value.filter(article => article.id !== row.id)
    totalArticles.value = articleList.value.length
    filterArticles()
    ElMessage.success('删除成功')
  } catch (error) {
    // 取消删除
  }
}

// 提交表单
const submitForm = async () => {
  try {
    if (dialogTitle.value === '新增文章') {
      // 模拟新增操作
      const newId = Math.max(...articleList.value.map(a => a.id), 0) + 1
      const newArticle = {
        ...formData.value,
        id: newId,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      } as Article

      articleList.value.unshift(newArticle)
      totalArticles.value = articleList.value.length
      ElMessage.success('新增文章成功')
    } else {
      // 模拟编辑操作
      const index = articleList.value.findIndex(a => a.id === formData.value.id)
      if (index !== -1) {
        articleList.value[index] = {
          ...articleList.value[index],
          ...formData.value,
          updateTime: new Date().toISOString()
        }
        ElMessage.success('更新文章成功')
      }
    }

    dialogVisible.value = false
    filterArticles()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

onMounted(() => {
  fetchArticles()
})
</script>

<style scoped>
.author-article-management {
  padding: 20px;
}

.author-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.author-info {
  display: flex;
  align-items: center;
  margin-left: 20px;
}

.info-text {
  margin-left: 15px;
}

.info-text h3 {
  margin: 0 0 5px 0;
}

.info-text p {
  margin: 0;
  color: #666;
}

.article-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>