<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-button type="default" @click="createVisible = true">新建赛事</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="40" align="center"></el-table-column>
        <el-table-column prop="name" width="120" label="名称"></el-table-column>
        <el-table-column prop="description" width="200" label="简介"></el-table-column>
        <el-table-column label="封面" width="200">
          <template #default="scope">
            {{ scope.row.cover }}
            <ElImage :src="scope.row.coverImage"></ElImage>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="340">
          <template #default="scope">
            <el-button text :icon="Edit" @click="handleDetail(scope.$index)" v-permiss="15">
              编辑
            </el-button>
            <el-button text :icon="Delete" class="red" @click="handleEdit(scope.$index)" v-permiss="16">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 创建 -->
    <el-dialog title="创建赛事" v-model="createVisible" width="60%">
      <el-form :model="eventForm" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="eventForm.name"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-input v-model="eventForm.description"></el-input>
        </el-form-item>
        <el-form-item label="封面">
          <el-button @click="coverInput.click()">上传封面</el-button>
          <img ref="coverImg" class="mt10" fit="cover" :src="eventForm.coverImage" style="width: 100%;" />
        </el-form-item>
        <input type="file" ref="coverInput" @change="onCoverUpload" hidden>
      </el-form>
      <template #footer>
        <el-button @click="createVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCreate">确 定</el-button>
      </template>
    </el-dialog>


    <!-- 弹出详情 -->
    <el-dialog title="编辑赛事" v-model="editVisible" width="60%">
      <el-form :model="eventForm" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="eventForm.name"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-input v-model="eventForm.description"></el-input>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="eventForm.active">
            <el-radio :label="true">启用</el-radio>
            <el-radio :label="false">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="封面">
          <el-button @click="coverInput.click()">上传封面</el-button>
          <img ref="coverImg" class="mt10" fit="cover" :src="eventForm.coverImage" style="width: 100%;" />
        </el-form-item>
        <input type="file" ref="coverInput" @change="onCoverUpload" hidden>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox, ElTag, FormInstance } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { fetchEvents, getUploadPolicy } from '../../api';
import axios from 'axios';
import { createEvent } from '../../api';
import { updateEvent } from '../../api';

// Table 数据展示
const tableData = ref<any>([])
const getData = () => {

  fetchEvents().then(res => {
    tableData.value = res.data.data;

  })
};
getData();


// 新建
const coverInput = ref<any>(null)
const coverImg = ref<any>(null)
const coverFile = ref<any>(null)
const createVisible = ref(false);
const editVisible = ref(false);
const form = ref<FormInstance>();
const eventForm = reactive({
  name: '',
  description: '',
  coverImage: '',
  active: true
})

const rules = reactive({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' },],
  description: [{ required: true, message: '请输入简介', trigger: 'blur' },],
  coverImage: [{ required: true, message: '请输选择封面', trigger: 'blur' },],
})

const onCoverUpload = (e: any) => {
  if (coverInput.value == null || coverInput.value.files.length === 0) {
    return
  }
  coverFile.value = coverInput.value.files[0]

  const reader = new FileReader()
  reader.readAsDataURL(coverFile.value)
  console.log(coverImg.value)
  reader.onload = () => {
    coverImg.value.src = reader.result
  }
};

const handleCreate = async () => {
  if (!form.value) return;
  form.value.validate(async (valid: boolean) => {
    if (!form) return;
    if (valid) {
      if (coverFile.value)
        await getUploadPolicy().then(async res => {
          let policy = res.data.data;
          const formData = new FormData();
          formData.append('key', policy.dir + coverFile.value.name);
          formData.append('policy', policy.policy);
          formData.append('OSSAccessKeyId', policy.accessid);
          formData.append('success_action_status', '200');
          formData.append('signature', policy.signature);
          formData.append('file', coverFile.value);
          await axios.post(policy.host, formData).then(res => {
            if (res.status === 200) {
              eventForm.coverImage = policy.host + '/' + policy.dir + coverFile.value.name;
            }
          })
        })
      coverFile.value = null
      createEvent(eventForm)
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

const handleDetail = (index: number) => {
  idx = index;
  Object.assign(eventForm, tableData.value[index]);
  editVisible.value = true;
};


// 编辑账户
const handleEdit = async (index: number) => {
  if (coverFile.value)
    await getUploadPolicy().then(async res => {
      let policy = res.data.data;
      const formData = new FormData();
      formData.append('key', policy.dir + coverFile.value.name);
      formData.append('policy', policy.policy);
      formData.append('OSSAccessKeyId', policy.accessid);
      formData.append('success_action_status', '200');
      formData.append('signature', policy.signature);
      formData.append('file', coverFile.value);
      await axios.post(policy.host, formData).then(res => {
        if (res.status === 200) {
          eventForm.coverImage = policy.host + '/' + policy.dir + coverFile.value.name;
        }
      })
    })
  coverFile.value = null
  updateEvent(tableData.value[idx].id, eventForm)
    .then((res: any) => {
      ElMessage.success('更新成功')
      editVisible.value = false
      getData()
    })
    .catch(() => {

      ElMessage.error('更新失败')
    });
}
</script>

<style scoped >
@import '../index.css'
</style>
