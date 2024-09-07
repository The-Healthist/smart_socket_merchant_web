<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-select v-model="filterQuery.status" placeholder="状态" @change="getData" class="handle-select mr10">
					<el-option v-for="(item, index) in questionStatusList" :key="index" :value="index"
						:label="item.label">
					</el-option>
				</el-select>
				<el-input v-model="filterQuery.question" placeholder="问题" class="handle-input mr10"></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="default" :icon="Plus" @click="createVisible = true">创建</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
				<el-table-column prop="question" label="问题"></el-table-column>
				<el-table-column prop="answer" label="答案"></el-table-column>
				<el-table-column label="提交时间" width="170">
					<template #default="scope">
						{{ scope.row.createdAt ? scope.row.createdAt.slice(0, 19).replace("T", " ") : '' }}
					</template>
				</el-table-column>
				<el-table-column label="状态" width="100" align="center">
					<template #default="scope">
						<el-tag :type="questionStatusList[scope.row.status].color">
							{{ questionStatusList[scope.row.status].label }}
							<!-- 待回答/已回答未发布/已发布/已关闭 -->
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="300">
					<template #default="scope">
						<el-button text :icon="Edit" @click="handleDetail(scope.$index)" v-permiss="15">
							编辑
						</el-button>
						<el-button v-if="scope.row.status === 1" text :icon="Edit" @click="handleRecall(scope.$index)"
							v-permiss="15">
							撤回
						</el-button>
						<el-button v-else text :icon="Edit" @click="handlePublish(scope.$index)" v-permiss="15">
							发布
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
		<el-dialog title="创建" v-model="createVisible" width="30%">
			<el-form label-width="70px" :rules="rules" ref="mform" :model="createForm">
				<el-form-item label="问题" prop="question">
					<el-input v-model="createForm.question"></el-input>
				</el-form-item>
				<el-form-item label="答案" prop="answer">
					<el-input v-model="createForm.answer" type="textarea"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="createVisible = false">取 消</el-button>
					<el-button type="primary" @click="handleCreate">保 存</el-button>
				</span>
			</template>
		</el-dialog>

		<!-- 编辑弹出框 -->
		<el-dialog title="审核" v-model="detailVisible" width="30%">
			<el-form label-width="70px">
				<el-form-item label="问题">
					<el-input v-model="form.question"></el-input>
				</el-form-item>
				<el-form-item label="答案">
					<el-input v-model="form.answer" type="textarea"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="detailVisible = false">取 消</el-button>
					<el-button type="primary" @click="handleSave(idx)">保 存</el-button>
					<el-button @click="handlePublish(idx)">发 布</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElInput, ElMessage, ElMessageBox, ElTag, FormInstance } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { questionStatusList } from '../../refs';
import { createQuestion, deleteQuestions, fetchQuestions } from '../../api';
import { updateQuestion, publishQuestion, recallQuestion } from '../../api';

const initPaginationQuery = reactive({
	pageNum: 1,
	pageSize: 10,
	desc: true,
	total: 0,
})

const initFilterQuery = reactive({
	question: '',
	status: null,
})

const paginationQuery = reactive({
	pageNum: 1,
	pageSize: 10,
	desc: true,
	total: 0,
})

const filterQuery = reactive({
	question: '',
	status: null,
})

// Table 数据展示
const tableData = ref<any>([])
const getData = () => {
	let query = Object.assign({}, paginationQuery, filterQuery)

	fetchQuestions(query).then(res => {
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

// 清除筛选
const clearFilter = () => {
	Object.assign(paginationQuery, initPaginationQuery);
	Object.assign(filterQuery, initFilterQuery);
	getData()
}

// 删除操作
const handleDelete = (index: number) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	}).then(() => {
		deleteQuestions({ ids: [tableData.value[index].id] })
			.then((res: any) => {
				ElMessage.success('删除成功')
				getData()
			})
			.catch(err => {
				ElMessage.error('删除失败')
			})
	})
};



// 表格编辑时弹窗和保存
let form = reactive({
	question: '',
	answer: ''
});

// 查看详情
let idx: number = -1;
const detailVisible = ref(false);

const handleDetail = (index: number) => {
	idx = index;
	form.question = tableData.value[index].question;
	form.answer = tableData.value[index].answer;
	detailVisible.value = true;
};

const createForm = reactive({
	question: '',
	answer: ''
});

const rules = reactive({
	question: [{ required: true, message: '请输入问题', trigger: 'blur' },],
});
const mform = ref<FormInstance>();

// 创建弹出框
const createVisible = ref(false);
const handleCreate = () => {
	if (!mform.value) return;
	mform.value.validate((valid: boolean) => {
		if (valid) {
			createQuestion({
				question: createForm.question,
				answer: createForm.answer
			})
				.then((res: any) => {
					ElMessage.success('创建成功');
					getData();
					createVisible.value = false;
				})
				.catch(err => {
					ElMessage.error('创建失败');
				})
		}
	})
}

// 保存
const handleSave = (index: number) => {
	updateQuestion({
		id: tableData.value[index].id,
		question: form.question,
		answer: form.answer
	})
		.then((res: any) => {
			ElMessage.success('保存成功');
			getData();
		})
		.catch(err => {
			ElMessage.error('保存失败');
		})
}

// 发布
const handlePublish = (index: number) => {
	updateQuestion({
		id: tableData.value[index].id,
		question: form.question,
		answer: form.answer
	})
		.then((res: any) => {
			ElMessage.success('保存成功');
			publishQuestion(tableData.value[index].id)
				.then((res: any) => {
					ElMessage.success('发布成功');
					detailVisible.value = false;
					getData();
				})
				.catch(err => {
					ElMessage.error('发布失败');
				})
		})
		.catch(err => {
			ElMessage.error('保存失败');
		})

}

// 撤回
const handleRecall = (index: number) => {
	recallQuestion(tableData.value[index].id)
		.then((res: any) => {
			ElMessage.success('撤回成功');
			detailVisible.value = false;
			getData();
		})
		.catch(err => {
			ElMessage.error('撤回成功');
		})
}
</script>

<style scoped>
@import '../index.css'
</style>
