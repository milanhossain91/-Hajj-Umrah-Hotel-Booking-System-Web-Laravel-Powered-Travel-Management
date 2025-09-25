<template>
  <MainLayout>
    <div class="overflow-x-auto bg-white rounded-lg shadow-md">
      <!-- course -->
      <p class="text-2xl font-bold text-center py-8">Course List</p>
      <div class="text-end m-4">
        <button @click="isModalOpen = true"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200">
          Create Course
        </button>
      </div>

      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100 sticky top-0">
          <tr>
            <th class="px-6 py-3 text-left text-base font-semibold text-gray-700 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-base font-semibold text-gray-700 uppercase tracking-wider">Picture</th>
            <th class="px-6 py-3 text-left text-base font-semibold text-gray-700 uppercase tracking-wider">Title</th>
            <th class="px-6 py-3 text-left text-base font-semibold text-gray-700 uppercase tracking-wider">Description
            </th>
            <th class="px-6 py-3 text-left text-base font-semibold text-gray-700 uppercase tracking-wider">Duration</th>
            <th class="px-6 py-3 text-left text-base font-semibold text-gray-700 uppercase tracking-wider">Students</th>
            <th class="px-6 py-3 text-left text-base font-semibold text-gray-700 uppercase tracking-wider">Price</th>
            <th class="px-6 py-3 text-left text-base font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-if="isLoading">
            <td colspan="8" class="text-center py-4">
              <a-spin></a-spin>
            </td>
          </tr>
          <tr v-for="item in courseList" :key="item.id" class="hover:bg-gray-50 transition">

            <td class="px-6 py-4 whitespace-nowrap text-base text-gray-900">{{ item.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-base text-gray-900">
              <img class="size-20" :src="`${imgBase}/${item.image}`" alt="">
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-base text-gray-900">{{ item.title }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-base text-gray-700">{{ item.description }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-base text-gray-700">{{ item.duration }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-base text-gray-700">{{ item.students_number }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-base text-gray-700">৳{{ item.price }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-base  space-x-2">
              <div class="flex items-center gap-3">
                <button @click="editItem(item)" class="text-blue-600 hover:text-blue-800 transition">
                  <Icon icon="mdi:pencil" class="w-7 h-7" />
                </button>
                <a-popconfirm title="Are you sure you want to delete this course?" ok-text="Yes" cancel-text="No"
                  @confirm="deleteItem(item.id)">
                  <button :disabled="deletingId === item.id" class="text-red-600 hover:text-red-800 transition"
                    :class="{ 'opacity-50 cursor-not-allowed': deletingId === item.id }">
                    <Icon icon="mdi:delete" class="w-7 h-7" />
                  </button>
                </a-popconfirm>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- create course modal -->
      <!-- create course modal -->
      <a-modal v-model:open="isModalOpen" title="Create Course" @ok="handleCreate" ok-text="Create" cancel-text="Cancel"
        :confirm-loading="isCreating">
        <form class="space-y-4" @submit.prevent="handleCreate">
          <!-- Title Field -->
          <div>
            <label class="block font-medium text-gray-700">Title <span class="text-red-500">*</span></label>
            <input type="text" v-model="form.title" required
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
              :class="{ 'border-red-500': errors.title }" />
            <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
          </div>

          <!-- Description Field -->
          <div>
            <label class="block font-medium text-gray-700">Description <span class="text-red-500">*</span></label>
            <textarea v-model="form.description" rows="3" required
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
              :class="{ 'border-red-500': errors.description }"></textarea>
            <p v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</p>
          </div>

          <!-- Duration Field -->
          <div>
            <label class="block font-medium text-gray-700">Duration <span class="text-red-500">*</span></label>
            <input type="text" v-model="form.duration" required
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
              :class="{ 'border-red-500': errors.duration }" />
            <p v-if="errors.duration" class="text-red-500 text-sm mt-1">{{ errors.duration }}</p>
          </div>

          <!-- Students Number Field -->
          <div>
            <label class="block font-medium text-gray-700">Students Number <span class="text-red-500">*</span></label>
            <input type="number" v-model="form.students_number"  required
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
              :class="{ 'border-red-500': errors.students_number }" />
            <p v-if="errors.students_number" class="text-red-500 text-sm mt-1">{{ errors.students_number }}</p>
          </div>

          <!-- Price Field -->
          <div>
            <label class="block font-medium text-gray-700">Price <span class="text-red-500">*</span></label>
            <input type="number" v-model="form.price" min="0" required
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
              :class="{ 'border-red-500': errors.price }" />
            <p v-if="errors.price" class="text-red-500 text-sm mt-1">{{ errors.price }}</p>
          </div>

          <!-- Image Upload Section -->
          <section>
            <h3 class="text-lg font-semibold text-gray-700 mb-4">Course Image <span class="text-red-500">*</span></h3>
            <div class="flex items-center gap-6 flex-wrap">
              <!-- Image Preview -->
              <div class="w-40 h-40 border rounded-md flex items-center justify-center bg-gray-50 overflow-hidden"
                :class="{ 'border-red-500': errors.image }">
                <template v-if="!photoPreview && !form.image">
                  <span class="text-xs text-gray-500 text-center p-2">Upload Course Image (Max 2MB)</span>
                </template>
                <img v-if="photoPreview" :src="photoPreview" alt="Uploaded" class="w-full h-full object-cover" />
                <img v-if="form.image && !photoPreview" :src="`${apiBase}/storage/${form.image}`" alt="Course Image"
                  class="w-full h-full object-cover" />
              </div>

              <!-- File Input -->
              <label for="courseImage"
                class="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded shadow">
                Upload Image
                <input type="file" id="courseImage" class="hidden" accept="image/*" @change="onFileChange" required />
              </label>
            </div>
            <p v-if="imageError" class="text-red-500 text-sm mt-2">{{ imageError }}</p>
            <p v-if="errors.image" class="text-red-500 text-sm mt-1">{{ errors.image }}</p>
          </section>
        </form>
      </a-modal>

      <!-- update modal -->
      <a-modal v-model:open="isEditModalOpen" :title="`Edit Course: ${editForm.title}`" @ok="handleUpdate"
        ok-text="Update" cancel-text="Cancel" :confirm-loading="isUpdating">
        <form class="space-y-4" @submit.prevent="handleUpdate">
          <!-- Title Field -->
          <div>
            <label class="block font-medium text-gray-700">Title <span class="text-red-500">*</span></label>
            <input type="text" v-model="editForm.title" required
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
              :class="{ 'border-red-500': editErrors.title }" />
            <p v-if="editErrors.title" class="text-red-500 text-sm mt-1">{{ editErrors.title }}</p>
          </div>

          <!-- Description Field -->
          <div>
            <label class="block font-medium text-gray-700">Description <span class="text-red-500">*</span></label>
            <textarea v-model="editForm.description" rows="3" required
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
              :class="{ 'border-red-500': editErrors.description }"></textarea>
            <p v-if="editErrors.description" class="text-red-500 text-sm mt-1">{{ editErrors.description }}</p>
          </div>

          <!-- Duration Field -->
          <div>
            <label class="block font-medium text-gray-700">Duration <span class="text-red-500">*</span></label>
            <input type="text" v-model="editForm.duration" required
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus-visible:ring"
              :class="{ 'border-red-500': editErrors.duration }" />
            <p v-if="editErrors.duration" class="text-red-500 text-sm mt-1">{{ editErrors.duration }}</p>
          </div>

          <!-- Students Number Field -->
          <div>
            <label class="block font-medium text-gray-700">Students Number <span class="text-red-500">*</span></label>
            <input type="number" v-model="editForm.students_number" required
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus-visible:ring"
              :class="{ 'border-red-500': editErrors.students_number }" />
            <p v-if="editErrors.students_number" class="text-red-500 text-sm mt-1">{{ editErrors.students_number }}</p>
          </div>

          <!-- Price Field -->
          <div>
            <label class="block font-medium text-gray-700">Price <span class="text-red-500">*</span></label>
            <input type="number" v-model="editForm.price"  required
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus-visible:ring"
              :class="{ 'border-red-500': editErrors.price }" />
            <p v-if="editErrors.price" class="text-red-500 text-sm mt-1">{{ editErrors.price }}</p>
          </div>

          <!-- Image Upload Section -->
          <section>
            <h3 class="text-lg font-semibold text-gray-700 mb-4">Course Image <span class="text-red-500">*</span></h3>
            <div class="flex items-center gap-6 flex-wrap">
              <!-- Image Preview -->
              <div class="w-40 h-40 border rounded-md flex items-center justify-center bg-gray-50 overflow-hidden"
                :class="{ 'border-red-500': editErrors.image }">
                <template v-if="!editPhotoPreview && !editForm.image">
                  <span class="text-xs text-gray-500 text-center p-2">Current Course Image</span>
                </template>
                <img v-if="editPhotoPreview" :src="editPhotoPreview" alt="Uploaded"
                  class="w-full h-full object-cover" />
                <img v-if="editForm.image && !editPhotoPreview" :src="`${imgBase}/${editForm.image}`" alt="Course Image"
                  class="w-full h-full object-cover" />
              </div>

              <!-- File Input -->
              <label for="editCourseImage"
                class="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded shadow">
                Change Image
                <input type="file" id="editCourseImage" class="hidden" accept="image/*" @change="onEditFileChange" />
              </label>
            </div>
            <p v-if="editImageError" class="text-red-500 text-sm mt-2">{{ editImageError }}</p>
            <p v-if="editErrors.image" class="text-red-500 text-sm mt-1">{{ editErrors.image }}</p>
            <p v-if="editForm.image" class="text-gray-500 text-sm mt-2">
              <button type="button" @click="removeImage" class="text-red-500 hover:text-red-700">
                Remove current image
              </button>
            </p>
          </section>
        </form>
      </a-modal>

    </div>

  </MainLayout>
</template>


<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
import { ref, onMounted } from "vue";
import { getToken, showNotification } from "@/utilities/common";
import { apiBase, imgBase } from "@/config";

import { Icon } from "@iconify/vue";
import axios from "axios";

const courseList = ref([]);
const isModalOpen = ref(false);
const isEditModalOpen = ref(false);
const currentCourseId = ref(null);
const isLoading = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);
const deletingId = ref(null);

// Form data and errors
const form = ref({
  title: '',
  description: '',
  duration: '',
  students_number: '',
  price: '',
  image: ''
});

const errors = ref({
  title: '',
  description: '',
  duration: '',
  students_number: '',
  price: '',
  image: ''
});

// Edit form data and errors
const editForm = ref({
  title: '',
  description: '',
  duration: '',
  students_number: 0,
  price: 0,
  image: ''
});

const editErrors = ref({
  title: '',
  description: '',
  duration: '',
  students_number: '',
  price: '',
  image: ''
});

// Image handling
const imageError = ref("");
const photoPreview = ref("");
const editPhotoPreview = ref("");
const editImageError = ref("");

// Validation functions
const validateForm = () => {
  let isValid = true;
  errors.value = {
    title: '',
    description: '',
    duration: '',
    students_number: '',
    price: '',
    image: ''
  };

  if (!form.value.title.trim()) {
    errors.value.title = 'Title is required';
    isValid = false;
  }

  if (!form.value.description.trim()) {
    errors.value.description = 'Description is required';
    isValid = false;
  }

  if (!form.value.duration.trim()) {
    errors.value.duration = 'Duration is required';
    isValid = false;
  }

  if (form.value.students_number < 0) {
    errors.value.students_number = 'Students number must be positive';
    isValid = false;
  }

  if (form.value.price < 0) {
    errors.value.price = 'Price must be positive';
    isValid = false;
  }

  const fileInput = document.getElementById('courseImage');
  if (!fileInput.files[0] && !form.value.image) {
    errors.value.image = 'Course image is required';
    isValid = false;
  }

  return isValid;
};

const validateEditForm = () => {
  let isValid = true;
  editErrors.value = {
    title: '',
    description: '',
    duration: '',
    students_number: '',
    price: '',
    image: ''
  };

  if (!editForm.value.title.trim()) {
    editErrors.value.title = 'Title is required';
    isValid = false;
  }

  if (!editForm.value.description.trim()) {
    editErrors.value.description = 'Description is required';
    isValid = false;
  }

  if (!editForm.value.duration.trim()) {
    editErrors.value.duration = 'Duration is required';
    isValid = false;
  }

  if (editForm.value.students_number < 0) {
    editErrors.value.students_number = 'Students number must be positive';
    isValid = false;
  }

  if (editForm.value.price < 0) {
    editErrors.value.price = 'Price must be positive';
    isValid = false;
  }

  const fileInput = document.getElementById('editCourseImage');
  if (!fileInput.files[0] && !editForm.value.image) {
    editErrors.value.image = 'Course image is required';
    isValid = false;
  }

  return isValid;
};

// Handle file selection
const onFileChange = (event) => {
  imageError.value = "";
  errors.value.image = '';
  const file = event.target.files[0];

  if (!file) return;

  // Validate file type
  if (!file.type.match("image.*")) {
    imageError.value = "Please select an image file (JPEG, PNG, etc.)";
    errors.value.image = "Please select an image file (JPEG, PNG, etc.)";
    return;
  }

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    imageError.value = "Image size should be less than 2MB";
    errors.value.image = "Image size should be less than 2MB";
    return;
  }

  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    photoPreview.value = e.target.result;
    form.value.image = ''; // Clear any existing image path
  };
  reader.readAsDataURL(file);
};

// Handle file selection for edit
const onEditFileChange = (event) => {
  editImageError.value = "";
  editErrors.value.image = '';
  const file = event.target.files[0];

  if (!file) return;

  // Validate file type
  if (!file.type.match("image.*")) {
    editImageError.value = "Please select an image file (JPEG, PNG, etc.)";
    editErrors.value.image = "Please select an image file (JPEG, PNG, etc.)";
    return;
  }

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    editImageError.value = "Image size should be less than 2MB";
    editErrors.value.image = "Image size should be less than 2MB";
    return;
  }

  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    editPhotoPreview.value = e.target.result;
    editForm.value.image = ''; // Clear any existing image path
  };
  reader.readAsDataURL(file);
};

// Remove current image
const removeImage = () => {
  editForm.value.image = '';
  editPhotoPreview.value = '';
  editErrors.value.image = 'Course image is required';
  const fileInput = document.getElementById('editCourseImage');
  if (fileInput) fileInput.value = '';
};

// Handle course creation
const handleCreate = async () => {
  if (!validateForm()) return;

  try {
    isCreating.value = true;

    // Prepare form data for file upload
    const formData = new FormData();
    formData.append('title', form.value.title);
    formData.append('description', form.value.description);
    formData.append('duration', form.value.duration);
    formData.append('students_number', form.value.students_number);
    formData.append('price', form.value.price);

    // Append image
    const fileInput = document.getElementById('courseImage');
    if (fileInput && fileInput.files[0]) {
      formData.append('image', fileInput.files[0]);
    }

    const token = getToken();

    const response = await axios.post(`${apiBase}/courses`, formData, {
      headers: {
        'Authorization': token.headers.Authorization,
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data) {
      showNotification('success', 'Course created successfully!');
      resetForm();
      await getCourses();
      isModalOpen.value = false;
    }
  } catch (error) {
    console.error('Error creating course:', error);
    let errorMessage = 'Failed to create course';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.errors) {
      // Handle backend validation errors
      const backendErrors = error.response.data.errors;
      for (const key in backendErrors) {
        if (backendErrors[key][0]) {
          errors.value[key] = backendErrors[key][0];
        }
      }
      errorMessage = 'Please fix the validation errors';
    }
    showNotification('error', errorMessage);
  } finally {
    isCreating.value = false;
  }
};

// Handle course update
const handleUpdate = async () => {
  if (!validateEditForm()) return;

  try {
    isUpdating.value = true;

    const formData = new FormData();
    formData.append('title', editForm.value.title);
    formData.append('description', editForm.value.description);
    formData.append('duration', editForm.value.duration);
    formData.append('students_number', editForm.value.students_number);
    formData.append('price', editForm.value.price);
    formData.append('_method', 'PUT');

    // Append image if selected
    const fileInput = document.getElementById('editCourseImage');
    if (fileInput && fileInput.files[0]) {
      formData.append('image', fileInput.files[0]);
    } else if (!editForm.value.image) {
      // If no image is selected and current image was removed
      formData.append('image', '');
    }

    const token = getToken();

    const response = await axios.post(`${apiBase}/courses/${currentCourseId.value}`, formData, {
      headers: {
        'Authorization': token.headers.Authorization,
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data) {
      showNotification('success', 'Course updated successfully!');
      resetEditForm();
      await getCourses();
      isEditModalOpen.value = false;
    }
  } catch (error) {
    console.error('Error updating course:', error);
    let errorMessage = 'Failed to update course';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.errors) {
      // Handle backend validation errors
      const backendErrors = error.response.data.errors;
      for (const key in backendErrors) {
        if (backendErrors[key][0]) {
          editErrors.value[key] = backendErrors[key][0];
        }
      }
      errorMessage = 'Please fix the validation errors';
    }
    showNotification('error', errorMessage);
  } finally {
    isUpdating.value = false;
  }
};

// Reset form to initial state
const resetForm = () => {
  form.value = {
    title: '',
    description: '',
    duration: '',
    students_number: 0,
    price: 0,
    image: ''
  };
  photoPreview.value = '';
  imageError.value = '';
  errors.value = {
    title: '',
    description: '',
    duration: '',
    students_number: '',
    price: '',
    image: ''
  };
  const fileInput = document.getElementById('courseImage');
  if (fileInput) fileInput.value = '';
};

// Reset edit form
const resetEditForm = () => {
  editForm.value = {
    title: '',
    description: '',
    duration: '',
    students_number: 0,
    price: 0,
    image: ''
  };
  editPhotoPreview.value = '';
  editImageError.value = '';
  editErrors.value = {
    title: '',
    description: '',
    duration: '',
    students_number: '',
    price: '',
    image: ''
  };
  currentCourseId.value = null;
  const fileInput = document.getElementById('editCourseImage');
  if (fileInput) fileInput.value = '';
};

// Edit item function
const editItem = (course) => {
  currentCourseId.value = course.id;
  editForm.value = {
    title: course.title,
    description: course.description,
    duration: course.duration,
    students_number: course.students_number,
    price: course.price,
    image: course.image
  };
  editPhotoPreview.value = '';
  editImageError.value = '';
  editErrors.value = {
    title: '',
    description: '',
    duration: '',
    students_number: '',
    price: '',
    image: ''
  };
  isEditModalOpen.value = true;
};

const deleteItem = (id) => {
  return handleDelete(id);
};

const handleDelete = async (id) => {
  try {
    deletingId.value = id;
    const token = getToken();

    const response = await axios.delete(`${apiBase}/courses/${id}`, token);

    if (response.data) {
      showNotification('success', 'Course deleted successfully!');
      await getCourses();
    }
  } catch (error) {
    console.error('Error deleting course:', error);
    let errorMessage = 'Failed to delete course';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    showNotification('error', errorMessage);
  } finally {
    deletingId.value = null;
  }
};

const getCourses = async () => {
  isLoading.value = true;
  try {
    const res = await axios.get(`${apiBase}/courses`, getToken());
    if (res.status == 200) {
      courseList.value = res.data;
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
    showNotification('error', 'Failed to fetch courses');
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await getCourses();
});
</script>