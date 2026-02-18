// Not hesaplama fonksiyonları ve event handlerları

// Notlandırma sistemleri ve minimum geçme notları
const NOT_SISTEMLERI = {
  "AA, BA, BB, CB, CC, DC, DD, FD, FF": { minScore: 50, minLetter: "DD" },
  "AA, BA, BB, BC, CB, CC, DC, DD, FD, FF": { minScore: 50, minLetter: "DD" },
  "A, A-, B+, B, B-, C+, C, C-, D+, D, D-, F": { minScore: 50, minLetter: "D" },
  "A1, A2, A3, B1, B2, B3, C1, C2, D1, D2, F1, F2": { minScore: 50, minLetter: "D2" },
  "A, B, C, D, F": { minScore: 50, minLetter: "D" },
  "A, B, C, D, E, F": { minScore: 50, minLetter: "E" }
};

document.addEventListener('DOMContentLoaded', function () {
  const islemSelect = document.getElementById('islem');
  const genelAltSeceneklerDiv = document.getElementById('genelAltSecenekler');
  const genelEkBilgiDiv = document.getElementById('genelEkBilgi');
  const genelSecenekSelect = document.getElementById('genelSecenek');
  const dersSayisiInput = document.getElementById('dersSayisi');
  const dersAlanlariDiv = document.getElementById('dersAlanlari');
  const donemDerslerDiv = document.getElementById('donemDersler');
  const genelDerslerDiv = document.getElementById('genelDersler');
  const toplamKrediOrtalamaDiv = document.getElementById('toplamKrediOrtalama');

  // Başlangıçta sadece işlem seçici görünsün, diğer alanlar gizli olsun
  if (donemDerslerDiv) donemDerslerDiv.classList.add('hidden');
  if (genelDerslerDiv) genelDerslerDiv.classList.add('hidden');
  if (toplamKrediOrtalamaDiv) toplamKrediOrtalamaDiv.classList.add('hidden');
  if (genelAltSeceneklerDiv) genelAltSeceneklerDiv.classList.add('hidden');

  document.getElementById('islem').addEventListener('change', function() {
    const islem = this.value;
    if (islem === 'genel') {
      genelAltSeceneklerDiv.classList.remove('hidden');
      genelDerslerDiv.classList.remove('hidden');
      donemDerslerDiv.classList.add('hidden');
      toplamKrediOrtalamaDiv.classList.add('hidden');
    } else if (islem === 'donem') {
      genelAltSeceneklerDiv.classList.add('hidden');
      genelDerslerDiv.classList.add('hidden');
      toplamKrediOrtalamaDiv.classList.add('hidden');
      donemDerslerDiv.classList.remove('hidden');
    } else {
      genelAltSeceneklerDiv.classList.add('hidden');
      genelDerslerDiv.classList.add('hidden');
      toplamKrediOrtalamaDiv.classList.add('hidden');
      donemDerslerDiv.classList.add('hidden');
    }
    // Not sistemi ve ders sayısı alanlarını sıfırla
    if (document.getElementById('notSistemi')) document.getElementById('notSistemi').value = '';
    if (document.getElementById('dersSayisi')) document.getElementById('dersSayisi').value = '';
    if (document.getElementById('dersAlanlari')) document.getElementById('dersAlanlari').innerHTML = '';
    if (document.getElementById('donemNotSistemi')) document.getElementById('donemNotSistemi').value = '';
    if (document.getElementById('donemDersSayisi')) document.getElementById('donemDersSayisi').value = '';
    if (document.getElementById('donemDersAlanlari')) document.getElementById('donemDersAlanlari').innerHTML = '';
  });

  if (genelSecenekSelect) {
    genelSecenekSelect.addEventListener('change', function () {
      if (genelSecenekSelect.value === 'toplam') {
        genelEkBilgiDiv.classList.remove('hidden');
      } else {
        genelEkBilgiDiv.classList.add('hidden');
      }
    });
  }

  if (dersSayisiInput && dersAlanlariDiv) {
    dersSayisiInput.addEventListener('input', function () {
      const sayi = parseInt(dersSayisiInput.value);
      dersAlanlariDiv.innerHTML = '';

      for (let i = 1; i <= sayi; i++) {
        // Ana ders container oluştur
        const dersContainer = document.createElement('div');
        dersContainer.className = 'ders-container ders-row';
        dersContainer.setAttribute('data-ders-index', i-1);
        
        // Ders bilgileri
        const dersHeader = document.createElement('div');
        dersHeader.className = 'ders-header';
        dersHeader.innerHTML = `<h3>Ders ${i}</h3>`;
        
        // Ders adı ve kredi
        const dersAdKrediRow = document.createElement('div');
        dersAdKrediRow.className = 'form-row';
        dersAdKrediRow.innerHTML = `
          <label>Ders Adı</label>
          <input type="text" class="ders-adi" placeholder="Ders Adı" required>
          <label>Kredi</label>
          <input type="number" class="ders-kredi" min="0" step="0.5" required>
        `;
        
        // Vize bilgileri
        const vizeRow = document.createElement('div');
        vizeRow.className = 'form-row';
        vizeRow.innerHTML = `
          <label>Vize Notu</label>
          <input type="number" class="vize-notu" min="0" max="100" required>
          <label>Yüzdesi</label>
          <input type="number" class="vize-yuzde" min="0" max="100" required>
        `;
        
        // Final bilgileri
        const finalRow = document.createElement('div');
        finalRow.className = 'form-row';
        finalRow.innerHTML = `
          <label>Final Notu</label>
          <input type="number" class="final-notu" min="0" max="100" required>
          <label>Yüzdesi</label>
          <input type="number" class="final-yuzde" min="0" max="100" required>
        `;
        
        // Sunum/Proje bilgileri
        const projeRow = document.createElement('div');
        projeRow.className = 'form-row';
        projeRow.innerHTML = `
          <label>Sunum / Proje</label>
          <input type="number" class="proje-notu" min="0" max="100" required>
          <label>Yüzdesi</label>
          <input type="number" class="proje-yuzde" min="0" max="100" required>
        `;
        
        // Hesaplama butonu ve sonuç alanı
        const hesaplaRow = document.createElement('div');
        hesaplaRow.className = 'form-row';
        hesaplaRow.innerHTML = `
          <button type="button" class="hesapla-btn">Hesapla</button>
          <div class="ders-sonuc"></div>
        `;
        
        // Tüm elemanları container'a ekle
        dersContainer.appendChild(dersHeader);
        dersContainer.appendChild(dersAdKrediRow);
        dersContainer.appendChild(vizeRow);
        dersContainer.appendChild(finalRow);
        dersContainer.appendChild(projeRow);
        dersContainer.appendChild(hesaplaRow);
        
        // Ana div'e ekle
        dersAlanlariDiv.appendChild(dersContainer);
        
        // Hesaplama butonu için event listener
        const hesaplaBtn = dersContainer.querySelector('.hesapla-btn');
        hesaplaBtn.addEventListener('click', function() {
          const dersIndex = parseInt(dersContainer.getAttribute('data-ders-index'));
          hesaplaDersSonucu(dersContainer, dersIndex);
        });
      }
    });

    // Sayfa yüklendiğinde direkt olarak 1 ders göster
    if (dersSayisiInput.value > 0) {
      const event = new Event('input');
      dersSayisiInput.dispatchEvent(event);
    }
  }

  // --- FORM SUBMIT EVENTLERİNİ YENİDEN DÜZENLE ---
  // 1. Toplam Kredi/Ağırlıklı Not ile Hesaplama
  const toplamKrediForm = document.getElementById('toplamKrediForm');
  if (toplamKrediForm) {
    toplamKrediForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const mevcutKredi = document.getElementById('mevcutKredi');
      const mevcutOrtalama = document.getElementById('mevcutOrtalama');
      if (!mevcutKredi?.value || !mevcutOrtalama?.value) {
        document.getElementById('sonuc').innerHTML = '<h3>GENEL SONUÇ</h3><div class="ders-genel-sonuc" style="margin-bottom: 32px;"><span style="color:#e74c3c"><strong>Genel:</strong> Mevcut kredi ve ortalama alanları zorunludur!</span></div>';
        return;
      }
      hesaplaVeSonucuYaz();
    });
  }

  // 2. Genel Dersler ile Hesaplama
  const genelDersForm = document.getElementById('genelDersForm');
  if (genelDersForm) {
    genelDersForm.addEventListener('submit', function(e) {
      e.preventDefault();
      let eksik = false;
      const dersSatirlari = document.querySelectorAll('#dersAlanlari .ders-row');
      dersSatirlari.forEach((row, i) => {
        const dersAdi = row.querySelector('.ders-adi').value;
        const kredi = row.querySelector('.ders-kredi').value;
        const vizeNotu = row.querySelector('.vize-notu').value;
        const vizeYuzde = row.querySelector('.vize-yuzde').value;
        const finalNotu = row.querySelector('.final-notu').value;
        const finalYuzde = row.querySelector('.final-yuzde').value;
        const projeNotu = row.querySelector('.proje-notu').value;
        const projeYuzde = row.querySelector('.proje-yuzde').value;
        if (!dersAdi || !kredi || !vizeNotu || !vizeYuzde || !finalNotu || !finalYuzde || !projeNotu || !projeYuzde) {
          eksik = true;
        }
      });
      if (eksik) {
        document.getElementById('sonuc').innerHTML = '<h3>GENEL SONUÇ</h3><div class="ders-genel-sonuc" style="margin-bottom: 32px;"><span style="color:#e74c3c"><strong>Uyarı:</strong> Tüm alanları doldurmalısınız!</span></div>';
        return;
      }
      hesaplaVeSonucuYaz();
    });
  }

  // 3. Dönem Dersleri ile Hesaplama
  const donemDersForm = document.getElementById('donemDersForm');
  if (donemDersForm) {
    donemDersForm.addEventListener('submit', function(e) {
      e.preventDefault();
      let eksik = false;
      const dersSatirlari = document.querySelectorAll('#donemDersAlanlari .ders-row');
      dersSatirlari.forEach((row, i) => {
        const kredi = row.querySelector('.ders-kredi').value;
        const vizeYuzde = row.querySelector('.vize-yuzde').value;
        const finalYuzde = row.querySelector('.final-yuzde').value;
        const projeYuzde = row.querySelector('.proje-yuzde').value;
        if (vizeYuzde && finalYuzde && projeYuzde && !kredi) {
          eksik = true;
        }
      });
      if (eksik) {
        document.getElementById('sonuc').innerHTML = '<h3>GENEL SONUÇ</h3><div class="ders-genel-sonuc" style="margin-bottom: 32px;"><span style="color:#e74c3c"><strong>Uyarı:</strong> Yüzdelikleri girilen derslerin kredisi de girilmelidir!</span></div>';
        return;
      }
      let dersSonuclari = [];
      dersSatirlari.forEach((row, i) => {
        const dersAdi = row.querySelector('input[name="dersAdi[]"]').value || `Ders ${i+1}`;
        const kredi = parseFloat(row.querySelector('input[name="kredi[]"]').value);
        const ort = parseFloat(row.querySelector('input[name="ortalama[]"]').value);
        if (!isNaN(kredi) && !isNaN(ort)) {
          let mesaj = `<b>${dersAdi}</b><div class='indented'>Kredi: ${kredi}, Ortalama: ${ort}</div>`;
          dersSonuclari.push(`<div style='margin-bottom:12px;'>${mesaj}</div>`);
        }
      });
      document.getElementById('sonuc').innerHTML = `<h3>GENEL SONUÇ</h3>${dersSonuclari.join('')}`;
    });
  }

  // 4. Geçmiş Dönemleri Ayrı Ayrı Girerek Hesaplama (sadece ilgili seçimde gösterilecek)
  const donemForm = document.getElementById('donemForm');
  if (donemForm) {
    donemForm.addEventListener('submit', function(e) {
      e.preventDefault();
      let toplamKredi = 0;
      let toplamAgirlikli = 0;
      let dersSonuclari = [];
      const donemTable = document.getElementById('donemTable').getElementsByTagName('tbody')[0];
      donemTable.querySelectorAll('tr').forEach(row => {
        const dersAdi = row.querySelector('input[name="donem[]"]').value;
        const kredi = parseFloat(row.querySelector('input[name="kredi[]"]').value);
        const ort = parseFloat(row.querySelector('input[name="ortalama[]"]').value);
        if (!isNaN(kredi) && !isNaN(ort)) {
          toplamKredi += kredi;
          toplamAgirlikli += kredi * ort;
          let mesaj = `<b>${dersAdi}</b><div class='indented'>Kredi: ${kredi}, Ortalama: ${ort}</div>`;
          dersSonuclari.push(`<div style='margin-bottom:12px;'>${mesaj}</div>`);
        }
      });
      const genelOrtalama = toplamKredi > 0 ? (toplamAgirlikli / toplamKredi).toFixed(2) : '-';
      // Sonucu sadece GENEL SONUÇ alanına yaz
      document.getElementById('sonuc').innerHTML = `<h3>GENEL SONUÇ</h3>${dersSonuclari.join('')}<div style='margin-top:18px; text-align:left;'><span style='font-weight:bold; font-size:1.6rem; color:#222a5c;'>Genel Ortalama: ${genelOrtalama}</span></div>`;
    });
  }

  document.getElementById('islem').addEventListener('change', function() {
    const islem = this.value;
    const genelSecenek = document.getElementById('genelSecenek').value;
    if (islem === 'genel' && genelSecenek === 'toplam') {
      document.getElementById('toplamKrediOrtalama').classList.remove('hidden');
      document.getElementById('genelDersler').classList.remove('hidden');
    } else {
      document.getElementById('toplamKrediOrtalama').classList.add('hidden');
      document.getElementById('genelDersler').classList.add('hidden');
    }
  });

  document.getElementById('genelSecenek').addEventListener('change', function() {
    const islem = document.getElementById('islem').value;
    const genelSecenek = this.value;
    if (islem === 'genel' && genelSecenek === 'toplam') {
      document.getElementById('toplamKrediOrtalama').classList.remove('hidden');
      document.getElementById('genelDersler').classList.remove('hidden');
    } else {
      document.getElementById('toplamKrediOrtalama').classList.add('hidden');
      document.getElementById('genelDersler').classList.add('hidden');
    }
  });

  // Dönem ders alanlarını dinamik oluştur
  const donemNotSistemiSelect = document.getElementById('donemNotSistemi');
  const donemDersSayisiInput = document.getElementById('donemDersSayisi');
  const donemDersAlanlariDiv = document.getElementById('donemDersAlanlari');
  if (donemNotSistemiSelect && donemDersSayisiInput && donemDersAlanlariDiv) {
    function updateDonemDersAlanlari() {
      const notSistemi = donemNotSistemiSelect.value;
      const sayi = parseInt(donemDersSayisiInput.value);
      donemDersAlanlariDiv.innerHTML = '';
      if (!notSistemi || !sayi || sayi < 1) return;
      for (let i = 1; i <= sayi; i++) {
        const dersContainer = document.createElement('div');
        dersContainer.className = 'ders-container ders-row';
        dersContainer.setAttribute('data-ders-index', i-1);
        dersContainer.innerHTML = `
          <div class=\"ders-header\"><h3>Ders ${i}</h3></div>
          <div class=\"form-row\">
            <label>Ders Adı</label>
            <input type=\"text\" class=\"ders-adi\" placeholder=\"Ders Adı\" required>
            <label>Kredi</label>
            <input type=\"number\" class=\"ders-kredi\" min=\"0\" step=\"0.5\" required>
          </div>
          <div class=\"form-row\">
            <label>Vize Notu</label>
            <input type=\"number\" class=\"vize-notu\" min=\"0\" max=\"100\" required>
            <label>Yüzdesi</label>
            <input type=\"number\" class=\"vize-yuzde\" min=\"0\" max=\"100\" required>
          </div>
          <div class=\"form-row\">
            <label>Final Notu</label>
            <input type=\"number\" class=\"final-notu\" min=\"0\" max=\"100\" required>
            <label>Yüzdesi</label>
            <input type=\"number\" class=\"final-yuzde\" min=\"0\" max=\"100\" required>
          </div>
          <div class=\"form-row\">
            <label>Sunum / Proje</label>
            <input type=\"number\" class=\"proje-notu\" min=\"0\" max=\"100\" required>
            <label>Yüzdesi</label>
            <input type=\"number\" class=\"proje-yuzde\" min=\"0\" max=\"100\" required>
          </div>
          <div class=\"form-row\">
            <button type=\"button\" class=\"hesapla-btn\">Hesapla</button>
            <div class=\"ders-sonuc\"></div>
          </div>
        `;
        donemDersAlanlariDiv.appendChild(dersContainer);
        // Hesapla butonu event
        const hesaplaBtn = dersContainer.querySelector('.hesapla-btn');
        hesaplaBtn.addEventListener('click', function() {
          hesaplaDonemDersSonucu(dersContainer, i-1);
        });
      }
    }
    donemNotSistemiSelect.addEventListener('change', updateDonemDersAlanlari);
    donemDersSayisiInput.addEventListener('input', updateDonemDersAlanlari);
  }

 


function hesaplaDersSonucu(dersDiv, dersIndex) {
  // Eksik alan kontrolü
  const dersAdi = dersDiv.querySelector('.ders-adi').value;
  const kredi = dersDiv.querySelector('.ders-kredi').value;
  const vizeNotuStr = dersDiv.querySelector('.vize-notu').value;
  const vizeYuzdeStr = dersDiv.querySelector('.vize-yuzde').value;
  const finalNotuStr = dersDiv.querySelector('.final-notu').value;
  const finalYuzdeStr = dersDiv.querySelector('.final-yuzde').value;
  const projeNotuStr = dersDiv.querySelector('.proje-notu').value;
  const projeYuzdeStr = dersDiv.querySelector('.proje-yuzde').value;
  const sonucDiv = dersDiv.querySelector('.ders-sonuc');
  if (!dersAdi || !kredi || !vizeNotuStr || !vizeYuzdeStr || !finalNotuStr || !finalYuzdeStr || !projeNotuStr || !projeYuzdeStr) {
    sonucDiv.innerHTML = '<span style="color: #e74c3c">Tüm alanları doldurmalısınız!</span>';
    return;
  }
  const notSistemi = document.getElementById('notSistemi').value;
  const gecmeNotu = NOT_SISTEMLERI[notSistemi]?.minScore || 50;
  const vizeNotu = parseFloat(vizeNotuStr) || 0;
  const vizeYuzde = parseFloat(vizeYuzdeStr) || 0;
  const finalNotu = parseFloat(finalNotuStr) || 0;
  const finalYuzde = parseFloat(finalYuzdeStr) || 0;
  const projeNotu = parseFloat(projeNotuStr) || 0;
  const projeYuzde = parseFloat(projeYuzdeStr) || 0;
  
  // Yüzdelerin toplamı 100 olmalı
  if (Math.abs(vizeYuzde + finalYuzde + projeYuzde - 100) > 0.01) {
    sonucDiv.innerHTML = '<span style="color: red">Yüzdelerin toplamı 100 olmalı!</span>';
    return;
  }
  
  // En az bir not girilmiş olmalı
  if (!vizeNotuStr && !finalNotuStr && !projeNotuStr) {
    sonucDiv.innerHTML = '<span style="color: orange">Lütfen en az bir not giriniz.</span>';
    return;
  }
  
  // Not hesapla
  let hesaplananNot = 
    (vizeNotu * vizeYuzde / 100) +
    (finalNotu * finalYuzde / 100) +
    (projeNotu * projeYuzde / 100);
  
  hesaplananNot = parseFloat(hesaplananNot.toFixed(2));
  const harf = harfNotu(hesaplananNot, notSistemi);
  let sonucHTML = `<span style="color: ${hesaplananNot >= gecmeNotu ? 'green' : 'red'}">${dersAdi} dersi için notunuz ${hesaplananNot} ve harf notunuz ${harf}. Dersin minimum geçme notunuz: ${gecmeNotu}.</span>`;

  // Eğer dersten kalıyorsa ve eksik not varsa, eksik notun minimum değerini hesapla
  if (hesaplananNot < gecmeNotu) {
    let eksikNotlar = [];
    if (!vizeNotuStr && vizeYuzde > 0) eksikNotlar.push({ad: 'Vize', yuzde: vizeYuzde, mevcut: vizeNotu});
    if (!finalNotuStr && finalYuzde > 0) eksikNotlar.push({ad: 'Final', yuzde: finalYuzde, mevcut: finalNotu});
    if (!projeNotuStr && projeYuzde > 0) eksikNotlar.push({ad: 'Sunum / Proje', yuzde: projeYuzde, mevcut: projeNotu});
    
    // Eğer iki eksik not varsa, birlikte minimum almaları gereken notları hesapla
    if (eksikNotlar.length === 2) {
      // İki eksik notun isimleri ve yüzdeleri
      const eksik1 = eksikNotlar[0];
      const eksik2 = eksikNotlar[1];
      // Diğer notların katkısı
      let digerKatki = 0;
      if (eksik1.ad !== 'Vize' && eksik2.ad !== 'Vize') digerKatki += (vizeNotu * vizeYuzde / 100);
      if (eksik1.ad !== 'Final' && eksik2.ad !== 'Final') digerKatki += (finalNotu * finalYuzde / 100);
      if (eksik1.ad !== 'Sunum / Proje' && eksik2.ad !== 'Sunum / Proje') digerKatki += (projeNotu * projeYuzde / 100);
      // Kombinasyon 1: eksik1 = 0, eksik2 = gereken
      let gereken2 = (gecmeNotu - digerKatki) / (eksik2.yuzde / 100);
      gereken2 = Math.ceil(gereken2 * 100) / 100;
      if (gereken2 < 0) gereken2 = 0;
      if (gereken2 > 100) gereken2 = 100;
      // Kombinasyon 2: eksik2 = 0, eksik1 = gereken
      let gereken1 = (gecmeNotu - digerKatki) / (eksik1.yuzde / 100);
      gereken1 = Math.ceil(gereken1 * 100) / 100;
      if (gereken1 < 0) gereken1 = 0;
      if (gereken1 > 100) gereken1 = 100;
      // Mesajları yaz
      if (gereken1 > 100) {
        sonucHTML += `<br><span style='color:#d35400'>Bu dersi geçmeniz için ${eksik1.ad} notunuz en az <b>100</b> ve ${eksik2.ad} notunuz en az <b>0</b> olmalıdır. (Sadece bu kombinasyonla dersi geçemezsiniz, diğer eksik nottan da katkı almalısınız.)</span>`;
      } else {
        sonucHTML += `<br><span style='color:#d35400'>Bu dersi geçmeniz için ${eksik1.ad} notunuz en az <b>${gereken1}</b> ve ${eksik2.ad} notunuz en az <b>0</b> olmalıdır.</span>`;
      }
      if (gereken2 > 100) {
        sonucHTML += `<br><span style='color:#d35400'>Bu dersi geçmeniz için ${eksik1.ad} notunuz en az <b>0</b> ve ${eksik2.ad} notunuz en az <b>100</b> olmalıdır. (Sadece bu kombinasyonla dersi geçemezsiniz, diğer eksik nottan da katkı almalısınız.)</span>`;
      } else {
        sonucHTML += `<br><span style='color:#d35400'>Bu dersi geçmeniz için ${eksik1.ad} notunuz en az <b>0</b> ve ${eksik2.ad} notunuz en az <b>${gereken2}</b> olmalıdır.</span>`;
      }
    } else {
      // Tek eksik not varsa, mevcut algoritma ile devam
      eksikNotlar.forEach(function(eksik) {
        let digerKatki = 0;
        if (eksik.ad !== 'Vize') digerKatki += (vizeNotu * vizeYuzde / 100);
        if (eksik.ad !== 'Final') digerKatki += (finalNotu * finalYuzde / 100);
        if (eksik.ad !== 'Sunum / Proje') digerKatki += (projeNotu * projeYuzde / 100);
        let gereken = (gecmeNotu - digerKatki) / (eksik.yuzde / 100);
        gereken = Math.ceil(gereken * 100) / 100;
        if (gereken < 0) gereken = 0;
        if (gereken > 100) gereken = 100;
        sonucHTML += `<br><span style='color:#d35400'>${dersAdi} dersi için ${eksik.ad} notunuz için <b>${gereken}</b> almanız gerekmektedir.</span>`;
      });
    }
  }

  sonucDiv.innerHTML = sonucHTML;
}

function hesaplaVeSonucuYaz() {
  const islem = document.getElementById('islem')?.value;
  // Dönem modunda donemDersAlanlariDiv, genel modda dersAlanlariDiv kullanılır
  const donemDersAlanlari = document.querySelectorAll('#donemDersAlanlari .ders-container');
  const genelDersAlanlari = document.querySelectorAll('#dersAlanlari .ders-container');
  let sonucMetni = "<h3>GENEL SONUÇ</h3>";

  if (islem === 'donem') {
    // Dönem not ortalaması: sadece yüzdelikler zorunlu
    for (let i = 0; i < donemDersAlanlari.length; i++) {
      const dersDiv = donemDersAlanlari[i];
      const dersAdi = dersDiv.querySelector('.ders-adi')?.value || `Ders ${i+1}`;
      const vizeYuzdeInput = dersDiv.querySelector('.vize-yuzde');
      const finalYuzdeInput = dersDiv.querySelector('.final-yuzde');
      const projeYuzdeInput = dersDiv.querySelector('.proje-yuzde');
      const vizeYuzde = vizeYuzdeInput ? parseFloat(vizeYuzdeInput.value) : NaN;
      const finalYuzde = finalYuzdeInput ? parseFloat(finalYuzdeInput.value) : NaN;
      const projeYuzde = projeYuzdeInput ? parseFloat(projeYuzdeInput.value) : NaN;
      if (
        isEmptyOrInvalid(vizeYuzdeInput?.value) ||
        isEmptyOrInvalid(finalYuzdeInput?.value) ||
        isEmptyOrInvalid(projeYuzdeInput?.value)
      ) {
        sonucMetni += `<div class='ders-genel-sonuc' style='margin-bottom: 32px;'><span style='color:#e74c3c'><strong>${dersAdi}:</strong> Vize, Final ve Sunum/Proje yüzdesi alanları zorunludur!</span></div>`;
        continue;
      }
      if (Math.abs(vizeYuzde + finalYuzde + projeYuzde - 100) > 0.01) {
        sonucMetni += `<div class='ders-genel-sonuc' style='margin-bottom: 32px;'><span style='color:#e74c3c'><strong>${dersAdi}:</strong> Yüzdelerin toplamı 100 olmalı!</span></div>`;
        continue;
      }
      // Diğer alanlar isteğe bağlı, hesaplama ve sonuçlar mevcut kodla devam edecek
      // ... (mevcut hesaplama ve sonuç kodu buraya gelecek) ...
      // (Aşağıda mevcut kodun devamı var)
    }
  } else if (islem === 'genel') {
    // Genel not ortalaması: tüm alanlar zorunlu
    // Mevcut kredi ve ortalama zorunlu
    const mevcutKredi = document.getElementById('mevcutKredi');
    const mevcutOrtalama = document.getElementById('mevcutOrtalama');
    if (!mevcutKredi?.value || !mevcutOrtalama?.value) {
      sonucMetni += `<div class='ders-genel-sonuc' style='margin-bottom: 32px;'><span style='color:#e74c3c'><strong>Genel:</strong> Mevcut kredi ve ortalama alanları zorunludur!</span></div>`;
      document.getElementById('sonuc').innerHTML = sonucMetni;
      return;
    }
    for (let i = 0; i < genelDersAlanlari.length; i++) {
      const dersDiv = genelDersAlanlari[i];
      const dersAdi = dersDiv.querySelector('.ders-adi')?.value;
      const kredi = dersDiv.querySelector('.ders-kredi')?.value;
      const vizeNotu = dersDiv.querySelector('.vize-notu')?.value;
      const vizeYuzde = dersDiv.querySelector('.vize-yuzde')?.value;
      const finalNotu = dersDiv.querySelector('.final-notu')?.value;
      const finalYuzde = dersDiv.querySelector('.final-yuzde')?.value;
      const projeNotu = dersDiv.querySelector('.proje-notu')?.value;
      const projeYuzde = dersDiv.querySelector('.proje-yuzde')?.value;
      if (!dersAdi || !kredi || !vizeNotu || !vizeYuzde || !finalNotu || !finalYuzde || !projeNotu || !projeYuzde) {
        sonucMetni += `<div class='ders-genel-sonuc' style='margin-bottom: 32px;'><span style='color:#e74c3c'><strong>${dersAdi || `Ders ${i+1}`}:</strong> Tüm alanlar zorunludur!</span></div>`;
        continue;
      }
      // Yüzdelerin toplamı 100 olmalı
      const yuzdeToplam = Number(vizeYuzde) + Number(finalYuzde) + Number(projeYuzde);
      if (Math.abs(yuzdeToplam - 100) > 0.01) {
        sonucMetni += `<div class='ders-genel-sonuc' style='margin-bottom: 32px;'><span style='color:#e74c3c'><strong>${dersAdi}:</strong> Yüzdelerin toplamı 100 olmalı!</span></div>`;
        continue;
      }
      // ... (mevcut hesaplama ve sonuç kodu buraya gelecek) ...
    }
    // --- YIL ORTALAMASI TABLOSU VE FORMÜLÜ ---
    // 1. Bu yılın toplam kredisi ve ağırlıklı ortalamasını hesapla (100'lük sistemde)
    let buYilToplamKredi = 0;
    let buYilToplamNot = 0;
    for (let i = 0; i < genelDersAlanlari.length; i++) {
      const dersDiv = genelDersAlanlari[i];
      const kredi = Number(dersDiv.querySelector('.ders-kredi')?.value);
      const vizeNotu = Number(dersDiv.querySelector('.vize-notu')?.value);
      const vizeYuzde = Number(dersDiv.querySelector('.vize-yuzde')?.value);
      const finalNotu = Number(dersDiv.querySelector('.final-notu')?.value);
      const finalYuzde = Number(dersDiv.querySelector('.final-yuzde')?.value);
      const projeNotu = Number(dersDiv.querySelector('.proje-notu')?.value);
      const projeYuzde = Number(dersDiv.querySelector('.proje-yuzde')?.value);
      const dersNotu = (vizeNotu * vizeYuzde / 100) + (finalNotu * finalYuzde / 100) + (projeNotu * projeYuzde / 100);
      buYilToplamKredi += kredi;
      buYilToplamNot += kredi * dersNotu;
    }
    const buYilOrt100 = buYilToplamKredi > 0 ? (buYilToplamNot / buYilToplamKredi) : 0;
    const buYilOrt4 = yokeDonustur100den4e(buYilOrt100);
    // 2. Mevcut kredi ve ortalama (kullanıcıdan alınan 4'lük sistemde olmalı)
    const mevcutKrediVal = Number(mevcutKredi.value);
    const mevcutOrtVal = Number(mevcutOrtalama.value);
    // 3. Yıl ortalaması hesapla (4'lük sistemde)
    const pay = (mevcutKrediVal * mevcutOrtVal) + (buYilToplamKredi * buYilOrt4);
    const payda = mevcutKrediVal + buYilToplamKredi;
    const yilOrt = payda > 0 ? (pay / payda) : 0;
    // 4. Tablo ve sadece sonuç çıktısı (hesaplama adımı yok)
    sonucMetni += `
      <table style='width:100%;margin-top:24px;margin-bottom:16px;border-collapse:collapse;'>
        <tr style='font-weight:bold;background:#f0f0f0;'>
          <td>Yıl</td><td>Toplam Kredi</td><td>Yıl Ortalaması (4'lük)</td>
        </tr>
        <tr><td>Şu Anki Dönem</td><td>${buYilToplamKredi}</td><td>${buYilOrt4}</td></tr>
        <tr><td>Önceki Dönem</td><td>${mevcutKrediVal}</td><td>${mevcutOrtVal.toFixed(2)}</td></tr>
      </table>
      <div style='margin-top:18px; text-align:left;'>
        <span style='font-weight:bold; font-size:1.6rem; color:#222a5c;'>Yıl Ortalaması: ${yilOrt.toFixed(2)}</span>
      </div>
    `;
  }
  document.getElementById('sonuc').innerHTML = sonucMetni;
}

function harfNotu(not, notSistemi) {
  not = Number(not);

  // 1. AA, BA, BB, CB, CC, DC, DD, FD, FF
  if (notSistemi === "AA, BA, BB, CB, CC, DC, DD, FD, FF") {
    if (not >= 90) return "AA";
    if (not >= 85) return "BA";
    if (not >= 80) return "BB";
    if (not >= 75) return "CB";
    if (not >= 70) return "CC";
    if (not >= 65) return "DC";
    if (not >= 60) return "DD";
    if (not >= 50) return "FD";
    return "FF";
  }

  // 2. AA, BA, BB, BC, CB, CC, DC, DD, FD, FF
  if (notSistemi === "AA, BA, BB, BC, CB, CC, DC, DD, FD, FF") {
    if (not >= 90) return "AA";
    if (not >= 85) return "BA";
    if (not >= 80) return "BB";
    if (not >= 75) return "BC";
    if (not >= 70) return "CB";
    if (not >= 65) return "CC";
    if (not >= 60) return "DC";
    if (not >= 55) return "DD";
    if (not >= 50) return "FD";
    return "FF";
  }

  // 3. A, A-, B+, B, B-, C+, C, C-, D+, D, D-, F
  if (notSistemi === "A, A-, B+, B, B-, C+, C, C-, D+, D, D-, F") {
    if (not >= 95) return "A";
    if (not >= 90) return "A-";
    if (not >= 85) return "B+";
    if (not >= 80) return "B";
    if (not >= 75) return "B-";
    if (not >= 70) return "C+";
    if (not >= 65) return "C";
    if (not >= 60) return "C-";
    if (not >= 55) return "D+";
    if (not >= 50) return "D";
    if (not >= 45) return "D-";
    return "F";
  }

  // 4. A1, A2, A3, B1, B2, B3, C1, C2, D1, D2, F1, F2
  if (notSistemi === "A1, A2, A3, B1, B2, B3, C1, C2, D1, D2, F1, F2") {
    if (not >= 95) return "A1";
    if (not >= 90) return "A2";
    if (not >= 85) return "A3";
    if (not >= 80) return "B1";
    if (not >= 75) return "B2";
    if (not >= 70) return "B3";
    if (not >= 65) return "C1";
    if (not >= 60) return "C2";
    if (not >= 55) return "D1";
    if (not >= 50) return "D2";
    if (not >= 40) return "F1";
    return "F2";
  }

  

  return "-";
}

function isEmptyOrInvalid(val) {
  return val === '' || val === null || val === undefined || isNaN(Number(val));
}

function hesaplaDonemDersSonucu(dersDiv, dersIndex) {
  const donemNotSistemiSelect = document.getElementById('donemNotSistemi');
  const gecmeNotu = NOT_SISTEMLERI[donemNotSistemiSelect.value]?.minScore || 50;
  const dersAdi = dersDiv.querySelector('.ders-adi')?.value || `Ders ${dersIndex + 1}`;
  const vizeNotuStr = dersDiv.querySelector('.vize-notu')?.value;
  const vizeNotu = parseFloat(vizeNotuStr) || 0;
  const vizeYuzdeInput = dersDiv.querySelector('.vize-yuzde');
  const vizeYuzde = vizeYuzdeInput ? parseFloat(vizeYuzdeInput.value) : NaN;
  const finalNotuStr = dersDiv.querySelector('.final-notu')?.value;
  const finalNotu = parseFloat(finalNotuStr) || 0;
  const finalYuzdeInput = dersDiv.querySelector('.final-yuzde');
  const finalYuzde = finalYuzdeInput ? parseFloat(finalYuzdeInput.value) : NaN;
  const projeNotuStr = dersDiv.querySelector('.proje-notu')?.value;
  const projeNotu = parseFloat(projeNotuStr) || 0;
  const projeYuzdeInput = dersDiv.querySelector('.proje-yuzde');
  const projeYuzde = projeYuzdeInput ? parseFloat(projeYuzdeInput.value) : NaN;
  const sonucDiv = dersDiv.querySelector('.ders-sonuc');

  // Yüzdelik alanlardan herhangi biri boş, null, undefined veya sayı değilse uyarı ver
  if (
    isEmptyOrInvalid(vizeYuzdeInput?.value) ||
    isEmptyOrInvalid(finalYuzdeInput?.value) ||
    isEmptyOrInvalid(projeYuzdeInput?.value)
  ) {
    sonucDiv.innerHTML = '<span style="color: red">Vize, Final ve Sunum/Proje yüzdesi alanları zorunludur!</span>';
    return;
  }
  // Yüzdelerin toplamı 100 olmalı
  if (Math.abs(vizeYuzde + finalYuzde + projeYuzde - 100) > 0.01) {
    sonucDiv.innerHTML = '<span style="color: red">Yüzdelerin toplamı 100 olmalı!</span>';
    return;
  }
  // Sadece yüzdelikler zorunlu, notlar boş olabilir
  let hesaplananNot = 
    (vizeNotu * vizeYuzde / 100) +
    (finalNotu * finalYuzde / 100) +
    (projeNotu * projeYuzde / 100);
  hesaplananNot = parseFloat(hesaplananNot.toFixed(2));
  const harf = harfNotu(hesaplananNot, donemNotSistemiSelect.value);
  let sonucHTML = `<span style="color: ${hesaplananNot >= gecmeNotu ? 'green' : 'red'}">${dersAdi} dersi için notunuz ${hesaplananNot} ve harf notunuz ${harf}. Dersin minimum geçme notunuz: ${gecmeNotu}.</span>`;
  // Eğer dersten kalıyorsa ve eksik not varsa, eksik notun minimum değerini hesapla
  if (hesaplananNot < gecmeNotu) {
    let eksikNotlar = [];
    if (!vizeNotuStr && vizeYuzde > 0) eksikNotlar.push({ad: 'Vize', yuzde: vizeYuzde, mevcut: vizeNotu});
    if (!finalNotuStr && finalYuzde > 0) eksikNotlar.push({ad: 'Final', yuzde: finalYuzde, mevcut: finalNotu});
    if (!projeNotuStr && projeYuzde > 0) eksikNotlar.push({ad: 'Sunum / Proje', yuzde: projeYuzde, mevcut: projeNotu});
    
    // Eğer iki eksik not varsa, birlikte minimum almaları gereken notları hesapla
    if (eksikNotlar.length === 2) {
      // İki eksik notun isimleri ve yüzdeleri
      const eksik1 = eksikNotlar[0];
      const eksik2 = eksikNotlar[1];
      // Diğer notların katkısı
      let digerKatki = 0;
      if (eksik1.ad !== 'Vize' && eksik2.ad !== 'Vize') digerKatki += (vizeNotu * vizeYuzde / 100);
      if (eksik1.ad !== 'Final' && eksik2.ad !== 'Final') digerKatki += (finalNotu * finalYuzde / 100);
      if (eksik1.ad !== 'Sunum / Proje' && eksik2.ad !== 'Sunum / Proje') digerKatki += (projeNotu * projeYuzde / 100);
      // Kombinasyon 1: eksik1 = 0, eksik2 = gereken
      let gereken2 = (gecmeNotu - digerKatki) / (eksik2.yuzde / 100);
      gereken2 = Math.ceil(gereken2 * 100) / 100;
      if (gereken2 < 0) gereken2 = 0;
      if (gereken2 > 100) gereken2 = 100;
      // Kombinasyon 2: eksik2 = 0, eksik1 = gereken
      let gereken1 = (gecmeNotu - digerKatki) / (eksik1.yuzde / 100);
      gereken1 = Math.ceil(gereken1 * 100) / 100;
      if (gereken1 < 0) gereken1 = 0;
      if (gereken1 > 100) gereken1 = 100;
      // Mesajları yaz
      if (gereken1 > 100) {
        sonucHTML += `<br><span style='color:#d35400'>Bu dersi geçmeniz için ${eksik1.ad} notunuz en az <b>100</b> ve ${eksik2.ad} notunuz en az <b>0</b> olmalıdır. (Sadece bu kombinasyonla dersi geçemezsiniz, diğer eksik nottan da katkı almalısınız.)</span>`;
      } else {
        sonucHTML += `<br><span style='color:#d35400'>Bu dersi geçmeniz için ${eksik1.ad} notunuz en az <b>${gereken1}</b> ve ${eksik2.ad} notunuz en az <b>0</b> olmalıdır.</span>`;
      }
      if (gereken2 > 100) {
        sonucHTML += `<br><span style='color:#d35400'>Bu dersi geçmeniz için ${eksik1.ad} notunuz en az <b>0</b> ve ${eksik2.ad} notunuz en az <b>100</b> olmalıdır. (Sadece bu kombinasyonla dersi geçemezsiniz, diğer eksik nottan da katkı almalısınız.)</span>`;
      } else {
        sonucHTML += `<br><span style='color:#d35400'>Bu dersi geçmeniz için ${eksik1.ad} notunuz en az <b>0</b> ve ${eksik2.ad} notunuz en az <b>${gereken2}</b> olmalıdır.</span>`;
      }
    } else {
      // Tek eksik not varsa, mevcut algoritma ile devam
      eksikNotlar.forEach(function(eksik) {
        let digerKatki = 0;
        if (eksik.ad !== 'Vize') digerKatki += (vizeNotu * vizeYuzde / 100);
        if (eksik.ad !== 'Final') digerKatki += (finalNotu * finalYuzde / 100);
        if (eksik.ad !== 'Sunum / Proje') digerKatki += (projeNotu * projeYuzde / 100);
        let gereken = (gecmeNotu - digerKatki) / (eksik.yuzde / 100);
        gereken = Math.ceil(gereken * 100) / 100;
        if (gereken < 0) gereken = 0;
        if (gereken > 100) gereken = 100;
        sonucHTML += `<br><span style='color:#d35400'>${dersAdi} dersi için ${eksik.ad} notunuz için <b>${gereken}</b> almanız gerekmektedir.</span>`;
      });
    }
  }
  sonucDiv.innerHTML = sonucHTML;
}

// 100'lükten 4'lük sisteme YÖK tablosuna göre dönüşüm fonksiyonu
function yokeDonustur100den4e(not100) {
  // YÖK tablosunun önemli noktalarını dizi olarak ekliyoruz (azaltılmış örnek, tam tabloyu ekleyebilirsin)
  const tablo = [
    {yuzluk: 100, dortluk: 4.00},
    {yuzluk: 89.50, dortluk: 3.55},
    {yuzluk: 79.00, dortluk: 3.10},
    {yuzluk: 68.26, dortluk: 2.64},
    {yuzluk: 57.53, dortluk: 2.22},
    {yuzluk: 46.33, dortluk: 1.70},
    {yuzluk: 35.13, dortluk: 1.22},
    {yuzluk: 30.00, dortluk: 1.00}
  ];
  for (let i = 0; i < tablo.length - 1; i++) {
    if (not100 <= tablo[i].yuzluk && not100 >= tablo[i+1].yuzluk) {
      // Lineer interpolasyon
      const oran = (not100 - tablo[i+1].yuzluk) / (tablo[i].yuzluk - tablo[i+1].yuzluk);
      return (tablo[i+1].dortluk + oran * (tablo[i].dortluk - tablo[i+1].dortluk)).toFixed(2);
    }
  }
  if (not100 > 100) return 4.00;
  if (not100 < 30) return 1.00;
  return 1.00;
}

function updateRequiredInputs() {
  // Tüm ilgili formlardaki inputlardan required kaldır
  ['#toplamKrediOrtalama', '#gecmisDonemArayuz', '#genelDersler'].forEach(selector => {
    document.querySelectorAll(selector + ' input').forEach(input => {
      input.removeAttribute('required');
    });
  });
  // Sadece görünür olan formun inputlarına required ekle
  ['#toplamKrediOrtalama', '#gecmisDonemArayuz', '#genelDersler'].forEach(selector => {
    const formDiv = document.querySelector(selector);
    if (formDiv && formDiv.offsetParent !== null && !formDiv.classList.contains('hidden')) {
      formDiv.querySelectorAll('input').forEach(input => {
        input.setAttribute('required', 'required');
      });
    }
  })
}})