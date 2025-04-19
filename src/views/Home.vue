<!--src/views/Home.vue-->
<template>
  <div class="home-container">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <div class="logo-area">系统LOGO</div>
      <el-menu
          :default-active="activeMenu"
          class="nav-menu"
          @select="handleMenuSelect"
      >
        <!-- 首页 -->
        <el-menu-item index="home">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </el-menu-item>

        <!-- 功能菜单 -->
        <el-sub-menu index="functions">
          <template #title>
            <el-icon><Menu /></el-icon>
            <span>功能菜单</span>
          </template>
          <el-menu-item index="user-management">用户管理</el-menu-item>
          <el-menu-item index="article-management">文章管理</el-menu-item>
        </el-sub-menu>

        <!-- 主题切换 -->
        <el-sub-menu index="theme">
          <template #title>
            <el-icon><Brush /></el-icon>
            <span>主题切换</span>
          </template>
          <el-menu-item index="blue-theme">蓝色风格</el-menu-item>
          <el-menu-item index="yellow-theme">黄色风格</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>

    <!-- 右侧内容区 -->
    <div class="main-content">
      <!-- 顶部用户信息栏 -->
      <div class="header">
        <div class="user-info">
          <el-dropdown @command="handleCommand">
            <el-avatar :size="40" :src="userStore.avatar" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">基本信息</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span class="username">{{ userStore.username }}</span>
        </div>
      </div>

      <!-- 动态内容区域 -->
      <div class="content-area">
        <!-- 首页内容 -->
        <div v-if="activeMenu === 'home'" class="home-content">
          <!-- 左侧用户信息 -->
          <div class="user-profile">
            <el-card shadow="hover">
              <div class="profile-content">
                <el-avatar :size="120" :src="userStore.avatar" />
                <div class="profile-info">
                  <h3>{{ userStore.username }}</h3>
                </div>
              </div>
            </el-card>
          </div>

          <!-- 右侧日历 -->
          <div class="calendar-section">
            <el-card shadow="hover">
              <template v-if="!showProfileInfo">
                <el-calendar v-model="currentDate">
                  <template #date-cell="{ data }">
                    <div :class="{ 'current-day': isCurrentDay(data.date) }">
                      {{ data.day.split('-').slice(2).join('-') }}
                    </div>
                  </template>
                </el-calendar>
              </template>
              <template v-else>
                <div class="profile-header">
                  <el-button
                      type="text"
                      @click="showProfileInfo = false"
                      icon="el-icon-arrow-left"
                  >
                    返回日历
                  </el-button>
                </div>
                <div class="profile-detail">
                  <h3>用户详细信息</h3>
                  <el-descriptions :column="1" border>
                    <el-descriptions-item label="用户名">
                      {{ userStore.username }}
                    </el-descriptions-item>
                    <el-descriptions-item label="邮箱">
                      {{ userStore.email || '未设置' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="余额">500</el-descriptions-item>
                  </el-descriptions>
                </div>
              </template>
            </el-card>
          </div>
        </div>

        <!-- 用户管理页面 -->
        <div v-if="activeMenu === 'user-management'" class="user-management-content">
          <el-card shadow="hover">
            <div class="user-management-header">
              <h2>用户管理</h2>
              <div class="user-management-tools">
                <el-button type="primary" @click="showAddDialog">
                  <el-icon><Plus /></el-icon>新增
                </el-button>
                <el-input
                    v-model="searchQuery"
                    placeholder="请输入搜索内容"
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
            </div>
            <el-table :data="contactList" v-loading="loading">
              <el-table-column prop="id" label="ID" width="80" align="center" />
              <el-table-column prop="name" label="姓名" width="150" align="center" />
              <el-table-column prop="province" label="省份" width="120" align="center" />
              <el-table-column prop="city" label="城市" width="120" align="center" />
              <el-table-column prop="address" label="地址" width="250" align="center" />
              <el-table-column prop="postalCode" label="邮政编码" width="120" align="center" />
              <el-table-column prop="createTime" label="创建时间" width="180" align="center" />
              <el-table-column label="操作" width="180" align="center" fixed="right">
                <template #default="scope">
                  <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination-container">
              <el-pagination
                  v-model:current-page="currentPage"
                  v-model:page-size="pageSize"
                  :page-sizes="[10, 20, 30, 50]"
                  :total="totalUsers"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
              />
            </div>
          </el-card>
        </div>

        <!-- 文章管理内容 -->
        <div v-if="activeMenu === 'article-management'" class="article-management-content">
          <el-card shadow="hover">
            <div class="article-management-header">
              <h2>文章管理</h2>
            </div>
            <div class="author-article-container">
              <!-- 左侧作者列表 -->
              <div class="author-list">
                <el-table
                    :data="authorList"
                    highlight-current-row
                    @current-change="handleAuthorChange"
                    style="width: 100%"
                    v-loading="authorLoading"
                >
                  <el-table-column
                      prop="username"
                      label="作者"
                      width="130"
                      align="center"
                      header-align="right"
                      header-class-name="right-aligned-header"
                  />
                  <el-table-column
                      prop="articleCount"
                      label="文章数"
                      width="160"
                      align="center"
                      header-align="right"
                      header-class-name="right-aligned-header"
                  />
                  <el-table-column
                      label="操作"
                      width="130"
                      align="center"
                      header-align="right"
                      header-class-name="right-aligned-header"
                  >
                    <template #default="{ row }">
                      <el-button
                          size="small"
                          @click="enterArticleManagement(row)"
                      >管理文章</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="pagination-container">
                  <el-pagination
                      v-model:current-page="authorCurrentPage"
                      v-model:page-size="authorPageSize"
                      :page-sizes="[5, 10, 20]"
                      :total="totalAuthors"
                      layout="total, sizes, prev, pager, next, jumper"
                      @size-change="handleAuthorSizeChange"
                      @current-change="handleAuthorPageChange"
                  />
                </div>
              </div>

              <!-- 右侧统计图表 -->
              <div class="statistics-chart">
                <div class="chart-title">作者文章统计</div>
                <div ref="chartRef" style="width: 100%; height: 400px;"></div>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 文章详情页面 -->
        <div v-if="activeMenu === 'author-article-detail'" class="author-article-detail">
          <el-card shadow="hover">
            <div class="author-info">
              <el-button type="text" @click="backToArticleManagement">
                <el-icon><ArrowLeft /></el-icon> 返回文章管理
              </el-button>
              <div class="author-profile">
                <el-avatar :size="60" :src="currentAuthor?.avatar" />
                <div class="profile-text">
                  <h3>{{ currentAuthor?.username }}</h3>
                  <p>共发表 {{ currentAuthor?.articleCount }} 篇文章</p>
                </div>
              </div>
            </div>
            <div class="article-operations">
              <el-button type="primary" @click="showAddArticleDialog">
                <el-icon><Plus /></el-icon>新增文章
              </el-button>
              <el-input
                  v-model="articleSearchQuery"
                  placeholder="搜索文章标题"
                  style="width: 300px; margin-left: 10px;"
                  clearable
                  @clear="handleArticleSearch"
              >
                <template #append>
                  <el-button @click="handleArticleSearch">
                    <el-icon><Search /></el-icon>
                  </el-button>
                </template>
              </el-input>
            </div>
            <el-table :data="filteredArticleList" v-loading="articleLoading">
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="title" label="标题" width="200" />
              <el-table-column prop="category" label="分类" width="120" />
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.status === 'published' ? 'success' : 'warning'">
                    {{ row.status === 'published' ? '已发布' : '草稿' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间" width="180" />
              <el-table-column prop="updateTime" label="更新时间" width="180" />
              <el-table-column label="操作" width="180">
                <template #default="scope">
                  <el-button size="small" @click="editArticle(scope.row)">编辑</el-button>
                  <el-button
                      size="small"
                      type="danger"
                      @click="deleteArticle(scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination-container">
              <el-pagination
                  v-model:current-page="articleCurrentPage"
                  v-model:page-size="articlePageSize"
                  :page-sizes="[5, 10, 20]"
                  :total="totalArticles"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handleArticleSizeChange"
                  @current-change="handleArticlePageChange"
              />
            </div>
          </el-card>
        </div>

        <!-- 用户编辑对话框 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="50%">
          <el-form ref="contactForm" :model="formData" :rules="formRules" label-width="100px">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="formData.name" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="省份" prop="province">
              <el-input v-model="formData.province" placeholder="请输入省份" />
            </el-form-item>
            <el-form-item label="城市" prop="city">
              <el-input v-model="formData.city" placeholder="请输入城市" />
            </el-form-item>
            <el-form-item label="地址" prop="address">
              <el-input v-model="formData.address" placeholder="请输入地址" />
            </el-form-item>
            <el-form-item label="邮政编码" prop="postalCode">
              <el-input v-model="formData.postalCode" placeholder="请输入邮政编码" />
            </el-form-item>
          </el-form>
          <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </span>
          </template>
        </el-dialog>

        <!-- 文章编辑对话框 -->
        <el-dialog v-model="articleDialogVisible" :title="articleDialogTitle" width="50%">
          <el-form
              ref="articleForm"
              :model="articleFormData"
              :rules="articleFormRules"
              label-width="100px"
          >
            <el-form-item label="文章标题" prop="title">
              <el-input
                  v-model="articleFormData.title"
                  placeholder="请输入文章标题"
              />
            </el-form-item>
            <el-form-item label="文章分类" prop="category">
              <el-select
                  v-model="articleFormData.category"
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
              <el-radio-group v-model="articleFormData.status">
                <el-radio label="published">已发布</el-radio>
                <el-radio label="draft">草稿</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="文章内容" prop="content">
              <el-input
                  v-model="articleFormData.content"
                  type="textarea"
                  :rows="8"
                  placeholder="请输入文章内容"
              />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="articleDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="submitArticleForm">确定</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, ref, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { Plus, Search } from '@element-plus/icons-vue'
import { isSameDay } from 'date-fns'
import {
  HomeFilled,
  Menu,
  Brush,
} from '@element-plus/icons-vue'
import { useUserStore } from "@/store/user"
import { User } from "@/types/user";  // 确保路径正确
import axios, {AxiosError} from 'axios';
const router = useRouter()
const userStore = useUserStore() // 先声明
console.log("User Information:", userStore.username);  // 查看 `userStore` 中的数据
const canEdit = userStore.hasRole('admin') || userStore.hasRole('editor') // 后使用
// 当前日期
const currentDate = ref(new Date())
// 当前激活的菜单
const activeMenu = ref('home') // 默认显示首页
// 处理菜单选择
const handleMenuSelect = (index: string) => {
  // 处理主题切换
  if (index === 'blue-theme' || index === 'yellow-theme') {
    applyTheme(index)
    return
  }
  // 更新当前激活的菜单
  activeMenu.value = index // 现在可以正常修改了
}
// 应用主题
const applyTheme = (theme: string) => {
  document.documentElement.className = ''
  document.documentElement.classList.add(theme)
  localStorage.setItem('theme', theme)
}
// 初始化主题
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'blue-theme'
  applyTheme(savedTheme)
}
// 判断是否是当天
const isCurrentDay = (date: Date) => {
  return isSameDay(date, new Date())
}
// 格式化日期
const formatDate = (dateString: string | Date | undefined): string => {
  if (!dateString) return '未记录'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 退出登录方法
const handleLogout = async () => {
  try {
    await userStore.logout() // 直接使用store的logout方法
    ElMessage.success('退出登录成功')
    router.push('/login')
  } catch (error) {
    ElMessage.error('退出登录失败')
  }
}
interface Contact {
  id?: number; // id 可以是可选的
  name: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  createTime?: string; // createTime 也可以是可选的
}
const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalUsers = ref(0)
const contactList = ref<Contact[]>([]); // 存储联系人列表
const totalContacts = ref(0); // 存储联系人总数
// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('新增用户')
// 表单数据 - 使用类型断言确保所有必填字段都有初始值
const formData = ref<Contact>({
  id: 0, // 新增时可以使用 id 作为 0 或者其他默认值
  name: '',
  province: '',
  city: '',
  address: '',
  postalCode: '',
  createTime: '', // 默认创建时间
});
// 表单验证规则
const formRules = ref({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  province: [
    { required: true, message: '请输入省份', trigger: 'blur' }
  ],
  city: [
    { required: true, message: '请输入城市', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入地址', trigger: 'blur' }
  ],
  postalCode: [
    { required: true, message: '请输入邮政编码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '邮政编码必须是6位数字', trigger: 'blur' }
  ]
});
// 获取联系人列表
const fetchContactList = async () => {
  loading.value = true;
  try {
    const res = await axios.get('/api/contact/list', {
      params: {
        page: currentPage.value,
        size: pageSize.value,
        searchQuery: searchQuery.value
      }
    });

    // 适配新的响应格式
    contactList.value = res.data.data || [];
    totalUsers.value = res.data.total || 0;

    console.log('联系人列表响应:', res.data);
    console.log('渲染数据:', contactList.value);
  } catch (error: any) {
    console.error('获取联系人列表失败:', error);
    if (error.response) {
      const msg = error.response.data?.message || error.response.statusText;
      ElMessage.error(`获取失败: ${msg}`);
      console.error('错误详情:', error.response.data);
    } else {
      ElMessage.error('网络错误，请检查连接');
    }
  } finally {
    loading.value = false;
  }
};
// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchContactList ()
}
// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchContactList ()
}
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchContactList ()
}
// 显示新增对话框
const showAddDialog = () => {
  dialogTitle.value = '新增联系人';
  formData.value = {
    id: 0, // 新增时可以使用 id 作为 0 或者其他默认值
    name: '',
    province: '',
    city: '',
    address: '',
    postalCode: '',
    createTime: '', // 默认创建时间
  };
  dialogVisible.value = true;
};
// 编辑联系人
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑联系人';
  formData.value = { ...row };
  dialogVisible.value = true;
};
// 删除联系人
const handleDelete = async (row: Contact) => {
  console.log('删除ID:', row.id);
  try {
    if (row.id === undefined) {
      ElMessage.error('联系人ID无效，删除失败');
      return;
    }

    await ElMessageBox.confirm('确定要删除该联系人吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    console.log("id的类型是",typeof row.id); // 查看类型
    // 确保传递的是 Long 类型 ID
    const success = await deleteContact(String(row.id));  // 转换为 String 后传递

    if (success) {
      ElMessage.success('删除成功');
      // 刷新列表
      fetchContactList();
    }
  } catch (error) {
    // 用户点击取消时，会进入catch，不需要处理
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

// 提交表单
const submitForm = async () => {
  try {
    if (dialogTitle.value === '新增联系人') {
      await addContact(formData.value);
    } else {
      await updateContact(formData.value);
    }
    dialogVisible.value = false;
    fetchContactList();
  } catch (error) {
    ElMessage.error('操作失败');
  }
};
// 新增联系人
const addContact = async (contact: any) => {
  const response = await axios.post('/api/contact', contact, );
  console.log("新增联系人信息", response.data)
  ElMessage.success('新增联系人成功');
  return response.data;
};

// 更新联系人
const updateContact = async (contact: any) => {
  const response = await axios.put(`/api/contact/${contact.id}`, contact, {
  });
  console.log("新增联系人信息2", response.data)
  ElMessage.success('更新联系人成功');
  return response.data;
};

// 删除联系人API调用
const deleteContact = async (id: string) => {
  console.log("deleteContact删除ID:", id, "id的类型是", typeof id);
  try {
    // 确保传递的是 Long 类型 ID
    const response = await axios.delete(`/api/contact/${id}`);
    console.log('删除成功', response.data);
    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      ElMessage.error(`删除失败: ${error.response?.data || error.message}`);
    } else {
      ElMessage.error('删除失败: 未知错误');
    }
    return false;
  }
};

// 初始化
onMounted(() => {
  initTheme()
  fetchContactList ()
})

// 文章管理相关状态
const authorList = ref<Array<{id: number, username: string, avatar: string, articleCount: number}>>([])
const authorCurrentPage = ref(1)
const authorPageSize = ref(5)
const totalAuthors = ref(0)
const authorLoading = ref(false)
const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null
// 当前选中的作者
const currentAuthor = ref<{id: number, username: string, avatar: string, articleCount: number} | null>(null)
// 文章列表相关状态
const articleList = ref<Array<{
  id: number,
  title: string,
  content: string,
  category: string,
  status: string,
  createTime: string,
  updateTime: string
}>>([])
const filteredArticleList = ref<Array<any>>([])
const articleLoading = ref(false)
const articleSearchQuery = ref('')
const articleCurrentPage = ref(1)
const articlePageSize = ref(10)
const totalArticles = ref(0)

// 文章对话框相关
const articleDialogVisible = ref(false)
const articleDialogTitle = ref('新增文章')
const articleFormData = ref({
  id: 0,
  title: '',
  content: '',
  category: '',
  status: 'draft'
})

// 分类选项
const categoryOptions = [
  { value: 'technology', label: '技术' },
  { value: 'life', label: '生活' },
  { value: 'travel', label: '旅行' },
  { value: 'other', label: '其他' }
]

// 文章表单验证规则
const articleFormRules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 3, max: 50, message: '长度在3到50个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择文章分类', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
    { min: 10, message: '内容至少10个字符', trigger: 'blur' }
  ]
}

// 获取作者列表
const fetchAuthorList = async () => {
  authorLoading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    // 模拟数据
    const mockAuthors = Array.from({length: 20}, (_, i) => ({
      id: i + 1,
      username: `作者${i + 1}`,
      avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i + 1}.jpg`,
      articleCount: Math.floor(Math.random() * 20) + 1
    }))
    // 分页处理
    const start = (authorCurrentPage.value - 1) * authorPageSize.value
    const end = start + authorPageSize.value
    authorList.value = mockAuthors.slice(start, end)
    totalAuthors.value = mockAuthors.length
    // 初始化图表
    if (authorList.value.length > 0) {
      updateChart()
    }
  } catch (error) {
    console.error('获取作者列表失败:', error)
    ElMessage.error('获取作者列表失败')
  } finally {
    authorLoading.value = false
  }
}

// 初始化图表
const initChart = () => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value)
    window.addEventListener('resize', () => {
      chartInstance?.resize()
    })
  }
}

// 更新图表数据
const updateChart = () => {
  if (!chartInstance || !authorList.value.length) return

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01]
    },
    yAxis: {
      type: 'category',
      data: authorList.value.map(author => author.username)
    },
    series: [
      {
        name: '文章数量',
        type: 'bar',
        data: authorList.value.map(author => author.articleCount),
        itemStyle: {
          color: function(params: any) {
            // 根据数据值返回不同颜色
            const colorList = ['#c23531','#2f4554','#61a0a8','#d48265','#91c7ae','#749f83','#ca8622','#bda29a','#6e7074','#546570','#c4ccd3']
            return colorList[params.dataIndex % colorList.length]
          }
        }
      }
    ]
  }

  chartInstance.setOption(option)
}

// 处理作者选择变化
const handleAuthorChange = (author: any) => {
  currentAuthor.value = author
}

// 进入文章管理
const enterArticleManagement = (author: any) => {
  currentAuthor.value = author
  activeMenu.value = 'author-article-detail'
  fetchArticlesByAuthor()
}

// 返回文章管理主界面
const backToArticleManagement = () => {
  activeMenu.value = 'article-management'
  currentAuthor.value = null
}

// 获取作者的文章列表
const fetchArticlesByAuthor = async () => {
  if (!currentAuthor.value) return

  articleLoading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    // 模拟数据
    const mockArticles = Array.from({length: currentAuthor.value.articleCount}, (_, i) => ({
      id: i + 1,
      title: `文章标题${i + 1}`,
      content: `这是${currentAuthor.value?.username}的第${i + 1}篇文章内容...`,
      category: ['technology', 'life', 'travel', 'other'][Math.floor(Math.random() * 4)],
      status: Math.random() > 0.3 ? 'published' : 'draft',
      createTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updateTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    }))

    articleList.value = mockArticles
    totalArticles.value = mockArticles.length
    filterArticles()
  } catch (error) {
    console.error('获取文章列表失败:', error)
    ElMessage.error('获取文章列表失败')
  } finally {
    articleLoading.value = false
  }
}

// 过滤文章
const filterArticles = () => {
  let result = [...articleList.value]
  if (articleSearchQuery.value) {
    const query = articleSearchQuery.value.toLowerCase()
    result = result.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query)
    )
  }
  totalArticles.value = result.length
  const start = (articleCurrentPage.value - 1) * articlePageSize.value
  const end = start + articlePageSize.value
  filteredArticleList.value = result.slice(start, end)
}

// 文章搜索处理
const handleArticleSearch = () => {
  articleCurrentPage.value = 1
  filterArticles()
}

// 文章分页处理
const handleArticleSizeChange = (val: number) => {
  articlePageSize.value = val
  filterArticles()
}

const handleArticlePageChange = (val: number) => {
  articleCurrentPage.value = val
  filterArticles()
}

// 作者分页处理
const handleAuthorSizeChange = (val: number) => {
  authorPageSize.value = val
  fetchAuthorList()
}

const handleAuthorPageChange = (val: number) => {
  authorCurrentPage.value = val
  fetchAuthorList()
}

// 显示新增文章对话框
const showAddArticleDialog = () => {
  articleDialogTitle.value = '新增文章'
  articleFormData.value = {
    id: 0,
    title: '',
    content: '',
    category: '',
    status: 'draft'
  }
  articleDialogVisible.value = true
}

// 编辑文章
const editArticle = (row: any) => {
  articleDialogTitle.value = '编辑文章'
  articleFormData.value = { ...row }
  articleDialogVisible.value = true
}

// 删除文章
const deleteArticle = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该文章吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    // 模拟删除
    articleList.value = articleList.value.filter(article => article.id !== row.id)
    currentAuthor.value!.articleCount -= 1
    totalArticles.value -= 1
    filterArticles()
    ElMessage.success('删除成功')
  } catch (error) {
    // 取消删除
  }
}

// 提交文章表单
const submitArticleForm = async () => {
  try {
    if (articleDialogTitle.value === '新增文章') {
      // 模拟新增
      const newId = Math.max(...articleList.value.map(a => a.id), 0) + 1
      const newArticle = {
        ...articleFormData.value,
        id: newId,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      }
      articleList.value.unshift(newArticle)
      currentAuthor.value!.articleCount += 1
      totalArticles.value += 1
      ElMessage.success('新增文章成功')
    } else {
      // 模拟编辑
      const index = articleList.value.findIndex(a => a.id === articleFormData.value.id)
      if (index !== -1) {
        articleList.value[index] = {
          ...articleList.value[index],
          ...articleFormData.value,
          updateTime: new Date().toISOString()
        }
      }
      ElMessage.success('更新文章成功')
    }
    articleDialogVisible.value = false
    filterArticles()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}
const handleCommand = (command: string) => { if (command === 'logout') { handleLogout(); } else if (command === 'profile') { // 切换显示基本信息
  showProfileInfo.value = true; } } // 退出登录方法
const showProfileInfo = ref(false); // 控制是否显示基本信息
// 监听作者列表变化
watch(authorList, () => {
  nextTick(() => {
    updateChart()
  })
}, { deep: true })
</script>
<style scoped>

/* 基础布局样式 */
.home-container {
  display: flex;
  height: 100vh;
  min-height: 100vh;
}
.sidebar {
  width: 220px;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.1);
}
.logo-area {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #eee;
}
.nav-menu {
  border-right: none;
}
.main-content {
  flex: 1;
  padding: 20px;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
/* 首页内容样式 */
.home-content {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.user-profile {
  flex: 1;
}
.calendar-section {
  flex: 2;
}
.profile-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
}
.profile-info {
  text-align: center;
}
.profile-info h3 {
  margin-bottom: 10px;
}
.profile-info p {
  margin: 5px 0;
  color: #666;
}
/* 日历当前日样式 */
.current-day {
  color: var(--el-color-primary);
  font-weight: bold;
}
/* 顶部用户信息栏样式 */
.header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  margin-bottom: 20px;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
.username {
  font-weight: 500;
  margin-right: 15px;
}
/* 用户管理页面样式 */
.user-management-content {
  padding: 20px;
}
.user-management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.user-management-tools {
  display: flex;
  align-items: center;
}
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
/* 主题样式 */
.blue-theme .sidebar {
  background-color: var(--sidebar-bg);
  color: var(--sidebar-text-color);
}
.blue-theme .main-content {
  background-color: var(--bg-color);
}
.blue-theme .header {
  background-color: var(--header-bg);
  color: white;
}
.blue-theme .el-card {
  background-color: var(--card-bg);
  border-color: var(--border-color);
}
.blue-theme .el-menu {
  background-color: var(--sidebar-bg);
  border-right: none;
}
.blue-theme .el-menu-item:hover,
.blue-theme .el-sub-menu__title:hover {
  background-color: var(--menu-hover-bg) !important;
}
.blue-theme .el-menu-item.is-active {
  background-color: rgba(24, 144, 255, 0.8) !important;
  color: white !important;
}
.blue-theme .user-info .username {
  color: white;
}
.yellow-theme .sidebar {
  background-color: var(--sidebar-bg);
  color: var(--text-color);
}
.yellow-theme .main-content {
  background-color: var(--bg-color);
}
.yellow-theme .header {
  background-color: var(--header-bg);
}
.yellow-theme .el-card {
  background-color: var(--card-bg);
  color: var(--text-color);
  border-color: var(--border-color);
}
.yellow-theme .el-menu-item,
.yellow-theme .el-sub-menu__title {
  color: var(--text-color) !important;
}
.yellow-theme .el-menu-item:hover,
.yellow-theme .el-sub-menu__title:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}
/* 文章管理容器样式 */
.author-article-container {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}
/* 统一表头右对齐样式 */
.right-aligned-header .cell {
  justify-content: flex-end !important;
  padding-right: 15px !important;
}

/* 保持表格整体宽度 */
.author-list .el-table {
  width: 100%;
}
.author-list {
  flex: 1;
  min-width: 400px;
}

.statistics-chart {
  flex: 2;
  min-width: 500px;
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.chart-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
  color: #333;
}
/* 作者文章详情区域 */
.author-article-detail {
  padding: 20px;
}

.author-info {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.author-profile {
  display: flex;
  align-items: center;
  margin-top: 15px;
}

.profile-text {
  margin-left: 15px;
}

.profile-text h3 {
  margin: 0 0 5px 0;
}

.profile-text p {
  margin: 0;
  color: #666;
}

.article-operations {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
<style>
/* 全局主题变量 */
.blue-theme {
  --primary-color: #1890ff;
  --bg-color: #e6f7ff;
  --sidebar-bg: #1890ff;
  --text-color: #ffffff;
  --sidebar-text-color: #ffffff;
  --border-color: #91d5ff;
  --header-bg: #1890ff;
  --card-bg: #ffffff;
  --menu-hover-bg: rgba(255, 255, 255, 0.2);
}
.yellow-theme {
  --primary-color: #ffc53d;
  --bg-color: #fdf6e3;
  --sidebar-bg: #faad14;
  --text-color: #1d1d1d;
  --border-color: #ffe58f;
  --header-bg: #faad14;
  --card-bg: #fff8e6;
}
</style>