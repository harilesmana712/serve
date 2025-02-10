const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

let botSocket = null;
const users = [{ username: "admin", password: "root" }];
let latestQR = null;

// Fungsi untuk memulai bot
async function startBot() {
    if (botSocket) {
        console.log("Bot sudah berjalan!");
        return;
    }

    try {
        console.log("Memulai bot...");
        const { state, saveCreds } = await useMultiFileAuthState("session");
        botSocket = makeWASocket({
            auth: state,
            printQRInTerminal: false, // QR dimatikan agar bisa diakses lewat endpoint
        });

        botSocket.ev.on("creds.update", saveCreds);
        botSocket.ev.on("connection.update", (update) => {
            const { qr, connection, lastDisconnect } = update;

            if (qr) {
                latestQR = qr;
                console.log("Scan QR Code untuk login:");
                qrcode.generate(qr, { small: true }); // Tampilkan QR di terminal
            }

            if (connection === "open") {
                console.log("✅ WhatsApp bot terhubung!");
                latestQR = null; // Hapus QR setelah berhasil login
            } else if (connection === "close") {
                latestQR = null;
                const reason = lastDisconnect?.error?.output?.statusCode;

                if (reason === DisconnectReason.loggedOut) {
                    console.log("⚠️ WhatsApp bot logout, perlu scan ulang.");
                    botSocket = null;
                } else {
                    console.log("🔄 Bot terputus, mencoba reconnect...");
                    botSocket = null;
                    setTimeout(startBot, 5000); // Restart setelah 5 detik
                }
            }
        });

    } catch (error) {
        console.error("❌ Gagal memulai bot:", error.message);
    }
}

// Endpoint untuk mendapatkan QR Code
app.get("/get-qr", (req, res) => {
    res.json({ qr: latestQR });
});

// Endpoint untuk memulai bot
app.get("/start-bot", async (req, res) => {
    if (botSocket) {
        return res.json({ success: false, message: "Bot sudah berjalan" });
    }

    await startBot();
    res.json({ success: true, message: "Bot sedang dimulai, scan QR jika diperlukan" });
});

// Endpoint untuk mengecek status bot
app.get("/status-bot", (req, res) => {
    const isRunning = !!botSocket;
    res.json({ success: isRunning, status: isRunning ? "Running" : "Disconnected" });
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
