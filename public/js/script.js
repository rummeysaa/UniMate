document.addEventListener('DOMContentLoaded', function () {
    
    const dropdown = document.getElementById('dropdown');
    const toggle = document.getElementById('userDropdownToggle');
  
    
    
    if(toggle && dropdown){
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
    });}
  
   
    document.addEventListener('click', function (e) {
      if (dropdown && !dropdown.contains(e.target) && !toggle.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });
  });
  
  document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.getElementById('login-button');
    const registerBtn = document.getElementById('signup-button');
  
    if (loginBtn) {
      loginBtn.addEventListener('click', function () {
        window.location.href = '/login'; 
      });
    }
  
    if (registerBtn) {
      registerBtn.addEventListener('click', function () {
        window.location.href = '/signup'; 
      });
    }
  });
  
  document.addEventListener('DOMContentLoaded', function () {
  
    const goRegisterBtn = document.getElementById('go-signup');
    if (goRegisterBtn) {
      goRegisterBtn.addEventListener('click', function () {
        window.location.href = '/signup'; 
      });
    }
  });
  /* reminder js */
  
  document.addEventListener('DOMContentLoaded', function () {
    const dateInput = document.getElementById('dateInput');
    const timeInput = document.getElementById('timeInput');
  
    if (dateInput && timeInput) {
      const today = new Date();
      const nextYear = new Date(today.getFullYear() + 2, 11, 31);
      dateInput.min = today.toISOString().split('T')[0];
      dateInput.max = nextYear.toISOString().split('T')[0];
  
      dateInput.addEventListener('change', showFields);
      timeInput.addEventListener('change', showFields);
    }
  });
  
  function showFields() {
    const dateFilled = document.getElementById('dateInput').value !== '';
    const timeFilled = document.getElementById('timeInput').value !== '';
    if (dateFilled && timeFilled) {
      document.getElementById('additionalFields').style.display = 'block';
    }
  }
  
  function addReminder() {
    const title = document.getElementById('titleInput').value;
    const date = document.getElementById('dateInput').value;
    const time = document.getElementById('timeInput').value;
    const method = document.getElementById('notifyOption').value;
  
    if (!title || !date || !time) {
      alert("Tüm alanları doldurun.");
      return;
    }
  
    const list = document.getElementById('reminderList');
    const li = document.createElement('li');
    li.textContent = `${date} ${time} - ${title} (${method.toUpperCase()})`;
    list.appendChild(li);
  
    document.getElementById('titleInput').value = '';
    document.getElementById('descInput').value = '';
    document.getElementById('emailInput').value = '';
    document.getElementById('phoneInput').value = '';
  }
  function toggleDropdown() {
    const dropdown = document.getElementById('dropdownMenu');
    dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
  }
  
  
  /* ders programı */
  document.addEventListener('DOMContentLoaded', function () {
    const addButtons = document.querySelectorAll('.add-btn');
  
    addButtons.forEach(button => {
      button.addEventListener('click', function () {
        const parent = button.parentElement;
        const timeInput = parent.querySelector('input[type="time"]');
        const textInput = parent.querySelector('input[type="text"]');
        const list = parent.querySelector('.list');
  
        const time = timeInput.value;
        const activity = textInput.value.trim();
  
        if (time && activity) {
          const li = document.createElement('li');
          li.textContent = `${time} - ${activity}`;
          list.appendChild(li);
  
          timeInput.value = '';
          textInput.value = '';
        } else {
          alert("Lütfen saat ve etkinlik giriniz.");
        }
      });
    });
  });
  /* devamsızlık */
  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('absenceForm');
    const list = document.getElementById('absenceList');
  
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
  
        const lesson = document.getElementById('lessonName').value;
        const weeks = parseInt(document.getElementById('totalWeeks').value);
        const hours = parseInt(document.getElementById('weeklyHours').value);
        const percent = parseFloat(document.getElementById('absencePercent').value);
        const missed = parseFloat(document.getElementById('missedHours').value);
  
        const totalHours = weeks * hours;
        const allowedAbsence = Math.floor(totalHours * (percent / 100));
  
        const mesaj = hesaplaDevamsizlik(weeks, hours, percent, missed, lesson);
  
        document.getElementById('absenceResult').textContent = mesaj;
  
        form.reset();
      });
    }
  });
  
  function hesaplaDevamsizlik(toplamHafta, haftalikSaat, devamsizlikYuzdesi, girilmeyenSaat, dersAdi) {
    if (
      toplamHafta && haftalikSaat &&
      devamsizlikYuzdesi >= 0 && devamsizlikYuzdesi <= 100 &&
      girilmeyenSaat >= 0
    ) {
      const toplamSaat = toplamHafta * haftalikSaat;
      const maxDevamsizlik = (toplamSaat * devamsizlikYuzdesi) / 100;
      const kalanDevamsizlik = maxDevamsizlik - girilmeyenSaat;

      let mesaj =
        `${dersAdi} dersi için toplam devamsızlık hakkınız: ${maxDevamsizlik.toFixed(1)} saat.\n` +
        `Şu ana kadar ${girilmeyenSaat.toFixed(1)} saat devamsızlık yaptınız.\n` +
        `Kalan devamsızlık hakkınız: ${kalanDevamsizlik.toFixed(1)} saat.`;
      if (kalanDevamsizlik < 0) {
        mesaj += `\nUYARI: ${dersAdi} dersi için devamsızlık hakkınızı aştınız, dersten kalmış olabilirsiniz!`;
      }
      return mesaj;
    } else {
      return 'Lütfen tüm alanları geçerli şekilde doldurun.';
    }
  }
  
  