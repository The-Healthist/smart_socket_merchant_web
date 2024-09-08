<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">SmartSocket Merchant商城</div>
      <el-form
        :model="formData"
        :rules="rules"
        ref="login"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item prop="mobile">
          <el-input
            v-model="formData.mobile"
            placeholder="mobile"
          >
            <template #prepend>
              <el-button :icon="User"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="password"
            v-model="formData.password"
            @keyup.enter="submitForm(login)"
          >
            <template #prepend>
              <el-button :icon="Lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button
            type="primary"
            @click="submitForm(login)"
          >登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { Lock, User } from "@element-plus/icons-vue";
// import { adminLogin, adminProfile } from "../../api";
import { MerchantLogin } from "../../api/auth";

interface LoginInfo {
  mobile: string;
  password: string;
}

const router = useRouter();
const formData = reactive<LoginInfo>({
  mobile: "qwer",
  password: "test123",
});

const rules: FormRules = {
  mobile: [
    {
      required: true,
      message: "请输入手机号",
      trigger: "blur",
    },
  ],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};
const login = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined | any) => {
  if (!formEl) return;
  formEl.validate((valid: boolean) => {
    if (valid) {
      MerchantLogin(formData)
        .then((res) => {
          ElMessage.success("登录成功");
          localStorage.setItem("token", "Bearer " + res.data.token);
          router.push("/dashboard");
        })
        .catch((err) => {
          ElMessage.error(err.message);
        });
    } else {
      ElMessage.error("登录失败");
      return false;
    }
  });
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/login-bg.jpg);
  background-size: 100%;
}

.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.ms-content {
  padding: 30px 30px;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}

.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>
