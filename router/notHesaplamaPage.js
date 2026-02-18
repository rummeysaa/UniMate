const express= require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('site/notHesaplama', { userName: req.session.userName });
})

function minimumSunumNotuHesapla(vizeNotu, vizeYuzde, finalNotu, finalYuzde, sunumYuzde, gecmeNotu) {
  // vizeYuzde, finalYuzde, sunumYuzde toplamı 100 olmalı!
  const vizeKatki = vizeNotu * vizeYuzde / 100;
  const finalKatki = finalNotu * finalYuzde / 100;
  const kalan = gecmeNotu - (vizeKatki + finalKatki);
  if (sunumYuzde === 0) {
    return kalan <= 0 ? 0 : "Geçemez";
  }
  const minSunum = kalan / (sunumYuzde / 100);
  if (minSunum < 0) return 0;
  if (minSunum > 100) return "Geçemez";
  return minSunum.toFixed(2);
}

module.exports = router