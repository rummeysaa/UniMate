const express= require('express')
const router = express.Router()
const {join} =require('path')
const User= require(join(__dirname, '..','model','userModal.js'))
const bcrypt = require('bcrypt')
router.get('/',(reg,res)=>{
    res.render('site/signup')
})
router.post('/add', async (req, res) => {
    const { name, surname, email, password, password2, kvkk } = req.body;
    try {
        if (!name || !surname || !email || !password || !password2 || !kvkk) {
            return res.status(400).json({ success: false, message: 'Tüm alanları doldurunuz!' });
        }
        if (password !== password2) {
            return res.status(400).json({ success: false, message: 'Şifreler eşleşmiyor!' });
        }
        const gmailRGX = /@gmail\.com$/;
        if (!gmailRGX.test(email)) {
            return res.status(400).json({ success: false, message: 'Email alanı hatalıdır!' });
        }
        const userControl = await User.findOne({ email: email });
        if (userControl) {
            return res.status(400).json({ success: false, message: 'Email alanı zaten kayıtlıdır!' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            surname,
            email,
            password: hashedPassword
        });
        await user.save();
        req.session.userName = user.name + ' ' + user.surname;
        return res.json({ success: true, message: 'Kullanıcı kaydı başarılı bir şekilde yapılmıştır.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Beklenilmeyen bir hata oluştu!' });
    }
});


    router.get('/',(reg,res)=>{
        res.render('site/dashboard')
    })


module.exports = router