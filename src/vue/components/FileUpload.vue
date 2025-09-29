<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->

<template>
  <div class="h-screen bg-gray-50 flex flex-col">
    <!-- 顶部导航 -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl px-4 h-16 flex items-center">
        <div class="flex items-center space-x-2 text-gray-600">
          <span>文件管理</span>
          <i class="fas fa-chevron-right text-xs"></i>
          <span class="text-blue-600">{{ currentFolder }}</span>
        </div>
      </div>
    </nav>

    <!-- 操作区 -->
    <div class="w-full px-4 py-6 flex-1 flex flex-col overflow-hidden">
      <div class="flex justify-between items-center mb-6">
        <div class="flex space-x-4">
          <button @click="showNewFolderModal = true" class="!rounded-button flex items-center px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50">
            <i class="fas fa-folder-plus mr-2"></i>
            新建分类
          </button>
        </div>
        
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <div class="relative">
              <input 
                type="text" 
                placeholder="搜索文件..." 
                class="pl-10 pr-10 py-2 w-64 border border-gray-300 !rounded-button focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                v-model="searchQuery"
                @keyup.enter="handleSearch"
              >
              <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <button 
                v-if="searchQuery"
                @click="clearSearch"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          <button @click="showUploadModal = true" class="!rounded-button flex items-center px-6 py-2 bg-blue-600 text-white hover:bg-blue-700">
            <i class="fas fa-cloud-upload-alt mr-2"></i>
            上传文件
          </button>
        </div>
      </div>

      <!-- 文件夹网格 -->
      <div class="grid grid-cols-4 gap-4 mb-8">
        <div class="flex items-center space-x-3 relative group bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md cursor-pointer"
             @click="enterFirstFolder()">
            <img :src="overviewIcon" alt="folder icon" class="w-12 h-12 object-cover">
            <div>
              <h3>总览</h3>
              <p class="text-sm text-gray-500">{{ overviewCount }}个文件</p>
            </div>
        </div>

        <div v-for="folder in folders" 
             :key="folder.id" 
             class="relative group bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md cursor-pointer">

          <div class="flex items-center space-x-3"
               @click="enterFolder(folder.folder_name)">
            <img :src="folder.icon" alt="folder icon" class="w-12 h-12 object-cover">
            <div>
              <h3 class="font-medium">{{ folder.folder_name }}</h3>
              <p class="text-sm text-gray-500">{{ folder.count }}个文件</p>
            </div>
          </div>
          <div class="absolute top-2 right-2 hidden group-hover:flex space-x-2">
            <button class="p-1 hover:bg-gray-100 rounded" @click="amantFolder(folder.folder_name)">
              <i class="fas fa-pencil-alt text-gray-600"></i>
            </button>
            <button class="p-1 hover:bg-gray-100 rounded" @click="delateFolder(folder.folder_name)">
              <i class="fas fa-trash-alt text-gray-600"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 文件表格 -->
      <div class="bg-white rounded-lg border border-gray-200 flex-1 flex flex-col shadow-sm">
        <!-- 表格头部 - 固定不滚动 -->
        <div class="bg-gray-50 border-b border-gray-200">
          <div class="px-6 py-3">
             <div class="grid grid-cols-4 gap-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
               <div class="text-left">文件名</div>
               <div class="text-center -ml-3">大小</div>
               <div class="text-center -ml-7">上传时间</div>
               <div class="text-center -ml-7">操作</div>
             </div>
          </div>
        </div>
        
        <!-- 表格内容 - 可滚动区域 -->
        <div class="overflow-y-auto flex-1 bg-white" :style="{ maxHeight: fileListMaxHeight + 'px' }">
          <div v-if="files.length === 0" class="flex items-center justify-center h-32 text-gray-500">
            <div class="text-center">
              <i class="fas fa-folder-open text-4xl mb-2"></i>
              <p>暂无文件</p>
            </div>
          </div>
          <div v-else class="divide-y divide-gray-100">
            <div v-for="file in files" :key="file.id" class="hover:bg-gray-50 bg-white transition-colors duration-150">
              <div class="px-6 py-3">
                <div class="grid grid-cols-4 gap-4 items-center">
                  <!-- 文件名列 -->
                  <div class="flex items-center">
                    <div class="flex items-center min-w-0">
                      <div class="w-5 h-5 bg-gray-100 rounded flex items-center justify-center mr-2">
                        <i :class="[getFileIcon(file.file_name)]"></i>
                      </div>
                      <span class="truncate text-sm font-medium text-gray-900">{{ file.file_name }}</span>
                    </div>
                  </div>
                  <!-- 大小列 -->
                  <div class="text-sm text-gray-600 text-center font-medium">
                    {{ file.file_size }}
                  </div>
                  <!-- 时间列 -->
                  <div class="text-sm text-gray-600 text-center -ml-1 font-medium">
                    {{ file.file_time }}
                  </div>
                  <!-- 操作列 -->
                  <div class="text-center text-sm">
                    <div class="flex items-center justify-center space-x-2">
                      <button @click="previewFile(file)" 
                              class="px-2 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-150">
                        预览
                      </button>
                      <button @click="downloadFile(file)" 
                              class="px-2 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-150">
                        下载
                      </button>
                      <button @click="deleteFile(file)" 
                              class="px-2 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors duration-150">
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新建文件夹模态框 -->
    <div v-if="showNewFolderModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-medium mb-4">新建文件夹</h3>
        <input type="text" 
              v-model="newFolderName"
               placeholder="请输入文件夹名称" 
               class="w-full px-3 py-2 border border-gray-300 rounded-md mb-4">
        <div class="flex justify-end space-x-3">
          <button @click="showNewFolderModal = false" 
                  class="!rounded-button px-4 py-2 border border-gray-300 hover:bg-gray-50">
            取消
          </button>
          <button @click="addNewFolder"
                  class="!rounded-button px-4 py-2 bg-blue-600 text-white hover:bg-blue-700">
            确定
          </button>
        </div>
      </div>
    </div>

    <!-- 新建文件夹（文件）模态框 -->
    <div v-if="showNewFolderModal_file" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-medium mb-4">新建文件夹</h3>
        <input type="text" 
              v-model="newFolderName"
               placeholder="请输入文件夹名称" 
               class="w-full px-3 py-2 border border-gray-300 rounded-md mb-4">
        <div class="flex justify-end space-x-3">
          <button @click="canner_addNewFolder_file" 
                  class="!rounded-button px-4 py-2 border border-gray-300 hover:bg-gray-50">
            取消
          </button>
          <button @click="addNewFolder_file"
                  class="!rounded-button px-4 py-2 bg-blue-600 text-white hover:bg-blue-700">
            确定
          </button>
        </div>
      </div>
    </div>

    <!-- 文件上传模态框 -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-[600px]">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">上传文件</h3>
          <button @click="showUploadModal = false">
            <i class="fas fa-times text-gray-400 hover:text-gray-600"></i>
          </button>
        </div>

        <!-- 文件夹选择 -->
        <div class="mb-4">
          <label for="folderSelect" class="block text-sm font-medium text-gray-700 mb-1">选择文件夹：</label>
          <div class="relative">
            <select 
              id="folderSelect" 
              v-model="selectedFolder" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">总览</option>
              <option v-for="folder in folders" :key="folder.id" :value="folder.folder_name">
                {{ folder.folder_name }}
              </option>
            </select>

            <!-- 新建文件夹图标按钮 -->
            <button 
              type="button" 
              @click="triggerNewFolder"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
            >
              <i class="fas fa-folder-plus"></i>
            </button>
          </div>
        </div>

        <!-- 文件选择区域 -->
        <div 
          class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-all duration-200"
          :class="{ 'border-blue-500 bg-blue-50': isDragging }"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          @click="$refs.fileInput.click()"
        >
          <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
          <p class="text-gray-600 mb-2">将文件拖到此处，或点击选择文件</p>
          <p class="text-gray-600 mb-2">（文件名不能过长）</p>
          <input 
            type="file" 
            @change="handleFileChange" 
            ref="fileInput" 
            class="hidden" 
            multiple 
          />
        </div>

        <!-- 已选文件列表 -->
        <div v-if="selectedFiles.length > 0" class="mt-4">
          <h4 class="font-medium mb-2">已选文件：</h4>
          <ul class="space-y-2">
            <li v-for="(file, index) in selectedFiles" :key="index" class="flex justify-between items-center bg-gray-100 p-2 rounded">
              <div class="flex items-center">
                <div class="w-5 h-5 bg-gray-100 rounded flex items-center justify-center mr-3">
                  <i :class="[getFileIcon(file.name)]"></i>
                </div>
                <span>{{ file.name }}</span>
              </div>
              <button @click="removeFile(index)" class="text-red-500 hover:text-red-700">
                <i class="fas fa-times"></i>
              </button>
            </li>
          </ul>

          <!-- 开始上传按钮 -->
          <div class="flex justify-center mt-4">
            <button 
              @click="uploadFiles" 
              class="!rounded-button flex items-center px-6 py-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              <i class="fas fa-upload mr-2"></i>
              开始上传
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 文件夹操作弹窗 -->
    <div v-if="showFolderTableModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 min-w-[400px]">
        <h3 class="text-lg font-medium mb-4">确认操作</h3>
        <p class="mb-6 text-gray-600">
          你确定要
          <span v-if="folderOperationType === 1" style="color: orange;">修改</span>
          <span v-else-if="folderOperationType === 0" style="color: red;">删除</span>
          文件夹 "{{ currentFolderName }}" 吗？
          <span v-if="folderOperationType === 0" style="color: red; display: block;">
            删除文件夹将同步删除文件
          </span>
        </p>

        <!-- 新增输入框，仅在修改模式下显示 -->
        <div v-if="folderOperationType === 1" class="mb-4">
          <!-- <label class="block text-sm font-medium text-gray-700 mb-1">请输入新的文件夹名称：</label> -->
          <input
            v-model="editedFolderName"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="请输入新名称"
          />
        </div>

        <div class="flex justify-end space-x-3">
          <button
            @click="showFolderTableModal = false"
            class="!rounded-button px-4 py-2 border border-gray-300 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            @click="handleConfirm"
            class="!rounded-button px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            确定
          </button>
        </div>
      </div>
    </div>

    <!-- 文件删除确认弹窗 -->
    <div v-if="showFileDeleteModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 min-w-[400px]">
        <h3 class="text-lg font-medium mb-4">确认删除文件</h3>
        <p class="mb-6 text-gray-600">
          你确定要删除文件 "{{ fileToDelete?.file_name }}" 吗？
          <span style="color: red; display: block; margin-top: 8px;">
            此操作不可撤销
          </span>
        </p>

        <div class="flex justify-end space-x-3">
          <button
            @click="showFileDeleteModal = false; fileToDelete = null"
            class="!rounded-button px-4 py-2 border border-gray-300 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            @click="confirmDeleteFile"
            class="!rounded-button px-4 py-2 bg-red-600 text-white hover:bg-red-700"
          >
            确定删除
          </button>
        </div>
      </div>
    </div>

    <!-- 文件预览组件 -->
    <FilePreview 
      :show="showPreviewModal" 
      :fileInfo="previewFileInfo"
      @close="closePreview"
      @download="handlePreviewDownload"
    />

  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { ElMessage } from 'element-plus'
import { addNewFolderServer,selectAllFolderServer,updateFolderNameServer,delateFolderServer,uploadFileServer, selectAllFileServer, selectFilesByNameServer, deleteFileByNameServer } from '@/api/folder';
import FilePreview from './FilePreview.vue';


const currentFolder = ref('总览');
const searchQuery = ref('');
const showNewFolderModal = ref(false); 
const showNewFolderModal_file = ref(false); 

const newFolderName = ref(''); // 新增文件夹

const showFolderTableModal = ref(false); // 控制弹窗显示
const folderOperationType = ref<number | null>(null); // 当前操作类型：1=修改，0=删除
const currentFolderName = ref<string>(''); // 当前操作的文件夹名称
const editedFolderName = ref<string>(''); // 修改后的文件夹名称

// 文件删除相关状态
const showFileDeleteModal = ref(false); // 控制文件删除确认弹窗
const fileToDelete = ref<any>(null); // 要删除的文件信息

// 预览相关状态
const showPreviewModal = ref(false); // 控制预览弹窗显示
const previewFileInfo = ref<any>(null); // 预览的文件信息

const overviewIcon = new URL('@/img/0c016d545482987f0ca9e4baa92476e1.jpg', import.meta.url).href;

const showUploadModal = ref(false);
const selectedFiles = ref<File[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);

const selectedFolder = ref<string>('');

const folders = ref([
  {
    id: '',
    folder_name: '',
    icon: '',
    count: '', // 文件数量
  }
]);

const addNewFolder = async() => {
  if (!newFolderName.value.trim()) {
    ElMessage.warning('请输入文件夹名称');
    return;
  }
  await addNewFolderServer({ folder_name: newFolderName.value });

  ElMessage.success('文件夹新建成功');
  
  newFolderName.value = '';
  showNewFolderModal.value = false;
  
  await selectAllFolder();
}

const addNewFolder_file = async() => {
  await addNewFolderServer({ folder_name: newFolderName.value });
  ElMessage.success('文件夹新建成功');
  newFolderName.value = '';
  showNewFolderModal_file.value = false;

  // 新建完成后重新打开上传弹窗
  showUploadModal.value = true;

  await selectAllFolder();
}

const canner_addNewFolder_file = async() => {
  showNewFolderModal_file.value = false;

  // 新建完成后重新打开上传弹窗
  showUploadModal.value = true;

  await selectAllFolder();
}

const selectAllFolder = async () => {
  const res = await selectAllFolderServer();
  const foldersData = res.data.map((item: any, idx: number) => ({
    ...item,
    icon: folderIcons[idx % 7],
    count: 0, // 先初始化为 0
  }));

  folders.value = foldersData;

  // 然后为每个文件夹获取文件数量
  for (let i = 0; i < folders.value.length; i++) {
    const folder = folders.value[i];
    const count = await getFolderFileCount(folder.folder_name);
    // 更新对应的文件夹数量
    folders.value[i].count = count.toString();
  }
};

const amantFolder = async (folderName: string) => {
  currentFolderName.value = folderName;
  folderOperationType.value = 1; // 设置为修改
  showFolderTableModal.value = true;

  // updateFolderNameServer({folderName,});

  // selectAllFolder

}

const delateFolder = (folderName: string) => {
  currentFolderName.value = folderName;
  folderOperationType.value = 0; // 设置为删除
  showFolderTableModal.value = true;

  // 删除文件夹逻辑
  // deleteFolderServer({folderName,});
  // console.log(`删除文件夹: ${folderName}`);
};

const getFolderFileCount = async (folderName: string): Promise<number> => {
  try {
    const res = await selectAllFileServer({ folder_name: folderName });
    return res.data.length; // 返回文件数量
  } catch (error) {
    console.error(`获取文件夹 [${folderName}] 文件数量失败`, error);
    return 0;
  }
};

const handleConfirm = () => {
  if (folderOperationType.value === 1) {
    // 修改逻辑
    if (!editedFolderName.value.trim()) {
      ElMessage.warning('请输入新的文件夹名称');
      return;
    }

    console.log('执行修改:', {
      oldName: currentFolderName.value,
      newName: editedFolderName.value
    });

    // 调用接口
    updateFolderNameServer({
      oldName: currentFolderName.value,
      newName: editedFolderName.value
    });

    ElMessage.success('文件夹修改成功');

    // 增加这一行：更新当前路径显示的文件夹名
    currentFolder.value = editedFolderName.value;

    // 刷新文件夹列表
    selectAllFolder();

    // 清空输入框
    editedFolderName.value = '';
  } else if (folderOperationType.value === 0) {
    // 删除逻辑
    delateFolderServer({ folder_name: currentFolderName.value });
    ElMessage.success('文件夹删除成功');
    selectAllFolder();
  }

  // 关闭弹窗
  showFolderTableModal.value = false;
};

// 处理文件选择
function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const newFiles = Array.from(target.files);

    // 去重：避免重复添加相同名称的文件
    const filteredFiles = newFiles.filter(
      (newFile) =>
        !selectedFiles.value.some((existingFile) => existingFile.name === newFile.name)
    );

    // 过滤文件名超过 40 字符的文件，并提示
    const validFiles = filteredFiles.filter(file => {
      if (file.name.length > 40) {
        ElMessage.warning(`文件名称过长，请选择其他文件`);

        return false;
      }
      return true;
    });

    // 添加合法文件
    selectedFiles.value = [...selectedFiles.value, ...validFiles];
    fileInput.value.value = ''; // 清空 input 的值
  }
}

// 移除某个文件
function removeFile(index: number) {
  selectedFiles.value.splice(index, 1);
  fileInput.value.value = ''; // 清空 input 的值
}

async function uploadFiles() {
  if (selectedFiles.value.length === 0) {
    alert('请先选择文件');
    return;
  }

  const selectedFolderName = selectedFolder.value;

  for (const file of selectedFiles.value) {
    const formData = new FormData();
    formData.append('file', file);

    // 如果有选择文件夹，就附加 file_class 字段
    if (selectedFolderName) {
      formData.append('file_class', selectedFolderName);
    }

    try {
      const response = await uploadFileServer(formData);
      console.log('上传成功:', response.data);
      ElMessage.success(`文件上传成功`);
    } catch (error) {
      console.error('上传失败:', error);
    }
  }

  // 清空数据
  selectedFiles.value = [];
  selectedFolder.value = '';
  showUploadModal.value = false;
}

// 处理拖拽上传
function handleDrop(event: DragEvent) {
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    const newFiles = Array.from(files);

    // 去重：避免重复添加相同名称的文件
    const filteredFiles = newFiles.filter(
      (newFile) =>
        !selectedFiles.value.some((existingFile) => existingFile.name === newFile.name)
    );

    // 过滤文件名超过 40 字符的文件，并提示
    const validFiles = filteredFiles.filter(file => {
      if (file.name.length > 40) {
        ElMessage.warning(`文件名称过长，请选择其他文件`);

        return false;
      }
      return true;
    });

    selectedFiles.value = [...selectedFiles.value, ...validFiles];
  }
}

const triggerNewFolder = () => {
  showUploadModal.value = false; // 先关闭上传弹窗
  showNewFolderModal_file.value = true;
};

const files = ref([
  {
    id: '',
    file_name: '',
    file_path: '',
    file_size: '',
    file_time: '',
  }
]);

// const files = ref([]); // 初始为空数组，避免无效数据

const folderIcons = [
  new URL('@/img/folder/0.jpg', import.meta.url).href,
  new URL('@/img/folder/1.jpg', import.meta.url).href,
  new URL('@/img/folder/2.jpg', import.meta.url).href,
  new URL('@/img/folder/3.jpg', import.meta.url).href,
  new URL('@/img/folder/4.jpg', import.meta.url).href,
  new URL('@/img/folder/5.jpg', import.meta.url).href,
  new URL('@/img/folder/6.jpg', import.meta.url).href,
];

// 文件类型与图标映射
function getFileIcon(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'doc':
    case 'docx':
      return 'fas fa-file-word';
    case 'xls':
    case 'xlsx':
      return 'fas fa-file-excel';
    case 'ppt':
    case 'pptx':
      return 'fas fa-file-powerpoint';
    case 'pdf':
      return 'fas fa-file-pdf';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'svg':
      return 'fas fa-file-image';
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
      return 'fas fa-file-video';
    case 'mp3':
    case 'wav':
    case 'ogg':
      return 'fas fa-file-audio';
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
      return 'fas fa-file-archive';
    case 'txt':
    case 'md':
      return 'fas fa-file-alt';
    case 'js':
    case 'ts':
    case 'json':
    case 'vue':
    case 'html':
    case 'css':
      return 'fas fa-file-code';
    default:
      return 'fas fa-file';
  }
}

const folderName = ref( { folder_name: "" } ); // 当前文件夹名称

const selectAllFiles = async (folderName: string = "") => {

  // 假设你有一个 API 可以获取所有文件
  const res = await selectAllFileServer( { folder_name: folderName } );

  console.log(res.data);
  // 假设 res.data 是文件数组
  files.value = res.data.map((item: any, idx: number) => ({
    id: idx + 1,
    file_name: item.file_name,
    file_path: item.file_path,
    file_size: item.file_size + ' MB',
    file_time: formatDateToYyyymmdd(item.file_time),
  }));
};

function formatDateToYyyymmdd(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，需要加 1
  const day = String(date.getDate()).padStart(2, '0');

  return `${year} ${month} ${day}`;
}

const enterFirstFolder = async () => {
  // 退出搜索状态
  isSearching.value = false;
  searchQuery.value = '';
  currentFolder.value = "总览";
  await selectAllFiles(); // 根据文件夹名称刷新文件列表
};

const enterFolder = async (folderName: string) => {
  // 退出搜索状态
  isSearching.value = false;
  searchQuery.value = '';
  currentFolder.value = folderName;
  await selectAllFiles(folderName); // 根据文件夹名称刷新文件列表
};

const overviewCount = ref<number>(); // 新增：总览文件数量

const totalFiles = async () => {
  const res = await selectAllFileServer({ folder_name: "" }); // 获取所有文件
  overviewCount.value = res.data.length; // 统计总数并赋值
};

const isSearching = ref(false); // 标记是否处于搜索状态

// 动态高度计算
const windowHeight = ref(window.innerHeight);
const fileListMaxHeight = computed(() => {
  // 精确计算：使用视口高度减去所有固定元素
  const navHeight = 64; // 导航栏高度 (h-16 = 4rem = 64px)
  const operationAreaHeight = 90; // 操作区高度 (按钮 + 搜索 + 间距)
  const folderGridHeight = 170; // 文件夹网格高度 (精确估算)
  const padding = 48; // 内边距 (py-6 = 1.5rem = 24px * 2)
  const tableHeaderHeight = 48; // 表格头部高度
  const bottomSpacing = 8; // 最小底部间距，保持一点距离
  
  const availableHeight = windowHeight.value - navHeight - operationAreaHeight - folderGridHeight - padding - tableHeaderHeight - bottomSpacing;
  
  // 根据文件数量动态调整高度
  const fileCount = files.value.length;
  if (fileCount === 0) {
    return 120; // 空状态最小高度
  } else if (fileCount <= 3) {
    // 文件较少时，使用内容高度，但不超过可用高度
    const contentHeight = fileCount * 60 + 20; // 每行约60px + 边距
    return Math.min(contentHeight, availableHeight);
  } else {
    // 文件较多时，使用可用高度
    return Math.max(120, availableHeight);
  }
});

// 监听窗口大小变化
const handleResize = () => {
  windowHeight.value = window.innerHeight;
};

function handleSearch() {
  if (!searchQuery.value.trim()) {
    // 如果搜索框为空，退出搜索状态
    clearSearch();
    return;
  }
  
  isSearching.value = true;
  currentFolder.value = '搜索结果';
  selectAllFilesByKeyword(searchQuery.value.trim());
}

const clearSearch = () => {
  searchQuery.value = '';
  isSearching.value = false;
  currentFolder.value = '总览';
  selectAllFiles();
}

const selectAllFilesByKeyword = async (keyword: string) => {
  try {
    const res = await selectFilesByNameServer({ keyword }); // 假设接口支持 keyword 参数
    files.value = res.data.map((item: any) => ({
      id: item.id,
      file_name: item.file_name,
      file_path: item.file_path,
      file_size: item.file_size + ' MB',
      file_time: formatDateToYyyymmdd(item.file_time),
    }));
  } catch (error) {
    console.error('搜索文件失败:', error);
    ElMessage.error('搜索文件失败');
  }
};

// 下载文件功能
const downloadFile = async (file: any) => {
  try {
    ElMessage.info('正在准备下载...');
    
    // 直接使用文件路径创建下载链接
    const link = document.createElement('a');
    link.href = file.file_path; // 直接使用服务器上的文件路径
    link.download = file.file_name; // 设置下载的文件名
    link.style.display = 'none'; // 隐藏链接
    
    // 添加到DOM并触发点击
    document.body.appendChild(link);
    link.click();
    
    // 延迟清理DOM，确保下载开始
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
    
    ElMessage.success(`开始下载文件: ${file.file_name}`);
  } catch (error) {
    console.error('下载文件失败:', error);
    ElMessage.error('下载文件失败，请检查文件路径');
  }
};

// 删除文件功能
const deleteFile = (file: any) => {
  fileToDelete.value = file;
  showFileDeleteModal.value = true;
};

// 确认删除文件
const confirmDeleteFile = async () => {
  if (!fileToDelete.value) return;
  
  try {
    await deleteFileByNameServer({ file_name: fileToDelete.value.file_name });
    ElMessage.success(`文件 ${fileToDelete.value.file_name} 已成功删除`);
    
    // 刷新文件列表
    if (currentFolder.value === '总览') {
      await selectAllFiles();
    } else {
      await selectAllFiles(currentFolder.value);
    }
    
    // 刷新文件夹列表和总览数量
    await selectAllFolder();
    await totalFiles();
    
    // 关闭弹窗
    showFileDeleteModal.value = false;
    fileToDelete.value = null;
  } catch (error) {
    console.error('删除文件失败:', error);
    ElMessage.error('删除文件失败，请重试');
  }
};

// 预览文件
const previewFile = (file: any) => {
  previewFileInfo.value = file;
  showPreviewModal.value = true;
};

// 关闭预览
const closePreview = () => {
  showPreviewModal.value = false;
  previewFileInfo.value = null;
};

// 处理预览中的下载
const handlePreviewDownload = (fileInfo: any) => {
  downloadFile(fileInfo);
};

onMounted(() => {
  selectAllFolder();
  selectAllFiles(folderName.value.folder_name); // 获取所有文件
  totalFiles();
  
  // 添加窗口大小变化监听器
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  // 移除窗口大小变化监听器
  window.removeEventListener('resize', handleResize);
});

</script>

<style scoped>
.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: none; /* 隐藏默认箭头 */
}

/* 确保文件列表能够正确显示 */
.overflow-hidden {
  overflow: hidden;
}

/* 覆盖全局的文件图标颜色样式 */
.fa-file-pdf,
.fa-file-word,
.fa-file-excel,
.fa-file-powerpoint,
.fa-file-image,
.fa-file-video,
.fa-file-audio,
.fa-file-archive,
.fa-file-alt,
.fa-file-code,
.fa-file {
  color: #6b7280 !important;
  font-size: 0.875rem !important;
  width: 1.25rem !important;
  height: 1.25rem !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-style: normal !important;
  font-weight: normal !important;
  text-decoration: none !important;
  text-transform: none !important;
  letter-spacing: normal !important;
  word-wrap: normal !important;
  white-space: nowrap !important;
  direction: ltr !important;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
}


</style>

