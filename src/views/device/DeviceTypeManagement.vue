<template>
  <div class="device-type-management">
    <h1>设备类型管理</h1>

    <!-- 过滤器部分 -->
    <div class="filter-section">
      <!-- 按名称搜索输入框 -->
      <el-input
        v-model="filters.name"
        placeholder="按名称筛选"
        @input="handleFilter"
      />
      <!-- 按设备类型过滤下拉框 -->
      <!-- <el-select
        v-model="filters.deviceTypeId"
        placeholder="按设备类型过滤"
        @change="handleFilter"
      >
        <el-option
          label="全部"
          :value="null"
        />
        <el-option
          label="Type 1"
          :value="1"
        />
        <el-option
          label="Type 2"
          :value="2"
        />
        <el-option
          label="Type 3"
          :value="3"
        />
      </el-select> -->
      <!-- 添加设备类型按钮 -->
      <el-button
        class="add-device-type-button"
        @click="addDeviceTypeFunction"
      >添加设备类型</el-button>
    </div>

    <!-- 设备类型列表表格 -->
    <el-table
      :data="deviceTypeShowInTable"
      style="width: 100%"
    >
      <!-- 表格列定义 -->
      <el-table-column
        prop="name"
        label="名称"
      />
      <el-table-column
        prop="description"
        label="描述"
      />

      <el-table-column
        prop="pictureUrl"
        label="图片"
      >
        <template #default="{ row }">
          <!-- 可放大查看 -->
          <el-image
            :src="row.pictureUrl"
            style=" height: 80px"
            fit="contain"
            preview-src-list="[row.pictureUrl]"
          >
            <template #error>
              <div class="image-slot">
                <el-icon><icon-picture /></el-icon>
              </div>
            </template>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="updatedAt"
        label="更新时间"
      >
        <template #default="{ row }">
          {{ formatDate(row.updatedAt) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="manualUrl"
        label="手册链接"
      >
        <template #default="{ row }">
          <a
            v-if="row.manualUrl"
            :href="row.manualUrl"
            target="_blank"
          >查看手册</a>
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button @click="editDeviceType(row)">编辑</el-button>
          <el-button
            @click="deleteDeviceTypeHandler(row)"
            type="danger"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      @current-change="handlePageChange"
      layout="prev, pager, next"
    />

    <!-- 添加/编辑设备类型对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
    >
      <!-- 设备类型表单 -->
      <el-form
        :model="currentDeviceType"
        label-width="120px"
      >
        <el-form-item
          label="名称"
          required
        >
          <el-input v-model="currentDeviceType.name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="currentDeviceType.description" />
        </el-form-item>
        <el-form-item label="手册链接">
          <div class="col_flex">
            <el-button @click="manualUrlInput.click()">上传手册</el-button>
            <img
              ref="manualUrlImg"
              class="mt10"
              fit="contain"
              :src="currentDeviceType.manualUrl"
              style="max-height: 200px;max-width: 200px;"
            />
            <input
              type="file"
              ref="manualUrlInput"
              @change="onManualUrlUpload"
              hidden
            >
          </div>

        </el-form-item>
        <el-form-item label="图片链接">
          <div class="col_flex">
            <el-button @click="avatarPictureUrlInput.click()">上传头像</el-button>
            <img
              ref="avatarPictureUrlImg"
              class="mt10"
              fit="contain"
              :src="currentDeviceType.pictureUrl"
              style="max-height: 200px;max-width: 200px;"
            />
            <input
              type="file"
              ref="avatarPictureUrlInput"
              @change="onAvatarUpload"
              hidden
            >
          </div>

        </el-form-item>
        <el-form-item label="是否公开">
          <el-switch v-model="currentDeviceType.isPublic" />
        </el-form-item>
      </el-form>

      <!-- 对话框底部按钮 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="saveDeviceType"
          >保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import {
  getDeviceTypes,
  addDeviceType,
  updateDeviceType,
  deleteDeviceType,
} from "@/api/deviceType";
import { ElMessage } from "element-plus";
import { getUploadPolicy } from "@/api/file";
import axios from "axios";
import moment from "moment";

// 设备类型接口定义
interface DeviceType {
  id?: number;
  name?: string;
  description?: string;
  manualUrl?: string;
  pictureUrl?: string;
  updatedAt?: string;
  isPublic?: boolean;
  ownerId?: number;
}

// 响应式变量定义
const deviceTypes = ref<DeviceType[]>([]); // 设备类型列表
const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示数量
const total = ref(0); // 总记录数
const dialogVisible = ref(false); // 对话框可见性
const dialogTitle = ref(""); // 对话框标题

// 当前设备类型
const currentDeviceType = ref<DeviceType>({
  name: "",
  description: "",
  manualUrl: "",
  pictureUrl: "",
  isPublic: false,
});
const filters = reactive({
  name: "",
  deviceTypeId: null as number | null,
});
const deviceTypeShowInTable = ref<DeviceType[]>([]);

// 获取设备类型列表
const fetchDeviceTypes = async () => {
  try {
    const response = await getDeviceTypes();
    deviceTypes.value = response.data.data;
    total.value = response.data.pagination.total;
    handleFilter(); // Apply filter after fetching device types
  } catch (error) {
    console.error("Error fetching device types:", error);
    ElMessage.error("获取设备类型失败");
  }
};

// 处理过滤
const handleFilter = () => {
  let filteredDeviceTypes = deviceTypes.value;

  if (filters.name) {
    filteredDeviceTypes = filteredDeviceTypes.filter((deviceType) =>
      deviceType.name?.includes(filters.name)
    );
  }

  if (filters.deviceTypeId !== null) {
    filteredDeviceTypes = filteredDeviceTypes.filter(
      (deviceType) => deviceType.id === filters.deviceTypeId
    );
  }

  deviceTypeShowInTable.value = filteredDeviceTypes;
};

// 处理页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchDeviceTypes();
};

// 添加设备类型
const addDeviceTypeData = () => {
  currentDeviceType.value = {
    name: "",
    description: "",
    manualUrl: "",
    pictureUrl: "",
    isPublic: false,
  };
  dialogTitle.value = "添加设备类型";
  dialogVisible.value = true;
};

// 编辑设备类型
const editDeviceType = (deviceType: DeviceType) => {
  currentDeviceType.value = { ...deviceType };
  dialogTitle.value = "编辑设备类型";
  dialogVisible.value = true;
};

const addDeviceTypeFunction = () => {
  addDeviceTypeData();
};
// pictureUrl
const avatarPictureUrlInput = ref<any>(null);
const avatarPictureUrlImg = ref<any>(null);
const avatarPictureUrlFile = ref<any>(null);
// manualUrl
const manualUrlInput = ref<any>(null);
const manualUrlImg = ref<any>(null);
const manualUrlFile = ref<any>(null);

// 打开文件夹
const onManualUrlUpload = () => {
  if (manualUrlInput.value == null || manualUrlInput.value.files.length === 0) {
    return;
  }
  manualUrlFile.value = manualUrlInput.value.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(manualUrlFile.value);
  reader.onload = () => {
    manualUrlImg.value.src = reader.result;
  };
};
const onAvatarUpload = () => {
  if (
    avatarPictureUrlInput.value == null ||
    avatarPictureUrlInput.value.files.length === 0
  ) {
    return;
  }
  avatarPictureUrlFile.value = avatarPictureUrlInput.value.files[0];

  const reader = new FileReader();
  reader.readAsDataURL(avatarPictureUrlFile.value);
  console.log(avatarPictureUrlImg.value);
  reader.onload = () => {
    avatarPictureUrlImg.value.src = reader.result;
  };
};
// 保存设备类型（新增或更新）
const saveDeviceType = async () => {
  if (manualUrlFile.value) {
    await getUploadPolicy().then(async (res) => {
      let policy = res.data.data;
      const formData = new FormData();
      formData.append("key", policy.dir + manualUrlFile.value.name);
      formData.append("policy", policy.policy);
      formData.append("OSSAccessKeyId", policy.accessid);
      formData.append("success_action_status", "200");
      formData.append("signature", policy.signature);
      formData.append("file", manualUrlFile.value);
      await axios.post(policy.host, formData).then((res) => {
        if (res.status === 200) {
          currentDeviceType.value.manualUrl =
            policy.host + "/" + policy.dir + manualUrlFile.value.name;
          console.log(
            "currentDeviceType.value.manualUrl",
            currentDeviceType.value.manualUrl
          );
        }
      });
    });
    manualUrlFile.value = null;
  }
  if (avatarPictureUrlFile.value)
    await getUploadPolicy().then(async (res) => {
      let policy = res.data.data;
      const formData = new FormData();
      formData.append("key", policy.dir + avatarPictureUrlFile.value.name);
      formData.append("policy", policy.policy);
      formData.append("OSSAccessKeyId", policy.accessid);
      formData.append("success_action_status", "200");
      formData.append("signature", policy.signature);
      formData.append("file", avatarPictureUrlFile.value);
      await axios.post(policy.host, formData).then((res) => {
        if (res.status === 200) {
          currentDeviceType.value.pictureUrl =
            policy.host + "/" + policy.dir + avatarPictureUrlFile.value.name;
          console.log(
            "currentDeviceType.value.pictureUrl",
            currentDeviceType.value.pictureUrl
          );
        }
      });
    });
  avatarPictureUrlFile.value = null;
  try {
    if (currentDeviceType.value.id) {
      await updateDeviceType(
        currentDeviceType.value.id.toString(),
        currentDeviceType.value
      );
      ElMessage.success("设备类型更新成功");
    } else {
      await addDeviceType(currentDeviceType.value);
      ElMessage.success("设备类型添加成功");
    }
    dialogVisible.value = false;
    fetchDeviceTypes();
  } catch (error) {
    console.error("Error saving device type:", error);
    ElMessage.error("保存设备类型失败");
  }
};

// 删除设备类型
const deleteDeviceTypeHandler = async (deviceType: DeviceType) => {
  if (!deviceType.id) return;
  try {
    await deleteDeviceType([deviceType.id]);
    ElMessage.success("设备类型删除成功");
    fetchDeviceTypes();
  } catch (error) {
    console.error("Error deleting device type:", error);
    ElMessage.error("删除设备类型失败");
  }
};

// 组件挂载时获取设备类型列表
onMounted(() => {
  fetchDeviceTypes();
});

// 添加一个方法来格式化日期
const formatDate = (date: string) => {
  return moment(date).format("YYYY/MM/DD HH:mm");
};
</script>

<style scoped>
.device-type-management {
  padding: 20px;
}

.filter-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.add-device-type-button {
  background-color: #324157;
  color: #fff;
  border: 1px solid #324157;
}

.add-device-type-button:hover {
  background-color: #242f42;
}

.mt10 {
  margin-top: 10px;
}

.manual-img,
.avatar-img {
  width: 100%; /* 或其他适当的宽度 */
  height: auto; /* 保持图片原始宽高比 */
  display: block; /* 确保图片独占一行 */
}

.col_flex {
  display: flex;
  align-items: start;
  flex-direction: column;
}
</style>