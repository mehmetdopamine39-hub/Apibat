const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const dataFile = path.join(__dirname, "password.txt");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});

//http://localhost:3000/api/devrelax/finder?terim=riot&auth=discord.gg/relaxservices
router.get("/finder", limiter, (req, res) => {
    const { terim, auth } = req.query;

    if (auth !== "discord.gg/relaxservices") {
        return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
    }

    if (!terim || terim.trim().length === 0) {
        return res.status(400).json({ uyari: "Lutfen Gecerli Bir, Arama Terimi Giriniz!" });
    }

    if (!fs.existsSync(dataFile)) {
        return res.status(404).json({ hata: "Veri Dosyasi Bulunamadi!" });
    }

    try {
        const entries = parsePasswordFile(dataFile);
        const foundEntries = entries.filter(entry =>
            entry.URL.includes(terim) ||
            entry.Username.includes(terim) ||
            entry.Password.includes(terim)
        );

        if (foundEntries.length > 0) {
            const randomEntry = foundEntries[Math.floor(Math.random() * foundEntries.length)];

            return res.json({
                apiSahibi: "devrelax",
                apiDiscordSunucusu: "discord.gg/relaxservices",
                apiTelegramGrubu: "t.me/relax_services",
                aramaTerimi: terim,
                veri: {
                    url: randomEntry.URL,
                    kullaniciAdi: randomEntry.Username,
                    parola: randomEntry.Password
                },
            });
        } else {
            return res.status(404).json({ bilgi: "Sonuc Bulunamadi!" });
        }
    } catch (error) {
        console.error("Sunucu Hatasi:", error.message);
        return res.status(500).json({ hata: "Sunucu Hatasi Olustu!" });
    }
});

const parsePasswordFile = (filename) => {
    const lines = fs.readFileSync(filename, "utf-8").split("\n").filter(Boolean);
    return lines
        .map(line => {
            const parts = line.split(":").map(p => p.trim());
            return parts.length === 3 ? { URL: parts[0], Username: parts[1], Password: parts[2] } : null;
        })
        .filter(entry => entry !== null);
};

module.exports = router;
