<script setup lang="ts">
import { useProductStore } from '@/stores/mainstore';
import { ref, computed } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';

type Product = {
  id: number;
  product_name: string;
  product_amount: number;
};

const store = useProductStore();
const products = computed(() => store.products);
const status_msg = ref('');

const form_mode = ref(0);
const ed_index = ref(-1);
const ed_id = ref(-1);
const prod_name = ref('');
const prod_amount = ref(0);

function showAddForm() {
  form_mode.value = 1;
  prod_name.value = '';
  prod_amount.value = 0;
}

function showUpdateForm(ed: Product) {
  form_mode.value = 2;
  ed_index.value = store.products.indexOf(ed);
  ed_id.value = ed.id;
  prod_name.value = ed.product_name;
  prod_amount.value = ed.product_amount;
}

function showDeleteForm(ed: Product) {
  form_mode.value = 3;
  ed_id.value = ed.id;
}

function hideForm() {
  form_mode.value = 0;
  ed_id.value = -1;
  ed_index.value = 0;
  prod_name.value = '';
  prod_amount.value = 0;
}

async function addProduct() {
  if (await store.addProduct(prod_name.value, prod_amount.value)) {
    hideForm();
    store.getProducts();
    status_msg.value = 'Product added';
  } else {
    hideForm();
    status_msg.value = 'There was an error when adding the product';
  }
}

async function updateProduct() {
  if (
    prod_name.value == store.products[ed_index.value].product_name &&
    prod_amount.value == store.products[ed_index.value].product_amount
  ) {
    hideForm();
    status_msg.value = 'No details changed';
  } else if (await store.updateProduct(ed_id.value, prod_name.value, prod_amount.value)) {
    store.products[ed_index.value].product_name = prod_name.value;
    store.products[ed_index.value].product_amount = prod_amount.value;
    hideForm();
    status_msg.value = 'Product details updated';
  } else {
    hideForm();
    status_msg.value = 'There was an error when updating the product details';
  }
}

async function deleteProduct() {
  if (await store.deleteProduct(ed_id.value)) {
    store.products.splice(ed_index.value);
    status_msg.value = 'Product deleted';
  } else {
    hideForm();
    status_msg.value = 'There was an error when deleting the product';
  }
}

onBeforeRouteUpdate(() => {
  store.getProducts().catch((err) => console.log(err));
});
</script>

<template>
  <div class="fixed top-0 left-0 w-screen h-screen z-2 bg-black/25" v-show="form_mode">
    <div class="fixed top-3/8 left-3/8 rounded-md bg-white w-60 sm:w-1/4 p-4">
      <div v-if="form_mode != 3" class="flex flex-col">
        <label for="prodname">Product name: </label>
        <input type="text" id="prodname" class="border-1 border-blue-300" v-model="prod_name" />
        <label for="prodamount">Product amount: </label>
        <input type="text" id="prodamount" class="border-1 border-blue-300" v-model="prod_amount" />
        <div>
          <button
            class="rounded-md p-2 mt-2 bg-blue-300 w-fit"
            v-if="form_mode == 1"
            @click="addProduct()"
          >
            Add
          </button>
          <button
            class="rounded-md p-2 mt-2 bg-blue-300 w-fit"
            v-if="form_mode == 2"
            @click="updateProduct()"
          >
            Update
          </button>
          <button class="rounded-md p-2 mt-2 ml-1 bg-blue-300 w-fit" @click="hideForm()">
            Cancel
          </button>
        </div>
      </div>
      <div v-else class="flex flex-col items-center">
        <p class="">Are you sure?</p>
        <div>
          <button class="rounded-md p-2 mt-2 bg-blue-300 w-fit" @click="deleteProduct()">
            Yes
          </button>
          <button class="rounded-md p-2 mt-2 ml-1 bg-blue-300 w-fit" @click="hideForm()">No</button>
        </div>
      </div>
    </div>
  </div>
  <main class="flex flex-col grow place-self-center justify-items-center">
    <div class="flex items-center justify-between">
      <button class="rounded-md p-1 m-2 bg-blue-300 size-fit" @click="showAddForm()">
        Add product
      </button>
      <div class="m-2">{{ status_msg }}</div>
    </div>
    <Suspense>
      <div class="flex grow">
        <div class="grid grid-cols-3 grow">
          <div
            v-for="product in products"
            :key="product.id"
            class="flex justify-between bg-blue-300 m-2 p-2 rounded-md"
          >
            <div class="flex items-center">
              <span class="mr-4 font-bold align-middle">
                {{ product.product_name }}
              </span>
            </div>
            <div class="flex items-center">
              <span class="mr-4 align-middle"
                >ID: {{ product.id }}<br />Pcs: {{ product.product_amount }}</span
              >
              <button class="rounded-md p-1 bg-blue-400" @click="showUpdateForm(product)">
                Edit
              </button>
              <button class="rounded-md p-1 ml-2 bg-blue-400" @click="showDeleteForm(product)">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <template #fallback>loading...</template>
    </Suspense>
  </main>
</template>
