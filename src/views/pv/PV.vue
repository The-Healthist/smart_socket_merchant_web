<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-button type="default" :icon="Plus" @click="createVisible = true, dialogMode = 'create'">创建</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
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
        <el-form-item label="标题" prop="title">
          <el-input v-model="createForm.title"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="createForm.description"></el-input>
        </el-form-item>
        <el-form-item label="视频">
          <el-button @click="videoInput.click()">上传视频</el-button>
          <video ref="videoVideo" class="mt10" fit="cover" :src="createForm.videoUrl" style="width: 100%;" />
        </el-form-item>
        <input type="file" ref="videoInput" @change="onAvatarUpload" hidden>
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
import { fetchPVs, createPV, updatePV, deletePVs, getUploadPolicy } from '../../api';

import axios from 'axios';

let idx: number = -1;
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

  fetchPVs(query).then(res => {
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
    deletePVs({ ids: [tableData.value[index].id] })
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
  title: '',
  description: '',
  videoUrl: '',
});

const rules = reactive({
  // question: [{ required: true, message: '请输入问题', trigger: 'blur' },],
});
const mform = ref<FormInstance>();

// 图片上传
const videoInput = ref<any>(null)
const videoVideo = ref<any>(null)
const videoFile = ref<any>(null)

const onAvatarUpload = (e: any) => {
  if (videoInput.value == null || videoInput.value.files.length === 0) {
    return
  }
  videoFile.value = videoInput.value.files[0]

  const reader = new FileReader()
  reader.readAsDataURL(videoFile.value)
  reader.onload = () => {
    videoVideo.value.src = reader.result
  }
};

// 创建弹出框
const createVisible = ref(false);
const handleCreate = () => {
  if (!mform.value) return;
  mform.value.validate(async (valid: boolean) => {
    if (valid) {
      if (videoFile.value)
        await getUploadPolicy().then(async res => {
          let policy = res.data.data;
          const formData = new FormData();
          formData.append('key', policy.dir + videoFile.value.name);
          formData.append('policy', policy.policy);
          formData.append('OSSAccessKeyId', policy.accessid);
          formData.append('success_action_status', '200');
          formData.append('signature', policy.signature);
          formData.append('file', videoFile.value);
          await axios.post(policy.host, formData).then(res => {
            if (res.status === 200) {
              createForm.videoUrl = policy.host + '/' + policy.dir + videoFile.value.name;
            }
          })
        })
      videoFile.value = null

      if (dialogMode.value == 'create')
        createPV(createForm)
          .then((res: any) => {
            ElMessage.success('创建成功');
            getData();
            createVisible.value = false;
          })
          .catch(err => {
            ElMessage.error('创建失败');
          })
      else if (dialogMode.value == 'update')
        updatePV(tableData.value[idx].id, createForm)
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
const handleDetail = (index: number) => {
  idx = index;
  Object.assign(createForm, tableData.value[index]);
  createVisible.value = true;
};
</script>

<style scoped>
@import '../index.css'
</style>
