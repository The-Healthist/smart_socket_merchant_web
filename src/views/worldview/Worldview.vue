<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-button type="default" :icon="Plus" @click="createVisible = true, dialogMode = 'create'">创建</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="fraction" label="阵营"></el-table-column>
        <el-table-column prop="introduce" label="简介"></el-table-column>
        <el-table-column label="头像" width="100">
          <template #default="scope">
            {{ scope.row.cover }}
            <ElImage :src="scope.row.avatarUrl"></ElImage>
          </template>
        </el-table-column>
        <el-table-column label="肖像" width="200">
          <template #default="scope">
            {{ scope.row.cover }}
            <ElImage :src="scope.row.portrayUrl"></ElImage>
          </template>
        </el-table-column>
        <el-table-column label="提交时间" width="170">
          <template #default="scope">
            {{ scope.row.createdAt ? scope.row.createdAt.slice(0, 19).replace("T", " ") : '' }}
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
        <el-form-item label="阵营" prop="answer">
          <el-radio-group v-model="createForm.fraction">
            <el-radio label="red">红</el-radio>
            <el-radio label="blue">蓝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称（中文 English）" prop="question">
          <el-input v-model="createForm.name"></el-input>
        </el-form-item>
        <el-form-item label="简介（简述 完整）" prop="question">
          <el-input v-model="createForm.introduce"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-button @click="avatarInput.click()">上传头像</el-button>
          <img ref="avatarImg" class="mt10" fit="cover" :src="createForm.avatarUrl" style="width: 100%;" />
        </el-form-item>
        <input type="file" ref="avatarInput" @change="onAvatarUpload" hidden>
        <el-form-item label="立绘">
          <el-button @click="portrayInput.click()">上传立绘</el-button>
          <img ref="portrayImg" class="mt10" fit="cover" :src="createForm.portrayUrl" style="width: 100%;" />
        </el-form-item>
        <input type="file" ref="portrayInput" @change="onPortrayUpload" hidden>
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
import { ref, reactive } from 'vue';
import { ElInput, ElMessage, ElMessageBox, ElTag, FormInstance } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { fetchWorldviews, createWorldview, updateWorldview, deleteWorldview, getUploadPolicy } from '../../api';
import axios from 'axios';

const paginationQuery = reactive({
  pageNum: 1,
  pageSize: 10,
  desc: true,
  total: 0,
})
const dialogMode = ref<'create' | 'update'>('create');

// Table 数据展示
const tableData = ref<any>([])
const getData = () => {
  let query = Object.assign({}, paginationQuery)

  fetchWorldviews(query).then(res => {
    tableData.value = res.data.data;
    paginationQuery.pageNum = res.data.pagination.pageNum;
    paginationQuery.pageSize = res.data.pagination.pageSize;
    paginationQuery.total = res.data.pagination.total;
  })
};
getData();

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
    deleteWorldview({ ids: [tableData.value[index].id] })
      .then((res: any) => {
        ElMessage.success('删除成功')
        getData()
      })
      .catch(err => {
        ElMessage.error('删除失败')
      })
  })
};



const createForm = reactive({
  name: '',
  fraction: '',
  introduce: '',
  avatarUrl: '',
  portrayUrl: '',
});

const rules = reactive({
  // question: [{ required: true, message: '请输入问题', trigger: 'blur' },],
});
const mform = ref<FormInstance>();

// 图片上传
const avatarInput = ref<any>(null)
const avatarImg = ref<any>(null)
const avatarFile = ref<any>(null)

const onAvatarUpload = (e: any) => {
  if (avatarInput.value == null || avatarInput.value.files.length === 0) {
    return
  }
  avatarFile.value = avatarInput.value.files[0]

  const reader = new FileReader()
  reader.readAsDataURL(avatarFile.value)
  console.log(avatarImg.value)
  reader.onload = () => {
    avatarImg.value.src = reader.result
  }
};

const portrayInput = ref<any>(null)
const portrayImg = ref<any>(null)
const portrayFile = ref<any>(null)

const onPortrayUpload = (e: any) => {
  if (portrayInput.value == null || portrayInput.value.files.length === 0) {
    return
  }
  portrayFile.value = portrayInput.value.files[0]

  const reader = new FileReader()
  reader.readAsDataURL(portrayFile.value)
  console.log(portrayImg.value)
  reader.onload = () => {
    portrayImg.value.src = reader.result
  }
};

// 创建弹出框
const createVisible = ref(false);
const handleCreate = () => {
  if (!mform.value) return;
  mform.value.validate(async (valid: boolean) => {
    if (valid) {
      if (avatarFile.value)
        await getUploadPolicy().then(async res => {
          let policy = res.data.data;
          const formData = new FormData();
          formData.append('key', policy.dir + avatarFile.value.name);
          formData.append('policy', policy.policy);
          formData.append('OSSAccessKeyId', policy.accessid);
          formData.append('success_action_status', '200');
          formData.append('signature', policy.signature);
          formData.append('file', avatarFile.value);
          await axios.post(policy.host, formData).then(res => {
            if (res.status === 200) {
              createForm.avatarUrl = policy.host + '/' + policy.dir + avatarFile.value.name;
            }
          })
        })
      avatarFile.value = null

      if (portrayFile.value)
        await getUploadPolicy().then(async res => {
          let policy = res.data.data;
          const formData = new FormData();
          formData.append('key', policy.dir + portrayFile.value.name);
          formData.append('policy', policy.policy);
          formData.append('OSSAccessKeyId', policy.accessid);
          formData.append('success_action_status', '200');
          formData.append('signature', policy.signature);
          formData.append('file', portrayFile.value);
          await axios.post(policy.host, formData).then(res => {
            if (res.status === 200) {
              createForm.portrayUrl = policy.host + '/' + policy.dir + portrayFile.value.name;
            }
          })
        })
      portrayFile.value = null

      console.log(dialogMode.value)
      if (dialogMode.value == 'create')
        createWorldview(createForm)
          .then((res: any) => {
            ElMessage.success('创建成功');
            getData();
            createVisible.value = false;
          })
          .catch(err => {
            ElMessage.error('创建失败');
          })
      else if (dialogMode.value == 'update')
        updateWorldview(createForm)
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

// 查看详情
let idx: number = -1;
const handleDetail = (index: number) => {
  idx = index;
  Object.assign(createForm, tableData.value[index]);
  createVisible.value = true;
};
</script>

<style scoped>
@import '../index.css'
</style>
