<template>
  <MainLayout>
    <div class="overflow-x-auto bg-white rounded-lg shadow-md">
      <!-- Reservation Table -->
      <p class="text-2xl font-bold text-center py-8">Reservation Table</p>

      <!-- Create Button -->
      <div class="flex items-center justify-between m-4">
        <div class="w-56">
          <input type="search" placeholder="Search Researvation Reference" class="search_input" v-model="search"
            :disabled="loading" @input="onSearchInput" />
          <span v-if="loading" class="ml-2">Searching...</span>
        </div>
        <button @click="showCreateModal"
          class="px-4 flex items-center justify-end py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition feature-200">
          <Icon icon="mdi:plus-circle" class="mr-2" /> Create Reservation
        </button>
      </div>

      <!-- Table -->
      <table class="min-w-full table-auto shadow-lg rounded-lg overflow-hidden">
        <thead class="bg-gray-200">
          <tr>
<!--            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Supplier</th>-->
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Reservation Ref</th>
            <!-- <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Currency</th> -->
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Check-in</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Check-out</th>
<!--            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Notes</th>-->
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- Reservation Row Example -->
          <tr v-for="(reservation, index) in reservations" :key="index"
            :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'">
<!--            <td class="px-6 py-4 text-sm text-gray-800">{{ reservation?.supplier?.name || '-'}}</td>-->
            <td class="px-6 py-4 text-sm text-gray-800">{{ reservation?.reservation_ref || '-'}}</td>
            <!-- <td class="px-6 py-4 text-sm text-gray-800">{{ reservation?.quote?.currency || '-'}}</td> -->
            <td class="px-6 py-4 text-sm text-gray-800">{{ formatTime(reservation?.check_in) || '-'}}</td>
            <td class="px-6 py-4 text-sm text-gray-800">{{ formatTime(reservation?.check_out) || '-'}}</td>
<!--            <td class="px-6 py-4 text-sm text-gray-800">{{ truncateText(reservation?.notes, 30) || '-'}}</td>-->
            <td class="px-6 py-4 text-sm text-gray-800">
              <button @click="showUpdateModal(reservation)"
                class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400">
                <Icon icon="mdi:pencil-outline" class="w-5 h-5" />
              </button>
              <a-popconfirm title="Are you sure you want to delete this reservation?"
                @confirm="deleteReservation(reservation.id)" ok-text="Yes" cancel-text="No">
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
      @change="getReservations($event)" @showSizeChange="(current, pageSize) => (itemsPerPage = pageSize)" />


    <!-- Create Reservation Modal -->
    <a-modal v-model:open="createModalVisible" title="Create New Reservation" :afterClose="resetForm">
      <form @submit.prevent="createReservation">
        <div class="grid grid-cols-1 gap-4">
          <!-- Quote Select -->
<!--          <div>-->
<!--            <label for="quote" class="block text-gray-700">Quote <span class="text-red-500">*</span></label>-->
<!--            <a-select allowClear v-model:value="newReservation.quote_id" placeholder="Search and select quote"-->
<!--              class="w-full" show-search :filter-option="false"-->
<!--              :not-found-content="quoteSearchLoading ? 'Searching...' : 'No quotes found'" @search="handleQuoteSearch"-->
<!--              required>-->
<!--              <a-select-option v-for="quote in quotes" :key="quote.id" :value="quote.id">-->
<!--                {{ quote.name }}-->
<!--              </a-select-option>-->
<!--            </a-select>-->
<!--            <p v-if="createErrors.quote_id" class="text-red-500 text-sm mt-1">{{ createErrors.quote_id[0] }}</p>-->
<!--          </div>-->

          <!-- Supplier Select -->
<!--          <div>-->
<!--            <label for="supplier" class="block text-gray-700">Supplier<span class="text-red-500">*</span></label>-->
<!--            <a-select id="supplier" v-model:value="newReservation.supplier_id" show-search placeholder="Search Supplier"-->
<!--                      :filter-option="false" :loading="isSupplierLoading"-->
<!--                      :not-found-content="isSupplierLoading ? 'Loading...' : 'No supplier found'"-->
<!--                      @search="handleSupplierSearch" class="w-full">-->
<!--              <a-select-option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">-->
<!--                {{ supplier.name }}-->
<!--              </a-select-option>-->
<!--            </a-select>-->
<!--            <p v-if="createErrors.supplier_id" class="text-red-500 text-sm mt-1">{{ createErrors.supplier_id[0] }}</p>-->
<!--          </div>-->

          <!-- Reservation Ref Input -->
          <div>
            <label for="reservation_ref" class="block text-gray-700">Reservation Ref<span
                class="text-red-500">*</span></label>
            <a-input v-model:value="newReservation.reservation_ref" placeholder="Enter Reservation Ref" class="w-full"
              required />
            <p v-if="createErrors.reservation_ref" class="text-red-500 text-sm mt-1">{{ createErrors.reservation_ref[0]
              }}</p>
          </div>

          <!-- Check-in Date -->
          <div>
            <label for="check_in" class="block text-gray-700">Check-in<span class="text-red-500">*</span></label>
<!--            <a-date-picker v-model:value="newReservation.check_in" placeholder="Select Check-in Date" class="w-full"-->
<!--              required />-->
            <a-time-picker
                v-model:value="newReservation.check_in"
                placeholder="Select Check-in Time"
                class="w-full"
                format="h:mm A"
                required
            />
            <p v-if="createErrors.check_in" class="text-red-500 text-sm mt-1">{{ createErrors.check_in[0] }}</p>
          </div>

          <!-- Check-out Date -->
          <div>
            <label for="check_out" class="block text-gray-700">Check-out<span class="text-red-500">*</span></label>
<!--            <a-date-picker v-model:value="newReservation.check_out" placeholder="Select Check-out Date" class="w-full"-->
<!--              required />-->
            <a-time-picker
                v-model:value="newReservation.check_out"
                placeholder="Select Check-out Time"
                class="w-full"
                format="h:mm A"
                required
            />
            <p v-if="createErrors.check_out" class="text-red-500 text-sm mt-1">{{ createErrors.check_out[0] }}</p>
          </div>

          <!-- Notes Textarea -->
<!--          <div>-->
<!--            <label for="notes" class="block text-gray-700">Notes</label>-->
<!--            <a-textarea v-model:value="newReservation.notes" rows="4" class="w-full" />-->
<!--            <p v-if="createErrors.check_out" class="text-red-500 text-sm mt-1">{{ createErrors.notes[0] }}</p>-->
<!--          </div>-->
<!--          <p v-if="createErrors.general" class="text-red-500 text-sm mt-1">{{ createErrors.general }}</p>-->
        </div>
      </form>
      <template #footer>
        <a-button key="back" @click="createModalVisible = false">Cancel</a-button>
        <a-button key="submit" type="primary" :loading="isCreating" @click="createReservation">
          Create
        </a-button>
      </template>
    </a-modal>

    <!-- Update Reservation Modal -->
    <a-modal v-model:open="updateModalVisible" title="Update Reservation" :afterClose="resetCurrentReservation">
      <form @submit.prevent="updateReservation">
        <div class="grid grid-cols-1 gap-4">
          <!-- Quote Select -->
<!--          <div>-->
<!--            <label for="quote" class="block text-gray-700">Quote <span class="text-red-500">*</span></label>-->
<!--            <a-select allowClear v-model:value="currentReservation.quote_id" placeholder="Search and select quote"-->
<!--              class="w-full" show-search :filter-option="false"-->
<!--              :not-found-content="quoteSearchLoading ? 'Searching...' : 'No quotes found'" @search="handleQuoteSearch"-->
<!--              required>-->
<!--              <a-select-option v-for="quote in quotes" :key="quote.id" :value="quote.id">-->
<!--                {{ quote.name }}-->
<!--              </a-select-option>-->
<!--            </a-select>-->
<!--            <p v-if="updateErrors.quote_id" class="text-red-500 text-sm mt-1">{{ updateErrors.quote_id[0] }}</p>-->

<!--          </div>-->

          <!-- Supplier Select -->
<!--          <div>-->
<!--            <label for="supplier" class="block text-gray-700">Supplier <span class="text-red-500">*</span></label>-->
<!--            <a-select id="supplier" v-model:value="currentReservation.supplier_id" show-search placeholder="Search Supplier"-->
<!--                      :filter-option="false" :loading="isSupplierLoading"-->
<!--                      :not-found-content="isSupplierLoading ? 'Loading...' : 'No supplier found'"-->
<!--                      @search="handleSupplierSearch" class="w-full">-->
<!--              <a-select-option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">-->
<!--                {{ supplier.name }}-->
<!--              </a-select-option>-->
<!--            </a-select>-->
<!--            <p v-if="updateErrors.supplier_id" class="text-red-500 text-sm mt-1">{{ updateErrors.supplier_id[0] }}</p>-->

<!--          </div>-->

          <!-- Reservation Ref Input -->
          <div>
            <label for="update_reservation_ref" class="block text-gray-700">Reservation Ref <span class="text-red-500">*</span></label>
            <a-input v-model:value="currentReservation.reservation_ref" placeholder="Enter Reservation Ref"
              class="w-full" required />
            <p v-if="updateErrors.reservation_ref" class="text-red-500 text-sm mt-1">{{ updateErrors.reservation_ref[0]
              }}</p>
          </div>

          <!-- Check-in Date -->
          <div>
            <label for="update_check_in" class="block text-gray-700">Check-in <span class="text-red-500">*</span></label>
<!--            <a-date-picker v-model:value="currentReservation.check_in" placeholder="Select Check-in Date" class="w-full"-->
<!--              required />-->
            <a-time-picker
                v-model:value="currentReservation.check_in"
                placeholder="Select Check-in Time"
                class="w-full"
                format="h:mm A"
                required
            />
            <p v-if="updateErrors.check_in" class="text-red-500 text-sm mt-1">{{ updateErrors.check_in[0] }}</p>

          </div>

          <!-- Check-out Date -->
          <div>
            <label for="update_check_out" class="block text-gray-700">Check-out <span class="text-red-500">*</span></label>
<!--            <a-date-picker v-model:value="currentReservation.check_out" placeholder="Select Check-out Date"-->
<!--              class="w-full" required />-->
            <a-time-picker
                v-model:value="currentReservation.check_out"
                placeholder="Select Check-out Time"
                class="w-full"
                format="h:mm A"
                required
            />
            <p v-if="updateErrors.check_out" class="text-red-500 text-sm mt-1">{{ updateErrors.check_out[0] }}</p>

          </div>

          <!-- Notes Textarea -->
<!--          <div>-->
<!--            <label for="update_notes" class="block text-gray-700">Notes</label>-->
<!--            <a-textarea v-model:value="currentReservation.notes" rows="4" class="w-full" />-->
<!--            <p v-if="updateErrors.check_out" class="text-red-500 text-sm mt-1">{{ updateErrors.notes[0] }}</p>-->

<!--          </div>-->
<!--          <p v-if="updateErrors.general" class="text-red-500 text-sm mt-1">{{ updateErrors.general }}</p>-->
        </div>
      </form>
      <template #footer>
        <a-button key="back" @click="updateModalVisible = false">Cancel</a-button>
        <a-button key="submit" type="primary" :loading="isUpdating" @click="updateReservation">
          Update
        </a-button>
      </template>
    </a-modal>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Icon } from '@iconify/vue';
import MainLayout from "@/components/layouts/mainLayout.vue";
import axios from 'axios';
import { apiBase } from '@/config';
import { getToken, showNotification } from '@/utilities/common';
import dayjs from 'dayjs';
import {message, Modal} from 'ant-design-vue';

// Reservations data
const reservations = ref([]);
const totalPages = ref(1);

const isreservationsLoading = ref(false);
const createModalVisible = ref(false);
const updateModalVisible = ref(false);

const loading = ref(false);

const createErrors = ref({});
const updateErrors = ref({});


const search = ref('');
let searchTimeout = null;
const onSearchInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1; // Reset to first page when searching
    getReservations(1);
  }, 400); // 400ms debounce
};


const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);
const currPage = ref(1);
const from = ref(1);

// const getReservations = async (page = 1) => {
//   isreservationsLoading.value = true;
//   try {
//     const res = await axios.get(`${apiBase}/reservations?page=${page}&per_page=${pageSize.value}`, getToken());
//     if (res.data) {
//       reservations.value = res.data.data.data;
//       totalPages.value = res.data.data.last_page;
//       currentPage.value = res.data.data.current_page;
//     }
//   } catch (error) {
//     console.error(error);
//     showNotification('error', 'Failed to fetch reservations', error.message);
//   } finally {
//     isreservationsLoading.value = false;
//   }
// };
const getReservations = async (page = 1) => {
  isreservationsLoading.value = true;
  try {
    // Build the base URL
    let url = `${apiBase}/reservations?page=${page}&limit=${itemsPerPage.value}`;

    // Add search parameter if it exists
    if (search.value) {
      url += `&search=${encodeURIComponent(search.value)}`;
    }

    const res = await axios.get(url, getToken());

    if (res.data) {
      reservations.value = res.data.data.data;
      totalItems.value = res.data?.data?.total;
      currPage.value = res.data?.data?.current_page;
      from.value = res.data?.data?.from;
      isreservationsLoading.value = false;
    }
  } catch (error) {
    console.error(error);
  } finally {
    isreservationsLoading.value = false;
  }
};


// Suppliers data
const isSupplierLoading = ref(false);
const suppliers = ref([]);
const supplierSearchLoading = ref(false);
const supplierSearchQuery = ref('');
const getSuppliers = async (query = '') => {
  isSupplierLoading.value = true;
  try {
    const res = await axios.get(
        `${apiBase}/suppliers?name=${encodeURIComponent(query)}`,
        getToken()
    );
    if (res.data && res.data.data) {
      suppliers.value = res.data.data.data;
    }
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    showNotification('error', 'Failed to fetch suppliers', error.message);
  } finally {
    isSupplierLoading.value = false;
  }
};

// Quotes data
const quotes = ref([]);
const isQuoteLoading = ref(false);
const quoteSearchLoading = ref(false);
const quoteSearchQuery = ref('');

const getQuotes = async (query = '') => {
  isQuoteLoading.value = true;
  quoteSearchLoading.value = true;
  try {
    const res = await axios.get(`${apiBase}/quotes?search=${encodeURIComponent(query)}`, getToken());
    console.log("Quotes Response:", res.data);
    if (res.data) {
      quotes.value = res.data.data.data;
    }
  } catch (error) {
    console.error(error);
    showNotification('error', 'Failed to fetch quotes', error.message);
  } finally {
    quoteSearchLoading.value = false;
    isQuoteLoading.value = false;
  }
};

// Form data for reservation creation
const newReservation = ref({
  // quote_id: '',
  // supplier_id: '',
  reservation_ref: '',
  check_in: null,
  check_out: null,
  // notes: '',
});

const resetForm = () => {
  newReservation.value = {
    // quote_id: '',
    // supplier_id: '',
    reservation_ref: '',
    check_in: '',
    check_out: '',
    // notes: '',
  };
};

const isCreating = ref(false)
const createReservation = async () => {
  isCreating.value = true;
  createErrors.value = {};
  try {
    const payload = {
      ...newReservation.value,
      // check_in: newReservation.value.check_in ? dayjs(newReservation.value.check_in).format('YYYY-MM-DD') : null,
      // check_out: newReservation.value.check_out ? dayjs(newReservation.value.check_out).format('YYYY-MM-DD') : null
      check_in: newReservation.value.check_in
          ? dayjs(newReservation.value.check_in).format('HH:mm')
          : null,
      check_out: newReservation.value.check_out
          ? dayjs(newReservation.value.check_out).format('HH:mm')
          : null,
    };

    const res = await axios.post(`${apiBase}/reservations`, payload, getToken());

    if (res.data.success) {
      createModalVisible.value = false;
      getReservations(currentPage.value);
      resetForm();
      // message.success('Reservation created successfully');
      Modal.success({
        title: 'Success',
        content: 'Reservation created successfully!',
      });
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

// Open Create Reservation Modal
const showCreateModal = () => {
  resetForm();
  createModalVisible.value = true;
  createErrors.value = {};
};

// Search handlers with debounce
let supplierSearchTimeout = null;
const handleSupplierSearch = (value) => {
  console.log("Supplier Search Query:", value);
  clearTimeout(supplierSearchTimeout);
  supplierSearchLoading.value = true;
  supplierSearchQuery.value = value;

  supplierSearchTimeout = setTimeout(() => {
    getSuppliers(value);
  }, 500);
};

let quoteSearchTimeout = null;
const handleQuoteSearch = (value) => {
  console.log("Quote Search Query:", value);
  clearTimeout(quoteSearchTimeout);
  quoteSearchLoading.value = true;
  quoteSearchQuery.value = value;

  quoteSearchTimeout = setTimeout(() => {
    getQuotes(value);
  }, 500);
};



// Current reservation for updating
const currentReservation = ref({
  id: '',
  // quote_id: '',
  // supplier_id: '',
  reservation_ref: '',
  check_in: null,
  check_out: null,
  // notes: '',
});

const resetCurrentReservation = () => {
  currentReservation.value = {
    id: '',
    // quote_id: '',
    // supplier_id: '',
    reservation_ref: '',
    check_in: '',
    check_out: '',
    // notes: '',
  };
};

// Open Update Reservation Modal
const showUpdateModal = (reservation) => {
  currentReservation.value = {
    ...reservation,
    quote_id: reservation.quote?.id || '',
    supplier_id: reservation.supplier?.id || '',
    // check_in: reservation.check_in ? dayjs(reservation.check_in) : null,
    // check_out: reservation.check_out ? dayjs(reservation.check_out) : null
    check_in: reservation.check_in ? dayjs(reservation.check_in, 'HH:mm') : null,
    check_out: reservation.check_out ? dayjs(reservation.check_out, 'HH:mm') : null,
  };
  updateModalVisible.value = true;
  updateErrors.value = {};
};

// Update Reservation
const isUpdating = ref(false);
const updateReservation = async () => {
  isUpdating.value = true;
  updateErrors.value = {};
  try {
    const payload = {
      ...currentReservation.value,
      // check_in: currentReservation.value.check_in ? dayjs(currentReservation.value.check_in).format('YYYY-MM-DD') : null,
      // check_out: currentReservation.value.check_out ? dayjs(currentReservation.value.check_out).format('YYYY-MM-DD') : null
      check_in: currentReservation.value.check_in
          ? dayjs(currentReservation.value.check_in).format('HH:mm')
          : null,
      check_out: currentReservation.value.check_out
          ? dayjs(currentReservation.value.check_out).format('HH:mm')
          : null,
    };

    const res = await axios.put(`${apiBase}/reservations/${currentReservation.value.id}`, payload, getToken());

    if (res.data.success) {
      updateModalVisible.value = false;
      getReservations(currentPage.value);
      // message.success('Reservation updated successfully');
      Modal.success({
        title: 'Success',
        content: 'Reservation updated successfully!',
      });
    }
  } catch (error) {
    if (error.response?.data?.errors) {
      updateErrors.value = error.response.data.errors;
    } else if (error.response?.data?.error?.includes("reservation_ref")) {
      updateErrors.value = { reservation_ref: ["Reservation ref is required."] };
    }  else if (error.response?.data?.error?.includes("check_in")) {
      updateErrors.value = { check_in: ["Check in is required."] };
    }  else if (error.response?.data?.error?.includes("check_out")) {
      updateErrors.value = { check_out: ["Check out is required."] };
    }else if (error.response?.data?.message) {
      updateErrors.value = { general: error.response.data.message };
    } else {
      updateErrors.value = { general: error.message };
    }
  } finally {
    isUpdating.value = false;
  }
};

// Delete Reservation
const deleteReservation = async (id) => {
  try {
    const res = await axios.delete(`${apiBase}/reservations/${id}`, getToken());

    if (res.data.success) {
      getReservations(currentPage.value);
      message.success('Reservation deleted successfully');
    }
  } catch (error) {
    console.error(error);
    showNotification('error', 'Failed to delete reservation', error.message);
  }
};

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return dayjs(dateString).format('MMM DD, YYYY');
};

const formatTime = (timeString) => {
  if (!timeString) return '-';
  return dayjs(timeString, 'HH:mm').format('h:mm A');
};
const truncateText = (text, maxLength) => {
  if (!text) return '-';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};



onMounted(() => {
  getReservations();
  getSuppliers();
  getQuotes();
});
</script>

<style scoped>
/* Add any additional styles here */
</style>