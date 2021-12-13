import lessons from "./lessons.js"

// Components
const Home = {
  template: "#home",
  data() {
    return {
      sortBy: "",
      sortBy2: "",
      reversed: false
    }
  },
  computed: {
    lessons() {
      return this.$store.state.lessons
    },
    cart() {
      return this.$store.state.cart
    }
  },
  methods: {
    addToCart(item) {
      this.$store.commit("addToCart", item)
    },
    onSortChange(sortBy) {
      let sortedLessons = []

      switch (sortBy) {
        case "ascending":
          sortedLessons = this.reversed ? this.$store.state.lessons.reverse() : this.$store.state.lessons

          if (this.reversed) this.reversed = false
            
          this.$store.commit("sortLessons", sortedLessons)

          break
        case "descending":
          sortedLessons = this.$store.state.lessons.reverse()

          this.reversed = true

          this.$store.commit("sortLessons", sortedLessons)

          break
        case "subject":
          sortedLessons = this.$store.state.lessons.sort((a, b) => {
            if (a.subject.toUpperCase() < b.subject.toUpperCase()) {
              return -1
            }
            if (a.subject.toUpperCase() > b.subject.toUpperCase()) {
              return 1
            }

            return 0
          })

          this.$store.commit("sortLessons", sortedLessons)

          break
        case "location":
          sortedLessons = this.$store.state.lessons.sort((a, b) => {
            if (a.location.toUpperCase() < b.location.toUpperCase()) {
              return -1
            }
            if (a.location.toUpperCase() > b.location.toUpperCase()) {
              return 1
            }

            return 0
          })

          this.$store.commit("sortLessons", sortedLessons)

          break
        case "price":
          sortedLessons = this.$store.state.lessons.sort((a, b) => a.price - b.price)

          this.$store.commit("sortLessons", sortedLessons)

          break
        case "space":
          sortedLessons = this.$store.state.lessons.sort((a, b) => a.space - b.space)

          this.$store.commit("sortLessons", sortedLessons)

          break
        default:
          break
      }
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
      this.$router.push("/")
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
    sortLessons(state, sortedLessons) {
      state.lessons = [...sortedLessons]
    },
  },
})

// Route
const routes = [
  {path: "/", component: Home},
  {path: "/cart", component: Cart},
]

const router = new VueRouter({
  mode: "hash",
  routes,
})

// Vue-toasted
Vue.use(Toasted)

// Initialize Vue
new Vue({
  store,
  router,
}).$mount("#app")