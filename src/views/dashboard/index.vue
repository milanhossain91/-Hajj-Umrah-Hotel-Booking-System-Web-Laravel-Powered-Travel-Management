<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
import { Icon } from '@iconify/vue'

const formatNumber = (num) => {
  return num.toLocaleString()
}
</script>

<template>
  <MainLayout>
    <div class="min-h-screen p-4 md:p-6">
      <div class="">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Dashboard</h1>
          <p class="text-slate-600">Hajj Management System Overview</p>
        </div>

        <!-- First Row - 4 Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          <!-- Total Credit -->
          <div
            class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div class="flex items-center justify-between mb-4">
              <Icon icon="mdi:gift" class="text-3xl opacity-80" />
              <div class="bg-white/20 rounded-full p-2">
                <Icon icon="mdi:trending-up" class="text-xl" />
              </div>
            </div>
            <div class="space-y-1">
              <p class="text-purple-100 text-sm font-medium">Total Credit</p>
              <p class="text-2xl md:text-3xl font-bold">{{ formatNumber(1178055) }} TK</p>
            </div>
          </div>

          <!-- Today Credit -->
          <div
            class="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div class="flex items-center justify-between mb-4">
              <Icon icon="mdi:gift-outline" class="text-3xl opacity-80" />
              <div class="bg-white/20 rounded-full p-2">
                <Icon icon="mdi:calendar-today" class="text-xl" />
              </div>
            </div>
            <div class="space-y-1">
              <p class="text-blue-100 text-sm font-medium">Today Credit</p>
              <p class="text-2xl md:text-3xl font-bold">0 TK</p>
            </div>
          </div>

          <!-- Total Debit -->
          <div
            class="bg-gradient-to-br from-lime-500 to-green-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div class="flex items-center justify-between mb-4">
              <Icon icon="mdi:lock" class="text-3xl opacity-80" />
              <div class="bg-white/20 rounded-full p-2">
                <Icon icon="mdi:arrow-down" class="text-xl" />
              </div>
            </div>
            <div class="space-y-1">
              <p class="text-green-100 text-sm font-medium">Total Debit</p>
              <p class="text-2xl md:text-3xl font-bold">{{ formatNumber(1705476) }} TK</p>
            </div>
          </div>

          <!-- Today Debit -->
          <div
            class="bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div class="flex items-center justify-between mb-4">
              <Icon icon="mdi:shield-check" class="text-3xl opacity-80" />
              <div class="bg-white/20 rounded-full p-2">
                <Icon icon="mdi:calendar-clock" class="text-xl" />
              </div>
            </div>
            <div class="space-y-1">
              <p class="text-teal-100 text-sm font-medium">Today Debit</p>
              <p class="text-2xl md:text-3xl font-bold">0 TK</p>
            </div>
          </div>
        </div>

        <!-- Second Row - 3 Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
          <!-- Pre-registered Hajj -->
          <div
            class="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div class="flex items-center justify-between mb-4">
              <Icon icon="mdi:map-marker" class="text-4xl opacity-80" />
              <div class="bg-white/20 rounded-full p-2">
                <Icon icon="mdi:account-plus" class="text-xl" />
              </div>
            </div>
            <div class="space-y-1">
              <p class="text-emerald-100 text-sm font-medium">Pre-registered Hajj</p>
              <p class="text-3xl md:text-4xl font-bold">(0)</p>
            </div>
          </div>

          <!-- Main Hajj -->
          <div
            class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div class="flex items-center justify-between mb-4">
              <Icon icon="mdi:kaaba" class="text-4xl opacity-80" />
              <div class="bg-white/20 rounded-full p-2">
                <Icon icon="mdi:star" class="text-xl" />
              </div>
            </div>
            <div class="space-y-1">
              <p class="text-indigo-100 text-sm font-medium">Main Hajj</p>
              <p class="text-3xl md:text-4xl font-bold">(3)</p>
            </div>
          </div>

          <!-- Umrah Hajj -->
          <div
            class="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div class="flex items-center justify-between mb-4">
              <Icon icon="mdi:mosque" class="text-4xl opacity-80" />
              <div class="bg-white/20 rounded-full p-2">
                <Icon icon="mdi:heart" class="text-xl" />
              </div>
            </div>
            <div class="space-y-1">
              <p class="text-violet-100 text-sm font-medium">Umrah Hajj</p>
              <p class="text-3xl md:text-4xl font-bold">(2)</p>
            </div>
          </div>
        </div>

        <!-- Third Row - 4 Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <!-- Students -->
          <div
            class="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div class="flex items-center justify-between mb-4">
              <Icon icon="mdi:account-group" class="text-3xl opacity-80" />
              <div class="bg-white/20 rounded-full p-2">
                <Icon icon="mdi:school" class="text-xl" />
              </div>
            </div>
            <div class="space-y-1">
              <p class="text-orange-100 text-sm font-medium">Students</p>
              <p class="text-2xl md:text-3xl font-bold">(3)</p>
            </div>
          </div>

          <!-- Tour & Travels Customer -->
          <div
            class="bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div class="flex items-center justify-between mb-4">
              <Icon icon="mdi:briefcase" class="text-3xl opacity-80" />
              <div class="bg-white/20 rounded-full p-2">
                <Icon icon="mdi:airplane" class="text-xl" />
              </div>
            </div>
            <div class="space-y-1">
              <p class="text-slate-200 text-sm font-medium">Tour & Travels Customer</p>
              <p class="text-2xl md:text-3xl font-bold">(5)</p>
            </div>
          </div>

          <!-- Agent Customer -->
          <div
            class="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div class="flex items-center justify-between mb-4">
              <Icon icon="mdi:cash-multiple" class="text-3xl opacity-80" />
              <div class="bg-white/20 rounded-full p-2">
                <Icon icon="mdi:handshake" class="text-xl" />
              </div>
            </div>
            <div class="space-y-1">
              <p class="text-pink-100 text-sm font-medium">Agent Customer</p>
              <p class="text-2xl md:text-3xl font-bold">(3)</p>
            </div>
          </div>

          <!-- Total Visitor -->
          <div
            class="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div class="flex items-center justify-between mb-4">
              <Icon icon="mdi:account" class="text-3xl opacity-80" />
              <div class="bg-white/20 rounded-full p-2">
                <Icon icon="mdi:eye" class="text-xl" />
              </div>
            </div>
            <div class="space-y-1">
              <p class="text-red-100 text-sm font-medium">Total Visitor</p>
              <p class="text-2xl md:text-3xl font-bold">(1)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
