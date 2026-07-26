const express = require("express");
const db = require("../config/db");

const router = express.Router();
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});
//http://localhost:3000/api/devrelax/adsoyad?ad=ROKET&soyad=ATAR&auth=discord.gg/relaxservices
router.get("/adsoyad", limiter, (req, res) => {
    const { ad, soyad, auth } = req.query;

    if (auth !== "discord.gg/relaxservices") {
        return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
    }

    const sql = "SELECT * FROM 101m WHERE ADI = ? AND SOYADI = ?";
    db.query(sql, [ad, soyad], (err, result) => {
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
                tc: row.TC || "mevcutDegil",
                adi: row.ADI || "mevcutDegil",
                soyadi: row.SOYADI || "mevcutDegil",
                dogumTarihi: row.DOGUMTARIHI || "mevcutDegil",
                babaAdi: row.BABAADI || "mevcutDegil",
                babaTc: row.BABATC || "mevcutDegil",
                anneAdi: row.ANNEADI || "mevcutDegil",
                anneTc: row.ANNETC || "mevcutDegil",
                nufusIl: row.NUFUSIL || "mevcutDegil",
                nufusIlce: row.NUFUSILCE || "mevcutDegil"
            }))
        });
    });
});

module.exports = router;
