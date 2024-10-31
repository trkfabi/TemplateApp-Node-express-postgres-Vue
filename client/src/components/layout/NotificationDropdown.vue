<template>
  <div>
    <a
      class="text-blueGray-500 block py-1 px-3"
      href="#pablo"
      @click="toggleDropdown"
      ref="btnDropdownRef"
    >
      <i class="fas fa-bell"></i>
    </a>
    <div
      ref="popoverDropdownRef"
      class="bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg mt-1"
      :class="{ hidden: !dropdownPopoverShow, block: dropdownPopoverShow }"
      style="min-width: 12rem"
    >
      <a
        href="#pablo"
        class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
      >
        Action
      </a>
      <a
        href="#pablo"
        class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
      >
        Another action
      </a>
      <a
        href="#pablo"
        class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
      >
        Something else here
      </a>
      <div class="h-0 my-2 border border-solid border-blueGray-100" />
      <a
        href="#pablo"
        class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
      >
        Seprated link
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createPopper } from '@popperjs/core'

// Definir referencias
const btnDropdownRef = ref(null)
const popoverDropdownRef = ref(null)

// Estado de visibilidad del dropdown
const dropdownPopoverShow = ref(false)

// Función para alternar el dropdown
function toggleDropdown(event) {
  event.preventDefault()
  dropdownPopoverShow.value = !dropdownPopoverShow.value
  if (dropdownPopoverShow.value) {
    createPopper(btnDropdownRef.value, popoverDropdownRef.value, {
      placement: 'bottom-end',
    })
  }
}
</script>
