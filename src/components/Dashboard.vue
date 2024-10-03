<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div class="container">
        <a class="navbar-brand" href="#">Dashboard</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <button class="btn btn-outline-danger" @click="logout">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <InvoiceForm />
  </div>
</template>

<script>
import InvoiceForm from "./InvoiceForm.vue";

export default {
  name: "UserDashboard",
  components: {
    InvoiceForm,
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
};
</script>

<style>
.container {
  max-width: 800px;
  margin-top: 20px;
}
</style>
