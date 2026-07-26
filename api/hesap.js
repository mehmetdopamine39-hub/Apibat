const express = require("express");
const axios = require("axios");

const router = express.Router();
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 5,
    message: { uyari: "Cok Fazla, İstek Atmaktasiniz!" }
});
const fetchConversionRate = async (symbol) => {
    const API_URL = `https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${symbol}`;
    try {
        const response = await axios.get(API_URL);
        return parseFloat(response.data.data?.price) || null;
    } catch (error) {
        console.error(`Döviz Kuru Alinirken Hata Olustu (${symbol}):`, error.message);
        return null;
    }
};

const fetchUsdToTryRate = async () => {
    const API_URL = "https://api.exchangerate-api.com/v4/latest/USD";
    try {
        const response = await axios.get(API_URL);
        return parseFloat(response.data.rates?.TRY) || null;
    } catch (error) {
        console.error("USD-TL Kuru Alinirken Hata Olustu:", error.message);
        return null;
    }
};
//http://localhost:3000/api/devrelax/convert?doviz=BTC&cevirilecekdoviz=USDT&miktar=1&auth=discord.gg/relaxservices
router.get("/convert", limiter, async(req, res) => {
    const { doviz, cevirilecekdoviz, miktar, auth } = req.query;

    if (auth !== "discord.gg/relaxservices") {
        return res.status(401).json({ uyari: "Yetkisiz Erisim!" });
    }

    if (!doviz || !cevirilecekdoviz || !miktar || isNaN(miktar)) {
        return res.status(400).json({ uyari: "Lutfen Doviz, Cevirilecek Doviz, Ve Miktar Parametrelerini Giriniz!" });
    }

    const symbol = `${doviz.toUpperCase()}-${cevirilecekdoviz.toUpperCase()}`;
    let rate;

    if (symbol === "USDT-TL" || symbol === "USD-TL") {
        rate = await fetchUsdToTryRate();
    } else {
        rate = await fetchConversionRate(symbol);
    }

    if (!rate) {
        return res.status(500).json({ hata: "Sunucu Hatasi Olustu!" });
    }

    const result = (parseFloat(miktar) * rate).toFixed(6);

    return res.json({
        apiSahibi: "devrelax",
        apiDiscordSunucusu: "discord.gg/relaxservices",
        apiTelegramGrubu: "t.me/relax_services",
        veri: {
            miktar: miktar,
            kaynak: doviz.toUpperCase(),
            donüstürülen: cevirilecekdoviz.toUpperCase(),
            sonuc: result
        },
    });
});

module.exports = router;
