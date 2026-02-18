const express= require('express')
const router = express.Router()
const { join } = require('path')
const User = require(join(__dirname, '..', 'model', 'userModal.js'))
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

router.get('/', (req, res) => {
  res.render('site/login');
});

// Logout route'u
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout hatası:', err);
      return res.json({ success: false, message: 'Çıkış yapılırken bir hata oluştu' });
    }
    res.redirect('/login');
  });
});

// Hesap silme route'u
router.delete('/delete-account', async (req, res) => {
  if (!req.session.userID) {
    return res.json({ success: false, message: 'Oturum bulunamadı' });
  }

  try {
    await User.findByIdAndDelete(req.session.userID);
    req.session.destroy((err) => {
      if (err) {
        console.error('Session silme hatası:', err);
        return res.json({ success: false, message: 'Oturum kapatılırken bir hata oluştu' });
      }
      res.json({ success: true, message: 'Hesabınız başarıyla silindi', redirect: '/login' });
    });
  } catch (err) {
    console.error('Hesap silme hatası:', err);
    res.json({ success: false, message: 'Hesap silinirken bir hata oluştu' });
  }
});

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  console.log('Giriş denemesi:', { email });

  if (!email || !password) {
    console.log('Eksik bilgi:', { email: !!email, password: !!password });
    return res.json({ success: false, message: 'E-posta ve şifre alanları zorunludur!' });
  }

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      console.log('Kullanıcı bulunamadı:', email);
      return res.json({ success: false, message: 'Kullanıcı kaydı bulunamadı!' });
    }
    console.log('Kullanıcı bulundu:', { id: user._id, name: user.name });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Şifre yanlış:', email);
      return res.json({ success: false, message: "Şifre yanlış!" });
    }
    console.log('Şifre doğru');

    // Session'a kullanıcı bilgilerini kaydet
    req.session.userID = user._id;
    req.session.userName = user.name + ' ' + user.surname;
    console.log('Session bilgileri ayarlandı:', { 
      userID: req.session.userID, 
      userName: req.session.userName 
    });
    
    // Session'ı kaydet ve kontrol et
    req.session.save((err) => {
      if (err) {
        console.error('Session kaydetme hatası:', err);
        return res.json({ success: false, message: 'Oturum bilgileri kaydedilemedi' });
      }
      
      // Session'ın doğru kaydedildiğinden emin ol
      if (!req.session.userID || !req.session.userName) {
        console.error('Session bilgileri eksik:', req.session);
        return res.json({ success: false, message: 'Oturum bilgileri eksik' });
      }

      console.log('Session başarıyla kaydedildi:', {
        userID: req.session.userID,
        userName: req.session.userName
      });

      return res.json({ 
        success: true, 
        message: 'Giriş başarılı!', 
        redirect: '/dashboard',
        user: {
          id: user._id,
          name: req.session.userName
        }
      });
    });
  } catch (err) {
    console.error('Giriş işlemi hatası:', err);
    return res.json({ success: false, message: 'Bir hata oluştu' });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ success: false, message: 'E-posta bulunamadı.' });

  // Token oluştur
  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.resetTokenExpire = Date.now() + 1000 * 60 * 30; // 30 dk geçerli
  await user.save();

  // E-posta gönder
  const resetLink = `http://localhost:5000/login/reset-password?token=${token}`;
  await transporter.sendMail({
    to: user.email,
    subject: 'Şifre Sıfırlama',
    text: `Şifrenizi sıfırlamak için tıklayın: ${resetLink}`
  });

  res.json({ success: true, message: 'Sıfırlama linki e-posta adresinize gönderildi.' });
});

module.exports = router