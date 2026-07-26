const express = require("express");
const db = require("../config/db2");

const router = express.Router();
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});
//http://localhost:3000/api/devrelax/adsoyadpro?ad=ROKET&soyad=ATAR&il=BURSA&ilce=OSMANGAZİ&auth=discord.gg/relaxservices
router.get("/adsoyadpro", limiter, (req, res) => {
    const { ad, soyad, il, ilce, auth } = req.query;

    if (auth !== "discord.gg/relaxservices") {
        return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
    }

    let sql = "SELECT * FROM tcpro WHERE AD = ? AND SOYAD = ? AND ADRESIL = ?";
    let params = [ad, soyad, il];

    if (ilce) { 
        sql += " AND ADRESILCE = ?";
        params.push(ilce);
    }

    db.query(sql, params, (err, result) => {
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
            veri: result.map(member => ({
                yakinlik: member.yakinlik,
                tc: member.TC || "mevcutDegil",
                adi: member.AD || "mevcutDegil",
                soyadi: member.SOYAD || "mevcutDegil",
                gsm: member.GSM || "mevcutDegil",
                babaAdi: member.BABAADI || "mevcutDegil",
                babaTc: member.BABATC || "mevcutDegil",
                anneAdi: member.ANNEADI || "mevcutDegil",
                anneTc: member.ANNETC || "mevcutDegil",
                dogumtarihi: member.DOGUMTARIHI || "mevcutDegil",
                olumTarihi: member.OLUMTARIHI || "mevcutDegil",
                dogumYeri: member.DOGUMYERI || "mevcutDegil",
                memleketIl: member.MEMLEKETIL || "mevcutDegil",
                memleketIlce: member.MEMLEKETILCE || "mevcutDegil",
                memleketKoy: member.MEMLEKETKOY || "mevcutDegil",
                adresIl: member.ADRESIL || "mevcutDegil",
                adresIlce: member.ADRESILCE || "mevcutDegil",
                aileSiraNo: member.AILESIRANO || "mevcutDegil",
                bireySiraNo: member.BIREYSIRANO || "mevcutDegil",
                medeniHal: member.MEDENIHAL || "mevcutDegil",
                cinsiyet: member.CINSIYET || "mevcutDegil"
            }))
        });
    });
});

module.exports = router;
