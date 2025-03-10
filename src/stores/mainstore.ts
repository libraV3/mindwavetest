import { ref } from 'vue';
import type { Ref } from 'vue';
import { defineStore } from 'pinia';

type Product = {
  id: number;
  product_name: string;
  product_amount: number;
};

export const useProductStore = defineStore('productstore', () => {
  const products: Ref<Array<Product>> = ref([]);

  async function getProducts() {
    let req;
    try {
      req = await fetch('http://dev.mindwave.kz/api/sandbox/crud');
      const reqj = await req.json().then((reqj) => reqj.content.rows);
      products.value = reqj;
    } catch (err) {
      console.log('whoops');
      console.log(err);
    }
  }

  async function addProduct(product_name: string, amount: number): Promise<boolean> {
    try {
      console.log(JSON.stringify({ product_name: product_name, amount: amount }));
      const req = await fetch(`http://dev.mindwave.kz/api/sandbox/crud/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_name: product_name, product_amount: Number(amount) }),
        mode: 'cors',
      });
      return req?.ok;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async function updateProduct(id: number, product_name: string, amount: number): Promise<boolean> {
    let req;
    try {
      console.log(JSON.stringify({ product_name: product_name, product_amount: amount }));
      req = await fetch(`http://dev.mindwave.kz/api/sandbox/crud/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_name: product_name, product_amount: amount }),
        mode: 'cors',
      });
      return req?.ok;
    } catch (err) {
      console.log(err);
      console.log(req?.headers);
      return false;
    }
  }

  async function deleteProduct(id: number): Promise<boolean> {
    try {
      const req = await fetch(`http://dev.mindwave.kz/api/sandbox/crud/${id}`, {
        method: 'DELETE',
        mode: 'cors',
      });
      return req?.ok;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  return { products, getProducts, addProduct, updateProduct, deleteProduct };
});
