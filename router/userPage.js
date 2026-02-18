const express = require('express');
const router = express.Router();
const User = require('../model/userModal');

// Kullanıcı ekle
router.post('/add', async (req, res) => {
    const { name, surname, email, password } = req.body;
    try {
        const user = new User({ name, surname, email, password });
        await user.save();
        res.json({ success: true, message: 'Kullanıcı eklendi!' });
    } catch (err) {
        res.json({ success: false, message: 'Hata oluştu', error: err });
    }
});

// Kullanıcıları listele
router.get('/list', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.json({ success: false, message: 'Hata oluştu', error: err });
    }
});

// Kullanıcı sil
router.delete('/delete/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Kullanıcı silindi!' });
    } catch (err) {
        res.json({ success: false, message: 'Silme hatası', error: err });
    }
});

// Kullanıcı güncelle
router.put('/update/:id', async (req, res) => {
    const { name, surname, email, password } = req.body;
    try {
        await User.findByIdAndUpdate(req.params.id, { name, surname, email, password });
        res.json({ success: true, message: 'Kullanıcı güncellendi!' });
    } catch (err) {
        res.json({ success: false, message: 'Güncelleme hatası', error: err });
    }
});

module.exports = router;