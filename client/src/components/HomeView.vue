<template>
  <div>
    <div class="relative bg-primary-50 md:pt-32 pb-32 pt-12">
      <div class="px-4 md:px-10 mx-auto w-full">
        <section
          class="my-10 flex flex-col-reverse md:flex-row md:items-start items-center"
        >
          <div
            class="flex flex-col space-y-8 items-center md:items-start md:w-1/2"
          >
            <div class="mx-4 md:mx-0">
              <h1
                class="font-bold text-4xl text-center md:text-5xl md:text-start my-6"
              >
                Bring everyone together to build better products
              </h1>
              <p class="text-darkGrayishBlue max-w-prose mx-6 md:mx-0">
                Manage makes it simple for software teams to plan day-to-day
                tasks while keeping the larger team goals in view.
              </p>
            </div>
          </div>
          <div class="md:w-1/2">
            <img src="@/assets/images/fabi.jpeg" alt="statistic" class="w-40" />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const isAuthenticated = computed(() => store.getters['user/isAuthenticated'])
const email = computed(() => store.getters['user/getEmail'])
const profile = computed(() => store.getters['user/getProfile'])
let role = ''
if (profile.value) {
  role = profile.value.role
}
</script>
