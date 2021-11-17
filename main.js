import lessons from "./lessons.js"

// Components
const Home = {
  template: "#home",
  computed: {
    lessons() {
      return this.$store.state.lessons
    },
  },
  methods: {
    addToCart(item) {
      this.$store.commit("addToCart", item)
    },
  },
}

const Cart = {
  template: "#cart",
  data() {
    return {
      name: "",
      phone: 0,
    }
  },
  computed: {
    cart() {
      return this.$store.state.cart
    },
    isNameValid() {
      const regex = /[a-zA-Z]/
      return regex.test(this.name)
    },
    isPhoneValid() {
      const regex = /[0-9]/
      return regex.test(this.phone)
    },
  },
  methods: {
    removeItemInCart(item) {
      this.$store.commit("removeCart", item)
    },
    resetCart() {
      this.$store.commit("resetCart")
    },
    checkout() {
      this.name = ""
      this.phone = 0
      this.resetCart()
      this.$toasted.success("Checkout successful.")
      this.$router.push('/')
    },
  },
}

// Store (vuex)
const store = new Vuex.Store({
    state: {
      lessons: [...lessons],
      cart: [],
    },
    mutations: {
      addToCart(state, lessonItem) {
        const index = state.lessons.findIndex((item) => item.subject === lessonItem.subject)
        const isLessonInCart = state.cart.some((item) => item.subject === lessonItem.subject)
  
        state.lessons[index].space -= 1
  
        if (isLessonInCart) {
          const cartIndex = state.cart.findIndex((item) => item.subject === lessonItem.subject)
          state.cart[cartIndex].item += 1
        } else {
          state.lessons[index].item += 1
          state.cart.push(state.lessons[index])
        }
      },
      removeCart(state, cartItem) {
        const index = state.cart.findIndex((item) => item.subject === cartItem.subject)
        const lessonIndex = state.lessons.findIndex((item) => item.subject === cartItem.subject)
  
        state.lessons[lessonIndex].space += cartItem.item
  
        state.cart[index].item > 0 ? (state.cart[index].item -= 1) : (state.cart[index].item = 0)
        state.cart.splice(index, 1)
      },
      resetCart(state) {
        state.cart = []
      },
    },
  })
  
  // Route
  const routes = [
    {path: "/index.html", component: Home},
    {path: "/cart", component: Cart},
  ]
  
  const router = new VueRouter({
    mode: "history",
    routes,
  })
  
  // Vue-toasted
  Vue.use(Toasted)
  
  // Initialize Vue
  new Vue({
    store,
    router,
  }).$mount("#app")