const express = require('express')
const router = express.Router()
const { join } = require('path')
const Ders = require(join(__dirname, '..', 'model', 'dersModal.js'))
const mongoose = require('mongoose')

// Ders programı sayfasını göster
router.get('/', async (req, res) => {
    console.log('Ders programı GET route çalıştı');
    try {
        // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
        if (!req.session.userID) {
            return res.redirect('/login');
        }

        console.log('Session userID:', req.session.userID);

        // Session'dan kullanıcı bilgilerini al
        const userName = req.session.userName;
        const userId = new mongoose.Types.ObjectId(String(req.session.userID));

        // Kullanıcının derslerini getir
        const dersler = await Ders.find({ kullanici: userId }).lean();

        console.log('Bulunan dersler:', dersler); // Debug için log

        // Tek bir render işlemi yap
        res.render('site/dersprogrami', {
            userName: userName,
            dersler: dersler
        });
    } catch (err) {
        console.error('Ders programı yüklenirken hata:', err);
        res.status(500).send('Bir hata oluştu');
    }
});

// Yeni ders ekle
router.post('/ders-ekle', async (req, res) => {
    try {
        if (!req.session.userID) {
            return res.json({ success: false, message: 'Oturum bulunamadı' });
        }

        const userId = new mongoose.Types.ObjectId(String(req.session.userID));

        console.log('Gelen ders verisi:', req.body);

        const yeniDers = new Ders({
            dersAdi: req.body.dersAdi,
            gun: req.body.gun,
            baslangicSaati: req.body.baslangicSaati,
            bitisSaati: req.body.bitisSaati,
            sinif: req.body.sinif,
            ogretmen: req.body.ogretmen,
            kredi: req.body.kredi,
            renk: req.body.renk,
            kullanici: userId
        });

        // Ders çakışması kontrolü
        const cakismaVar = await yeniDers.dersCakismasiVarMi();
        if (cakismaVar) {
            return res.json({ success: false, message: 'Bu saatte başka bir dersiniz var!' });
        }

        const kaydedilenDers = await yeniDers.save();
        console.log('Kaydedilen ders:', kaydedilenDers);

        // Başarılı kayıt sonrası tüm dersleri getir
        const dersler = await Ders.find({ kullanici: userId })
            .sort({ gun: 1, baslangicSaati: 1 });

        res.json({ 
            success: true, 
            message: 'Ders başarıyla eklendi',
            ders: kaydedilenDers,
            dersler: dersler
        });
    } catch (err) {
        console.error('Ders eklenirken hata:', err);
        res.json({ success: false, message: 'Ders eklenirken bir hata oluştu: ' + err.message });
    }
});

// Ders sil
router.delete('/ders-sil/:id', async (req, res) => {
    try {
        if (!req.session.userID) {
            return res.json({ success: false, message: 'Oturum bulunamadı' });
        }

        const userId = new mongoose.Types.ObjectId(String(req.session.userID));
        const ders = await Ders.findOneAndDelete({
            _id: req.params.id,
            kullanici: userId
        });

        if (!ders) {
            return res.json({ success: false, message: 'Ders bulunamadı' });
        }

        res.json({ success: true, message: 'Ders başarıyla silindi' });
    } catch (err) {
        console.error('Ders silinirken hata:', err);
        res.json({ success: false, message: 'Ders silinirken bir hata oluştu' });
    }
});

module.exports = router