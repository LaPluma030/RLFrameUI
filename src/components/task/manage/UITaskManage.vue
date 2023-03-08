<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { QTableProps, useQuasar } from "quasar";

import { useStorage, Task } from "~/storage";
import { deleteTask } from "api";
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

// 打开某一任务的模型管理列表
function openCurrentTaskModel(id: number) {
  router.push({
    path: "/task-model-manage",
    query: { id },
  });
}

// 删除某一任务
function deleteCurrentTask(id: number) {
  if (id === storage.currentTask.id) {
    $q.notify({
      type: "warning",
      message: "无法删除当前打开的任务",
    });
  } else {
    $q.notify({
      type: "ask",
      message: "您确定要删除该任务吗？",
      actions: [
        {
          label: "确定",
          color: "accent",
          handler: async () => {
            const index = storage.tasks.findIndex((item) => item.id === id);
            try {
              // 调用后台接口,删除数据
              let response = await deleteTask(storage.systemSettings.resServAddr, id);
              console.log(response);
              // 更新表格
              storage.tasks.splice(index, 1);
            } catch (e) {
              if (e instanceof Error) {
                $q.notify({
                  type: "error",
                  message: "删除任务时出错：" + e.message,
                });
              }
            }
          },
        },
        {
          label: "取消",
          color: "white",
        },
      ],
    });
  }
}

// 批量删除任务
const selectedTasks = ref([] as Task[]);
function deleteSelectedTasks() {
  if (selectedTasks.value.find((item) => item.id === storage.currentTask.id)) {
    $q.notify({
      type: "warning",
      message: "无法删除当前打开的任务",
    });
  } else {
    $q.notify({
      type: "ask",
      message: "您确定要删除选中的任务吗？",
      actions: [
        {
          label: "确定",
          color: "accent",
          handler: async () => {
            try {
              // 调用后台接口,删除数据
              const promises = selectedTasks.value.map((item) => deleteTask(storage.systemSettings.resServAddr, item.id));
              await Promise.all(promises);
              // 更新表格
              selectedTasks.value.forEach((item) => {
                let index = storage.tasks.findIndex((taskItem) => taskItem.id === item.id);
                if (index >= 0) {
                  storage.tasks.splice(index, 1);
                }
              });
              // selectedTasks.value清零
              selectedTasks.value.splice(0);
            } catch (e) {
              if (e instanceof Error) {
                $q.notify({
                  type: "error",
                  message: "批量删除任务时出错：" + e.message,
                });
              }
            }
          },
        },
        {
          label: "取消",
          color: "white",
        },
      ],
    });
  }
}
</script>
<template>
  <q-card class="transparent ui-task-card">
    <q-card-section class="bg-secondary text-accent ui-task-title">任务管理</q-card-section>
    <q-card-section class="bg-secondary ui-task-main">
      <q-table
        v-model:selected="selectedTasks"
        class="transparent shadow-0 full-height"
        table-class="ui-task-table"
        table-header-class="bg-info ui-task-table-header"
        separator="cell"
        :rows="storage.tasks"
        :columns="columns"
        row-key="id"
        selection="multiple"
        :filter="filter"
        :pagination="paginationRaw"
      >
        <!-- 表格头部区域 -->
        <template #top>
          <q-input v-model="filter" borderless dense debounce="300" placeholder="搜索" class="ui-task-search">
            <template #prepend>
              <q-icon name="search" size="sm" class="ui-task-search-icon" />
            </template>
          </q-input>
          <q-btn size="sm" class="ui-task-delete" @click="deleteSelectedTasks">
            <q-icon name="delete_forever" class="ui-task-delete-icon" />
            <span> 批量删除 </span>
          </q-btn>
        </template>
        <!-- 表格中间区域 -->
        <template #body-cell="props">
          <q-td :props="props" class="ui-task-table-ellipsis">
            {{ props.value }}
            <q-tooltip anchor="top right" self="top middle">{{ props.value }}</q-tooltip>
          </q-td>
        </template>
        <template #header-selection="props">
          <q-checkbox v-model="props.selected" size="md" class="ui-task-table-select" />
        </template>
        <template #body-selection="props">
          <q-checkbox v-model="props.selected" size="md" class="ui-task-table-select" />
        </template>
        <template #body-cell-rowIndex="props">
          <q-td :props="props"> {{ props.rowIndex + 1 }} </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-icon
              name="file_open"
              size="xs"
              class="material-icons-outlined cursor-pointer ui-task-action-icon"
              @click="openTask(props.key)"
            >
              <q-tooltip anchor="top right" self="top left">打开</q-tooltip>
            </q-icon>
            <q-icon
              name="layers"
              size="xs"
              class="material-icons-outlined cursor-pointer ui-task-action-icon"
              @click="openCurrentTaskModel(props.key)"
            >
              <q-tooltip anchor="top right" self="top left">模型管理</q-tooltip>
            </q-icon>
            <q-icon
              name="delete"
              size="xs"
              class="material-icons-outlined cursor-pointer ui-task-action-icon"
              @click="deleteCurrentTask(props.key)"
            >
              <q-tooltip anchor="top right" self="top left">删除</q-tooltip>
            </q-icon>
          </q-td>
        </template>
        <!-- 表格底部区域 -->
        <template #bottom="{ pagination, pagesNumber }">
          <div class="flex full-width items-center justify-end ui-task-page">
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
            <span class="ui-task-page-total">共 {{ pagesNumber }} 页</span>
            <span>前往第 </span>
            <q-input
              borderless
              dense
              input-class="text-center"
              class="ui-task-page-input"
              :model-value="pagination.page"
              @update:model-value="goToPage(pagination, pagesNumber, $event)"
            />
            <span> 页</span>
          </div>
        </template>
        <!-- 没有数据时 -->
        <template #no-data="{ message, icon }">
          <div class="flex flex-center full-width ui-task-nodata">
            <q-icon :name="icon" size="md" />
            <span class="q-ml-md">{{ message }}</span>
          </div>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>
<style scoped>
.ui-task-card {
  height: calc(100vh - 84px);
  margin: 2px 0 2px 23px;
}
.ui-task-title {
  height: 50px;
  padding-left: 33px;
  margin-bottom: 2px;
}
.ui-task-main {
  height: calc(100% - 52px);
  padding: 0 85px 0 78px;
}
:deep(.q-table__top),
:deep(.q-table__bottom) {
  border: 0;
}
.ui-task-search {
  width: 522px;
  height: 36px;
  margin: 13px 0 4px -16px;
  border: 1px solid white;
  border-radius: 17.5px;
}
.ui-task-search-icon {
  margin-left: 16px;
}
:deep(.q-field__control) {
  height: 34px;
  align-items: center;
}
.ui-task-delete {
  width: 128px;
  height: 30px;
  border: 1px solid white;
  border-radius: 15px;
  margin: 13px 0 4px 27px;
}
.ui-task-delete:hover {
  color: var(--q-accent);
}
.ui-task-delete-icon {
  margin-right: 12px;
}
:deep(.ui-task-table > table) {
  border: 1px solid var(--q-negative);
  border-radius: 6px;
}
:deep(.ui-task-table-header > th) {
  font-size: 16px;
}
:deep(.ui-task-table-header > th:first-child) {
  border-top-left-radius: 6px;
}
:deep(.ui-task-table-header > th:last-child) {
  border-top-right-radius: 6px;
}
.ui-task-table-select {
  height: 20px;
}
:deep(.q-table tbody td) {
  height: 38px;
  font-size: 14px;
}
.ui-task-table-ellipsis {
  max-width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ui-task-action-icon {
  margin: 0 4px;
}
.ui-task-action-icon:hover {
  color: var(--q-accent);
}
.ui-task-page {
  height: 90px;
  margin-right: -2px;
  font-size: 14px;
}
.ui-task-page-total {
  margin: 0 30px;
}
.ui-task-page-input {
  width: 36px;
  height: 36px;
  border: 1px solid white;
  border-radius: 5px;
  margin: 0 12px;
}
.ui-task-nodata {
  height: 700px;
  font-size: 18px;
}
</style>
