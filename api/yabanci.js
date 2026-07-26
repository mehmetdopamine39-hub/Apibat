const express = require("express");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const DISK = process.env.DEFAULT_DISK || C;

const router = express.Router();
const filePath = `${DISK}:/xampp/mysql/data/2m_yabanci.txt`;

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});
//http://localhost:3000/api/devrelax/yabanci?gsm=07504489985&auth=discord.gg/relaxservices
router.get("/yabanci", limiter, async (req, res) => {
    try {
        const { gsm, auth } = req.query;

        if (auth !== "discord.gg/relaxservices") {
            return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
        }
        if (!gsm || !/^0\d{10}$/.test(gsm)) {
            return res.status(400).json({ uyari: "Lutfen 11 Haneli, Basinda 0 Olan, Gecerli Bir Yabanci Gsm Giriniz!" });
        }

        if (!fs.existsSync(filePath)) {
            return res.status(500).json({ hata: "Veri Dosyasi, Bulunamadi!" });
        }

        const fileStream = fs.createReadStream(filePath, "utf-8");
        let foundLine = null;

        fileStream.on("data", (chunk) => {
            const lines = chunk.split("\n");
            for (const line of lines) {
                if (line.includes(gsm)) {
                    foundLine = line;
                    fileStream.destroy();
                    break;
                }
            }
        });

        fileStream.on("close", () => {
            if (foundLine) {
                const regex = /Full Name\s:\s([^|]+).*?Identity Card Num\s:\s([^|]+).*?Identity Card Type\s:\s([^|]+).*?Phone\s:\s([^|]+).*?Birth Date\s:\s([^|]+).*?Job\s:\s([^|]+).*?Resident Type\s:\s([^|]+)/;
                const matches = foundLine.match(regex);

                if (matches && matches.length === 8) {
                    return res.json({
                        apiSahibi: "devrelax",
                        apiDiscordSunucusu: "discord.gg/relaxservices",
                        apiTelegramGrubu: "t.me/relax_services",
                        veri: {
                            adiSoyadi: matches[1] || "mevcutDegil",
                            kimlikNumarasi: matches[2] || "mevcutDegil",
                            kimlikTuru: matches[3] || "mevcutDegil",
                            gsm: matches[4] || "mevcutDegil",
                            dogumTarihi: matches[5] || "mevcutDegil",
                            meslek: matches[6] || "mevcutDegil",
                            ikametTuru: matches[7] || "mevcutDegil"
                        }
                    });
                } else {
                    return res.status(404).json({ bilgi: "Aranan Yabanci Gsm, Bulunamadi!" });
                }
            } else {
                return res.status(404).json({ bilgi: "Sonuc Bulunamadi!" });
            }
        });

        fileStream.on("error", (err) => {
            console.error("Dosya Okuma Hatasi:", err);
            return res.status(500).json({ hata: "Dosya Okuma Hatasi Olustu!" });
        });

    } catch (error) {
        console.error("Sunucu Hatasi:", error);
        res.status(500).json({ hata: "Sunucu Hatasi Olustu!" });
    }
});

module.exports = router;
