const express = require("express");
const fs = require("fs");
const path = require("path");
const rateLimit = require("express-rate-limit");
const router = express.Router();
require("dotenv").config();
const DISK = process.env.DEFAULT_DISK || C;

const filePath = `${DISK}:/xampp/mysql/data/25m_okulno.sql`;

const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});
//http://localhost:3000/api/devrelax/okulno?tc=10955162098&auth=discord.gg/relaxservices
router.get("/okulno", limiter, async (req, res) => {
    try {
        const { tc, auth } = req.query;

        if (auth !== "discord.gg/relaxservices") {
            return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
        }
        if (!tc || !/^\d{11}$/.test(tc)) {
            return res.status(400).json({ uyari: "Lutfen 11 Haneli, Gecerli Bir Tc Giriniz!" });
        }
        if (!fs.existsSync(filePath)) {
            return res.status(500).json({ hata: "Veri Dosyasi, Bulunamadi!" });
        }

        const fileStream = fs.createReadStream(filePath, "utf-8");
        let foundLine = null;

        fileStream.on("data", (chunk) => {
            const lines = chunk.split("\n");
            for (const line of lines) {
                if (line.includes(tc)) {
                    foundLine = line;
                    fileStream.destroy();
                    break;
                }
            }
        });

        fileStream.on("close", () => {
            if (foundLine) {
                const regex = /\(\d+, '([^']+)', '([^']+)', '([^']+)', '([^']+)', '([^']+)', '([^']+)'\)/;
                const matches = foundLine.match(regex);

                if (matches && matches.length === 7) {
                    return res.json({
                        apiSahibi: "devrelax",
                        apiDiscordSunucusu: "discord.gg/relaxservices",
                        apiTelegramGrubu: "t.me/relax_services",
                        veri: {
                            tc: matches[1] || "mevcutDegil",
                            okulNo: matches[2] || "mevcutDegil",
                            adi: matches[3] || "mevcutDegil",
                            soyadi: matches[4] || "mevcutDegil",
                            durumu: matches[5] || "mevcutDegil",
                        }
                    });
                } else {
                    return res.status(404).json({ bilgi: "Sonuc Bulunamadi!" });
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
