<template>
  <MainLayout>
    <div class="overflow-x-auto bg-white rounded-lg shadow-md">
      <!-- Profits Table -->
      <p class="text-2xl font-bold text-center py-8">Profits Table</p>

      <!-- Create Button -->
      <div class="flex items-center justify-end m-4">
        <button @click="showCreateModal"
          class="px-4 flex items-center justify-end py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition feature-200">
          <Icon icon="mdi:plus-circle" class="mr-2" /> Create Profit Entry
        </button>
      </div>

      <!-- Table -->
      <table class="min-w-full table-auto shadow-lg rounded-lg overflow-hidden">
        <thead class="bg-gray-200">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Item Type</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Percentage Markup</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fixed Markup</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- Profit Row Example -->
          <tr v-for="(profit, index) in profits" :key="index" :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'">
            <td class="px-6 py-4 text-sm text-gray-800">{{ profit?.item_type || '-'}}</td>
            <td class="px-6 py-4 text-sm text-gray-800">{{ profit?.percentage_markup || '-'}}%</td>
            <td class="px-6 py-4 text-sm text-gray-800">{{ profit?.fixed_markup || '-'}}</td>
            <td class="px-6 py-4 text-sm text-gray-800">
              <button @click="showUpdateModal(profit)"
                class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400">
                <Icon icon="mdi:pencil-outline" class="w-5 h-5" />
              </button>
              <a-popconfirm title="Are you sure you want to delete this profit?" @confirm="deleteProfit(profit.id)"
                ok-text="Yes" cancel-text="No">
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
    <!-- pagination -->
    <a-pagination class="p-4" v-model:current="currPage" v-model:page-size="itemsPerPage" :total="totalItems"
      :showSizeChanger="true" :showQuickJumper="false" :show-total="(total) => `Total ${total} items`"
      @change="getProfits($event)" @showSizeChange="(current, pageSize) => (itemsPerPage = pageSize)" />

    <!-- Create Profit Modal -->
    <a-modal v-model:open="createModalVisible" title="Create New Profit Entry" @ok="createProfit"
      :confirm-loading="isCreating">
      <form @submit.prevent="createProfit">
        <div class="grid grid-cols-1 gap-4">
          <!-- Item Type Select -->
          <div>
            <label for="item_type" class="block text-gray-700">Item Type <span class="text-red-500">*</span></label>
            <a-select v-model:value="newProfit.item_type" placeholder="Select Item Type" class="w-full" required>
              <a-select-option value="hotel">Hotel</a-select-option>
              <a-select-option value="transfer">Transfer</a-select-option>
              <a-select-option value="visa">Visa</a-select-option>
            </a-select>
            <p v-if="createErrors.item_type" class="text-red-500 text-sm mt-1">{{ createErrors.item_type[0] }}</p>
          </div>

          <!-- Percentage Markup -->
          <div>
            <label for="percentage_markup" class="block text-gray-700">Percentage Markup (%)<span
                class="text-red-500">*</span></label>
            <a-input-number v-model:value="newProfit.percentage_markup" :min="0" class="w-full" required />
            <p v-if="createErrors.percentage_markup" class="text-red-500 text-sm mt-1">{{
              createErrors.percentage_markup[0] }}</p>
          </div>

          <!-- Fixed Markup -->
          <div>
            <label for="fixed_markup" class="block text-gray-700">Fixed Markup<span
                class="text-red-500">*</span></label>
            <a-input-number v-model:value="newProfit.fixed_markup" :min="0" class="w-full" required />
            <p v-if="createErrors.fixed_markup" class="text-red-500 text-sm mt-1">{{ createErrors.fixed_markup[0] }}</p>
          </div>
          <p v-if="createErrors.general" class="text-red-500 text-sm mt-1">{{ createErrors.general }}</p>
        </div>
      </form>
    </a-modal>

    <!-- Update Profit Modal -->
    <a-modal v-model:open="updateModalVisible" title="Update Profit Entry" @ok="updateProfit"
      :confirm-loading="isUpdating">
      <form @submit.prevent="updateProfit">
        <div class="grid grid-cols-1 gap-4">
          <!-- Item Type Select -->
          <div>
            <label for="update_item_type" class="block text-gray-700">Item Type <span class="text-red-500">*</span></label>
            <a-select v-model:value="currentProfit.item_type" placeholder="Select Item Type" class="w-full" required>
              <a-select-option value="hotel">Hotel</a-select-option>
              <a-select-option value="transfer">Transfer</a-select-option>
              <a-select-option value="visa">Visa</a-select-option>
            </a-select>
            <p v-if="updateErrors.item_type" class="text-red-500 text-sm mt-1">{{ updateErrors.item_type[0] }}</p>
          </div>

          <!-- Percentage Markup -->
          <div>
            <label for="update_percentage_markup" class="block text-gray-700">Percentage Markup (%)<span class="text-red-500">*</span></label>
            <a-input-number v-model:value="currentProfit.percentage_markup" :min="0" class="w-full" required />
            <p v-if="updateErrors.percentage_markup" class="text-red-500 text-sm mt-1">{{
              updateErrors.percentage_markup[0] }}</p>
          </div>

          <!-- Fixed Markup -->
          <div>
            <label for="update_fixed_markup" class="block text-gray-700">Fixed Markup<span class="text-red-500">*</span></label>
            <a-input-number v-model:value="currentProfit.fixed_markup" :min="0" class="w-full" required />
            <p v-if="updateErrors.fixed_markup" class="text-red-500 text-sm mt-1">{{ updateErrors.fixed_markup[0] }}</p>
          </div>
<!--          <p v-if="updateErrors.general" class="text-red-500 text-sm mt-1">{{ updateErrors.general }}</p>-->
        </div>
      </form>
    </a-modal>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Modal, message } from 'ant-design-vue';
import { Icon } from '@iconify/vue';
import MainLayout from "@/components/layouts/mainLayout.vue";
import axios from 'axios';
import { apiBase } from '@/config';
import { getToken } from '@/utilities/common';


const createErrors = ref({});
const updateErrors = ref({});

// Profits data
const profits = ref([]);
const isProfitLoading = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);




const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);
const currPage = ref(1);
const from = ref(1);

// Fetch profits
const getProfits = async (page = 1) => {
  isProfitLoading.value = true;
  try {
    const res = await axios.get(`${apiBase}/profits?page=${page}&limit=${itemsPerPage.value}`, getToken());
    if (res.data) {
      profits.value = res.data.data.data;
      totalItems.value = res.data?.data?.total;
      currPage.value = res.data?.data?.current_page;
      from.value = res.data?.data?.from;
    }
  } catch (error) {
    console.error('Error fetching profits:', error);
    message.error('Failed to fetch profits');
  } finally {
    isProfitLoading.value = false;
  }
};



onMounted(() => {
  getProfits();
});

// Modal visibility states
const createModalVisible = ref(false);
const updateModalVisible = ref(false);

// Form data for profit creation
const newProfit = ref({
  item_type: 'hotel',
  percentage_markup: 0,
  fixed_markup: 0,
});

// Current profit for updating
const currentProfit = ref({
  id: null,
  item_type: '',
  percentage_markup: 0,
  fixed_markup: 0,
});

// Open Create Profit Modal
const showCreateModal = () => {
  newProfit.value = { item_type: 'hotel', percentage_markup: 0, fixed_markup: 0 };
  createModalVisible.value = true;
  createErrors.value = {};
};

// Create Profit
const createProfit = async () => {
  createErrors.value = {};
  isCreating.value = true;
  try {
    const response = await axios.post(`${apiBase}/profits`, newProfit.value, getToken());

    if (response.status === 201) {
      message.success('Profit created successfully');
      createModalVisible.value = false;
      getProfits(currentPage.value); // Refresh the current page
    }
  } catch (error) {
    if (error.response?.data?.errors) {
      // Handle validation errors
      createErrors.value = error.response.data.errors;
    } else if (error.response?.data?.message) {
      // Handle general error message
      createErrors.value.general = error.response.data.message;
    } else {
      createErrors.value.general = error.message;
    }
  } finally {
    isCreating.value = false;
  }
};

// Open Update Profit Modal
const showUpdateModal = (profit) => {
  currentProfit.value = { ...profit };
  updateModalVisible.value = true;
  updateErrors.value = {};
};

// Update Profit
const updateProfit = async () => {
  updateErrors.value = {};
  isUpdating.value = true;
  try {
    const response = await axios.put(
      `${apiBase}/profits/${currentProfit.value.id}`,
      currentProfit.value,
      getToken()
    );

    if (response.status === 200) {
      message.success('Profit updated successfully');
      updateModalVisible.value = false;
      getProfits(currentPage.value); // Refresh the current page
    }
  } catch (error) {
    updateErrors.value = {}; // reset

    if (error.response?.data?.errors) {
      // Standard validation errors
      updateErrors.value = error.response.data.errors;
    } else if (error.response?.data?.error) {
      // Map the single error message to the related field
      // If you know the field, assign to it
      if (error.response.data.error.toLowerCase().includes('percentage')) {
        updateErrors.value.percentage_markup = [error.response.data.error];
      } else if (error.response.data.error.toLowerCase().includes('fixed')) {
        updateErrors.value.fixed_markup = [error.response.data.error];
      } else if (error.response.data.error.toLowerCase().includes('item')) {
        updateErrors.value.item_type = [error.response.data.error];
      } else {
        // fallback
        updateErrors.value.general = error.response.data.error;
      }
    } else {
      updateErrors.value.general = error.message;
    }
  } finally {
    isUpdating.value = false;
  }
};

// Delete Profit
const deleteProfit = async (id) => {
  try {
    const response = await axios.delete(`${apiBase}/profits/${id}`, getToken());

    if (response.status === 200) {
      message.success('Profit deleted successfully');

      // Check if we need to go to the previous page
      if (profits.value.length === 1 && currentPage.value > 1) {
        getProfits(currentPage.value - 1);
      } else {
        getProfits(currentPage.value);
      }
    }
  } catch (error) {
    console.error('Error deleting profit:', error);
    message.error('Failed to delete profit');
  }
};
</script>

<style scoped>
/* Add any additional styles here */
</style>