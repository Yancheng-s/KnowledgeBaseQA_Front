<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
      <button class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl" @click="close">
        &times;
      </button>
      <h2 class="text-lg font-semibold mb-4">新增模型</h2>
      <div class="mb-4">
        <input
          v-model="modelName"
          type="text"
          placeholder="请输入模型名称"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
        />
        <textarea
          v-model="modelDesc"
          placeholder="请输入模型介绍"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 resize-none"
          rows="3"
        ></textarea>
        <input
          v-model="apiKey"
          type="text"
          placeholder="请输入API-KEY"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="flex justify-end gap-2">
        <button class="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200" @click="close">取消</button>
        <button class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" @click="submit">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ visible: boolean }>();
const emits = defineEmits(['close', 'submit']);

const modelName = ref('');
const modelDesc = ref('');
const apiKey = ref('');

function close() {
  emits('close');
  modelName.value = '';
  modelDesc.value = '';
  apiKey.value = '';
}

function submit() {
  emits('submit', {
    name: modelName.value,
    desc: modelDesc.value,
    apiKey: apiKey.value,
  });
  modelName.value = '';
  modelDesc.value = '';
  apiKey.value = '';
}
</script>