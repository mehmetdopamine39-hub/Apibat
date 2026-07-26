const express = require("express");
const fs = require("fs");
const path = require("path");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const RELDISKAX = process.env.DEFAULT_DISK || C;

const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});

const router = express.Router();
const filePath = `${RELDISKAX}:/xampp/mysql/data/20m_trfacebook.csv`;
//http://localhost:3000/api/devrelax/facebook?gsm=05375890913&auth=discord.gg/relaxservices
router.get("/facebook", limiter, (req, res) => {
    const { gsm, auth } = req.query;

    if (auth !== "discord.gg/relaxservices") {
        return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
    }

    if (!gsm || !/^\d{10,13}$/.test(gsm)) {
        return res.status(400).json({ uyari: "Lutfen Geçerli Bir Gsm Giriniz!" });
    }

    const formattedGSM = gsm.startsWith("+90") ? gsm : `+90${gsm.replace(/^0/, "")}`;

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ hata: "Veri Dosyasi Bulunamadi!" });
    }

    const fileStream = fs.createReadStream(filePath, "utf-8");
    let foundLine = null;

    fileStream.on("data", (chunk) => {
        const lines = chunk.split("\n");
        for (const line of lines) {
            const fields = line.split(",");
            if (fields[1] && fields[1].trim() === formattedGSM) {
                foundLine = fields;
                fileStream.destroy();
                break;
            }
        }
    });

    fileStream.on("close", () => {
        if (foundLine) {
            const gender = (foundLine[6] || "").toLowerCase().trim() === "male" ? "erkek" : (foundLine[6] || "").toLowerCase().trim() === "female" ? "kadin" : "bilinmiyor";
            const profileLinkMatch = /link\*,(https:\/\/[^\s,]+)/.exec(foundLine.join(","));
            const profileLink = profileLinkMatch ? profileLinkMatch[1] : "#";

            return res.json({
                apiSahibi: "devrelax",
                apiDiscordSunucusu: "discord.gg/relaxservices",
                apiTelegramGrubu: "t.me/relax_services",
                veri: {
                    gsm: formattedGSM,
                    adi: foundLine[2],
                    soyadi: foundLine[3],
                    cinsiyet: gender,
                    sehir: foundLine[8] || "bilinmiyor",
                    profilLinki: profileLink
                }
            });
        } else {
            return res.status(404).json({ bilgi: "Sonuc Bulunamadi!" });
        }
    });

    fileStream.on("error", (err) => {
        console.error(err);
        return res.status(500).json({ hata: "Dosya Okuma Hatasi Olustu!" });
    });
});

module.exports = router;
