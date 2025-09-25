<template>
  <MainLayout>
    <div class="overflow-x-auto bg-white rounded-lg shadow-md">
      <!-- Transport Table -->
      <p class="text-2xl font-bold text-center py-8">Transport Table</p>

      <!-- Create Button -->
      <div class="flex items-center justify-between m-4">
        <div>
          <input type="search" placeholder="Search Transport" class="search_input" v-model="search" :disabled="loading"
            @input="onSearchInput" />
          <span v-if="loading" class="ml-2">Searching...</span>
        </div>
        <button @click="showCreateModal"
          class="px-4 flex items-center justify-end py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition feature-200">
          <Icon icon="mdi:plus-circle" class="mr-2" /> Create Transport Entry
        </button>
      </div>

      <!-- Table with Loader -->
      <div class="relative">
        <!-- Loader -->
        <div v-if="isTransportLoading"
          class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <a-spin size="large" />
        </div>

        <table class="min-w-full table-auto shadow-lg rounded-lg overflow-hidden">
          <thead class="bg-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Address</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Latitude</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Longitude</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Transport Row Example -->
            <tr v-for="(transport, index) in locations" :key="index"
              :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'">
              <td class="px-6 py-4 text-sm text-gray-800">{{ transport.name }}</td>
              <td class="px-6 py-4 text-sm text-gray-800">{{ transport.address }}</td>
              <td class="px-6 py-4 text-sm text-gray-800">{{ transport.latitude }}</td>
              <td class="px-6 py-4 text-sm text-gray-800">{{ transport.longitude }}</td>
              <td class="px-6 py-4 text-sm text-gray-800">
                <button @click="showUpdateModal(transport)"
                  class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400">
                  <Icon icon="mdi:pencil-outline" class="w-5 h-5" />
                </button>
                <a-popconfirm title="Are you sure you want to delete this transport entry?"
                  @confirm="deleteTransport(transport.id)" ok-text="Yes" cancel-text="No">
                  <button
                    class="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400">
                    <Icon icon="mdi:delete-outline" class="w-5 h-5" />
                  </button>
                </a-popconfirm>
              </td>
            </tr>

            <!-- Empty state -->
            <tr v-if="!isTransportLoading && locations.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                No transport entries found
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
    <a-pagination class="p-4" v-model:current="currPage" v-model:page-size="itemsPerPage" :total="totalItems"
      :showSizeChanger="true" :showQuickJumper="false" :show-total="(total) => `Total ${total} items`"
      @change="getLocations($event)" @showSizeChange="(current, pageSize) => (itemsPerPage = pageSize)" />

    <!-- Create Transport Modal -->
    <a-modal v-model:visible="createModalVisible" title="Create New Transport Entry" @ok="createQuote"
      :confirm-loading="isCreating">
      <form @submit.prevent="createQuote">
        <div class="grid grid-cols-1 gap-4">
          <!-- Name Input -->
          <div>
            <label for="name" class="block text-gray-700">Name <span class="text-red-500">*</span></label>
            <a-input id="name" v-model:value="newLocation.name" type="text" class="w-full p-2 border rounded-md"
              required />
            <p v-if="createErrors.name" class="text-red-500 text-sm mt-1">{{ createErrors.name[0] }}</p>
          </div>
          <div>
            <label for="address" class="block text-gray-700">Address </label>
            <a-input id="address" v-model:value="newLocation.address" type="text" class="w-full p-2 border rounded-md"
              required />
            <p v-if="createErrors.address" class="text-red-500 text-sm mt-1">{{ createErrors.address[0] }}</p>
          </div>
          <div>
            <label for="latitude" class="block text-gray-700">Latitude</label>
            <a-input id="latitude" v-model:value="newLocation.latitude" type="text" class="w-full p-2 border rounded-md"
              required />
            <p v-if="createErrors.latitude" class="text-red-500 text-sm mt-1">{{ createErrors.latitude[0] }}</p>
          </div>
          <div>
            <label for="longitude" class="block text-gray-700">Longitude </label>
            <a-input id="longitude" v-model:value="newLocation.longitude" type="text"
              class="w-full p-2 border rounded-md" required />
            <p v-if="createErrors.longitude" class="text-red-500 text-sm mt-1">{{ createErrors.longitude[0] }}</p>
          </div>
     
          <!-- General error message -->
          <p v-if="createErrors.general" class="text-red-500 text-sm mt-1">{{ createErrors.general }}</p>
        </div>
      </form>
    </a-modal>

    <!-- Update Transport Modal -->
    <a-modal v-model:visible="updateModalVisible" title="Update Transport Entry" @ok="updateTransport"
      :confirm-loading="isUpdating">
      <form @submit.prevent="updateTransport">
        <div class="grid grid-cols-1 gap-4">
          <!-- Name Input -->
          <div>
            <label for="update_name" class="block text-gray-700">Name <span class="text-red-500">*</span></label>
            <a-input id="update_name" v-model:value="currentLocation.name" type="text"
              class="w-full p-2 border rounded-md" required />
            <p v-if="updateErrors.name" class="text-red-500 text-sm mt-1">{{ updateErrors.name[0] }}</p>
          </div>
          <div>
            <label for="update_address" class="block text-gray-700">Address </label>
            <a-input id="update_address" v-model:value="currentLocation.address" type="text"
              class="w-full p-2 border rounded-md" required />
            <p v-if="updateErrors.address" class="text-red-500 text-sm mt-1">{{ updateErrors.address[0] }}</p>
          </div>
          <div>
            <label for="update_latitude" class="block text-gray-700">Latitude </label>
            <a-input id="update_latitude" v-model:value="currentLocation.latitude" type="text"
              class="w-full p-2 border rounded-md" required />
            <p v-if="updateErrors.latitude" class="text-red-500 text-sm mt-1">{{ updateErrors.latitude[0] }}</p>
          </div>
          <div>
            <label for="update_longitude" class="block text-gray-700">Longitude </label>
            <a-input id="update_longitude" v-model:value="currentLocation.longitude" type="text"
              class="w-full p-2 border rounded-md" required />
            <p v-if="updateErrors.longitude" class="text-red-500 text-sm mt-1">{{ updateErrors.longitude[0] }}</p>
          </div>

          <!-- General error message -->
          <p v-if="updateErrors.general" class="text-red-500 text-sm mt-1">{{ updateErrors.general }}</p>
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

// Transport data
const locations = ref([]);
const isTransportLoading = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);
const isDeleting = ref(false);

const createErrors = ref({});
const updateErrors = ref({});

const search = ref('');
let searchTimeout = null;
const onSearchInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1; // Reset to first page when searching
    getLocations(1);
  }, 400); // 400ms debounce
};



const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);
const currPage = ref(1);
const from = ref(1);

// Fetch locations
const getLocations = async (page = 1) => {
  isTransportLoading.value = true;
  try {
    // Build the base URL
    let url = `${apiBase}/locations?page=${page}&limit=${itemsPerPage.value}`;

    // Add search parameter if it exists
    if (search.value) {
      url += `&search=${encodeURIComponent(search.value)}`;
    }

    const res = await axios.get(url, getToken());

    if (res.data) {
      locations.value = res.data.data.data;
      totalItems.value = res.data?.data?.total;
      currPage.value = res.data?.data?.current_page;
      from.value = res.data?.data?.from;
    }
  } catch (error) {
    console.error(error);
  } finally {
    isTransportLoading.value = false;
  }
};

onMounted(() => {
  getLocations();
});

// Modal visibility states
const createModalVisible = ref(false);
const updateModalVisible = ref(false);

// Form data for location creation
const newLocation = ref({
  name: '',
  address: '',
  latitude: '',
  longitude: '',
});

// Current location for updating
const currentLocation = ref({
  name: '',
  address: '',
  latitude: '',
  longitude: '',
});

// Open Create Transport Modal
const showCreateModal = () => {
  createErrors.value = {}; // Clear previous errors
  createModalVisible.value = true;
};

// Open Update Transport Modal
const showUpdateModal = (transport) => {
  updateErrors.value = {}; // Clear previous errors
  currentLocation.value = { ...transport };
  updateModalVisible.value = true;
};

// Create transport
const createQuote = async () => {
  createErrors.value = {};
  isCreating.value = true;
  try {
    const res = await axios.post(`${apiBase}/locations`, newLocation.value, getToken());
    if (res.data) {
      createModalVisible.value = false;
      newLocation.value.name = ''; // Reset form
      await getLocations(); // Refresh the list
      showNotification('success', 'Success', 'Location created successfully');
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

// Update transport
const updateTransport = async () => {
  updateErrors.value = {};
  isUpdating.value = true;
  try {
    const res = await axios.put(`${apiBase}/locations/${currentLocation.value.id}`, currentLocation.value, getToken());
    if (res.data) {
      updateModalVisible.value = false;
      await getLocations(); // Refresh the list
      showNotification('success', 'Success', 'Transport updated successfully');
    }
  } catch (error) {
    if (error.response?.data?.errors) {
      // Handle validation errors
      updateErrors.value = error.response.data.errors;
    } else if (error.response?.data?.message) {
      // Handle general error message
      updateErrors.value.general = error.response.data.message;
    } else {
      updateErrors.value.general = error.message;
    }
  } finally {
    isUpdating.value = false;
  }
};

// Delete transport
const deleteTransport = async (id) => {
  isDeleting.value = true;
  try {
    await axios.delete(`${apiBase}/locations/${id}`, getToken());
    await getLocations(); // Refresh the list
    showNotification('success', 'Success', 'Location deleted successfully');
  } catch (error) {
    console.error(error);
    showNotification('error', 'Failed', 'Failed to delete location');
  } finally {
    isDeleting.value = false;
  }
};
</script>

<style scoped>
/* Add any additional styles here */
</style>