<template>
  <MainLayout>
    <div class="overflow-x-auto bg-gray-50 min-h-screen">
      <!-- Header -->
      <div
          class="bg-gradient-to-r from-blue-600 to-indigo-800 via-purple-600 text-white py-12 mb-8 shadow-lg rounded-xl transform transition duration-500">
        <h1 class="text-4xl font-extrabold text-center">Quote Report</h1>
        <p class="text-center mt-3 opacity-90">Hajj Booking Management System</p>
      </div>

      <!-- Report Type Selection -->
      <div class="max-w-7xl mx-auto px-4 mb-8">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="flex items-center justify-between mb-6">
            <div class="w-64">
              <label for="supplier" class="block text-gray-700 font-bold mb-2">Customer</label>
              <a-select
                  id="supplier"
                  show-search
                  placeholder="Search Customer"
                  :filter-option="false"
                  :loading="isSupplierLoading"
                  :not-found-content="isSupplierLoading ? 'Loading...' : 'No supplier found'"
                  @search="handleSupplierSearch"
                  @change="onCustomerSelect"
                  class="w-full"
              >
                <a-select-option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                  {{ supplier.name }}
                </a-select-option>
              </a-select>
            </div>
          </div>
        </div>
      </div>

      <!-- Quote Report -->
      <div class="max-w-7xl mx-auto px-4">
        <div class="bg-white rounded-lg shadow-lg p-8">
          <!-- Quote Report Title -->
          <h2 class="text-2xl font-bold text-gray-800 mb-8">Quote Report</h2>

          <!-- Quote Table - Simplified Layout -->
          <div class="space-y-4">
            <table class="w-full text-sm table-auto border-collapse">
              <thead>
              <tr class="bg-gray-200 uppercase text-gray-800 font-bold">
                <th class="py-2 px-4">ROOM TYPE</th>
                <th class="py-2 px-4 text-right">MAKKAH</th>
                <th class="py-2 px-4 text-right">MADEENAH</th>
                <th class="py-2 px-4 text-right">TRANSFER</th>
                <th class="py-2 px-4 text-right">VISA</th>
                <th class="py-2 px-4 text-right">PROFIT</th>
                <th class="py-2 px-4 text-right">PP</th>
                <th class="py-2 px-4 text-center">PEOPLE</th>
                <th class="py-2 px-4 text-right">TOTAL</th>
                <th class="py-2 px-4 text-right">PP FINAL</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in dynamicQuoteData" :key="item.roomType" class="border-b">
                <td class="py-2 px-4 font-medium">{{ item.roomType.toUpperCase() }}</td>
                <td class="py-2 px-4 text-right">{{ item.makkah }}</td>
                <td class="py-2 px-4 text-right">{{ item.madeenah }}</td>
                <td class="py-2 px-4 text-right">{{ item.transfer }}</td>
                <td class="py-2 px-4 text-right">{{ item.visa }}</td>
                <td class="py-2 px-4 text-right">{{ item.profit }}</td>
                <td class="py-2 px-4 text-right">{{ item.pp }}</td>
                <td class="py-2 px-4 text-center">{{ item.people }}</td>
                <td class="py-2 px-4 text-right">{{ item.total }}</td>
                <td class="py-2 px-4 text-right">{{ item.ppFinal }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex justify-center space-x-4 pb-8">
<!--        <button-->
<!--            class="bg-blue-500 hover:bg-blue-600 flex items-center text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg">-->
<!--          <Icon icon="mdi:printer" class="mr-2" />-->
<!--          Print Report-->
<!--        </button>-->
<!--        <button-->
<!--            class="bg-green-500 hover:bg-green-600 flex items-center text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg">-->
<!--          <Icon icon="mdi:email" class="mr-2" />-->
<!--          Email Report-->
<!--        </button>-->
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import MainLayout from "@/components/layouts/mainLayout.vue";
import { apiBase } from '@/config';
import { getToken, showNotification } from '@/utilities/common';

const selectedCustomer = ref(null);
const suppliers = ref([]);
const isSupplierLoading = ref(false);

const onCustomerSelect = (customerId) => {
  selectedCustomer.value = customerId;
  fetchQuoteData(customerId);
};

const dynamicQuoteData = ref([]);
let supplierSearchTimeout;
const fetchQuoteData = async (customer_id) => {
  if (!customer_id) {
    dynamicQuoteData.value = [];
    return;
  }

  try {
    const res = await axios.get(`${apiBase}/quotes_report?customer_id=${customer_id}`, getToken());
    if (res.data.success && res.data.data.length) {
      dynamicQuoteData.value = res.data.data.flatMap(quote =>
          quote.items.map(item => {
            const roomRate = item.hotel.rates[0];
            const adults = parseInt(roomRate.adults) || 0;
            const children = parseInt(roomRate.children) || 0;
            const infant = parseInt(roomRate.infant) || 0;
            const fixedMarkup = parseFloat(quote.profits.fixed_markup) || 0;
            const ratePerNight = parseFloat(roomRate.rate_per_night) || 0;

            const peopleCount = adults + children + infant;
            const pp = ratePerNight + fixedMarkup;

            return {
              roomType: roomRate.room_type,
              makkah: ratePerNight.toFixed(2),
              madeenah: ratePerNight.toFixed(2),
              transfer: parseFloat(quote.transports.cost || 0).toFixed(2),
              visa: parseFloat(quote.visas.cost || 0).toFixed(2),
              profit: fixedMarkup.toFixed(2),
              pp: pp.toFixed(2),
              people: peopleCount,
              total: (ratePerNight).toFixed(2),
              ppFinal: (peopleCount > 0 ? (pp / peopleCount) : pp).toFixed(2)
            };
          })
      );
    } else {
      dynamicQuoteData.value = [];
    }
  } catch (error) {
    console.error(error);
    showNotification('Error fetching quote report', 'error');
  }
};

const handleSupplierSearch = (value) => {
  clearTimeout(supplierSearchTimeout);
  isSupplierLoading.value = true;
  supplierSearchTimeout = setTimeout(async () => {
    try {
      const res = await axios.get(`${apiBase}/customers?name=${encodeURIComponent(value)}`, getToken());
      suppliers.value = res.data.data.data;
    } catch (err) {
      console.error(err);
      showNotification('Failed to fetch customers', 'error');
    } finally {
      isSupplierLoading.value = false;
    }
  }, 500);
};
</script>


<style scoped>
/* Custom styles for better visual appeal */
.table-hover tbody tr:hover {
  background-color: #f8fafc;
}

/* Custom scrollbar */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive improvements */
@media (max-width: 768px) {
  .overflow-x-auto {
    font-size: 0.9rem;
  }

  .px-4 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  .py-3 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
}
</style>