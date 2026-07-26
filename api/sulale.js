const express = require("express");
const db = require("../config/db");

const router = express.Router();
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});
//http://localhost:3000/api/devrelax/sulale?tc=11404305356&auth=discord.gg/relaxservices
router.get("/sulale", limiter, (req, res) => {
    const { tc, auth } = req.query;

    if (auth !== "discord.gg/relaxservices") {
        return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
    }

    if (!/^[0-9]{11}$/.test(tc)) {
        return res.status(400).json({ uyari: "Lutfen 11 Haneli, Gecerli Bir Tc Giriniz!" });
    }

    const query = "SELECT * FROM 101m WHERE TC = ?";
    db.query(query, [tc], (err, results) => {
        if (err) {
            console.error("Veritabani Hatasi:", err);
            return res.status(500).json({ hata: "Veritabani Hatasi!" });
        }

        if (results.length === 0) {
            return res.status(404).json({ bilgi: "Sonuc Bulunamadi!" });
        }

        const person = results[0];
        let familyData = [{ yakinlik: "KENDİSİ", ...person }];

        const queries = [
            { query: "SELECT * FROM 101m WHERE TC = ?", params: [person.BABATC], yakinlik: "BABASI" },
            { query: "SELECT * FROM 101m WHERE TC = ?", params: [person.ANNETC], yakinlik: "ANNESİ" },
            { query: "SELECT * FROM 101m WHERE (BABATC = ? OR ANNETC = ?) AND TC != ?", params: [person.TC, person.TC, person.TC], yakinlik: "ÇOCUĞU" },
            { query: "SELECT * FROM 101m WHERE (BABATC IN (SELECT TC FROM 101m WHERE (BABATC = ? OR ANNETC = ?))) AND TC != ?", params: [person.TC, person.TC], yakinlik: "EŞİ" },
            { query: "SELECT * FROM 101m WHERE (BABATC = ? OR ANNETC = ?) AND TC != ?", params: [person.BABATC, person.ANNETC, person.TC], yakinlik: "KARDEŞİ" },
            { query: "SELECT * FROM 101m WHERE TC = (SELECT BABATC FROM 101m WHERE TC = ?)", params: [person.BABATC], yakinlik: "BABA TARAFI DEDESİ" },
            { query: "SELECT * FROM 101m WHERE TC = (SELECT BABATC FROM 101m WHERE TC = ?)", params: [person.ANNETC], yakinlik: "ANNE TARAFI DEDESİ" },
            { query: "SELECT * FROM 101m WHERE TC = (SELECT ANNETC FROM 101m WHERE TC = ?)", params: [person.BABATC], yakinlik: "BABAANNESİ" },
            { query: "SELECT * FROM 101m WHERE TC = (SELECT ANNETC FROM 101m WHERE TC = ?)", params: [person.ANNETC], yakinlik: "ANNEANNESİ" },
            { query: "SELECT * FROM 101m WHERE BABATC = (SELECT BABATC FROM 101m WHERE TC = ?) AND TC != ?", params: [person.BABATC, person.BABATC], yakinlik: "AMCASI / HALASI" },
            { query: "SELECT * FROM 101m WHERE BABATC = (SELECT BABATC FROM 101m WHERE TC = ?) AND TC != ?", params: [person.ANNETC, person.ANNETC], yakinlik: "DAYISI / TEYZESİ" },
        ];

        let completedQueries = 0;
        queries.forEach(({ query, params, yakinlik }) => {
            db.query(query, params, (err, results) => {
                if (!err && results.length > 0) {
                    results.forEach(relative => {
                        familyData.push({ yakinlik, ...relative });
                    });
                }
                if (++completedQueries === queries.length) {
                    return res.json({
                        apiSahibi: "devrelax",
                        apiDiscordSunucusu: "discord.gg/relaxservices",
                        apiTelegramGrubu: "t.me/relax_services",
                        veri: familyData.map(member => ({
                            yakinlik: member.yakinlik,
                            tc: member.TC || "mevcutDegil",
                            adi: member.ADI || "mevcutDegil",
                            soyadi: member.SOYADI || "mevcutDegil",
                            dogumTarihi: member.DOGUMTARIHI || "mevcutDegil",
                            babaAdi: member.BABAADI || "mevcutDegil",
                            babaTc: member.BABATC || "mevcutDegil",
                            anneAdi: member.ANNEADI || "mevcutDegil",
                            anneTc: member.ANNETC || "mevcutDegil",
                            il: member.NUFUSIL || "mevcutDegil",
                            ilce: member.NUFUSILCE || "mevcutDegil",
                        }))
                    });
                }
            });
        });
    });
});

module.exports = router;
