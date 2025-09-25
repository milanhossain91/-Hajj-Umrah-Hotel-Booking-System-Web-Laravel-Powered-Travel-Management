<template>
  <MainLayout>
    <div class="overflow-x-auto bg-gray-50 min-h-screen">

      <!-- Header Buttons -->
      <div v-if="reportData.length > 0" class="flex space-x-4 mb-4 p-4">
        <button
          class="bg-blue-500 hover:bg-blue-600 flex items-center text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg"
          @click="printInvoice">
          <Icon icon="mdi:printer" class="mr-2" />
          Print Report
        </button>

        <button
          class="bg-blue-500 hover:bg-blue-600 flex items-center text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg"
          @click="downloadPDF"
        >
          <Icon icon="mdi:file-pdf-box" class="mr-2" />
          Download PDF
        </button>

        <button
          class="bg-green-500 hover:bg-green-600 flex items-center text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg"
          @click="downloadExcel"
        >
          <Icon icon="mdi:file-excel-box" class="mr-2" />
          Download Excel
        </button>
      </div>
      <h3 class="text-2xl font-extrabold text-center">Quote Report</h3>

      <!-- Customer Selection -->
      <div class="max-w-7xl mx-auto px-4 mb-8">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <label for="customer" class="block text-gray-700 font-bold mb-2">Customer</label>
          <a-select
              id="customer"
              show-search
              placeholder="Search Customer Name"
              :filter-option="false"
              :loading="isSupplierLoading"
              :not-found-content="isSupplierLoading ? 'Loading...' : 'No quote found'"
              @search="handleQuoteSearch"
              @change="handleQuoteSelect"
              class="w-full"
          >
            <a-select-option v-for="customer in customers" :key="customer?.id" :value="customer?.id">
              {{ customer?.name }}
            </a-select-option>
          </a-select>
        </div>
      </div>

      <!-- print section start -->
      <div class="max-w-7xl mx-auto p-4 bg-white print-section" ref="invoiceRef">
        <div v-for="quote in reportData.length ? reportData : [{}]" :key="quote.id || 'empty'"
          class="mb-8 border rounded-lg p-4 shadow-sm">

          <table class="w-full border-collapse border border-gray-400 mb-4 text-sm">
            <tr>
              <td class="text-white px-3 py-1 border border-gray-400 font-semibold" style="background-color: #001529">Name :</td>
              <td class="px-3 py-1 border border-gray-400" colspan="4">{{ quote.customer?.name || '' }}</td>
            </tr>

            <!-- Tickets Header -->
            <tr class="bg-black text-white">
              <th class="px-3 py-1 border border-gray-400 text-left" style="background-color: #001529">Tickets</th>
              <th class="px-3 py-1 border border-gray-400 text-left" style="background-color: #001529">Qty</th>
              <th class="px-3 py-1 border border-gray-400 text-left" style="background-color: #001529">Our cost</th>
              <th class="px-3 py-1 border border-gray-400 text-left" style="background-color: #001529">Our Cost</th>
            </tr>

            <!-- Tickets Rows -->
            <tr class="bg-gray-100">
              <td class="px-3 py-1 border border-gray-400">Adults</td>
              <td class="px-3 py-1 border border-gray-400 text-right"> {{  quote?.adult || 0 }}</td>
              <td class="px-3 py-1 border border-gray-400">£</td>
              <td class="px-3 py-1 border border-gray-400 text-right">
                <div class="flex justify-between items-center">
                  <span>£</span><span>-</span>
                </div>
              </td>
            </tr>
            <tr class="bg-white">
              <td class="px-3 py-1 border border-gray-400">Children</td>
              <td class="px-3 py-1 border border-gray-400 text-right">{{ quote?.children || 0 }}</td>
              <td class="px-3 py-1 border border-gray-400">£</td>
              <td class="px-3 py-1 border border-gray-400 text-right">
                <div class="flex justify-between items-center">
                  <span>£</span><span>-</span>
                </div>
              </td>
            </tr>
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
            <tr class="bg-white">
              <td class="px-3 py-1 border border-gray-400">Visa</td>
              <td class="px-3 py-1 border border-gray-400 text-right">
                {{ (quote.items?.[0]?.hotelpackages?.adults || 0) +
                  (quote.items?.[0]?.hotelpackages?.children || 0) +
                  (quote.items?.[0]?.hotelpackages?.infant || 0) }}
              </td>
              <td class="px-3 py-1 border border-gray-400 text-right">
                <div class="flex items-center justify-between">
                  <span>£</span> <span> {{ quote.visas?.cost || 0 }}</span>
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
              <!-- for BUS 49 PAX -->
              <td class="px-3 py-1 border border-gray-400 text-right">
                <div class="flex justify-between items-center">
                  <span>£</span> <span>{{ quote.transports?.name ? quote.transportpackages?.rate : 0 }}</span>
                </div>
              </td>
              <td class="px-3 py-1 border border-gray-400 text-right">
                <div class="flex justify-between items-center">
                  <span>£</span> <span>{{ quote.transports?.name ? quote.transportpackages?.rate : 0 }}</span>
                </div>
              </td>
            </tr>

            <!-- Hotel Items -->
            <template v-for="item in quote.items" :key="item.id">
              <tr class="bg-black text-white">
                <td class="px-3 py-1 border border-gray-400 font-semibold" style="background-color: #001529">{{ item.hotelpackages?.city }}</td>
                <td class="px-3 py-1 border border-gray-400" colspan="2" style="background-color: #001529">{{ item.hotelpackages?.hotel?.name }}</td>
                <td class="px-3 py-1 border border-gray-400" style="background-color: #001529"></td>
              </tr>
              <tr class="bg-black text-white">
                <td class="px-3 py-1 border border-gray-400 font-semibold" style="background-color: #001529">Supplier</td>
                <td class="px-3 py-1 border border-gray-400" colspan="2" style="background-color: #001529">{{ item.hotelpackages?.supplier?.name }}</td>
                <td class="px-3 py-1 border border-gray-400" style="background-color: #001529"></td>
              </tr>
              <tr class="bg-black text-white">
                <td class="px-3 py-1 border border-gray-400 font-semibold" style="background-color: #001529">Reservation ref</td>
                <td class="px-3 py-1 border border-gray-400" colspan="2" style="background-color: #001529">{{ item?.reservation_ref }}</td>
                <td class="px-3 py-1 border border-gray-400" style="background-color: #001529"></td>
              </tr>
              <tr class="bg-gray-100">
                <td class="px-3 py-1 border border-gray-400">Dates</td>
                <td class="px-3 py-1 border border-gray-400 bg-green-100 text-right font-bold">{{ formatDate(item.date_from) }}</td>
                <td class="px-3 py-1 border border-gray-400 text-right font-bold">{{ formatDate(item.date_to) }}</td>
                <td class="px-3 py-1 border border-gray-400 text-right">{{ item.hotelpackages?.numberofdays || 0 }}</td>
              </tr>
              <tr v-for="type in ['double', 'triple', 'quad']" :key="type"
                  :class="type === 'double' || type === 'triple' || type === 'quad' ? 'bg-gray-100' : 'bg-white'">
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

            <!-- Final Totals -->
            <tr class="bg-black text-white">
              <td class="px-3 py-1 border border-gray-400 font-semibold" style="background-color: #001529">Sub Total</td>
              <td class="px-3 py-1 border border-gray-400" colspan="2" style="background-color: #001529"></td>
              <td class="px-3 py-1 border border-gray-400 font-semibold text-right" style="background-color: #001529">
                <div class="flex justify-between items-center" style="background-color: #001529">
                  <span>£</span><span>{{ getSubtotal(quote).toFixed(2) }}</span>
                </div>
              </td>
            </tr>
            <tr class="bg-black text-white">
              <td class="px-3 py-1 border border-gray-400 font-semibold" style="background-color: #001529">Weekend</td>
              <td class="px-3 py-1 border border-gray-400" colspan="2" style="background-color: #001529"></td>
              <td class="px-3 py-1 border border-gray-400" style="background-color: #001529">
                <div class="flex justify-between items-center">
                  <span>£</span><span>{{ quote.items?.[0]?.hotelpackages?.days_we || '-' }}</span>
                </div>
              </td>
            </tr>
            <tr class="bg-blue-100">
              <td class="px-3 py-1 border border-gray-400 font-semibold" colspan="3">Mark Up</td>
              <td class="px-3 py-1 border border-gray-400 text-blue-600 font-semibold text-right">
                <div class="flex justify-between items-center">
                  <span>£</span>
                  <span>{{ getMarkup(quote).toFixed(2) }}</span>
                </div>
              </td>
            </tr>
            <tr class="bg-green-100">
              <td class="px-3 py-1 border border-gray-400 font-semibold" colspan="3">Retail</td>
              <td class="px-3 py-1 border border-gray-400 text-green-600 font-semibold text-right">
                <div class="flex justify-between items-center">
                  <span>£</span>
                  <span>{{ getRetail(quote).toFixed(2) }}</span>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <!-- print section end -->

    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from "vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import axios from "axios";
import { apiBase } from "@/config.js";
import { getToken, showNotification } from "@/utilities/common.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const customers = ref([]);
const isSupplierLoading = ref(false);
const selectedCustomer = ref(null);
const reportData = ref([]);
let supplierSearchTimeout;

const getRate = (hotelpackage, type) => {
  if (!hotelpackage || !hotelpackage.hotelpackageitems) return {};
  return hotelpackage.hotelpackageitems.find(r => r.room_type === type) || {};
};

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

// ✅ FIXED: use ?name= instead of ?search=
const handleQuoteSearch = (value) => {
  clearTimeout(supplierSearchTimeout);
  isSupplierLoading.value = true;

  supplierSearchTimeout = setTimeout(async () => {
    try {
      const res = await axios.get(`${apiBase}/customers?name=${encodeURIComponent(value)}`, getToken()); 
      customers.value = res.data.data?.data || [];
    } catch (err) {
      console.error(err);
      showNotification("Failed to fetch quotes", "error");
    } finally {
      isSupplierLoading.value = false;
    }
  }, 500);
};

      
console.log(customers);

const handleQuoteSelect = async (quoteId) => {
  const quoteObj = customers.value.find((q) => q.id === quoteId);
  selectedCustomer.value = quoteObj;

  try {
    const res = await axios.get(`${apiBase}/customers_report?customer_id=${quoteId}`, getToken());
    reportData.value = (res.data.data || []).map((quote) => ({
      ...quote,
      customer: { name: quoteObj?.name || '' },
    }));
  } catch (e) {
    console.error("Error fetching report", e);
    showNotification("Failed to fetch report", "error");
  }
};

const getSubtotal = (quote) => {
  let sub = 0;
  if (quote.visas?.cost) sub += parseFloat(quote.visas.cost) || 0;
  if (quote.transportpackages?.rate) sub += parseFloat(quote.transportpackages.rate) || 0;

  quote.items?.forEach((item) => {
    if (item.hotelpackages?.hotelpackageitems?.length) {
      item.hotelpackages.hotelpackageitems.forEach((room) => {
        if (room.days_wd) sub += parseFloat(room.days_wd) || 0;
        if (room.days_we) sub += parseFloat(room.days_we) || 0;
      });
    }
  });
  return sub;
};

const getMarkup = (quote) => {
  if (!quote.profits) return 0;
  const adult = parseFloat(quote.adult || 0);
  const fixed = parseFloat(quote.profits.fixed_markup || 0);
  return adult * fixed;
};

const getRetail = (quote) => getSubtotal(quote) + getMarkup(quote);

const downloadPDF = () => {
  if (!reportData.value.length) {
    showNotification("No report data available", "warning");
    return;
  }

  const doc = new jsPDF('p', 'pt', 'a4');

  reportData.value.forEach((quote, i) => {
    if (i > 0) doc.addPage();

    doc.setFontSize(14);
    doc.text(`Quote Report - ${quote.customer?.name}`, 40, 40);
    doc.text(`'name', ${quote.customer?.name}`, 40, 40);
    const tableBody = [];

    tableBody.push(['Adults', quote.adult || 0, '£', '-']);
    tableBody.push(['Children', quote.children || 0, '£', '-']);
    tableBody.push(['Infant', quote.infant || 0, '£', '-']);
    tableBody.push(['Visa', 
      (quote.items?.[0]?.hotelpackages?.adults || 0) +
      (quote.items?.[0]?.hotelpackages?.children || 0) +
      (quote.items?.[0]?.hotelpackages?.infant || 0),
      '£', quote.visas?.cost || 0]);
    tableBody.push(['Transport', Math.ceil((quote.items?.[0]?.hotelpackages?.adults || 0)/49),
      '£', quote.transports?.name ? quote.transportpackages?.rate : 0]);

    quote.items?.forEach(item => {
      tableBody.push([`${item.hotelpackages?.city} (${item.hotelpackages?.hotel?.name})`, '', '', '']);
      tableBody.push(['Supplier', item.hotelpackages?.supplier?.name || '', '', '']);
      tableBody.push(['Reservation ref', item.reservation_ref || '', '', '']);
      tableBody.push(['Dates', formatDate(item.date_from), formatDate(item.date_to), item.hotelpackages?.numberofdays || 0]);
      ['double','triple','quad'].forEach(type => {
        const rate = getRate(item.hotelpackages, type);
        tableBody.push([type, '', `£${(rate.days_wd||0)*4.5}`, rate.days_wd||0]);
      });
    });

    tableBody.push(['Sub Total', '', '', getSubtotal(quote).toFixed(2)]);
    tableBody.push(['Weekend', '', '', quote.items?.[0]?.hotelpackages?.days_we || '-']);
    tableBody.push(['Markup', '', '', getMarkup(quote).toFixed(2)]);
    tableBody.push(['Retail', '', '', getRetail(quote).toFixed(2)]);

    autoTable(doc, {
      startY: 60,
      head: [['Tickets','Qty','Our cost','Our cost']],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [0,21,41], textColor: 255 },
      alternateRowStyles: { fillColor: [245,245,245] },
    });
  });

  doc.save('Quote_Report.pdf');
};

const downloadExcel = () => {
    if (!reportData.value.length) return;

    const ws_data = [];

    reportData.value.forEach(quote => {
      ws_data.push(['Customer', '', '', quote.customer?.name]);
      ws_data.push(['Adults', quote.adult || 0, '£', '-']);
      ws_data.push(['Children', quote.children || 0, '£', '-']);
      ws_data.push(['Infant', quote.infant || 0, '£', '-']);
      ws_data.push(['Visa', '', quote.visas?.cost || 0, quote.visas?.cost || 0]);
      ws_data.push(['Transport', '', quote.transportpackages?.rate || 0, quote.transportpackages?.rate || 0]);

      quote.items?.forEach(item => {
        ws_data.push([`${item.hotelpackages?.city} (${item.hotelpackages?.hotel?.name})`]);
        ws_data.push(['Supplier', item.hotelpackages?.supplier?.name || '']);
        ws_data.push(['Reservation ref', item.reservation_ref || '']);
        ws_data.push(['Dates', formatDate(item.date_from), formatDate(item.date_to), item.hotelpackages?.numberofdays || 0]);
        ['double','triple','quad'].forEach(type => {
          const rate = getRate(item.hotelpackages, type);
          ws_data.push([type, '', (rate.days_wd||0)*4.5, rate.days_wd||0]);
        });
      });

      ws_data.push([]);
      ws_data.push(['Sub Total', '', '', getSubtotal(quote).toFixed(2)]);
      ws_data.push(['Weekend', '', '', quote.items?.[0]?.hotelpackages?.days_we || '-']);
      ws_data.push(['Markup', '', '', getMarkup(quote).toFixed(2)]);
      ws_data.push(['Retail', '', '', getRetail(quote).toFixed(2)]);
      ws_data.push([]);
    });

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Quote Report');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'Quote_Report.xlsx');
  };

const invoiceRef = ref(null);
const printInvoice = () => {
    if (!invoiceRef.value || reportData.value.length === 0) return;
    window.print();
};


</script>

<style scoped>
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

@media print {
  body * {
    visibility: hidden;
    /* hide everything by default */
  }

  .print-section,
  .print-section * {
    visibility: visible;
    /* only show print section */
  }

  .print-section {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

  * {
    -webkit-print-color-adjust: exact;
    /* Chrome, Safari */
    print-color-adjust: exact;
    /* Firefox */
  }

  /* Remove scrollbars and shadows */
  .overflow-x-auto {
    overflow: visible !important;
  }

  /* Ensure table fits page */
  table {
    width: 100% !important;
    border-collapse: collapse;
    page-break-inside: avoid;
    font-size: 12pt;
  }

  th,
  td {
    border: 1px solid #000 !important;
    padding: 4px !important;
  }

  /* Remove non-print elements */
  button,
  .no-print {
    display: none !important;
  }

  /* Avoid breaking table rows */
  tr {
    page-break-inside: avoid !important;
  }

  .shadow-lg {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2) !important;
  }

  .rounded-lg,
  .rounded-xl {
    border-radius: 10px !important;
  }

  .bg-black {
    background-color: #000 !important;
    color: #fff !important;
  }

  .bg-gray-100 {
    background-color: #f3f4f6 !important;
    color: #000 !important;
  }

  .bg-white {
    background-color: #fff !important;
    color: #000 !important;
  }

  .bg-blue-100 {
    background-color: #dbeafe !important;
    color: #000 !important;
  }

  .bg-orange-200 {
    background-color: #fed7aa !important;
    color: #000 !important;
  }

  .bg-green-100 {
    background-color: #dcfce7 !important;
    color: #000 !important;
  }

  table,
  tr,
  td,
  th {
    page-break-inside: avoid;
    page-break-after: auto;
  }

  table {
    width: 100% !important;
  }
}
</style>

