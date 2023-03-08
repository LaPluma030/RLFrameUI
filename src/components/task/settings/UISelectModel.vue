<script lang="ts" setup>
import { ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { QTableProps, useQuasar } from "quasar";

import { useStorage, Model } from "~/storage";
import { getModelList } from "api";
import { getCreateUpdateTimeString, goToPage } from "utils";

const router = useRouter();

const $q = useQuasar();
const storage = useStorage();
const route = useRoute();
const modelIndex = parseInt(route.params.modelIndex as string);
// 确保storage.model及其下的d在打开此页面后不会被替换， 因此可以直接引用
const m = storage.currentTask.model[modelIndex];
console.log(m, "m");
const d = m?.metadata;
// 获取输入输出符合的模型列表
let models = ref([] as Model);
(async () => {
  try {
    const response = await getModelList(storage.systemSettings.resServAddr, {
      statusDimension: m.statusDimension,
      actionDimension: m.actionDimension,
    });
    console.log(response);
    models.value = response.data.list;
    models.value.forEach((model) => {
      const [createTime, updateTime] = getCreateUpdateTimeString(model.createTime, model.updateTime);
      model.createTime = createTime;
      model.updateTime = updateTime;
    });
  } catch (error) {
    if (error instanceof Error) {
      $q.notify({
        type: "error",
        message: "获取模型列表时出错：" + error.message,
      });
    }
  }
})();

//用于搜索
const filter = ref("");

// 用于分页
const paginationRaw = reactive({
  sortBy: "updateTime", // 排序的列
  descending: true, // 是否降序
  page: 1, //当前所在页码，默认为第一页
  rowsPerPage: 16, //每页展示多少条数据，具有默认值
});

// 定义列的显示方式
const columns = [
  {
    name: "rowIndex",
    label: "序号",
    field: "",
    align: "center",
    sortable: true,
  },
  {
    name: "name",
    label: "模型名称",
    field: "name",
    align: "center",
    sortable: true,
  },
  {
    name: "version",
    label: "模型版本",
    field: "version",
    align: "center",
    sortable: true,
  },
  {
    name: "description",
    label: "模型描述",
    field: "description",
    align: "center",
  },
  {
    name: "NNtype",
    label: "强化算法",
    align: "center",
    field: (r: Model[number]) => r.metadata?.NNtype,
    sortable: true,
  },
  {
    name: "statusDimension",
    label: "输入维度",
    field: "statusDimension",
    align: "center",
    sortable: true,
  },
  {
    name: "actionDimension",
    label: "输出维度",
    field: "actionDimension",
    align: "center",
    sortable: true,
  },
  {
    name: "createTime",
    label: "创建时间",
    field: "createTime",
    align: "center",
    sortable: true,
  },
  {
    name: "actions",
    label: "操作",
    field: "",
    align: "center",
  },
] as QTableProps["columns"];

// 取消已有模型选择页面
function cancel() {
  router.back();
}

// 选择某个模型
function useSelectedModel(rowIndex: number) {
  $q.notify({
    type: "ask",
    message: "您确定要使用该模型吗？",
    actions: [
      {
        label: "确定",
        color: "accent",
        handler: () => {
          const model = models.value[rowIndex];
          const metadata = model.metadata;
          m.name = model.name;
          m.version = model.version;
          m.description = model.description;
          m.inferenceArch = model.inferenceArch;
          m.inferenceVar = model.inferenceVar;
          m.fullContent = model.fullContent;
          d.NNtype = metadata.NNtype;
          d.reward = metadata.reward;
          d.structure = metadata.structure;
          router.back();
        },
      },
      {
        label: "取消",
        color: "white",
      },
    ],
  });
}
</script>
<template>
  <q-dialog model-value maximized @hide="cancel">
    <q-card class="transparent ui-model-card">
      <q-card-section class="bg-secondary text-accent ui-model-title">已有模型</q-card-section>
      <q-card-section class="bg-secondary ui-model-main">
        <q-table
          class="transparent shadow-0 full-height"
          table-class="ui-model-table"
          table-header-class="bg-info ui-model-table-header"
          separator="cell"
          :rows="models"
          :columns="columns"
          row-key="id"
          :filter="filter"
          :pagination="paginationRaw"
        >
          <!-- 表格头部区域 -->
          <template #top>
            <q-input v-model="filter" borderless dense debounce="300" placeholder="搜索" class="ui-model-search">
              <template #prepend>
                <q-icon name="search" size="sm" class="ui-model-search-icon" />
              </template>
            </q-input>
          </template>
          <!-- 表格中间区域 -->
          <template #body-cell="props">
            <q-td :props="props" class="ui-model-table-ellipsis">
              {{ props.value }}
              <q-tooltip anchor="top right" self="top middle">{{ props.value }}</q-tooltip>
            </q-td>
          </template>
          <template #body-cell-rowIndex="props">
            <q-td :props="props"> {{ props.rowIndex + 1 }} </q-td>
          </template>
          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-icon
                name="layers"
                size="xs"
                class="material-icons-outlined cursor-pointer ui-task-action-icon"
                @click="useSelectedModel(props.rowIndex)"
              >
                <q-tooltip anchor="top right" self="top middle">使用该模型</q-tooltip>
              </q-icon>
            </q-td>
          </template>
          <!-- 表格底部区域 -->
          <template #bottom="{ pagination, pagesNumber }">
            <div class="flex full-width items-center justify-end ui-model-page">
              <q-pagination
                v-model="pagination.page"
                :max="pagesNumber"
                :max-pages="5"
                :direction-links="true"
                ellipses
                round
                size="16px"
                active-color="info"
                color="grey-1"
              />
              <span class="ui-model-page-total">共 {{ pagesNumber }} 页</span>
              <span>前往第 </span>
              <q-input
                borderless
                dense
                input-class="text-center"
                class="ui-model-page-input"
                :model-value="pagination.page"
                @update:model-value="goToPage(pagination, pagesNumber, $event)"
              />
              <span> 页</span>
            </div>
          </template>
          <!-- 没有数据时 -->
          <template #no-data="{ message, icon }">
            <div class="flex flex-center full-width ui-model-nodata">
              <q-icon :name="icon" size="md" />
              <span class="q-ml-md">{{ message }}</span>
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.ui-model-card {
  height: calc(100% - 84px);
  margin: 52px 0 32px 279px;
}
.ui-model-title {
  height: 50px;
  padding-left: 33px;
  margin-bottom: 2px;
}
.ui-model-main {
  height: calc(100% - 52px);
  padding: 0 85px 0 78px;
}
:deep(.q-table__top),
:deep(.q-table__bottom) {
  border: 0;
}
.ui-model-search {
  width: 522px;
  height: 36px;
  margin: 13px 0 4px -16px;
  border: 1px solid white;
  border-radius: 17.5px;
}
.ui-model-search-icon {
  margin-left: 16px;
}
:deep(.q-field__control) {
  height: 34px;
  align-items: center;
}
.ui-model-delete {
  width: 128px;
  height: 30px;
  border: 1px solid white;
  border-radius: 15px;
  margin: 13px 0 4px 27px;
}
.ui-model-delete:hover {
  color: var(--q-accent);
}
.ui-model-delete-icon {
  margin-right: 12px;
}
:deep(.ui-model-table > table) {
  border: 1px solid var(--q-negative);
  border-radius: 6px;
}
:deep(.ui-model-table-header > th) {
  font-size: 16px;
}
:deep(.ui-model-table-header > th:first-child) {
  border-top-left-radius: 6px;
}
:deep(.ui-model-table-header > th:last-child) {
  border-top-right-radius: 6px;
}
.ui-model-table-select {
  height: 20px;
}
:deep(.q-table tbody td) {
  height: 38px;
  font-size: 14px;
}
.ui-model-table-ellipsis {
  max-width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-model-action-icon:hover {
  color: var(--q-accent);
}
.ui-model-page {
  height: 90px;
  margin-right: -2px;
  font-size: 14px;
}
.ui-model-page-total {
  margin: 0 30px;
}
.ui-model-page-input {
  width: 36px;
  height: 36px;
  border: 1px solid white;
  border-radius: 5px;
  margin: 0 12px;
}
.ui-model-nodata {
  height: 700px;
  font-size: 18px;
}
</style>
