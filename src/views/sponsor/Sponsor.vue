<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-button type="default" :icon="Plus" @click="createVisible = true, dialogMode = 'create'">创建</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="user.nickname" label="用户"></el-table-column>
        <el-table-column prop="position" label="职务"></el-table-column>
        <el-table-column prop="introduce" label="简介"></el-table-column>
        <el-table-column prop="qqNumber" label="QQ"></el-table-column>
        <el-table-column prop="personalHomepage" label="个人主页"></el-table-column>
        <el-table-column prop="works" label="代表作">
          <template #default="scope">
            <ElTag v-for="item in scope.row.works">{{ item.title }}</ElTag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template #default="scope">
            <el-button text :icon="Edit" @click="handleDetail(scope.$index); dialogMode = 'update'" v-permiss="15">
              编辑
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

    <!-- 创建弹出框 -->
    <el-dialog title="创建" v-model="createVisible" width="60%">
      <el-form label-width="180px" :rules="rules" ref="mform" :model="createForm">
        <el-form-item label="用户" prop="title">
          <el-select v-model="createForm.userId" filterable remote reserve-keyword remote-show-suffix
            placeholder="请输入完整昵称" :remote-method="searchUser" :loading="loading" @change="searchManuscript">
            <el-option v-for="item in userData" :key="item.id" :label="item.nickname" :value="item.id">
              <div style="display: flex; align-items: center;">
                <el-avatar :src="item.avatar" size="small" style="margin-right: 8px;"></el-avatar>
                <span style="font-size: 13px;">{{ item.nickname }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代表作">
          <el-select v-model="createForm.works" filterable remote multiple reserve-keyword remote-show-suffix
            :remote-method="searchManuscript" placeholder="请选择代表作">
            <el-option v-for="item in manuscriptData" :key="item.id" :label="item.title" :value="item.id">
              <div style="display: flex; align-items: center;">
                <span style="font-size: 13px;">{{ item.title }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职务" prop="title">
          <el-input v-model="createForm.position"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="title">
          <el-input v-model="createForm.introduce"></el-input>
        </el-form-item>
        <el-form-item label="QQ" prop="title">
          <el-input v-model="createForm.qqNumber"></el-input>
        </el-form-item>
        <el-form-item label="个人主页" prop="body">
          <el-input v-model="createForm.personalHomepage"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleCreate">保 存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive, watch } from 'vue';
import { ElInput, ElMessage, ElMessageBox, ElTag, FormInstance } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { fetchSponsors, createSponsor, updateSponsor, deleteSponsors, fetchUsers, fetchManuscripts } from '../../api';

const paginationQuery = reactive({
  pageNum: 1,
  pageSize: 10,
  desc: true,
  total: 0,
})
const dialogMode = ref<'create' | 'update'>('create');

const createForm = reactive({
  userId: null,
  position: '',
  introduce: '',
  qqNumber: '',
  personalHomepage: '',
  works: [],
});

const resetForm = () => {
  Object.assign(createForm, {
    userId: null,
    position: '',
    introduce: '',
    qqNumber: '',
    personalHomepage: '',
    works: [],
  })
};
// 表单
const mform = ref<FormInstance>();
const rules = reactive({
  // question: [{ required: true, message: '请输入问题', trigger: 'blur' },],
});

// Table 数据展示
const tableData = ref<any>([])
// 选择用户
const loading = ref(false)
const userData = ref<any>([])
const manuscriptData = ref<any>([])


const getData = () => {
  let query = Object.assign({}, paginationQuery)

  fetchSponsors(query).then(res => {
    tableData.value = res.data.data;
    paginationQuery.pageNum = res.data.pagination.pageNum;
    paginationQuery.pageSize = res.data.pagination.pageSize;
    paginationQuery.total = res.data.pagination.total;
  })
};

// 分页导航
const handlePageChange = (val: number) => {
  paginationQuery.pageNum = val;
  getData();
};


// 删除操作
const handleDelete = (index: number) => {
  // 二次确认删除
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  }).then(() => {
    deleteSponsors({ ids: [tableData.value[index].id] })
      .then((res: any) => {
        ElMessage.success('删除成功')
        getData()
      })
      .catch(err => {
        ElMessage.error('删除失败')
      })
  })
};

// 创建弹出框
const createVisible = ref(false);
const handleCreate = () => {
  if (!mform.value) return;
  mform.value.validate(async (valid: boolean) => {
    if (valid) {

      if (dialogMode.value == 'create')
        createSponsor(createForm)
          .then((res: any) => {
            ElMessage.success('创建成功');
            getData();
            createVisible.value = false;
          })
          .catch(err => {
            ElMessage.error('创建失败');
          })
      else if (dialogMode.value == 'update')
        updateSponsor(tableData.value[idx].id, createForm)
          .then((res: any) => {
            ElMessage.success('保存成功');
            getData();
            createVisible.value = false;
          })
          .catch(err => {
            ElMessage.error('保存失败');
          })
    }
  })
}

// 搜索用户
const searchUser = (query: string) => {
  if (query !== '') {
    fetchUsers({ nickname: query }).then(res => {
      userData.value = res.data.data
    })
  } else {
    userData.value = [];
  }
};

const searchManuscript = (query: string) => {
  fetchManuscripts({ ownerId: createForm.userId }).then(res => {
    manuscriptData.value = res.data.data
  })
};

// 查看详情
let idx: number = -1;
const handleDetail = (index: number) => {
  idx = index;
  Object.assign(createForm, tableData.value[index]);
  createVisible.value = true;
};

// 监听弹出框关闭
watch(createVisible, (val: boolean) => {
  if (!val) {
    resetForm();
  }
})

// 初始化
getData();
</script>

<style scoped>
@import '../index.css'
</style>
