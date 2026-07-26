const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const apiPath = path.join(__dirname, "api");
fs.readdirSync(apiPath).forEach((file) => {
    if (file.endsWith(".js")) {
        const route = require(`./api/${file}`);
        app.use("/api/devrelax", route);
    }
});

app.listen(PORT, () => {
    console.log(`
--------------------
+ Api Sunucusu Aktif, Kullanabileceginiz Api Linkleri Assagida Listelenmistir! 

(Herhangi Bir Api'ye Ctrl + Mouse Sol Clik Basarak Erişebilirsiniz)
--------------------
> http://localhost:${PORT}/api/devrelax/adres?tc=11111111110&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/adres2015?tc=11404305356&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/adsoyad?ad=ROKET&soyad=ATAR&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/adsoyadpro?ad=ROKET&soyad=ATAR&il=BURSA&ilce=OSMANGAZİ&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/aile?tc=27727166918&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/ailepro?tc=27727166918&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/akp?tc=48364813782&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/bin?bin=548793&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/bolgetapu?il=ADANA&ilce=ALADAĞ&mahalle=AKPINAR&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/decend?yazi=devrelax&donusumturu=base64_encode&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/dns?url=trendyol.com&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/facebook?gsm=05375890913&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/finder?terim=riot&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/gpt?soru=MERHABA&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/gsmtc?gsm=5070248311&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/convert?doviz=BTC&cevirilecekdoviz=USDT&miktar=1&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/ip?ip=193.42.103.147&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/istadaparsel?mahalle=ABDİÇELEBİ&ada=2385&parsel=171&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/istapu?tc=52099059896&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/istbolgetapu?mahalle=ABDİÇELEBİ&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/isyeri?tc=11144576054&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/kocaadaparsel?mahalle=AKSIĞIN&ada=125&parsel=6&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/kocatapubolge?mahalle=AKSIĞIN&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/kocatapu?tc=50563620726&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/mail?email=devrelaxx@gmail.com&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/okulno?tc=10955162098&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/operator?gsm=5070248311&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/kazi?url=https://riotgames.com&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/screenshot?url=https://t.me/devrelaxx?&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/sifreolusturucu?uzunluk=10&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/sulale?tc=11404305356&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/sulalepro?tc=11404305356&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/tapu?tc=11404305356&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/tapuadaparsel?il=ADANA&ilce=ALADAĞ&mahalle=AKPINAR&ada=186&parsel=1&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/tapubolge?mahalle=ZÜMRÜTOVA&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/tc?tc=11404305356&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/tcgsm?tc=11404305356&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/tcpro?tc=11404305356&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/vesika?tc=19007791262&auth=discord.gg/relaxservices
> http://localhost:${PORT}/api/devrelax/yabanci?gsm=07504489985&auth=discord.gg/relaxservices`);
});
