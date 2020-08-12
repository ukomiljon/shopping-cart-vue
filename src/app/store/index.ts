import Vue from "vue";
import Vuex from "vuex";
import shop from '../api/shop';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {//data
    products: [],
    carts: [],
    checkoutStatus: null
  },
  getters: {// computed properties 
    products(state, getters) {
      return state.products
    },
    cartProducts(state: any) {
      return state.carts.map((cart: any) => {
        const product = state.products.find((product: any) => product.id === cart.id)
        return {
          title: product.title,
          price: product.price,
          quantity: cart.quantity
        }
      })
    },
    cartTotalPrice: (state, getters) => {
      return getters.cartProducts.reduce((total: number, product: any) => {
        return total + product.price * product.quantity
      }, 0)
    },
    productInStock() {
      return (product:any) => {
        return product.inventory > 0
      }
    }
  },

  actions: {

    fetchProducts(context) {

      return new Promise((resolve, reject) => {
        shop.getProducts((products: any) => {
          context.commit("setProducts", products)
          resolve()
        })
      })

    },
    addProductToCart(context: any, product: any) {
      if (context.getters.productInStock(product)) {
        const cartItem = context.state.carts.find((item: any) => item.id === product.id)

        if (!cartItem) {
          context.commit('pushProductToCart', product.id)
        }
        else {
          context.commit('incrementItemQuantiry', cartItem)
        }

        context.commit('decrementProductInventory', product)
      }
    },
    checkout(context: any) {
      shop.buyProducts(
        context.state.carts,
        () => {
          context.commit('emptyCart')
          context.commit('setCheckoutStatus', 'success')
        },
        () => {
          context.commit('setCheckoutStatus', 'failed')
        }
      )
    }
  },
  mutations: {
    setProducts(state: any, products: any) {
      //update products
      state.products = products
    },
    pushProductToCart(state: any, productId: any) {
      state.carts.push({
        id: productId,
        quantity: 1
      })
    },
    incrementItemQuantiry(state: any, cartItem: any) {
      cartItem.quantity++
    },
    decrementProductInventory(state: any, product: any) {
      product.inventory--
    },
    setCheckoutStatus(state: any, status: any) {
      state.checkoutStatus = status
    },
    emptyCart(state) {
      state.carts = []
    }

  },
  modules: {}
});
