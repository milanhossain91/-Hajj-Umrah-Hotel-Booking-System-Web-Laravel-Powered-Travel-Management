<template>
  <MainLayout>
    <div class="overflow-x-auto bg-white rounded-lg shadow-md">
      <!-- Quotes Table -->
      <p class="text-2xl font-bold text-center py-8">Quotes List</p>

      <!-- Create Button -->
      <div class="flex items-center justify-between m-4 bg-white p-4 rounded-lg shadow-sm border">
            <div class="flex items-center space-x-3">
              <input 
                type="search" 
                placeholder="Search..." 
                class="search_input px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-64"
                v-model="search" 
                :disabled="loading"
                @input="onSearchInput" 
              />
              <span v-if="loading" class="text-sm text-blue-500">Searching...</span>
            </div>

            <!-- Button -->
            <button 
              @click="showCreateModal"
              class="px-4 py-2 flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-200"
            >
              <Icon icon="mdi:plus-circle" class="mr-2 w-5 h-5" /> 
              Add New Quote
            </button>
          </div>




      <!-- Table -->
      <table class="min-w-full table-auto border border-gray-200 rounded-lg shadow-md overflow-hidden">
        <thead class="bg-gradient-to-r from-gray-100 to-gray-200">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">Customer Name</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">From Location</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">To Location</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">Transport</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">Rate</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">Status</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <!-- Quote Row Example -->
          <tr
            v-for="(quote, index) in quotes"
            :key="index"
            :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-blue-50 transition-colors duration-200'"
          >
            <td class="px-6 py-4 text-sm text-gray-800 font-medium">{{ quote?.customers?.name || '-' }}</td>
            <td class="px-6 py-4 text-sm text-gray-800">{{ quote?.transportpackages?.from_location?.name || '-' }}</td>
            <td class="px-6 py-4 text-sm text-gray-800">{{ quote?.transportpackages?.to_location?.name || '-' }}</td>
            <td class="px-6 py-4 text-sm text-gray-800">{{ quote?.transports?.name || '-' }}</td>
            <td class="px-6 py-4 text-sm text-gray-800">{{ quote?.rate || '-' }}</td>
            <td class="px-6 py-4 text-sm">
              <span
                class="px-3 py-1 rounded-full text-xs font-semibold"
                :class="quote.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : quote.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'"
              >
                {{ quote.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-800 flex items-center space-x-3">
              <button
                @click="openQuotesModal(quote)"
                class="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-2 rounded-lg shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
                title="View Details"
              >
                <Icon icon="mdi:eye-outline" class="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              <a-popconfirm title="Are you sure you want to delete this reservation?" @confirm="deleteQuote(quote.id)"
                ok-text="Yes" cancel-text="No">
                <button
                  class="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
                  title="Delete"
                >
                  <Icon icon="mdi:delete-outline" class="w-5 h-5" />
                </button>
              </a-popconfirm>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Quote Report Modal -->
      <a-modal
          v-model:open="isReportModalVisible"
          width="90%"
          :footer="null"
          centered
          title="Quote Report"
      >
        <div class="mx-auto p-4 bg-white print-section" ref="invoiceRef">
          <div
              v-for="quote in reportData.length ? reportData : [{}]"
              :key="quote.id || 'empty'"
              class="mb-8 border rounded-lg p-4 shadow-sm"
          >
            <!-- Quote Report Table -->
            <table class="w-full border-collapse border border-gray-400 mb-4 text-sm">
              <!-- Name -->
              <tr>
                <td
                    class="text-white px-3 py-1 border border-gray-400 font-semibold"
                    style="background-color:#001529"
                >
                  Name :
                </td>
                <td class="px-3 py-1 border border-gray-400" colspan="4">
                  {{ quote.customers?.name || '' }}
                </td>
              </tr>

              <!-- Tickets Header -->
              <tr class="text-white" style="background-color:#001529">
                <th class="px-3 py-1 border border-gray-400 text-left">Tickets</th>
                <th class="px-3 py-1 border border-gray-400 text-left">Qty</th>
                <th class="px-3 py-1 border border-gray-400 text-left">Our cost</th>
                <th class="px-3 py-1 border border-gray-400 text-left">Our Cost</th>
              </tr>

              <!-- Adults -->
              <tr class="bg-gray-100">
                <td class="px-3 py-1 border border-gray-400">Adults</td>
                <td class="px-3 py-1 border border-gray-400 text-right">{{ quote?.adult || 0 }}</td>
                <td class="px-3 py-1 border border-gray-400">£</td>
                <td class="px-3 py-1 border border-gray-400 text-right">
                  <div class="flex justify-between items-center">
                    <span>£</span><span>-</span>
                  </div>
                </td>
              </tr>

              <!-- Children -->
              <tr>
                <td class="px-3 py-1 border border-gray-400">Children</td>
                <td class="px-3 py-1 border border-gray-400 text-right">{{ quote?.children || 0 }}</td>
                <td class="px-3 py-1 border border-gray-400">£</td>
                <td class="px-3 py-1 border border-gray-400 text-right">
                  <div class="flex justify-between items-center">
                    <span>£</span><span>-</span>
                  </div>
                </td>
              </tr>

              <!-- Infant -->
              <tr class="bg-gray-100">
                <td class="px-3 py-1 border border-gray-400">Infant</td>
                <td class="px-3 py-1 border border-gray-400 text-right">{{ quote?.infant || 0 }}</td>
                <td class="px-3 py-1 border border-gray-400">£</td>
                <td class="px-3 py-1 border border-gray-400 text-right">
                  <div class="flex justify-between items-center">
                    <span>£</span><span>-</span>
                  </div>
                </td>
              </tr>

              <!-- Sub Total -->
              <tr class="bg-orange-200">
                <td class="px-3 py-1 border border-gray-400 font-semibold">Sub Total</td>
                <td class="px-3 py-1 border border-gray-400"></td>
                <td class="px-3 py-1 border border-gray-400"></td>
                <td class="px-3 py-1 border border-gray-400 text-right">
                  <div class="flex justify-between items-center">
                    <span>£</span><span>-</span>
                  </div>
                </td>
              </tr>

              <!-- Visa -->
              <tr>
                <td class="px-3 py-1 border border-gray-400">Visa</td>
                <td class="px-3 py-1 border border-gray-400 text-right">
                  {{ (quote.items?.[0]?.hotelpackages?.adults || 0) +
                (quote.items?.[0]?.hotelpackages?.children || 0) +
                (quote.items?.[0]?.hotelpackages?.infant || 0) }}
                </td>
                <td class="px-3 py-1 border border-gray-400 text-right">
                  <div class="flex items-center justify-between">
                    <span>£</span> <span>{{ quote.visas?.cost || 0 }}</span>
                  </div>
                </td>
                <td class="px-3 py-1 border border-gray-400 text-right">
                  <div class="flex items-center justify-between">
                    <span>£</span> <span>{{ quote.visas?.cost || 0 }}</span>
                  </div>
                </td>
              </tr>

              <!-- Transport -->
              <tr class="bg-gray-100">
                <td class="px-3 py-1 border border-gray-400">Transport</td>
                <td class="px-3 py-1 border border-gray-400 text-right">
                  {{ Math.ceil((quote.items?.[0]?.hotelpackages?.adults || 0) / 49) || 1 }}
                </td>
                <td class="px-3 py-1 border border-gray-400 text-right">
                  <div class="flex justify-between items-center">
                    <span>£</span><span>{{ quote.transports?.name ? quote.transportpackages?.rate : 0 }}</span>
                  </div>
                </td>
                <td class="px-3 py-1 border border-gray-400 text-right">
                  <div class="flex justify-between items-center">
                    <span>£</span><span>{{ quote.transports?.name ? quote.transportpackages?.rate : 0 }}</span>
                  </div>
                </td>
              </tr>

              <!-- Hotel Items -->
              <template v-for="item in quote.items" :key="item.id">
                <tr class="text-white" style="background-color:#001529">
                  <td class="px-3 py-1 border border-gray-400 font-semibold">{{ item.hotelpackages?.city }}</td>
                  <td class="px-3 py-1 border border-gray-400" colspan="2">{{ item.hotelpackages?.hotel?.name }}</td>
                  <td class="px-3 py-1 border border-gray-400"></td>
                </tr>
                <tr class="text-white" style="background-color:#001529">
                  <td class="px-3 py-1 border border-gray-400 font-semibold">Supplier</td>
                  <td class="px-3 py-1 border border-gray-400" colspan="2">{{ item.hotelpackages?.supplier?.name }}</td>
                  <td class="px-3 py-1 border border-gray-400"></td>
                </tr>
                <tr class="text-white" style="background-color:#001529">
                  <td class="px-3 py-1 border border-gray-400 font-semibold">Reservation ref</td>
                  <td class="px-3 py-1 border border-gray-400" colspan="2">{{ item?.reservation_ref }}</td>
                  <td class="px-3 py-1 border border-gray-400"></td>
                </tr>

                <!-- Rates -->
                <tr class="bg-gray-100">
                  <td class="px-3 py-1 border border-gray-400">Dates</td>
                  <td class="px-3 py-1 border border-gray-400 bg-green-100 text-right font-bold">{{ formatDate(item.date_from) }}</td>
                  <td class="px-3 py-1 border border-gray-400 text-right font-bold">{{ formatDate(item.date_to) }}</td>
                  <td class="px-3 py-1 border border-gray-400 text-right">{{ item.hotelpackages?.numberofdays || 0 }}</td>
                </tr>

                <!-- Room types -->
                <tr v-for="type in ['double', 'triple', 'quad']" :key="type" class="bg-white">
                  <td class="px-3 py-1 border border-gray-400 capitalize">{{ type }}</td>
                  <td class="px-3 py-1 border border-gray-400"></td>
                  <td class="px-3 py-1 border border-gray-400 text-blue-600 font-semibold text-right">
                    &#65020; {{ (getRate(item.hotelpackages, type)?.days_wd || 0) * 4.5 }}
                  </td>
                  <td class="px-3 py-1 border border-gray-400 text-right">
                    <div class="flex justify-between items-center">
                      <span>£</span><span>{{ getRate(item.hotelpackages, type)?.days_wd || 0 }}</span>
                    </div>
                  </td>
                </tr>
              </template>

              <!-- Totals -->
              <tr class="text-white" style="background-color:#001529">
                <td class="px-3 py-1 border border-gray-400 font-semibold">Sub Total</td>
                <td class="px-3 py-1 border border-gray-400" colspan="2"></td>
                <td class="px-3 py-1 border border-gray-400 text-right font-semibold">
                  <div class="flex justify-between items-center">
                    <span>£</span><span>{{ getSubtotal(quote).toFixed(2) }}</span>
                  </div>
                </td>
              </tr>

              <tr class="text-white" style="background-color:#001529">
                <td class="px-3 py-1 border border-gray-400 font-semibold">Weekend</td>
                <td class="px-3 py-1 border border-gray-400" colspan="2"></td>
                <td class="px-3 py-1 border border-gray-400 text-right">
                  <div class="flex justify-between items-center">
                    <span>£</span><span>{{ quote.items?.[0]?.hotelpackages?.days_we || '-' }}</span>
                  </div>
                </td>
              </tr>

              <tr class="bg-blue-100">
                <td class="px-3 py-1 border border-gray-400 font-semibold" colspan="3">Mark Up</td>
                <td class="px-3 py-1 border border-gray-400 text-blue-600 font-semibold text-right">
                  <div class="flex justify-between items-center">
                    <span>£</span><span>{{ getMarkup(quote).toFixed(2) }}</span>
                  </div>
                </td>
              </tr>

              <tr class="bg-green-100">
                <td class="px-3 py-1 border border-gray-400 font-semibold" colspan="3">Retail</td>
                <td class="px-3 py-1 border border-gray-400 text-green-600 font-semibold text-right">
                  <div class="flex justify-between items-center">
                    <span>£</span><span>{{ getRetail(quote).toFixed(2) }}</span>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </a-modal>

      <!-- Pagination -->
    </div>
    <a-pagination class="p-4" v-model:current="currPage" v-model:page-size="itemsPerPage" :total="totalItems"
      :showSizeChanger="true" :showQuickJumper="false" :show-total="(total) => `Total ${total} items`"
      @change="getQuote($event)" @showSizeChange="(current, pageSize) => (itemsPerPage = pageSize)" />
    <!-- Create Quote Modal -->
    <a-modal 
  v-model:open="createModalVisible" 
  title="Create New Quote" 
  @ok="createQuote" 
  width="1400px"
>
  <div class="h-[600px] overflow-auto bg-gray-50 rounded-lg p-6">
    <form @submit.prevent="createQuote" class="space-y-6">
      <!-- Main Fields -->
      <div class="grid grid-cols-2 gap-6">
        <!-- Customer -->
        <div> 
          <label for="customer" class="block text-gray-700"> Customer <span class="text-red-500">*</span> </label> 
          <a-select id="customer" v-model:value="newQuote.customer_id" show-search placeholder="Search Customer" :filter-option="false" :loading="customerSearchLoading" :not-found-content="customerSearchLoading ? 'Loading...' : 'No customer found'" @search="handleCustomerSearch" class="w-full" > 
            <a-select-option v-for="customer in customers" :key="customer.id" :value="customer.id" > {{ customer.name }} </a-select-option> 
            </a-select> 
            <p v-if="createErrors?.customer_id" class="text-red-500 text-sm mt-1"> {{ createErrors.customer_id[0] }} </p> 
        </div>

        <!-- Adults -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Adults <span class="text-red-500">*</span></label>
          <a-input v-model:value="newQuote.adult" type="number" min="1" class="w-full" />
        </div>

        <!-- Children -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Children <span class="text-red-500">*</span></label>
          <a-input v-model:value="newQuote.children" type="number" min="0" class="w-full" />
        </div>

        <!-- Infant -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Infant <span class="text-red-500">*</span></label>
          <a-input v-model:value="newQuote.infant" type="number" min="0" class="w-full" />
        </div>

        <!-- Visa -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Visa</label>
          <a-select v-model:value="newQuote.visa_id" show-search placeholder="Select Visa" class="w-full">
            <a-select-option v-for="visa in visas" :key="visa.id" :value="visa.id">
              {{ visa.visa_type }}
            </a-select-option>
          </a-select>
        </div>

        <!-- Profit -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Profit</label>
          <a-select v-model:value="newQuote.profit_id" show-search placeholder="Select Profit" class="w-full">
            <a-select-option v-for="profit in profits" :key="profit.id" :value="profit.id">
              {{ profit.fixed_markup }}
            </a-select-option>
          </a-select>
        </div>
      </div>

      <!-- Hotel Package Search -->
      <div class="col-span-2 border rounded-lg bg-white p-5 shadow-sm">
        <label for="rate" class="block text-sm font-medium text-gray-700 mb-1">Hotel Package <span class="text-red-500">*</span></label>
        <a-input
          v-model:value="searchQuery"
          placeholder="Search by From, To, or Bus"
          @input="handleSearch"
          class="block w-full"
        />

        <!-- Suggestions -->
        <div v-if="showSuggestions" class="mt-3 space-y-2">
          <div
            v-for="result in searchResults"
            :key="result.id"
            class="p-3 rounded-md bg-blue-600 text-white shadow cursor-pointer hover:bg-blue-700 transition"
            @click="selectResult(result)"
          >
            <p>
              {{ result.from_location?.name }} → {{ result.to_location?.name }} <br />
              <b>Transport:</b> {{ result.transport?.name }} | <b>Rate:</b> {{ result.rate }}
            </p>
          </div>
        </div>
        <div v-else-if="showNoResults" class="mt-3 text-sm text-gray-500">No results found.</div>
        <div v-if="loading" class="mt-3 text-sm text-blue-500">Searching...</div>
      </div>

      <!-- Transport -->
      <div class="grid grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Bus Name</label>
          <a-input v-model:value="newQuote.transport_name" disabled class="bg-gray-100 text-gray-900" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Rate</label>
          <a-input v-model:value="newQuote.rate" disabled class="bg-gray-100 text-gray-900" />
        </div>
      </div>

      <!-- Quote Items -->
      <div>
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Quote Items</h3>
        <div 
          v-for="(item, itemIndex) in newQuote.items" 
          :key="itemIndex" 
          class="mb-6 border rounded-lg bg-white shadow-sm p-5 relative"
        >
          <!-- Remove button -->
          <button
            v-if="newQuote.items.length > 1"
            @click.prevent="removeQuoteItem(itemIndex)"
            type="button"
            class="absolute top-2 right-2 text-red-500 hover:text-red-700"
          >
            <Icon icon="mdi:close-circle" class="w-5 h-5" />
          </button>

          <!-- Hotel Package Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Search Hotel Package</label>
            <a-input
              v-model:value="item.searchQuery"
              placeholder="Search by Hotel, Supplier or Res No"
              @input="() => handleHotelPackageSearch(itemIndex)"
              class="block w-full"
            />
            <div v-if="item.searchResults?.length" class="mt-2 space-y-2">
              <div
                v-for="result in item.searchResults"
                :key="result.id"
                class="p-3 rounded-md bg-blue-600 text-white cursor-pointer hover:bg-blue-700 transition"
                @click="selectHotelResult(result, itemIndex)"
              >
                <p>
                  <b>Hotel:</b> {{ result.hotel?.name }} |
                  <b>Supplier:</b> {{ result.supplier?.name || 'N/A' }} |
                  <b>Res No:</b> {{ result.res_no }}
                </p>
              </div>
            </div>
            <div v-else-if="item.showNoResults" class="mt-2 text-sm text-gray-500">No results found.</div>
            <div v-if="item.loading" class="mt-2 text-sm text-blue-500">Searching...</div>
          </div>

          <!-- Auto-filled -->
          <div class="grid grid-cols-2 gap-6 mt-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Hotel</label>
              <a-input v-model:value="item.hotel_name" disabled class="bg-gray-100 text-gray-900" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
              <a-input v-model:value="item.supplier_name" disabled class="bg-gray-100 text-gray-900" />
            </div>
          </div>

          <!-- Dates -->
          <div class="grid grid-cols-2 gap-6 mt-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date From</label>
              <a-date-picker v-model:value="item.date_from" format="YYYY-MM-DD" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date To</label>
              <a-date-picker v-model:value="item.date_to" format="YYYY-MM-DD" class="w-full" />
            </div>
          </div>

          <!-- Reservation -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Reservation</label>
            <a-input v-model:value="item.reservation_ref" />
          </div>
        </div>

        <!-- Add Item button -->
        <div class="mt-4">
          <a-button type="dashed" @click="addQuoteItem" class="w-full">+ Add Item</a-button>
        </div>
      </div>
    </form>
  </div>
</a-modal>

    <!-- Update Quote Modal -->
    <a-modal width="1000px" v-model:open="updateModalVisible" title="Update Quote" @ok="updateQuote">
      <div class="h-[500px] overflow-auto">
        <form @submit.prevent="updateQuote">
          <div class="grid grid-cols-2 gap-4">
            <!-- quote one -->
              <div>
                <label for="customer" class="block text-gray-700">
                  Customer <span class="text-red-500">*</span>
                </label>
                <a-select
                  id="customer"
                  v-model:value="newQuote.customer_id"
                  show-search
                  placeholder="Search Customer"
                  :filter-option="false"
                  :loading="customerSearchLoading"
                  :not-found-content="customerSearchLoading ? 'Loading...' : 'No customer found'"
                  @search="handleCustomerSearch"
                  class="w-full"
                >
                  <a-select-option
                    v-for="customer in customers"
                    :key="customer.id"
                    :value="customer.id"
                  >
                    {{ customer.name }}
                  </a-select-option>
                </a-select>

                <p v-if="createErrors?.customer_id" class="text-red-500 text-sm mt-1">
                  {{ createErrors.customer_id[0] }}
                </p>
              </div>
            <!-- Customer Select -->
            <div>
              <label for="customer" class="block text-gray-700">Supplier Name <span
                  class="text-red-500">*</span></label>
              <a-select id="supplier" v-model:value="currentQuote.supplier_id" show-search placeholder="Search Supplier"
                        :filter-option="false" :loading="isSupplierLoading"
                        :not-found-content="isSupplierLoading ? 'Loading...' : 'No supplier found'"
                        @search="handleSupplierSearch" class="w-full">
                <a-select-option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                  {{ supplier.name }}
                </a-select-option>
              </a-select>
              <p v-if="updateErrors.customer_id" class="text-red-500 text-sm mt-1">{{ updateErrors.customer_id[0] }}</p>
            </div>


            <!-- From Location Select -->
            <div>
              <label for="from_location" class="block text-gray-700">From Location</label>
              <a-select allow-clear v-model:value="currentQuote.from_location" arrow show-search
                placeholder="Search and select location" class="w-full" :filter-option="false"
                :not-found-content="locationSearchLoading ? 'Searching...' : 'No locations found'"
                @search="handleLocationSearch" required>
                <a-select-option v-for="location in locations" :key="location.id" :value="location.id">
                  {{ location.name }}
                </a-select-option>
              </a-select>
              <p v-if="updateErrors.from_location" class="text-red-500 text-sm mt-1">{{ updateErrors.from_location[0] }}
              </p>
            </div>

            <!-- To Location Select -->
            <div>
              <label for="to_location" class="block text-gray-700">To Location</label>
              <a-select allow-clear v-model:value="currentQuote.to_location" arrow show-search
                placeholder="Search and select location" class="w-full" :filter-option="false"
                :not-found-content="locationSearchLoading ? 'Searching...' : 'No locations found'"
                @search="handleLocationSearch" required>
                <a-select-option v-for="location in locations" :key="location.id" :value="location.id">
                  {{ location.name }}
                </a-select-option>
              </a-select>
              <p v-if="updateErrors.to_location" class="text-red-500 text-sm mt-1">{{ updateErrors.to_location[0] }}</p>
            </div>
            <!--  Tranport select  -->
            <div>
              <label for="transport" class="block text-gray-700">Transport Name <span
                  class="text-red-500">*</span></label>
              <a-select v-model:value="currentQuote.transport_id" arrow show-search
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
            <!-- rate -->
            <div>
              <label for="rate" class="block text-gray-700">Rate <span class="text-red-500">*</span></label>
              <a-input v-model:value="currentQuote.rate" placeholder="Rate will be auto-filled" :disabled="true"
                class="bg-gray-100" />
              <span v-if="transferSearchLoading" class="text-blue-500 text-sm">Loading rate...</span>
              <p v-if="updateErrors.rate" class="text-red-500 text-sm mt-1">{{ updateErrors.rate[0] }}</p>
            </div>
            <!--  Visa select  -->
            <div>
              <label for="visa" class="block text-gray-700">Visa <span class="text-red-500">*</span></label>
              <a-select v-model:value="currentQuote.visa_id" arrow show-search placeholder="Search and select visa"
                class="w-full" :filter-option="false"
                :not-found-content="visaSearchLoading ? 'Searching...' : 'No visas found'" @search="handleVisaSearch"
                required>
                <a-select-option v-for="visa in visas" :key="visa.id" :value="visa.id">
                  {{ visa.visa_type }}
                </a-select-option>
              </a-select>
              <p v-if="updateErrors.visa_id" class="text-red-500 text-sm mt-1">{{ updateErrors.visa_id[0] }}</p>
            </div>
            <!--  Profit select  -->
            <div>
              <label for="profit" class="block text-gray-700">Profit <span class="text-red-500">*</span></label>
              <a-select v-model:value="currentQuote.profit_id" arrow show-search placeholder="Search and select profit"
                class="w-full" :filter-option="false"
                :not-found-content="profitSearchLoading ? 'Searching...' : 'No profits found'"
                @search="handleProfitSearch" required>
                <a-select-option v-for="profit in profits" :key="profit.id" :value="profit.id">
                  {{ profit.fixed_markup }}
                </a-select-option>
              </a-select>
              <p v-if="updateErrors.profit_id" class="text-red-500 text-sm mt-1">{{ updateErrors.profit_id[0] }}</p>
            </div>
            <div>
              <label class="block text-gray-700">Valid Until <span class="text-red-500">*</span></label>
              <a-date-picker v-model:value="currentQuote.valid_until" class="w-full" :disabled-date="disabledDate"
                format="YYYY-MM-DD" required />
              <p v-if="updateErrors.valid_until" class="text-red-500 text-sm mt-1">{{ updateErrors.valid_until[0] }}</p>
            </div>

            <!-- Status Select -->
            <div>
              <label for="status" class="block text-gray-700">Status</label>
              <a-select v-model:value="currentQuote.status" placeholder="Select Status" class="w-full">
                <a-select-option value="draft">Draft</a-select-option>
                <a-select-option value="tentative">Tentative</a-select-option>
                <a-select-option value="confirmed">Confirmed</a-select-option>
                <a-select-option value="cancelled">Cancelled</a-select-option>
              </a-select>
              <p v-if="updateErrors.status" class="text-red-500 text-sm mt-1">{{ updateErrors.status[0] }}</p>
            </div>
          </div>

          <!-- item -->
          <div class="mt-6">
            <h3 class="text-lg font-semibold mb-4">Add item</h3>
            <div v-for="(item, index) in currentQuote.items" :key="index">
              <div class="flex items-end relative">
                <button v-if="currentQuote.items.length > 1" @click.stop="removeUpdateQuoteItem(index)" type="button"
                  class="text-red-500 hover:text-red-700 absolute top-6 right-2">
                  <Icon icon="mdi:close-circle" class="w-6 h-6" />
                </button>
              </div>
              <div class="grid grid-cols-2 gap-4 mt-4 p-4 border rounded-md pt-8">
                <!-- hotel -->
                <div>
                  <label for="hotel" class="block text-gray-700">Hotel <span class="text-red-500">*</span></label>
                  <a-select v-model:value="item.hotel_id" arrow show-search placeholder="Search and select hotel"
                    class="w-full" :filter-option="false"
                    :not-found-content="hotelSearchLoading ? 'Searching...' : 'No hotels found'"
                    @search="handleHotelSearch" required>
                    <a-select-option v-for="hotel in hotels" :key="hotel.id" :value="hotel.id">
                      {{ hotel.name }}
                    </a-select-option>
                  </a-select>
                </div>
                <!-- user list -->
                <div>
                  <label for="user" class="block text-gray-700">Customer Name <span class="text-red-500">*</span></label>
                  <a-select v-model:value="item.supplier_id" arrow show-search placeholder="Search and select user"
                    class="w-full" :filter-option="false"
                    :not-found-content="userSearchLoading ? 'Searching...' : 'No users found'"
                    @search="handleUserSearch" required>
                    <a-select-option v-for="user in users" :key="user.id" :value="user.id">
                      {{ user.name }}
                    </a-select-option>
                  </a-select>
                </div>
                <!-- reservations list -->
                <div>
                  <label for="reservation" class="block text-gray-700">Reservation ID <span
                      class="text-red-500">*</span></label>
                  <a-select v-model:value="item.reservations_id" arrow show-search
                    placeholder="Search and select reservation" class="w-full" :filter-option="false"
                    :not-found-content="reservationSearchLoading ? 'Searching...' : 'No reservations found'"
                    @search="handleReservationSearch" required>
                    <a-select-option v-for="reservation in reservations" :key="reservation.id" :value="reservation.id">
                      {{ reservation.reservation_ref }}
                    </a-select-option>
                  </a-select>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-4 w-full">
            <a-button type="dashed" @click="addUpdateQuoteItem">Add Item</a-button>
          </div>
        </form>
      </div>
    </a-modal>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { Modal } from 'ant-design-vue';
import { Icon } from '@iconify/vue';
import MainLayout from "@/components/layouts/mainLayout.vue";
import axios from 'axios';
import { apiBase } from '@/config';
import { getToken, showNotification } from '@/utilities/common';
import dayjs from 'dayjs';


const isReportModalVisible = ref(false);
const reportData = ref([
  {
    id: 1,
    customer: { name: "Test Customer" },
    adult: 2,
    children: 1,
    infant: 0,
    visas: { cost: 50 },
    transports: { name: "Bus" },
    transportpackages: { rate: 100 },
    items: [
      {
        id: 11,
        date_from: "2025-09-01",
        date_to: "2025-09-05",
        reservation_ref: "RES-123",
        hotelpackages: {
          city: "Makkah",
          numberofdays: 4,
          hotel: { name: "Hilton" },
          supplier: { name: "Supplier A" },
          days_we: 200,
          double: { days_wd: 80 },
          triple: { days_wd: 70 },
          quad: { days_wd: 60 },
          adults: 2,
          children: 1,
          infant: 0,
        },
      },
    ],
  },
]);
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date).replace(/ /g, "-");
};


// const getRate = (pkg, type) => pkg?.[type] || { days_wd: 0 };
const getRate = (hotelpackage, type) => {
  if (!hotelpackage || !hotelpackage.hotelpackageitems) return { days_wd: 0 };
  return hotelpackage.hotelpackageitems.find(r => r.room_type === type) || { days_wd: 0 };
};

const getSubtotal = (quote) => {
  let sub = 0;

  // Visa
  sub += parseFloat(quote.visas?.cost || 0);

  // Transport
  sub += parseFloat(quote.transportpackages?.rate || 0);

  // Hotel items
  quote.items?.forEach(item => {
    ["double", "triple", "quad"].forEach(type => {
      sub += parseFloat(getRate(item.hotelpackages, type)?.days_wd || 0);
    });
  });

  return sub;
};
const getMarkup = (quote) => {
  const adult = parseFloat(quote.adult || 0);
  const fixed = parseFloat(quote.profits?.fixed_markup || 0);
  return adult * fixed;
};

const getRetail = (quote) => getSubtotal(quote) + getMarkup(quote);

const openQuotesModal = async (quote) => {
  try {
    const res = await axios.get(`${apiBase}/customers_report?customer_id=${quote.id}`, getToken());
    reportData.value = (res.data.data || []).map(q => ({
      ...q,
      customer: { name: q.name }
    }));
    isReportModalVisible.value = true; // open modal after data is loaded
  } catch (e) {
    console.error("Error fetching report", e);
    showNotification("Failed to fetch report", "error");
  }
};


const searchResults = ref([]);

const showSuggestions = computed(() => searchResults.value.length > 0);

const showNoResults = ref(false);
const searchQuery = ref("");

const handleSearch = async () => {
  if (!searchQuery.value) {
    searchResults.value = [];
    showNoResults.value = false;
    return;
  }

  loading.value = true;
  try {
    const response = await axios.get(
        `${apiBase}/search_transport_package?search=${encodeURIComponent(searchQuery.value)}`,
        getToken()
    );

    if (response.data.success && Array.isArray(response.data.data)) {
      searchResults.value = response.data.data;
      showNoResults.value = searchResults.value.length === 0;
    } else {
      searchResults.value = [];
      showNoResults.value = true;
    }
  } catch (err) {
    console.error("Search error:", err);
    searchResults.value = [];
    showNoResults.value = true;
  } finally {
    loading.value = false;
  }
};


//  when user selects a suggestion
const selectResult = (result) => {
  // store ids for API
  newQuote.value.from_location = result.from_location?.id;
  newQuote.value.to_location = result.to_location?.id;
  newQuote.value.transport_id = result.transport?.id;
  newQuote.value.transport_packages_id = result.id;
  // display values
  newQuote.value.transport_name = result.transport?.name || "";
  newQuote.value.rate = result.rate;

  // show selection in input
  searchQuery.value = `${result.from_location?.name} → ${result.to_location?.name} (${result.transport?.name})`;

  // clear suggestions
  searchResults.value = [];
};


const hotelSearchInput = ref("");
const hotelSearchResults = ref([]);
const loadingHotels = ref(false);

const hotelNameSearch = ref("");
const supplierNameSearch = ref("");
const resNoSearch = ref("");
const showNoHotelResults = ref(false);

const handleHotelPackageSearch = async (index) => {
  const item = newQuote.value.items[index];
  if (!item.searchQuery) {
    item.searchResults = [];
    item.showNoResults = false;
    return;
  }

  item.loading = true;
  try {
    const response = await axios.get(
        `${apiBase}/search_hotel_package?search=${encodeURIComponent(item.searchQuery)}`,
        getToken()
    );

    if (response.data.success && Array.isArray(response.data.data)) {
      item.searchResults = response.data.data;
      item.showNoResults = item.searchResults.length === 0;
    } else {
      item.searchResults = [];
      item.showNoResults = true;
    }
  } catch (err) {
    console.error("Hotel package search error:", err);
    item.searchResults = [];
    item.showNoResults = true;
  } finally {
    item.loading = false;
  }
};



const selectHotelResult = (result, index) => {
  const item = newQuote.value.items[index];
  item.searchQuery = result.res_no;
  item.hotel_name = result.hotel?.name || "";
  item.supplier_name = result.supplier?.name || "";
  item.hotel_id = result.hotel?.id ?? null;
  item.hotel_packages_id = result.id;
  item.reservation_ref = result.reservation_ref || "";
  item.searchResults = [];
  item.showNoResults = false;
};

// Quotes data (static for now)
const quotes = ref([]);


const createErrors = ref({});
const updateErrors = ref({});

const isQuoteLoading = ref(false);
const loading = ref(false);

const search = ref('');

let searchTimeout = null;
const onSearchInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    getQuote(1);
  }, 400); // 400ms debounce
};

const supplierSearchLoading = ref(false);
let supplierSearchTimeout = null;
const supplierSearchQuery = ref('');
const isSupplierLoading = ref(false);
const suppliers = ref([]);

const getSuppliers = async (query = '') => {
  isSupplierLoading.value = true;
  try {
    const res = await axios.get(`${apiBase}/suppliers?search=${encodeURIComponent(query)}`, getToken());
    if (res.data && res.data.data) {
      suppliers.value = res.data.data.data;
    }
  } catch (error) {
    showNotification('error', 'Failed to fetch suppliers', error.message);
  } finally {
    isSupplierLoading.value = false;
  }
};
const handleSupplierSearch = (value) => {
  console.log("Supplier Search Query:", value);
  clearTimeout(supplierSearchTimeout);
  supplierSearchLoading.value = true;
  supplierSearchQuery.value = value;

  supplierSearchTimeout = setTimeout(() => {
    getSuppliers(value);
  }, 500);
};

const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);
const currPage = ref(1);
const from = ref(1);
// Fetch quotes
// Fetch quotes
const getQuote = async (page = 1) => {
  isQuoteLoading.value = true;
  try {
    let url = `${apiBase}/quotes?page=${page}&limit=${itemsPerPage.value}`;
    if (search.value) {
      url += `&search=${encodeURIComponent(search.value)}`;
    }
    const res = await axios.get(url, getToken());
    if (res.data) {
      quotes.value = res.data.data.data;
      totalItems.value = res.data?.data?.total;
      currPage.value = res.data?.data?.current_page;
      from.value = res.data?.data?.from;
    }
  } catch (error) {
    console.error(error);
  } finally {
    isQuoteLoading.value = false;
  }
};

const locations = ref([]);
const locationSearchLoading = ref(false);

// get location
const getLocations = async (query = '') => {
  try {
    const res = await axios.get(`${apiBase}/locations?search=${encodeURIComponent(query)}`, getToken());
    if (res.data) {
      locations.value = res.data.data.data;
    }
  } catch (error) {
    console.error('Error fetching locations:', error);
  } finally {
    locationSearchLoading.value = false;
  }
};

let locationSearchTimeout = null;
const handleLocationSearch = (value) => {
  clearTimeout(locationSearchTimeout);
  locationSearchLoading.value = true;

  locationSearchTimeout = setTimeout(() => {
    getLocations(value);
  }, 500);
};


// Data for dropdowns
const transports = ref([]);
const visas = ref([]);
const profits = ref([]);
const hotels = ref([]);
const users = ref([]);
const reservations = ref([]);

// Loading states for dropdowns
const customerSearchLoading = ref(false);
const transportSearchLoading = ref(false);
const visaSearchLoading = ref(false);
const profitSearchLoading = ref(false);
const hotelSearchLoading = ref(false);
const userSearchLoading = ref(false);
const reservationSearchLoading = ref(false);
const transferSearchLoading = ref(false);

// Search handlers with debounce
let customerSearchTimeout = null;
let transportSearchTimeout = null;
let profitSearchTimeout = null;
let hotelSearchTimeout = null;
let userSearchTimeout = null;
let reservationSearchTimeout = null;

userSearchLoading.value = false;
profitSearchLoading.value = false;
visaSearchLoading.value = false;

// Customer search
const handleCustomerSearch = (value) => {
  clearTimeout(customerSearchTimeout);
  customerSearchLoading.value = true;

  customerSearchTimeout = setTimeout(() => {
    getCustomers(value);
  }, 500);
};

const customers = ref([]);

const getCustomers = async (query = '') => {
  try {
    const res = await axios.get(`${apiBase}/customers?name=${encodeURIComponent(query)}`, getToken());
    if (res.data) {
      customers.value = res.data.data.data;
    }
  } catch (error) {
    console.error('Error fetching customers:', error);
  } finally {
    customerSearchLoading.value = false;
  }
};

// Transport search
const handleTransportSearch = (value) => {
  clearTimeout(transportSearchTimeout);
  transportSearchLoading.value = true;

  transportSearchTimeout = setTimeout(() => {
    getTransports(value);
  }, 500);
};

const getTransports = async (query = '') => {
  try {
    const res = await axios.get(`${apiBase}/transports?search=${encodeURIComponent(query)}`, getToken());
    if (res.data) {
      transports.value = res.data.data.data;
    }
  } catch (error) {
    console.error('Error fetching transports:', error);
  } finally {
    transportSearchLoading.value = false;
  }
};



const handleVisaSearch = (query) => {
  visaSearchLoading.value = true;
  getVisas(query);
};

// visa
const getVisas = async () => {
  visaSearchLoading.value = true;
  try {
    const res = await axios.get(`${apiBase}/visas`, getToken());
    if (res.data && res.data.data && res.data.data.data) {
      visas.value = res.data.data.data;
      console.log('Fetched visas:', visas.value);
    } else {
      visas.value = [];
    }
  } catch (error) {
    console.error('Error fetching visas:', error);
    visas.value = [];
  } finally {
    visaSearchLoading.value = false;
  }
};


// Profit search
const handleProfitSearch = (value) => {
  clearTimeout(profitSearchTimeout);
  profitSearchLoading.value = true;

  profitSearchTimeout = setTimeout(() => {
    getProfits(value);
  }, 500);
};

const getProfits = async (query = '') => {
  profitSearchLoading.value = true;
  try {
    const res = await axios.get(`${apiBase}/profits?name=${encodeURIComponent(query)}`, getToken());
    if (res.data) {
      profits.value = res.data.data.data;
    }
  } catch (error) {
    console.error('Error fetching profits:', error);
  } finally {
    profitSearchLoading.value = false;
  }
};

// Hotel search
const handleHotelSearch = (value) => {
  clearTimeout(hotelSearchTimeout);
  hotelSearchLoading.value = true;

  hotelSearchTimeout = setTimeout(() => {
    getHotels(value);
  }, 500);
};


// get hotels
const getHotels = async (query = '') => {
  try {
    const res = await axios.get(`${apiBase}/hotels?search=${encodeURIComponent(query)}`, getToken());
    if (res.data) {
      hotels.value = res.data.data.data;
    }
  } catch (error) {
    console.error('Error fetching hotels:', error);
  } finally {
    hotelSearchLoading.value = false;
  }
};

// User search
const handleUserSearch = (value) => {
  clearTimeout(userSearchTimeout);
  userSearchLoading.value = true;

  userSearchTimeout = setTimeout(() => {
    getUsers(value);
  }, 500);
};

const getUsers = async (query = '') => {
  userSearchLoading.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/user_list?search=${encodeURIComponent(query)}&limit=5&page=1`,
      getToken()
    );

    if (res.data && res.data.users && res.data.users.data) {
      users.value = res.data.users.data;
    } else {
      users.value = [];
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    users.value = [];
  } finally {
    userSearchLoading.value = false;
  }
};

// Reservation search
const handleReservationSearch = (value) => {
  clearTimeout(reservationSearchTimeout);
  reservationSearchLoading.value = true;

  reservationSearchTimeout = setTimeout(() => {
    getReservations(value);
  }, 500);
};

const getReservations = async (query = '') => {
  reservationSearchLoading.value = true;
  try {
    const res = await axios.get(
      `${apiBase}/reservations?search=${encodeURIComponent(query)}&limit=5&page=1`,
      getToken()
    );

    if (res.data) {
      reservations.value = res.data.data.data;
      console.log('researvationssssssssssss', reservations.va);
    }
  } catch (error) {
    console.error('Error fetching reservations:', error);
    reservations.value = [];
  } finally {
    reservationSearchLoading.value = false;
  }
};


onMounted(() => {
  getQuote();
  // getCustomers();
  getTransports();
  getVisas();
  getProfits();
  getHotels();
  getUsers();
  getReservations();
  getLocations();
  getSuppliers();
  //searchTransfers();
});

// Modal visibility states
const createModalVisible = ref(false);
const updateModalVisible = ref(false);

// Form data for quote creation
// Form data for quote creation
const newQuote = ref({
  name: "",
  customer_id: null,
  transport_id: null,
  transport_name: "",
  rate: null,
  visa_id: null,
  profit_id: null,
  adult: 1,
  children: 0,
  infant: 0,
  status: "draft",
  items: [
    {
      searchQuery: "",
      searchResults: [],
      showNoResults: false,
      loading: false,
      hotel_name: "",
      supplier_name: "",
      hotel_packages_id: null,
      reservation_ref: null,
      date_from: null,
      date_to: null
    }
  ]
});

const removeQuoteItem = (index) => {
  newQuote.value.items.splice(index, 1);
};
const removeUpdateQuoteItem = (index) => {
  currentQuote.value.items.splice(index, 1);
};

const addUpdateQuoteItem = () => {
  currentQuote.value.items.push({
    hotel_id: null,
    supplier_id: null,
    reservations_id: null
  });
};

const addQuoteItem = () => {
  newQuote.value.items.push({
    searchQuery: "",
    searchResults: [],
    showNoResults: false,
    loading: false,
    hotel_name: "",
    supplier_name: "",
    hotel_packages_id: null,
    reservation_ref: null,
    date_from: null,
    date_to: null
  });
};

// For updating existing quote
const currentQuote = ref({});

// Open Create Modal
const showCreateModal = () => {
  createModalVisible.value = true;
  createErrors.value = {};
};


const createQuote = async () => {
  createErrors.value = {};
  try {
    const formData = new FormData();
    formData.append("customer_id", newQuote.value.customer_id);
    formData.append("transport_packages_id", newQuote.value.transport_packages_id);
    formData.append("transport_id", newQuote.value.transport_id);
    formData.append("rate", newQuote.value.rate);
    formData.append("visa_id", newQuote.value.visa_id);
    formData.append("profit_id", newQuote.value.profit_id);
    formData.append("adult", newQuote.value.adult);
    formData.append("children", newQuote.value.children);
    formData.append("infant", newQuote.value.infant);
    formData.append(
        "valid_until",
        newQuote.value.valid_until
            ? dayjs(newQuote.value.valid_until).format("YYYY-MM-DD")
            : ""
    );
    formData.append("status", newQuote.value.status);

    console.log("Items payload:", newQuote.value.items);
    formData.append(
        "items",
        JSON.stringify(
            newQuote.value.items.map(item => ({
              hotel_id: item.hotel_id,
              hotel_packages_id: item.hotel_packages_id,
              reservation_ref: item.reservation_ref,
              date_from: item.date_from
                  ? dayjs(item.date_from).format("YYYY-MM-DD")
                  : null,
              date_to: item.date_to
                  ? dayjs(item.date_to).format("YYYY-MM-DD")
                  : null,
            }))
        )
    );

    console.log("Payload being sent:", formData);

    const response = await axios.post(`${apiBase}/quotes`, formData, {
      headers: {
        Authorization: getToken().headers.Authorization,
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.success) {
      Modal.success({
        title: "Success",
        content: "Quote created successfully!",
      });

      createModalVisible.value = false;
      getQuote();
    } else {
      Modal.error({
        title: "Error",
        content: response.data.message || "Failed to create quote.",
      });
    }
  } catch (error) {
    if (error.response?.data?.errors) {
      createErrors.value = error.response.data.errors;
    } else if (error.response?.data?.message) {
      createErrors.value.general = error.response.data.message;
    } else {
      createErrors.value.general = error.message;
    }
  }
};





// update modal
const openUpdateModal = (quote) => {
  currentQuote.value = {
    ...quote,
    from_location: quote.from_location?.id || null, // Extract ID from location object
    to_location: quote.to_location?.id || null,     // Extract ID from location object
    valid_until: quote.valid_until ? dayjs(quote.valid_until) : null,
    items: quote.items.map(item => ({
      ...item,
      hotel_id: item.hotel_id || null,
      supplier_id: item.supplier_id || null,
      reservations_id: item.reservations_id || null
    }))
  };
  updateModalVisible.value = true;
};


// Update Quote
const updateQuote = async () => {
  try {
    const formattedData = {
      name: currentQuote.value.name,
      customer_id: currentQuote.value.customer_id,
      from_location: currentQuote.value.from_location,
      to_location: currentQuote.value.to_location,
      transport_id: currentQuote.value.transport_id,
      rate: currentQuote.value.rate,
      visa_id: currentQuote.value.visa_id,
      profit_id: currentQuote.value.profit_id,
      valid_until: currentQuote.value.valid_until
        ? dayjs(currentQuote.value.valid_until).format('YYYY-MM-DD')
        : null,
      status: currentQuote.value.status,
      items: JSON.stringify(
        currentQuote.value.items.map(item => ({
          hotel_id: item.hotel_id,
          supplier_id: item.supplier_id,
          reservations_id: item.reservations_id
        }))
      )
    };

    const response = await axios.put(
      `${apiBase}/quotes/${currentQuote.value.id}`,
      formattedData,
      getToken()
    );

    if (response.data) {

      // Then close the modal and refresh
      updateModalVisible.value = false;
      getQuote(currentPage.value);
      await getQuote();
      showNotification({
        type: 'success',
        message: 'Quote updated successfully!'
      });
    }
    updateModalVisible.value = false;
  } catch (error) {
    console.error('Error updating quote:', error);
    updateModalVisible.value = false;
    showNotification({
      type: 'error',
      message: error.response?.data?.message || 'Failed to update quote.'
    });
  }
};



// Delete Quote
const deleteQuote = async (id) => {
  try {
    await axios.delete(`${apiBase}/quotes/${id}`, getToken());
    showNotification({
      type: 'success',
      message: 'Quote deleted successfully!'
    });
    getQuote(currentPage.value);
  } catch (error) {
    console.error('Error deleting quote:', error);
    showNotification({
      type: 'error',
      message: error.response?.data?.message || 'Failed to delete quote.'
    });
  }
};


// Date picker disabled dates function
const disabledDate = (current) => {
  // Can not select days before today
  return current && current < dayjs().startOf('day');
};


// watch([
//   () => newQuote.value.from_location,
//   () => newQuote.value.to_location,
//   () => newQuote.value.transport_id
// ], async ([fromLocation, toLocation, transportId]) => {
//   if (fromLocation && toLocation && transportId) {
//     // All required fields are selected, search for rate
//     const rate = await searchRate(fromLocation, toLocation, transportId);
//     if (rate !== undefined) {
//       newQuote.value.rate = rate;
//     }
//   } else {
//     // Reset rate if any field is deselected
//     newQuote.value.rate = null;
//   }
// }, { immediate: false });
//
// // Similarly for the update modal
// watch([
//   () => currentQuote.value.from_location,
//   () => currentQuote.value.to_location,
//   () => currentQuote.value.transport_id
// ], async ([fromLocation, toLocation, transportId]) => {
//   if (fromLocation && toLocation && transportId) {
//     const rate = await searchRate(fromLocation, toLocation, transportId);
//     if (rate !== undefined) {
//       currentQuote.value.rate = rate;
//     }
//   } else {
//     currentQuote.value.rate = null;
//   }
// }, { immediate: false });
</script>

<style scoped>
/* You can style the modal, buttons, etc. here */
</style>