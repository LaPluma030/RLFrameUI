<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { QTableProps, useQuasar } from "quasar";

import { useStorage, Task } from "~/storage";

import { goToPage } from "utils";

const router = useRouter();
const $q = useQuasar();
const storage = useStorage();

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
    label: "任务名称",
    field: "name",
    align: "center",
    sortable: true,
  },
  {
    name: "scenario",
    label: "想定文件",
    field: (r: Task) => r.scenario?.name ?? "无",
    align: "center",
    sortable: true,
  },
  {
    name: "design",
    label: "试验设计方案",
    field: (r: Task) => r.design?.name ?? "无",
    align: "center",
    sortable: true,
  },
  {
    name: "description",
    label: "任务描述",
    field: "description",
    align: "center",
  },
  {
    name: "createTime",
    label: "创建时间",
    field: "createTime",
    align: "center",
    sortable: true,
  },
  {
    name: "updateTime",
    label: "修改时间",
    field: "updateTime",
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

//用于搜索
const filter = ref("");

// 用于分页
const paginationRaw = reactive({
  sortBy: "updateTime", // 排序的列
  descending: true, // 是否降序
  page: 1, //当前所在页码，默认为第一页
  rowsPerPage: 16, //每页展示多少条数据，具有默认值
});
// 取消打开任务
function cancel() {
  router.back();
}
// 打开某一任务
async function openTask(id: number) {
  // 先判断是否有任务打开
  if (storage.isTaskOpen) {
    storage.isTaskFlag = "open";
    router.push({
      path: "/task-close",
      query: {
        taskId: id,
      },
    });
  } else {
    try {
      await storage.openTask(id);
      router.push("/task-info");
    } catch (e) {
      if (e instanceof Error) {
        $q.notify({
          type: "error",
          message: "打开任务时出错：" + e.message,
        });
      }
    }
  }
}
</script>
<template>
  <q-dialog model-value maximized @hide="cancel">
    <q-card class="transparent ui-open-card">
      <q-card-section class="bg-secondary text-accent ui-open-title">打开任务</q-card-section>
      <q-card-section class="bg-secondary ui-open-main">
        <q-table
          class="transparent shadow-0 full-height"
          table-class="ui-open-table"
          table-header-class="bg-info ui-open-table-header"
          separator="cell"
          :rows="storage.tasks"
          :columns="columns"
          row-key="id"
          :filter="filter"
          :pagination="paginationRaw"
        >
          <!-- 表格头部区域 -->
          <template #top>
            <q-input v-model="filter" borderless dense debounce="300" placeholder="搜索" class="ui-open-search">
              <template #prepend>
                <q-icon name="search" size="sm" class="ui-open-search-icon" />
              </template>
            </q-input>
          </template>
          <!-- 表格中间区域 -->
          <template #body-cell="props">
            <q-td :props="props" class="ui-open-table-ellipsis">
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
                name="file_open"
                size="xs"
                class="material-icons-outlined cursor-pointer ui-open-action-icon"
                @click="openTask(props.key)"
              />
              <q-tooltip anchor="top right" self="top middle">打开</q-tooltip>
            </q-td>
          </template>
          <!-- 表格底部区域 -->
          <template #bottom="{ pagination, pagesNumber }">
            <div class="flex full-width items-center justify-end ui-open-page">
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
              <span class="ui-open-page-total">共 {{ pagesNumber }} 页</span>
              <span>前往第 </span>
              <q-input
                borderless
                dense
                input-class="text-center"
                class="ui-open-page-input"
                :model-value="pagination.page"
                @update:model-value="goToPage(pagination, pagesNumber, $event)"
              />
              <span> 页</span>
            </div>
          </template>
          <!-- 没有数据时 -->
          <template #no-data="{ message, icon }">
            <div class="flex flex-center full-width ui-open-nodata">
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
.ui-open-card {
  height: calc(100% - 84px);
  margin: 52px 0 32px 279px;
}
.ui-open-title {
  height: 50px;
  padding-left: 33px;
  margin-bottom: 2px;
}
.ui-open-main {
  height: calc(100% - 52px);
  padding: 0 85px 0 78px;
}
:deep(.q-table__top),
:deep(.q-table__bottom) {
  border: 0;
}
.ui-open-search {
  width: 522px;
  height: 36px;
  margin: 13px 0 4px -16px;
  border: 1px solid white;
  border-radius: 17.5px;
}
.ui-open-search-icon {
  margin-left: 16px;
}
:deep(.q-field__control) {
  height: 34px;
  align-items: center;
}
:deep(.ui-open-table > table) {
  border: 1px solid var(--q-negative);
  border-radius: 6px;
}
:deep(.ui-open-table-header > th) {
  font-size: 16px;
}
:deep(.ui-open-table-header > th:first-child) {
  border-top-left-radius: 6px;
}
:deep(.ui-open-table-header > th:last-child) {
  border-top-right-radius: 6px;
}
:deep(.q-table tbody td) {
  height: 38px;
  font-size: 14px;
}
.ui-open-table-ellipsis {
  max-width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-open-action-icon:hover {
  color: var(--q-accent);
}
.ui-open-page {
  height: 90px;
  margin-right: -2px;
  font-size: 14px;
}
.ui-open-page-total {
  margin: 0 30px;
}
.ui-open-page-input {
  width: 36px;
  height: 36px;
  border: 1px solid white;
  border-radius: 5px;
  margin: 0 12px;
}
.ui-open-nodata {
  height: 700px;
  font-size: 18px;
}
</style>
