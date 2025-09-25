<template>
  <MainLayout>
    <div class="overflow-x-auto bg-white rounded-lg ">
      <!-- Hotels List Header -->
      <p class="text-2xl font-bold text-center">HOTEL PACKAGE LIST</p>

      <!-- Search and Per Page Controls -->
      <div class="flex flex-wrap items-center justify-between gap-4 p-4">
        <div class="flex items-center gap-2">
          <label for="hotel-search" class="font-medium">Search Hotel:</label>
          <input type="search" placeholder="Search hotel name" class="search_input" v-model="search"
            :disabled="isHotelsLoading" @input="onSearchInput" />
        </div>



        <!-- Create Button -->
        <button @click="showCreateModal"
          class="px-4 flex items-center py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition feature-200">
          <Icon icon="mdi:plus-circle" class="mr-2" /> Add New Package
        </button>
      </div>
      <!-- Loader -->
      <div v-if="isHotelsLoading" class="flex justify-center items-center p-8">
        <a-spin size="large" />
      </div>

      <div class="overflow-x-auto rounded-xl shadow-lg bg-gradient-to-br from-slate-50 to-blue-50">
        <table class="min-w-full border-collapse bg-white rounded-lg overflow-hidden">
          <!-- Table Header -->
          <thead class="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">
            <tr>
              <th rowspan="2" class="px-6 py-4 text-left font-bold text-sm tracking-wide border-r border-blue-500/30">
                <div class="flex items-center gap-2">
                  <Icon icon="mdi:domain" class="w-5 h-5" />
                  SUPPLIERS
                </div>
              </th>
              <th rowspan="2" class="px-6 py-4 text-left font-bold text-sm tracking-wide border-r border-blue-500/30">
                <div class="flex items-center gap-2">
                  <Icon icon="mdi:hotel" class="w-5 h-5" />
                  HOTEL
                </div>
              </th>
              <th colspan="2" class="px-6 py-4 font-bold text-sm tracking-wide text-center border-r border-blue-500/30">
                <div class="flex items-center justify-center gap-2">
                  <Icon icon="mdi:calendar-range" class="w-5 h-5" />
                  PERIOD
                </div>
              </th>
              <!--              <th rowspan="2" class="px-6 py-4 font-bold text-sm tracking-wide text-center border-r border-blue-500/30">-->
              <!--                <div class="flex items-center justify-center gap-2">-->
              <!--                  <Icon icon="mdi:calendar-clock" class="w-5 h-5" />-->
              <!--                  Days-->
              <!--                </div>-->
              <!--              </th>-->
              <th rowspan="2" class="px-6 py-4 font-bold text-sm tracking-wide text-center border-r border-blue-500/30">
                <div class="flex items-center justify-center gap-2">
                  <Icon icon="mdi:calendar-week" class="w-5 h-5" />
                  DAYS
                </div>
              </th>
              <th colspan="2" class="px-6 py-4 font-bold text-sm tracking-wide text-center border-r border-blue-500/30">
                <div class="flex items-center justify-center gap-2">
                  <Icon icon="mdi:bed" class="w-5 h-5" />
                  ROOM
                </div>
              </th>
              <th colspan="2" class="px-6 py-4 font-bold text-sm tracking-wide text-center border-r border-blue-500/30">
                <div class="flex items-center justify-center gap-2">
                  <Icon icon="mdi:star-plus" class="w-5 h-5" />
                  SUPPLIMENTS
                </div>
              </th>
              <th colspan="2" class="px-6 py-4 font-bold text-sm tracking-wide text-center border-r border-blue-500/30">
                <div class="flex items-center justify-center gap-2">
                  MEALN PLAN
                </div>
              </th>
              <th rowspan="2" class="px-6 py-4 font-bold text-sm tracking-wide text-center">
                <div class="flex items-center justify-center gap-2">
                  <Icon icon="mdi:cog" class="w-5 h-5" />
                  Actions
                </div>
              </th>
            </tr>
            <tr class="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600">
              <th class="px-4 py-3 font-semibold text-xs uppercase tracking-wider border-r border-blue-400/30">From</th>
              <th class="px-4 py-3 font-semibold text-xs uppercase tracking-wider border-r border-blue-400/30">Till</th>
              <th class="px-4 py-3 font-semibold text-xs uppercase tracking-wider border-r border-blue-400/30">DBL</th>
              <th class="px-4 py-3 font-semibold text-xs uppercase tracking-wider border-r border-blue-400/30">EX.BED
              </th>
              <th class="px-4 py-3 font-semibold text-xs uppercase tracking-wider border-r border-blue-400/30">Haram+
              </th>
              <th class="px-4 py-3 font-semibold text-xs uppercase tracking-wider border-r border-blue-400/30">Kaaba+
              </th>
              <th class="px-4 py-3 font-semibold text-xs uppercase tracking-wider border-r border-blue-400/30">B.B</th>
              <th class="px-4 py-3 font-semibold text-xs uppercase tracking-wider">L/D</th>
            </tr>
          </thead>

          <!-- Table Body -->
          <!-- Simplified Table Body -->
          <tbody class="text-sm">
            <tr v-for="(hotel, index) in hotels" :key="index"
              :class="index % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50 hover:bg-slate-100'"
              class="transition-all duration-200 border-b border-gray-200">

              <!-- Supplier -->
              <td class="px-6 py-4 font-bold text-gray-800 border-r border-gray-200">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {{ hotel.supplier?.name.charAt(0) || 'N/A' }}
                  </div>
                  <span>{{ hotel.supplier?.name || 'N/A' }}</span>
                </div>
              </td>

              <!-- Hotel -->
              <td class="px-6 py-4 font-semibold text-gray-800 border-r border-gray-200">
                {{ hotel?.hotel?.name || 'N/A' }}
              </td>

              <!-- Period -->
              <td class="px-4 py-4 text-center border-r border-gray-200" v-for="value in hotel.hotelpackageitems">
                <span class="text-gray-700"> {{ value.period_from ?
                  dayjs(value.period_from).format("DDMMM").toUpperCase() : 'N/A' }}</span>
              </td>
              <td class="px-4 py-4 text-center border-r border-gray-200" v-for="value in hotel.hotelpackageitems">
                <span class="text-gray-700"> {{ value.period_till ?
                  dayjs(value.period_till).format("DDMMM").toUpperCase() : 'N/A' }}</span>
              </td>
              <!--              <td class="px-4 py-4 text-center border-r border-gray-200" v-for="value in hotel.hotelpackageitems">-->
              <!--                <span class="font-bold text-gray-800">{{ value.numberofdays || 0 }}</span>-->
              <!--              </td>-->

              <!-- Days -->
              <td class=" py-4 text-center border-r border-gray-200">
                <div class="text-xs font-semibold">
                  <div class="text-blue-600">W.D</div>
                  <div class="border-t border-gray-300 my-1"></div>
                  <div class="text-orange-600">W.E</div>
                </div>
              </td>

              <!-- Room Rates -->
              <td class="py-4 text-center border-r border-gray-200" v-for="value in hotel.hotelpackageitems">
                <div>
                  <div class="text-gray-800 font-bold">{{ Number(value.days_wd || 0) }}</div>
                  <hr>
                  <div class="text-sm text-gray-500">{{ Number(value.days_we || 0) }}</div>
                </div>
              </td>
              <td class="px-4 py-4 text-center border-r border-gray-200" v-for="value in hotel.hotelpackageitems">
                <span class="font-semibold text-gray-800">{{ Number(value.extra_bed_rate || 0) }}
                </span>
              </td>

              <!-- Supplements & Meals -->
              <td class="px-4 py-4 text-center border-r border-gray-200" v-for="value in hotel.hotelpackageitems">
                <span class="text-gray-700">{{ value.suppliment_haram || 0 }}</span>
              </td>
              <td class="px-4 py-4 text-center border-r border-gray-200" v-for="value in hotel.hotelpackageitems">
                <span class="text-gray-700">{{ value.suppliment_kaaba || 0 }}</span>
              </td>
              <td class="px-4 py-4 text-center border-r border-gray-200" v-for="value in hotel.hotelpackageitems">
                <span class="text-gray-700">{{ value.mealn_plan_bb || 0 }}</span>
              </td>
              <td class="px-4 py-4 text-center border-r border-gray-200" v-for="value in hotel.hotelpackageitems">
                <span class="text-gray-700">{{ value.mealn_plan_ld || 0 }}</span>
              </td>

              <!-- Actions (kept colorful) -->
              <td class="px-6 py-4">
                <div class="flex gap-2 justify-center items-center">
                  <!-- buttons remain same as your code -->
                  <button @click="openRatesModal(hotel)"
                    class="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    title="View Details">
                    <Icon icon="mdi:eye-outline" class="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
<!--                  <button @click="showUpdateModal(hotel)"-->
<!--                    class="group bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white p-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"-->
<!--                    title="Edit Hotel">-->
<!--                    <Icon icon="mdi:pencil-outline" class="w-5 h-5 group-hover:scale-110 transition-transform" />-->
<!--                  </button>-->
                  <a-popconfirm title="Are you sure you want to delete this hotel?" @confirm="deleteHotel(hotel.id)"
                    ok-text="Yes" cancel-text="No">
                    <button
                      class="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      title="Delete Hotel">
                      <Icon icon="mdi:delete-outline" class="w-5 h-5 group-hover:scale-110 transition-transform" />
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
        @change="getHotels($event)" @showSizeChange="(current, pageSize) => (itemsPerPage = pageSize)" />


      <!--View Rates-->
      <a-modal v-model:open="showRatesModal" :title="`Room Rates for ${selectedHotelName}`" @ok="showRatesModal = false"
        @cancel="showRatesModal = false" width="1000px">
        <div class="mb-4 p-4 bg-gray-100 rounded-md shadow-sm">
          <div class="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-100 rounded-md shadow-sm">
          <p><strong>Customer Name:</strong> {{ selectedHotel?.supplier?.name || 'N/A' }}</p>
          <p><strong>Reg No.:</strong> {{ selectedHotel?.res_no || 'N/A' }}</p>
          <p><strong>Hotel Name:</strong> {{ selectedHotel?.hotel?.name || selectedHotel?.name || 'N/A' }}</p>
          <p><strong>City:</strong> {{ selectedHotel?.city || 'N/A' }}</p>
          <p><strong>Meal Plan B/B:</strong> {{ selectedHotel?.mealn_plan_bb ?? 'N/A' }}</p>
          <p><strong>Meal Plan L/D:</strong> {{ selectedHotel?.mealn_plan_ld ?? 'N/A' }}</p>
          <p><strong>Description:</strong> {{ selectedHotel?.hotel?.description || 'N/A' }}</p>
          </div>
        </div>
        <table class="min-w-full table-auto border border-gray-300 rounded-lg overflow-hidden">
          <thead class="bg-gray-200">
            <tr>
              <th class="px-4 py-2 text-left">Room Type</th>
              <th class="px-4 py-2 text-left">Rate/Night</th>
              <th class="px-4 py-2 text-left">Extra Bed</th>
              <th class="px-4 py-2 text-left">Weekend Rate</th>
              <th class="px-4 py-2 text-left">Adults</th>
              <th class="px-4 py-2 text-left">Children</th>
              <th class="px-4 py-2 text-left">Infants</th>
              <th class="px-4 py-2 text-left">Valid Until</th>
            </tr>
          </thead>
          <tbody>
          <tr v-for="(rate, idx) in selectedHotelRates" :key="idx" class="border-b border-gray-200">
            <td class="px-4 py-2">{{ rate.room_type || 'N/A' }}</td>
            <td class="px-4 py-2">{{ rate.days_wd || '0.00' }}</td>
            <td class="px-4 py-2">{{ selectedHotel?.extra_bed_rate || 0 }}</td>
            <td class="px-4 py-2">{{ rate.days_we || '0.00' }}</td>
            <td class="px-4 py-2">{{ rate.adults || '0' }}</td>
            <td class="px-4 py-2">{{ rate.children || '0' }}</td>
            <td class="px-4 py-2">{{ rate.infant || '0' }}</td>
            <td class="px-4 py-2">
              {{ selectedHotel?.period_till ? new Date(selectedHotel.period_till).toLocaleDateString() : 'N/A' }}
            </td>
          </tr>
          <tr v-if="selectedHotelRates.length === 0">
            <td colspan="8" class="px-4 py-2 text-center text-gray-500">No rates available</td>
          </tr>
          </tbody>

        </table>
      </a-modal>

      <!-- Empty State -->
      <div v-if="!isHotelsLoading && hotels.length === 0" class="text-center py-8">
        <p class="text-gray-500">No hotels found. Create one to get started.</p>
      </div>
    </div>


    <!-- Create Hotel Modal -->
    <a-modal v-model:open="createModalVisible" title="Add New Hotel Package" :confirm-loading="isCreating" width="1200px">
      <div class="h-[500px] overflow-auto">
        <form @submit.prevent="createHotel">
          <div class="grid grid-cols-2 gap-4">
            <!-- hotel id -->
            <div>
              <label for="name" class="block text-gray-700">Hotel <span class="text-red-500">*</span></label>
              <a-select id="supplier" v-model:value="newHotel.hotel_id" show-search placeholder="Search Supplier"
                :filter-option="false" :loading="isHotelLoading"
                :not-found-content="isHotelLoading ? 'Loading...' : 'No supplier found'" @search="handleHotelSearch"
                class="w-full">
                <a-select-option v-for="hotel in hotelList" :key="hotel.id" :value="hotel.id">
                  {{ hotel.name }}
                </a-select-option>
              </a-select>
              <p v-if="createErrors.hotel_id" class="text-red-500 text-sm mt-1">
                {{ createErrors.hotel_id[0] }}
              </p>

            </div>
            <!-- supplier -->
            <div>
              <label for="supplier" class="block text-gray-700">Supplier <span class="text-red-500">*</span></label>
              <a-select id="supplier" v-model:value="newHotel.supplier_id" show-search placeholder="Search Supplier"
                :filter-option="false" :loading="isSupplierLoading"
                :not-found-content="isSupplierLoading ? 'Loading...' : 'No supplier found'"
                @search="handleSupplierSearch" class="w-full">
                <a-select-option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                  {{ supplier.name }}
                </a-select-option>
              </a-select>
              <p v-if="createErrors.supplier_id" class="text-red-500 text-sm mt-1">
                {{ createErrors.supplier_id[0] }}
              </p>
            </div>
            <!-- city -->
            <div>
              <label for="city" class="block text-gray-700">City <span class="text-red-500">*</span></label>
              <a-input id="city" v-model:value="newHotel.city" type="text" class="w-full  border rounded-md" required />
              <p v-if="createErrors.city" class="text-red-500 text-sm mt-1">{{ createErrors.city[0] }}</p>
            </div>


            <!-- res no -->
            <div>
              <label for="resno" class="block text-gray-700">Registration No. <span
                  class="text-red-500">*</span></label>
              <a-input-number id="resno" v-model:value="newHotel.res_no" type="text" class="w-full  border rounded-md"
                required />
              <p v-if="createErrors.res_no" class="text-red-500 text-sm mt-1">
                {{ createErrors.res_no[0] }}
              </p>
            </div>



<!--            <div>-->
<!--              <label for="description" class="block text-gray-700">Description</label>-->
<!--              <a-textarea id="description" v-model:value="newHotel.description" class="w-full p-2 border rounded-md"-->
<!--                rows="4" required />-->
<!--              <p v-if="createErrors.description" class="text-red-500 text-sm mt-1">-->
<!--                {{ createErrors.description[0] }}-->
<!--              </p>-->
<!--            </div>-->

            <!-- Room Rates Section -->

          </div>
          <div class="border-t pt-4 mt-4">
            <h3 class="text-lg font-semibold mb-4">Room Rates</h3>

            <div v-for="(rate, index) in newHotel.rates" :key="index" class="mb-6 p-4 border rounded-lg relative">
              <button v-if="newHotel.rates.length > 1" @click="removeRate(index)"
                class="absolute top-2 right-2 text-red-500 hover:text-red-700" type="button">
                <Icon icon="mdi:close-circle" class="w-6 h-6" />
              </button>

              <h4 class="font-medium mb-3">Rate {{ index + 1 }}</h4>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700">Room Type <span class="text-red-500">*</span></label>
                  <a-select v-model:value="rate.room_type" class="w-full" :showArrow="true"
                    placeholder="Select Room Type" required>
                    <a-select-option value="single">Single</a-select-option>
                    <a-select-option value="double">Double</a-select-option>
                    <a-select-option value="triple">Triple</a-select-option>
                    <a-select-option value="quad">Quad</a-select-option>
                  </a-select>
                  <p v-if="createErrors.rates && createErrors.rates[index]?.room_type"
                    class="text-red-500 text-sm mt-1">
                    {{ createErrors.rates[index].room_type[0] }}
                  </p>
                </div>

                <!-- days_week -->
                <div>
                  <label class="block text-gray-700">W.D Rate (USD)</label>
                  <a-input v-model:value="rate.days_wd" class="w-full" type="number" min="0" required />
                  <p v-if="createErrors.rates && createErrors.rates[index]?.days_wd" class="text-red-500 text-sm mt-1">
                    {{ createErrors.rates[index].days_wd[0] }}
                  </p>
                </div>
                <!-- Weekend Rate -->
                <div>
                  <label class="block text-gray-700">W.E Rate (USD)</label>
                  <a-input v-model:value="rate.days_we" class="w-full" type="number" min="0" required />
                  <p v-if="createErrors.rates && createErrors.rates[index]?.days_we" class="text-red-500 text-sm mt-1">
                    {{ createErrors.rates[index].days_we[0] }}
                  </p>
                </div>

                <!-- Extra Bed Rate -->
                <div>
                  <label class="block text-gray-700">Ex. Bed Rate (USD)</label>
                  <a-input v-model:value="rate.extra_bed_rate" class="w-full" type="number" min="0" required />
                  <p v-if="createErrors.rates && createErrors.rates[index]?.extra_bed_rate"
                    class="text-red-500 text-sm mt-1">
                    {{ createErrors.rates[index].extra_bed_rate[0] }}
                  </p>
                </div>

                <!-- mealn_plan_bb -->
                <div>
                  <label for="mealn_plan_bb" class="block text-gray-700">Mealn Plan B.B </label>
                  <a-input-number type="number" id="mealn_plan_bb" v-model:value="newHotel.mealn_plan_bb"
                    class="w-full  border rounded-md" required />
                  <p v-if="createErrors.mealn_plan_bb" class="text-red-500 text-sm mt-1">
                    {{ createErrors.mealn_plan_bb[0] }}
                  </p>
                </div>
                <!-- mealn_plan_ld -->
                <div>
                  <label for="mealn_plan_ld" class="block text-gray-700">Mealn Plan L/D </label>
                  <a-input-number id="mealn_plan_ld" v-model:value="newHotel.mealn_plan_ld" type="number"
                    class="w-full  border rounded-md" required />
                  <p v-if="createErrors.mealn_plan_ld" class="text-red-500 text-sm mt-1">
                    {{ createErrors.mealn_plan_ld[0] }}
                  </p>
                </div>
                <!-- Suppliment Haram -->
                <div>
                  <label for="suppliment_haram" class="block text-gray-700">Suppliments Haram+ </label>
                  <a-input-number id="suppliment_haram" v-model:value="newHotel.suppliment_haram" type="number"
                    class="w-full  border rounded-md" required />
                  <p v-if="createErrors.suppliment_haram" class="text-red-500 text-sm mt-1">
                    {{ createErrors.suppliment_haram[0] }}
                  </p>
                </div>

                <!-- Suppliment Kaaba -->
                <div>
                  <label for="suppliment_kaaba" class="block text-gray-700">Suppliments Kaaba+ </label>
                  <a-input-number id="suppliment_kaaba" v-model:value="newHotel.suppliment_kaaba" type="number"
                    class="w-full  border rounded-md" required />
                  <p v-if="createErrors.suppliment_kaaba" class="text-red-500 text-sm mt-1">
                    {{ createErrors.suppliment_kaaba[0] }}
                  </p>
                </div>


                <!-- period_from -->
                <div>
                  <label class="block text-gray-700">Period From</label>
                  <a-date-picker v-model:value="rate.period_from" class="w-full" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" />
                  <p v-if="createErrors.rates && createErrors.rates[index]?.period_from" class="text-red-500 text-sm mt-1">
                    {{ createErrors.rates[index].period_from[0] }}
                  </p>
                </div>
                <!-- period_to -->
                <div>
                  <label class="block text-gray-700">Period Till</label>
                  <a-date-picker v-model:value="rate.period_to" class="w-full" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" />
                  <p v-if="createErrors.rates && createErrors.rates[index]?.period_to" class="text-red-500 text-sm mt-1">
                    {{ createErrors.rates[index].period_to[0] }}
                  </p>
                </div>


<!--                <div>-->
<!--                  <label class="block text-gray-700">Number of Days <span class="text-red-500">*</span></label>-->
<!--                  <a-input v-model:value="rate.numberofdays" class="w-full" type="number" min="1" required />-->
<!--                  <p v-if="createErrors.rates && createErrors.rates[index]?.numberofdays"-->
<!--                    class="text-red-500 text-sm mt-1">-->
<!--                    {{ createErrors.rates[index].numberofdays[0] }}-->
<!--                  </p>-->
<!--                </div>-->
<!--                <div>-->
<!--                  <label class="block text-gray-700">Adults<span class="text-red-500">*</span></label>-->
<!--                  <a-input v-model:value="rate.adults" class="w-full" type="number" min="1" />-->
<!--                  <p v-if="createErrors.rates && createErrors.rates[index]?.adults" class="text-red-500 text-sm mt-1">-->
<!--                    {{ createErrors.rates[index].adults[0] }}-->
<!--                  </p>-->
<!--                </div>-->
<!--                <div>-->
<!--                  <label class="block text-gray-700">Children<span class="text-red-500">*</span></label>-->
<!--                  <a-input v-model:value="rate.children" class="w-full" type="number" min="1" />-->
<!--                  <p v-if="createErrors.rates && createErrors.rates[index]?.children" class="text-red-500 text-sm mt-1">-->
<!--                    {{ createErrors.rates[index].children[0] }}-->
<!--                  </p>-->
<!--                </div>-->
<!--                <div>-->
<!--                  <label class="block text-gray-700">Infant<span class="text-red-500">*</span></label>-->
<!--                  <a-input v-model:value="rate.infant" class="w-full" type="number" min="1" />-->
<!--                  <p v-if="createErrors.rates && createErrors.rates[index]?.infant" class="text-red-500 text-sm mt-1">-->
<!--                    {{ createErrors.rates[index].infant[0] }}-->
<!--                  </p>-->
<!--                </div>-->
<!--                <div>-->
<!--                  <label class="block text-gray-700">Currency<span class="text-red-500">*</span></label>-->
<!--                  <a-select v-model:value="rate.currency" class="w-full" placeholder="Select Currency" required>-->
<!--                    <a-select-option value="USD">USD</a-select-option>-->
<!--                    <a-select-option value="riyal">Riyal</a-select-option>-->
<!--                  </a-select>-->
<!--                  <p v-if="createErrors.rates && createErrors.rates[index]?.currency" class="text-red-500 text-sm mt-1">-->
<!--                    {{ createErrors.rates[index].currency[0] }}-->
<!--                  </p>-->
<!--                </div>-->
<!--                <div>-->
<!--                  <label class="block text-gray-700">Valid until<span class="text-red-500">*</span></label>-->
<!--                  <a-date-picker v-model:value="rate.valid_until" class="w-full" format="YYYY-MM-DD"-->
<!--                    value-format="YYYY-MM-DD" required />-->
<!--                  <p v-if="createErrors.rates && createErrors.rates[index]?.valid_until"-->
<!--                    class="text-red-500 text-sm mt-1">-->
<!--                    {{ createErrors.rates[index].valid_until[0] }}-->
<!--                  </p>-->
<!--                </div>-->

              </div>
            </div>

            <!-- <div class="mt-4">
              <a-button @click="addRate" type="dashed" class="w-full">
                Add Another Rate
              </a-button>
            </div> -->
          </div>
        </form>
      </div>
      <template #footer>
        <a-button key="back" @click="createModalVisible = false">Cancel</a-button>
        <a-button key="submit" type="primary" :loading="isCreating" @click="createHotel">
          Submit
        </a-button>
      </template>
    </a-modal>

    <!-- Update Hotel Modal -->
    <a-modal v-model:open="updateModalVisible" width="1200px" title="Update Hotel" @ok="updateHotel"
      :confirm-loading="isUpdating">
      <div class="h-[500px] overflow-auto">
        <form @submit.prevent="updateHotel">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="name" class="block text-gray-700">Hotel Name <span class="text-red-500">*</span></label>
              <a-select id="supplier" v-model:value="newHotel.hotel_id" show-search placeholder="Search Supplier"
                :filter-option="false" :loading="isHotelLoading"
                :not-found-content="isHotelLoading ? 'Loading...' : 'No supplier found'" @search="handleHotelSearch"
                class="w-full">
                <a-select-option v-for="hotel in hotelList" :key="hotel.id" :value="hotel.id">
                  {{ hotel.name }}
                </a-select-option>
              </a-select>
              <p v-if="updateErrors.hotel_id" class="text-red-500 text-sm mt-1">
                {{ updateErrors.hotel_id[0] }}
              </p>
            </div>

            <div>
              <label for="city" class="block text-gray-700">City <span class="text-red-500">*</span></label>
              <a-input id="city" v-model:value="currentHotel.city" type="text" class="w-full border rounded-md"
                required />
              <p v-if="updateErrors.city" class="text-red-500 text-sm mt-1">{{ updateErrors.city[0] }}</p>
            </div>

            <div>
              <label for="supplier" class="block text-gray-700">Supplier <span class="text-red-500">*</span></label>
              <a-select id="supplier" v-model:value="currentHotel.supplier_id" show-search placeholder="Search Supplier"
                :filter-option="false" :loading="isSupplierLoading"
                :not-found-content="isSupplierLoading ? 'Loading...' : 'No supplier found'"
                @search="handleSupplierSearch" class="w-full">
                <a-select-option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                  {{ supplier.name }}
                </a-select-option>
              </a-select>
              <p v-if="updateErrors.supplier_id" class="text-red-500 text-sm mt-1">
                {{ updateErrors.supplier_id[0] }}
              </p>
            </div>
            <div>
              <label for="resno" class="block text-gray-700">Reg No. <span class="text-red-500">*</span></label>
              <a-input id="resno" v-model:value="currentHotel.res_no" class="w-full p-2 border rounded-md" rows="4"
                required />
              <p v-if="updateErrors.res_no" class="text-red-500 text-sm mt-1">{{ updateErrors.res_no[0] }}</p>
            </div>
            <div>
              <label for="meal_plan_bb" class="block text-gray-700">Meal Plan BB <span
                  class="text-red-500">*</span></label>
              <a-input-number id="meal_plan_bb" v-model:value="currentHotel.meal_plan_bb" type="number"
                class="w-full  border rounded-md" required />
              <p v-if="updateErrors.meal_plan_bb" class="text-red-500 text-sm mt-1">{{ updateErrors.meal_plan_bb[0] }}
              </p>
            </div>

            <div>
              <label for="meal_plan_ld" class="block text-gray-700">Meal Plan LD <span
                  class="text-red-500">*</span></label>
              <a-input-number id="meal_plan_ld" v-model:value="currentHotel.meal_plan_ld" type="number"
                class="w-full  border rounded-md" required />
              <p v-if="updateErrors.meal_plan_ld" class="text-red-500 text-sm mt-1">{{ updateErrors.meal_plan_ld[0] }}
              </p>

            </div>

            <div>
              <label for="suppliment_haram" class="block text-gray-700">Suppliment Haram</label>
              <a-input-number id="suppliment_haram" v-model:value="currentHotel.suppliment_haram" type="number"
                class="w-full  border rounded-md" required />
              <p v-if="updateErrors.suppliment_haram" class="text-red-500 text-sm mt-1">{{
                updateErrors.suppliment_haram[0]
                }}</p>

            </div>

            <div>
              <label for="suppliment_kaaba" class="block text-gray-700">Suppliment Kaaba </label>
              <a-input-number id="suppliment_kaaba" v-model:value="currentHotel.suppliment_kaaba" type="number"
                class="w-full  border rounded-md" required />
              <p v-if="updateErrors.suppliment_kaaba" class="text-red-500 text-sm mt-1">{{
                updateErrors.suppliment_kaaba[0]
                }}</p>

            </div>

            <div>
              <label for="description" class="block text-gray-700">Description</label>
              <a-textarea id="description" v-model:value="currentHotel.description" class="w-full p-2 border rounded-md"
                rows="4" required />
              <p v-if="updateErrors.description" class="text-red-500 text-sm mt-1">{{ updateErrors.description[0] }}</p>

            </div>

            <!-- Room Rates Section -->


          </div>
          <div class="border-t pt-4 mt-4">
            <h3 class="text-lg font-semibold mb-4">Room Rates</h3>

            <div v-for="(rate, index) in currentHotel.rates" :key="index" class="mb-6 p-4 border rounded-lg relative">
              <button v-if="currentHotel.rates.length > 1" @click="removeRateUpdate(index)"
                class="absolute top-2 right-2 text-red-500 hover:text-red-700" type="button">
                <Icon icon="mdi:close-circle" class="w-6 h-6" />
              </button>

              <h4 class="font-medium mb-3">Rate {{ index + 1 }}</h4>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700">Room Type <span class="text-red-500">*</span></label>
                  <a-select v-model:value="rate.room_type" class="w-full" placeholder="Select Room Type" required>
                    <a-select-option value="single">Single</a-select-option>
                    <a-select-option value="double">Double</a-select-option>
                    <a-select-option value="triple">Triple</a-select-option>
                    <a-select-option value="quad">Quad</a-select-option>
                  </a-select>
                  <p v-if="updateErrors.rates && updateErrors.rates[index]?.room_type"
                    class="text-red-500 text-sm mt-1">
                    {{ updateErrors.rates[index].room_type[0] }}
                  </p>

                </div>

                <div>
                  <label class="block text-gray-700">Rate per Night (USD) <span class="text-red-500">*</span></label>
                  <a-input v-model:value="rate.rate_per_night" class="w-full" type="number" min="0" required />
                  <p v-if="updateErrors.rates && updateErrors.rates[index]?.rate_per_night"
                    class="text-red-500 text-sm mt-1">
                    {{ updateErrors.rates[index].rate_per_night[0] }}
                  </p>
                </div>
                <div>
                  <label class="block text-gray-700">Extra Bed Rate (USD) <span class="text-red-500">*</span></label>
                  <a-input v-model:value="rate.extra_bed_rate" class="w-full" type="number" min="0" required />
                  <p v-if="updateErrors.rates && updateErrors.rates[index]?.extra_bed_rate"
                    class="text-red-500 text-sm mt-1">
                    {{ updateErrors.rates[index].extra_bed_rate[0] }}
                  </p>
                </div>
                <div>
                  <label class="block text-gray-700">Weekend Rate (USD) <span class="text-red-500">*</span></label>
                  <a-input v-model:value="rate.weekend_rate" class="w-full" type="number" min="0" required />
                  <p v-if="updateErrors.rates && updateErrors.rates[index]?.weekend_rate"
                    class="text-red-500 text-sm mt-1">
                    {{ updateErrors.rates[index].weekend_rate[0] }}
                  </p>
                </div>
                <div>
                  <label class="block text-gray-700">Arrival Date <span class="text-red-500">*</span></label>
                  <a-date-picker v-model:value="rate.arrival" class="w-full" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" />
                  <p v-if="updateErrors.rates && updateErrors.rates[index]?.arrival" class="text-red-500 text-sm mt-1">
                    {{ updateErrors.rates[index].arrival[0] }}
                  </p>
                </div>
                <div>
                  <label class="block text-gray-700">Departure Date <span class="text-red-500">*</span></label>
                  <a-date-picker v-model:value="rate.depart" class="w-full" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" />
                  <p v-if="updateErrors.rates && updateErrors.rates[index]?.depart" class="text-red-500 text-sm mt-1">
                    {{ updateErrors.rates[index].depart[0] }}
                  </p>
                </div>
                <div>
                  <label class="block text-gray-700">Number of Days <span class="text-red-500">*</span></label>
                  <a-input v-model:value="rate.numberofdays" class="w-full" type="number" min="1" required />
                  <p v-if="updateErrors.rates && updateErrors.rates[index]?.numberofdays"
                    class="text-red-500 text-sm mt-1">
                    {{ updateErrors.rates[index].numberofdays[0] }}
                  </p>
                </div>
                <div>
                  <label class="block text-gray-700">Adults <span class="text-red-500">*</span></label>
                  <a-input v-model:value="rate.adults" class="w-full" type="number" min="1" />
                  <p v-if="updateErrors.rates && updateErrors.rates[index]?.adults" class="text-red-500 text-sm mt-1">
                    {{ updateErrors.rates[index].adults[0] }}
                  </p>
                </div>
                <div>
                  <label class="block text-gray-700">Children <span class="text-red-500">*</span></label>
                  <a-input v-model:value="rate.children" class="w-full" type="number" min="0" />
                  <p v-if="updateErrors.rates && updateErrors.rates[index]?.children" class="text-red-500 text-sm mt-1">
                    {{ updateErrors.rates[index].children[0] }}
                  </p>
                </div>
                <div>
                  <label class="block text-gray-700">Infant <span class="text-red-500">*</span></label>
                  <a-input v-model:value="rate.infant" class="w-full" type="number" min="0" />
                  <p v-if="updateErrors.rates && updateErrors.rates[index]?.infant" class="text-red-500 text-sm mt-1">
                    {{ updateErrors.rates[index].infant[0] }}
                  </p>
                </div>
                <div>
                  <label class="block text-gray-700">Currency <span class="text-red-500">*</span></label>
                  <a-select v-model:value="rate.currency" class="w-full" placeholder="Select Currency" required>
                    <a-select-option value="USD">USD</a-select-option>
                    <a-select-option value="riyal">Riyal</a-select-option>
                  </a-select>
                  <p v-if="updateErrors.rates && updateErrors.rates[index]?.currency" class="text-red-500 text-sm mt-1">
                    {{ updateErrors.rates[index].currency[0] }}
                  </p>
                </div>
                <div>
                  <label class="block text-gray-700">Valid until <span class="text-red-500">*</span></label>
                  <a-date-picker v-model:value="rate.valid_until" class="w-full" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" required />
                  <p v-if="updateErrors.rates && updateErrors.rates[index]?.valid_until"
                    class="text-red-500 text-sm mt-1">
                    {{ updateErrors.rates[index].valid_until[0] }}
                  </p>
                </div>
              </div>
            </div>

            <!-- <div class="mt-4">
              <a-button @click="addRateUpdate" type="dashed" class="w-full">
                Add Another Rate
              </a-button>
            </div> -->
          </div>
        </form>
      </div>
    </a-modal>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Modal } from 'ant-design-vue';
import { Icon } from '@iconify/vue';
import MainLayout from "@/components/layouts/mainLayout.vue";
import axios from 'axios';
import { apiBase } from '@/config';
import { getToken, showNotification } from '@/utilities/common';
import dayjs from "dayjs";

// States
const hotels = ref([]);
const isHotelsLoading = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);
const isDeleting = ref(false);

const createModalVisible = ref(false);
const updateModalVisible = ref(false);

const createErrors = ref({});
const updateErrors = ref({});
const itemsPerPage = ref(10);
const totalItems = ref(0);
const currPage = ref(1);
const from = ref(1);
const search = ref('');

// New hotel form
const newHotel = ref({
  hotel_id: '',
  supplier_id: null,
  res_no: '',
  city: '',
  description: '',
  rates: [
    {
      room_type: 'single',
      days_wd: 0,
      days_we: 0,
      extra_bed_rate: 0,
      suppliment_haram: 0,
      suppliment_kaaba: 0,
      mealn_plan_bb: '',
      mealn_plan_ld: '',
      period_from: '',
      period_till: '',
      numberofdays: 0,
      adults: 0,
      children: 0,
      infant: 0,
      currency: 'USD',
      valid_until: '',
    }
  ],
});

// Add/remove rate rows
const addRate = () => {
  newHotel.value.rates.push({
    room_type: '',
    days_wd: 0,
    days_we: 0,
    extra_bed_rate: 0,
    suppliment_haram: 0,
    suppliment_kaaba: 0,
    mealn_plan_bb: '',
    mealn_plan_ld: '',
    period_from: '',
    period_till: '',
    numberofdays: 0,
    adults: 0,
    children: 0,
    infant: 0,
    currency: 'USD',
    valid_until: '',
  });
};
const removeRate = (index) => {
  if (newHotel.value.rates.length > 1) {
    newHotel.value.rates.splice(index, 1);
  }
};

// Current hotel for update
const currentHotel = ref({
  id: null,
  hotel_id: '',
  supplier_id: null,
  res_no: '',
  city: '',
  description: '',
  rates: [
    {
      room_type: '',
      days_wd: 0,
      days_we: 0,
      extra_bed_rate: 0,
      suppliment_haram: 0,
      suppliment_kaaba: 0,
      mealn_plan_bb: '',
      mealn_plan_ld: '',
      period_from: '',
      period_till: '',
      numberofdays: 0,
      adults: 0,
      children: 0,
      infant: 0,
      currency: 'USD',
      valid_until: '',
    }
  ],
});
const removeRateUpdate = (index) => {
  if (currentHotel.value.rates.length > 1) {
    currentHotel.value.rates.splice(index, 1);
  }
};

// Pagination/search
let searchTimeout = null;
const onSearchInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currPage.value = 1;
    getHotels(1);
  }, 400);
};

// Fetch hotels
const getHotels = async (page = 1) => {
  isHotelsLoading.value = true;
  try {
    let url = `${apiBase}/hotel_packages?page=${page}&limit=${itemsPerPage.value}`;
    if (search.value) url += `&search=${encodeURIComponent(search.value)}`;
    const res = await axios.get(url, getToken());
    if (res.data && res.data.data) {
      hotels.value = res.data.data.data;
      totalItems.value = res.data?.data?.total;
      currPage.value = res.data?.data?.current_page;
      from.value = res.data?.data?.from;
    }
  } catch (error) {
    Modal.error({ title: "Error", content: "Failed to fetch hotels." });
  } finally {
    isHotelsLoading.value = false;
  }
};

// Supplier/hotel search
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
  clearTimeout(supplierSearchTimeout);
  supplierSearchLoading.value = true;
  supplierSearchQuery.value = value;
  supplierSearchTimeout = setTimeout(() => getSuppliers(value), 500);
};

const hotelSearchLoading = ref(false);
let hotelSearchTimeout = null;
const hotelSearchQuery = ref('');
const isHotelLoading = ref(false);
const hotelList = ref([]);
const getHotelList = async (query = '') => {
  isHotelLoading.value = true;
  try {
    const res = await axios.get(`${apiBase}/hotels?search=${encodeURIComponent(query)}`, getToken());
    if (res.data && res.data.data) {
      hotelList.value = res.data.data.data;
    }
  } catch (error) {
    showNotification('error', 'Failed to fetch hotels', error.message);
  } finally {
    isHotelLoading.value = false;
  }
};
const handleHotelSearch = (value) => {
  clearTimeout(hotelSearchTimeout);
  hotelSearchLoading.value = true;
  hotelSearchQuery.value = value;
  hotelSearchTimeout = setTimeout(() => getHotelList(value), 500);
};

onMounted(() => {
  getHotels();
  getSuppliers();
  getHotelList();
});

// Create Hotel Modal
const showCreateModal = () => {
  newHotel.value = {
    hotel_id: '',
    supplier_id: null,
    res_no: '',
    city: '',
    description: '',
    rates: [{
      room_type: 'single',
      days_wd: 0,
      days_we: 0,
      extra_bed_rate: 0,
      suppliment_haram: 0,
      suppliment_kaaba: 0,
      mealn_plan_bb: '',
      mealn_plan_ld: '',
      period_from: '',
      period_till: '',
      numberofdays: 0,
      adults: 0,
      children: 0,
      infant: 0,
      currency: 'USD',
      valid_until: '',
    }]
  };
  createModalVisible.value = true;
};

// Update Hotel Modal
const showUpdateModal = (hotel) => {
  currentHotel.value = { ...hotel };
  updateModalVisible.value = true;
};


const createHotel = async () => {
  isCreating.value = true;
  createErrors.value = {};

  try {
    // Prepare rates, converting empty dates to null
    const rates = newHotel.value.rates.map(rate => ({
      ...rate,
      period_from: rate.period_from || null,
      period_till: rate.period_till || null,
      valid_until: rate.valid_until || null,
      mealn_plan_bb: rate.mealn_plan_bb || null,
      mealn_plan_ld: rate.mealn_plan_ld || null,
      suppliment_haram: rate.suppliment_haram || 0,
      suppliment_kaaba: rate.suppliment_kaaba || 0,
      days_wd: rate.days_wd || 0,
      days_we: rate.days_we || 0,
      extra_bed_rate: rate.extra_bed_rate || 0
    }));

    const hotelData = {
      hotel_id: newHotel.value.hotel_id || null,
      supplier_id: newHotel.value.supplier_id || null,
      res_no: newHotel.value.res_no || null,
      city: newHotel.value.city || null,
      description: newHotel.value.description || '',
      rates: JSON.stringify(rates)
    };

    const response = await axios.post(`${apiBase}/hotel_packages`, hotelData, getToken());

    if (response.data.success) {
      // Add the hotel to the list
      const hotel = response.data.hotel;
      const hotelRates = response.data.rates || [];

      // Combine rates into hotel object for frontend rendering
      hotel.rates = hotelRates;

      hotels.value.unshift(hotel);

      createModalVisible.value = false;
      Modal.success({ title: 'Success', content: 'Hotel package created successfully!' });

      // Optionally refresh the hotel list
      await getHotels();
    }
  } catch (error) {
    if (error.response?.data?.errors) {
      createErrors.value = error.response.data.errors;
    } else {
      showNotification('error', 'Failed to create hotel package', error.message);
    }
  } finally {
    isCreating.value = false;
  }
};



// Update hotel
const updateHotel = async () => {
  isUpdating.value = true;
  updateErrors.value = {};

  const requiredFields = ['hotel_id', 'supplier_id', 'res_no', 'city'];
  let hasError = false;
  requiredFields.forEach(field => {
    if (!currentHotel.value[field] && currentHotel.value[field] !== 0) {
      updateErrors.value[field] = [`${field.replace('_', ' ')} is required`];
      hasError = true;
    }
  });

  currentHotel.value.rates.forEach((rate, index) => {
    updateErrors.value.rates = updateErrors.value.rates || [];
    updateErrors.value.rates[index] = updateErrors.value.rates[index] || {};
    [
      'mealn_plan_bb', 'mealn_plan_ld', 'period_from', 'period_till',
      'room_type', 'numberofdays', 'adults', 'children', 'infant',
      'currency', 'valid_until'
    ].forEach(field => {
      if (!rate[field] && rate[field] !== 0) {
        updateErrors.value.rates[index][field] = [`${field.replace('_', ' ')} is required`];
        hasError = true;
      }
    });
  });

  if (hasError) {
    isUpdating.value = false;
    return;
  }

  try {
    const hotelData = { ...currentHotel.value, rates: JSON.stringify(currentHotel.value.rates) };
    const response = await axios.put(`${apiBase}/hotel_packages/${currentHotel.value.id}`, hotelData, getToken());
    if (response.data?.success) {
      const index = hotels.value.findIndex(h => h.id === currentHotel.value.id);
      if (index !== -1) hotels.value[index] = response.data.data;
      updateModalVisible.value = false;
      await getHotels();
      Modal.success({ title: 'Success', content: 'Hotel updated successfully!' });
    }
  } catch (error) {
    if (error.response?.data?.errors) {
      updateErrors.value = error.response.data.errors;
    } else {
      Modal.error({ title: 'Error', content: 'Failed to update hotel. Please try again.' });
    }
  } finally {
    isUpdating.value = false;
  }
};

// Delete hotel
// const deleteHotel = async (id) => {
//   isDeleting.value = true;
//   try {
//     const res = await axios.delete(`${apiBase}/hotel_packages/${id}`, getToken());
//     if (res.status === 200 || res.data.success) {
//       hotels.value = hotels.value.filter(hotel => hotel.id !== id);
//       Modal.success({ title: 'Success', content: 'Hotel deleted successfully!' });
//     } else {
//       throw new Error('Delete failed on backend');
//     }
//   } catch (error) {
//     Modal.error({ title: 'Error', content: 'Failed to delete hotel. Please try again.' });
//   } finally {
//     isDeleting.value = false;
//   }
// };

const deleteHotel = async (id) => {
  isDeleting.value = true;
  try {
    const res = await axios.delete(`${apiBase}/hotel_packages/${id}`, {
      headers: getToken().headers
    });

    if (res.status === 200 && res.data.success) {
      // Remove deleted hotel from local state
      hotels.value = hotels.value.filter(hotel => hotel.id !== id);
      Modal.success({ title: 'Success', content: 'Hotel deleted successfully!' });
    } else {
      Modal.error({ title: 'Error', content: res.data.message || 'Delete failed on backend.' });
    }
  } catch (error) {
    Modal.error({ title: 'Error', content: error.response?.data?.message || error.message });
  } finally {
    isDeleting.value = false;
  }
};


// Rates modal
const showRatesModal = ref(false);
const selectedHotelRates = ref([]);
const selectedHotelName = ref('');
// const openRatesModal = (hotel) => {
//   selectedHotelRates.value = hotel.hotelpackageitems || [];
//   selectedHotelName.value = hotel.name;
//   showRatesModal.value = true;
// };

const selectedHotel = ref(null);
const openRatesModal = (hotel) => {
  selectedHotel.value = hotel; // full object
  selectedHotelRates.value = hotel.hotelpackageitems || [];
  selectedHotelName.value = hotel.hotel?.name || hotel.name; // fallback
  showRatesModal.value = true;
};

</script>
<style scoped>
.table-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>