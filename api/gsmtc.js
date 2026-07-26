const express = require("express");
const db = require("../config/db3");

const router = express.Router();
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});
//http://localhost:3000/api/devrelax/gsmtc?gsm=5070248311&auth=discord.gg/relaxservices
router.get("/gsmtc", limiter, (req, res) => {
    const { gsm, auth } = req.query;

    if (auth !== "discord.gg/relaxservices") {
        return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
    }

    if (!/^\d{10}$/.test(gsm)) {
        return res.status(400).json({ uyari: "Lutfen 10 Haneli Gecerli Bir, Gsm Numarasi Giriniz!" });
    }

    const sql = "SELECT GSM, TC FROM gsm WHERE GSM = ?";
    db.query(sql, [gsm], (err, result) => {
        if (err) {
            console.error("Veritabani Hatasi:", err);
            return res.status(500).json({ hata: "Veritabani Hatasi Olustu!" });
        }

        if (result.length === 0) {
            return res.status(404).json({ bilgi: "Sonuc Bulunamadi!" });
        }

        return res.json({
            apiSahibi: "devrelax",
            apiDiscordSunucusu: "discord.gg/relaxservices",
            apiTelegramGrubu: "t.me/relax_services",
            veri: result.map(row => ({
                gsm: row.GSM || "mevcutDegil",
                tc: row.TC || "mevcutDegil"
            })),
        });
    });
});

module.exports = router;
