<!--src/views/Login.vue-->
<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 左侧社交登录 -->
      <div class="social-login">
        <h3 class="title">社交账号登录</h3>
        <div class="social-buttons">
          <el-button class="social-btn qq" @click="loginWithQQ">
            <img src="/images/QQ.jpeg" class="icon" />
            <span class="text">QQ登录</span>
          </el-button>
          <el-button class="social-btn wechat" @click="loginWithWeChat">
            <img src="/images/微信.jpeg" class="icon" />
            <span class="text">微信登录</span>
          </el-button>
          <el-button class="social-btn alipay" @click="loginWithAlipay">
            <img src="/images/支付宝.jpeg" class="icon" />
            <span class="text">支付宝登录</span>
          </el-button>
        </div>
      </div>
      <!-- 中间分隔线 -->
      <div class="divider"></div>
      <!-- 右侧账号密码登录 -->
      <div class="form-login">
        <h3 class="title">账号密码登录</h3>
        <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            autocomplete="on"
        >
          <el-form-item prop="username">
            <el-input
                ref="username"
                v-model="loginForm.username"
                placeholder="用户名"
                prefix-icon="User"
                clearable
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="密码"
                prefix-icon="Lock"
                @keyup.enter="handleLogin"
            >
              <template #suffix>
                <el-icon @click="showPwd">
                  <View v-if="passwordVisible" />
                  <Hide v-else />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button
                type="primary"
                class="login-btn"
                :loading="loading"
                @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 底部按钮 -->
    <div class="bottom-actions">
      <el-button type="text" @click="showRegisterDialog">注册账号</el-button>
      <el-button type="text" @click="showResetPasswordDialog">忘记密码</el-button>
    </div>
  </div>
</template>
.
<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { FormInstance, FormRules } from 'element-plus'
import { View, Hide } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import { login } from '@/api/auth'
import axios from "axios"; // 导入模拟的login方法


// 表单引用
const loginFormRef = ref<FormInstance>()

// 登录表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 表单验证规则
const loginRules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
})

// 密码显示/隐藏功能
const passwordVisible = ref(false)
const passwordType = ref('password')
const showPwd = () => {
  passwordVisible.value = !passwordVisible.value
  passwordType.value = passwordVisible.value ? 'text' : 'password'
  // 自动聚焦密码输入框
  nextTick(() => {
    const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement
    passwordInput?.focus()
  })
}

// 登录状态
const loading = ref(false)
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()


// 处理登录 - 适配模拟API
const handleLogin = async () => {
  try {
    await loginFormRef.value?.validate();  // 校验表单

    // 发送登录请求
    const res = await axios.post('/api/auth/login', {
      username: loginForm.username,  // 用户名
      password: loginForm.password   // 密码
    });

    // 打印登录数据进行调试
    console.log("登录用户名: ", loginForm.username);
    console.log("登录密码: ", loginForm.password);

    // 打印响应数据进行调试
    console.log("登录响应数据: ", res);

    // 根据返回的 message 判断登录是否成功
    if (res.data.message === '登录成功') {
      ElMessage.success(res.data?.message || '登录成功');  // 显示成功消息

      // 调用 store 中的 setUser 方法
      const userData = res.data.data; // 获取用户数据
      userStore.setUser({
        token: userData,  // 保存 token
        username: userData.username,
        avatar: userData.avatar || '', // 如果有其他用户信息也一起保存
        // 保存更多用户信息...
      });  // 设置用户信息到 store 中

      router.push('/');

      // router.push('/register')
    } else {
      ElMessage.error(res.data?.message || '用户名或密码错误');  // 错误提示
    }
  } catch (error) {
    ElMessage.error('登录失败');  // 异常处理
  }
};





// 社交登录方法
const loginWithQQ = async () => {
  try {
    loading.value = true
    // 这里应该调用 userStore 的社交登录方法
    // 例如: await userStore.socialLogin('qq')
    ElMessage.success('QQ登录成功')
  } catch (error) {
    if (error instanceof Error) {
      ElMessage.error(error.message || '登录失败')
    } else {
      ElMessage.error('登录失败')
    }
  } finally {
    loading.value = false
  }
}
const loginWithWeChat = () => {
  ElMessage.info('微信登录功能开发中')
  // 这里可以添加微信登录的逻辑
}

const loginWithAlipay = () => {
  ElMessage.info('支付宝登录功能开发中')
  // 这里可以添加支付宝登录的逻辑
}

// 注册和忘记密码
const showRegisterDialog = () => {
  ElMessage.info('注册账号')
  router.push('/register') // 跳转到注册页面
  // 这里可以显示注册对话框
}

const showResetPasswordDialog = () => {
  ElMessage.info('忘记密码')
  router.push('/reset-password') // 跳转到忘记密码页面
  // 这里可以显示重置密码对话框
}
</script>

<style lang="scss" scoped>
.login-container {
  position: fixed;
  width: 100%;
  height: 100%;
  background-image: url('D:/JAVA SHIT/web02/public/images/background.jpeg');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 0;
  }
  .login-box {
    position: relative;
    z-index: 1;
    width: 800px;
    height: 400px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    display: flex;
    overflow: hidden;
    flex-direction: row;
    /* 移动端布局（≤800px） */
    @media (max-width: 800px) {
      .login-box {
        flex-direction: column;
        width: 90%;
        height: auto;
        min-height: 500px;
        max-width: 400px;

        .divider {
          width: 100%;
          height: 1px;
          margin: 10px 0;  // 增加上下边距
        }

        .social-login,
        .form-login {
          padding: 20px !important;
          flex: none;
          width: 100%;

          .title {
            margin-bottom: 15px;  // 调整标题间距
            font-size: 16px;     // 缩小标题字号
          }
        }

        .social-buttons {
          margin-top: 0;
          padding-bottom: 10px;
          gap: 10px;  // 缩小按钮间距

          .social-btn {
            width: 100% !important;  // 按钮宽度100%
            max-width: 250px;        // 但限制最大宽度
            height: 36px;           // 缩小按钮高度
            padding-left: 30px;     // 调整图标位置

            .icon {
              left: 10px;           // 图标更靠近左侧
              width: 18px;
              height: 18px;
            }
          }
        }

        .login-form {
          .el-input {
            height: 36px;          // 缩小输入框高度

            ::v-deep .el-input__inner {
              height: 36px;        // 内部输入框高度
              font-size: 14px;     // 缩小字体
            }
          }

          .login-btn {
            height: 36px;          // 缩小登录按钮高度
            font-size: 14px !important;
          }
        }
      }

      .bottom-actions {
        flex-direction: column;
        gap: 8px;
        padding: 10px 0;
        width: 80%;
        text-align: center;

        .el-button {
          font-size: 13px;        // 缩小底部链接字号
        }
      }
    }
    .social-login, .form-login {
      flex: 1;
      padding: 30px;
      display: flex;
      flex-direction: column;
      justify-content: center; // 关键：使内容垂直居中
    }
    .title {
      font-size: 18px;
      color: #333;
      margin-bottom: 20px;
      text-align: center;
      font-weight: 500;
    }
    .divider {
      width: 1px;
      background-color: #dcdfe6;
      margin: 20px 0;
    }
    .social-login {
      .social-buttons {
        margin-top: -5px;
        display: flex;
        flex-direction: column;
        gap: 15px;
        flex: 1;
        justify-content: center;
        align-items: center;
        width: 100%;
        .el-button {
          width: 200px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 0 20px;
          span {
            margin-left: 10px;
          }
        }
        .social-icon {
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }
        .social-btn.qq {
          margin-left: 10px; /* 整个按钮右移5px */
        }
        .social-btn {
          width: 200px;
          height: 40px;
          position: relative; /* 让子元素可以绝对定位 */
          display: flex;
          align-items: center;
          justify-content: center; /* 文字居中 */
          padding-left: 40px; /* 给图标预留空间 */
          .icon {
            position: absolute;
            left: 15px; /* 图标距离左侧的距离 */
            width: 20px;
            height: 20px;
          }
          .text {
            width: 100%;
            text-align: center;
            margin-left: -25px; /* 补偿图标宽度 */
          }
        }
      }
    }
    .form-login {
      .login-form {
        width: 100%;

        .input-wrapper {
          position: relative;
          width: 100%;

          .custom-input {
            width: 100%;

            ::v-deep .el-input__inner {
              width: 100%;
              height: 40px;
              padding-left: 35px;
              background-color: transparent; /* 移除灰色背景 */
              border: 1px solid #dcdfe6;
              border-radius: 4px;

              &:focus {
                border-color: #409eff;
              }
            }
          }

          .svg-container {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 2;
            color: #889aa4;
          }

          .show-pwd {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            color: #889aa4;
            z-index: 2;

            &:hover {
              color: #409eff;
            }
          }
        }

        .login-btn {
          width: 100%;
          height: 40px;
          margin-top: 10px;
          font-size: 16px;
        }
      }
    }
  }
  .bottom-actions {
    @media (max-width: 800px) {
      flex-direction: column;
      gap: 8px;
      padding: 10px 0;
      width: 80%;
      text-align: center;
    }
    position: relative;
    z-index: 1;
    margin-top: 20px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 5px 20px;
    display: flex;
    gap: 15px;
    .el-button {
      color: #e0e0e0;
      font-size: 14px;
      &:hover {
        color: #ffffff;
      }
    }
  }
}
</style>