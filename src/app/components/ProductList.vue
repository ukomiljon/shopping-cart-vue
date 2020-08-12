<template>
  <div>
    <h1>Product List</h1>
    <img v-if="loading" src="https://i.imgur.com/JfPpwOA.gif" />
    <ul v-else>
      <li v-for="product in products" :key="product.id">
        {{ product.title }}-{{ product.price | currency }}-{{
          product.inventory
        }}
        <button
          :disabled="!productInStock(product)"
          @click="addProductToCart(product)"
        >
          Add to Cart
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    products() {
      return this.$store.getters.products;
    },
    productInStock(){
        return this.$store.getters.productInStock
    }
  },
  created() {
    this.loading = true;
    this.$store.dispatch("fetchProducts").then(() => {
      this.loading = false;
    });
  },
  methods: {
    addProductToCart(product) {
      this.$store.dispatch("addProductToCart", product);
    },
  },
};
</script>

<style lang="scss" scoped></style>
