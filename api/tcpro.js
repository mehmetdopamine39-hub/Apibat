const express = require("express");
const db = require("../config/db2");

const router = express.Router();

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});
//http://localhost:3000/api/devrelax/tcpro?tc=11404305356&auth=discord.gg/relaxservices
router.get("/tcpro", limiter, (req, res) => {
    const { tc, auth } = req.query;

    if (auth !== "discord.gg/relaxservices") {
        return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
    }

    if (!/^\d{11}$/.test(tc)) {
        return res.status(400).json({ uyari: "Lutfen 11 Haneli, Gecerli Bir Tc Giriniz!" });
    }

    const sql = "SELECT * FROM tcpro WHERE TC = ?";
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
                tc: row.TC || "mevcutDegil",
                adi: row.AD || "mevcutDegil",
                soyadi: row.SOYAD || "mevcutDegil",
                gsm: row.GSM || "mevcutDegil",
                babaAdi: row.BABAADI || "mevcutDegil",
                babaTc: row.BABATC || "mevcutDegil",
                anneAdi: row.ANNEADI || "mevcutDegil",
                anneTc: row.ANNETC || "mevcutDegil",
                dogumTarihi: row.DOGUMTARIHI || "mevcutDegil",
                olumTarihi: row.OLUMTARIHI || "mevcutDegil",
                dogumYeri: row.DOGUMYERI || "mevcutDegil",
                memleketIl: row.MEMLEKETIL || "mevcutDegil",
                memleketIlce: row.MEMLEKETIL || "mevcutDegil",
                memleketKoy: row.MEMLEKETKOY || "mevcutDegil",
                adresIl: row.ADRESIL || "mevcutDegil",
                adresIlce: row.ADRESILCE || "mevcutDegil",
                aileSiraNo: row.AILESIRANO || "mevcutDegil",
                bireySiraNo: row.BIREYSIRANO || "mevcutDegil",
                medeniHal: row.MEDENIHAL || "mevcutDegil",
                cinsiyet: row.CINSIYET || "mevcutDegil",
            }))
        });
    });
});

module.exports = router;
