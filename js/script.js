/* ============================================================
   SCRIPT.JS — Helper umum & API Fetcher untuk GitHub
   ============================================================ */

// ⚠️ PENTING: Ganti string di bawah dengan URL Web App Anda dari Fase 1
const API_URL = "https://script.google.com/AKfycbwJQFw8a7idpuNclGyuKu6NQtk3r4HWQ8sF3JgMzhfpT9t_29Gn2b9wq-C1_W5g0k1J8Q/exec";

/**
 * Fungsi Utama untuk berkomunikasi dengan Google Apps Script (Backend)
 * Menggantikan fungsi google.script.run
 */
async function fetchAPI(action, data = {}) {
  // Ambil token dari memori browser (jika user sudah login)
  const token = localStorage.getItem('userToken') || ""; 
  
  const payload = {
    action: action,
    data: data,
    token: token
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      // GAS membutuhkan body berbentuk string (text/plain) untuk menghindari isu CORS Preflight
      body: JSON.stringify(payload) 
    });
    
    // Parse balasan dari server (yang di-generate oleh ContentService di Fase 1)
    const result = await response.json(); 
    return result;
  } catch (error) {
    console.error("Gagal menghubungi server:", error);
    return { success: false, message: "Gagal terhubung ke server. Periksa koneksi internet Anda." };
  }
}

// ============================================================
// UI HELPERS (Diambil dari sistem lama Anda)
// ============================================================

// Toggle buka/tutup FAQ accordion
function initFaqAccordion() {
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var question = item.querySelector('.faq-q');
    if (!question) return;
    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        openItem.classList.remove('open');
      });
      if (!isOpen) item.classList.add('open');
    });
  });
}

// Smooth scroll untuk link anchor
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// Tampilkan pesan sukses/error di form
function showFormMessage(elId, message, type) {
  var el = document.getElementById(elId);
  if (!el) return;
  el.textContent = message;
  el.className = 'form-msg show ' + (type === 'success' ? 'success' : 'error');
}

function hideFormMessage(elId) {
  var el = document.getElementById(elId);
  if (!el) return;
  el.className = 'form-msg';
}

// Set tombol ke kondisi loading
function setButtonLoading(btnEl, isLoading, loadingText, normalText) {
  if (!btnEl) return;
  btnEl.disabled = isLoading;
  btnEl.textContent = isLoading ? (loadingText || 'Memproses...') : (normalText || btnEl.dataset.originalText || 'Kirim');
}

// Popup Loading Global
function ensureLoadingOverlay() {
  if (document.getElementById('globalLoadingOverlay')) return;
  var div = document.createElement('div');
  div.id = 'globalLoadingOverlay';
  div.className = 'loading-overlay';
  div.innerHTML = '<div class="loading-box"><div class="loading-spinner"></div><div class="loading-text" id="globalLoadingText">Memproses...</div></div>';
  document.body.appendChild(div);
}

function showLoading(message) {
  ensureLoadingOverlay();
  document.getElementById('globalLoadingText').textContent = message || 'Memproses...';
  document.getElementById('globalLoadingOverlay').classList.add('show');
}

function hideLoading() {
  var el = document.getElementById('globalLoadingOverlay');
  if (el) el.classList.remove('show');
}

// Fungsi Logout (Baru) - Menghapus token dan mengarahkan ke halaman login
function logout() {
  localStorage.removeItem('userToken');
  window.location.href = "login.html";
}

// Jalankan initializer saat halaman siap
document.addEventListener('DOMContentLoaded', function () {
  initFaqAccordion();
  initSmoothScroll();
  ensureLoadingOverlay();
});