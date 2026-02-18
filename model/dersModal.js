const mongoose = require('mongoose');

const dersSchema = new mongoose.Schema({
  // Dersin adı
  dersAdi: {
    type: String,
    required: [true, 'Ders adı zorunludur'],
    trim: true
  },
  // Dersin günü (Pazartesi, Salı, vb.)
  gun: {
    type: String,
    required: [true, 'Ders günü zorunludur'],
    enum: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']
  },
  // Dersin başlangıç saati
  baslangicSaati: {
    type: String,
    required: [true, 'Başlangıç saati zorunludur'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Geçerli bir saat formatı giriniz (HH:MM)']
  },
  // Dersin bitiş saati
  bitisSaati: {
    type: String,
    required: [true, 'Bitiş saati zorunludur'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Geçerli bir saat formatı giriniz (HH:MM)']
  },
  // Dersin yapıldığı sınıf/yer
  sinif: {
    type: String,
    required: [true, 'Sınıf bilgisi zorunludur'],
    trim: true
  },
  // Dersin öğretmeni
  ogretmen: {
    type: String,
    required: [true, 'Öğretmen bilgisi zorunludur'],
    trim: true
  },
  // Dersin kredisi
  kredi: {
    type: Number,
    required: [true, 'Kredi bilgisi zorunludur'],
    min: [0, 'Kredi 0\'dan küçük olamaz']
  },
  // Dersin rengi (takvim görünümü için)
  renk: {
    type: String,
    default: '#3788d8' // Varsayılan mavi renk
  },
  // Dersin ait olduğu kullanıcı
  kullanici: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Kullanıcı bilgisi zorunludur']
  },
  // Dersin oluşturulma tarihi
  olusturulmaTarihi: {
    type: Date,
    default: Date.now
  }
}, {
  // Her ders için benzersiz bir kombinasyon oluştur
  timestamps: true
});

// Aynı kullanıcı için aynı gün ve saatte ders çakışmasını önle
dersSchema.index({ kullanici: 1, gun: 1, baslangicSaati: 1, bitisSaati: 1 }, { unique: true });

// Ders çakışması kontrolü için metod
dersSchema.methods.dersCakismasiVarMi = async function() {
  const Ders = mongoose.model('Ders');
  const cakisanDers = await Ders.findOne({
    kullanici: this.kullanici,
    gun: this.gun,
    $or: [
      {
        $and: [
          { baslangicSaati: { $lte: this.baslangicSaati } },
          { bitisSaati: { $gt: this.baslangicSaati } }
        ]
      },
      {
        $and: [
          { baslangicSaati: { $lt: this.bitisSaati } },
          { bitisSaati: { $gte: this.bitisSaati } }
        ]
      }
    ]
  });
  return !!cakisanDers;
};

const Ders = mongoose.model('Ders', dersSchema);

module.exports = Ders; 