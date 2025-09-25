<template>
  <MainLayout>
    <div class="overflow-x-auto bg-white rounded-lg shadow-md">
      <!-- Quote Item Table -->
      <p class="text-2xl font-bold text-center py-8">Quote Items Table</p>

      <!-- Create Button -->
      <div class="flex items-center justify-end m-4">
        <button @click="showCreateModal"
          class="px-4 flex items-center justify-end py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition feature-200">
          <Icon icon="mdi:plus-circle" class="mr-2" /> Create Quote Item
        </button>
      </div>

      <!-- Table -->
      <table class="min-w-full table-auto shadow-lg rounded-lg overflow-hidden">
        <thead class="bg-gray-200">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quote</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Item Type</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Item</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Unit Cost</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- Quote Item Row Example -->
          <tr v-for="(quoteItem, index) in quoteItems" :key="index"
            :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'">
            <td class="px-6 py-4 text-sm text-gray-800">{{ quoteItem.quote }}</td>
            <td class="px-6 py-4 text-sm text-gray-800">{{ quoteItem.item_type }}</td>
            <td class="px-6 py-4 text-sm text-gray-800">{{ quoteItem.item }}</td>
            <td class="px-6 py-4 text-sm text-gray-800">{{ quoteItem.description }}</td>
            <td class="px-6 py-4 text-sm text-gray-800">{{ quoteItem.quantity }}</td>
            <td class="px-6 py-4 text-sm text-gray-800">{{ quoteItem.unit_cost }}</td>
            <td class="px-6 py-4 text-sm text-gray-800">
              <button @click="showUpdateModal(quoteItem)"
                class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400">
                <Icon icon="mdi:pencil-outline" class="w-5 h-5" />
              </button>
              <button @click="deleteQuoteItem(quoteItem.id)"
                class="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400">
                <Icon icon="mdi:delete-outline" class="w-5 h-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>

    </div>

    <!-- Create Quote Item Modal -->
    <a-modal v-model:visible="createModalVisible" title="Create New Quote Item" @ok="createQuoteItem">
      <form @submit.prevent="createQuoteItem">
        <div class="grid grid-cols-1 gap-4">
          <!-- Quote Select -->
          <div>
            <label for="quote" class="block text-gray-700">Quote</label>
            <a-select v-model="newQuoteItem.quote" placeholder="Select Quote" class="w-full" required>
              <a-select-option v-for="quote in quotes" :key="quote.id" :value="quote.id">
                {{ quote.id }} - {{ quote.customer }} ({{ quote.total_cost }} {{ quote.currency }})
              </a-select-option>
            </a-select>
          </div>

          <!-- Item Type Select -->
          <div>
            <label for="item_type" class="block text-gray-700">Item Type</label>
            <a-select v-model="newQuoteItem.item_type" placeholder="Select Item Type" class="w-full" required>
              <a-select-option value="Product">Product</a-select-option>
              <a-select-option value="Service">Service</a-select-option>
            </a-select>
          </div>

          <!-- Item Select -->
          <div>
            <label for="item" class="block text-gray-700">Item</label>
            <a-select v-model="newQuoteItem.item" placeholder="Select Item" class="w-full" required>
              <a-select-option v-for="item in availableItems" :key="item.id" :value="item.name">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </div>

          <!-- Description Input -->
          <div>
            <label for="description" class="block text-gray-700">Description</label>
            <input id="description" v-model="newQuoteItem.description" type="text"
              class="w-full p-2 border rounded-md" />
          </div>

          <!-- Quantity Input -->
          <div>
            <label for="quantity" class="block text-gray-700">Quantity</label>
            <input id="quantity" v-model="newQuoteItem.quantity" type="number" class="w-full p-2 border rounded-md"
              required />
          </div>

          <!-- Unit Cost Input -->
          <div>
            <label for="unit_cost" class="block text-gray-700">Unit Cost</label>
            <input id="unit_cost" v-model="newQuoteItem.unit_cost" type="number" class="w-full p-2 border rounded-md"
              required />
          </div>
        </div>
      </form>
    </a-modal>

    <!-- Update Quote Item Modal -->
    <a-modal v-model:visible="updateModalVisible" title="Update Quote Item" @ok="updateQuoteItem">
      <form @submit.prevent="updateQuoteItem">
        <div class="grid grid-cols-1 gap-4">
          <!-- Quote Select -->
          <div>
            <label for="update_quote" class="block text-gray-700">Quote</label>
            <a-select v-model="currentQuoteItem.quote" placeholder="Select Quote" class="w-full" required>
              <a-select-option v-for="quote in quotes" :key="quote.id" :value="quote.id">
                {{ quote.id }} - {{ quote.customer }} ({{ quote.total_cost }} {{ quote.currency }})
              </a-select-option>
            </a-select>
          </div>

          <!-- Item Type Select -->
          <div>
            <label for="update_item_type" class="block text-gray-700">Item Type</label>
            <a-select v-model="currentQuoteItem.item_type" placeholder="Select Item Type" class="w-full" required>
              <a-select-option value="Product">Product</a-select-option>
              <a-select-option value="Service">Service</a-select-option>
            </a-select>
          </div>

          <!-- Item Select -->
          <div>
            <label for="update_item" class="block text-gray-700">Item</label>
            <a-select v-model="currentQuoteItem.item" placeholder="Select Item" class="w-full" required>
              <a-select-option v-for="item in availableItems" :key="item.id" :value="item.name">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </div>

          <!-- Description Input -->
          <div>
            <label for="update_description" class="block text-gray-700">Description</label>
            <input id="update_description" v-model="currentQuoteItem.description" type="text"
              class="w-full p-2 border rounded-md" />
          </div>

          <!-- Quantity Input -->
          <div>
            <label for="update_quantity" class="block text-gray-700">Quantity</label>
            <input id="update_quantity" v-model="currentQuoteItem.quantity" type="number"
              class="w-full p-2 border rounded-md" required />
          </div>

          <!-- Unit Cost Input -->
          <div>
            <label for="update_unit_cost" class="block text-gray-700">Unit Cost</label>
            <input id="update_unit_cost" v-model="currentQuoteItem.unit_cost" type="number"
              class="w-full p-2 border rounded-md" required />
          </div>
        </div>
      </form>
    </a-modal>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue';
import { Modal } from 'ant-design-vue';
import { Icon } from '@iconify/vue';
import MainLayout from "@/components/layouts/mainLayout.vue";

// Static data for dropdowns (Quotes, Available Items)
const quotes = ref([
  { id: 1, customer: 'John Doe', total_cost: 1000, currency: 'USD' },
  { id: 2, customer: 'Jane Smith', total_cost: 1500, currency: 'EUR' },
]);

const availableItems = ref([
  { id: 1, name: 'Product A' },
  { id: 2, name: 'Service B' },
]);

// Quote Items data (static for now)
const quoteItems = ref([
  {
    id: 1,
    quote: 1,
    item_type: 'Product',
    item: 'Product A',
    description: 'Item A description',
    quantity: 10,
    unit_cost: 100,
  },
]);

// Modal visibility states
const createModalVisible = ref(false);
const updateModalVisible = ref(false);

// Form data for quote item creation
const newQuoteItem = ref({
  quote: 1,  // Default value
  item_type: 'Product',  // Default value
  item: 'Product A',  // Default value
  description: '',
  quantity: 1,
  unit_cost: 100,
});

// Current quote item for updating
const currentQuoteItem = ref({
  id: null,
  quote: '',
  item_type: '',
  item: '',
  description: '',
  quantity: 0,
  unit_cost: 0,
});

// Open Create Quote Item Modal
const showCreateModal = () => {
  newQuoteItem.value = { quote: 1, item_type: 'Product', item: 'Product A', description: '', quantity: 1, unit_cost: 100 };
  createModalVisible.value = true;
};

// Open Update Quote Item Modal
const showUpdateModal = (quoteItem) => {
  currentQuoteItem.value = { ...quoteItem };
  updateModalVisible.value = true;
};

// Create Quote Item
const createQuoteItem = () => {
  quoteItems.value.push({ ...newQuoteItem.value, id: quoteItems.value.length + 1 });
  createModalVisible.value = false;
};

// Update Quote Item
const updateQuoteItem = () => {
  const index = quoteItems.value.findIndex(item => item.id === currentQuoteItem.value.id);
  if (index !== -1) {
    quoteItems.value[index] = { ...currentQuoteItem.value };
  }
  updateModalVisible.value = false;
};

// Delete Quote Item
const deleteQuoteItem = (id) => {
  const index = quoteItems.value.findIndex(item => item.id === id);
  if (index !== -1) {
    quoteItems.value.splice(index, 1);
  }
};
</script>

<style scoped>
/* Add any additional styles here */
</style>
