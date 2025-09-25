<template>
  <MainLayout>
    <div class="overflow-x-auto bg-white rounded-lg shadow-md">
      <!-- Customer List -->
      <p class="text-2xl font-bold text-center py-8">Supplier List</p>

      <!-- Create Button -->
      <div class="flex items-center justify-between m-4">
        <div class="flex-1 max-w-xs">
          <input type="search" placeholder="Search" class="search_input" v-model="search" :disabled="isCustomerLoading"
                 @input="onSearchInput" />
        </div>
        <button @click="showCreateModal"
          class="px-4 flex items-center justify-end py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition feature-200">
          <Icon icon="mdi:plus-circle" class="mr-2" /> Add New Supplier
        </button>
      </div>

      <!-- Table -->
      <table class="min-w-full table-auto shadow-lg rounded-lg overflow-hidden">
        <thead class="bg-gray-200">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Notes</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- Customer Row Example -->
          <tr v-for="(customer, index) in customers" :key="index"
            :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'">
            <td class="px-6 py-4 text-sm text-gray-800">{{ customer?.name || '-'}}</td>
            <td class="px-6 py-4 text-sm text-gray-800">{{ customer?.email || '-'}}</td>
            <td class="px-6 py-4 text-sm text-gray-800">{{ customer?.phone || '-'}}</td>
            <td class="px-6 py-4 text-sm text-gray-800">{{ customer?.notes || '-'}}</td>
            <td class="px-6 py-4 text-sm text-gray-800">
              <button @click="showUpdateModal(customer)"
                class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400">
                <Icon icon="mdi:pencil-outline" class="w-5 h-5" />
              </button>
              <!-- Popconfirm for delete -->
              <a-popconfirm title="Are you sure you want to delete this customer?"
                @confirm="deleteCustomer(customer.id)" ok-text="Yes" cancel-text="No">
                <button
                  class="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400">
                  <Icon icon="mdi:delete-outline" class="w-5 h-5" />
                </button>
              </a-popconfirm>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <a-pagination class="p-4" v-model:current="currPage" v-model:page-size="itemsPerPage" :total="totalItems"
      :showSizeChanger="true" :showQuickJumper="false" :show-total="(total) => `Total ${total} items`"
      @change="getCustomers($event)" @showSizeChange="(current, pageSize) => (itemsPerPage = pageSize)" />


    <!-- Create Customer Modal -->
    <a-modal v-model:open="createModalVisible" title="Add New Supplier" @ok="createCustomer">
      <form @submit.prevent="createCustomer">
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label for="name" class="block text-gray-700">Name <span class="text-red-500">*</span></label>
            <input id="name" v-model="newCustomer.name" type="text" class="w-full p-2 border rounded-md" required />
            <p v-if="createErrors.name" class="text-red-500 text-sm mt-1">{{ createErrors.name[0] }}</p>
          </div>

          <div>
            <label for="email" class="block text-gray-700">Email <span class="text-red-500">*</span> </label>
            <input id="email" v-model="newCustomer.email" type="email" class="w-full p-2 border rounded-md" required />
            <p v-if="createErrors.email" class="text-red-500 text-sm mt-1">{{ createErrors.email[0] }}</p>
          </div>

          <div>
            <label for="phone" class="block text-gray-700">Phone </label>
            <input id="phone" v-model="newCustomer.phone" type="text" class="w-full p-2 border rounded-md" required />
            <p v-if="createErrors.phone" class="text-red-500 text-sm mt-1">{{ createErrors.phone[0] }}</p>
          </div>

          <div>
            <label for="notes" class="block text-gray-700">Notes</label>
            <textarea id="notes" v-model="newCustomer.notes" class="w-full p-2 border rounded-md" rows="4"></textarea>
            <p v-if="createErrors.notes" class="text-red-500 text-sm mt-1">{{ createErrors.notes[0] }}</p>
          </div>
        </div>
      </form>
    </a-modal>

    <!-- Update Customer Modal -->
    <a-modal v-model:open="updateModalVisible" title="Update Customer" @ok="updateCustomer">
      <form @submit.prevent="updateCustomer">
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label for="update_name" class="block text-gray-700">Name <span class="text-red-500">*</span></label>
            <input id="update_name" v-model="currentCustomer.name" type="text" class="w-full p-2 border rounded-md"
              required />
            <p v-if="updateErrors.name" class="text-red-500 text-sm mt-1">{{ updateErrors.name[0] }}</p>
          </div>

          <div>
            <label for="update_email" class="block text-gray-700">Email <span class="text-red-500">*</span></label>
            <input id="update_email" v-model="currentCustomer.email" type="email" class="w-full p-2 border rounded-md"
              required />
            <p v-if="updateErrors.email" class="text-red-500 text-sm mt-1">{{ updateErrors.email[0] }}</p>
          </div>

          <div>
            <label for="update_phone" class="block text-gray-700">Phone</label>
            <input id="update_phone" v-model="currentCustomer.phone" type="text" class="w-full p-2 border rounded-md"
              required />
            <p v-if="updateErrors.phone" class="text-red-500 text-sm mt-1">{{ updateErrors.phone[0] }}</p>
          </div>

          <div>
            <label for="update_notes" class="block text-gray-700">Notes</label>
            <textarea id="update_notes" v-model="currentCustomer.notes" class="w-full p-2 border rounded-md"
              rows="4"></textarea>
            <p v-if="updateErrors.notes" class="text-red-500 text-sm mt-1">{{ updateErrors.notes[0] }}</p>
          </div>
        </div>
      </form>
    </a-modal>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import MainLayout from "@/components/layouts/mainLayout.vue";
import axios from 'axios';
import { apiBase } from '@/config';
import { getToken, showNotification } from '@/utilities/common';

const customers = ref([]);
const createModalVisible = ref(false);
const updateModalVisible = ref(false);
const isCustomerLoading = ref(false);
const search = ref('');

const createErrors = ref({});
const updateErrors = ref({});
const itemsPerPage = ref(10);
const totalItems = ref(0);
const currPage = ref(1);
const from = ref(1);
const currentPage = ref(1);
const getCustomers = async (page = 1) => {
  isCustomerLoading.value = true;
  try {
    let url = `${apiBase}/suppliers?page=${page}&limit=${itemsPerPage.value}`;
    if (search.value) url += `&name=${encodeURIComponent(search.value)}`;
    const res = await axios.get(url, getToken());
    if (res.data) {
      customers.value = res.data.data.data;
      totalItems.value = res.data?.data?.total;
      currPage.value = res.data?.data?.current_page;
      from.value = res.data?.data?.from;
    }
  } catch (error) {
    console.error(error);
    showNotification('error', 'Failed to fetch customers', error.message);
  } finally {
    isCustomerLoading.value = false;
  }
};


let searchTimeout = null;
const onSearchInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    getCustomers(1);
  }, 400); // 400ms debounce
};

// const goToPage = (page) => {
//   if (page > 0 && page <= totalPages.value) {
//     currentPage.value = page;
//     getCustomers(page);
//   }
// };
//
// const totalPagesArray = computed(() => {
//   const pages = [];
//   for (let i = 1; i <= totalPages.value; i++) {
//     pages.push(i);
//   }
//   return pages;
// });

onMounted(() => {
  getCustomers();
});

const newCustomer = ref({
  name: '',
  email: '',
  phone: '',
  notes: '',
});

const currentCustomer = ref({
  id: null,
  name: '',
  email: '',
  phone: '',
  notes: '',
});

const showCreateModal = () => {
  newCustomer.value = { name: '', email: '', phone: '', notes: '' };
  createErrors.value = {};
  createModalVisible.value = true;
};

const showUpdateModal = (customer) => {
  currentCustomer.value = { ...customer };
  updateErrors.value = {};
  updateModalVisible.value = true;
};

const createCustomer = async () => {
  createErrors.value = {};
  try {
    const res = await axios.post(`${apiBase}/suppliers`, newCustomer.value, getToken());
    if (res.data) {
      customers.value.push(res.data.data);
      showNotification('success', 'Customer Created', 'The customer was successfully created.');
      createModalVisible.value = false;
    }
  } catch (error) {
    if (error.response?.data?.error) {
      createErrors.value = error.response.data.error;
    } else {
      showNotification('error', 'Failed', error.message);
    }
  }
};

const updateCustomer = async () => {
  updateErrors.value = {};
  try {
    const res = await axios.put(`${apiBase}/suppliers/${currentCustomer.value.id}`, currentCustomer.value, getToken());
    if (res.data) {
      const index = customers.value.findIndex(customer => customer.id === currentCustomer.value.id);
      if (index !== -1) {
        customers.value[index] = { ...currentCustomer.value }; // Update the customer in the list
      }
      showNotification('success', 'Customer Updated', 'The customer was successfully updated.');
      updateModalVisible.value = false;
    }
  } catch (error) {
    if (error.response?.data?.error) {
      updateErrors.value = error.response.data.error;
    } else {
      showNotification('error', 'Failed', error.message);
    }
  }
};

const isDeleting = ref(false);
const deleteCustomer = async (id) => {
  isDeleting.value = true;
  try {
    const response =  await axios.delete(`${apiBase}/suppliers/${id}`, getToken());
    if (response.status === 200 || response.status === 204) {
      showNotification('success', 'Customer deleted', 'The customer was successfully deleted.');
      await getCustomers(); // Refresh the list
    } else {
      showNotification('error', 'Failed to delete customer', 'Unexpected response from server.');
    }
  } catch (error) {
    console.error(error);
    const errorMessage =
        error.response?.data?.message || error.message || 'Something went wrong';
    showNotification('error', 'Failed to delete customer', errorMessage);
  } finally {
    isDeleting.value = false;
  }
};
</script>
