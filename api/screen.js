const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const rateLimit = require("express-rate-limit");
const router = express.Router();
require("dotenv").config();

const apiKey = process.env.API_FLASH_API_KEY;

const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});
//http://localhost:3000/api/devrelax/screenshot?url=https://t.me/devrelaxx?&auth=discord.gg/relaxservices
router.get("/screenshot", limiter, async (req, res) => {
    const { url, auth } = req.query;

    if (auth !== "discord.gg/relaxservices") {
        return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
    }

    if (!url || !/^https?:\/\//.test(url)) {
        return res.status(400).json({ uyari: "Lutfen, Gecerli Bir Url Giriniz!" });
    }

    const apiUrl = `https://api.apiflash.com/v1/urltoimage?access_key=${apiKey}&wait_until=page_loaded&url=${encodeURIComponent(url)}`;

    try {
        const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

        if (response.status === 200) {
            const screenshotPath = path.join(__dirname, `screenshot.jpeg`);
            fs.writeFileSync(screenshotPath, response.data);

            res.download(screenshotPath, "screenshot.jpeg", (err) => {
                if (err) {
                    console.error(`Dosya Gonderme Hatasi: ${err.message}`);
                    res.status(500).json({ hata: "Dosya Gönderme Sirasinda, Bir Hata Olustu!" });
                }
                fs.unlink(screenshotPath, (err) => {
                    if (err) console.error(`Dosya Silinemedi: ${screenshotPath}`);
                });
            });
        } else {
            res.status(500).json({ hata: "Ekran Görüntüsü Alinamadi, Lütfen Tekrar Deneyin!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ hata: "Sunucu Hatasi Olustu!" });
    }
});

module.exports = router;
