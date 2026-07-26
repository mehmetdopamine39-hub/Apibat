const express = require("express");
const db = require("../config/db2");

const router = express.Router();
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});
//http://localhost:3000/api/devrelax/ailepro?tc=27727166918&auth=discord.gg/relaxservices
router.get("/ailepro", limiter, (req, res) => {
    const { tc, auth } = req.query;

    if (auth !== "discord.gg/relaxservices") {
        return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
    }

    if (!/^[0-9]{11}$/.test(tc)) {
        return res.status(400).json({ uyari: "Lutfen 11 Haneli, Gecerli Bir Tc Giriniz!" });
    }

    const query = "SELECT * FROM tcpro WHERE TC = ?";
    db.query(query, [tc], (err, results) => {
        if (err) {
            console.error("Veritabani Hatasi:", err);
            return res.status(500).json({ hata: "Veritabani Hatasi Olustu!" });
        }

        if (results.length === 0) {
            return res.status(404).json({ bilgi: "Sonuc Bulunamadi!" });
        }

        const person = results[0];
        let familyData = [
            { yakinlik: "KENDİSİ", ...person }
        ];

        const babaQuery = "SELECT * FROM tcpro WHERE TC = ?";
        db.query(babaQuery, [person.BABATC], (err, babaResults) => {
            if (!err && babaResults.length > 0) {
                familyData.push({ yakinlik: "BABASI", ...babaResults[0] });
            }

            const anneQuery = "SELECT * FROM tcpro WHERE TC = ?";
            db.query(anneQuery, [person.ANNETC], (err, anneResults) => {
                if (!err && anneResults.length > 0) {
                    familyData.push({ yakinlik: "ANNESİ", ...anneResults[0] });
                }

                const kardesQuery = "SELECT * FROM tcpro WHERE (BABATC = ? OR ANNETC = ?) AND TC != ?";
                db.query(kardesQuery, [person.BABATC, person.ANNETC, person.TC], (err, kardesResults) => {
                    if (!err && kardesResults.length > 0) {
                        kardesResults.forEach(kardes => {
                            familyData.push({ yakinlik: "KARDEŞİ", ...kardes });
                        });
                    }

                    return res.json({
                        apiSahibi: "devrelax",
                        apiDiscordSunucusu: "discord.gg/relaxservices",
                        apiTelegramGrubu: "t.me/relax_services",
                        veri: familyData.map(member => ({
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
                            cinsiyet: member.CINSIYET || "mevcutDegil",
                        }))
                    });
                });
            });
        });
    });
});

module.exports = router;
