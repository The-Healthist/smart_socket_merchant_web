<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="mgb20" style="height: 252px">
          <div class="user-info">
            <el-avatar :size="120" :src="imgurl" />
            <div class="user-info-cont">
              <div class="user-info-name">{{ name }}</div>
              <div>{{ role }}</div>
            </div>
          </div>
          <div class="user-info-list">
            上次登录时间：
            <span>2022-10-01</span>
          </div>
          <div class="user-info-list">
            上次登录地点：
            <span>东莞</span>
          </div>
        </el-card>
        <!-- 修改密码 -->
        <el-card shadow="hover" style="">
          <div class="user-info">
            <div class="user-info-cont">
              <div class="user-info-name">修改密码</div>
            </div>
          </div>
          <div class="user-info-list">
            <el-form :model="dataForm" ref="form" :rules="rules" label-width="80px">
              <el-form-item label="旧密码" prop="oldPassword">
                <el-input v-model="dataForm.oldPassword" type="password" placeholder="请输入旧密码"></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="dataForm.newPassword" type="password" placeholder="请输入新密码"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="dataForm.confirmPassword" type="password" placeholder="请再次输入新密码"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">修改</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-1">
                <el-icon class="grid-con-icon">
                  <User />
                </el-icon>
                <div class="grid-cont-right">
                  <div class="grid-num">123412</div>
                  <div>用户访问量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-2">
                <el-icon class="grid-con-icon">
                  <ChatDotRound />
                </el-icon>
                <div class="grid-cont-right">
                  <div class="grid-num">321</div>
                  <div>评论数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-3">
                <el-icon class="grid-con-icon">
                  <Goods />
                </el-icon>
                <div class="grid-cont-right">
                  <div class="grid-num">5000</div>
                  <div>作品数量</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

      </el-col>
    </el-row>
    <el-row :gutter="20">
      <!-- <el-col :span="12">
				<el-card shadow="hover">
					<schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>
				</el-card>
			</el-col>
			<el-col :span="12">
				<el-card shadow="hover">
					<schart ref="line" class="schart" canvasId="line" :options="options2"></schart>
				</el-card>
			</el-col> -->
    </el-row>
  </div>
</template>

<script setup lang="ts" name="dashboard">
import Schart from 'vue-schart';
import { reactive } from 'vue';
import imgurl from '../../assets/img/img.jpg';
import { ElMessage, FormInstance } from 'element-plus';
import { ref } from 'vue';
import { adminChangePwd } from '../../api';

const name = localStorage.getItem('ms_username');
const role: string = name === 'admin' ? '超级管理员' : '普通用户';

const form = ref<FormInstance>();
const dataForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});
const rules = reactive({
  oldPassword: [
    { required: true, message: '请输入旧密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
});

const onSubmit = () => {
  if (dataForm.newPassword !== dataForm.confirmPassword) {
    ElMessage.error('两次输入的密码不一致');
  }
  if (!form.value) return;
  form.value.validate((valid: boolean) => {
    if (valid) {
      adminChangePwd(dataForm)
        .then((res: any) => {
          ElMessage.success('修改成功');
        })
        .catch((err: any) => {
          console.log(err.response.data)
          ElMessage.error("修改失败");
        });
    } else {
      ElMessage.error('请检查输入的内容');
    }
  })
}

</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}

.project-list {}

.project-list-item {
  display: flex;
  padding: 15px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  width: 240px;

  border-radius: 10px;
  background: #FFF;
  box-shadow: 2px 2px 8px 0px rgba(0, 0, 0, 0.10);
}

.project-list-item-child {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.project-list-item-wrapper {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 8px;
}

.project-list-item-wrapper .head {
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 10px;
}

.project-list-item-wrapper .head :first-child {
  color: #000;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px;
}

.project-list-item-wrapper .head :last-child {
  color: #AAA;
  font-family: Inter;
  font-size: 11px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  /* 145.455% */
}
</style>
