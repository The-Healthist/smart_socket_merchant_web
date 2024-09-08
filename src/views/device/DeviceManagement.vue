<template>
  <div class="device-management">
    <h1>Device Management</h1>

    <!-- Filter section -->
    <div class="filter-section">
      <el-input
        v-model="filters.name"
        placeholder="Search by name"
        @input="handleFilter"
      />
      <el-select
        v-model="filters.deviceTypeId"
        placeholder="Filter by device type"
        @change="handleFilter"
      >
        <el-option
          label="All"
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
      </el-select>
    </div>

    <!-- Device table -->
    <el-table
      :data="devices"
      style="width: 100%"
    >
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
      />
      <el-table-column label="Actions">
        <template #default="{ row }">
          <el-button @click="editDevice(row)">Edit</el-button>
          <el-button
            @click="deleteDeviceHandler(row)"
            type="danger"
          >Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      @current-change="handlePageChange"
      layout="prev, pager, next"
    />

    <!-- Add/Edit Device Dialog -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
    >
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
          <el-select v-model="currentDevice.deviceTypeId">
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
          </el-select>
        </el-form-item>
      </el-form>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import {
  getDevices,
  addDevice,
  updateDevice,
  deleteDevice,
} from "@/api/device";
import { ElMessage } from "element-plus";

interface Device {
  uuid?: string;
  name: string;
  location: string;
  remark: string;
  deviceTypeId: number;
  createdAt?: string;
}

const devices = ref<Device[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const currentDevice = ref<Device>({
  name: "",
  location: "",
  remark: "",
  deviceTypeId: 1,
});
const filters = reactive({
  name: "",
  deviceTypeId: null as number | null,
});

const fetchDevices = async () => {
  try {
    const response = await getDevices();
    devices.value = response.data.data;
    total.value = response.data.pagination.total;
  } catch (error) {
    console.error("Error fetching devices:", error);
    ElMessage.error("Failed to fetch devices");
  }
};

const handleFilter = () => {
  // Implement filtering logic here
  fetchDevices();
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchDevices();
};

const editDevice = (device: Device) => {
  currentDevice.value = { ...device };
  dialogTitle.value = "Edit Device";
  dialogVisible.value = true;
};

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

const deleteDeviceHandler = async (device: Device) => {
  if (!device.uuid) return;
  try {
    await deleteDevice(device.uuid);
    ElMessage.success("Device deleted successfully");
    fetchDevices();
  } catch (error) {
    console.error("Error deleting device:", error);
    ElMessage.error("Failed to delete device");
  }
};

onMounted(() => {
  fetchDevices();
});
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
</style>