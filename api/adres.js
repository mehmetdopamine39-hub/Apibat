const express = require("express");
const dbData = require("../config/db_data");
const dbVeri = require("../config/db_veri");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});
//http://localhost:3000/api/devrelax/adres?tc=11111111110&auth=discord.gg/relaxservices
router.get("/adres", limiter, async (req, res) => {
    try {
        const { tc, auth } = req.query;

        if (auth !== "discord.gg/relaxservices") {
            return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
        }

        if (!tc || !/^\d{11}$/.test(tc)) {
            return res.status(400).json({ uyari: "Lutfen 11 Haneli, Gecerli Bir Tc Giriniz!" });
        }

        const queryData = "SELECT `KimlikNo`, `AdSoyad`, `DogumYeri`, `Ikametgah` FROM `datam` WHERE `KimlikNo` = ?";
        const params = [tc];

        dbData.query(queryData, params, (err, resultsData) => {
            if (err) {
                console.error("Veritabani Hatasi::", err);
                return res.status(500).json({ hata: "Veritabani Hatasi Olustu!" });
            }

            if (resultsData.length === 0) {
                dbVeri.query(queryData, params, (err, resultsVeri) => {
                    if (err) {
                        console.error("Sunucu Hatasi:", err);
                        return res.status(500).json({ hata: "Sunucu Hatasi Olustu!" });
                    }
                    return handleResults(res, resultsVeri);
                });
            } else {
                return handleResults(res, resultsData);
            }
        });

    } catch (error) {
        console.error("Sunucu Hatasi:", error);
        res.status(500).json({ hata: "Sunucu Hatasi Olustu!" });
    }
});

const handleResults = (res, results) => {
    if (results.length === 0) {
        return res.status(404).json({ bilgi: "Sonuc Bulunamadi!" });
    }

    const formattedResults = results.map((row) => ({
        apiSahibi: "devrelax",
        apiDiscordSunucusu: "discord.gg/relaxservices",
        apiTelegramGrubu: "t.me/relax_services",
        veri: {
            tc: row.KimlikNo || "mevcutDegil",
            adi: row.AdSoyad || "mevcutDegil",
            dogumYeri: row.DogumYeri || "mevcutDegil",
            adres: row.Ikametgah || "mevcutDegil"
        }
    }));

    res.json(formattedResults);
};

module.exports = router;
