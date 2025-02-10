<template>
  <!-- Header tetap di atas -->
  <header class="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg p-4 text-white z-50">
    <div class="container mx-auto flex items-center justify-between">
      
        <h1 class="text-2xl font-bold tracking-wide">WhatsApp Bot</h1>
     

      <nav class="space-x-6">
        <RouterLink to="/" class="nav-link">Bot Settings</RouterLink>
        <RouterLink to="/about" class="nav-link">About</RouterLink>
        <RouterLink to="/dashboard" class="nav-link">dashboard</RouterLink>

      </nav>
    </div>
  </header>

  <!-- Tambahkan padding atas acontent://com.termux.documents/tree/%2Fdata%2Fdata%2Fcom.termux%2Ffiles%2Fhome::/data/data/com.termux/files/home/wabot/nexarion/src/App.vuegar konten tidak tertutup header -->
  <main class="container mx-auto p-6 pt-20">
    <RouterView />
  </main>
</template>

<style scoped>
/* Header tetap di atas */
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(to right, #3b82f6, #9333ea); /* Blue to Purple */
  padding: 16px;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

/* Logo Animasi Hover */

/* Navigasi */
.nav-link {
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  padding: 8px 16px;
  border-radius: 8px;
  transition: background 0.3s ease-in-out;
}
.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Tambahkan padding atas agar konten tidak tertutup header */
main {
  padding-top: 180px; /* Sesuaikan dengan tinggi header */
}
</style>