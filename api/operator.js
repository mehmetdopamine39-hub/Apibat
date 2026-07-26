const express = require("express");
const axios = require("axios");
require("dotenv").config();
const rateLimit = require("express-rate-limit");
const router = express.Router();

const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});
//http://localhost:3000/api/devrelax/operator?gsm=5070248311&auth=discord.gg/relaxservices
router.get("/operator", limiter, async (req, res) => {
    const { gsm, auth } = req.query;

    if (auth !== "discord.gg/relaxservices") {
        return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
    }

    if (!/^\d{10}$/.test(gsm)) {
        return res.status(400).json({ uyari: "Lutfen 10 Haneli, Gecerli Bir Gsm Giriniz!" });
    }

    try {
        const apiUrl = `https://phonevalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&phone=+90${gsm}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data.valid) {
            return res.status(404).json({ bilgi: "Sonuc Bulunamadi!" });
        }

        return res.json({
            apiSahibi: "devrelax",
            apiDiscordSunucusu: "discord.gg/relaxservices",
            apiTelegramGrubu: "t.me/relax_services",
            veri: {
                gsm: data.format.local || "mevcutDegil",
                ulkeKodu: data.country.code || "mevcutDegil",
                konum: data.location || "mevcutDegil",
                operator: data.carrier || "mevcutDegil",
            }
        });

    } catch (error) {
        console.error("Sunucu Hatasi:", error);
        return res.status(500).json({ hata: "Sunucu Hatasi Olustu!" });
    }
});

module.exports = router;
