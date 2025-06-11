<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50"
  >
    <div class="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl text-center">
      <!-- Error Icon -->
      <div class="mb-6">
        <div
          class="w-20 h-20 mx-auto bg-red-50 rounded-full flex items-center justify-center"
        >
          <svg
            v-if="error.statusCode === 404"
            class="w-12 h-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <svg
            v-else
            class="w-12 h-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>

      <!-- Error Title -->
      <h1 class="text-4xl font-bold text-gray-800 mb-3">
        {{ error.statusCode === 404 ? "Page Not Found" : "Oops!" }}
      </h1>

      <!-- Error Code -->
      <div class="text-sm font-medium text-gray-500 mb-4">
        Error {{ error.statusCode }}
      </div>

      <!-- Error Message -->
      <p class="text-gray-600 mb-8 text-lg">
        {{ error.message || "Something went wrong. Please try again later." }}
      </p>

      <!-- Action Button -->
      <button
        @click="handleError"
        class="inline-flex items-center px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        <span>{{ error.statusCode === 404 ? "Go Home" : "Try Again" }}</span>
        <svg
          class="w-5 h-5 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            v-if="error.statusCode === 404"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object,
});

const handleError = () => {
  clearError();
  if (props.error.statusCode === 404) {
    navigateTo("/");
  } else {
    window.location.reload();
  }
};
</script>
