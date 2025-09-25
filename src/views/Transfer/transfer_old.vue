<template>
  <MainLayout>
    <div class="overflow-x-auto bg-white rounded-lg shadow-md">
      <!-- Transfer Table -->
      <p class="text-2xl font-bold text-center py-8">Transfer Table</p>

      <!-- Create Button -->
      <div class="flex items-center justify-between m-4">
        <div>
          <input type="search" placeholder="Search transfer" class="search_input" v-model="search" :disabled="loading"
            @input="onSearchInput" />
          <span v-if="loading" class="ml-2">Searching...</span>
        </div>
        <button @click="showCreateModal"
          class="px-4 flex items-center justify-end py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition feature-200">
          <Icon icon="mdi:plus-circle" class="mr-2" /> Create Transfer
        </button>
      </div>

      <div v-if="isTransferLoading" class="p-8 text-center">
        <a-spin size="large" />
      </div>

      <!-- Table -->
      <table v-else class="min-w-full table-auto shadow-lg rounded-lg overflow-hidden">
        <thead class="bg-gray-200">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Vehicle Name</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Capacity - (People)</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Capacity - (Bag)</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Form Location</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">To Location</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">rate</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(transfer, index) in transferlist" :key="index"
            :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'">
            <td class="px-6 py-4 text-sm text-gray-800">{{ transfer.transport.name }}</td>
            <td class="px-6 py-4 text-sm text-gray-800">{{ transfer.capacity_people }}</td>
            <td class="px-6 py-4 text-sm text-gray-800">{{ transfer.capacity_bags }}</td>
            <td class="px-6 py-4 text-sm text-gray-800">{{ transfer.from_location }}</td>
            <td class="px-6 py-4 text-sm text-gray-800">{{ transfer.to_location }}</td>
            <td class="px-6 py-4 text-sm text-gray-800">{{ transfer.rate }}</td>
            <td class="px-6 py-4 text-sm text-wrap text-gray-800 max-w-lg overflow-hidden"
              style="white-space: normal; text-overflow: ellipsis;">
              {{ transfer.description }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-800">
              <div class="flex items-center justify-center">
                <button @click="showUpdateModal(transfer)"
                  class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400">
                  <Icon icon="mdi:pencil-outline" class="w-5 h-5" />
                </button>
                <a-popconfirm title="Are you sure you want to delete this transfer?"
                  @confirm="deleteTransfer(transfer.id)" ok-text="Yes" cancel-text="No">
                  <button
                    class="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400">
                    <Icon icon="mdi:delete-outline" class="w-5 h-5" />
                  </button>
                </a-popconfirm>
              </div>
            </td>
          </tr>
        </tbody>
      </table>


    </div>
    <a-pagination class="p-4" v-model:current="currPage" v-model:page-size="itemsPerPage" :total="totalItems"
      :showSizeChanger="true" :showQuickJumper="false" :show-total="(total) => `Total ${total} items`"
      @change="getTransfer($event)" @showSizeChange="(current, pageSize) => (itemsPerPage = pageSize)" />

    <!-- Create Transfer Modal -->
    <a-modal v-model:visible="createModalVisible" width="1000px" title="Create New Transfer" @ok="createTransfer"
      :confirm-loading="isTransferLoading">
      <div class="h-[500px] overflow-auto">
        <form @submit.prevent="createTransfer">
          <div class="grid grid-cols-1 gap-4">
            <!-- Vehicle Name Input -->
            <div>
              <label for="vehicle_name" class="block text-gray-700">Vehicle Name</label>
              <a-input v-model:value="newTransfer.vehicle_name" placeholder="Enter Vehicle Name" class="w-full"
                required />
            </div>

            <!-- Capacity Input -->
            <div>
              <label for="capacity" class="block text-gray-700">Capacity - (People)</label>
              <a-input-number v-model:value="newTransfer.capacity_people" :min="1" class="w-full" required />
            </div>

            <!-- Capacity - Bag Input -->
            <div>
              <label for="capacity_bag" class="block text-gray-700">Capacity - (Bag)</label>
              <a-input-number v-model:value="newTransfer.capacity_bags" :min="0" class="w-full" required />
            </div>

            <!-- Description Textarea -->
            <div>
              <label for="description" class="block text-gray-700">Description</label>
              <a-textarea v-model:value="newTransfer.description" rows="4" class="w-full" />
            </div>
          </div>
          <!-- Rates section -->
          <div class="mt-6">
            <h3 class="text-lg font-semibold mb-4">Transfer Rates</h3>


            <div v-for="(rate, index) in newTransfer.rates" :key="index">
              <div class="flex items-end relative">
                <button v-if="newTransfer.rates.length > 1" @click="removeTransferRate(index)" type="button"
                  class="text-red-500 hover:text-red-700 absolute top-6 right-2">
                  <Icon icon="mdi:close-circle" class="w-6 h-6" />
                </button>
              </div>
              <div class="grid grid-cols-2 gap-4 mt-4 p-4 border rounded-md pt-8">
                <div>
                  <label class="block text-gray-700">From Location</label>
                  <a-input v-model:value="rate.from_location" type="text" class="w-full" required />
                </div>
                <div>
                  <label class="block text-gray-700">To Location</label>
                  <a-input v-model:value="rate.to_location" type="text" class="w-full" required />
                </div>
                <div>
                  <label class="block text-gray-700">Rate</label>
                  <a-input-number v-model:value="rate.rate" type="text" class="w-full" required />
                </div>
                <div>
                  <label class="block text-gray-700">Currency</label>
                  <a-select v-model:value="rate.currency" class="w-full" required>
                    <a-select-option value="usd">USD</a-select-option>
                    <a-select-option value="eur">EUR</a-select-option>
                    <a-select-option value="gbp">GBP</a-select-option>
                  </a-select>
                </div>
                <div>
                  <label class="block text-gray-700">Valid Until</label>
                  <a-date-picker v-model:value="rate.valid_until" class="w-full" :disabled-date="disabledDate"
                    format="YYYY-MM-DD" required />
                </div>

                <!-- <div class="flex items-end relative">
                <button v-if="newTransfer.rates.length > 1" @click="removeTransferRate(index)" type="button"
                  class="text-red-500 hover:text-red-700 absolute top-6 right-2">
                  <Icon icon="mdi:close-circle" class="w-6 h-6" />
                </button>
              </div> -->
              </div>
            </div>
          </div>
          <div class="mt-4 w-full">
            <a-button type="dashed" @click="addTransferRate">Add Rate</a-button>
          </div>
        </form>
      </div>
      <template #footer>
        <a-button key="back" @click="createModalVisible = false">Cancel</a-button>
        <a-button key="submit" type="primary" :loading="isTransferLoading" @click="createTransfer">Submit</a-button>
      </template>
    </a-modal>

    <!-- Update Transfer Modal -->
    <a-modal v-model:visible="updateModalVisible" width="1000px" title="Update Transfer" @ok="updateTransfer"
      :confirm-loading="isTransferLoading">
      <div class="h-[500px] overflow-auto">
        <form @submit.prevent="updateTransfer">
          <div class="grid grid-cols-1 gap-4">
            <!-- Vehicle Name Input -->
            <div>
              <label for="update_vehicle_name" class="block text-gray-700">Vehicle Name</label>
              <a-input v-model:value="currentTransfer.vehicle_name" placeholder="Enter Vehicle Name" class="w-full"
                required />
            </div>

            <!-- Capacity Input -->
            <div>
              <label for="update_capacity" class="block text-gray-700">Capacity - (People)</label>
              <a-input-number v-model:value="currentTransfer.capacity_people" :min="1" class="w-full" required />
            </div>

            <!-- Capacity - Bag Input -->
            <div>
              <label for="update_capacity_bag" class="block text-gray-700">Capacity - (Bag)</label>
              <a-input-number v-model:value="currentTransfer.capacity_bags" :min="0" class="w-full" required />
            </div>

            <!-- Description Textarea -->
            <div>
              <label for="update_description" class="block text-gray-700">Description</label>
              <a-textarea v-model:value="currentTransfer.description" rows="4" class="w-full" />
            </div>
          </div>
          <!-- Rates section for update -->
          <div class="mt-6">

            <h3 class="text-lg font-semibold mb-4">Transfer Rates</h3>
            <div v-for="(rate, index) in currentTransfer.rates" :key="index" class="">
              <div class="flex items-end relative">
                <button v-if="currentTransfer.rates.length > 1" @click="removeUpdateTransferRate(index)" type="button"
                  class="text-red-500 hover:text-red-700 absolute top-6 right-2">
                  <Icon icon="mdi:close-circle" class="w-6 h-6" />
                </button>
              </div>

              <div class="grid grid-cols-2 gap-4 mt-4 p-4 border rounded-md pt-8">

                <!-- <button v-if="newHotel.rates.length > 1" @click="removeRate(index)"
                class="absolute top-2 right-2 text-red-500 hover:text-red-700" type="button">
                <Icon icon="mdi:close-circle" class="w-6 h-6" />
              </button> -->
                <div>
                  <label class="block text-gray-700">From Location</label>
                  <a-input v-model:value="rate.from_location" type="text" class="w-full" required />
                </div>
                <div>
                  <label class="block text-gray-700">To Location</label>
                  <a-input v-model:value="rate.to_location" type="text" class="w-full" required />
                </div>
                <div>
                  <label class="block text-gray-700">Rate</label>
                  <a-input-number v-model:value="rate.rate" type="text" class="w-full" required />
                </div>
                <div>
                  <label class="block text-gray-700">Currency</label>
                  <a-select v-model:value="rate.currency" class="w-full" required>
                    <a-select-option value="usd">USD</a-select-option>
                    <a-select-option value="eur">EUR</a-select-option>
                    <a-select-option value="gbp">GBP</a-select-option>
                  </a-select>
                </div>
                <div>
                  <label class="block text-gray-700">Valid Until</label>
                  <a-date-picker v-model:value="rate.valid_until" class="w-full" :disabled-date="disabledDate"
                    format="YYYY-MM-DD" required />
                </div>

              </div>
            </div>
          </div>
          <div class="mt-4 w-full">
            <a-button type="dashed" @click="addUpdateTransferRate">Add Rate</a-button>
          </div>
        </form>
      </div>
      <template #footer>
        <a-button key="back" @click="updateModalVisible = false">Cancel</a-button>
        <a-button key="submit" type="primary" :loading="isTransferLoading" @click="updateTransfer">Submit</a-button>
      </template>
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
import dayjs from 'dayjs';

// Transfer data
const transferlist = ref([]);
const isTransferLoading = ref(false);

// Modal visibility states
const createModalVisible = ref(false);
const updateModalVisible = ref(false);

const totalPages = ref(1);    // Track total number of pages
const pageSize = ref(10);     // Number of items per page

// Form data refs
const newTransfer = ref({
  vehicle_name: '',
  capacity_people: 0,
  capacity_bags: 0,
  description: '',
  rates: [
    {
      from_location: '',
      to_location: '',
      rate: 0,
      currency: 'usd',
      valid_until: dayjs().add(1, 'month')
    }
  ]
});

const currentTransfer = ref({
  id: null,
  vehicle_name: '',
  capacity_people: 0,
  capacity_bags: 0,
  description: '',
  rates: []
});


const createErrors = ref({});
const updateErrors = ref({});

const search = ref('');
let searchTimeout = null;
const onSearchInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1; // Reset to first page when searching
    getTransfer(1);
  }, 400); // 400ms debounce
};



const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);
const currPage = ref(1);
const from = ref(1);

const getTransfer = async (page = 1) => {
  isTransferLoading.value = true;
  try {
    // Build the base URL
    let url = `${apiBase}/transfers?page=${page}&limit=${itemsPerPage.value}`;

    // Add search parameter if it exists
    if (search.value) {
      url += `&search=${encodeURIComponent(search.value)}`;
    }

    const res = await axios.get(url, getToken());

    if (res.data) {
      transferlist.value = res.data.data.data;
      totalItems.value = res.data?.data?.total;
      currPage.value = res.data?.data?.current_page;
      from.value = res.data?.data?.from;
    }
  } catch (error) {
    console.error(error);
    showNotification('error', 'Failed to fetch transfers', error.message);
  } finally {
    isTransferLoading.value = false;
  }
};

// Pagination Logic
const goToPage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    getTransfer(page);
  }
};

const totalPagesArray = computed(() => {
  return Array.from({ length: totalPages.value }, (_, index) => index + 1);
});

// Open Create Transfer Modal
const showCreateModal = () => {
  newTransfer.value = {
    vehicle_name: '',
    capacity_people: 0,
    capacity_bags: 0,
    description: '',
    rates: [
      {
        from_location: '',
        to_location: '',
        rate: 0,
        currency: 'usd',
        valid_until: dayjs().add(1, 'month')
      }
    ]
  };
  createModalVisible.value = true;
};

// Open Update Transfer Modal
const showUpdateModal = (transfer) => {
  // Convert string dates to Day.js objects
  const formattedRates = transfer.rates ? transfer.rates.map(rate => ({
    ...rate,
    valid_until: rate.valid_until ? dayjs(rate.valid_until) : dayjs().add(1, 'month')
  })) : [
    {
      from_location: '',
      to_location: '',
      rate: 0,
      currency: 'usd',
      valid_until: dayjs().add(1, 'month')
    }
  ];

  currentTransfer.value = {
    ...transfer,
    rates: formattedRates
  };
  updateModalVisible.value = true;
};
// Add transfer rate row
const addTransferRate = () => {
  newTransfer.value.rates.push({
    from_location: '',
    to_location: '',
    rate: 0,
    currency: 'usd',
    valid_until: dayjs().add(1, 'month')
  });
};

// Add transfer rate row for update modal
const addUpdateTransferRate = () => {
  currentTransfer.value.rates.push({
    from_location: '',
    to_location: '',
    rate: 0,
    currency: 'usd',
    valid_until: dayjs().add(1, 'month')
  });
};

// Remove transfer rate row
const removeTransferRate = (index) => {
  newTransfer.value.rates.splice(index, 1);
};

// Remove transfer rate row for update modal
const removeUpdateTransferRate = async (index) => {
  currentTransfer.value.rates.splice(index, 1);
};

// Disable past dates in date picker
const disabledDate = (current) => {
  // Can not select days before today
  return current && current < dayjs().startOf('day');
};

// Create Transfer
// Create Transfer - Updated
const createTransfer = async () => {
  try {
    // Format the data before sending
    const formattedData = {
      ...newTransfer.value,
      rates: JSON.stringify(newTransfer.value.rates.map(rate => ({
        ...rate,
        valid_until: dayjs(rate.valid_until).format('YYYY-MM-DD')
      })))
    };

    const res = await axios.post(`${apiBase}/transfers`, formattedData, getToken());
    if (res.data) {
      await getTransfer(); // Refresh the list
      createModalVisible.value = false;
      showNotification('success', 'Transfer created successfully');
    }
  } catch (error) {
    console.error(error);
    showNotification('error', 'Failed to create transfer', error.message);
  }
};

// Update Transfer - Updated
// Update Transfer - Updated
// Update Transfer - Fixed to handle rate deletions
const updateTransfer = async () => {
  try {
    // Get the original transfer to compare rates
    const originalTransfer = transferlist.value.find(t => t.id === currentTransfer.value.id);

    // Find rates that were removed (exist in original but not in current)
    const ratesToDelete = originalTransfer.rates.filter(originalRate =>
      !currentTransfer.value.rates.some(currentRate =>
        currentRate.id === originalRate.id
      )
    );

    // Delete removed rates first
    for (const rate of ratesToDelete) {
      if (rate.id) { // Only delete rates that have an ID (exist in DB)
        await axios.delete(`${apiBase}/transfer-rates/${rate.id}`, getToken());
      }
    }

    // Format the remaining rates for update
    const formattedData = {
      ...currentTransfer.value,
      rates: JSON.stringify(currentTransfer.value.rates.map(rate => ({
        ...rate,
        valid_until: dayjs(rate.valid_until).format('YYYY-MM-DD')
      })))
    };

    // Update the transfer with remaining rates
    const res = await axios.put(
      `${apiBase}/transfers/${currentTransfer.value.id}`,
      formattedData,
      getToken()
    );

    if (res.data) {
      await getTransfer(); // Refresh the list
      updateModalVisible.value = false;
      showNotification('success', 'Transfer updated successfully');
    }
  } catch (error) {
    console.error(error);
    showNotification('error', 'Failed to update transfer', error.message);
  }
};

// Delete Transfer
const deleteTransfer = async (id) => {
  try {
    const res = await axios.delete(`${apiBase}/transfers/${id}`, getToken());
    if (res.data) {
      await getTransfer(); // Refresh the list
      showNotification('success', 'Transfer deleted successfully');
    }
  } catch (error) {
    console.error(error);
    showNotification('error', 'Failed to delete transfer', error.message);
  }
};

onMounted(async () => {
  await getTransfer();
});
</script>

<style scoped>
.text-wrap {
  white-space: normal;
}
</style>