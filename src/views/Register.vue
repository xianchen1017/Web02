<template>
  <div class="register-container">
    <div class="register-box">
      <div class="content-wrapper">
        <!-- 左侧表单区域 -->
        <div class="form-section">
          <h2 class="title">用户注册</h2>
          <el-form
              ref="registerFormRef"
              :model="registerForm"
              :rules="registerRules"
              class="register-form"
          >
            <el-form-item prop="username">
              <el-input
                  v-model="registerForm.username"
                  placeholder="用户名"
                  prefix-icon="User"
                  clearable
              />
            </el-form-item>
            <el-form-item prop="email">
              <el-input
                  v-model="registerForm.email"
                  placeholder="电子邮箱"
                  prefix-icon="Message"
                  clearable
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                  v-model="registerForm.password"
                  :type="passwordType"
                  placeholder="密码"
                  prefix-icon="Lock"
              >
                <template #suffix>
                  <el-icon @click="showPwd">
                    <View v-if="passwordVisible" />
                    <Hide v-else />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="birthDate">
              <el-date-picker
                  v-model="registerForm.birthDate"
                  type="date"
                  placeholder="出生日期"
                  style="width: 100%"
                  value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-form>
        </div>

        <!-- 中间分隔线 -->
        <div class="divider"></div>

        <!-- 右侧头像上传区域 -->
        <div class="avatar-section">
          <h2 class="title">请上传头像</h2>
          <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :auto-upload="false"
              :on-change="handleAvatarChange"
          >
            <img v-if="avatarUrl" :src="avatarUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <p class="upload-tip">支持JPG/PNG格式，大小不超过2MB</p>
        </div>
      </div>

      <!-- 底部按钮区域 -->
      <div class="button-section">
        <el-button class="register-btn" @click="handleRegister">注册用户</el-button>
        <el-button class="back-btn" @click="goToLogin">返回登录</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 脚本部分保持不变，与之前相同
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { View, Hide, Plus } from '@element-plus/icons-vue'

const router = useRouter()

// 表单引用
const registerFormRef = ref()

// 注册表单数据
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  birthDate: ''
})

// 头像上传
const avatarUrl = ref('')
const handleAvatarChange = (file: any) => {
  const isImage = file.raw.type.includes('image/')
  const isLt2M = file.raw.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过2MB!')
    return
  }

  avatarUrl.value = URL.createObjectURL(file.raw)
}

// 密码显示/隐藏
const passwordVisible = ref(false)
const passwordType = ref('password')
const showPwd = () => {
  passwordVisible.value = !passwordVisible.value
  passwordType.value = passwordVisible.value ? 'text' : 'password'
}

// 表单验证规则
const validateEmail = (rule: any, value: string, callback: any) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!value) {
    callback(new Error('请输入电子邮箱'))
  } else if (!emailRegex.test(value)) {
    callback(new Error('请输入有效的电子邮箱'))
  } else {
    callback()
  }
}

const validateBirthDate = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请选择出生日期'))
  } else {
    const birthDate = new Date(value)
    const currentDate = new Date()
    if (birthDate > currentDate) {
      callback(new Error('出生日期不能晚于当前日期'))
    } else {
      callback()
    }
  }
}

const registerRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { validator: validateEmail, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  birthDate: [
    { validator: validateBirthDate, trigger: 'change' }
  ]
})

// 处理注册
const handleRegister = () => {
  registerFormRef.value?.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    if (!avatarUrl.value) {
      ElMessage.warning('请上传头像')
      return
    }
    // 模拟注册API调用
    ElMessage.success('注册成功')
    router.push('/login') // 跳转到登录页
  })
}

// 跳转到登录页
const goToLogin = () => {
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.register-container {
  position: fixed;
  width: 100%;
  height: 100%;
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

  .register-box {
    width: 800px;
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
      min-height: 400px;
    }

    .title {
      text-align: center;
      margin-bottom: 30px;
      color: #333;
    }

    .form-section {
      flex: 1;
      padding: 0 20px;

      .register-form {
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

    .avatar-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 20px;

      .avatar-uploader {
        width: 150px;
        height: 150px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: border-color 0.3s;
        margin-bottom: 20px;

        &:hover {
          border-color: #409eff;
        }

        .avatar {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 150px;
          height: 150px;
          line-height: 150px;
          text-align: center;
        }
      }

      .upload-tip {
        color: #999;
        font-size: 12px;
        text-align: center;
      }
    }

    .button-section {
      display: flex;
      justify-content: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;

      .register-btn, .back-btn {
        width: 120px;
        margin: 0 15px;
      }

      .register-btn {
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

  @media (max-width: 800px) {
    .register-box {
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