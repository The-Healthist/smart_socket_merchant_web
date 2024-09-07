<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-select v-model="filterQuery.status" placeholder="状态" class="handle-select mr10" @change="getData">
					<el-option v-for="(item, index) in manuscriptStatusList" :key="index" :value="index"
						:label="item.label">
					</el-option>
				</el-select>
				<el-input v-model="filterQuery.title" placeholder="作品名" class="handle-input mr10"></el-input>
				<el-button type="primary" :icon="Filter" @click="handleSearch">搜索</el-button>
				<el-button type="danger" :icon="Delete" @click="handleMultiDelete">删除选中</el-button>
				<el-button type="default" @click="clearFilter">清除筛选</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
				@selection-change="handleSelectionChange">
				<el-table-column type="selection" width="40" />
				<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
				<el-table-column prop="owner.nickname" label="用户名"></el-table-column>
				<el-table-column prop="title" label="作品名"></el-table-column>
				<el-table-column prop="style" label="风格">
					<template #default="scope">
						<el-tag>
							{{ getStyleLabel(scope.row.style) }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="event.name" label="赛事"></el-table-column>
				<el-table-column label="状态" width="100" align="center">
					<template #default="scope">
						<el-tag :type="manuscriptStatusList[getAuditStatusTagIndex(scope.row.audit)].color">
							{{ manuscriptStatusList[getAuditStatusTagIndex(scope.row.audit)].label }}
						</el-tag>
					</template>
				</el-table-column>

				<el-table-column label="提交时间" width="170">
					<template #default="scope">
						{{ scope.row.createdAt ? scope.row.createdAt.slice(0, 19).replace("T", " ") : '' }}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="220" align="center">
					<template #default="scope">
						<el-button text :icon="Edit" @click="handleDetail(scope.$index)" v-permiss="15">
							审核
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

		<!-- 审核弹出框 -->
		<el-dialog title="作品详情" v-model="detailVisible" width="60%">
			<el-descriptions :column="1" border>
				<el-descriptions-item label="作品名" label-align="right" align="left" label-class-name="my-label"
					class-name="my-content">
					{{ detailData.title }}
				</el-descriptions-item>
				<el-descriptions-item label="选手昵称" label-align="right" align="left">
					{{ detailData.owner.nickname }}
				</el-descriptions-item>
				<el-descriptions-item label="风格/类型" label-align="right" align="left">
					<el-tag size="small">{{ getStyleLabel(tableData[idx].style) }}</el-tag>
				</el-descriptions-item>
				<el-descriptions-item label="歌曲文件" label-align="right" align="left">
					<a :href="detailData.musicFile">点击下载</a>
				</el-descriptions-item>
				<el-descriptions-item label="视频链接" label-align="right" align="left">
					<a :href="detailData.videoLink">点击跳转</a>
				</el-descriptions-item>
				<el-descriptions-item label="作品简介" min-width="90" label-align="right" align="left">
					{{ detailData.description }}
				</el-descriptions-item>
			</el-descriptions>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="detailVisible = false">取 消</el-button>
					<el-button type="danger" plain @click="reject(idx)">驳 回</el-button>
					<el-button type="success" plain @click="pass(idx)">通 过</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox, ElTag } from 'element-plus';
import { Delete, Edit, Search, Plus, Filter } from '@element-plus/icons-vue';
import { getAuditStatusTagIndex, getStyleLabel, manuscriptStatusList, manuscriptStyleList } from '../../refs';
import { auditPassManuscript, auditRejectManuscript, fetchManuscripts } from '../../api';
import { deleteManuscript } from '../../api';


const initPaginationQuery = reactive({
	pageNum: 1,
	pageSize: 10,
	desc: true,
	total: 0,
})

const initFilterQuery = reactive({
	title: '',
	style: null,
	status: null,
})

const paginationQuery = reactive({
	pageNum: 1,
	pageSize: 10,
	desc: true,
	total: 0,
})

const filterQuery = reactive({
	title: '',
	style: null,
	status: null,
})

// Table 数据展示
const tableData = ref<any>([])
const getData = () => {
	let query = Object.assign({}, paginationQuery, filterQuery)

	fetchManuscripts(query).then(res => {
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
		deleteManuscript({ ids: multipleSelection.value.map((item: any) => item.id) })
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
		deleteManuscript({ ids: [tableData.value[index].id] })
			.then((res: any) => {
				ElMessage.success('删除成功')
				getData()
			})
			.catch(err => {
				ElMessage.error('删除失败')
			})
	})
};

const pass = (index: number) => {
	auditPassManuscript(tableData.value[index].id)
		.then((res: any) => {
			ElMessage.success('审核通过')
			detailVisible.value = false
			getData()
		})
		.catch(err => {
			ElMessage.error('审核失败')
		})
}

const reject = (index: number) => {
	ElMessageBox.prompt('请输入驳回理由', '提示', {
		confirmButtonText: 'OK',
		cancelButtonText: 'Cancel',
	}).then(({ value }) => {
		auditRejectManuscript(tableData.value[index].id, { remark: value })
			.then((res: any) => {
				ElMessage.success('驳回成功')
				detailVisible.value = false
				getData()
			})
			.catch(err => {
				ElMessage.error('驳回失败')
			})
	})
}
</script>

<style scoped>
@import '../index.css'
</style>
