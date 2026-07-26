const express = require("express");
const axios = require("axios");
const { JSDOM } = require("jsdom");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});
//http://localhost:3000/api/devrelax/kazi?url=https://riotgames.com&auth=discord.gg/relaxservices
router.get("/kazi", limiter, async (req, res) => {
    const { url, auth } = req.query;

    if (auth !== "discord.gg/relaxservices") {
        return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
    }

    if (!url || !isValidUrl(url)) {
        return res.status(400).json({ uyari: "Lutfen, Gecerli Bir Url Giriniz!" });
    }

    try {
        const response = await axios.get(url, { timeout: 10000 });
        const dom = new JSDOM(response.data);
        const document = dom.window.document;

        const title = document.querySelector("title")?.textContent || "mevcutDegil";
        const description =
            document.querySelector("meta[name='description']")?.getAttribute("content") || "mevcutDegil";

        const links = [...document.querySelectorAll("a[href]")].map((a) => a.href);
        const images = [...document.querySelectorAll("img[src]")].map((img) => img.src);

        return res.json({
            apiSahibi: "devrelax",
            apiDiscordSunucusu: "discord.gg/relaxservices",
            apiTelegramGrubu: "t.me/relax_services",
            veri: {
                baslik: title,
                aciklama: description,
                baglantilar: links,
                resimler: images
            }
        });

    } catch (error) {
        console.error("Sunucu Hatasi:", error.message);
        return res.status(500).json({ hata: "Sunucu Hatasi Olustu!" });
    }
});

const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
};

module.exports = router;
