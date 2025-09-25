<template>
  <MainLayout>
    <div class="overflow-x-auto bg-white rounded-lg shadow-md">
      <!-- Transfer Table -->
      <p class="text-2xl font-bold text-center py-8">Transport Package List</p>

      <!-- Create Button -->
      <div class="flex items-center justify-between m-4">
        <div>
          <input type="search" placeholder="Search transfer" class="search_input" v-model="search" :disabled="loading"
            @input="onSearchInput" />
          <span v-if="loading" class="ml-2">Searching...</span>
        </div>
        <button @click="showCreateModal"
          class="px-4 flex items-center justify-end py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition feature-200">
          <Icon icon="mdi:plus-circle" class="mr-2" /> Add New Transport Package
        </button>
      </div>

      <div v-if="isTransferLoading" class="p-8 text-center">
        <a-spin size="large" />
      </div>

      <!-- Table -->
      <table v-if="transferlist.length" class="min-w-full table-auto shadow-lg rounded-lg overflow-hidden">
        <!-- Table Header -->
        <thead class="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">
          <tr class="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700  text-white">
            <th class="p-4 text-left font-semibold text-xl border" rowspan="2">Actions</th>
            <th class="p-4 text-left font-semibold text-xl border" rowspan="2">Vehicles</th>
            <th class="p-4 text-center font-semibold text-xl border" :colspan="vehicleNames?.length">Transportation
              Prices</th>
          </tr>
          <tr class="bg-blue-500 text-white">
            <th v-for="vehicle in vehicleNames" :key="vehicle" class="p-3 text-center font-medium">
              {{ vehicle }}
            </th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody>
          <tr v-for="route in uniqueRoutes" :key="route.key" class="bg-gray-50 hover:bg-gray-100 transition-colors">
            <td class="p-4 font-medium text-gray-700 border">
<!--              <button @click="showUpdateModal(getTransferByRoute(route.from, route.to))"-->
<!--                class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400">-->
<!--                <Icon icon="mdi:pencil-outline" class="w-5 h-5" />-->
<!--              </button>-->
              <a-popconfirm title="Are you sure you want to delete this transport entry?"
                @confirm="deleteTransfer(getTransferByRoute(route.from, route.to).id)" ok-text="Yes" cancel-text="No">
                <button
                  class="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400">
                  <Icon icon="mdi:delete-outline" class="w-5 h-5" />
                </button>
              </a-popconfirm>
            </td>
            <td class="p-4 font-medium text-gray-700 border">
              {{ route.from }} - {{ route.to }}
            </td>
            <td v-for="vehicle in vehicleNames" :key="vehicle" class="p-4 text-center text-gray-800 border">
              {{ getRate(route.from, route.to, vehicle) }}
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="text-center p-8">No transport packages available.</p>
    </div>
    <a-pagination class="p-4" v-model:current="currPage" v-model:page-size="itemsPerPage" :total="totalItems"
      :showSizeChanger="true" :showQuickJumper="false" :show-total="(total) => `Total ${total} items`"
      @change="getTransfer($event)" @showSizeChange="(current, pageSize) => (itemsPerPage = pageSize)" />

    <!-- Create Transfer Modal -->
    <a-modal v-model:open="createModalVisible" width="1000px" title="Create New Transfer" @ok="createTransfer"
      :confirm-loading="isTransferLoading">
      <div class="h-[250px] overflow-auto">
        <form @submit.prevent="createTransfer">
          <div>
            <div class="grid grid-cols-2 gap-4">

              <!-- From Location Select -->
              <div>
                <label for="from_location" class="block text-gray-700">From Location <span
                    class="text-red-500">*</span></label>
                <a-select allow-clear v-model:value="newTransfer.from_location" arrow show-search
                  placeholder="Search and select location" class="w-full" :filter-option="false"
                  :not-found-content="locationSearchLoading ? 'Searching...' : 'No locations found'"
                  @search="handleLocationSearch" required>
                  <a-select-option v-for="location in locations" :key="location.id" :value="location.id">
                    {{ location.name }}
                  </a-select-option>
                </a-select>
                <p v-if="createErrors.from_location" class="text-red-500 text-sm mt-1">{{ createErrors.from_location[0]
                }}
                </p>
              </div>
              <!-- To Location Select -->
              <div>
                <label for="to_location" class="block text-gray-700">To Location <span
                    class="text-red-500">*</span></label>
                <a-select allow-clear v-model:value="newTransfer.to_location" arrow show-search
                  placeholder="Search and select location" class="w-full" :filter-option="false"
                  :not-found-content="locationSearchLoading ? 'Searching...' : 'No locations found'"
                  @search="handleLocationSearch" required>
                  <a-select-option v-for="location in locations" :key="location.id" :value="location.id">
                    {{ location.name }}
                  </a-select-option>
                </a-select>
                <p v-if="createErrors.to_location" class="text-red-500 text-sm mt-1">{{ createErrors.to_location[0] }}
                </p>
              </div>

              <div class="col-span-2 flex items-center space-x-2">
                <a-checkbox v-model:checked="newTransfer.vice_versa" :true-value="1" :false-value="0">
                  Vice Versa (Both Directions)
                </a-checkbox>
              </div>

              <!-- Transport ID Select -->
              <div>
                <label for="transport_id" class="block text-gray-700">Transport <span
                    class="text-red-500">*</span></label>
                <a-select v-model:value="newTransfer.transport_id" arrow show-search
                  placeholder="Search and select transport" class="w-full" :filter-option="false"
                  :not-found-content="transportSearchLoading ? 'Searching...' : 'No transports found'"
                  @search="handleTransportSearch" required>
                  <a-select-option v-for="transport in transports" :key="transport.id" :value="transport.id">
                    {{ transport.name }}
                  </a-select-option>
                </a-select>
                <p v-if="createErrors.transport_id" class="text-red-500 text-sm mt-1">{{ createErrors.transport_id[0] }}
                </p>
              </div>

              <!-- Rate Input -->
              <div>
                <label for="rate" class="block text-gray-700">Rate <span class="text-red-500">*</span></label>
                <a-input-number type="number" v-model:value="newTransfer.rate" :min="1" class="w-full" required />
                <p v-if="createErrors.rate" class="text-red-500 text-sm mt-1">{{ createErrors.rate[0] }}</p>
              </div>

              <!-- Capacity - People Input -->
<!--              <div>-->
<!--                <label for="capacity_people" class="block text-gray-700">Capacity - (People) <span-->
<!--                    class="text-red-500">*</span></label>-->
<!--                <a-input-number type="number" v-model:value="newTransfer.capacity_people" :min="1" class="w-full"-->
<!--                  required />-->
<!--                <p v-if="createErrors.capacity_people" class="text-red-500 text-sm mt-1">{{-->
<!--                  createErrors.capacity_people[0] }}</p>-->
<!--              </div>-->

<!--              &lt;!&ndash; Capacity - Bags Input &ndash;&gt;-->
<!--              <div>-->
<!--                <label for="capacity_bags" type="number" class="block text-gray-700">Capacity - (Bags) <span-->
<!--                    class="text-red-500">*</span></label>-->
<!--                <a-input-number v-model:value="newTransfer.capacity_bags" :min="0" class="w-full" required />-->
<!--                <p v-if="createErrors.capacity_bags" class="text-red-500 text-sm mt-1">{{ createErrors.capacity_bags[0]-->
<!--                }}</p>-->
<!--              </div>-->
              <!-- date form -->
              <div>
                <label for="period_from" class="block text-gray-700">Period From <span
                    class="text-red-500">*</span></label>
                <a-date-picker v-model:value="newTransfer.period_from" class="w-full" required />
                <p v-if="createErrors.period_from" class="text-red-500 text-sm mt-1">{{ createErrors.period_from[0] }}
                </p>
              </div>
              <!-- date to -->

              <div>
                <label for="period_till" class="block text-gray-700">Period Till <span
                    class="text-red-500">*</span></label>
                <a-date-picker v-model:value="newTransfer.period_till" class="w-full" required />
                <p v-if="createErrors.period_till" class="text-red-500 text-sm mt-1">{{ createErrors.period_till[0] }}
                </p>
              </div>


            </div>

            <!-- Description Textarea -->
<!--            <div class="mt-4">-->
<!--              <label for="description" class="block text-gray-700">Description</label>-->
<!--              <a-textarea v-model:value="newTransfer.description" rows="4" class="w-full" />-->
<!--            </div>-->
          </div>
          <p v-if="createErrors.general" class="text-red-500 text-sm mt-1">{{ createErrors.general }}</p>
        </form>
      </div>

      <template #footer>
        <a-button key="back" @click="createModalVisible = false">Cancel</a-button>
        <a-button key="submit" type="primary" :loading="isTransferLoading" @click="createTransfer">Submit</a-button>
      </template>
    </a-modal>


    <!-- Update Transfer Modal -->
    <a-modal v-model:open="updateModalVisible" width="1000px" title="Update Transfer" @ok="updateTransfer"
      :confirm-loading="isTransferLoading">
      <div class="h-[300px] overflow-auto">
        <form @submit.prevent="updateTransfer">
          <div>
            <div class="grid grid-cols-2 gap-4">

              <!-- From Location Select -->
              <div>
                <label for="from_location" class="block text-gray-700">From Location <span
                    class="text-red-500">*</span></label>
                <a-select allow-clear v-model:value="currentTransfer.from_location" arrow show-search
                  placeholder="Search and select location" class="w-full" :filter-option="false"
                  :not-found-content="locationSearchLoading ? 'Searching...' : 'No locations found'"
                  @search="handleLocationSearch" required>
                  <a-select-option v-for="location in locations" :key="location.id" :value="location.id">
                    {{ location.name }}
                  </a-select-option>
                </a-select>
                <p v-if="updateErrors.from_location" class="text-red-500 text-sm mt-1">{{ updateErrors.from_location[0]
                }}
                </p>
              </div>

              <!-- To Location Select -->
              <div>
                <label for="to_location" class="block text-gray-700">To Location <span
                    class="text-red-500">*</span></label>
                <a-select allow-clear v-model:value="currentTransfer.to_location" arrow show-search
                  placeholder="Search and select location" class="w-full" :filter-option="false"
                  :not-found-content="locationSearchLoading ? 'Searching...' : 'No locations found'"
                  @search="handleLocationSearch" required>
                  <a-select-option v-for="location in locations" :key="location.id" :value="location.id">
                    {{ location.name }}
                  </a-select-option>
                </a-select>
                <p v-if="updateErrors.to_location" class="text-red-500 text-sm mt-1">{{ updateErrors.to_location[0] }}
                </p>
              </div>

              <!-- Transport ID Select -->
              <div>
                <label for="transport_id" class="block text-gray-700">Transport <span
                    class="text-red-500">*</span></label>
                <a-select v-model:value="currentTransfer.transport_id" arrow show-search
                  placeholder="Search and select transport" class="w-full" :filter-option="false"
                  :not-found-content="transportSearchLoading ? 'Searching...' : 'No transports found'"
                  @search="handleTransportSearch" required>
                  <a-select-option v-for="transport in transports" :key="transport.id" :value="transport.id">
                    {{ transport.name }}
                  </a-select-option>
                </a-select>
                <p v-if="updateErrors.transport_id" class="text-red-500 text-sm mt-1">{{ updateErrors.transport_id[0] }}
                </p>
              </div>

              <!-- Rate Input -->
              <div>
                <label for="rate" class="block text-gray-700">Rate <span class="text-red-500">*</span></label>
                <a-input-number type="number" v-model:value="currentTransfer.rate" :min="1" class="w-full" required />
                <p v-if="updateErrors.rate" class="text-red-500 text-sm mt-1">{{ updateErrors.rate[0] }}</p>
              </div>

              <!-- Capacity - People Input -->
              <div>
                <label for="capacity_people" class="block text-gray-700">Capacity - (People) <span
                    class="text-red-500">*</span></label>
                <a-input-number type="number" v-model:value="currentTransfer.capacity_people" :min="1" class="w-full"
                  required />
                <p v-if="updateErrors.capacity_people" class="text-red-500 text-sm mt-1">{{
                  updateErrors.capacity_people[0]
                }}</p>
              </div>

              <!-- Capacity - Bags Input -->
              <div>
                <label for="capacity_bags" class="block text-gray-700">Capacity - (Bags) <span
                    class="text-red-500">*</span></label>
                <a-input-number type="number" v-model:value="currentTransfer.capacity_bags" :min="0" class="w-full"
                  required />
                <p v-if="updateErrors.capacity_bags" class="text-red-500 text-sm mt-1">{{ updateErrors.capacity_bags[0]
                }}
                </p>
              </div>

              <!-- date form -->
              <div>
                <label for="period_from" class="block text-gray-700">Period From <span
                    class="text-red-500">*</span></label>
                <a-date-picker v-model:value="currentTransfer.period_from" class="w-full" required />
                <p v-if="updateErrors.period_from" class="text-red-500 text-sm mt-1">{{ updateErrors.period_from[0] }}
                </p>
              </div>
              <!-- date to -->

              <div>
                <label for="period_till" class="block text-gray-700">Period Till <span
                    class="text-red-500">*</span></label>
                <a-date-picker v-model:value="currentTransfer.period_till" class="w-full" required />
                <p v-if="updateErrors.period_till" class="text-red-500 text-sm mt-1">{{ updateErrors.period_till[0] }}
                </p>
              </div>

            </div>

            <!-- Description Textarea -->
            <div class="mt-4">
              <label for="description" class="block text-gray-700">Description</label>
              <a-textarea v-model:value="currentTransfer.description" rows="4" class="w-full" />
            </div>
          </div>
          <p v-if="updateErrors.general" class="text-red-500 text-sm mt-1">{{ updateErrors.general }}</p>
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
import { Modal } from "ant-design-vue";

// Transfer data
const transferlist = ref([]);
const isTransferLoading = ref(false);
const loading = ref(false);

// Modal visibility states
const createModalVisible = ref(false);
const updateModalVisible = ref(false);

const totalPages = ref(1);
const locations = ref([]);
const locationSearchLoading = ref(false);

// Form data refs
const newTransfer = ref({
  transport_id: '',
  from_location: '',
  to_location: '',
  rate: 0,
  capacity_people: 0,
  capacity_bags: 0,
  period_from: '',
  period_till: '',
  description: '',
  vice_versa: 0,
});

const currentTransfer = ref({
  id: '',
  transport_id: '',
  from_location: '',
  to_location: '',
  rate: '',
  capacity_people: '',
  capacity_bags: '',
  period_from: '',
  period_till: '',
  description: '',
});

const createErrors = ref({});
const updateErrors = ref({});

const search = ref('');
let searchTimeout = null;
const onSearchInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    getTransfer(1);
  }, 400);
};

const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);
const currPage = ref(1);
const from = ref(1);

// -------------------------
// DYNAMIC TABLE HELPERS
// -------------------------
const vehicleNames = computed(() => {
  return [...new Set(transferlist.value.map(t => t.transport.name))];
});

const uniqueRoutes = computed(() => {
  const map = {};
  transferlist.value.forEach(t => {
    const key = `${t.from_location.name}-${t.to_location.name}`;
    if (!map[key]) {
      map[key] = {
        key,
        from: t.from_location.name,
        to: t.to_location.name,
      };
    }
  });
  return Object.values(map);
});

const getRate = (from, to, vehicle) => {
  const pkg = transferlist.value.find(
    t => t.from_location.name === from &&
      t.to_location.name === to &&
      t.transport.name === vehicle
  );
  return pkg ? pkg.rate : "-";
};

// Helper to get transfer by route
const getTransferByRoute = (from, to) => {
  return transferlist.value.find(
    t => t.from_location.name === from && t.to_location.name === to
  );
};

// -------------------------
// API CALLS
// -------------------------
const getTransfer = async (page = 1) => {
  isTransferLoading.value = true;
  try {
    let url = `${apiBase}/transport_packages?page=${page}&limit=${itemsPerPage.value}`;
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

// -------------------------
// LOCATION SEARCH
// -------------------------
let locationSearchTimeout = null;
const handleLocationSearch = (value) => {
  clearTimeout(locationSearchTimeout);
  locationSearchLoading.value = true;
  locationSearchTimeout = setTimeout(() => {
    getLocations(value);
  }, 500);
};

const getLocations = async (query = '') => {
  try {
    const res = await axios.get(
      `${apiBase}/locations?search=${encodeURIComponent(query)}`,
      getToken()
    );
    if (res.data) locations.value = res.data.data.data;
  } catch (error) {
    console.error('Error fetching locations:', error);
  } finally {
    locationSearchLoading.value = false;
  }
};

// -------------------------
// TRANSPORT SEARCH
// -------------------------
const transports = ref([]);
const transportSearchLoading = ref(false);
let transportSearchTimeout = null;

const handleTransportSearch = (value) => {
  clearTimeout(transportSearchTimeout);
  transportSearchLoading.value = true;
  transportSearchTimeout = setTimeout(() => {
    getTransports(value);
  }, 500);
};

const getTransports = async (query = '') => {
  try {
    const res = await axios.get(
      `${apiBase}/transports?search=${encodeURIComponent(query)}`,
      getToken()
    );
    if (res.data) transports.value = res.data.data.data;
  } catch (error) {
    console.error('Error fetching transports:', error);
  } finally {
    transportSearchLoading.value = false;
  }
};

// -------------------------
// MODAL HANDLERS
// -------------------------
const showCreateModal = () => {
  newTransfer.value = {
    transport_id: '',
    from_location: '',
    to_location: '',
    rate: 0,
    capacity_people: 0,
    capacity_bags: 0,
    period_from: '',
    period_till: '',
    description: '',
  };
  createModalVisible.value = true;
  createErrors.value = {};
};

const showUpdateModal = (transfer) => {
  if (!transfer) return;

  currentTransfer.value = {
    id: transfer.id,
    transport_id: transfer.transport_id,
    from_location: transfer.from_location.id,
    to_location: transfer.to_location.id,
    rate: transfer.rate,
    capacity_people: transfer.capacity_people,
    capacity_bags: transfer.capacity_bags,
    period_from: transfer.period_from ? dayjs(transfer.period_from) : null,
    period_till: transfer.period_till ? dayjs(transfer.period_till) : null,
    description: transfer.description || '',
  };
  updateModalVisible.value = true;
  updateErrors.value = {};
};

// -------------------------
// CREATE / UPDATE / DELETE
// -------------------------
const createTransfer = async () => {
  createErrors.value = {};
  try {
    // Format dates using dayjs before sending
    const payload = {
      ...newTransfer.value,
      period_from: newTransfer.value.period_from ? dayjs(newTransfer.value.period_from).format('YYYY-MM-DD') : null,
      period_till: newTransfer.value.period_till ? dayjs(newTransfer.value.period_till).format('YYYY-MM-DD') : null,
    };

    const res = await axios.post(`${apiBase}/transport_packages`, payload, getToken());
    if (res.data) {
      await getTransfer();
      createModalVisible.value = false;
      Modal.success({ title: 'Success', content: 'Transfer created successfully!' });
    }
  } catch (error) {
    if (error.response?.data?.errors) createErrors.value = error.response.data.errors;
    else if (error.response?.data?.message) createErrors.value.general = error.response.data.message;
    else createErrors.value.general = error.message;
  }
};

const updateTransfer = async () => {
  updateErrors.value = {};
  try {
    // Format dates using dayjs before sending
    const payload = {
      ...currentTransfer.value,
      period_from: currentTransfer.value.period_from ? dayjs(currentTransfer.value.period_from).format('YYYY-MM-DD') : null,
      period_till: currentTransfer.value.period_till ? dayjs(currentTransfer.value.period_till).format('YYYY-MM-DD') : null,
    };

    const res = await axios.put(
      `${apiBase}/transport_packages/${currentTransfer.value.id}`,
      payload,
      getToken()
    );
    if (res.data) {
      await getTransfer();
      updateModalVisible.value = false;
      Modal.success({ title: 'Success', content: 'Transfer updated successfully!' });
    }
  } catch (error) {
    if (error.response?.data?.errors) updateErrors.value = error.response.data.errors;
    else if (error.response?.data?.message) updateErrors.value.general = error.response.data.message;
    else updateErrors.value.general = error.message;
  }
};

const deleteTransfer = async (id) => {
  try {
    const res = await axios.delete(`${apiBase}/transport_packages/${id}`, getToken());
    if (res.data) {
      await getTransfer();
      showNotification('success', 'Transfer deleted successfully');
    }
  } catch (error) {
    console.error(error);
    showNotification('error', 'Failed to delete transfer', error.message);
  }
};

// -------------------------
// MOUNT
// -------------------------
onMounted(async () => {
  await getTransfer();
  getLocations();
  getTransports();
});
</script>

<style scoped>
.text-wrap {
  white-space: normal;
}
</style>