<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="sidebar.collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-sub-menu
            :index="item.index"
            :key="item.index"
            v-permiss="item.permiss"
          >
            <template #title>
              <el-icon>
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-sub-menu
                v-if="subItem.subs"
                :index="subItem.index"
                :key="subItem.index"
                v-permiss="item.permiss"
              >
                <template #title>{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >
                  {{ threeItem.title }}
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item
                v-else
                :index="subItem.index"
                v-permiss="item.permiss"
              >
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item
            :index="item.index"
            :key="item.index"
            v-permiss="item.permiss"
          >
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSidebarStore } from "../store/sidebar";
import { useRoute } from "vue-router";

const items = <any>[
  {
    icon: "Odometer",
    index: "/dashboard",
    title: "系统首页",
    permiss: "1",
  },
  {
    // Manuscript
    icon: "Film",
    index: "/event",
    title: "赛事管理",
  },
  {
    icon: "Odometer",
    index: "/device_management",
    title: "设备管理",
  },
  {
    icon: "Odometer",
    index: "/device_type_management",
    title: "设备类型管理",
  },
  // {
  //   // Manuscript
  //   icon: 'Film',
  //   index: '/manuscript',
  //   title: '稿件管理',
  // },
  // {
  //   // Participant
  //   icon: 'User',
  //   index: '/participant',
  //   title: '选手管理',
  // },
  // {
  //   // Voting
  //   icon: 'Checked',
  //   index: '/voting',
  //   title: '投票管理',
  // },
  // {
  //   // Voting
  //   icon: 'Failed',
  //   index: '/blacklist',
  //   title: '黑名单',
  // },
  {
    // Q&A
    icon: "QuestionFilled",
    index: "/qa",
    title: "Q&A",
  },
  {
    // Voting
    icon: "UserFilled",
    index: "/account_admin",
    title: "管理员账户",
  },
  // {
  //   icon: 'UserFilled',
  //   index: '/worldview',
  //   title: '世界观',
  // },
  // {
  //   icon: 'UserFilled',
  //   index: '/pv',
  //   title: 'PV',
  // },
  // {
  //   icon: 'UserFilled',
  //   index: '/partner',
  //   title: '合作伙伴',
  // },
  // {
  //   icon: 'UserFilled',
  //   index: '/special_guest',
  //   title: '特邀嘉宾',
  // },
  // {
  //   icon: 'UserFilled',
  //   index: '/sponsor',
  //   title: '主办方',
  // },
];

const route = useRoute();
const onRoutes = computed(() => {
  return route.path;
});

const sidebar = useSidebarStore();
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}

.sidebar > ul {
  height: 100%;
}
</style>
