<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <el-date-picker v-model="startEndDateTime" type="datetimerange" range-separator="-" start-placeholder="开始时间"
          end-placeholder="结束时间" @change="handleDateTimeChange" style="width: 360px; margin-right: 10px;" />
          <el-button type="default" @click="clearFilter">清除筛选</el-button>
        <el-button type="danger" :icon="Delete" @click="handleMultiDelete">删除选中</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40" />
        <el-table-column prop="id" label="ID"  width="60"></el-table-column>
        <el-table-column prop="manuscript.title" label="作品名称" width="120"></el-table-column>
        <el-table-column prop="owner.email" label="用户E-mail" width="200"></el-table-column>
        <el-table-column prop="ipAddress" label="IP地址" width="140"></el-table-column>
        <el-table-column label="提交时间" width="170">
					<template #default="scope">
						{{ scope.row.createdAt ? scope.row.createdAt.slice(0, 19).replace("T", " ") : '' }}
					</template>
				</el-table-column>
        <el-table-column label="操作" align="center" width="360">
          <template #default="scope">
            <el-button text :icon="Edit" @click="handleDetail(scope.$index)" v-permiss="15">
              查看详情
            </el-button>
            <el-button text :icon="Edit" @click="handleDelete(scope.$index)" v-permiss="15">
              删除记录
            </el-button>
            <el-button text :icon="Delete" class="red" @click="handleBlock(scope.$index)" v-permiss="16">
              封禁 IP
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
        <el-descriptions-item label="作品名称" label-align="right" align="left" label-class-name="my-label"
          class-name="my-content">
          {{ detailData.manuscript.title }}
        </el-descriptions-item>
        <el-descriptions-item label="投票时间" label-align="right" align="left">
          {{ detailData.createdAt ? detailData.createdAt.slice(0, 19).replace("T", " ") : '' }}
        </el-descriptions-item>
        <el-descriptions-item label="用户E-mail" label-align="right" align="left">
          {{ detailData.owner.email }}
        </el-descriptions-item>
        <el-descriptions-item label="IP地址" label-align="right" align="left">
          {{ detailData.ipAddress }}
        </el-descriptions-item>
        <!-- <el-descriptions-item label="IP归属地" label-align="right" align="left">
          {{  }}
        </el-descriptions-item> -->
        <!-- <el-descriptions-item label="浏览器" label-align="right" align="left">
          Safari
        </el-descriptions-item> -->
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleDelete">删除记录</el-button>
          <el-button @click="handleBlock">封禁IP</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox, ElTag } from 'element-plus';
import { Delete, Edit, Filter, Search, Plus } from '@element-plus/icons-vue';
import { blockVote, fetchVotes } from '../../api';
import { deleteVotes } from '../../api';
import moment from 'moment'


const initPaginationQuery = reactive({
  pageNum: 1,
  pageSize: 10,
  desc: true,
  total: 0,
})

const initFilterQuery = reactive({
  startTime: '',
  endTime: '',
})

const paginationQuery = reactive({
  pageNum: 1,
  pageSize: 10,
  desc: true,
  total: 0,
})

const filterQuery = reactive({
  startTime: '',
  endTime: '',
})

// Table 数据展示
const tableData = ref<any>([])
const getData = () => {
  let query = Object.assign({}, paginationQuery, filterQuery)

  fetchVotes(query).then(res => {
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

// 修改时间
const startEndDateTime = ref()
const handleDateTimeChange = (value:any) => {
  if (!value) {
    filterQuery.startTime = ''
    filterQuery.endTime = ''
    return
  }
  filterQuery.startTime = moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
  filterQuery.endTime = moment(value[1]).format('YYYY-MM-DD HH:mm:ss')
  getData();
}

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
  startEndDateTime.value = []
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

// 删除操作
const multipleSelection = ref<any>([])
const handleSelectionChange = (rows: any[]) => {
  multipleSelection.value = rows
}

const handleMultiDelete = () => {
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  }).then(() => {
    deleteVotes({ ids: multipleSelection.value.map((item: any) => item.id) })
      .then((res: any) => {
        ElMessage.success('删除成功')
        getData()
      }).catch(err => {
        ElMessage.error('删除失败')
      })
  })
}

const handleDelete = (index: number) => {
  // 二次确认删除
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  }).then(() => {
    deleteVotes({ ids: [tableData.value[index].id] })
      .then((res: any) => {
        ElMessage.success('删除成功')
        getData()
      })
      .catch(err => {
        ElMessage.error('删除失败')
      })
  })
};

// 封禁账号
const handleBlock = (index: number) => {
  ElMessageBox.prompt('请输入封禁理由', '提示', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
  }).then(({ value }) => {
    blockVote(tableData.value[index].id).then(res => {
      ElMessage({
        type: 'success',
        message: '封禁成功'
      });
      getData();
    }).catch(err => {
      ElMessage({
        type: 'error',
        message: '封禁失败'
      });
    })
    detailVisible.value = false;
  })
}
</script>

<style scoped>
@import '../index.css'
</style>
