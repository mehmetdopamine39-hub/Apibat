const express = require("express");
const axios = require("axios");

const router = express.Router();
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});
//http://localhost:3000/api/devrelax/bin?bin=548793&auth=discord.gg/relaxservices
router.get("/bin", limiter, async (req, res) => {
    const { bin, auth } = req.query;

    if (auth !== "discord.gg/relaxservices") {
        return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
    }

    if (!/^\d{6}$/.test(bin)) {
        return res.status(400).json({ uyari: "Lutfen Gecerli Bir Bin Numarasi Giriniz!" });
    }

    try {
        const apiUrl = `https://lookup.binlist.net/${bin}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        return res.json({
            apiSahibi: "devrelax",
            apiDiscordSunucusu: "discord.gg/relaxservices",
            apiTelegramGrubu: "t.me/relax_services",
            veri: {
                bin: bin,
                sema: data.scheme || "bilinmiyor",
                tip: data.type || "bilinmiyor",
                marka: data.brand || "bilinmiyor",
                banka: data.bank ? data.bank.name : "bilinmiyor",
                ulke: data.country ? data.country.name : "bilinmiyor",
                ulkeKodu: data.country ? data.country.alpha2 : "bilinmiyor",
                telefon: data.bank ? data.bank.phone : "bilinmiyor"
            }
        });

    } catch (error) {
        console.error("Sunucu Hatasi:", error.message);
        return res.status(500).json({ hata: "Sunucu Hatasi Olustu!" });
    }
});

module.exports = router;
