<template>
  <a-layout-sider v-model:collapsed="collapsed" collapsible class="overflow-y-auto whitespace-nowrap">
    <div class="flex flex-col justify-center items-center my-2" style="height: 70px;">
<!--      <img v-if="!collapsed" src="/src/assets/images/aa.png" alt="Logo" class="w-20 " />-->
<!--      <h2>-->
<!--        <span class="text-white text-lg font-semibold">UK-->
<!--          <span v-if="!collapsed" class="text-white text-lg font-semibold">HAJJ</span>-->
<!--        </span>-->
<!--      </h2>-->
      <span class="text-white text-base font-semibold">Admin <span v-if="!collapsed"> Panel</span>
      </span>
    </div>
    <a-menu v-model:openKeys="state.openKeys" v-model:selectedKeys="state.selectedKeys" mode="inline" theme="dark"
            :inline-collapsed="collapsed" :items="items" @openChange="handleOpenChange" />
  </a-layout-sider>
</template>

<script setup>
import { ref, watch, reactive, h } from "vue";
import { InboxOutlined, HomeOutlined, ApartmentOutlined, FileTextOutlined, SwapOutlined, CalendarOutlined, BarChartOutlined, FileSearchOutlined, UserOutlined, TeamOutlined, SettingOutlined } from "@ant-design/icons-vue";
import { useRoute, useRouter } from "vue-router";
import HotelList from "@/views/hotels/HotelList.vue";

const route = useRoute();
const router = useRouter();

const collapsed = ref(false);
const state = reactive({
  openKeys: [],
  selectedKeys: [route.path],
});

const items = reactive([
  {
    key: "/home",
    label: "Dashboard",
    icon: () => h(HomeOutlined),  // Icon for Dashboard
    onClick: () => router.push("/home"),
  },
  {
    key: "/hotels",
    label: "Hotel Package",
    icon: () => h(ApartmentOutlined),  // Icon for Hotels
    onClick: () => router.push("/hotels"),
  },
  {
    key: "/transfer",
    label: "Transport Package",
    icon: () => h(SwapOutlined),  // Icon for Transfer
    onClick: () => router.push("/transfer"),
  },
  {
    key: "/quote",
    label: "Quotes",
    icon: () => h(FileTextOutlined),  // Icon for Quotes
    onClick: () => router.push("/quote"),
  },

  {
    key: "reports",
    label: "Reports",
    icon: () => h(FileSearchOutlined),  // Icon for Reports
    children: [
      {
        key: "/customers-report",
        label: "Quote Report",
        onClick: () => router.push("/customers-report"),
      },
      // {
      //   key: "/quote-report",
      //   label: "Quote Report",
      //   onClick: () => router.push("/quote-report"),
      // },
      {
        key: "/invoice",
        label: "Invoice",
        onClick: () => router.push("/invoice"),
      },
    ],
  },
  {
    key: "settings",
    label: "Settings",
    icon: () => h(SettingOutlined),  // Icon for Settings
    children: [
      {
        key: "/suppliers",
        label: "Suppliers",
        onClick: () => router.push("/suppliers"),
      },
      {
        key: "/customers",
        label: "Customers",
        onClick: () => router.push("/customers"),
      },
      {
        key: "/visa",
        label: "Visas",
        onClick: () => router.push("/visa"),
      },

      {
        key: "/trasport",
        label: "Transports",
        onClick: () => router.push("/trasport"),
      },
      {
        key: "/locations",
        label: "Locations",
        onClick: () => router.push("/locations"),
      },
      {
        key: "/reserve",
        label: "Reservations",
        onClick: () => router.push("/reserve"),
      },
      {
        key: "/profits",
        label: "Profits",
        onClick: () => router.push("/profits"),
      },
      {
        key: "/hotel-list",
        label: "Hotels",
        onClick: () => router.push("/hotel-list"),
      },

    ],
  },
  {
    key: "user",
    label: "User Management",
    icon: () => h(TeamOutlined),  // Icon for User Management
    children: [
      {
        key: "/user",
        label: "User",
        onClick: () => router.push("/user"),
      },
      {
        key: "/role",
        label: "Role",
        onClick: () => router.push("/role"),
      },
      {
        key: "/permission",
        label: "Permission",
        onClick: () => router.push("/permission"),
      },
    ],
  },
]);

// Watch for route changes and update the selected keys
watch(
    () => route.path,
    (newPath) => {
      // Find the top-level key for the selected route
      const selectedItem = items
          .flatMap((item) => (item.children ? item.children : [item])) // Flatten the items
          .find((child) => newPath === child.key);

      // Find the parent key for the opened submenu
      const parentKey = items.find((item) =>
          item.children?.some((child) => newPath.startsWith(child.key))
      )?.key;

      // Set the openKeys to highlight the parent if it exists
      state.openKeys = parentKey ? [parentKey] : [];

      // Set the selected key
      state.selectedKeys = selectedItem ? [selectedItem.key] : [newPath];
    },
    { immediate: true }
);

// Add this function to handle submenu open/close
function handleOpenChange(keys) {
  // Only allow one submenu to be open at a time (the last one)
  if (keys.length > 0) {
    state.openKeys = [keys[keys.length - 1]];
  } else {
    state.openKeys = [];
  }
}
</script>

<style>
.ant-menu-item-selected,
.ant-layout-sider-trigger,
.ant-menu-item:not(.ant-menu-item-selected):hover {
  background: #0d47a1 !important;
}

.ant-menu-sub.ant-menu-inline {
  background: #0d47a11f !important;
}

.anticon svg {
  opacity: 1;
  display: block !important;
}

.ant-pagination-item-link .anticon {
  color: #000;
}

.ant-modal-close-x svg {
  color: #fff;
}
</style>