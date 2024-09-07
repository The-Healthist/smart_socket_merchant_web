<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="filterQuery.search" placeholder="用户名/邮箱/手机号" class="handle-input mr10"></el-input>
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="default" @click="clearFilter">清除筛选</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="nickname" label="昵称" width="140"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="120"></el-table-column>
        <el-table-column prop="city" label="城市/地区" width="120"></el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag :type="userStatusList[scope.row.userBlock ? 1 : 0].color">
              {{ userStatusList[scope.row.userBlock ? 1 : 0].label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="360">
          <template #default="scope">
            <el-button text :icon="Edit" @click="handleDetail(scope.$index)" v-permiss="15">
              查看详情
            </el-button>
            <el-button text :icon="Edit" @click="handleReset(scope.$index)" v-permiss="15">
              重置密码
            </el-button>
            <el-button text :icon="Delete" class="red" v-if="!scope.row.userBlock" @click="handleBlock(scope.$index)"
              v-permiss="16">
              封禁
            </el-button>
            <el-button text :icon="Delete" v-else @click="handleUnblock(scope.$index)" v-permiss="16">
              解封
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="paginationQuery.pageNum"
          :page-size="paginationQuery.pageSize" :total="paginationQuery.total"
          @current-change="handlePageChange"></el-pagination>
      </div>
    </div>


    <!-- 弹出详情 -->
    <el-dialog title="作品详情" v-model="detailVisible" width="60%">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="昵称" label-align="right" align="left" label-class-name="my-label"
          class-name="my-content">
          {{ detailData.nickname }}
        </el-descriptions-item>
        <el-descriptions-item label="邮箱" label-align="right" align="left">
          {{ detailData.email }}
        </el-descriptions-item>
        <el-descriptions-item label="手机号" label-align="right" align="left">
          {{ detailData.mobile }}
        </el-descriptions-item>
        <el-descriptions-item label="城市/地区" label-align="right" align="left">
          {{ detailData.city }}
        </el-descriptions-item>
        <el-descriptions-item label="状态" label-align="right" align="left">
          <el-tag size="small" :type="userStatusList[detailData.userBlock ? 1 : 0].color">{{
            userStatusList[detailData.userBlock ? 1 : 0].label }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="个人简介" min-width="90" label-align="right" align="left">
          {{ detailData.description }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleReset">重置密码</el-button>
          <el-button type="danger" v-if="!detailData.userBlock"  @click="handleBlock(idx)">封禁</el-button>
          <el-button type="primary" v-else @click="handleUnblock(idx)">解封</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox, ElTag } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { blockUser, fetchUsers, unblockUser } from '../../api';
import { userStatusList } from '../../refs'

const initPaginationQuery = reactive({
  pageNum: 1,
  pageSize: 10,
  desc: true,
  total: 0,
})

const initFilterQuery = reactive({
  search: '',
})

const paginationQuery = reactive({
  pageNum: 1,
  pageSize: 10,
  desc: true,
  total: 0,
})

const filterQuery = reactive({
  search: '',
})

// Table 数据展示
const tableData = ref<any>([])
const getData = () => {
  let query = Object.assign({}, paginationQuery, filterQuery)

  fetchUsers(query).then(res => {
    tableData.value = res.data.data;
    paginationQuery.pageNum = res.data.pagination.pageNum;
    paginationQuery.pageSize = res.data.pagination.pageSize;
    paginationQuery.total = res.data.pagination.total;
  })
};
getData();

// 查询操作
const handleSearch = () => {
  paginationQuery.pageNum = 1
  getData();
};

// 分页导航
const handlePageChange = (val: number) => {
  paginationQuery.pageNum = val;
  getData();
};

// 筛选
const handleFilterChange = () => {
  getData();
}

// 清除筛选
const clearFilter = () => {
  Object.assign(paginationQuery, initPaginationQuery);
  Object.assign(filterQuery, initFilterQuery);
  getData()
}

// 查看详情
let idx: number = -1;
const detailVisible = ref(false);
const detailData = ref<any>({});

const handleDetail = (index: number) => {
  idx = index;
  Object.assign(detailData.value, tableData.value[index]);
  detailVisible.value = true;
};

// 重置密码
const handleReset = (index: number) => {
  ElMessageBox.confirm('确定要重置密码？', '提示', {
    type: 'warning'
  })
    .then(() => {
      ElMessage.success('重置成功');
    })
    .catch(() => { });
};

// 封禁账号
const handleBlock = (index: number) => {
  ElMessageBox.prompt('请输入封禁理由', '提示', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
  }).then(({ value }) => {
    blockUser(tableData.value[index].id, { reason: value })
      .then(res => {
        ElMessage.success('封禁成功')
        detailVisible.value = false
        getData()
      })
      .catch(err => {
        ElMessage.error('封禁失败')
      })
  })
}

const handleUnblock = (index: number) => {
  unblockUser(tableData.value[index].id)
    .then(res => {
      ElMessage.success('解封成功')
      detailVisible.value = false
      getData();
    })
    .catch(err => {
      ElMessage.error('解封失败')
    })
}
</script>

<style scoped>
@import '../index.css'
</style>
