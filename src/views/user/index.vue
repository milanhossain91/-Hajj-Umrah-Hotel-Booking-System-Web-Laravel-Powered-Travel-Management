<template>
  <MainLayout>
    <!-- Title & Filter -->
    <div class=" items-center">
      <div class=" mb-3">
        <h1 class="title">All Users ({{ total }})</h1>
      </div>
      <div class="flex gap-2 justify-between items-center">
        <div>
          <input type="search" placeholder="Search" class="search_input" v-model="search" :disabled="loading"
            @input="onSearchInput" />
        </div>
        <div class="flex gap-2">

          <button type="button" class="create_btn" @click="modal_create_open = true">
            <i class="bi bi-person-plus pr-1"></i> Add New User
          </button>
        </div>
      </div>
    </div>
    <!-- Table -->
    <div class="p-6">
      <table class="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <thead class="bg-gray-100 text-gray-700">
          <tr>
            <th class="px-4 py-2 text-left">Actions</th>
            <th class="px-4 py-2 text-left">User</th>
            <th class="px-4 py-2 text-left">Email</th>
            <th class="px-4 py-2 text-left">Role</th>
            <th class="px-4 py-2 text-left">Permissions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(user, index) in user_list" :key="user.id" class="hover:bg-gray-50">
            <td class="w-10">
              <button type="button" class="table_edit_btn mr-2" title="Edit" @click="editUser(user, index)">
                <i class="bi bi-pencil"></i>
              </button>
              <button type="button" class="table_del_btn" disabled v-if="is_deleting == index">
                <Spinner />
              </button>
              <PopConfirm v-else :title="user.name" @delete="() => handleDelete(user.id, index)" />
            </td>
            <td class="px-4 py-2">{{ user.name }}</td>
            <td class="px-4 py-2">{{ user.email }}</td>
            <td class="px-4 py-2">
              <span v-for="role in user.roles" :key="role.id"
                class="px-2 py-1 text-xs font-semibold rounded-full mr-1 mb-1 inline-block"
                :class="role.name === 'Admin' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'">
                {{ role.name }}
              </span>
              <span v-if="user.roles.length === 0" class="text-gray-400 text-xs">No roles assigned</span>
            </td>
            <td class="px-4 py-2">
              <ul class="list-disc pl-4 text-sm text-gray-600" v-if="user.permissions && user.permissions.length">
                <li v-for="(perm, i) in user.permissions" :key="i">{{ perm }}</li>
              </ul>
              <span v-else class="text-gray-400">No permissions</span>
            </td>
          </tr>
          <tr v-if="user_list.length === 0 && !loading">
            <td :colspan="colspan" class="px-4 py-4 text-center">No users found</td>
          </tr>
          <tr v-if="loading">
            <td :colspan="colspan" class="px-4 py-4 text-center">
              <Spinner />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Pagination -->
    <a-pagination class="p-4" v-model:current="currPage" v-model:page-size="itemsPerPage" :total="totalItems"
      :showSizeChanger="true" :showQuickJumper="false" :show-total="(total) => `Total ${total} items`"
      @change="getAllUsers($event)" @showSizeChange="(current, pageSize) => (itemsPerPage = pageSize)" />

    <!-- Add/Edit User Modals (Leave unchanged) -->
    <!-- ... (same as your previous code) ... -->
    <!-- Add User -->
    <a-modal v-model:open="modal_create_open" title="Create New User" :footer="false">

      <form class="mt-4" @submit.prevent="
        async () => {
          is_creating = true;
          const res = await createUser(create_user);
          is_creating = false;
          if (res) {
            resetCreateForm();
            await getAllUsers();
          }
        }
      ">
        <div class="grid grid-cols-12 gap-2">
          <div class="col-span-2">
            <label class="block">Name <span class="text-red-600">*</span></label>
          </div>
          <div class="col-span-10">
            <input type="text" placeholder="Name" class="text_input" v-model="create_user.name" required />
          </div>
          <div class="col-span-2">
            <label class="block">Email <span class="text-red-600">*</span></label>
          </div>
          <div class="col-span-10">
            <input type="email" placeholder="Email" class="text_input" v-model="create_user.email" required />
          </div>
          <div class="col-span-2">
            <label class="block">Password <span class="text-red-600">*</span></label>
          </div>
          <div class="col-span-10">
            <input type="password" placeholder="Password" class="text_input" v-model="create_user.password" required />
          </div>
          <div class="col-span-2">
            <label class="block">Role <span class="text-red-600">*</span></label>
          </div>
          <div class="col-span-10">
            <p v-if="role_loading">Loading...</p>
            <select class="text_input capitalize" v-model="create_user.roles" required v-else>
              <option value="">-- Select --</option>
              <template v-for="role in role_list?.sort((a, b) =>
                a?.name?.localeCompare(b?.name)
              )">
                <option :value="role?.name">{{ role?.name }}</option>
              </template>
            </select>
          </div>
          <!-- <div class="col-span-2">
            <label class="block"
              >Branch <span class="text-red-600">*</span></label
            >
          </div>
          <div class="col-span-10">
            <p v-if="branch_loading">Loading...</p>
            <select
              v-else
              class="text_input capitalize"
              v-model="create_user.branch_id"
              required
            >
              <option value="">-- Select --</option>
              <template
                v-for="branch in branch_list?.sort((a, b) =>
                  a?.organization_name?.localeCompare(b?.organization_name)
                )"
              >
                <option :value="branch?.id">
                  {{ branch?.organization_name }} ({{ branch?.branch }})
                </option>
              </template>
            </select>
          </div> -->
        </div>
        <div class="mt-4 text-right">
          <button type="submit" class="create_btn mr-3" :disabled="is_creating">
            Submit
            <Spinner v-if="is_creating" />
          </button>
          <button type="button" class="del_btn" @click="modal_create_open = false">
            Cancel
          </button>
        </div>
      </form>
    </a-modal>
    <!-- Edit User -->
    <a-modal :title="`Update ${edit_user?.name?.toUpperCase()}`" v-model:open="modal_edit_open" :footer="false">

      <form class="mt-4" @submit.prevent="handleEdit()">
        <div class="grid grid-cols-12 gap-2">
          <div class="col-span-2">
            <label class="block">Name <span class="text-red-600">*</span></label>
          </div>
          <div class="col-span-10">
            <input type="text" placeholder="Name" class="text_input" v-model="edit_user.name" required />
          </div>
          <div class="col-span-2">
            <label class="block">Email <span class="text-red-600">*</span></label>
          </div>
          <div class="col-span-10">
            <input type="email" placeholder="Email" class="text_input" v-model="edit_user.email" required />
          </div>
          <!-- <div class="col-span-2">
            <label class="block"
              >Branch <span class="text-red-600">*</span></label
            >
          </div>
          <div class="col-span-10">
            <p v-if="branch_loading">Loading...</p>
            <select
              v-else
              class="text_input capitalize"
              v-model="edit_user.branch_id"
              required
            >
              <option value="">-- Select --</option>
              <template
                v-for="branch in branch_list?.sort((a, b) =>
                  a?.organization_name?.localeCompare(b?.organization_name)
                )"
              >
                <option :value="branch?.id">
                  {{ branch?.organization_name }} ({{ branch?.branch }})
                </option>
              </template>
            </select>
          </div> -->
          <div class="col-span-2">
            <label class="block">Status <span class="text-red-600">*</span></label>
          </div>
          <div class="col-span-10">
            <select class="text_input capitalize" v-model="edit_user.status" required>
              <option value="1">Active</option>
              <option value="0">In Active</option>
            </select>
          </div>
          <div class="col-span-2">
            <label class="block">Role <span class="text-red-600">*</span></label>
          </div>
          <div class="col-span-10">
            <p v-if="role_loading">Loading...</p>
            <div class="flex items-center" v-for="role in role_list?.sort((a, b) =>
              a?.name?.localeCompare(b?.name)
            )" :key="role?.id">
              <input :id="role?.name" type="checkbox"
                class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-primary-500 focus:ring-2"
                :value="role?.name" v-model="edit_user.roles" />
              <label :for="role?.name" class="ms-2 font-medium capitalize">
                {{ role?.name }}
              </label>
            </div>
          </div>
        </div>
        <div class="mt-4 text-right">
          <button type="submit" class="create_btn mr-3" :disabled="is_updating">
            Submit
            <Spinner v-if="is_updating" />
          </button>
          <button type="button" class="del_btn" @click="resetEditForm()">
            Cancel
          </button>
        </div>
      </form>
    </a-modal>
  </MainLayout>
</template>
<script setup>
import PopConfirm from "@/components/popconfirm.vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import Spinner from "@/components/spinner.vue";
import {
  getRoles,
  createUser,
  deleteUser,
  updateUser,
} from "@/stores/users.js";
import { getToken } from "@/utilities/common.js";
import axios from "axios";
import { ref, onMounted, computed, watch } from "vue";
import { apiBase } from "@/config";

// --- ALL YOUR USER DATA LOGIC ---
const user_list = ref([]);
const role_list = ref([]);
const total = ref(0);
const colspan = ref(10);

const search = ref('');
const loading = ref(false);
const role_loading = ref(false);
const modal_create_open = ref(false);
const modal_edit_open = ref(false);
const is_creating = ref(false);
const is_updating = ref(false);
const is_deleting = ref(-1);

const create_user = ref({
  name: "",
  email: "",
  password: "",
  roles: "",
});
const edit_user = ref({
  name: "",
  email: "",
  roles: [],
  status: 1,
});
const edit_user_id = ref();
const resetCreateForm = () => {
  create_user.value = {
    name: "",
    email: "",
    password: "",
    roles: "",
  };
  modal_create_open.value = false;
};
const resetEditForm = () => {
  edit_user.value = {
    name: "",
    email: "",
    roles: [],
    status: 1,
  };
  edit_user_id.value = "";
  modal_edit_open.value = false;
};
const handleEdit = async () => {
  is_updating.value = true;
  const res = await updateUser(edit_user_id.value, edit_user.value);
  is_updating.value = false;
  if (res) {
    resetEditForm();
    await getAllUsers(currentPage.value);
  }
};
const editUser = (user, index) => {
  edit_user.value = {
    name: user.name,
    email: user.email,
    roles: user.roles.map(r => r.name),
    status: user.status || 1,
  };
  edit_user_id.value = user.id;
  modal_edit_open.value = true;
};

const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);
const currPage = ref(1);
const from = ref(1);
// --- API CALL ---
const getAllUsers = async (page = 1) => {
  loading.value = true;
  try {
    let url = `${apiBase}/user_list?page=${page}&limit=${itemsPerPage.value}`;
    if (search.value) url += `&search=${encodeURIComponent(search.value)}`;
    const res = await axios.get(url, getToken());
    if (res.data && res.data.users) {
      user_list.value = res.data.users.data;
      totalItems.value = res.data?.users?.total;
      currPage.value = res.data?.users?.current_page;
      from.value = res.data?.users?.from;
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};



// --- DEBOUNCE FOR SEARCH ---
let searchTimeout = null;
const onSearchInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    getAllUsers(1);
  }, 400); // 400ms debounce
};



// --- DELETE ---
const handleDelete = async (id, idx) => {
  is_deleting.value = idx;
  let res = await deleteUser(id);
  is_deleting.value = -1;
  if (res) await getAllUsers(currentPage.value);
};

onMounted(async () => {
  await getAllUsers();
  role_list.value = await getRoles();
});


const response = {
  users: {
    current_page: 1,
    per_page: 5,
    total: 1,
    last_page: 1,
  }
}

const pagination = ref({
  current: response.users.current_page,
  pageSize: response.users.per_page,
  total: response.users.total,
})

const pageSizeOptions = ['5', '10', '20', '50']

function showTotal(total, range) {
  return `${range[0]}-${range[1]} of ${total} users`
}

function onPageChange(page) {
  pagination.value.current = page
  getAllUsers(page, pagination.value.pageSize)
}

function onPageSizeChange(current, size) {
  pagination.value.pageSize = size
  pagination.value.current = 1 // Reset to first page

}
</script>