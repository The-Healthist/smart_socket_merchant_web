<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <el-icon v-if="sidebar.collapse">
        <Expand />
      </el-icon>
      <el-icon v-else>
        <Fold />
      </el-icon>
    </div>
    <div class="logo">Origin</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ username }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { useSidebarStore } from "../store/sidebar";
import { useRouter } from "vue-router";
import { useTagsStore } from "../store/tags";
import imgurl from "../assets/img/img.jpg";
import { ElMessage } from "element-plus";

const username: string | null = localStorage.getItem("nickname");
const message: number = 2;

const sidebar = useSidebarStore();
const tagsStore = useTagsStore();
// 侧边栏折叠
const collapseChage = () => {
  sidebar.handleCollapse();
};

// onMounted(() => {
// 	if (document.body.clientWidth < 1500) {
// 		collapseChage();
// 	}
// });

// // 用户名下拉菜单选择事件
const router = useRouter();
const handleCommand = (command: string) => {
  if (command == "loginout") {
    // 清除所有用户相关数据
    localStorage.removeItem("token");
    localStorage.removeItem("nickname");
    localStorage.removeItem("email");

    // 清除标签视图
    tagsStore.clearTags();

    // 显示退出成功消息
    ElMessage.success("退出登录成功");

    // 跳转到登录页
    router.push("/login");
  } else if (command == "user") {
    router.push("/user");
  }
};

// const getProfile = () => {
// 	adminProfile()
// 	.then((res) => {
// 		localStorage.setItem('nickname', res.data.data.nickname);
// 		localStorage.setItem('email', res.data.data.email);
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	});
// };
// getProfile();
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
}

.collapse-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  float: left;
  padding: 0 21px;
  cursor: pointer;
}

.header .logo {
  float: left;
  width: 250px;
  line-height: 70px;
}

.header-right {
  float: right;
  padding-right: 50px;
}

.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}

.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}

.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.btn-bell-badge {
  position: absolute;
  right: 4px;
  top: 0px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}

.btn-bell .el-icon-lx-notice {
  color: #fff;
}

.user-name {
  margin-left: 10px;
}

.user-avator {
  margin-left: 20px;
}

.el-dropdown-link {
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.el-dropdown-menu__item {
  text-align: center;
}
</style>
