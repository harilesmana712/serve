<template>
  <div class="flex flex-col items-center min-h-screen bg-gray-100 p-6">
    <div class="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
      <h1 class="text-2xl font-bold text-center mb-4">WhatsApp Bot Settings</h1>

      <div>
        <div class="text-center my-4">
          <span class="text-lg font-semibold">Status: </span>
          <span :class="statusClass">{{ status }}</span>
        </div>

        <button v-if="status !== 'Running'" @click="startBot" class="bg-green-500 hover:bg-green-600 text-white p-2 mt-2 rounded w-full transition-all duration-300">
          Start Bot
        </button>

        <!-- QR Code -->
        <div v-if="qrCode" class="text-center mt-6">
          <h2 class="text-xl font-semibold">Scan QR Code:</h2>
          <div class="flex justify-center mt-3">
            <qrcode-vue :value="qrCode" size="200" class="shadow-lg rounded-lg"></qrcode-vue>
          </div>
        </div>

        <!-- 📩 Tampilan Monitoring Pesan -->
        <div class="mt-6">
          <h2 class="text-xl font-semibold text-center">📩 Incoming Messages</h2>
          <div class="border rounded-md p-3 max-h-80 overflow-auto bg-gray-50 mt-3">
            <div v-for="msg in messages" :key="msg.timestamp" class="p-2 border-b">
              <p class="text-xs text-gray-600">{{ msg.timestamp }}</p>
              <p class="font-semibold text-blue-600">{{ msg.sender }}</p>
              <p class="text-gray-800">{{ msg.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import QrcodeVue from "vue-qrcode";

export default {
  components: { QrcodeVue },
  data() {
    return {
      apiBaseUrl: "content-balance-production.up.railway.app/",
      status: "Disconnected",
      qrCode: null,
      messages: [],
    };
  },
  computed: {
    statusClass() {
      return {
        "text-red-500 font-bold": this.status === "Disconnected",
        "text-green-500 font-bold": this.status === "Running",
        "text-yellow-500 font-bold": this.status === "Starting...",
      };
    },
  },
  methods: {
    async startBot() {
      this.status = "Starting...";
      try {
        const res = await axios.get(`${this.apiBaseUrl}start-bot`);
        if (res.data.success) {
          this.pollQR();
          this.pollStatus();
        } else {
          alert(res.data.message);
        }
      } catch (error) {
        alert("Failed to start bot");
      }
    },
    async checkStatus() {
      try {
        const res = await axios.get(`${this.apiBaseUrl}status-bot`);
        if (res.data.success) {
          this.status = "Running";
          this.pollMessages(); // Mulai monitoring pesan
        }
      } catch (error) {
        this.status = "Disconnected";
      }
    },
    async pollMessages() {
      setInterval(async () => {
        try {
          const res = await axios.get(`${this.apiBaseUrl}get-messages`);
          if (res.data.success) {
            this.messages = res.data.messages;
          }
        } catch (error) {
          console.error("Gagal mengambil pesan:", error);
        }
      }, 5000); // Perbarui pesan setiap 5 detik
    },
  },
  created() {
    this.checkStatus();
  },
};
</script>
