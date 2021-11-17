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
