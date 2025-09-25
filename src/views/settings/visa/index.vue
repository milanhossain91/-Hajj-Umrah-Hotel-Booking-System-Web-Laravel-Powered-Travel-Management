<template>
  <MainLayout>
    <div class="overflow-x-auto bg-white rounded-lg shadow-md">
      <!-- Visa Table -->
      <p class="text-2xl font-bold text-center py-8">Visa Table</p>

      <!-- Create Button -->
      <div class="flex items-center justify-end m-4">
        <button @click="showCreateModal"
          class="px-4 flex items-center justify-end py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition feature-200">
          <Icon icon="mdi:plus-circle" class="mr-2" /> Create Visa Entry
        </button>
      </div>

      <!-- Table with Loader -->
      <div class="relative">
        <!-- Loader -->
        <div v-if="isVisaLoading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <a-spin size="large" />
        </div>

        <table class="min-w-full table-auto shadow-lg rounded-lg overflow-hidden">
          <thead class="bg-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Visa Type</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Cost</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Currency</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Visa Row Example -->
            <tr v-for="(visa, index) in visas" :key="index" :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'">
              <td class="px-6 py-4 text-sm text-gray-800">{{ visa.visa_type }}</td>
              <td class="px-6 py-4 text-sm text-gray-800">{{ visa.cost }}</td>
              <td class="px-6 py-4 text-sm text-gray-800">{{ visa.currency }}</td>
              <td class="px-6 py-4 text-sm text-gray-800">
                <button @click="showUpdateModal(visa)"
                  class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400">
                  <Icon icon="mdi:pencil-outline" class="w-5 h-5" />
                </button>
                <a-popconfirm title="Are you sure you want to delete this visa entry?" @confirm="deleteVisa(visa.id)"
                  ok-text="Yes" cancel-text="No">
                  <button
                    class="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400">
                    <Icon icon="mdi:delete-outline" class="w-5 h-5" />
                  </button>
                </a-popconfirm>
              </td>
            </tr>

            <!-- Empty state -->
            <tr v-if="!isVisaLoading && visas.length === 0">
              <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
                No visa entries found
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
    <a-pagination class="p-4" v-model:current="currPage" v-model:page-size="itemsPerPage" :total="totalItems"
                  :showSizeChanger="true" :showQuickJumper="false" :show-total="(total) => `Total ${total} items`"
                  @change="getVisas($event)" @showSizeChange="(current, pageSize) => (itemsPerPage = pageSize)" />

    <!-- Create Visa Modal -->
    <a-modal v-model:visible="createModalVisible" title="Create New Visa Entry" @ok="createVisa"
      :confirm-loading="isCreating">
      <form @submit.prevent="createVisa">
        <div class="grid grid-cols-1 gap-4">
          <!-- Visa Type Select -->
          <div>
            <label for="visa_type" class="block text-gray-700">Visa Type  <span class="text-red-500">*</span></label>
            <a-select v-model:value="newVisa.visa_type" placeholder="Select Visa Type" class="w-full" required>
              <a-select-option value="British">British</a-select-option>
              <a-select-option value="Foreign">Foreign</a-select-option>
            </a-select>
            <p v-if="createErrors.visa_type" class="text-red-500 text-sm mt-1">
              {{ createErrors.visa_type[0] }}
            </p>
          </div>

          <!-- Cost Input -->
          <div>
            <label for="cost" class="block text-gray-700">Cost <span class="text-red-500">*</span></label>
            <a-input id="cost" v-model:value="newVisa.cost" type="number" class="w-full p-2 border rounded-md"
              required />
            <p v-if="createErrors.cost" class="text-red-500 text-sm mt-1">
              {{ createErrors.cost[0] }}
            </p>
          </div>

          <!-- Currency Select -->
          <div>
            <label for="currency" class="block text-gray-700">Currency <span class="text-red-500">*</span></label>
            <a-select v-model:value="newVisa.currency" placeholder="Select Currency" class="w-full" required>
              <a-select-option value="USD">USD</a-select-option>
              <a-select-option value="EUR">EUR</a-select-option>
              <a-select-option value="GBP">GBP</a-select-option>
              <a-select-option value="INR">INR</a-select-option>
              <a-select-option value="JPY">JPY</a-select-option>
            </a-select>
            <p v-if="createErrors.currency" class="text-red-500 text-sm mt-1">
              {{ createErrors.currency[0] }}
            </p>
          </div>
        </div>
      </form>
    </a-modal>

    <!-- Update Visa Modal -->
    <a-modal v-model:visible="updateModalVisible" title="Update Visa Entry" @ok="updateVisa"
      :confirm-loading="isUpdating">
      <form @submit.prevent="updateVisa">
        <div class="grid grid-cols-1 gap-4">
          <!-- Visa Type Select -->
          <div>
            <label for="update_visa_type" class="block text-gray-700">Visa Type <span class="text-red-500">*</span></label>
            <a-select v-model:value="currentVisa.visa_type" placeholder="Select Visa Type" class="w-full" required>
              <a-select-option value="British">British</a-select-option>
              <a-select-option value="Foreign">Foreign</a-select-option>
            </a-select>
            <p v-if="updateErrors.visa_type" class="text-red-500 text-sm mt-1">
              {{ updateErrors.visa_type[0] }}
            </p>
          </div>

          <!-- Cost Input -->
          <div>
            <label for="update_cost" class="block text-gray-700">Cost  <span class="text-red-500">*</span></label>
            <a-input id="update_cost" v-model:value="currentVisa.cost" type="number"
              class="w-full p-2 border rounded-md" required />
            <p v-if="updateErrors.cost" class="text-red-500 text-sm mt-1">
              {{ updateErrors.cost[0] }}
            </p>
          </div>

          <!-- Currency Select -->
          <div>
            <label for="update_currency" class="block text-gray-700">Currency <span class="text-red-500">*</span></label>
            <a-select v-model:value="currentVisa.currency" placeholder="Select Currency" class="w-full" required>
              <a-select-option value="USD">USD</a-select-option>
              <a-select-option value="EUR">EUR</a-select-option>
              <a-select-option value="GBP">GBP</a-select-option>
              <a-select-option value="INR">INR</a-select-option>
              <a-select-option value="JPY">JPY</a-select-option>
            </a-select>
            <p v-if="updateErrors.currency" class="text-red-500 text-sm mt-1">
              {{ updateErrors.currency[0] }}
            </p>
          </div>
        </div>
      </form>
    </a-modal>
  </MainLayout>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import MainLayout from "@/components/layouts/mainLayout.vue";
import axios from 'axios';
import { apiBase } from '@/config';
import { getToken, showNotification } from '@/utilities/common';
import {Modal} from "ant-design-vue";

// Visa data
const visas = ref([]);
const isVisaLoading = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);
const isDeleting = ref(false);


// const currentPage = ref(1);  // Track current page
// const totalPages = ref(1);    // Track total number of pages
// const pageSize = ref(10);     // Number of items per page

const createErrors = ref({});
const updateErrors = ref({});
const itemsPerPage = ref(10);
const totalItems = ref(0);
const currPage = ref(1);
const from = ref(1);
const currentPage = ref(1);
// Fetch visas
const getVisas = async (page = 1) => {
  isVisaLoading.value = true;
  try {
    let url = `${apiBase}/visas?page=${page}&limit=${itemsPerPage.value}`;
    const res = await axios.get(url, getToken());
    if (res.data) {
      // visas.value = res.data.data.data;
      // totalPages.value = res.data.data.last_page;
      // currentPage.value = res.data.data.current_page;
      visas.value = res.data.data.data;
      totalItems.value = res.data?.data?.total;
      currPage.value = res.data?.data?.current_page;
      from.value = res.data?.data?.from;
    }
  } catch (error) {
    console.error(error);
  } finally {
    isVisaLoading.value = false;
  }
};

// Pagination Logic
// const goToPage = (page) => {
//   if (page > 0 && page <= totalPages.value) {
//     currentPage.value = page;
//     getVisas(page);
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
  getVisas();
});

// Modal visibility states
const createModalVisible = ref(false);
const updateModalVisible = ref(false);

// Form data for visa creation
const newVisa = ref({
  visa_type: 'British',
  cost: 0,
  currency: 'USD',
});

// Current visa for updating
const currentVisa = ref({
  visa_type: '',
  cost: 0,
  currency: '',
});

// Open Create Visa Modal
const showCreateModal = () => {
  createModalVisible.value = true;
};

// Open Update Visa Modal
const showUpdateModal = (visa) => {
  currentVisa.value = { ...visa };
  updateModalVisible.value = true;
};

// Create visa
const createVisa = async () => {
  isCreating.value = true;
  createErrors.value = {};
  try {
    const res = await axios.post(`${apiBase}/visas`, newVisa.value, getToken());
    if (res.data) {

      createModalVisible.value = false;
      // showNotification('success', 'Visa Created', 'The visa entry has been created successfully.');
      Modal.success({
        title: 'Success',
        content: 'Visa created successfully!',
      });
      await getVisas();
    }
  } catch (error) {
    if (error.response?.data?.error) {
      createErrors.value = error.response.data.error;
    } else {
      showNotification('error', 'Failed', error.message);
    }

  } finally {
    isCreating.value = false;
  }
};

// Update visa
const updateVisa = async () => {
  isUpdating.value = true;
  updateErrors.value = {};
  try {
    const res = await axios.put(`${apiBase}/visas/${currentVisa.value.id}`, currentVisa.value, getToken());
    if (res.data) {

      updateModalVisible.value = false;
      // showNotification('success', 'Visa Updated', 'The visa entry has been updated successfully.');
      Modal.success({
        title: 'Success',
        content: 'Visa updated successfully!',
      });
      await getVisas();
    }
  } catch (error) {
    if (error.response?.data?.error) {
      updateErrors.value = error.response.data.error;
    } else {
      showNotification('error', 'Failed', error.message);
    }

  } finally {
    isUpdating.value = false;
  }
};



// Delete visa
const deleteVisa = async (id) => {
  isDeleting.value = true;
  try {
    await axios.delete(`${apiBase}/visas/${id}`, getToken());

    await getVisas(); // Refresh the list
  } catch (error) {
    console.error(error);

  } finally {
    isDeleting.value = false;
  }
};
</script>

<style scoped>
/* Add any additional styles here */
</style>