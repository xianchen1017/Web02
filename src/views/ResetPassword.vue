<template>
  <div class="reset-password-container">
    <div class="reset-password-box">
      <div class="content-wrapper">
        <!-- 左侧表单区域 -->
        <div class="form-section left-section">
          <h2 class="title">修改密码</h2>
          <el-form
              ref="resetFormRef"
              :model="resetForm"
              :rules="resetRules"
              class="reset-form"
          >
            <el-form-item prop="username">
              <el-input
                  v-model="resetForm.username"
                  placeholder="用户名"
                  prefix-icon="User"
                  clearable
              />
            </el-form-item>
            <el-form-item prop="oldPassword">
              <el-input
                  v-model="resetForm.oldPassword"
                  :type="oldPasswordType"
                  placeholder="旧密码"
                  prefix-icon="Lock"
              >
                <template #suffix>
                  <el-icon @click="showOldPwd">
                    <View v-if="oldPasswordVisible" />
                    <Hide v-else />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
        </div>

        <!-- 中间分隔线 -->
        <div class="divider"></div>

        <!-- 右侧表单区域 -->
        <div class="form-section right-section">
          <h2 class="title">&nbsp;</h2>
          <el-form
              ref="resetFormRef"
              :model="resetForm"
              :rules="resetRules"
              class="reset-form"
          >
            <el-form-item prop="newPassword">
              <el-input
                  v-model="resetForm.newPassword"
                  :type="newPasswordType"
                  placeholder="新密码"
                  prefix-icon="Lock"
              >
                <template #suffix>
                  <el-icon @click="showNewPwd">
                    <View v-if="newPasswordVisible" />
                    <Hide v-else />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword">
              <el-input
                  v-model="resetForm.confirmPassword"
                  :type="confirmPasswordType"
                  placeholder="确认新密码"
                  prefix-icon="Lock"
              >
                <template #suffix>
                  <el-icon @click="showConfirmPwd">
                    <View v-if="confirmPasswordVisible" />
                    <Hide v-else />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 底部按钮区域 -->
      <div class="button-section">
        <el-button class="reset-btn" @click="handleReset">修改密码</el-button>
        <el-button class="back-btn" @click="goToLogin">返回登录</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { View, Hide } from '@element-plus/icons-vue'

const router = useRouter()

// 表单引用
const resetFormRef = ref()

// 重置密码表单数据
const resetForm = reactive({
  username: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码显示/隐藏
const oldPasswordVisible = ref(false)
const oldPasswordType = ref('password')
const showOldPwd = () => {
  oldPasswordVisible.value = !oldPasswordVisible.value
  oldPasswordType.value = oldPasswordVisible.value ? 'text' : 'password'
}

const newPasswordVisible = ref(false)
const newPasswordType = ref('password')
const showNewPwd = () => {
  newPasswordVisible.value = !newPasswordVisible.value
  newPasswordType.value = newPasswordVisible.value ? 'text' : 'password'
}

const confirmPasswordVisible = ref(false)
const confirmPasswordType = ref('password')
const showConfirmPwd = () => {
  confirmPasswordVisible.value = !confirmPasswordVisible.value
  confirmPasswordType.value = confirmPasswordVisible.value ? 'text' : 'password'
}

// 表单验证规则
const validatePassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请输入密码'))
  } else if (value.length < 6 || value.length > 20) {
    callback(new Error('密码长度在6到20个字符'))
  } else {
    callback()
  }
}

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请再次输入密码'))
  } else if (value !== resetForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const resetRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在3到20个字符', trigger: 'blur' }
  ],
  oldPassword: [
    { validator: validatePassword, trigger: 'blur' }
  ],
  newPassword: [
    { validator: validatePassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
})

// 处理密码重置
const handleReset = () => {
  resetFormRef.value?.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    // 模拟API调用
    ElMessage.success('密码修改成功')
    router.push('/login')
  })
}

// 跳转到登录页
const goToLogin = () => {
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.reset-password-container {
  position: fixed;
  width: 100%;
  height: 100%;
  /* 添加背景图片示例（可选） */
  background-image: url('D:/JAVA SHIT/web02/public/images/background.jpeg');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;

  /* 添加半透明遮罩层增强可读性 */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3); /* 黑色半透明遮罩 */
    z-index: 0;
  }

  .reset-password-box {
    width: 700px;
    /* 修改这里使操作框透明 */
    background-color: rgba(255, 255, 255, 0.85);
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    padding: 30px;

    /* 可选：添加模糊效果 */
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.2); /* 半透明边框 */


    .content-wrapper {
      display: flex;
      min-height: 300px;
    }

    .title {
      text-align: center;
      margin-bottom: 30px;
      color: #333;
    }

    .form-section {
      flex: 1;
      padding: 0 20px;

      &.left-section {
        border-right: none;
      }

      &.right-section {
        border-left: none;
      }

      .reset-form {
        :deep(.el-form-item) {
          margin-bottom: 22px;
        }
      }
    }

    .divider {
      width: 1px;
      background-color: #e0e0e0;
      margin: 0 20px;
    }

    .button-section {
      display: flex;
      justify-content: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;

      .reset-btn, .back-btn {
        width: 120px;
        margin: 0 15px;
      }

      .reset-btn {
        background-color: #909399;
        border-color: #909399;
        color: #fff;

        &:hover {
          background-color: #a6a9ad;
          border-color: #a6a9ad;
        }
      }

      .back-btn {
        background-color: #dcdfe6;
        border-color: #dcdfe6;
        color: #606266;

        &:hover {
          background-color: #e4e7ed;
          border-color: #e4e7ed;
        }
      }
    }
  }

  @media (max-width: 768px) {
    .reset-password-box {
      width: 90%;
      max-width: 400px;

      .content-wrapper {
        flex-direction: column;
      }

      .divider {
        width: 100%;
        height: 1px;
        margin: 20px 0;
      }
    }
  }
}
</style>