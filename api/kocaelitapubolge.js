const express = require("express");
const db = require("../config/db6");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});
//http://localhost:3000/api/devrelax/kocatapubolge?mahalle=AKSIĞIN&auth=discord.gg/relaxservices
router.get("/kocatapubolge", limiter, async (req, res) => {
    try {
        const { mahalle, auth } = req.query;

        if (auth !== "discord.gg/relaxservices") {
            return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
        }
        if (!mahalle) {
            return res.status(400).json({ uyari: "Lutfen İlce Ve Mahalle Bilgilerini, Eksiksiz Giriniz!" });
        }

        const query = "SELECT * FROM 2mkocaeli WHERE MahalleKoyAdi LIKE ?";
        const params = [`%${mahalle}%`];

        db.query(query, params, (err, results) => {
            if (err) {
                console.error("Veritabani Hatasi:", err);
                return res.status(500).json({ hata: "Veritabani Hatasi!" });
            }

            if (results.length === 0) {
                return res.status(404).json({ bilgi: "Sonuc Bulunamadi!" });
            }

            const formattedResults = results.map((row) => ({
                apiSahibi: "devrelax",
                apiDiscordSunucusu: "discord.gg/relaxservices",
                apiTelegramGrubu: "t.me/relax_services",
                veri: {
                    tc: row.TCKimlikNo || 'mevcutDegil',
                    adi: row.Adi || 'mevcutDegil',
                    soyadi: row.Soyadi || 'mevcutDegil',
                    babaAdi: row.BabaAdi || 'mevcutDegil',
                    mahalleKoyAdi: row.MahalleKoyAdi || 'mevcutDegil',
                    mahalleKoyTipi: row.MahalleKoyTip || 'mevcutDegil',
                    kutukTipi: row.KutukTip || 'mevcutDegil',
                    zeminTipi: row.ZeminTip || 'mevcutDegil',
                    ada: row.Ada || 'mevcutDegil',
                    parsel: row.Parsel || 'mevcutDegil',
                    paftaNo: row.PaftaNo || 'mevcutDegil',
                    mevki: row.Mevkii || 'mevcutDegil',
                    yuzOlcum: row.Yuzolcum || 'mevcutDegil',
                    cilt: row.Cilt || 'mevcutDegil',
                    sayfa: row.Sayfa || 'mevcutDegil',
                    anaTasinmazCinsref: row.AnaTasinmazTasinmazCinsRef || 'mevcutDegil',
                    anaTasinmazNitelik: row.AnaTasinmazNitelik || 'mevcutDegil',
                    blok: row.Blok || 'mevcutDegil',
                    giris: row.Giris || 'mevcutDegil',
                    kat: row.Kat || 'mevcutDegil',
                    bagimsizBolumNo: row.BagimsizBolumNo || 'mevcutDegil',
                    arsaPay: row.ArsaPay || 'mevcutDegil',
                    arsaPayda: row.ArsaPayda || 'mevcutDegil',
                    bagimsizBolumTasinmazCinsRef: row.BagimsizBolumTasinmazCinsRef || 'mevcutDegil',
                    bagimsizBolumNitelik: row.BagimsizBolumNitelik || 'mevcutDegil',
                    zeminHisseId: row.ZeminHisse_ID || 'mevcutDegil',
                    zeminRef: row.ZeminRef || 'mevcutDegil',
                    cinsiyetTipi: row.CinsiyetTip || 'mevcutDegil',
                    cinsiyet: row.Cinsiyet || 'mevcutDegil',
                    hisseTipi: row.HisseTip || 'mevcutDegil',
                    istirakNo: row.IstirakNo || 'mevcutDegil',
                    hissePay: row.HissePay || 'mevcutDegil',
                    hissePayda: row.HissePayda || 'mevcutDegil',
                    edinmeSebebi: row.EdinmeSebebi || 'mevcutDegil',
                    tarih: row.Tarih || 'mevcutDegil',
                    yevmiye: row.Yevmiye || 'mevcutDegil',
                }
            }));

            res.json(formattedResults);
        });
    } catch (error) {
        console.error("Sunucu Hatasi:", error);
        res.status(500).json({ hata: "Sunucu Hatasi Olustu!" });
    }
});

module.exports = router;
