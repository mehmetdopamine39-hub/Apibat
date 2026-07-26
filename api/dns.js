const express = require("express");
const dns = require("dns");

const router = express.Router();
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});
//http://localhost:3000/api/devrelax/dns?url=trendyol.com&auth=discord.gg/relaxservices
router.get("/dns", limiter, async (req, res) => {
    const { url, auth } = req.query;

    if (auth !== "discord.gg/relaxservices") {
        return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
    }

    if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(url)) {
        return res.status(400).json({ uyari: "Lutfen Gecerli Bir Url Giriniz!" });
    }

    try {
        const addresses = await new Promise((resolve, reject) => {
            dns.resolve(url, "A", (err, addresses) => {
                if (err) reject(err);
                else resolve(addresses);
            });
        });

        const nsRecords = await new Promise((resolve, reject) => {
            dns.resolveNs(url, (err, nsRecords) => {
                if (err) reject(err);
                else resolve(nsRecords);
            });
        });

        return res.json({
            apiSahibi: "devrelax",
            apiDiscordSunucusu: "discord.gg/relaxservices",
            apiTelegramGrubu: "t.me/relax_services",
            veri: {
                url: url,
                ipAdresi: addresses.length ? addresses : ["mevcutDegil"],
                NsKayitlari: nsRecords.length ? nsRecords : ["mevcutDegil"],
            }
        });

    } catch (error) {
        console.error("Sunucu Hatasi:", error.message);
        return res.status(500).json({ hata: "Sunucu Hatasi Olustu!" });
    }
});

module.exports = router;
