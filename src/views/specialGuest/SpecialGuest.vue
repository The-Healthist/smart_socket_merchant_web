<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-button type="default" :icon="Plus" @click="createVisible = true, dialogMode = 'create'">创建</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="representative" label="代表作品"></el-table-column>
        <el-table-column prop="status" width="70"  label="状态">
          <template #default="scope">
            <el-tag v-if="scope.row.status == 1" type="success">启用</el-tag>
            <el-tag v-else-if="scope.row.status == 0" type="warning">隐藏</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="封面" width="100">
          <template #default="scope">
            {{ scope.row.cover }}
            <ElImage :src="scope.row.coverImageUrl"></ElImage>
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
        <el-form-item label="标题" prop="title">
          <el-input v-model="createForm.name"></el-input>
        </el-form-item>
        <el-form-item label="阵营" prop="answer">
          <el-radio-group v-model="createForm.status">
            <el-radio :label="0">隐藏</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="代表作" prop="body">
          <el-input v-model="createForm.representative"></el-input>
        </el-form-item>
        <el-form-item label="封面">
          <el-button @click="coverInput.click()">上传封面</el-button>
          <img ref="coverImg" class="mt10" fit="cover" :src="createForm.coverImageUrl" style="width: 100%;" />
        </el-form-item>
        <input type="file" ref="coverInput" @change="onAvatarUpload" hidden>
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
import { fetchSpecialGuests, createSpecialGuest, updateSpecialGuest, deleteSpecialGuests, getUploadPolicy } from '../../api';
import axios from 'axios';

const paginationQuery = reactive({
  pageNum: 1,
  pageSize: 10,
  desc: true,
  total: 0,
})
const dialogMode = ref<'create' | 'update'>('create');

const createForm = reactive({
  name: '',
  status: 1,
  representative: '',
  coverImageUrl: '',
});

const resetForm = () => {
  Object.assign(createForm, {
    name: '',
    status: 1,
    representative: '',
    coverImageUrl: '',
  })
};
// 表单
const mform = ref<FormInstance>();
const rules = reactive({
  // question: [{ required: true, message: '请输入问题', trigger: 'blur' },],
});
// 图片上传
const coverInput = ref<any>(null)
const coverImg = ref<any>(null)
const coverFile = ref<any>(null)

// Table 数据展示
const tableData = ref<any>([])
const getData = () => {
  let query = Object.assign({}, paginationQuery)

  fetchSpecialGuests(query).then(res => {
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
    deleteSpecialGuests({ ids: [tableData.value[index].id] })
      .then((res: any) => {
        ElMessage.success('删除成功')
        getData()
      })
      .catch(err => {
        ElMessage.error('删除失败')
      })
  })
};

// 图片上传
const onAvatarUpload = (e: any) => {
  if (coverInput.value == null || coverInput.value.files.length === 0) {
    return
  }
  coverFile.value = coverInput.value.files[0]

  const reader = new FileReader()
  reader.readAsDataURL(coverFile.value)
  reader.onload = () => {
    coverImg.value.src = reader.result
  }
};

// 创建弹出框
const createVisible = ref(false);
const handleCreate = () => {
  if (!mform.value) return;
  mform.value.validate(async (valid: boolean) => {
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
              createForm.coverImageUrl = policy.host + '/' + policy.dir + coverFile.value.name;
            }
          })
        })
      coverFile.value = null

      if (dialogMode.value == 'create')
        createSpecialGuest(createForm)
          .then((res: any) => {
            ElMessage.success('创建成功');
            getData();
            createVisible.value = false;
          })
          .catch(err => {
            ElMessage.error('创建失败');
          })
      else if (dialogMode.value == 'update')
        updateSpecialGuest(tableData.value[idx].id, createForm)
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

// 监听弹出框关闭
watch(createVisible, (val: boolean) => {
  if (!val) {
    resetForm();
    coverImg.value.src = '';
  }
})

// 初始化
getData();
</script>

<style scoped>
@import '../index.css'
</style>
