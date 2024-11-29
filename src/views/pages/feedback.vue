<template>
  <div>
    <TableSearch :query="query" :options="searchOpt" :search="handleSearch" />
    <div class="container">
      <TableCustom v-if="!loading" :columns="columns" :tableData="tableData" :total="page.total" :viewFunc="handleView"
                   :delFunc="handleDelete" :editFunc="handleEdit" :refresh="getData" :currentPage="page.index"
                   :changePage="changePage" :page-size="page.size">
        <template #toolbarBtn>
          <el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
        </template>

        <template #effectiveness_score="{ rows }">
           <el-tag :type="rows.effectiveness_score > '7' ? 'success' : 'danger'">
             {{rows.effectiveness_score}}
           </el-tag>
        </template>

        <template #safety_score="{ rows }">
          <el-tag :type="rows.safety_score > '7' ? 'success' : 'danger'">
            {{rows.safety_score}}
          </el-tag>
        </template>

      </TableCustom>
    </div>
    <el-dialog :title="isEdit ? '编辑' : '新增'" v-model="visible" width="700px" destroy-on-close
               :close-on-click-modal="false" @close="closeDialog">
      <TableEdit :form-data="rowData" :options="options" :edit="isEdit" :update="updateData">
        <template #thumb="{ rows }">
          <img class="table-td-thumb" :src="rows.thumb"></img>
        </template>
      </TableEdit>
    </el-dialog>
    <el-dialog title="查看详情" v-model="visible1" width="700px" destroy-on-close>
      <TableDetail :data="viewData">
      </TableDetail>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="basetable">
import {ref, reactive, onMounted} from 'vue';
import { ElMessage, } from 'element-plus';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import { fetchAllData } from '@/api/index';
import TableCustom from '@/components/table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
import TableSearch from '@/components/table-search.vue';
import {Evaluation, EvaluationToShow} from "@/types/type";
import { TableItem } from '@/types/table';
import { FormOption, FormOptionList } from '@/types/form-option';
import {log} from "echarts/types/src/util/log";

// 查询相关
const query = reactive({
  name: '',
});
const searchOpt = ref<FormOptionList[]>([
  { type: 'input', label: '用户名：', prop: 'name' }
])
const handleSearch = () => {
  changePage(1);
};

// 表格相关
let columns = ref([
  { type: 'selection' },
  { type: 'index', label: '序号', width: 55, align: 'center' },
  { prop: 'doctor_name', label: '提交医生姓名' },
  { prop: 'record_id', label: '就诊记录编号', width: 130},
  { prop: 'recommendation_id', label: '推荐记录编号', width: 130},
  { prop: 'effectiveness_score', label: '有效性评分', width: 100},
  { prop: 'safety_score', label: '安全性评分', width: 100},
  { prop: 'created_at', label: '提交时间', width: 250},
  { prop: 'operator', label: '操作', width: 300 },
])

const page = reactive({
  index: 1,
  size: 5,
  total: 0,
})

const rawData = ref<Evaluation[]>([]); // 全部数据
const tableData = ref<Evaluation[]>([]); // 当前页显示的数据

const loading = ref(true);
const getData = async () => {
  const res = await fetchAllData();
  rawData.value = res.data.evaluationsToShow;
  page.total = rawData.value.length;
  updateTableData();
  loading.value = false; // 数据加载完成
};

onMounted(() => {
  getData();
})

const updateTableData = () => {
  const start = (page.index - 1) * page.size;
  const end = page.index * page.size;
  tableData.value = rawData.value.slice(start, end);
}

const changePage = (val: number) => {
  page.index = val;
  updateTableData();
};

// 新增/编辑弹窗相关
let options = ref<FormOption>({
  labelWidth: '100px',
  span: 24,
  list: [
    { type: 'input', label: '用户名', prop: 'name', required: true },
    { type: 'number', label: '账户余额', prop: 'money', required: true },
    { type: 'switch', activeText: '正常', inactiveText: '异常', label: '账户状态', prop: 'state', required: true },
    { type: 'upload', label: '头像', prop: 'thumb', required: true },
  ]
})

const visible = ref(false);
const isEdit = ref(false);
const rowData = ref({});
const handleEdit = (row: TableItem) => {
  rowData.value = { ...row };
  isEdit.value = true;
  visible.value = true;
};
const updateData = () => {
  closeDialog();
  getData();
};

const closeDialog = () => {
  visible.value = false;
  isEdit.value = false;
};

// 查看详情弹窗相关
const visible1 = ref(false);
const viewData = ref({
  row: {},
  list: []
});
const handleView = (row: EvaluationToShow) => {
  console.log(row);
  viewData.value.row = { ...row }
  viewData.value.list = [
    {
      prop: 'doctor_id',
      label: '医生ID',
    },
    {
      prop: 'doctor_name',
      label: '医生姓名',
    },
    {
      prop: 'record_id',
      label: '就诊记录编号',
    },
    {
      prop: 'recommendation_id',
      label: '推荐记录编号',
    },
    {
      prop: 'effectiveness_score',
      label: '有效性评分',
    },
    {
      prop: 'safety_score',
      label: '安全性评分',
    },
    {
      prop: 'comments',
      label: '评价',
    }
  ]
  visible1.value = true;
};

// 删除相关
const handleDelete = (row: TableItem) => {
  ElMessage.success('删除成功');
}
</script>

<style scoped>
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}
</style>
