// ============================================================
// Portofolio Interaktif - Khansa Syafiqa
// Fitur: 1) Form input & validasi  2) Live search  3) Toggle status & hapus
// ============================================================

// ---------- STATE ----------
// Data awal berasal dari dua proyek di latihan sebelumnya.
let projects = [
    {
        id: 1,
        judul: "Sistem Manajemen Inventori",
        kategori: "Desktop App",
        anggaran: 0,
        selesai: true,
        meta: "Proyek pembelajaran · 2026",
        deskripsi: "Aplikasi berbasis lokal pencatatan dan pengelolaan sirkulasi barang dengan dukungan database MySQL.",
        tags: ["HTML", "CSS", "JavaScript", "MySQL"]
    },
    {
        id: 2,
        judul: "Perhitungan Transaksi Belanja",
        kategori: "Web App",
        anggaran: 0,
        selesai: false,
        meta: "Latihan JavaScript · 2026",
        deskripsi: "Program perhitungan total belanja dan diskon menggunakan logika JavaScript serta struktur data Array of Objects.",
        tags: ["JavaScript ES6+", "Array of Objects"]
    }
];

let searchKeyword = "";

// ---------- ELEMEN DOM ----------
const form = document.getElementById("project-form");
const inputJudul = document.getElementById("judul");
const inputKategori = document.getElementById("kategori");
const inputAnggaran = document.getElementById("anggaran");
const inputSelesai = document.getElementById("selesai");
const errorJudul = document.getElementById("judul-error");
const errorAnggaran = document.getElementById("anggaran-error");

const inputCari = document.getElementById("cari");
const listEl = document.getElementById("project-list");
const emptyEl = document.getElementById("empty-state");

const statTotal = document.getElementById("stat-total");
const statSelesai = document.getElementById("stat-selesai");
const statProses = document.getElementById("stat-proses");
const statAnggaran = document.getElementById("stat-anggaran");

// ---------- UTILITAS ----------
function formatRupiah(angka) {
    return "Rp " + Number(angka).toLocaleString("id-ID");
}

// Mencegah injeksi HTML dari input pengguna
function escapeHTML(teks) {
    return String(teks)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// ---------- RENDER ----------
function renderStats() {
    const total = projects.length;
    const selesai = projects.filter((p) => p.selesai).length;
    const totalAnggaran = projects.reduce((sum, p) => sum + p.anggaran, 0);

    statTotal.textContent = total;
    statSelesai.textContent = selesai;
    statProses.textContent = total - selesai;
    statAnggaran.textContent = formatRupiah(totalAnggaran);
}

function buildCard(project, index) {
    const nomor = String(index + 1).padStart(2, "0");
    const statusText = project.selesai ? "Selesai" : "Dalam Pengerjaan";
    const statusClass = project.selesai ? "is-done" : "is-progress";
    const anggaranText = project.anggaran > 0 ? formatRupiah(project.anggaran) : "Anggaran belum ditentukan";
    const meta = project.meta
        ? `${escapeHTML(project.meta)}`
        : `${escapeHTML(project.kategori)} · ${anggaranText}`;

    const deskripsi = project.deskripsi
        ? `<p class="project-desc">${escapeHTML(project.deskripsi)}</p>`
        : "";

    const tags = [project.kategori, ...(project.tags || [])];
    const tagHTML = tags
        .map((t) => `<span class="tag">${escapeHTML(t)}</span>`)
        .join("");

    return `
        <article class="project-card" data-id="${project.id}">
            <div class="card-top">
                <span class="project-number">${nomor}</span>
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            <h3>${escapeHTML(project.judul)}</h3>
            <p class="project-meta">${meta}</p>
            ${deskripsi}
            <div class="tag-list">${tagHTML}</div>
            <div class="card-actions">
                <button type="button" class="btn-toggle" data-action="toggle" data-id="${project.id}">
                    Ubah Status
                </button>
                <button type="button" class="btn-delete" data-action="delete" data-id="${project.id}">
                    Hapus Proyek
                </button>
            </div>
        </article>
    `;
}

function renderProjects() {
    // Fitur 2: filter real-time berdasarkan nama proyek
    const keyword = searchKeyword.trim().toLowerCase();
    const filtered = projects.filter((p) =>
        p.judul.toLowerCase().includes(keyword)
    );

    listEl.innerHTML = filtered.map(buildCard).join("");

    if (filtered.length === 0) {
        emptyEl.hidden = false;
        emptyEl.textContent = projects.length === 0
            ? "Belum ada proyek. Tambahkan proyek pertama Anda lewat formulir di atas."
            : `Tidak ada proyek yang cocok dengan "${searchKeyword.trim()}".`;
    } else {
        emptyEl.hidden = true;
    }
}

function render() {
    renderProjects();
    renderStats();
}

// ---------- FITUR 1: FORM SUBMIT & VALIDASI ----------
function clearErrors() {
    errorJudul.textContent = "";
    errorAnggaran.textContent = "";
    inputJudul.classList.remove("invalid");
    inputAnggaran.classList.remove("invalid");
}

form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();

    const judul = inputJudul.value.trim();
    const anggaran = Number(inputAnggaran.value);
    let valid = true;

    if (judul === "") {
        errorJudul.textContent = "Judul proyek tidak boleh kosong.";
        inputJudul.classList.add("invalid");
        valid = false;
    }

    if (inputAnggaran.value === "" || isNaN(anggaran) || anggaran <= 0) {
        errorAnggaran.textContent = "Anggaran harus lebih besar dari 0.";
        inputAnggaran.classList.add("invalid");
        valid = false;
    }

    if (!valid) return;

    const proyekBaru = {
        id: Date.now(),
        judul: judul,
        kategori: inputKategori.value,
        anggaran: anggaran,
        selesai: inputSelesai.checked
    };

    // Spread operator: membuat array baru berisi data lama + proyek baru
    projects = [...projects, proyekBaru];

    form.reset();
    inputJudul.focus();
    render();
});

// Hapus pesan error begitu pengguna memperbaiki isian
inputJudul.addEventListener("input", () => {
    errorJudul.textContent = "";
    inputJudul.classList.remove("invalid");
});
inputAnggaran.addEventListener("input", () => {
    errorAnggaran.textContent = "";
    inputAnggaran.classList.remove("invalid");
});

// ---------- FITUR 2: LIVE SEARCH ----------
inputCari.addEventListener("input", function () {
    searchKeyword = inputCari.value;
    renderProjects();
});

// ---------- FITUR 3: TOGGLE STATUS & HAPUS ----------
// Event delegation: satu listener untuk semua tombol pada kartu
listEl.addEventListener("click", function (e) {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const id = Number(btn.dataset.id);

    if (btn.dataset.action === "toggle") {
        projects = projects.map((p) =>
            p.id === id ? { ...p, selesai: !p.selesai } : p
        );
    } else if (btn.dataset.action === "delete") {
        projects = projects.filter((p) => p.id !== id);
    }

    render();
});

// ---------- INISIALISASI ----------
render();
