<template>
  <div class="container mt-5">
    <!-- Formulario para agregar una factura -->
    <form @submit.prevent="addInvoice" class="mb-4">
      <h3>Factura</h3>
      <div class="row mb-3">
        <div class="col-6">
          <label class="form-label">Número:</label>
          <input
            v-model="invoice.number"
            type="text"
            class="form-control"
            required
          />
        </div>
        <div class="col-6">
          <label class="form-label">Fecha:</label>
          <input
            v-model="invoice.date"
            type="datetime-local"
            class="form-control"
            required
          />
        </div>
      </div>
      <label class="form-label">Emisor:</label>
      <div class="row mb-3">
        <div class="col-6">
          <input
            v-model="invoice.emitter_identification"
            type="text"
            class="form-control mb-2"
            placeholder="Identificacion"
            required
          />
        </div>
        <div class="col-6">
          <input
            v-model="invoice.emitter_name"
            type="text"
            class="form-control"
            placeholder="Nombre"
            required
          />
        </div>
      </div>
      <label class="form-label">Receptor:</label>
      <div class="row">
        <div class="col-6">
          <input
            v-model="invoice.receiver_identification"
            type="text"
            class="form-control mb-2"
            placeholder="Identificacion"
            required
          />
        </div>
        <div class="col-6">
          <input
            v-model="invoice.receiver_name"
            type="text"
            class="form-control"
            placeholder="Nombre"
            required
          />
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Total valor:</label>
        <input
          v-model="invoice.total_value"
          type="number"
          class="form-control"
          required
          disabled
        />
      </div>
      <div class="mb-3">
        <label class="form-label">IVA ({{ iva }}%):</label>
        <input
          v-model="invoice.iva"
          type="number"
          class="form-control"
          required
          disabled
        />
      </div>
      <div class="mb-3">
        <label class="form-label">Total valor con IVA:</label>
        <input
          v-model="invoice.total_value_iva"
          type="number"
          class="form-control"
          required
          disabled
        />
      </div>

      <!-- Agregar items a la factura -->
      <div>
        <h3>Items</h3>
        <button type="button" class="btn btn-primary mb-3" @click="addItem">
          Agregar Item
        </button>
        <div v-for="(item, index) in invoice.items" :key="index" class="mb-3">
          <div class="row align-items-center">
            <div class="col-md-4 mb-2">
              <label :for="'description-' + index" class="form-label"
                >Descripción:</label
              >
              <input
                v-model="item.description"
                :id="'description-' + index"
                type="text"
                class="form-control"
                placeholder="Descripción"
                required
              />
            </div>
            <div class="col-md-2 mb-2">
              <label :for="'quantity-' + index" class="form-label"
                >Cantidad:</label
              >
              <input
                v-model="item.quantity"
                :id="'quantity-' + index"
                type="number"
                class="form-control"
                placeholder="Cantidad"
                required
              />
            </div>
            <div class="col-md-3 mb-2">
              <label :for="'value-' + index" class="form-label">Valor:</label>
              <input
                v-model="item.value"
                :id="'value-' + index"
                type="number"
                class="form-control"
                placeholder="Valor"
                required
              />
            </div>
            <div class="col-md-3 mb-2">
              <label :for="'value-' + index" class="form-label"
                >Valor Total:</label
              >
              <input
                :value="item.value * item.quantity"
                :id="'value-' + index"
                type="number"
                class="form-control"
                placeholder="Valor"
                required
              />
            </div>
            <div class="col-md-3 mb-2">
              <button
                type="button"
                class="btn btn-danger mt-4"
                @click="removeItem(index)"
              >
                Eliminar
              </button>
            </div>
          </div>
          <hr />
        </div>
      </div>

      <div class="d-flex justify-content-center gap-3 mt-5">
        <button @click="resetForm" class="btn btn-secondary">
          Resetear Factura
        </button>
        <button type="submit" class="btn btn-success">
          {{ action === "create" ? "Agregar" : "Editar" }} Factura
        </button>
      </div>
    </form>

    <!-- Tabla de facturas -->
    <table class="table table-bordered mb-5">
      <thead>
        <tr>
          <th>Número</th>
          <th>Fecha</th>
          <th>Emisor</th>
          <th>Receptor</th>
          <th>Total con IVA</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in invoices" :key="index">
          <td>{{ item.number }}</td>
          <td>{{ item.date }}</td>
          <td>{{ item.emitter_name }}</td>
          <td>{{ item.receiver_name }}</td>
          <td>{{ item.total_value_iva }}</td>
          <td>
            <button class="btn btn-info me-2" @click="viewInvoice(index)">
              Ver
            </button>
            <button class="btn btn-warning me-2" @click="editInvoice(index)">
              Editar
            </button>
            <button
              class="btn btn-danger"
              @click="deleteInvoice(item.id, index)"
            >
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal para ver/editar la factura -->
    <div v-if="modalInvoice" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detalles de Factura</h5>
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <p><strong>Número:</strong> {{ modalInvoice.number }}</p>
            <p><strong>Fecha:</strong> {{ modalInvoice.date }}</p>
            <p><strong>Emisor:</strong> {{ modalInvoice.emitter_name }}</p>
            <p><strong>Receptor:</strong> {{ modalInvoice.receiver_name }}</p>
            <p><strong>Total:</strong> {{ modalInvoice.total_value }}</p>
            <p>
              <strong>IVA({{ iva }}%):</strong>
              {{ modalInvoice.iva }}
            </p>
            <p>
              <strong>Total con IVA:</strong> {{ modalInvoice.total_value_iva }}
            </p>

            <!-- Tabla para mostrar los items de la factura -->
            <h5 class="mt-4">Items</h5>
            <table class="table table-sm table-bordered">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>Valor Unitario</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in modalInvoice.items" :key="index">
                  <td>{{ item.description }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ item.value }}</td>
                  <td>{{ item.quantity * item.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../services/api.js";

export default {
  data() {
    return {
      invoice: {
        index: null,
        number: "",
        date: "",
        emitter_identification: "",
        emitter_name: "",
        receiver_identification: "",
        receiver_name: "",
        total_value: 0,
        iva: 0,
        total_value_iva: 0,
        items: [
          {
            description: "",
            quantity: 1,
            value: 0,
            total_value: 0,
          },
        ],
      },
      invoiceDefault: {
        index: null,
        number: "",
        date: "",
        emitter_identification: "",
        emitter_name: "",
        receiver_identification: "",
        receiver_name: "",
        total_value: 0,
        iva: 0,
        total_value_iva: 0,
        items: [
          {
            description: "",
            quantity: 1,
            value: 0,
            total_value: 0,
          },
        ],
      },
      invoices: [],
      modalInvoice: null,
      iva: 5,
      action: "create",
    };
  },
  methods: {
    async getInvoices() {
      try {
        const response = await api.get("/invoices");
        this.invoices = response.data;
      } catch (error) {
        console.error(
          "Error al obtener facturas:",
          error.response.data.message
        );
      }
    },
    async addInvoice() {
      try {
        if (this.action === "update") {
          // Actualizar el invoice existente
          await api.put(`/invoices/${this.invoice.id}`, this.invoice);
          this.invoices.splice(this.invoice.index, 1, { ...this.invoice });
        } else {
          // Crear nuevo invoice
          const response = await api.post("/invoices", this.invoice);
          this.invoices.push(response.data);
        }
        this.resetForm();
      } catch (error) {
        console.error(
          "Error al guardar la factura:",
          error.response.data.message
        );
      }
    },
    async deleteInvoice(id, index) {
      try {
        await api.delete(`/invoices/${id}`);
        this.invoices.splice(index, 1);
      } catch (error) {
        console.error(
          "Error al eliminar la factura:",
          error.response.data.message
        );
      }
    },
    addItem() {
      this.invoice.items.push({
        description: "",
        quantity: 1,
        value: 0,
        total_value: 0,
      });
    },
    removeItem(index) {
      this.invoice.items.splice(index, 1);
    },
    resetForm() {
      this.action = "create";
      this.invoice = this.invoiceDefault;
    },
    viewInvoice(index) {
      this.modalInvoice = { ...this.invoices[index] };
    },
    editInvoice(index) {
      this.action = "update";
      this.invoice = { ...this.invoices[index], index };
    },
    closeModal() {
      this.modalInvoice = null;
    },
    calculateTotals() {
      // Calcular el valor del IVA y el valor total con IVA
      const totalItems = this.invoice.items.reduce((acc, item) => {
        return acc + item.quantity * item.value;
      }, 0);
      const totalValue = totalItems;
      const ivaValue = (totalValue * this.iva) / 100;
      const totalWithIva = totalValue + ivaValue;

      // Actualizar el valor del IVA y el total con IVA
      this.invoice.iva = ivaValue.toFixed(0);
      this.invoice.total_value_iva = totalWithIva.toFixed(0);
      this.invoice.total_value = totalValue;
    },
  },
  mounted() {
    this.getInvoices();
  },
  watch: {
    "invoice.items": {
      handler() {
        this.calculateTotals();
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.modal.show.d-block {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
