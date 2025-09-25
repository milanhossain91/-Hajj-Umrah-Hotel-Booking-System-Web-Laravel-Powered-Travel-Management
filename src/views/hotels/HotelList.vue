<template>
  <MainLayout>
    <div class="overflow-x-auto bg-white rounded-lg shadow-md">
      <!-- Hotel List -->
      <p class="text-2xl font-bold text-center py-8">Hotel List</p>

      <!-- Create Button -->
      <div class="flex items-center justify-between m-4">
        <div class="flex-1 max-w-xs">
          <input type="search" placeholder="Search" class="search_input" v-model="search" :disabled="isHotelLoading"
                 @input="onSearchInput" />
        </div>
        <button @click="showCreateModal"
                class="px-4 flex items-center justify-end py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition feature-200">
          <Icon icon="mdi:plus-circle" class="mr-2" /> Add New Hotel
        </button>
      </div>

      <!-- Table -->
      <table class="min-w-full table-auto shadow-lg rounded-lg overflow-hidden">
        <thead class="bg-gray-200">
        <tr>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">City</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Address</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(hotel, index) in hotels" :key="hotel.id"
            :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'">
          <td class="px-6 py-4 text-sm text-gray-800">{{ hotel?.name || '-'}}</td>
          <td class="px-6 py-4 text-sm text-gray-800">{{ hotel?.email || '-'}}</td>
          <td class="px-6 py-4 text-sm text-gray-800">{{ hotel?.contact_number || '-'}}</td>
          <td class="px-6 py-4 text-sm text-gray-800">{{ hotel?.city || '-'}}</td>
          <td class="px-6 py-4 text-sm text-gray-800">{{ hotel?.address || '-'}}</td>
          <td class="px-6 py-4 text-sm text-gray-800">
            <button @click="showUpdateModal(hotel)"
                    class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400">
              <Icon icon="mdi:pencil-outline" class="w-5 h-5" />
            </button>
            <a-popconfirm title="Are you sure you want to delete this hotel?"
                          @confirm="deleteHotel(hotel.id)" ok-text="Yes" cancel-text="No">
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
                  @change="getHotels($event)" @showSizeChange="(current, pageSize) => (itemsPerPage = pageSize)" />

    <!-- Create Hotel Modal -->
    <a-modal v-model:open="createModalVisible" title="Add New Hotel" @ok="createHotel">
      <form @submit.prevent="createHotel">
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label>Name <span class="text-red-500">*</span></label>
            <input v-model="newHotel.name" type="text" class="w-full p-2 border rounded-md" required />
            <p v-if="createErrors.name" class="text-red-500 text-sm mt-1">{{ createErrors.name }}</p>
          </div>
          <div><label>City  <span class="text-red-500">*</span></label>
            <input v-model="newHotel.city" type="text" class="w-full p-2 border rounded-md" />
            <p v-if="createErrors.city" class="text-red-500 text-sm mt-1">{{ createErrors.city }}</p>
          </div>
          <div><label>Email</label><input v-model="newHotel.email" type="email" class="w-full p-2 border rounded-md" /></div>
          <div><label>Phone</label><input v-model="newHotel.contact_number" type="text" class="w-full p-2 border rounded-md" /></div>
          <div><label>Address</label><input v-model="newHotel.address" type="text" class="w-full p-2 border rounded-md" /></div>
          <div><label>Rating</label><input v-model="newHotel.rating" type="text" class="w-full p-2 border rounded-md" /></div>
          <div><label>Website</label><input v-model="newHotel.website" type="text" class="w-full p-2 border rounded-md" /></div>
          <div><label>Description</label><textarea v-model="newHotel.description" class="w-full p-2 border rounded-md" rows="3"></textarea></div>
        </div>
      </form>
    </a-modal>

    <!-- Update Hotel Modal -->
    <a-modal v-model:open="updateModalVisible" title="Update Hotel" @ok="updateHotel">
      <form @submit.prevent="updateHotel">
        <div class="grid grid-cols-1 gap-4">
          <div><label>Name <span class="text-red-500">*</span></label>
            <input v-model="currentHotel.name" type="text" class="w-full p-2 border rounded-md" required />
            <p v-if="updateErrors.name" class="text-red-500 text-sm mt-1">{{ updateErrors.name }}</p>

          </div>
          <div><label>City <span class="text-red-500">*</span></label>
            <input v-model="currentHotel.city" type="text" class="w-full p-2 border rounded-md" />
            <p v-if="updateErrors.city" class="text-red-500 text-sm mt-1">{{ updateErrors.city }}</p>
          </div>

          <div><label>Email</label><input v-model="currentHotel.email" type="email" class="w-full p-2 border rounded-md" /></div>
          <div><label>Phone</label><input v-model="currentHotel.contact_number" type="text" class="w-full p-2 border rounded-md" /></div>
          <div><label>Address</label><input v-model="currentHotel.address" type="text" class="w-full p-2 border rounded-md" /></div>
          <div><label>Rating</label><input v-model="currentHotel.rating" type="text" class="w-full p-2 border rounded-md" /></div>
          <div><label>Website</label><input v-model="currentHotel.website" type="text" class="w-full p-2 border rounded-md" /></div>
          <div><label>Description</label><textarea v-model="currentHotel.description" class="w-full p-2 border rounded-md" rows="3"></textarea></div>
        </div>
      </form>
    </a-modal>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import MainLayout from "@/components/layouts/mainLayout.vue";
import axios from 'axios';
import { apiBase } from '@/config';
import { getToken, showNotification } from '@/utilities/common';

const hotels = ref([]);
const createModalVisible = ref(false);
const updateModalVisible = ref(false);
const isHotelLoading = ref(false);
const search = ref('');

const createErrors = ref({});
const updateErrors = ref({});
const itemsPerPage = ref(10);
const totalItems = ref(0);
const currPage = ref(1);

const getHotels = async (page = 1) => {
  isHotelLoading.value = true;
  try {
    let url = `${apiBase}/hotels?page=${page}&limit=${itemsPerPage.value}`;
    if (search.value) url += `&search=${encodeURIComponent(search.value)}`;
    const res = await axios.get(url, getToken());
    if (res.data) {
      hotels.value = res.data.data.data;
      totalItems.value = res.data.data.total;
      currPage.value = res.data.data.current_page;
    }
  } catch (error) {
    console.error(error);
    showNotification('error', 'Failed to fetch hotels', error.message);
  } finally {
    isHotelLoading.value = false;
  }
};

let searchTimeout = null;
const onSearchInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    getHotels(1);
  }, 400);
};

onMounted(() => {
  getHotels();
});

const newHotel = ref({
  name: '', email: '', contact_number: '', city: '', address: '',
  rating: '', description: '', website: ''
});

const currentHotel = ref({
  id: null, name: '', email: '', contact_number: '', city: '', address: '',
  rating: '', description: '', website: ''
});

const showCreateModal = () => {
  newHotel.value = { name: '', email: '', contact_number: '', city: '', address: '', rating: '', description: '', website: '' };
  createErrors.value = {};
  createModalVisible.value = true;
};

const showUpdateModal = (hotel) => {
  currentHotel.value = { ...hotel };
  updateErrors.value = {};
  updateModalVisible.value = true;
};

// Create Hotel
const createHotel = async () => {
  createErrors.value = {};
  try {
    const res = await axios.post(`${apiBase}/hotels`, newHotel.value, getToken());
    if (res.data) {
      hotels.value.push(res.data.data);
      showNotification('success', 'Hotel Created', 'The hotel was successfully created.');
      createModalVisible.value = false;
    }
  } catch (error) {
    const apiErrors = error.response?.data?.errors || error.response?.data?.error;
    if (apiErrors) {
      // Flatten arrays if API returns ["message"]
      Object.keys(apiErrors).forEach(key => {
        createErrors.value[key] = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : apiErrors[key];
      });
    } else {
      showNotification('error', 'Failed', error.message);
    }
  }
};


// Update Hotel
const updateHotel = async () => {
  updateErrors.value = {};
  try {
    const res = await axios.put(`${apiBase}/hotels/${currentHotel.value.id}`, currentHotel.value, getToken());
    if (res.data) {
      const index = hotels.value.findIndex(h => h.id === currentHotel.value.id);
      if (index !== -1) hotels.value[index] = { ...currentHotel.value };

      showNotification('success', 'Hotel Updated', 'The hotel was successfully updated.');
      updateModalVisible.value = false;
    }
  } catch (error) {
    const apiErrors = error.response?.data?.errors || error.response?.data?.error;
    if (apiErrors) {
      Object.keys(apiErrors).forEach(key => {
        updateErrors.value[key] = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : apiErrors[key];
      });
    } else {
      showNotification('error', 'Failed', error.message);
    }
  }
};


const isDeleting = ref(false);
const deleteHotel = async (id) => {
  isDeleting.value = true;
  try {
    const response =  await axios.delete(`${apiBase}/hotels/${id}`, getToken());
    if (response.status === 200 || response.status === 204) {
      showNotification('success', 'Hotel deleted', 'The hotel was successfully deleted.');
      await getHotels();
    } else {
      showNotification('error', 'Failed to delete hotel', 'Unexpected response from server.');
    }
  } catch (error) {
    console.error(error);
    const errorMessage = error.response?.data?.message || error.message || 'Something went wrong';
    showNotification('error', 'Failed to delete hotel', errorMessage);
  } finally {
    isDeleting.value = false;
  }
};
</script>
