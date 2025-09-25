<template>
  <MainLayout>
    <div class="overflow-x-auto bg-gray-50 min-h-screen">
      <!-- Header -->
      <div>
<!--          class="bg-gradient-to-r from-blue-600 to-indigo-800 via-purple-600 text-white py-12 mb-8 shadow-lg rounded-xl transform transition duration-500">-->
        <h1 class="text-2xl font-extrabold text-center">Customer Invoice</h1>
<!--        <p class="text-center mt-3 opacity-90">Hajj Booking Management System</p>-->
      </div>

      <!-- Report Type Selection -->
<!--      <div class="max-w-7xl mx-auto px-4 mb-8">-->
<!--        <div class="bg-white rounded-lg shadow-lg p-6">-->
<!--          <div class="flex items-center justify-between mb-6">-->
<!--            <div class="w-64">-->
<!--              <label for="customer" class="block text-gray-700 font-bold mb-2">Customer</label>-->
<!--              <a-select-->
<!--                  id="supplier"-->
<!--                  show-search-->
<!--                  placeholder="Search Customer"-->
<!--                  :filter-option="false"-->
<!--                  :loading="isSupplierLoading"-->
<!--                  :not-found-content="isSupplierLoading ? 'Loading...' : 'No customer found'"-->
<!--                  @search="handleSupplierSearch"-->
<!--                  @change="fetchCustomerInvoice"-->
<!--                  class="w-full"-->
<!--              >-->
<!--                <a-select-option-->
<!--                    v-for="supplier in suppliers"-->
<!--                    :key="supplier.id"-->
<!--                    :value="supplier.id"-->
<!--                >-->
<!--                  {{ supplier.name }}-->
<!--                </a-select-option>-->
<!--              </a-select>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
      <div class="max-w-7xl mx-auto px-4 mb-8">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <label for="customer" class="block text-gray-700 font-bold mb-2">Customer</label>
<!--          <a-select id="customer" show-search placeholder="Search Customer" :filter-option="false"-->
<!--                    :loading="isSupplierLoading" :not-found-content="isSupplierLoading ? 'Loading...' : 'No customer found'"-->
<!--                    @search="handleSupplierSearch" @change="fetchCustomerInvoice" class="w-full">-->
<!--            <a-select-option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">-->
<!--              {{ supplier.name }}-->
<!--            </a-select-option>-->
<!--          </a-select>-->
          <a-select
              id="customer"
              show-search
              placeholder="Search Customer Name"
              :filter-option="false"
              :loading="isSupplierLoading"
              :not-found-content="isSupplierLoading ? 'Loading...' : 'No quote found'"
              @search="handleSupplierSearch"
              @change="fetchCustomerInvoice"
              class="w-full"
          >
            <a-select-option
                v-for="quote in suppliers"
                :key="quote.id"
                :value="quote.id"
            >
            {{ quote.name }}
            </a-select-option>
          </a-select>


        </div>
      </div>
      <!-- Invoice Report -->
      <div class="invoice-container" ref="invoiceRef">
        <div class="max-w-4xl mx-auto px-4">
          <div class="bg-white shadow-lg">
            <!-- Invoice Header -->
            <div class="flex justify-between items-start p-8 pb-4">
              <!-- Company Info -->
              <div class="flex flex-col">
                <div class="text-4xl font-bold text-blue-400 mb-1">ALBASEERAH</div>
                <div class="text-lg text-gray-600 italic">Travel</div>
                <div class="text-xs text-gray-500 mt-1">TRAVEL AGENCY SPECIALISTS</div>
                <div class="text-sm text-gray-700 mt-2">
                  <div class="font-medium">459-461 Great Horton Road</div>
                  <div>Bradford</div>
                  <div>West Yorkshire</div>
                  <div class="font-bold">BD7 3DJ</div>
                </div>
              </div>

              <!-- Customer Info -->
              <div class="text-right text-sm text-gray-700 leading-relaxed">
                <div class="font-bold mb-1">Customer Details:</div>
                <div><strong>Name:</strong> {{ selectedCustomer.name || 'N/A' }}</div>
                <div><strong>Email:</strong> {{ selectedCustomer.email || 'N/A' }}</div>
<!--                <div><strong>ID:</strong> {{ selectedCustomer.id || 'N/A' }}</div>-->
              </div>
            </div>

            <!-- Invoice Title -->
            <div class="px-8 pb-6">
              <!-- Optional title can go here if needed -->
            </div>

            <!-- Content -->
            <div class="px-8 pb-8">
              <!-- Greeting -->
              <p class="mb-1 text-gray-800"><strong>As salaamu alaykum,</strong></p>
              <p class="mb-6 text-gray-700">Please find below confirmation of your trip along with details:</p>

              <!-- Hotel Details Section -->
              <div class="mb-6">
                <div class="flex items-center mb-4">
                  <h2 class="text-lg font-bold text-gray-800">Hotel details</h2>
                </div>

                <!-- Hotel Table -->
                <div class="border border-gray-300">
                  <table class="w-full text-sm">
                    <thead>
                    <tr class="bg-gray-100">
                      <th class="border border-gray-300 px-3 py-2 text-left font-bold">Res No</th>
                      <th class="border border-gray-300 px-3 py-2 text-left font-bold">Room</th>
                      <th class="border border-gray-300 px-3 py-2 text-left font-bold">Arrival</th>
                      <th class="border border-gray-300 px-3 py-2 text-left font-bold">Depart</th>
                      <th class="border border-gray-300 px-3 py-2 text-left font-bold">Hotel</th>
                      <th class="border border-gray-300 px-3 py-2 text-left font-bold">Name</th>
                      <th class="border border-gray-300 px-3 py-2 text-left font-bold">Meal</th>
                    </tr>
                    </thead>
                    <tbody>
                    <template v-for="quote in customerInvoice" :key="quote.id">
                      <tr v-for="hotelItem in quote.items" :key="hotelItem.id">
<!--                        <td class="border px-3 py-2">{{ hotelItem.hotelpackages?.hotelpackage?.res_no || 'N/A' }}</td>-->
<!--                        <td class="border px-3 py-2">{{ hotelItem.hotelpackages?.room_type || 'N/A' }}</td>-->
<!--                        <td class="border px-3 py-2">{{ formatDate(hotelItem.date_from) || 'N/A' }}</td>-->
<!--                        <td class="border px-3 py-2">{{ formatDate(hotelItem.date_to) || 'N/A' }}</td>-->
<!--                        <td class="border px-3 py-2">{{ hotelItem.hotelpackages?.hotelpackage?.hotel?.name || 'N/A' }}</td>-->
<!--                        <td class="border px-3 py-2">{{ quote.customers?.name || 'N/A' }}</td>-->
<!--                        <td class="border px-3 py-2 text-center">{{ hotelItem.hotelpackages?.mealn_plan_bb || 'BB' }}</td>-->
                        <td class="border px-3 py-2">
                          {{ hotelItem.hotelpackages?.res_no || 'N/A' }}
                        </td>
                        <td class="border px-3 py-2">
                          {{ hotelItem.hotelpackages?.hotelpackageitems[0]?.room_type || 'N/A' }}
                        </td>
                        <td class="border px-3 py-2">
                          {{ formatDate(hotelItem.date_from) || 'N/A' }}
                        </td>
                        <td class="border px-3 py-2">
                          {{ formatDate(hotelItem.date_to) || 'N/A' }}
                        </td>
                        <td class="border px-3 py-2">
                          {{ hotelItem.hotelpackages?.hotel?.name || 'N/A' }}
                        </td>
                        <td class="border px-3 py-2">
<!--                          {{ customerInvoice[0]?.name || 'N/A' }}-->
                          {{ hotelItem.hotelpackages?.supplier?.name || 'N/A' }}
                        </td>
                        <td class="border px-3 py-2 text-center">
                          {{ hotelItem.hotelpackages?.mealn_plan_bb || 'BB' }}
                        </td>

                      </tr>
                    </template>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Important Notice -->
              <div class="mb-6 text-gray-700 text-sm">
                <p class="mb-3">Please keep this document safe at all times. We would suggest you also keep a local copy
                  saved on your mobile phone so you can refer to it during your trip.</p>
              </div>

              <!-- Repeated Notice -->
              <div class="mb-6 text-gray-700 text-sm">
                <p class="mb-4">Please keep this document safe at all times. We would suggest you also keep a local copy
                  saved on your mobile phone so you can refer to it during your trip.</p>
              </div>

              <!-- Hotel Timings -->
              <div class="mb-6">
                <h3 class="font-bold text-gray-800 mb-3">Hotel timings</h3>
                <p class="text-gray-700 text-sm mb-2">Check in time for all bookings is 4pm
<!--                  {{ customerInvoice[0]?.items[0]?.reservations?.check_in ? formatTime(customerInvoice[0].items[0].reservations.check_in) : 'N/A' }}-->

                </p>
                <p class="text-gray-700 text-sm mb-4">Check out time for all bookings is 12pm
<!--                  {{ customerInvoice[0]?.items[0]?.reservations?.check_out ? formatTime(customerInvoice[0].items[0].reservations.check_out) : 'N/A' }}-->
                </p>
                <p class="text-gray-700 text-sm">We ask <strong><u>Allaah</u></strong> to grant you a successful, safe and
                  enjoyable Umrah trip.</p>
              </div>

              <!-- Closing -->
              <div class="text-gray-700 text-sm">
                <p class="mb-2">Thank you for choosing <strong><u>Albaseerah Travel!</u></strong></p>
                <p class="mb-1">Abu Ishaq</p>
                <p class="text-gray-600"><u>Albaseerah Travel</u></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div v-if="customerInvoice.length > 0" class="mt-8 flex justify-center space-x-4 pb-8">
        <button
            class="bg-blue-500 hover:bg-blue-600 flex items-center text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg"
            @click="printInvoice"
        >
          <Icon icon="mdi:printer" class="mr-2" />
          Print Report
        </button>
        <button
            class="bg-green-500 hover:bg-green-600 flex items-center text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg">
          <Icon icon="mdi:email" class="mr-2" />
          Email Report
        </button>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import MainLayout from "@/components/layouts/mainLayout.vue";
import axios from 'axios';
import { apiBase } from '@/config';
import { getToken, showNotification } from '@/utilities/common';

const suppliers = ref([]);
const isSupplierLoading = ref(false);
let supplierSearchTimeout;

const customerInvoice = ref([]);
const selectedCustomer = ref({});
const invoiceRef = ref(null);

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB');
};

const formatTime = (timeStr) => {
  if (!timeStr) return 'N/A';
  let [hours, minutes, seconds] = timeStr.split(':').map(Number);
  if (hours === 24) hours = 0; // treat 24:00 as 00:00 next day
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12; // convert 0 -> 12
  return `${hours} ${ampm}`;
};

// const handleSupplierSearch = (value) => {
//   clearTimeout(supplierSearchTimeout);
//   isSupplierLoading.value = true;
//   supplierSearchTimeout = setTimeout(async () => {
//     try {
//       const res = await axios.get(`${apiBase}/user_list?search=${encodeURIComponent(value)}`, getToken());
//       suppliers.value = res.data.users?.data || [];
//     } catch (err) {
//       console.error(err);
//       showNotification("Failed to fetch customers", "error");
//     } finally {
//       isSupplierLoading.value = false;
//     }
//   }, 500);
// };
const handleSupplierSearch = (value) => {
  clearTimeout(supplierSearchTimeout);
  isSupplierLoading.value = true;

  supplierSearchTimeout = setTimeout(async () => {
    try {
      const res = await axios.get(
          `${apiBase}/customers?search=${encodeURIComponent(value)}`,
          getToken() // your token helper
      );
      // The API returns quotes, so map to suppliers array for <a-select>
      suppliers.value = res.data.data?.data || [];
    } catch (err) {
      console.error(err);
      showNotification("Failed to fetch quotes", "error");
    } finally {
      isSupplierLoading.value = false;
    }
  }, 500);
};

// const fetchCustomerInvoice = async (customer_id) => {
//   try {
//     const res = await axios.get(`${apiBase}/customers_invoice?customer_id=${customer_id}`, getToken());
//     if (res.data.success && res.data.data.length) {
//       customerInvoice.value = res.data.data;
//       selectedCustomer.value = res.data.data[0].customers || {};
//     } else {
//       customerInvoice.value = [];
//       selectedCustomer.value = {};
//     }
//   } catch (err) {
//     console.error(err);
//     showNotification('Failed to fetch invoice', 'error');
//   }
// };

const fetchCustomerInvoice = async (quote_id) => {
  try {
    const res = await axios.get(`${apiBase}/customers_invoice?customer_id=${quote_id}`, getToken());
    if (res.data.success && res.data.data.length) {
      customerInvoice.value = res.data.data;
      // new structure: name is at root of object, not inside `customers`
      selectedCustomer.value = { name: res.data.data[0].name || 'N/A' };
    } else {
      customerInvoice.value = [];
      selectedCustomer.value = {};
    }
  } catch (err) {
    console.error(err);
    showNotification('Failed to fetch invoice', 'error');
  }
};


const printInvoice = () => {
  if (!invoiceRef.value || customerInvoice.value.length === 0) return;
  window.print();
};
</script>

<style scoped>
.table-hover tbody tr:hover {
  background-color: #f8fafc;
}
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
@media print {
  body * {
    visibility: hidden;
  }
  .invoice-container, .invoice-container * {
    visibility: visible;
  }
  .invoice-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
  table {
    border-collapse: collapse;
  }
  th, td {
    border: 1px solid #333 !important;
    padding: 4px;
  }
  .shadow-lg, .bg-white {
    box-shadow: none !important;
    background: none !important;
  }
  .p-4, .p-6, .px-8, .py-8 {
    padding: 0 !important;
  }
}
</style>
