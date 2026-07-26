const express = require("express");
const db = require("../config/db0");

const router = express.Router();
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});

//http://localhost:3000/api/devrelax/vesika?tc=19007791262&auth=discord.gg/relaxservices
router.get("/vesika", limiter, (req, res) => {
    const { tc, auth } = req.query;

    if (auth !== "discord.gg/relaxservices") {
        return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
    }

    if (!/^\d{11}$/.test(tc)) {
        return res.status(400).json({ uyari: "Lutfen 11 Haneli, Gecerli Bir Tc Giriniz!" });
    }

    const sql = "SELECT * FROM 400k_vesika WHERE TC = ?";
    db.query(sql, [tc], (err, result) => {
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
                tc: row.tc || "mevcutDegil",
                vesika: row.vesika || "mevcutDegil",
                no: row.no || "mevcutDegil",
            }))
        });
    });
});

module.exports = router;
