const express = require("express");
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const router = express.Router();
require("dotenv").config();

const apiRel = process.env.ABSTRACT_API_KEY_MAIL;

const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});
//http://localhost:3000/api/devrelax/mail?email=devrelaxx@gmail.com&auth=discord.gg/relaxservices
router.get("/mail", limiter, async (req, res) => {
    const { email, auth } = req.query;

    if (auth !== "discord.gg/relaxservices") {
        return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ uyari: "Lutfen Gecerli Bir, e-Posta Adresi Giriniz!" });
    }

    const apiUrl = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiRel}&email=${email}`;

    try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data || !data.email) {
            return res.status(500).json({ bilgi: "Sonuc Bulunamadi!" });
        }

        return res.json({
            apiSahibi: "devrelax",
            apiDiscordSunucusu: "discord.gg/relaxservices",
            apiTelegramGrubu: "t.me/relax_services",
            veri: {
                mail: data.email || "bilinmiyor",
                gecerlilik: data.deliverability === "DELIVERABLE" ? "gecerli" : "gecersiz",
                format: data.is_valid_format?.value ? "gecerli" : "gecersiz",
                dnsKaydi: data.is_dns_valid?.value ? "var" : "yok",
                smtpKontrol: data.is_smtp_valid?.value ? "basarili" : "basarisiz",
                tekKullanimlik: data.is_disposable?.value ? "evet" : "hayir"
                }
        });

    } catch (error) {
        console.error("Sunucu Hatasi:", error.message);
        return res.status(500).json({ hata: "Sunucu Hatasi Olustu!" });
    }
});

module.exports = router;
