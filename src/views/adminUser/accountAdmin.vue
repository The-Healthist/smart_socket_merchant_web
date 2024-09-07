<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="filterQuery.search" placeholder="用户名/邮箱/手机号" class="handle-input mr10"></el-input>
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        <el-button type="default" @click="clearFilter">清除筛选</el-button>
        <el-button type="default" @click="createVisible = true">创建用户</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="40" align="center"></el-table-column>
        <el-table-column prop="nickname" width="120" label="姓名"></el-table-column>
        <el-table-column prop="email" width="200" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="200"></el-table-column>
        <el-table-column label="操作" align="center" width="340">
          <template #default="scope">
            <el-button text :icon="Edit" @click="handleDetail(scope.$index)" v-permiss="15">
              查看详情
            </el-button>
            <el-button text :icon="Edit" @click="handleReset(scope.$index)" v-permiss="15">
              重置密码
            </el-button>
            <el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index)" v-permiss="16">
              删除
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

    <!-- 创建用户 -->
    <el-dialog title="创建用户" v-model="createVisible" width="60%">
      <el-form :model="formData" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formData.nickname"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="formData.mobile"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCreate">确 定</el-button>
      </template>
    </el-dialog>


    <!-- 弹出详情 -->
    <el-dialog title="用户详情" v-model="detailVisible" width="60%">
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
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleReset">重置密码</el-button>
          <el-button @click="handleDelete">删除账号</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox, ElTag, FormInstance } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { fetchAdminUsers } from '../../api';
import { deleteAdminUser } from '../../api';
import { resetAdminUser, createAdminUser } from '../../api';

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

  fetchAdminUsers(query).then(res => {
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

// 创建用户
const createVisible = ref(false);
const form = ref<FormInstance>();
const formData = reactive({
  nickname: '',
  email: '',
  mobile: '',
  password: '',
})
const rules = reactive({
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' },],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' },],
  mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' },],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' },],
})

const handleCreate = () => {
  if (!form.value) return;
  form.value.validate((valid: boolean) => {
    if (!form) return;
    if (valid) {
      createAdminUser(formData)
        .then((res: any) => {
          ElMessage.success('创建成功')
          getData()
          createVisible.value = false
        })
        .catch(() => { });
    } else {
      return false;
    }
  });
};

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
      resetAdminUser(tableData.value[index].id)
        .then((res: any) => {
          ElMessage.success('密码重置为123456')
          getData()
        })
        .catch(err => {
          ElMessage.error('删除失败')
        })
    })
    .catch(() => { });
};

// 删除账户
const handleDelete = (index: number) => {
  if (tableData.value[index].email === localStorage.getItem('email')) {
    ElMessage.error('不能删除自己的账户')
    return
  }
  ElMessageBox.confirm('确定要删除账户？', '提示', {
    type: 'warning'
  })
    .then(() => {
      deleteAdminUser({ ids: [tableData.value[index].id] })
        .then((res: any) => {
          ElMessage.success('删除成功')
          getData()
        })
        .catch(err => {
          ElMessage.error('删除失败')
        })
    })
    .catch(() => { });
}
</script>

<style scoped>
@import '../index.css'
</style>
