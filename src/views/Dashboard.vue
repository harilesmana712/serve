<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
    <div class="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
      <h1 class="text-2xl font-bold text-center mb-4">Manage Prefixes</h1>

      <!-- Input untuk menambahkan prefix -->
      <div class="space-y-3">
        <input
          v-model="newPrefix"
          placeholder="Enter new prefix"
          class="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400"
        />
        <button
          @click="addPrefix"
          class="bg-blue-500 hover:bg-blue-600 text-white p-2 w-full rounded transition-all duration-300"
        >
          Add Prefix
        </button>
      </div>

      <!-- Daftar prefix yang tersedia -->
      <div class="text-center mt-4">
  <h2 class="text-lg font-semibold mb-3">Current Prefixes:</h2>
  <div class="overflow-x-auto">
    <table border="1" class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-200">
          <th class="border border-gray-300 px-4 py-2">Prefix</th>
          <th class="border border-gray-300 px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="prefix in prefixes" :key="prefix" class="bg-white even:bg-gray-100">
          <td class="border border-gray-300 px-4 py-2 text-center text-lg font-semibold">
            {{ prefix }}
          </td>
          <td class="border border-gray-300 px-4 py-2 text-center">
            <button 
              @click="removePrefix(prefix)" 
              class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-all duration-300"
            >
              Remove
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>


      <!-- Daftar perintah -->
      <div class="text-center mt-6">
  <h2 class="text-lg font-semibold mb-3">Available Commands:</h2>
  <div class="overflow-x-auto">
    <table border="1" class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-200">
          <th class="border border-gray-300 px-4 py-2">Command</th>
          <th class="border border-gray-300 px-4 py-2">Response</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(response, command) in commands" :key="command" class="bg-white even:bg-gray-100">
          <td class="border border-gray-300 px-4 py-2 font-semibold">/{{ command }}</td>
          <td class="border border-gray-300 px-4 py-2 text-gray-700">{{ response }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

            <!-- Form untuk menambahkan perintah -->
      <div class="space-y-3">
        <input
          v-model="newCommand"
          placeholder="Enter command"
          class="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          v-model="newResponse"
          placeholder="Enter response"
          class="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400"
        ></textarea>
        <button
          @click="addCommand"
          class="bg-blue-500 hover:bg-blue-600 text-white p-2 w-full rounded transition-all duration-300"
        >
          Add Command
        </button>
      </div>

      <!-- Daftar perintah yang tersedia -->
      <div class="text-center mt-4">
  <h2 class="text-lg font-semibold mb-3">Current Commands:</h2>
  <div class="overflow-x-auto">
    <table border ="1" class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-200">
          <th class="border border-gray-300 px-4 py-2">Command</th>
          <th class="border border-gray-300 px-4 py-2">Response</th>
          <th class="border border-gray-300 px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(response, command) in commands" :key="command" class="bg-white even:bg-gray-100">
          <td class="border border-gray-300 px-4 py-2 font-semibold text-center">/{{ command }}</td>
          <td class="border border-gray-300 px-4 py-2 text-gray-700">{{ response }}</td>
          <td class="border border-gray-300 px-4 py-2 text-center">
            <button 
              @click="removeCommand(command)" 
              class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-all duration-300"
            >
              Remove
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
    newCommand: "",
      newResponse: "",
      commands: {},
      newPrefix: "",
      prefixes: [],
      
    };
  },
  methods: {
    async fetchPrefixes() {
      try {
        const res = await axios.get("http://localhost:3000/get-prefixes");
        this.prefixes = res.data.prefixes;
      } catch (error) {
        console.error("Error fetching prefixes:", error);
      }
    },
    async addPrefix() {
      if (!this.newPrefix) {
        alert("Prefix tidak boleh kosong!");
        return;
      }

      try {
        const res = await axios.post("http://localhost:3000/add-prefix", { prefix: this.newPrefix });
        alert(res.data.message);
        this.newPrefix = "";
        this.fetchPrefixes();
      } catch (error) {
        console.error("Error adding prefix:", error);
      }
    },
    async removePrefix(prefix) {
      try {
        const res = await axios.post("http://localhost:3000/remove-prefix", { prefix });
        alert(res.data.message);
        this.fetchPrefixes();
      } catch (error) {
        console.error("Error removing prefix:", error);
      }
    },
    async fetchCommands() {
      try {
        const res = await axios.get("http://localhost:3000/get-commands");
        this.commands = res.data.commands;
      } catch (error) {
        console.error("Error fetching commands:", error);
      }
    },
    async addCommand() {
      if (!this.newCommand || !this.newResponse) {
        alert("Command dan response tidak boleh kosong!");
        return;
      }

      try {
        const res = await axios.post("http://localhost:3000/add-command", {
          command: this.newCommand,
          response: this.newResponse,
        });
        alert(res.data.message);
        this.fetchCommands();
      } catch (error) {
        console.error("Error adding command:", error);
      }
    },
    async removeCommand(command) {
      try {
        const res = await axios.post("http://localhost:3000/remove-command", { command });
        alert(res.data.message);
        this.fetchCommands();
      } catch (error) {
        console.error("Error removing command:", error);
      }
    },

  },
  mounted() {
    this.fetchPrefixes();
this.fetchCommands();
  },
};
</script>