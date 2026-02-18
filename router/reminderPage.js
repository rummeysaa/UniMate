const express = require('express')
const router = express.Router()
const Reminder = require('../model/reminderModal')

router.get('/',(reg,res)=>{
    res.render('site/reminder')
})

// Hatırlatıcıları listele
router.get('/list', async (req, res) => {
  try {
    const userId = req.session.userID;
    if (!userId) return res.status(401).json({ success: false, message: 'Oturum yok' });

    const reminders = await Reminder.find({ userId }).sort({ date: 1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/add', async (req, res) => {
  console.log('Hatırlatıcı ekleme isteği geldi:', req.body);
  try {
    const { title, description, date, notifyType, email, phone } = req.body;
    const userId = req.session.userID;
    if (!userId) return res.status(401).json({ success: false, message: 'Oturum yok' });

    const reminder = new Reminder({
      userId,
      title,
      description,
      date,
      notifyType,
      email,
      phone
    });
    await reminder.save();
    console.log('Yeni hatırlatıcı eklendi:', reminder);
    res.json({ success: true, message: 'Hatırlatıcı eklendi!' });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

module.exports = router