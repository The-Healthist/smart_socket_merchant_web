<template>
  <div class="device-management">
    <h1>Device Management</h1>

    <!-- 过滤器部分 -->
    <div class="filter-section">
      <!-- 按名称搜索输入框 -->
      <el-input
        v-model="filters.name"
        placeholder="Search by name"
        @input="handleFilter"
      />
      <!-- 按设备类型过滤下拉框 -->
      <el-select
        v-model="filters.deviceTypeId"
        placeholder="Filter by device type"
        @change="handleFilter"
      >
        <!-- 下拉选项 -->
        <el-option
          label="All"
          :value="null"
        />
        <el-option
          v-for="type in deviceTypes"
          :key="type.id"
          :label="type.name"
          :value="type.id"
        />
      </el-select>
      <!-- 添加设备按钮 -->
      <el-button @click="addDeviceFunction">Add Device</el-button>
    </div>

    <!-- 设备列表表格 -->
    <el-table
      :data="deviceShowInTable"
      style="width: 100%"
      @row-click="handleRowClick"
    >
      <!-- 表格列定义 -->
      <el-table-column
        prop="name"
        label="Name"
      />
      <el-table-column
        prop="location"
        label="Location"
      />
      <el-table-column
        prop="remark"
        label="Remark"
      />
      <el-table-column
        prop="deviceTypeId"
        label="Device Type"
      />
      <el-table-column
        prop="createdAt"
        label="Created At"
      >
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column label="Actions">
        <template #default="{ row }">
          <el-button @click.stop="editDevice(row)">Edit</el-button>
          <el-button
            @click.stop="deleteDeviceHandler(row)"
            type="danger"
          >Delete</el-button>
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

    <!-- 添加/编辑设备对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
    >
      <!-- 设备表单 -->
      <el-form
        :model="currentDevice"
        label-width="120px"
      >
        <el-form-item label="Name">
          <el-input v-model="currentDevice.name" />
        </el-form-item>
        <el-form-item label="Location">
          <el-input v-model="currentDevice.location" />
        </el-form-item>
        <el-form-item label="Remark">
          <el-input
            v-model="currentDevice.remark"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="Device Type">
          <el-select
            v-model="currentDevice.deviceTypeId"
            placeholder="Select Device Type"
          >
            <el-option
              v-for="type in deviceTypes"
              :key="type.id"
              :label="type.name"
              :value="type.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <!-- 对话框底部按钮 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button
            type="primary"
            @click="saveDevice"
          >Save</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 设备详情对话框 -->
    <el-dialog
      title="Device Details"
      v-model="detailDialogVisible"
      width="90%"
    >
      <el-row gutter={20}>
        <!-- 基本信息 -->
        <el-col :span="8">
          <el-card
            :title="'Basic Information'"
            style="height: 400px;"
          >
            <div class="card-title">Basic Info</div> <!-- Added title -->
            <div style="display: flex;flex-direction: column; flex-wrap: wrap;">
              <div class="info-item"><strong>Name:</strong>
                {{ deviceDetail.name }}</div>
              <div class="info-item"><strong>Location:</strong>
                {{ deviceDetail.location }}</div>
              <div class="info-item"><strong>Remark:</strong>
                {{ deviceDetail.remark }}</div>
              <div class="info-item"><strong>Price Formula:</strong>
                {{ deviceDetail.priceFormula }}</div>
              <div class="info-item"><strong>Created At:</strong>
                {{ formatDate(deviceDetail.createdAt) }}</div>
              <div class="info-item"><strong>Updated At:</strong>
                {{ formatDate(deviceDetail.updatedAt) }}</div>
            </div>
          </el-card>
        </el-col>

        <!-- 设备类型信息 -->
        <el-col :span="8">
          <el-card
            :title="'Device Type Information'"
            style="height: 400px;"
          >
            <div class="card-title">Device Type Info</div> <!-- Added title -->
            <div
              style="display: flex; flex-direction: column; flex-wrap: wrap;">
              <div class="info-item"><strong>Type Name:</strong>
                {{ deviceDetail.deviceType.name }}</div>
              <div class="info-item"><strong>Description:</strong>
                {{ deviceDetail.deviceType.description }}</div>
              <div
                class="info-item"
                style="width: 200px;max-height: 100px; display: flex; flex-direction: row;"
              ><strong>Manual URL:</strong><img
                  :src="deviceDetail.deviceType.manualUrl"
                  style="max-width: 100px; max-height: 100px;"
                /></div>
              <div
                class="info-item"
                style="width: 100px;"
              ><strong>Picture URL:</strong>
                <div
                  class="info-item"
                  style="width: 200px;max-height: 100px; display: flex; flex-direction: row;"
                ><strong>Manual URL:</strong><img
                    :src="deviceDetail.deviceType.manualUrl"
                    style="max-width: 100px; max-height: 100px;"
                  /></div>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 所有者信息 -->
        <el-col :span="8">
          <el-card
            :title="'Owner Information'"
            style="height: 400px;"
          >
            <div class="card-title">Owner Info</div> <!-- Added title -->
            <div
              style="display: flex; flex-direction: column; flex-wrap: wrap;">
              <div class="info-item"><strong>Owner Name:</strong>
                {{ deviceDetail.owner.username }}</div>
              <div class="info-item"><strong>Email:</strong>
                {{ deviceDetail.owner.email }}</div>
              <div class="info-item"><strong>Mobile:</strong>
                {{ deviceDetail.owner.mobile }}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <template #footer>
        <el-button @click="detailDialogVisible = false">Close</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import {
  getDevices,
  addDevice,
  updateDevice,
  deleteDevice,
  getDevice, // Import the getDevice method
} from "@/api/device";
import { getDeviceTypes } from "@/api/deviceType";
import { ElMessage } from "element-plus";
import moment from "moment";

// 设备接口定义
interface Device {
  name?: string;
  location?: string;
  remark?: string;
  priceFormula?: string;
  deviceTypeId?: number;

  uuid?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;

  deviceType?: DeviceType;
  ownerId?: number;
  owner?: string;
}

// 设备类型接口定义
interface DeviceType {
  id?: number;
  name?: string;
  // 其他属性
}

// 响应式变量定义
const devices = ref<Device[]>([]); // 设备列表
const deviceTypes = ref<DeviceType[]>([]); // 设备类型列表
const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示数量
const total = ref(0); // 总记录数
const dialogVisible = ref(false); // 对话框可见性
const dialogTitle = ref(""); // 对话框标题
const currentDevice = ref<Device>({
  name: "",
  location: "",
  remark: "",
  priceFormula: "",
  deviceTypeId: 0,
});
const filters = reactive({
  name: "",
  deviceTypeId: null as number | null,
});
const deviceShowInTable = ref<Device[]>([]);

// 获取设备列表
const fetchDevices = async () => {
  try {
    const response = await getDevices();
    devices.value = response.data.data;
    total.value = response.data.pagination.total;
    handleFilter(); // Apply filter after fetching devices
  } catch (error) {
    console.error("Error fetching devices:", error);
    ElMessage.error("Failed to fetch devices");
  }
};

// 获取设备类型列表
const fetchDeviceTypes = async () => {
  try {
    const response = await getDeviceTypes();
    deviceTypes.value = response.data.data;
  } catch (error) {
    console.error("Error fetching device types:", error);
    ElMessage.error("Failed to fetch device types");
  }
};

// 处理过滤
const handleFilter = () => {
  let filteredDevices = devices.value;

  if (filters.name) {
    filteredDevices = filteredDevices.filter((device) =>
      device.name?.includes(filters.name)
    );
  }

  if (filters.deviceTypeId !== null) {
    filteredDevices = filteredDevices.filter(
      (device) => device.deviceTypeId === filters.deviceTypeId
    );
  }

  deviceShowInTable.value = filteredDevices;
};

// 处理页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchDevices();
};

// 添加设备
const addDeviceFunction = () => {
  currentDevice.value = {
    name: "",
    location: "",
    remark: "",
    priceFormula: "",
    deviceTypeId: 0,
  };
  dialogTitle.value = "Add Device";
  dialogVisible.value = true;
};

// 编辑设备
const editDevice = (device: Device) => {
  currentDevice.value = { ...device };
  dialogTitle.value = "Edit Device";
  dialogVisible.value = true;
};

// 保存设备（新增或更新）
const saveDevice = async () => {
  try {
    if (currentDevice.value.uuid) {
      await updateDevice(currentDevice.value.uuid, currentDevice.value);
      ElMessage.success("Device updated successfully");
    } else {
      await addDevice(currentDevice.value);
      ElMessage.success("Device added successfully");
    }
    dialogVisible.value = false;
    fetchDevices();
  } catch (error) {
    console.error("Error saving device:", error);
    ElMessage.error("Failed to save device");
  }
};

// 删除设备
const deleteDeviceHandler = async (device: Device) => {
  if (!device.uuid) return;
  try {
    await deleteDevice([device.uuid]);
    ElMessage.success("Device deleted successfully");
    fetchDevices();
  } catch (error) {
    console.error("Error deleting device:", error);
    ElMessage.error("Failed to delete device");
  }
};

// 添加一个方法来格式化日期
const formatDate = (date: string) => {
  return moment(date).format("YYYY/MM/DD HH:mm");
};

// 组件挂载时获取设备列表和类型
onMounted(() => {
  fetchDevices();
  fetchDeviceTypes(); // Also fetch device types on mounted
});

// 新增对话框变量
const deviceDetail = ref<any>(null); // Store device details
const detailDialogVisible = ref(false); // Control visibility of the detail dialog

// 修改行点击事件处理器
const handleRowClick = async (row: Device, event: MouseEvent) => {
  if (event.target instanceof HTMLButtonElement) {
    // 如果点击的是按钮，则不处理
    return;
  }
  try {
    if (!row.uuid) return;
    const response = await getDevice(row.uuid);
    deviceDetail.value = response.data.data;
    console.log(deviceDetail.value);
    detailDialogVisible.value = true;
  } catch (error) {
    console.error("Error fetching device details:", error);
    ElMessage.error("Failed to fetch device details");
  }
};
</script>

<style scoped>
.device-management {
  padding: 20px;
}

.filter-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.info-item {
  margin-right: 20px; /* Space between items */
  margin-bottom: 10px; /* Space between lines */
}

/* New styles for card titles */
.card-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px; /* Space below the title */
}
</style>