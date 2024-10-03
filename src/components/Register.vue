<template>
  <div class="container mt-5">
    <h2 class="text-center">Registro</h2>
    <form @submit.prevent="register" class="col-4 mx-auto">
      <div class="mb-3">
        <label for="email" class="form-label">Nombre</label>
        <input
          v-model="name"
          class="form-control"
          id="name"
          placeholder="Nombre"
          required
        />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          v-model="email"
          type="email"
          class="form-control"
          id="email"
          placeholder="Email"
          required
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Contraseña</label>
        <input
          v-model="password"
          type="password"
          class="form-control"
          id="password"
          placeholder="Contraseña"
          required
        />
      </div>
      <button type="submit" class="btn btn-success w-100">Registrarse</button>
      <p class="mt-3 text-center">
        ¿Ya tienes una cuenta?
        <router-link to="/login">Inicia sesión aquí</router-link>
      </p>
    </form>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  name: "UserRegister",
  data() {
    return {
      email: "",
      password: "",
      name: "",
    };
  },
  methods: {
    async register() {
      try {
        await api.post("/register", {
          email: this.email,
          password: this.password,
          name: this.name,
        });
        this.$router.push("/login");
      } catch (error) {
        console.error("Error al registrar:", error.response.data.message);
      }
    },
  },
};
</script>

<style>
.container {
  max-width: 400px;
  margin-top: 100px;
}
</style>
