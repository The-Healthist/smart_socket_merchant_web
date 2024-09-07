<template>
  <div>
    <div class="container">
      <div class="handle-box">
        <!-- <el-button type="success" :icon="Delete" @click="handleMultiDelete">解封选中</el-button> -->
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
        @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="40" /> -->
        <el-table-column prop="id" label="ID"  width="60"></el-table-column>
        <el-table-column prop="ip" label="IP地址"></el-table-column>
        <el-table-column label="提交时间">
					<template #default="scope">
						{{ scope.row.createdAt ? scope.row.createdAt.slice(0, 19).replace("T", " ") : '' }}
					</template>
				</el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template #default="scope">
            <el-button text :icon="Delete" class="red" @click="handleUnblock(scope.$index)" v-permiss="16">
              解封 IP
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
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox, ElTag } from 'element-plus';
import { Delete, Edit, Filter, Search, Plus } from '@element-plus/icons-vue';
import { fetchBlockVotes, fetchVotes, unblockVote } from '../../api';
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

  fetchBlockVotes(query).then(res => {
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



// 查看详情
let idx: number = -1;
const detailVisible = ref(false);
const detailData = ref<any>({});

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
const handleUnblock = (index: number) => {
  unblockVote({
    ids: [tableData.value[index].id]
  }).then(res => {
    ElMessage({
      type: 'success',
      message: '解封成功'
    });
    getData();
  }).catch(err => {
    ElMessage({
      type: 'error',
      message: '解封失败'
    });
  })
}
</script>

<style scoped>
@import '../index.css'
</style>
