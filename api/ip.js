const express = require("express");
const axios = require("axios");

const router = express.Router();
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});
//http://localhost:3000/api/devrelax/ip?ip=193.42.103.147&auth=discord.gg/relaxservices
router.get("/ip", limiter, async (req, res) => {
    const { ip, auth } = req.query;

    if (auth !== "discord.gg/relaxservices") {
        return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
    }

    if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) {
        return res.status(400).json({ uyari: "Lutfen Gecerli Bir, İp Adresi Giriniz!" });
    }

    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`);
        const data = response.data;

        if (data.status === "fail") {
            return res.status(404).json({ bilgi: "Sonuc Bulunamadi!" });
        }

        return res.json({
            apiSahibi: "devrelax",
            apiDiscordSunucusu: "discord.gg/relaxservices",
            apiTelegramGrubu: "t.me/relax_services",
            veri: {
                ip: data.query || "mevcutDegil",
                ulke: `${data.country} (${data.countryCode})` || "mevcutDegil",
                bolge: `${data.regionName} (${data.region})` || "mevcutDegil",
                sehir: data.city || "mevcutDegil",
                postaKodu: data.zip || "mevcutDegil",
                enlem: data.lat || "mevcutDegil",
                boylam: data.lon || "mevcutDegil",
                zamanDilimi: data.timezone || "mevcutDegil",
                isp: data.isp || "mevcutDegil",
                organizasyon: data.org || "mevcutDegil",
                as: data.as || "mevcutDegil",
                haritaLinki: `https://www.google.com/maps?q=${data.lat},${data.lon}&z=10`
        }
        });

    } catch (error) {
        console.error("Sunucu Hatasi:", error.message);
        return res.status(500).json({ hata: "Sunucu Hatasi Olustu!" });
    }
});

module.exports = router;
