import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLORS = {
  red: '#FF0000',
  darkRed: '#CC0000',
  white: '#FFFFFF',
  cream: '#FFF8F0',
  gold: '#FFD700',
  darkGray: '#333333',
  lightGray: '#F5F5F5',
  gray: '#888888',
  orange: '#FF6B00',
  green: '#28A745',
  blue: '#007BFF',
  pink: '#E91E63',
  purple: '#9C27B0',
};

const JADWAL_LINTAS = [
  { id: '1', waktu: '06.00 - 06.30', nama: 'Gladi', tipe: 'persiapan', icon: '🎬', kategori: 'Umum', status: 'akan_datang' },
  { id: '2', waktu: '06.30 - 07.30', nama: 'Pengibaran Bendera', tipe: 'upacara', icon: '🇮🇩', kategori: 'Umum', status: 'akan_datang' },
  { id: '3', waktu: '07.30 - 08.00', nama: 'Persiapan', tipe: 'persiapan', icon: '⏳', kategori: 'Umum', status: 'akan_datang' },
  { id: '4', waktu: '08.00 - 08.20', nama: 'Makan Kerupuk', tipe: 'lomba', icon: '🍘', kategori: 'Caberawit B', durasi: 20, status: 'akan_datang' },
  { id: '5', waktu: '08.20 - 08.40', nama: 'Makan Kerupuk', tipe: 'lomba', icon: '🍘', kategori: 'Caberawit A', durasi: 20, status: 'akan_datang' },
  { id: '6', waktu: '08.40 - 09.00', nama: 'Makan Kerupuk', tipe: 'lomba', icon: '🍘', kategori: 'Paud', durasi: 20, status: 'akan_datang' },
  { id: '7', waktu: '09.00 - 09.20', nama: 'Pindah Bendera Ke Botol', tipe: 'lomba', icon: '🚩', kategori: 'Pra-Paud', durasi: 20, status: 'akan_datang' },
  { id: '8', waktu: '09.20 - 09.40', nama: 'Makan Kerupuk', tipe: 'lomba', icon: '🍘', kategori: 'Caberawit C + Pra-remaja', durasi: 20, status: 'akan_datang' },
  { id: '9', waktu: '09.40 - 10.00', nama: 'Hidung Sedotan Botol', tipe: 'lomba', icon: '👃', kategori: 'Caberawit A', durasi: 20, status: 'akan_datang' },
  { id: '10', waktu: '10.00 - 10.20', nama: 'Pindah Karet dengan Sumpit', tipe: 'lomba', icon: '🥢', kategori: 'Paud', durasi: 20, status: 'akan_datang' },
  { id: '11', waktu: '10.20 - 10.40', nama: 'Pindah Air Spons', tipe: 'lomba', icon: '🧽', kategori: 'Pra-Paud', durasi: 20, status: 'akan_datang' },
  { id: '12', waktu: '10.40 - 11.20', nama: 'Lomba Ibu-Ibu', tipe: 'lomba', icon: '👩', kategori: 'Ibu-Ibu', durasi: 40, status: 'akan_datang' },
  { id: '13', waktu: '11.20 - 12.00', nama: 'Lomba Bapak-bapak', tipe: 'lomba', icon: '👨', kategori: 'Bapak-bapak', durasi: 40, status: 'akan_datang' },
  { id: '14', waktu: '12.00 - 12.00', nama: 'Foto Bersama', tipe: 'foto', icon: '📸', kategori: 'Umum', status: 'akan_datang' },
  { id: '15', waktu: '12.00 - 13.00', nama: 'ISHOMA', tipe: 'istirahat', icon: '🍽️', kategori: 'Umum', status: 'akan_datang' },
  { id: '16', waktu: '13.00 - 13.20', nama: 'Kupas Telur Ayam', tipe: 'lomba', icon: '🥚', kategori: 'Pra-Paud', durasi: 20, status: 'akan_datang' },
  { id: '17', waktu: '13.20 - 13.40', nama: 'Pancing Paku ke Botol', tipe: 'lomba', icon: '🎣', kategori: 'Caberawit B', durasi: 20, status: 'akan_datang' },
  { id: '18', waktu: '13.40 - 14.00', nama: 'Pepaya Koin Kecap', tipe: 'lomba', icon: '🍈', kategori: 'Caberawit C + Pra-remaja', durasi: 20, status: 'akan_datang' },
  { id: '19', waktu: '14.00 - 14.20', nama: 'Tiup Balon ke Gelas', tipe: 'lomba', icon: '🎈', kategori: 'Caberawit A', durasi: 20, status: 'akan_datang' },
  { id: '20', waktu: '14.20 - 14.40', nama: 'Pindah Bola dengan Centong', tipe: 'lomba', icon: '🥄', kategori: 'Paud', durasi: 20, status: 'akan_datang' },
  { id: '21', waktu: '14.40 - 15.00', nama: 'Karet Tepung Sedotan', tipe: 'lomba', icon: '🪢', kategori: 'Caberawit B', durasi: 20, status: 'akan_datang' },
  { id: '22', waktu: '15.00 - 15.20', nama: 'Pasang Kemeja Balon', tipe: 'lomba', icon: '👕', kategori: 'Caberawit C + Pra-remaja', durasi: 20, status: 'akan_datang' },
  { id: '23', waktu: '15.20 - Selesai', nama: 'Pembagian Hadiah + Foto Bersama', tipe: 'penutup', icon: '🏆', kategori: 'Umum', status: 'akan_datang' },
];

const KATEGORI_PESERTA = [
  { id: '0', nama: 'Pra-paud', icon: '👶', color: '#FF5722' },
  { id: '1', nama: 'PAUD', icon: '🍼', color: '#E91E63' },
  { id: '2', nama: 'Kelas A', icon: '🐥', color: '#FF9800' },
  { id: '3', nama: 'Kelas B', icon: '🐤', color: '#4CAF50' },
  { id: '4', nama: 'Kelas C', icon: '🐣', color: '#2196F3' },
  { id: '5', nama: 'Pra-remaja', icon: '🧑', color: '#9C27B0' },
  { id: '6', nama: 'Ibu-Ibu', icon: '👩', color: '#E91E63' },
  { id: '7', nama: 'Bapak-bapak', icon: '👨', color: '#795548' },
  { id: '8', nama: 'Umum', icon: '👥', color: '#607D8B' },
];

const DATA_KEUANGAN = [
  { area: 'Komplek Bawah', warga: ['Ibu Titin','Ibu Etik','Mba Aini','Ibu Ita','Ibu Maya','Bapak Rustam','Mba Putri','Ibu Yuli','Ibu Wina','Bapak Kasino','Bapak Sofian','Ibu Nia','Ibu Heri','Ibu Tuti'] },
  { area: 'Komplek Atas', warga: ['Ibu Suroya','Mba Siti','Ibu Alpin','Mba Meni','Ibu Ima','Ibu Iim','Ibu Pipit','Mba Yanti','Ibu Sam','Ibu Lia','Ibu Atun','Ibu Nanik','Bapak Budi','Bapak Marwan','Ibu Rini','Mba Eris','Ibu Ratmi Opal','Ibu Ratmi Raka','Bapak Rozak'] },
  { area: 'Luar Komplek', warga: ['Ibu Pur','Ibu Wagiyem','Bapak Sapto','Bapak Sabit','Bapak Fendy','Ibu Untung','Ibu Pipah'] },
];

const STATUS_AWAL = (function() {
  const st = {};
  const tanda = (area, idxs, lunas) => idxs.forEach(i => { st[area + '-' + i] = lunas ? 'lunas' : 'belum'; });
  tanda('Komplek Bawah', [0,1,2,3,4,6,7,8,9,10,11], true);
  tanda('Komplek Bawah', [5,12,13], false);
  tanda('Komplek Atas', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18], true);
  tanda('Luar Komplek', [0,1,3,4,5,6], true);
  tanda('Luar Komplek', [2], false);
  return st;
})();

const DATA_LOGISTIK = [];

const DEFAULT_HADIAH = [
  { posisi: 1, label: 'Juara 1', hadiah: 'Tropi + Bingkisan 🏆', icon: '🥇' },
  { posisi: 2, label: 'Juara 2', hadiah: 'Tropi + Bingkisan 🎁', icon: '🥈' },
  { posisi: 3, label: 'Juara 3', hadiah: 'Tropi + Bingkisan 🎀', icon: '🥉' },
];

const getHadiah = (hadiahMap, kategori, jk) => {
  if (hadiahMap[kategori]?.[jk]) return hadiahMap[kategori][jk];
  return DEFAULT_HADIAH;
};

const getHadiahLomba = (hadiahMap, lombaHadiah, lomba, jk) => {
  if (lombaHadiah[lomba.id]?.[jk]) return lombaHadiah[lomba.id][jk];
  return getHadiah(hadiahMap, keyKategoriHadiah(lomba.kategori), jk);
};

const buatHadiah = (arr) => DEFAULT_HADIAH.map((h, i) => ({ ...h, hadiah: arr[i] ?? '' }));

const HADIAH_EXCEL = {
  '4': {
    L: ['Balatax ransel item', 'Rautan pensil putar kartun biru', 'Botol viral gradasi'],
    P: ['Ransel Alisha biru', 'Rautan pensil putar kartun pink', 'Botol viral gradasi'],
  },
  '5': ['Voova Lunch box hijau', 'Botol air minum sedotan 610ml superhero', 'Celengan anak model art flanel'],
  '6': ['Technoplast schoolbox tempat minum astronot', 'Lunch box rabbit biru', 'Amilo spidol warna warni isi 12 hexagonal'],
  '7': ['Waist Bag Anak Variasi Putih', 'Magnetic Board Game', 'Botol Minum Labubu'],
  '8': {
    L: ['Tas futsal kanvas abu hitam', 'payung anti uv pria', 'Tas selempang handbag'],
    P: ['Tas ransel Alisha pink', 'payung anti uv wanita', 'Laapaka pouch pillow pink'],
  },
  '9': ['Payung PVC 8 sisi motif', 'Bantal leher motif kulit leopard', 'Pencil case undersea'],
  '10': ['Celengan mini anak brankas ATM', 'Kotak pensil magnet kalkulator', '5 in 1 stationary set BBT KNG'],
  '11': ['Tas ransel anak mario', 'SAO watercolor crayon astronaut', 'Tumbler karakter stitch'],
  '12': ['Mangkok wheat straw isi 4', 'Kuke tempat bumbu 4 sekat'],
  '13': ['Handuk muka microfiber', 'Sikat toilet 3 in 1'],
  '16': ['Magnetic drawing board kucing biru', 'Mainan angle buble gun gelembung', 'Lunch box momotel wortel'],
  '17': {
    L: ['Payung RTL lipat anti uv', 'Deli plastik crayon', 'YM pencil case kalkulator'],
    P: ['Payung RTL lipat anti uv', 'Deli plastik crayon', 'YM pencil case kalkulator'],
  },
  '18': {
    L: ['Speed pompa angin', 'Dompet pria lipat kanvas', 'Botol viral gradasi'],
    P: ['Kipas angin handled fan', 'Dompet genggam dino hitam', 'Botol viral gradasi'],
  },
  '19': ['Balatax ransel mini warna biru', 'Celengan squid game', 'Crayon + pensil warna montana'],
  '20': ['Tas selempang jinjing karakter cinamorol', 'Set crayon apik', 'Joe kotak makan biru'],
  '21': {
    L: ['Bantal leher dewasa polos coklat comb', 'Bilikot 3 in 1 kotak makan ijo', 'Kaos kaki bola anak panjang'],
    P: ['Bantal leher dewasa polos pink', 'Bilikot 3 in 1 kotak makan pink', 'Kipas mini USB sanrio melodi'],
  },
  '22': {
    L: ['Bantal leher dewasa abu', 'Jam meja sepeda putih', 'Kotak pensil sekolah hitam'],
    P: ['Bantal leher dewasa pink', 'Jam meja sepeda pink', 'Kotak pensil sekolah putih'],
  },
};

const LOMBA_HADIAH_AWAL = (function() {
  const out = {};
  Object.entries(HADIAH_EXCEL).forEach(([id, val]) => {
    if (Array.isArray(val)) {
      out[id] = { L: buatHadiah(val), P: buatHadiah(val) };
    } else {
      out[id] = { L: buatHadiah(val.L), P: buatHadiah(val.P) };
    }
  });
  return out;
})();

const GRUP_KATEGORI = [
  { id: 'g0', nama: 'Pra-paud', icon: '👶', usia: '1-3 tahun', color: '#FF5722' },
  { id: 'g1', nama: 'PAUD', icon: '🍼', usia: '3-6 tahun', color: '#E91E63' },
  { id: 'g2', nama: 'Kelas A', icon: '🐥', usia: '7-9 tahun', color: '#FF9800' },
  { id: 'g3', nama: 'Kelas B', icon: '🐤', usia: '10-12 tahun', color: '#4CAF50' },
  { id: 'g4', nama: 'Kelas C', icon: '🐣', usia: '13-15 tahun', color: '#2196F3' },
  { id: 'g5', nama: 'Pra-remaja', icon: '🧑', usia: '13-18 tahun', color: '#9C27B0' },
  { id: 'g6', nama: 'Ibu-Ibu', icon: '👩', usia: 'Dewasa', color: '#E91E63' },
  { id: 'g7', nama: 'Bapak-bapak', icon: '👨', usia: 'Dewasa', color: '#795548' },
];

const MAP_KATEGORI_LOMBA = {
  'Caberawit A': ['Kelas A'],
  'Caberawit B': ['Kelas B'],
  'Caberawit C + Pra-remaja': ['Kelas C', 'Pra-remaja'],
  'Caberawit C + PraRemaja': ['Kelas C', 'Pra-remaja'],
  'Paud': ['PAUD'],
  'Pra-Paud': ['Pra-paud'],
  'Ibu-Ibu': ['Ibu-Ibu'],
  'Bapak-bapak': ['Bapak-bapak'],
};

const getPesertaKategori = (kategori) => MAP_KATEGORI_LOMBA[kategori] || [kategori];

const MAP_GRUP_KE_KATEGORI = {
  'Kelas A': 'Caberawit A',
  'Kelas B': 'Caberawit B',
  'Kelas C': 'Caberawit C + Pra-remaja',
  'Pra-remaja': 'Caberawit C + Pra-remaja',
  'PAUD': 'Paud',
  'Pra-paud': 'Pra-Paud',
  'Ibu-Ibu': 'Ibu-Ibu',
  'Bapak-bapak': 'Bapak-bapak',
  'Umum': 'Umum',
};

const keyKategoriHadiah = (k) => MAP_GRUP_KE_KATEGORI[k] || k;

const PESERTA_LIST = [
  { id: '1', nama: 'Niyu', jk: 'P', grup: 'Pra-paud', lomba: '', rt: '', no: '' },
  { id: '2', nama: 'Arumi', jk: 'P', grup: 'Pra-paud', lomba: '', rt: '', no: '' },
  { id: '3', nama: 'Shena', jk: 'P', grup: 'Pra-paud', lomba: '', rt: '', no: '' },
  { id: '4', nama: 'Devan', jk: 'L', grup: 'Pra-paud', lomba: '', rt: '', no: '' },
  { id: '5', nama: 'Devin', jk: 'L', grup: 'Pra-paud', lomba: '', rt: '', no: '' },
  { id: '6', nama: 'Ammar', jk: 'L', grup: 'Pra-paud', lomba: '', rt: '', no: '' },
  { id: '7', nama: 'Kikan', jk: 'P', grup: 'Pra-paud', lomba: '', rt: '', no: '' },
  { id: '8', nama: 'Ziva', jk: 'P', grup: 'Pra-paud', lomba: '', rt: '', no: '' },
  { id: '9', nama: 'Hanan', jk: 'P', grup: 'Pra-paud', lomba: '', rt: '', no: '' },
  { id: '10', nama: 'Shafa', jk: 'P', grup: 'Pra-paud', lomba: '', rt: '', no: '' },
  { id: '11', nama: 'Nanas', jk: 'P', grup: 'Pra-paud', lomba: '', rt: '', no: '' },
  { id: '12', nama: 'Dayyan', jk: 'L', grup: 'Pra-paud', lomba: '', rt: '', no: '' },
  { id: '13', nama: 'Cucu Bu Ugi', jk: 'P', grup: 'Pra-paud', lomba: '', rt: '', no: '' },
  { id: '14', nama: 'Ziara', jk: 'P', grup: 'PAUD', lomba: '', rt: '', no: '' },
  { id: '15', nama: 'Olet', jk: 'P', grup: 'PAUD', lomba: '', rt: '', no: '' },
  { id: '16', nama: 'Anes', jk: 'P', grup: 'Kelas A', lomba: '', rt: '', no: '' },
  { id: '17', nama: 'Yuna', jk: 'P', grup: 'Kelas A', lomba: '', rt: '', no: '' },
  { id: '18', nama: 'Zea', jk: 'P', grup: 'Kelas A', lomba: '', rt: '', no: '' },
  { id: '19', nama: 'Aura', jk: 'P', grup: 'Kelas A', lomba: '', rt: '', no: '' },
  { id: '20', nama: 'Hulya', jk: 'P', grup: 'Kelas A', lomba: '', rt: '', no: '' },
  { id: '21', nama: 'Arsyad', jk: 'L', grup: 'Kelas A', lomba: '', rt: '', no: '' },
  { id: '22', nama: 'Alva', jk: 'L', grup: 'Kelas A', lomba: '', rt: '', no: '' },
  { id: '23', nama: 'Alula', jk: 'P', grup: 'Kelas B', lomba: '', rt: '', no: '' },
  { id: '24', nama: 'Khaila', jk: 'P', grup: 'Kelas B', lomba: '', rt: '', no: '' },
  { id: '25', nama: 'Fahri', jk: 'L', grup: 'Kelas B', lomba: '', rt: '', no: '' },
  { id: '26', nama: 'Kenzie', jk: 'L', grup: 'Kelas B', lomba: '', rt: '', no: '' },
  { id: '27', nama: 'Ial', jk: 'L', grup: 'Kelas B', lomba: '', rt: '', no: '' },
  { id: '28', nama: 'Haidar', jk: 'L', grup: 'Kelas B', lomba: '', rt: '', no: '' },
  { id: '29', nama: 'Cancan', jk: 'L', grup: 'Kelas B', lomba: '', rt: '', no: '' },
  { id: '30', nama: 'Aiko', jk: 'P', grup: 'Kelas C', lomba: '', rt: '', no: '' },
  { id: '31', nama: 'Tara', jk: 'P', grup: 'Kelas C', lomba: '', rt: '', no: '' },
  { id: '32', nama: 'Biyan', jk: 'L', grup: 'Kelas C', lomba: '', rt: '', no: '' },
  { id: '33', nama: 'Habil', jk: 'L', grup: 'Kelas C', lomba: '', rt: '', no: '' },
  { id: '34', nama: 'Gege', jk: 'P', grup: 'Kelas C', lomba: '', rt: '', no: '' },
  { id: '35', nama: 'Akbar', jk: 'L', grup: 'Kelas C', lomba: '', rt: '', no: '' },
  { id: '36', nama: 'Jibran', jk: 'L', grup: 'Kelas C', lomba: '', rt: '', no: '' },
  { id: '37', nama: 'Shifa', jk: 'P', grup: 'Pra-remaja', lomba: '', rt: '', no: '' },
  { id: '38', nama: 'Naya', jk: 'P', grup: 'Pra-remaja', lomba: '', rt: '', no: '' },
  { id: '39', nama: 'Kairen', jk: 'L', grup: 'Pra-remaja', lomba: '', rt: '', no: '' },
  { id: '40', nama: 'Audrey', jk: 'P', grup: 'Pra-remaja', lomba: '', rt: '', no: '' },
  { id: '41', nama: 'Refan', jk: 'L', grup: 'Pra-remaja', lomba: '', rt: '', no: '' },
  { id: '42', nama: 'Rafif', jk: 'L', grup: 'Pra-remaja', lomba: '', rt: '', no: '' },
];

const fs = (n) => Math.round(n * 1.18);

const LS_PREFIX = 'agustus_';

const loadLS = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(LS_PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const saveLS = (key, value) => {
  try {
    window.localStorage.setItem(LS_PREFIX + key, JSON.stringify(value));
  } catch {}
};

const usePersistedState = (key, initial) => {
  const [state, setState] = useState(() => loadLS(key, typeof initial === 'function' ? initial() : initial));
  useEffect(() => saveLS(key, state), [key, state]);
  return [state, setState];
};

const s = {
  container: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: COLORS.cream },
  header: { background: `linear-gradient(135deg, ${COLORS.red} 0%, ${COLORS.darkRed} 60%, #8B0000 100%)`, paddingTop: 50, paddingBottom: 30, textAlign: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, boxShadow: '0 4px 20px rgba(204,0,0,0.3)', position: 'relative' },
  headerTitle: { fontSize: fs(34), fontWeight: 'bold', color: COLORS.white, letterSpacing: 4, textShadow: '0 2px 8px rgba(0,0,0,0.3)' },
  headerSub: { fontSize: fs(14), color: 'rgba(255,255,255,0.9)', marginTop: 6, letterSpacing: 3 },
  headerYear: { fontSize: fs(18), fontWeight: 'bold', color: COLORS.gold, marginTop: 12, letterSpacing: 3 },
  card: { background: COLORS.white, borderRadius: 16, padding: 20, margin: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  sectionTitle: { fontSize: fs(24), fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 15, padding: '0 16px' },
  badge: (color) => ({ background: color, color: COLORS.white, padding: '4px 10px', borderRadius: 12, fontSize: fs(12), fontWeight: 'bold' }),
  tab: { flex: 1, textAlign: 'center', padding: '8px 0', cursor: 'pointer', border: 'none', background: 'none', color: COLORS.white, fontSize: fs(11), fontWeight: 'bold' },
  tabActive: { color: COLORS.gold },
};

const downloadExcel = (filename, sheetRows) => {
  const wb = XLSX.utils.book_new();
  sheetRows.forEach(({ name, rows, cols }) => {
    const ws = XLSX.utils.aoa_to_sheet(rows);
    if (cols) ws['!cols'] = cols;
    XLSX.utils.book_append_sheet(wb, ws, name);
  });
  XLSX.writeFile(wb, filename);
};

const downloadPdf = (filename, title, subtitle, columns, rows, footRows, extra) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.setTextColor(204, 0, 0);
  doc.text(title, 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  doc.text(subtitle, 14, 25);
  autoTable(doc, {
    startY: 31,
    head: [columns],
    body: rows,
    foot: footRows && footRows.length ? [footRows] : undefined,
    headStyles: { fillColor: [204, 0, 0], fontSize: fs(9) },
    footStyles: { fillColor: [51, 51, 51], fontSize: fs(9) },
    styles: { fontSize: fs(9), cellPadding: 2.5 },
    margin: { left: 14, right: 14 },
    ...extra,
  });
  doc.save(filename);
};

function HomeScreen({ onNavigate }) {
  const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const t = new Date('2026-08-17T00:00:00');
    const iv = setInterval(() => {
      const diff = t - new Date();
      if (diff > 0) {
        setCd({
          d: Math.floor(diff / 86400000),
          h: Math.floor((diff % 86400000) / 3600000),
          m: Math.floor((diff % 3600000) / 60000),
          s: Math.floor((diff % 60000) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const menuItems = [
    { title: 'Lomba', key: 'lomba', icon: '🏆', desc: 'Daftar lomba 17 Agustus' },
    { title: 'Peserta', key: 'peserta', icon: '👤', desc: 'Data peserta lomba' },
    { title: 'Penilaian', key: 'penilaian', icon: '📋', desc: 'Beri penilaian & skor peserta' },
    { title: 'Hadiah', key: 'hadiah', icon: '🎁', desc: 'Hadiah untuk juara 1, 2, & 3' },
    { title: 'Keuangan', key: 'keuangan', icon: '💰', desc: 'Data iuran & keuangan warga' },
    { title: 'Juara', key: 'juara', icon: '🥇', desc: 'Hasil penilaian & perankingan' },
  ];

  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={s.header}>
        <div style={{ fontSize: fs(60), marginBottom: 6, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.35))' }}>🇮🇩</div>
        <div style={s.headerTitle}>DIRGAHAYU RI</div>
        <div style={s.headerSub}>REPUBLIK INDONESIA</div>
        <div style={s.headerYear}>17 AGUSTUS 2026</div>
      </div>

      <div style={{ margin: 16, marginBottom: 4 }}>
        <div style={{ background: `linear-gradient(135deg, ${COLORS.white}, #FFF3E0)`, borderRadius: 20, padding: 20, boxShadow: '0 6px 24px rgba(204,0,0,0.12)', border: '1px solid rgba(204,0,0,0.12)' }}>
          <div style={{ textAlign: 'center', fontSize: fs(13), color: COLORS.gray, letterSpacing: 1 }}>HITUNG MUNDUR MENUJU</div>
          <div style={{ textAlign: 'center', fontSize: fs(24), fontWeight: 'bold', color: COLORS.red, margin: '6px 0 16px' }}>🎊 HARI KEMERDEKAAN 🎊</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {[['Hari', cd.d], ['Jam', cd.h], ['Menit', cd.m], ['Detik', cd.s]].map(([l, v]) => (
              <div key={l} style={{ textAlign: 'center', background: `linear-gradient(135deg, ${COLORS.red}, ${COLORS.darkRed})`, borderRadius: 14, padding: '14px 6px', boxShadow: '0 4px 12px rgba(204,0,0,0.35)' }}>
                <div style={{ fontSize: fs(30), fontWeight: 'bold', color: COLORS.white, lineHeight: 1.1 }}>{String(v).padStart(2, '0')}</div>
                <div style={{ fontSize: fs(11), color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        <div style={s.sectionTitle}>Menu Utama</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {menuItems.map((item) => (
            <div key={item.key} onClick={() => onNavigate(item.key)} style={{ display: 'flex', alignItems: 'center', background: COLORS.white, borderRadius: 16, padding: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer', transition: 'transform 0.15s ease, box-shadow 0.15s ease', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${COLORS.red}, ${COLORS.darkRed})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(24), flexShrink: 0, boxShadow: '0 3px 8px rgba(204,0,0,0.3)' }}>{item.icon}</div>
              <div style={{ flex: 1, marginLeft: 12, minWidth: 0 }}>
                <div style={{ fontSize: fs(15), fontWeight: 'bold', color: COLORS.darkGray }}>{item.title}</div>
                <div style={{ fontSize: fs(11), color: COLORS.gray, marginTop: 2, lineHeight: 1.3 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: 30, marginTop: 10 }}>
        <div style={{ fontSize: fs(14), color: COLORS.gray }}>Merah Putih tetap berkibar!</div>
        <div style={{ fontSize: fs(40), marginTop: 10 }}>🎖️</div>
      </div>
    </div>
  );
}

const EMOJI_OPTIONS = ['🏃','🧗','🍘','🥄','🪢','🩴','⚽','🏐','🎯','🎪','🎮','🎤','🎨','🧩','♟️','🏅','🎲','🤸'];

function LombaScreen() {
  const [jadwal, setJadwal] = usePersistedState('jadwal', JADWAL_LINTAS);
  const [selected, setSelected] = useState(null);
  const [filterKategori, setFilterKategori] = useState('Semua');
  const [showEdit, setShowEdit] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({});
  const [now, setNow] = useState(new Date());
  const [sw, setSw] = usePersistedState('sw', {});

  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setSw(prev => {
        const runningIds = Object.entries(prev).filter(([, v]) => v && v.running);
        if (runningIds.length === 0) return prev;
        const next = {};
        Object.entries(prev).forEach(([id, v]) => {
          next[id] = v.running ? { ...v, elapsed: v.elapsed + 1 } : v;
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [setSw]);

  const startSw = (id) => {
    setSw(prev => ({ ...prev, [id]: { running: true, elapsed: 0, records: prev[id]?.records || [] } }));
  };

  const stopSw = (id) => {
    setSw(prev => {
      const cur = prev[id] || { running: false, elapsed: 0, records: [] };
      if (!cur.running) return prev;
      return { ...prev, [id]: { running: false, elapsed: 0, records: [...cur.records, cur.elapsed] } };
    });
  };

  const resetSw = (id) => {
    setSw(prev => ({ ...prev, [id]: { running: false, elapsed: 0, records: [] } }));
  };

  const getSw = (id) => sw[id] || { running: false, elapsed: 0, records: [] };

  const swLast = (id) => {
    const records = getSw(id).records;
    return records.length ? fmtSw(records[records.length - 1]) : null;
  };

  const swTotal = (id) => fmtSw(getSw(id).records.reduce((a, b) => a + b, 0));

  const fmtSw = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const parseWaktu = (waktuStr) => {
    const parts = waktuStr.split(' - ');
    const parseTime = (t) => {
      if (!t || t.toLowerCase() === 'selesai') return null;
      const cleaned = t.replace('.', ':').trim();
      const [h, m] = cleaned.split(':').map(Number);
      return h * 60 + m;
    };
    return { start: parseTime(parts[0]), end: parts[1] ? parseTime(parts[1]) : null };
  };

  const getStatus = (item) => {
    if (!item.waktu) return 'akan_datang';
    const { start, end } = parseWaktu(item.waktu);
    const nowMin = now.getHours() * 60 + now.getMinutes();
    if (start === null) return 'akan_datang';
    if (nowMin < start) return 'akan_datang';
    if (end !== null && nowMin >= end) return 'selesai';
    if (nowMin >= start) return 'sedang_berlangsung';
    return 'akan_datang';
  };

  const getTimeLeft = (item) => {
    const { end } = parseWaktu(item.waktu);
    if (!end) return null;
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const nowSec = now.getSeconds();
    const totalNow = nowMin * 60 + nowSec;
    const totalEnd = end * 60;
    return totalEnd - totalNow;
  };

  const fmtCountdown = (secs) => {
    if (secs === null || secs === undefined) return '';
    const negative = secs < 0;
    const abs = Math.abs(secs);
    const m = Math.floor(abs / 60);
    const s = abs % 60;
    return negative ? `-${m}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`;
  };

  const statusColor = (status) => {
    switch (status) {
      case 'sedang_berlangsung': return COLORS.green;
      case 'selesai': return COLORS.gray;
      default: return COLORS.orange;
    }
  };

  const statusLabel = (status) => {
    switch (status) {
      case 'sedang_berlangsung': return '🔴 Sedang Berlangsung';
      case 'selesai': return '✅ Selesai';
      default: return '⏳ Akan Datang';
    }
  };

  const currentIdx = jadwal.findIndex(j => getStatus(j) === 'sedang_berlangsung');
  const nextIdx = currentIdx === -1 ? jadwal.findIndex(j => getStatus(j) === 'akan_datang') : -1;

  const semuaKategori = [...new Set(JADWAL_LINTAS.map(j => j.kategori))];

  const filtered = filterKategori === 'Semua' ? jadwal : jadwal.filter(j => j.kategori === filterKategori);
  const runningItems = jadwal.filter(j => getSw(j.id).running);

  const tipeColor = (tipe) => {
    switch (tipe) {
      case 'upacara': return '#D32F2F';
      case 'lomba': return COLORS.red;
      case 'persiapan': return COLORS.orange;
      case 'istirahat': return COLORS.green;
      case 'foto': return COLORS.blue;
      case 'penutup': return COLORS.gold;
      default: return COLORS.gray;
    }
  };

  const tipeBg = (tipe) => {
    switch (tipe) {
      case 'upacara': return '#FFEBEE';
      case 'lomba': return '#FFF3E0';
      case 'persiapan': return '#FFF8E1';
      case 'istirahat': return '#E8F5E9';
      case 'foto': return '#E3F2FD';
      case 'penutup': return '#FFFDE7';
      default: return COLORS.lightGray;
    }
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ nama: item.nama, waktu: item.waktu, kategori: item.kategori, icon: item.icon, tipe: item.tipe });
    setShowEdit(true);
  };

  const handleSaveEdit = () => {
    if (!form.nama || !form.waktu) { alert('Harap isi semua field!'); return; }
    setJadwal(prev => prev.map(j => j.id === editItem.id ? { ...j, ...form } : j));
    setShowEdit(false);
  };

  const handleDeleteItem = (id) => {
    if (confirm('Yakin hapus jadwal ini?')) {
      setJadwal(prev => prev.filter(j => j.id !== id));
      setSelected(null);
    }
  };

  const inputSt = { width: '100%', border: `1px solid ${COLORS.lightGray}`, borderRadius: 12, padding: 12, fontSize: fs(14), marginBottom: 12, background: COLORS.lightGray, color: COLORS.darkGray, outline: 'none' };

  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ ...s.header, paddingBottom: 20 }}>
        <div style={{ fontSize: fs(40), marginBottom: 5 }}>📋</div>
        <div style={s.headerTitle}>Running Order</div>
        <div style={{ fontSize: fs(14), color: COLORS.gold, marginTop: 4 }}>17 Agustus 2026</div>
      </div>

      <div style={{ padding: '12px 16px 5px' }}>
        <div style={{ fontSize: fs(13), fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 6 }}>Filter Kategori:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['Semua', ...semuaKategori].map(k => (
            <button key={k} onClick={() => setFilterKategori(k)} style={{
              display: 'flex', alignItems: 'center', padding: '6px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: fs(11),
              background: filterKategori === k ? COLORS.red : COLORS.white,
              color: filterKategori === k ? COLORS.white : COLORS.darkGray,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>{k}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        <div style={{ textAlign: 'center', padding: '12px 0 4px', fontSize: fs(24), fontWeight: 'bold', color: COLORS.red, fontVariantNumeric: 'tabular-nums' }}>
          {now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        <div style={{ textAlign: 'center', fontSize: fs(11), color: COLORS.gray, marginBottom: 8 }}>WIB • {now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>

        {currentIdx !== -1 && (
          <div style={{ background: getTimeLeft(jadwal[currentIdx]) < 0 ? 'linear-gradient(135deg, #FFEBEE, #FFCDD2)' : 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', borderRadius: 12, padding: 14, marginBottom: 12, border: `2px solid ${getTimeLeft(jadwal[currentIdx]) < 0 ? '#DC3545' : COLORS.green}`, textAlign: 'center' }}>
            <div style={{ fontSize: fs(11), fontWeight: 'bold', color: getTimeLeft(jadwal[currentIdx]) < 0 ? '#DC3545' : COLORS.green, marginBottom: 4 }}>{getTimeLeft(jadwal[currentIdx]) < 0 ? '⚠️ LEBUR WAKTU' : '🔴 SISA WAKTU'}</div>
            <div style={{ fontSize: fs(36), fontWeight: 'bold', color: getTimeLeft(jadwal[currentIdx]) < 0 ? '#DC3545' : COLORS.darkGray, fontVariantNumeric: 'tabular-nums' }}>{fmtCountdown(getTimeLeft(jadwal[currentIdx]))}</div>
            <div style={{ fontSize: fs(12), color: COLORS.gray }}>{jadwal[currentIdx].icon} {jadwal[currentIdx].nama} • {jadwal[currentIdx].kategori}</div>
          </div>
        )}

        {runningItems.length > 0 && (
          <div style={{ background: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)', borderRadius: 12, padding: 12, marginBottom: 12, border: `2px solid ${COLORS.orange}` }}>
            <div style={{ fontSize: fs(11), fontWeight: 'bold', color: COLORS.orange, marginBottom: 6, textAlign: 'center' }}>⏱️ {runningItems.length} STOPWATCH BERJALAN</div>
            {runningItems.map(j => {
              const ss = getSw(j.id);
              return (
                <div key={j.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', background: COLORS.white, borderRadius: 8, marginBottom: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  <div style={{ fontSize: fs(12), fontWeight: 'bold', color: COLORS.darkGray }}>{j.icon} {j.nama}</div>
                  <div style={{ fontSize: fs(18), fontWeight: 'bold', color: COLORS.orange, fontVariantNumeric: 'tabular-nums' }}>{fmtSw(ss.elapsed)}</div>
                </div>
              );
            })}
          </div>
        )}
        {filtered.map((item, idx) => {
          const status = getStatus(item);
          const isCurrent = status === 'sedang_berlangsung';
          const ss = getSw(item.id);
          return (
          <div key={item.id} onClick={() => setSelected(item)} style={{ display: 'flex', marginBottom: 2, cursor: 'pointer' }}>
            <div style={{ width: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ width: isCurrent ? 16 : 12, height: isCurrent ? 16 : 12, borderRadius: 8, background: statusColor(status), border: '2px solid white', boxShadow: `0 0 0 2px ${statusColor(status)}`, zIndex: 1, transition: 'all 0.3s' }} />
              {idx < filtered.length - 1 && <div style={{ flex: 1, width: 2, background: '#ddd', minHeight: 20 }} />}
            </div>
            <div style={{ flex: 1, background: isCurrent ? '#E8F5E9' : status === 'selesai' ? '#F5F5F5' : tipeBg(item.tipe), borderRadius: 12, padding: '12px 14px', marginBottom: 8, border: isCurrent ? `2px solid ${COLORS.green}` : 'none', transition: 'all 0.3s' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: fs(22) }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: fs(11), fontWeight: 'bold', color: tipeColor(item.tipe), letterSpacing: 0.5 }}>{item.waktu}</div>
                    <div style={{ fontSize: fs(14), fontWeight: 'bold', color: status === 'selesai' ? COLORS.gray : COLORS.darkGray }}>{item.nama}</div>
                    <div style={{ fontSize: fs(10), color: statusColor(status), fontWeight: 'bold', marginTop: 2 }}>{statusLabel(status)}</div>
                  </div>
                </div>
                <span style={{ ...s.badge(tipeColor(item.tipe)), fontSize: fs(10), padding: '2px 8px' }}>{item.kategori}</span>
              </div>
              {isCurrent && getTimeLeft(item) !== null && (
                <div style={{ marginTop: 6, fontSize: fs(12), fontWeight: 'bold', color: getTimeLeft(item) < 0 ? '#DC3545' : statusColor('sedang_berlangsung'), fontVariantNumeric: 'tabular-nums' }}>
                  {getTimeLeft(item) < 0 ? '⚠️ Lebih ' : 'Sisa: '}{fmtCountdown(getTimeLeft(item))}
                </div>
              )}
              <div onClick={(e) => e.stopPropagation()} style={{ marginTop: 10, padding: '8px 10px', borderRadius: 10, background: ss.running ? '#FFF8E1' : COLORS.white, border: ss.running ? `2px solid ${COLORS.orange}` : '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: fs(14), fontWeight: 'bold', color: ss.running ? COLORS.orange : COLORS.darkGray, fontVariantNumeric: 'tabular-nums' }}>
                    ⏱️ {ss.running ? fmtSw(ss.elapsed) : (ss.records.length ? `Sesi lalu: ${swLast(item.id)}` : 'Stopwatch')}
                  </div>
                  {ss.records.length > 0 && (
                    <div style={{ fontSize: fs(10), color: COLORS.gray, marginTop: 2 }}>Total {ss.records.length} sesi: {swTotal(item.id)}</div>
                  )}
                </div>
                {!ss.running ? (
                  <button onClick={() => startSw(item.id)} style={{ padding: '6px 14px', borderRadius: 8, background: COLORS.orange, color: COLORS.white, fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: fs(11), flexShrink: 0 }}>▶ Mulai</button>
                ) : (
                  <>
                    <button onClick={() => stopSw(item.id)} style={{ padding: '6px 14px', borderRadius: 8, background: COLORS.green, color: COLORS.white, fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: fs(11), flexShrink: 0 }}>⏹ Stop</button>
                    <button onClick={() => resetSw(item.id)} style={{ padding: '6px 12px', borderRadius: 8, background: COLORS.lightGray, color: COLORS.darkGray, fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: fs(11), flexShrink: 0 }}>↩ Reset</button>
                  </>
                )}
              </div>
            </div>
          </div>
          );
        })}
      </div>

      <button onClick={() => { setForm({ nama: '', waktu: '', kategori: 'Umum', icon: '🏃', tipe: 'lomba' }); setEditItem(null); setShowEdit(true); }} style={{ position: 'fixed', right: 24, bottom: 24, width: 60, height: 60, borderRadius: 30, background: COLORS.red, color: COLORS.white, fontSize: fs(30), fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 100 }}>+</button>

      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: 16, padding: 25, width: '85%', maxWidth: 400, textAlign: 'center' }}>
            <div style={{ fontSize: fs(50), marginBottom: 10 }}>{selected.icon}</div>
            <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 20, background: tipeColor(selected.tipe), color: COLORS.white, fontSize: fs(11), fontWeight: 'bold', marginBottom: 10 }}>{selected.tipe.toUpperCase()}</div>
            <div style={{ fontSize: fs(22), fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 5 }}>{selected.nama}</div>
            <div style={{ fontSize: fs(16), color: tipeColor(selected.tipe), fontWeight: 'bold', marginBottom: 5 }}>{selected.waktu}</div>
            <div style={{ fontSize: fs(13), color: statusColor(getStatus(selected)), fontWeight: 'bold', marginBottom: 15 }}>{statusLabel(getStatus(selected))}</div>
            <div style={{ background: tipeBg(selected.tipe), borderRadius: 12, padding: 15, marginBottom: 20, textAlign: 'left' }}>
              <div style={{ marginBottom: 8, fontSize: fs(14), color: COLORS.darkGray }}>📌 Kategori: <strong>{selected.kategori}</strong></div>
              {selected.durasi && <div style={{ fontSize: fs(14), color: COLORS.darkGray }}>⏱️ Durasi: <strong>{selected.durasi} menit</strong></div>}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setSelected(null); openEdit(selected); }} style={{ flex: 1, padding: 12, borderRadius: 12, background: COLORS.blue, color: COLORS.white, fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: fs(13) }}>Edit</button>
              <button onClick={() => handleDeleteItem(selected.id)} style={{ flex: 1, padding: 12, borderRadius: 12, background: '#DC3545', color: COLORS.white, fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: fs(13) }}>Hapus</button>
              <button onClick={() => setSelected(null)} style={{ flex: 1, padding: 12, borderRadius: 12, background: COLORS.gray, color: COLORS.white, fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: fs(13) }}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {showEdit && (
        <div onClick={() => setShowEdit(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: 16, padding: 25, width: '85%', maxWidth: 400, maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ fontSize: fs(22), fontWeight: 'bold', color: COLORS.darkGray, textAlign: 'center', marginBottom: 20 }}>{editItem ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}</div>

            <div style={{ fontSize: fs(14), fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 8 }}>Icon:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {EMOJI_OPTIONS.map(em => (
                <div key={em} onClick={() => setForm({...form, icon: em})} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, fontSize: fs(20), cursor: 'pointer', border: form.icon === em ? `2px solid ${COLORS.red}` : '2px solid transparent', background: form.icon === em ? '#FFE5E5' : COLORS.lightGray }}>{em}</div>
              ))}
            </div>

            <input value={form.nama || ''} onChange={e => setForm({...form, nama: e.target.value})} placeholder="Nama Kegiatan" style={inputSt} />
            <input value={form.waktu || ''} onChange={e => setForm({...form, waktu: e.target.value})} placeholder="Waktu (contoh: 08.00 - 08.20)" style={inputSt} />

            <div style={{ fontSize: fs(14), fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 8 }}>Tipe:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {[{n:'upacara',l:'Upacara'},{n:'lomba',l:'Lomba'},{n:'persiapan',l:'Persiapan'},{n:'istirahat',l:'Istirahat'},{n:'foto',l:'Foto'},{n:'penutup',l:'Penutup'}].map(t => (
                <button key={t.n} onClick={() => setForm({...form, tipe: t.n})} style={{ padding: '6px 12px', borderRadius: 20, border: form.tipe === t.n ? `2px solid ${tipeColor(t.n)}` : '2px solid transparent', cursor: 'pointer', fontSize: fs(12), background: form.tipe === t.n ? tipeBg(t.n) : COLORS.lightGray, color: COLORS.darkGray, fontWeight: form.tipe === t.n ? 'bold' : 'normal' }}>{t.l}</button>
              ))}
            </div>

            <div style={{ fontSize: fs(14), fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 8 }}>Kategori Peserta:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
              {semuaKategori.map(k => (
                <button key={k} onClick={() => setForm({...form, kategori: k})} style={{ padding: '6px 12px', borderRadius: 20, border: form.kategori === k ? `2px solid ${COLORS.red}` : '2px solid transparent', cursor: 'pointer', fontSize: fs(12), background: form.kategori === k ? '#FFE5E5' : COLORS.lightGray, color: COLORS.darkGray }}>{k}</button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowEdit(false)} style={{ flex: 1, padding: 12, borderRadius: 12, background: COLORS.lightGray, color: COLORS.darkGray, fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Batal</button>
              <button onClick={handleSaveEdit} style={{ flex: 1, padding: 12, borderRadius: 12, background: COLORS.green, color: COLORS.white, fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PesertaScreen() {
  const [pesertaList, setPesertaList] = usePersistedState('peserta', PESERTA_LIST);
  const [search, setSearch] = useState('');
  const [filterJk, setFilterJk] = useState('Semua');
  const [filterGrup, setFilterGrup] = useState('Semua');
  const [filterKategori, setFilterKategori] = useState('Semua');
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newP, setNewP] = useState({ nama: '', jk: 'L', grup: 'Pra-paud' });
  const [showEditP, setShowEditP] = useState(false);
  const [editP, setEditP] = useState({ id: '', nama: '', jk: 'L', grup: 'Pra-paud' });

  const filtered = pesertaList.filter(p => {
    const matchSearch = p.nama.toLowerCase().includes(search.toLowerCase());
    const matchJk = filterJk === 'Semua' || p.jk === filterJk;
    const matchGrup = filterGrup === 'Semua' || p.grup === filterGrup;
    const matchK = filterKategori === 'Semua' || p.grup === filterKategori;
    return matchSearch && matchJk && matchGrup && matchK;
  });

  const grupColor = (g) => GRUP_KATEGORI.find(gr => gr.nama === g)?.color || COLORS.gray;
  const kategoriColor = (k) => KATEGORI_PESERTA.find(p => p.nama === k)?.color || COLORS.gray;

  const handleSave = () => {
    if (newP.nama) {
      const newPeserta = { id: Date.now().toString(), nama: newP.nama, jk: newP.jk, grup: newP.grup, lomba: '', rt: '', no: '' };
      setPesertaList(prev => [...prev, newPeserta]);
      alert('Peserta berhasil ditambahkan!');
      setShowAdd(false);
      setNewP({ nama: '', jk: 'L', grup: 'Pra-paud' });
    } else {
      alert('Harap isi semua field');
    }
  };

  const openEdit = (p) => {
    setEditP({ id: p.id, nama: p.nama, jk: p.jk, grup: p.grup });
    setShowEditP(true);
  };

  const handleSaveEdit = () => {
    if (!editP.nama) { alert('Nama tidak boleh kosong'); return; }
    setPesertaList(prev => prev.map(p => p.id === editP.id ? { ...p, nama: editP.nama, jk: editP.jk, grup: editP.grup } : p));
    setShowEditP(false);
    setSelected(null);
    alert('Peserta berhasil diperbarui!');
  };

  const handleDelete = (id) => {
    if (confirm('Yakin hapus peserta ini?')) {
      setPesertaList(prev => prev.filter(p => p.id !== id));
      setShowEditP(false);
      setSelected(null);
      alert('Peserta dihapus');
    }
  };

  const inputSt = { width: '100%', border: `1px solid ${COLORS.lightGray}`, borderRadius: 12, padding: 12, fontSize: fs(14), marginBottom: 12, background: COLORS.lightGray, color: COLORS.darkGray, outline: 'none' };

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ ...s.header, paddingBottom: 20 }}>
        <div style={s.headerTitle}>Peserta Lomba</div>
        <div style={{ fontSize: fs(14), color: COLORS.gold, marginTop: 4 }}>{PESERTA_LIST.length} Peserta Terdaftar</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', background: COLORS.white, borderRadius: 12, margin: 16, padding: '0 15px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <span style={{ fontSize: fs(18), marginRight: 10 }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari peserta..." style={{ flex: 1, border: 'none', padding: '14px 0', fontSize: fs(14), outline: 'none', background: 'transparent', color: COLORS.darkGray }} />
      </div>

      <div style={{ padding: '0 16px 10px' }}>
        <div style={{ fontSize: fs(13), fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 6 }}>Jenis Kelamin:</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[{ key: 'Semua', label: 'Semua', icon: '👥' }, { key: 'L', label: 'Laki-laki', icon: '👦' }, { key: 'P', label: 'Perempuan', icon: '👧' }].map(g => (
            <button key={g.key} onClick={() => setFilterJk(g.key)} style={{
              display: 'flex', alignItems: 'center', padding: '6px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: fs(12),
              background: filterJk === g.key ? COLORS.blue : COLORS.white,
              color: filterJk === g.key ? COLORS.white : COLORS.darkGray,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              <span style={{ marginRight: 4 }}>{g.icon}</span>{g.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 16px 5px' }}>
        <div style={{ fontSize: fs(13), fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 6 }}>Grup Usia:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['Semua', ...GRUP_KATEGORI.map(g => g.nama)].map(g => (
            <button key={g} onClick={() => setFilterGrup(g)} style={{
              display: 'flex', alignItems: 'center', padding: '6px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: fs(12),
              background: filterGrup === g ? COLORS.red : COLORS.white,
              color: filterGrup === g ? COLORS.white : COLORS.darkGray,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              {g !== 'Semua' && <span style={{ marginRight: 4 }}>{GRUP_KATEGORI.find(gr => gr.nama === g)?.icon}</span>}
              {g}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '8px 16px 10px' }}>
        <div style={{ fontSize: fs(13), fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 6 }}>Kategori:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['Semua', ...KATEGORI_PESERTA.map(k => k.nama)].map(k => (
            <button key={k} onClick={() => setFilterKategori(k)} style={{
              display: 'flex', alignItems: 'center', padding: '6px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: fs(12),
              background: filterKategori === k ? COLORS.blue : COLORS.white,
              color: filterKategori === k ? COLORS.white : COLORS.darkGray,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              {k !== 'Semua' && <span style={{ marginRight: 4 }}>{KATEGORI_PESERTA.find(p => p.nama === k)?.icon}</span>}
              {k}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        <div style={{ fontSize: fs(12), color: COLORS.gray, marginBottom: 8 }}>Menampilkan {filtered.length} peserta</div>
        {filtered.map(p => (
          <div key={p.id} onClick={() => setSelected(p)} style={{ display: 'flex', alignItems: 'center', background: COLORS.white, borderRadius: 12, padding: 14, marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
            <div style={{ width: 45, height: 45, borderRadius: 25, background: grupColor(p.grup), display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, fontSize: fs(20), fontWeight: 'bold', color: COLORS.white }}>{p.nama.charAt(0)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: fs(14), fontWeight: 'bold', color: COLORS.darkGray }}>{p.nama}</div>
              <div style={{ fontSize: fs(11), color: COLORS.gray, marginTop: 3 }}>{p.grup} • {p.jk === 'L' ? '👦 Laki-laki' : '👧 Perempuan'}</div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <span style={{ ...s.badge(p.jk === 'L' ? '#4A90D9' : '#E91E63'), padding: '2px 8px', fontSize: fs(11) }}>{p.jk === 'L' ? '👦' : '👧'}</span>
              <span style={s.badge(grupColor(p.grup))}>{p.grup}</span>
            </div>
            <button onClick={(e) => { e.stopPropagation(); openEdit(p); }} style={{ marginLeft: 10, width: 34, height: 34, borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: fs(15), background: '#E3F2FD', color: '#4A90D9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✏️</button>
          </div>
        ))}
      </div>

      <button onClick={() => setShowAdd(true)} style={{ position: 'fixed', right: 24, bottom: 24, width: 60, height: 60, borderRadius: 30, background: COLORS.red, color: COLORS.white, fontSize: fs(30), fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 100 }}>+</button>

      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: 16, padding: 25, width: '85%', maxWidth: 400, textAlign: 'center' }}>
            <div style={{ width: 70, height: 70, borderRadius: 35, background: grupColor(selected.grup), display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: fs(32), fontWeight: 'bold', color: COLORS.white }}>{selected.nama.charAt(0)}</div>
            <div style={{ fontSize: fs(22), fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 5 }}>{selected.nama}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 15 }}>
              <span style={s.badge(grupColor(selected.grup))}>{selected.grup}</span>
            </div>
            <div style={{ background: COLORS.lightGray, borderRadius: 12, padding: 15, marginBottom: 20, textAlign: 'left' }}>
              <div style={{ fontSize: fs(14), color: COLORS.darkGray }}>👥 Grup: <strong>{selected.grup}</strong></div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { openEdit(selected); }} style={{ flex: 1, background: '#4A90D9', color: COLORS.white, padding: '12px 20px', borderRadius: 12, border: 'none', fontWeight: 'bold', fontSize: fs(14), cursor: 'pointer' }}>✏️ Edit</button>
              <button onClick={() => setSelected(null)} style={{ flex: 1, background: COLORS.red, color: COLORS.white, padding: '12px 20px', borderRadius: 12, border: 'none', fontWeight: 'bold', fontSize: fs(14), cursor: 'pointer' }}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {showAdd && (
        <div onClick={() => setShowAdd(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: 16, padding: 25, width: '85%', maxWidth: 400 }}>
            <div style={{ fontSize: fs(22), fontWeight: 'bold', color: COLORS.darkGray, textAlign: 'center', marginBottom: 20 }}>Tambah Peserta Baru</div>
            <input value={newP.nama} onChange={e => setNewP({...newP, nama: e.target.value})} placeholder="Nama Peserta" style={{ width: '100%', border: `1px solid ${COLORS.lightGray}`, borderRadius: 12, padding: 12, fontSize: fs(14), marginBottom: 12, background: COLORS.lightGray, color: COLORS.darkGray }} />
            <div style={{ fontSize: fs(14), fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 8 }}>Jenis Kelamin:</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {[{ key: 'L', label: '👦 Laki-laki' }, { key: 'P', label: '👧 Perempuan' }].map(g => (
                <button key={g.key} onClick={() => setNewP({...newP, jk: g.key})} style={{ flex: 1, padding: '10px', borderRadius: 12, border: newP.jk === g.key ? `2px solid ${COLORS.blue}` : '2px solid transparent', cursor: 'pointer', fontSize: fs(13), background: newP.jk === g.key ? '#E3F2FD' : COLORS.lightGray, fontWeight: newP.jk === g.key ? 'bold' : 'normal', color: COLORS.darkGray }}>{g.label}</button>
              ))}
            </div>
            <div style={{ fontSize: fs(14), fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 8 }}>Pilih Grup:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {GRUP_KATEGORI.map(k => (
                <button key={k.id} onClick={() => setNewP({...newP, grup: k.nama})} style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', borderRadius: 20, border: newP.grup === k.nama ? `2px solid ${COLORS.red}` : '2px solid transparent', cursor: 'pointer', fontSize: fs(12), background: newP.grup === k.nama ? '#FFE5E5' : COLORS.lightGray, color: newP.grup === k.nama ? COLORS.red : COLORS.darkGray }}>
                  <span style={{ marginRight: 6 }}>{k.icon}</span>{k.nama}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: 12, borderRadius: 12, background: COLORS.lightGray, color: COLORS.darkGray, fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Batal</button>
              <button onClick={handleSave} style={{ flex: 1, padding: 12, borderRadius: 12, background: COLORS.red, color: COLORS.white, fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {showEditP && (
        <div onClick={() => setShowEditP(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: 16, padding: 25, width: '85%', maxWidth: 400 }}>
            <div style={{ fontSize: fs(22), fontWeight: 'bold', color: COLORS.darkGray, textAlign: 'center', marginBottom: 20 }}>Edit Peserta</div>
            <input value={editP.nama} onChange={e => setEditP({...editP, nama: e.target.value})} placeholder="Nama Peserta" style={{ width: '100%', border: `1px solid ${COLORS.lightGray}`, borderRadius: 12, padding: 12, fontSize: fs(14), marginBottom: 12, background: COLORS.lightGray, color: COLORS.darkGray }} />
            <div style={{ fontSize: fs(14), fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 8 }}>Jenis Kelamin:</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {[{ key: 'L', label: '👦 Laki-laki' }, { key: 'P', label: '👧 Perempuan' }].map(g => (
                <button key={g.key} onClick={() => setEditP({...editP, jk: g.key})} style={{ flex: 1, padding: '10px', borderRadius: 12, border: editP.jk === g.key ? `2px solid ${COLORS.blue}` : '2px solid transparent', cursor: 'pointer', fontSize: fs(13), background: editP.jk === g.key ? '#E3F2FD' : COLORS.lightGray, fontWeight: editP.jk === g.key ? 'bold' : 'normal', color: COLORS.darkGray }}>{g.label}</button>
              ))}
            </div>
            <div style={{ fontSize: fs(14), fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 8 }}>Pilih Grup:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {GRUP_KATEGORI.map(k => (
                <button key={k.id} onClick={() => setEditP({...editP, grup: k.nama})} style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', borderRadius: 20, border: editP.grup === k.nama ? `2px solid ${COLORS.red}` : '2px solid transparent', cursor: 'pointer', fontSize: fs(12), background: editP.grup === k.nama ? '#FFE5E5' : COLORS.lightGray, color: editP.grup === k.nama ? COLORS.red : COLORS.darkGray }}>
                  <span style={{ marginRight: 6 }}>{k.icon}</span>{k.nama}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => handleDelete(editP.id)} style={{ flex: 1, padding: 12, borderRadius: 12, background: '#FFE5E5', color: COLORS.red, fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>🗑️ Hapus</button>
              <button onClick={() => setShowEditP(false)} style={{ flex: 1, padding: 12, borderRadius: 12, background: COLORS.lightGray, color: COLORS.darkGray, fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Batal</button>
              <button onClick={handleSaveEdit} style={{ flex: 1, padding: 12, borderRadius: 12, background: COLORS.green, color: COLORS.white, fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PenilaianScreen({ scores, setScores }) {
  const [selectedLomba, setSelectedLomba] = useState(null);
  const [scoreInputs, setScoreInputs] = useState({});

  const lombaList = JADWAL_LINTAS.filter(l => l.tipe === 'lomba');

  const getParticipants = (lomba) => {
    return PESERTA_LIST.filter(p => getPesertaKategori(lomba.kategori).includes(p.grup));
  };

  const handleScoreChange = (pesertaId, value) => {
    setScoreInputs(prev => ({ ...prev, [pesertaId]: value }));
  };

  const handleSaveScores = () => {
    const lombaKey = selectedLomba.id;
    const newScores = {};
    Object.entries(scoreInputs).forEach(([pesertaId, val]) => {
      if (val !== '' && !isNaN(Number(val))) {
        newScores[pesertaId] = Number(val);
      }
    });
    setScores(prev => ({ ...prev, [lombaKey]: { ...prev[lombaKey], ...newScores } }));
    alert('Penilaian berhasil disimpan!');
  };

  const getScore = (lombaId, pesertaId) => {
    return scores[lombaId]?.[pesertaId] ?? '';
  };

  const kategoriColor = (k) => {
    const found = KATEGORI_PESERTA.find(p => p.nama === k);
    return found ? found.color : COLORS.gray;
  };

  if (selectedLomba) {
    const participants = getParticipants(selectedLomba);
    return (
      <div style={{ paddingBottom: 20 }}>
        <div style={{ ...s.header, paddingBottom: 20 }}>
          <div onClick={() => { setSelectedLomba(null); setScoreInputs({}); }} style={{ position: 'absolute', left: 16, top: 50, fontSize: fs(28), color: COLORS.white, cursor: 'pointer' }}>←</div>
          <div style={{ fontSize: fs(40), marginBottom: 5 }}>{selectedLomba.icon}</div>
          <div style={s.headerTitle}>Penilaian</div>
          <div style={{ fontSize: fs(14), color: COLORS.gold, marginTop: 4 }}>{selectedLomba.nama} • {selectedLomba.kategori}</div>
        </div>

        <div style={{ padding: 16 }}>
          {participants.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: COLORS.gray }}>Belum ada peserta di kategori {selectedLomba.kategori}</div>
          ) : (
            <>
              {[['L', '👦 Laki-laki'], ['P', '👧 Perempuan']].map(([jk, label]) => {
                const group = participants.filter(p => p.jk === jk);
                if (group.length === 0) return null;
                return (
                  <div key={jk}>
                    <div style={{ fontSize: fs(15), fontWeight: 'bold', color: jk === 'L' ? '#4A90D9' : '#E91E63', marginBottom: 8, marginTop: 12, padding: '4px 8px', background: jk === 'L' ? '#E3F2FD' : '#FCE4EC', borderRadius: 8 }}>{label} ({group.length})</div>
                    {group.map((p, i) => (
                      <div key={p.id} style={{ display: 'flex', alignItems: 'center', background: COLORS.white, borderRadius: 12, padding: 14, marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 18, background: jk === 'L' ? '#4A90D9' : '#E91E63', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, fontSize: fs(14), fontWeight: 'bold', color: COLORS.white }}>{i + 1}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: fs(14), fontWeight: 'bold', color: COLORS.darkGray }}>{p.nama}</div>
                          <div style={{ fontSize: fs(11), color: COLORS.gray }}>{p.grup} • {p.jk === 'L' ? '👦' : '👧'}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0-100"
                            value={scoreInputs[p.id] !== undefined ? scoreInputs[p.id] : getScore(selectedLomba.id, p.id)}
                            onChange={(e) => handleScoreChange(p.id, e.target.value)}
                            style={{ width: 70, padding: '8px 6px', borderRadius: 8, border: `2px solid ${COLORS.lightGray}`, textAlign: 'center', fontSize: fs(16), fontWeight: 'bold', color: COLORS.darkGray, outline: 'none' }}
                          />
                          <span style={{ fontSize: fs(12), color: COLORS.gray }}>poin</span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </>
          )}
          {participants.length > 0 && (
            <button onClick={handleSaveScores} style={{ width: '100%', padding: 14, borderRadius: 12, background: COLORS.green, color: COLORS.white, fontWeight: 'bold', fontSize: fs(16), border: 'none', cursor: 'pointer', marginTop: 10 }}>Simpan Penilaian</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={s.header}>
        <div style={s.headerTitle}>Penilaian Lomba</div>
        <div style={{ fontSize: fs(14), color: COLORS.gold, marginTop: 4 }}>Pilih lomba untuk memberi penilaian</div>
      </div>

      <div style={{ padding: 16 }}>
        {lombaList.map(l => {
          const participants = getParticipants(l);
          const lScores = scores[l.id] || {};
          const scored = Object.keys(lScores).length;
          return (
            <div key={l.id} onClick={() => { setSelectedLomba(l); setScoreInputs({}); }} style={{ display: 'flex', alignItems: 'center', background: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
              <div style={{ width: 50, height: 50, borderRadius: 25, background: scored > 0 ? COLORS.green : COLORS.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(26), marginRight: 15 }}>{l.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: fs(16), fontWeight: 'bold', color: COLORS.darkGray }}>{l.nama}</div>
                <div style={{ fontSize: fs(12), color: COLORS.gray, marginTop: 2 }}>{l.kategori} • {participants.length} peserta • {scored > 0 ? `${scored}/${participants.length} dinilai` : 'Belum dinilai'}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {scored > 0 && <span style={s.badge(COLORS.green)}>✓</span>}
                <span style={{ fontSize: fs(24), color: COLORS.gray }}>›</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function JuaraScreen({ scores, hadiahMap, lombaHadiah }) {
  const [selectedLomba, setSelectedLomba] = useState(null);

  const lombaList = JADWAL_LINTAS.filter(l => l.tipe === 'lomba');

  const getParticipants = (lomba) => {
    return PESERTA_LIST.filter(p => getPesertaKategori(lomba.kategori).includes(p.grup));
  };

  const getRanking = (lomba) => {
    const participants = getParticipants(lomba);
    const lScores = scores[lomba.id] || {};
    return participants
      .map(p => ({ ...p, score: lScores[p.id] ?? null }))
      .sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
  };

  const overallRanking = () => {
    const playerScores = {};
    Object.entries(scores).forEach(([lombaId, lScores]) => {
      Object.entries(lScores).forEach(([pesertaId, score]) => {
        if (!playerScores[pesertaId]) playerScores[pesertaId] = { total: 0, count: 0, name: '', rt: '', kategori: '', jk: '' };
        playerScores[pesertaId].total += score;
        playerScores[pesertaId].count += 1;
        const peserta = PESERTA_LIST.find(p => p.id === pesertaId);
        if (peserta) {
          playerScores[pesertaId].name = peserta.nama;
          playerScores[pesertaId].rt = peserta.grup;
          playerScores[pesertaId].kategori = peserta.grup;
          playerScores[pesertaId].jk = peserta.jk;
        }
      });
    });
    return Object.entries(playerScores)
      .map(([id, data]) => ({ id, ...data, avg: data.total / data.count }))
      .sort((a, b) => b.avg - a.avg);
  };

  const kategoriColor = (k) => {
    const found = KATEGORI_PESERTA.find(p => p.nama === k);
    return found ? found.color : COLORS.gray;
  };

  const medalEmoji = (i) => ['🥇','🥈','🥉'][i] || `${i+1}.`;
  const medalColor = (i) => [COLORS.gold, '#C0C0C0', '#CD7F32'][i] || COLORS.gray;
  const jmlJuara = (lomba, jk) => getHadiahLomba(hadiahMap, lombaHadiah, lomba, jk).filter(h => h.hadiah).length;

  if (selectedLomba) {
    const ranking = getRanking(selectedLomba);
    const hasScores = ranking.some(r => r.score !== null);

    return (
      <div style={{ paddingBottom: 20 }}>
        <div style={{ ...s.header, paddingBottom: 20 }}>
          <div onClick={() => setSelectedLomba(null)} style={{ position: 'absolute', left: 16, top: 50, fontSize: fs(28), color: COLORS.white, cursor: 'pointer' }}>←</div>
          <div style={{ fontSize: fs(40), marginBottom: 5 }}>{selectedLomba.icon}</div>
          <div style={s.headerTitle}>Juara Lomba</div>
          <div style={{ fontSize: fs(14), color: COLORS.gold, marginTop: 4 }}>{selectedLomba.nama} • {selectedLomba.kategori}</div>
        </div>

        <div style={{ padding: 16 }}>
          {!hasScores ? (
            <div style={{ textAlign: 'center', padding: 50, color: COLORS.gray }}>
              <div style={{ fontSize: fs(50), marginBottom: 15 }}>📋</div>
              <div style={{ fontSize: fs(16), marginBottom: 5 }}>Belum ada penilaian</div>
              <div style={{ fontSize: fs(13) }}>Silakan beri penilaian di menu Penilaian terlebih dahulu</div>
            </div>
          ) : (
            [['L', '👦 Laki-laki'], ['P', '👧 Perempuan']].map(([jk, label]) => {
              const group = ranking.filter(r => r.score !== null && r.jk === jk);
              if (group.length === 0) return null;
              const jmlJ = jmlJuara(selectedLomba, jk);
              return (
                <div key={jk}>
                  <div style={{ fontSize: fs(15), fontWeight: 'bold', color: jk === 'L' ? '#4A90D9' : '#E91E63', marginBottom: 8, marginTop: 12, padding: '4px 8px', background: jk === 'L' ? '#E3F2FD' : '#FCE4EC', borderRadius: 8 }}>{label}</div>
                  {group.map((r, i) => (
                    <div key={r.id} style={{ background: i < jmlJ ? `linear-gradient(135deg, ${medalColor(i)}22, ${medalColor(i)}11)` : COLORS.white, borderRadius: 16, padding: 16, marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: i < jmlJ ? `2px solid ${medalColor(i)}55` : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: 45, height: 45, borderRadius: 25, background: i < jmlJ ? medalColor(i) : COLORS.gray, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 15, fontSize: i < jmlJ ? 22 : 16, fontWeight: 'bold', color: COLORS.white }}>{medalEmoji(i)}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: fs(16), fontWeight: 'bold', color: COLORS.darkGray }}>{r.nama}</div>
                          <div style={{ fontSize: fs(12), color: COLORS.gray, marginTop: 2 }}>{r.grup}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: fs(22), fontWeight: 'bold', color: COLORS.red }}>{r.score}</div>
                          <div style={{ fontSize: fs(11), color: COLORS.gray }}>poin</div>
                        </div>
                      </div>
                      {i < jmlJ && getHadiahLomba(hadiahMap, lombaHadiah, selectedLomba, jk)[i].hadiah && (
                        <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${medalColor(i)}33`, fontSize: fs(13), color: medalColor(i), fontWeight: 'bold', textAlign: 'center' }}>
                          {getHadiahLomba(hadiahMap, lombaHadiah, selectedLomba, jk)[i].icon} {getHadiahLomba(hadiahMap, lombaHadiah, selectedLomba, jk)[i].hadiah}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  const overall = overallRanking();
  const hasAnyScores = Object.keys(scores).length > 0;

  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ ...s.header, paddingBottom: 20 }}>
        <div style={{ fontSize: fs(50), marginBottom: 5 }}>🏆</div>
        <div style={s.headerTitle}>Daftar Juara</div>
        <div style={{ fontSize: fs(14), color: COLORS.gold, marginTop: 4 }}>Hasil penilaian seluruh lomba</div>
      </div>

      {hasAnyScores && (
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ fontSize: fs(18), fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 12 }}>🏅 Juara Umum (Rata-rata Poin)</div>
          {overall.length > 0 ? (
            [['L', '👦 Laki-laki'], ['P', '👧 Perempuan']].map(([jk, label]) => {
              const group = overall.filter(r => r.jk === jk).slice(0, 3);
              if (group.length === 0) return null;
              return (
                <div key={jk} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: fs(14), fontWeight: 'bold', color: jk === 'L' ? '#4A90D9' : '#E91E63', marginBottom: 8, padding: '4px 8px', background: jk === 'L' ? '#E3F2FD' : '#FCE4EC', borderRadius: 8 }}>{label}</div>
                  {group.map((r, i) => (
                    <div key={r.id} style={{ background: i < 3 ? `linear-gradient(135deg, ${medalColor(i)}22, ${medalColor(i)}11)` : COLORS.white, borderRadius: 16, padding: 14, marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: i < 3 ? `2px solid ${medalColor(i)}55` : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: 42, height: 42, borderRadius: 25, background: i < 3 ? medalColor(i) : COLORS.gray, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, fontSize: i < 3 ? 20 : 14, fontWeight: 'bold', color: COLORS.white }}>{medalEmoji(i)}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: fs(15), fontWeight: 'bold', color: COLORS.darkGray }}>{r.name}</div>
                          <div style={{ fontSize: fs(11), color: COLORS.gray }}>{r.rt} • {r.count} lomba</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: fs(18), fontWeight: 'bold', color: COLORS.red }}>{r.avg.toFixed(1)}</div>
                          <div style={{ fontSize: fs(11), color: COLORS.gray }}>rata-rata</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: 20, color: COLORS.gray }}>Belum ada data</div>
          )}
        </div>
      )}

      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ fontSize: fs(18), fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 12 }}>📋 Juara Per Lomba</div>
        {lombaList.map(l => {
          const participants = getParticipants(l);
          const ranking = getRanking(l).filter(r => r.score !== null);
          const hasData = ranking.length > 0;

          return (
            <div key={l.id} onClick={() => hasData && setSelectedLomba(l)} style={{ background: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: hasData ? 'pointer' : 'default', opacity: hasData ? 1 : 0.6 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: hasData ? 12 : 0 }}>
                <div style={{ fontSize: fs(32), marginRight: 12 }}>{l.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: fs(15), fontWeight: 'bold', color: COLORS.darkGray }}>{l.nama}</div>
                  <div style={{ fontSize: fs(12), color: COLORS.gray }}>{l.kategori} • {participants.length} peserta</div>
                </div>
                {hasData && <span style={{ fontSize: fs(24), color: COLORS.gray }}>›</span>}
              </div>
              {hasData && [['L', '👦'], ['P', '👧']].map(([jk, icon]) => {
                const jmlJ = jmlJuara(l, jk);
                const g = ranking.filter(r => r.jk === jk).slice(0, jmlJ || 3);
                if (g.length === 0) return null;
                return (
                  <div key={jk}>
                    <div style={{ fontSize: fs(12), fontWeight: 'bold', color: jk === 'L' ? '#4A90D9' : '#E91E63', marginTop: 6, marginBottom: 4 }}>{icon} {jk === 'L' ? 'Laki-laki' : 'Perempuan'}</div>
                    {g.map((r, i) => (
                      <div key={r.id} style={{ padding: '4px 0', borderTop: i > 0 ? `1px solid ${COLORS.lightGray}` : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ width: 28, textAlign: 'center', fontSize: fs(16) }}>{medalEmoji(i)}</span>
                          <span style={{ flex: 1, fontSize: fs(13), color: COLORS.darkGray, marginLeft: 6 }}>{r.nama}</span>
                          <span style={{ fontSize: fs(14), fontWeight: 'bold', color: COLORS.red }}>{r.score} poin</span>
                        </div>
                        <div style={{ marginTop: 2, marginLeft: 34, fontSize: fs(11), color: medalColor(i), fontWeight: 'bold' }}>
                          {getHadiahLomba(hadiahMap, lombaHadiah, l, jk)[i].icon} {getHadiahLomba(hadiahMap, lombaHadiah, l, jk)[i].hadiah}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}



function HadiahScreen({ hadiahMap, setHadiahMap, lombaHadiah, setLombaHadiah }) {
  const [selectedKat, setSelectedKat] = useState(null);
  const [selectedLomba, setSelectedLomba] = useState(null);
  const [selectedJk, setSelectedJk] = useState('L');
  const [editValues, setEditValues] = useState(['', '', '']);
  const [saving, setSaving] = useState(false);

  const hadiahColors = [COLORS.gold, '#C0C0C0', '#CD7F32'];

  const lombaList = JADWAL_LINTAS.filter(l => l.tipe === 'lomba');
  const kategoriLomba = [...new Set(lombaList.map(l => l.kategori))].filter(k => k !== 'Umum');

  const kategoriColor = (k) => {
    const grups = getPesertaKategori(k);
    for (let g of grups) {
      const found = KATEGORI_PESERTA.find(p => p.nama === g);
      if (found) return found.color;
    }
    return COLORS.gray;
  };

  useEffect(() => {
    if (selectedLomba) {
      const current = lombaHadiah[selectedLomba.id]?.[selectedJk] || getHadiah(hadiahMap, keyKategoriHadiah(selectedLomba.kategori), selectedJk);
      setEditValues(current.map(h => h.hadiah));
    }
  }, [selectedLomba, selectedJk, hadiahMap, lombaHadiah]);

  const handleSave = () => {
    if (!selectedLomba) return;
    const updated = { ...lombaHadiah };
    if (!updated[selectedLomba.id]) updated[selectedLomba.id] = {};
    updated[selectedLomba.id] = { ...updated[selectedLomba.id], [selectedJk]: DEFAULT_HADIAH.map((h, i) => ({ ...h, hadiah: editValues[i] })) };
    setLombaHadiah(updated);
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  const deleteOverride = () => {
    if (!selectedLomba) return;
    const updated = { ...lombaHadiah };
    if (updated[selectedLomba.id]) {
      delete updated[selectedLomba.id][selectedJk];
      if (Object.keys(updated[selectedLomba.id]).length === 0) delete updated[selectedLomba.id];
    }
    setLombaHadiah(updated);
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  const isCustom = selectedLomba && lombaHadiah[selectedLomba.id]?.[selectedJk];

  const selectKategori = (k) => {
    setSelectedKat(k);
    setSelectedLomba(null);
  };

  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ ...s.header, paddingBottom: 20 }}>
        <div style={{ fontSize: fs(50), marginBottom: 5 }}>🎁</div>
        <div style={s.headerTitle}>Hadiah Juara</div>
        <div style={{ fontSize: fs(14), color: COLORS.gold, marginTop: 4 }}>Atur hadiah per lomba & jenis kelamin</div>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ fontSize: fs(13), fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 6 }}>Pilih Kategori:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {kategoriLomba.map(k => (
            <button key={k} onClick={() => selectKategori(k)} style={{
              display: 'flex', alignItems: 'center', padding: '6px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: fs(12),
              background: selectedKat === k ? kategoriColor(k) : COLORS.white,
              color: selectedKat === k ? COLORS.white : COLORS.darkGray,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              <span style={{ marginRight: 4 }}>{lombaList.find(l => l.kategori === k)?.icon || '🏅'}</span>{k}
            </button>
          ))}
        </div>

        {selectedKat && !selectedLomba && (
          <div>
            <div style={{ fontSize: fs(13), fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 6 }}>Pilih Lomba ({selectedKat}):</div>
            {lombaList.filter(l => l.kategori === selectedKat).map(l => (
              <div key={l.id} onClick={() => setSelectedLomba(l)} style={{ display: 'flex', alignItems: 'center', background: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
                <div style={{ fontSize: fs(28), marginRight: 12 }}>{l.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: fs(15), fontWeight: 'bold', color: COLORS.darkGray }}>{l.nama}</div>
                  <div style={{ fontSize: fs(11), color: COLORS.gray }}>{l.waktu}</div>
                </div>
                <span style={{ fontSize: fs(24), color: COLORS.gray }}>›</span>
              </div>
            ))}
          </div>
        )}

        {selectedLomba && (
          <>
            <div style={{ marginBottom: 12 }}>
              <button onClick={() => setSelectedLomba(null)} style={{ background: COLORS.lightGray, border: 'none', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', fontSize: fs(13), fontWeight: 'bold', color: COLORS.darkGray }}>← Pilih Lomba Lain</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', background: COLORS.white, borderRadius: 14, padding: 12, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: fs(30), marginRight: 12 }}>{selectedLomba.icon}</div>
              <div>
                <div style={{ fontSize: fs(16), fontWeight: 'bold', color: COLORS.darkGray }}>{selectedLomba.nama}</div>
                <div style={{ fontSize: fs(12), color: COLORS.gray }}>{selectedLomba.kategori} • {selectedLomba.waktu}</div>
              </div>
            </div>

            <div style={{ fontSize: fs(13), fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 6 }}>Jenis Kelamin:</div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {[{ key: 'L', label: '👦 Laki-laki' }, { key: 'P', label: '👧 Perempuan' }].map(g => (
                <button key={g.key} onClick={() => setSelectedJk(g.key)} style={{
                  flex: 1, padding: '10px', borderRadius: 12, border: selectedJk === g.key ? '2px solid ' + (g.key === 'L' ? '#4A90D9' : '#E91E63') : '2px solid transparent',
                  cursor: 'pointer', fontSize: fs(14), fontWeight: selectedJk === g.key ? 'bold' : 'normal',
                  background: selectedJk === g.key ? (g.key === 'L' ? '#E3F2FD' : '#FCE4EC') : COLORS.lightGray,
                  color: COLORS.darkGray
                }}>{g.label}</button>
              ))}
            </div>

            <div style={{ fontSize: fs(14), fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 4 }}>{selectedLomba.nama} — {selectedJk === 'L' ? '👦 Laki-laki' : '👧 Perempuan'}</div>
            <div style={{ fontSize: fs(12), color: COLORS.gray, marginBottom: 12 }}>
              {isCustom ? '✏️ Hadiah khusus lomba ini' : '📋 Menggunakan hadiah default kategori'}
            </div>

            {DEFAULT_HADIAH.map((h, i) => (
              <div key={i} style={{ background: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '2px solid ' + hadiahColors[i] + '55' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ width: 50, height: 50, borderRadius: 25, background: hadiahColors[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: fs(26), marginRight: 12 }}>{h.icon}</div>
                  <div>
                    <div style={{ fontSize: fs(18), fontWeight: 'bold', color: COLORS.darkGray }}>{h.label}</div>
                    <div style={{ fontSize: fs(12), color: COLORS.gray }}>Posisi {h.posisi}</div>
                  </div>
                </div>
                <div style={{ fontSize: fs(13), fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 6 }}>Jenis Hadiah:</div>
                <input value={editValues[i]} onChange={e => setEditValues(editValues.map((v, idx) => idx === i ? e.target.value : v))} style={{ width: '100%', padding: '12px', borderRadius: 12, border: '2px solid ' + COLORS.lightGray, fontSize: fs(14), outline: 'none', color: COLORS.darkGray, background: COLORS.lightGray, boxSizing: 'border-box' }} placeholder="Tulis hadiah..." />
              </div>
            ))}

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleSave} style={{ flex: 1, padding: 14, borderRadius: 12, background: COLORS.green, color: COLORS.white, fontWeight: 'bold', fontSize: fs(16), border: 'none', cursor: 'pointer' }}>
                {saving ? '✓ Tersimpan!' : 'Simpan Hadiah'}
              </button>
              {isCustom && (
                <button onClick={deleteOverride} style={{ padding: '14px 20px', borderRadius: 12, background: COLORS.lightGray, color: COLORS.red, fontWeight: 'bold', fontSize: fs(14), border: 'none', cursor: 'pointer' }}>
                  Reset ke Default
                </button>
              )}
            </div>
          </>
        )}

        {!selectedLomba && !selectedKat && (
          <div style={{ textAlign: 'center', padding: 40, color: COLORS.gray }}>
            <div style={{ fontSize: fs(50), marginBottom: 15 }}>👆</div>
            <div style={{ fontSize: fs(16), marginBottom: 5 }}>Pilih kategori terlebih dahulu</div>
            <div style={{ fontSize: fs(13) }}>Lalu pilih lomba untuk mengatur hadiahnya</div>
          </div>
        )}
        </div>
    </div>
  );
}


function KeuanganScreen({ wargaList, setWargaList, statusBayar, setStatusBayar, iuranPerWarga, iuranMap, setIuranMap }) {
  const [selectedArea, setSelectedArea] = useState(null);
  const [filterBayar, setFilterBayar] = useState('Semua');
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [newWarga, setNewWarga] = useState({ nama: '', area: DATA_KEUANGAN[0].area });
  const [editNama, setEditNama] = useState('');
  const [showEditIuranKey, setShowEditIuranKey] = useState(null);
  const [editIuranVal, setEditIuranVal] = useState('');

  const getNominal = (area, idx) => {
    const k = `${area}-${idx}`;
    return iuranMap[k] !== undefined ? iuranMap[k] : iuranPerWarga;
  };

  const toggleBayar = (area, idx) => {
    setStatusBayar(prev => {
      const key = `${area}-${idx}`;
      return { ...prev, [key]: prev[key] === 'lunas' ? 'belum' : 'lunas' };
    });
  };

  const getFiltered = (warga, area) => {
    if (filterBayar === 'Semua') return warga;
    return warga.filter((_, i) => {
      const s = statusBayar[`${area}-${i}`];
      return filterBayar === 'lunas' ? s === 'lunas' : s !== 'lunas';
    });
  };

  const totalWarga = wargaList.reduce((s, g) => s + g.warga.length, 0);
  const totalLunas = wargaList.reduce((s, g) => s + g.warga.filter((_, i) => statusBayar[`${g.area}-${i}`] === 'lunas').length, 0);
  const totalIuran = wargaList.reduce((s, g) => s + g.warga.reduce((acc, _, i) => acc + getNominal(g.area, i), 0), 0);
  const totalTerkumpul = wargaList.reduce((s, g) => s + g.warga.reduce((acc, _, i) => acc + (statusBayar[`${g.area}-${i}`] === 'lunas' ? getNominal(g.area, i) : 0), 0), 0);
  const totalKurang = totalIuran - totalTerkumpul;

  const fmt = (n) => 'Rp ' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  const exportKeuangan = () => {
    const sheet = [['REKAP IURAN AGUSTUSAN'], [`Iuran per warga: ${iuranPerWarga}`], []];
    wargaList.forEach(g => {
      sheet.push([g.area.toUpperCase()]);
      sheet.push(['No', 'Nama Warga', 'Status', 'Nominal']);
      g.warga.forEach((nama, i) => {
        sheet.push([i + 1, nama, statusBayar[`${g.area}-${i}`] === 'lunas' ? 'LUNAS' : 'BELUM', getNominal(g.area, i)]);
      });
      const luna = g.warga.filter((_, i) => statusBayar[`${g.area}-${i}`] === 'lunas').length;
      sheet.push(['', `Sub Total ${g.area}`, `${luna}/${g.warga.length} lunas`, g.warga.reduce((acc, _, i) => acc + (statusBayar[`${g.area}-${i}`] === 'lunas' ? getNominal(g.area, i) : 0), 0)]);
      sheet.push([]);
    });
    sheet.push(['', '', 'TOTAL TARGET', totalIuran]);
    sheet.push(['', '', 'TOTAL TERKUMPUL', totalTerkumpul]);
    sheet.push(['', '', 'TOTAL KURANG', totalKurang]);
    downloadExcel('Rekap_Iuran_Agustusan.xlsx', [{ name: 'Rekap Iuran', rows: sheet, cols: [{ wch: 6 }, { wch: 24 }, { wch: 12 }, { wch: 16 }] }]);
  };

  const exportKeuanganPdf = () => {
    const rows = [];
    wargaList.forEach(g => {
      g.warga.forEach((nama, i) => {
        rows.push([g.area, nama, statusBayar[`${g.area}-${i}`] === 'lunas' ? 'Lunas' : 'Belum', getNominal(g.area, i)]);
      });
    });
    downloadPdf('Rekap_Iuran_Agustusan.pdf', 'REKAP IURAN AGUSTUSAN', `Iuran per warga: ${fmt(iuranPerWarga)} • ${totalWarga} warga • ${totalLunas} lunas`, ['Area', 'Nama Warga', 'Status', 'Nominal'], rows, ['', '', 'TOTAL TERKUMPUL', fmt(totalTerkumpul)]);
  };

  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ ...s.header, paddingBottom: 20 }}>
        <div style={{ fontSize: fs(50), marginBottom: 5 }}>💰</div>
        <div style={s.headerTitle}>Keuangan</div>
        <div style={{ fontSize: fs(14), color: COLORS.gold, marginTop: 4 }}>Iuran {fmt(iuranPerWarga)}/warga</div>
      </div>

      <div style={{ padding: 16, display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, background: COLORS.white, borderRadius: 12, padding: 12, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: fs(11), color: COLORS.gray }}>Target</div>
          <div style={{ fontSize: fs(16), fontWeight: 'bold', color: COLORS.darkGray }}>{fmt(totalIuran)}</div>
        </div>
        <div style={{ flex: 1, background: COLORS.white, borderRadius: 12, padding: 12, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: fs(11), color: COLORS.gray }}>Terkumpul</div>
          <div style={{ fontSize: fs(16), fontWeight: 'bold', color: COLORS.green }}>{fmt(totalTerkumpul)}</div>
        </div>
        <div style={{ flex: 1, background: COLORS.white, borderRadius: 12, padding: 12, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: fs(11), color: COLORS.gray }}>Kurang</div>
          <div style={{ fontSize: fs(16), fontWeight: 'bold', color: COLORS.red }}>{fmt(totalKurang)}</div>
        </div>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', gap: 6, marginBottom: 10 }}>
        <button onClick={exportKeuangan} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: fs(13), fontWeight: 'bold', background: COLORS.green, color: COLORS.white, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>📊 Excel</button>
        <button onClick={exportKeuanganPdf} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: fs(13), fontWeight: 'bold', background: COLORS.red, color: COLORS.white, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>📄 PDF</button>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', gap: 6 }}>
        {[{ key: 'Semua', label: `Semua (${totalWarga})` }, { key: 'lunas', label: `✅ Lunas (${totalLunas})` }, { key: 'belum', label: `❌ Belum (${totalWarga - totalLunas})` }].map(f => (
          <button key={f.key} onClick={() => setFilterBayar(f.key)} style={{
            flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: fs(12), fontWeight: 'bold',
            background: filterBayar === f.key ? COLORS.red : COLORS.white,
            color: filterBayar === f.key ? COLORS.white : COLORS.darkGray,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>{f.label}</button>
        ))}
      </div>

      <div style={{ padding: 16 }}>
        {wargaList.map(g => {
          const filtered = getFiltered(g.warga, g.area);
          if (filtered.length === 0) return null;
          const lunasArea = g.warga.filter((_, i) => statusBayar[`${g.area}-${i}`] === 'lunas').length;
          const totalArea = g.warga.length * iuranPerWarga;
          const terkumpulArea = g.warga.reduce((acc, _, i) => acc + (statusBayar[`${g.area}-${i}`] === 'lunas' ? getNominal(g.area, i) : 0), 0);
          return (
            <div key={g.area} style={{ background: COLORS.white, borderRadius: 16, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <div onClick={() => setSelectedArea(selectedArea === g.area ? null : g.area)} style={{ display: 'flex', alignItems: 'center', padding: 16, cursor: 'pointer', background: `linear-gradient(135deg, ${COLORS.red}11, ${COLORS.darkRed}11)` }}>
                <div style={{ fontSize: fs(28), marginRight: 12 }}>{g.area === 'Komplek Bawah' ? '⬇️' : g.area === 'Komplek Atas' ? '⬆️' : '📍'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: fs(16), fontWeight: 'bold', color: COLORS.darkGray }}>{g.area}</div>
                  <div style={{ fontSize: fs(11), color: COLORS.gray }}>{g.warga.length} warga • {lunasArea} lunas • {fmt(terkumpulArea)} / {fmt(totalArea)}</div>
                </div>
                <span style={{ fontSize: fs(24), color: COLORS.gray, transform: selectedArea === g.area ? 'rotate(90deg)' : 'rotate(0deg)', transition: '0.2s' }}>›</span>
              </div>
              {selectedArea === g.area && (
                <div style={{ padding: '8px 16px 16px' }}>
                  {filtered.map((nama, i) => {
                    const realIdx = g.warga.indexOf(nama);
                    const lunas = statusBayar[`${g.area}-${realIdx}`] === 'lunas';
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderTop: i > 0 ? `1px solid ${COLORS.lightGray}` : 'none' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 16, background: lunas ? COLORS.green : COLORS.red, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 10, fontSize: fs(12), fontWeight: 'bold', color: COLORS.white }}>{realIdx + 1}</div>
                        <div style={{ flex: 1, fontSize: fs(14), color: COLORS.darkGray }}>{nama}</div>
                        <button onClick={() => { setEditIuranVal(String(getNominal(g.area, realIdx))); setShowEditIuranKey(`${g.area}-${realIdx}`); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: fs(11), fontWeight: 'bold', color: COLORS.blue, marginRight: 8 }}>{fmt(getNominal(g.area, realIdx))} ✏️</button>
                        <button onClick={() => toggleBayar(g.area, realIdx)} style={{
                          padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: fs(12), fontWeight: 'bold',
                          background: lunas ? COLORS.green : COLORS.lightGray,
                          color: lunas ? COLORS.white : COLORS.darkGray,
                          marginRight: 6,
                        }}>
                          {lunas ? '✅ Lunas' : '❌ Belum'}
                        </button>
                        <button onClick={() => { if (confirm(`Hapus ${nama}?`)) { setWargaList(prev => prev.map(gg => gg.area === g.area ? { ...gg, warga: gg.warga.filter((_, fi) => fi !== realIdx) } : gg)); } }} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: fs(16), background: '#FFE5E5', color: COLORS.red, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 4 }}>🗑️</button>
                        <button onClick={() => { setShowEdit({ area: g.area, idx: realIdx }); setEditNama(nama); }} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: fs(14), background: '#E3F2FD', color: '#4A90D9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✏️</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button onClick={() => setShowAdd(true)} style={{ position: 'fixed', right: 24, bottom: 24, width: 60, height: 60, borderRadius: 30, background: COLORS.red, color: COLORS.white, fontSize: fs(30), fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 100 }}>+</button>

      {showAdd && (
        <div onClick={() => setShowAdd(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: 16, padding: 25, width: '85%', maxWidth: 400 }}>
            <div style={{ fontSize: fs(22), fontWeight: 'bold', color: COLORS.darkGray, textAlign: 'center', marginBottom: 20 }}>Tambah Warga</div>
            <input value={newWarga.nama} onChange={e => setNewWarga({...newWarga, nama: e.target.value})} placeholder="Nama warga..." style={{ width: '100%', border: `1px solid ${COLORS.lightGray}`, borderRadius: 12, padding: 12, fontSize: fs(14), marginBottom: 12, background: COLORS.lightGray, color: COLORS.darkGray, boxSizing: 'border-box' }} />
            <div style={{ fontSize: fs(14), fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 8 }}>Pilih Area:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {DATA_KEUANGAN.map(a => (
                <button key={a.area} onClick={() => setNewWarga({...newWarga, area: a.area})} style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', borderRadius: 20, border: newWarga.area === a.area ? `2px solid ${COLORS.red}` : '2px solid transparent', cursor: 'pointer', fontSize: fs(12), background: newWarga.area === a.area ? '#FFE5E5' : COLORS.lightGray, color: newWarga.area === a.area ? COLORS.red : COLORS.darkGray }}>{a.area}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: 12, borderRadius: 12, background: COLORS.lightGray, color: COLORS.darkGray, fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Batal</button>
              <button onClick={() => { if (newWarga.nama) { setWargaList(prev => prev.map(g => g.area === newWarga.area ? { ...g, warga: [...g.warga, newWarga.nama] } : g)); setShowAdd(false); setNewWarga({ nama: '', area: DATA_KEUANGAN[0].area }); } else alert('Isi nama warga'); }} style={{ flex: 1, padding: 12, borderRadius: 12, background: COLORS.red, color: COLORS.white, fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {showEdit && (
        <div onClick={() => setShowEdit(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: 16, padding: 25, width: '85%', maxWidth: 400 }}>
            <div style={{ fontSize: fs(22), fontWeight: 'bold', color: COLORS.darkGray, textAlign: 'center', marginBottom: 20 }}>Edit Warga</div>
            <input value={editNama} onChange={e => setEditNama(e.target.value)} placeholder="Nama warga..." style={{ width: '100%', border: `1px solid ${COLORS.lightGray}`, borderRadius: 12, padding: 12, fontSize: fs(14), marginBottom: 20, background: COLORS.lightGray, color: COLORS.darkGray, boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowEdit(null)} style={{ flex: 1, padding: 12, borderRadius: 12, background: COLORS.lightGray, color: COLORS.darkGray, fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Batal</button>
              <button onClick={() => { if (editNama) { setWargaList(prev => prev.map(gg => gg.area === showEdit.area ? { ...gg, warga: gg.warga.map((w, wi) => wi === showEdit.idx ? editNama : w) } : gg)); setShowEdit(null); } else alert('Isi nama warga'); }} style={{ flex: 1, padding: 12, borderRadius: 12, background: COLORS.red, color: COLORS.white, fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {showEditIuranKey && (
        <div onClick={() => setShowEditIuranKey(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: 16, padding: 25, width: '85%', maxWidth: 400 }}>
            <div style={{ fontSize: fs(22), fontWeight: 'bold', color: COLORS.darkGray, textAlign: 'center', marginBottom: 20 }}>Edit Nominal</div>
            <div style={{ fontSize: fs(14), fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 8 }}>Nominal yang dibayar orang ini:</div>
            <input type="number" value={editIuranVal} onChange={e => setEditIuranVal(e.target.value)} placeholder="Contoh: 65000" style={{ width: '100%', border: '1px solid ' + COLORS.lightGray, borderRadius: 12, padding: 12, fontSize: fs(14), marginBottom: 12, background: COLORS.lightGray, color: COLORS.darkGray, boxSizing: 'border-box' }} />
            <div style={{ fontSize: fs(12), color: COLORS.gray, marginBottom: 16 }}>Isi 0 jika tidak membayar. Total terkumpul dihitung ulang otomatis.</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowEditIuranKey(null)} style={{ flex: 1, padding: 12, borderRadius: 12, background: COLORS.lightGray, color: COLORS.darkGray, fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Batal</button>
              <button onClick={() => { setIuranMap(prev => ({ ...prev, [showEditIuranKey]: parseInt(editIuranVal) || 0 })); setShowEditIuranKey(null); }} style={{ flex: 1, padding: 12, borderRadius: 12, background: COLORS.red, color: COLORS.white, fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Simpan</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function LogistikScreen({ totalTerkumpul }) {
  const [lview, setLview] = useState('daftar');
  const [logCek, setLogCek] = usePersistedState('logCek', {});
  const [logistikList, setLogistikList] = usePersistedState('logistik', DATA_LOGISTIK.map(it => ({ ...it })));
  const [showAddLog, setShowAddLog] = useState(false);
  const [newLog, setNewLog] = useState({ nama: '', kategori: 'perlengkapan', harga: 0 });

  const toggleCek = (idx) => {
    setLogCek(prev => {
      return { ...prev, [idx]: prev[idx] ? '' : 'done' };
    });
  };

  const addLogistik = () => {
    if (!newLog.nama) { alert('Isi nama barang'); return; }
    setLogistikList(prev => [...prev, { nama: newLog.nama, kategori: newLog.kategori, harga: parseInt(newLog.harga) || 0 }]);
    setShowAddLog(false);
    setNewLog({ nama: '', kategori: 'perlengkapan', harga: 0 });
  };

  const delLogistik = (idx) => {
    if (!confirm('Hapus item ini?')) return;
    setLogistikList(prev => prev.filter(function(_, i) { return i !== idx; }));
    setLogCek(prev => {
      const cp = { ...prev };
      delete cp[idx];
      return cp;
    });
  };

  const fmt = (n) => 'Rp ' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  var tPL = 0; var tKM = 0; var tBW = 0;
  var tCek = 0; var tTotal = 0; var tBeli = 0;
  logistikList.forEach(function(it, i) {
    if (it.kategori === 'perlengkapan') tPL++;
    else if (it.kategori === 'konsumsi') tKM++;
    else tBW++;
    tTotal++;
    if (logCek[i]) tCek++;
    if (it.harga > 0) tBeli += it.harga;
  });
  var tAll = tPL + tKM + tBW;
  var totalBelanja = tBeli;
  var sisaSodakoh = totalTerkumpul - totalBelanja;

  const exportLogistik = () => {
    const rows = [['REKAP LOGISTIK AGUSTUSAN'], ['Kategori', 'Item', 'Siap', 'Belanja']];
    [['perlengkapan', 'Perlengkapan'], ['konsumsi', 'Konsumsi'], ['bawaan', 'Bawaan']].forEach(([k, label]) => {
      let n = 0, c = 0, b = 0;
      logistikList.forEach((it, i) => { if (it.kategori === k) { n++; if (logCek[i]) c++; if (it.harga > 0) b += it.harga; } });
      rows.push([label, n, c, b]);
    });
    rows.push(['TOTAL', tAll, tCek, totalBelanja]);
    rows.push([]);
    rows.push(['KAS SODAKOH IURAN']);
    rows.push(['Iuran Terkumpul', totalTerkumpul]);
    rows.push(['Belanja Logistik', totalBelanja]);
    rows.push(['Sisa Sodakoh', sisaSodakoh]);
    const detail = [['No', 'Nama Barang', 'Kategori', 'Harga', 'Status']];
    logistikList.forEach((it, i) => {
      detail.push([i + 1, it.nama, it.kategori, it.harga, logCek[i] ? 'Siap' : 'Belum']);
    });
    downloadExcel('Rekap_Logistik_Agustusan.xlsx', [
      { name: 'Rekap Logistik', rows, cols: [{ wch: 18 }, { wch: 10 }, { wch: 10 }, { wch: 14 }] },
      { name: 'Detail Barang', rows: detail, cols: [{ wch: 5 }, { wch: 30 }, { wch: 14 }, { wch: 12 }, { wch: 10 }] },
    ]);
  };

  const exportLogistikPdf = () => {
    const rows = [];
    [['perlengkapan', 'Perlengkapan'], ['konsumsi', 'Konsumsi'], ['bawaan', 'Bawaan']].forEach(([k, label]) => {
      let n = 0, c = 0, b = 0;
      logistikList.forEach((it, i) => { if (it.kategori === k) { n++; if (logCek[i]) c++; if (it.harga > 0) b += it.harga; } });
      rows.push([label, n, c, b > 0 ? fmt(b) : '-']);
    });
    rows.push(['TOTAL', tAll, tCek, fmt(totalBelanja)]);
    downloadPdf('Rekap_Logistik_Agustusan.pdf', 'REKAP LOGISTIK AGUSTUSAN', `${tAll} item • ${tCek} siap • ${fmt(totalBelanja)} dibeli`, ['Kategori', 'Item', 'Siap', 'Belanja'], rows, ['', '', '', '']);

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(40, 167, 69);
    doc.text('KAS SODAKOH IURAN', 14, 18);
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    doc.text(`Iuran Terkumpul: ${fmt(totalTerkumpul)} • Belanja: ${fmt(totalBelanja)}`, 14, 25);
    autoTable(doc, {
      startY: 31,
      head: [['Keterangan', 'Jumlah']],
      body: [
        ['Iuran Terkumpul', fmt(totalTerkumpul)],
        ['Belanja Logistik', fmt(totalBelanja)],
        ['Sisa Sodakoh', fmt(sisaSodakoh)],
      ],
      headStyles: { fillColor: [40, 167, 69], fontSize: fs(9) },
      styles: { fontSize: fs(9), cellPadding: 2.5 },
      margin: { left: 14, right: 14 },
    });
    doc.save('Kas_Sodakoh_Iuran.pdf');
  };

  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ ...s.header, paddingBottom: 20 }}>
        <div style={{ fontSize: fs(50), marginBottom: 5 }}>📦</div>
        <div style={s.headerTitle}>Logistik</div>
        <div style={{ fontSize: fs(14), color: COLORS.gold, marginTop: 4 }}>{tAll} item • {fmt(totalBelanja)} dibeli</div>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', gap: 6, marginBottom: 10 }}>
        <button onClick={() => setLview('daftar')} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: fs(13), fontWeight: 'bold', background: lview === 'daftar' ? COLORS.red : COLORS.white, color: lview === 'daftar' ? COLORS.white : COLORS.darkGray, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>📋 Daftar</button>
        <button onClick={() => setLview('rekap')} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: fs(13), fontWeight: 'bold', background: lview === 'rekap' ? COLORS.red : COLORS.white, color: lview === 'rekap' ? COLORS.white : COLORS.darkGray, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>📊 Rekap</button>
      </div>

      {lview === 'daftar' && (<div style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <div style={{ flex: 1, background: COLORS.white, borderRadius: 12, padding: 12, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: fs(11), color: COLORS.gray }}>Total Item</div>
            <div style={{ fontSize: fs(16), fontWeight: 'bold', color: COLORS.darkGray }}>{tAll}</div>
          </div>
          <div style={{ flex: 1, background: COLORS.white, borderRadius: 12, padding: 12, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: fs(11), color: COLORS.gray }}>Sudah Ceklis</div>
            <div style={{ fontSize: fs(16), fontWeight: 'bold', color: COLORS.green }}>{tCek}/{tAll}</div>
          </div>
          <div style={{ flex: 1, background: COLORS.white, borderRadius: 12, padding: 12, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: fs(11), color: COLORS.gray }}>Belanja Dibeli</div>
            <div style={{ fontSize: fs(13), fontWeight: 'bold', color: COLORS.blue }}>{fmt(totalBelanja)}</div>
          </div>
        </div>

        <div style={{ fontSize: fs(12), color: COLORS.gray, marginBottom: 8 }}>Centang ✅ item yang sudah siap. Ketuk ➕ untuk tambah item sendiri.</div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          <div style={{ flex: 1, padding: '8px 0', borderRadius: 10, textAlign: 'center', fontSize: fs(12), fontWeight: 'bold', background: '#E3F2FD', color: COLORS.blue }}>🛒 Beli ({logistikList.filter(function(it) { return it.harga > 0; }).length})</div>
          <div style={{ flex: 1, padding: '8px 0', borderRadius: 10, textAlign: 'center', fontSize: fs(12), fontWeight: 'bold', background: COLORS.lightGray, color: COLORS.darkGray }}>🧺 Bawaan ({logistikList.filter(function(it) { return it.harga === 0; }).length})</div>
        </div>

        {[{ key: 'beli', label: '🛒 Beli (pakai iuran)', color: COLORS.blue }, { key: 'bawaan', label: '🧺 Bawaan (tidak beli)', color: COLORS.gray }].map(function(sec) {
          var items = logistikList.map(function(it, i) { return { it: it, i: i }; }).filter(function(x) { return sec.key === 'beli' ? x.it.harga > 0 : x.it.harga === 0; });
          var subBeli = 0;
          items.forEach(function(x) { subBeli += x.it.harga; });
          return (
            <div key={sec.key} style={{ background: COLORS.white, borderRadius: 16, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', background: sec.color + '11', borderBottom: '1px solid ' + COLORS.lightGray, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: fs(15), fontWeight: 'bold', color: COLORS.darkGray }}>{sec.label}</span>
                <span style={{ fontSize: fs(12), fontWeight: 'bold', color: sec.color }}>{sec.key === 'beli' ? fmt(subBeli) : items.filter(function(x) { return logCek[x.i]; }).length + '/' + items.length + ' siap'}</span>
              </div>
              {items.length === 0 && (
                <div style={{ padding: '16px', textAlign: 'center', fontSize: fs(13), color: COLORS.gray }}>{sec.key === 'beli' ? 'Belum ada item untuk dibeli' : 'Belum ada item bawaan'}</div>
              )}
              <div style={{ padding: '4px 16px 10px' }}>
                {items.map(function(x, ri) {
                  const isCek = logCek[x.i];
                  return (
                    <div key={x.i} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderTop: ri > 0 ? '1px solid ' + COLORS.lightGray : 'none' }}>
                      <button onClick={() => toggleCek(x.i)} style={{ width: 34, height: 34, borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: fs(18), background: isCek ? COLORS.green + '22' : COLORS.lightGray, marginRight: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{isCek ? '✅' : '⬜'}</button>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: fs(14), color: COLORS.darkGray, textDecoration: isCek ? 'line-through' : 'none', fontWeight: isCek ? 'normal' : 'bold' }}>{x.it.nama}</div>
                        <div style={{ fontSize: fs(11), color: COLORS.gray }}>{x.it.kategori === 'perlengkapan' ? '🧰 Perlengkapan' : x.it.kategori === 'konsumsi' ? '🍽️ Konsumsi' : '🧺 Bawaan'}</div>
                      </div>
                      {sec.key === 'beli' && <span style={{ fontSize: fs(13), fontWeight: 'bold', color: COLORS.blue, marginRight: 8 }}>{fmt(x.it.harga)}</span>}
                      <button onClick={() => delLogistik(x.i)} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: fs(16), background: '#FFE5E5', color: COLORS.red, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🗑️</button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>)}

      <button onClick={() => setShowAddLog(true)} style={{ position: 'fixed', right: 24, bottom: 24, width: 60, height: 60, borderRadius: 30, background: COLORS.blue, color: COLORS.white, fontSize: fs(30), fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 100 }}>+</button>

      {showAddLog && (
        <div onClick={() => setShowAddLog(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: 16, padding: 25, width: '85%', maxWidth: 400 }}>
            <div style={{ fontSize: fs(22), fontWeight: 'bold', color: COLORS.darkGray, textAlign: 'center', marginBottom: 20 }}>Tambah Logistik</div>
            <input value={newLog.nama} onChange={e => setNewLog({ ...newLog, nama: e.target.value })} placeholder="Nama barang..." style={{ width: '100%', border: '1px solid ' + COLORS.lightGray, borderRadius: 12, padding: 12, fontSize: fs(14), marginBottom: 12, background: COLORS.lightGray, color: COLORS.darkGray, boxSizing: 'border-box' }} />
            <div style={{ fontSize: fs(14), fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 8 }}>Kategori:</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {[{ key: 'perlengkapan', label: '🧰 Perlengkapan' }, { key: 'konsumsi', label: '🍽️ Konsumsi' }, { key: 'bawaan', label: '🧺 Bawaan' }].map(kt => (
                <button key={kt.key} onClick={() => setNewLog({ ...newLog, kategori: kt.key })} style={{ flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: fs(12), fontWeight: 'bold', background: newLog.kategori === kt.key ? COLORS.red : COLORS.lightGray, color: newLog.kategori === kt.key ? COLORS.white : COLORS.darkGray }}>{kt.label}</button>
              ))}
            </div>
            <div style={{ fontSize: fs(14), fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 8 }}>Harga (isi 0 jika bawaan / tidak dibeli):</div>
            <input type="number" value={newLog.harga} onChange={e => setNewLog({ ...newLog, harga: e.target.value })} placeholder="Contoh: 50000" style={{ width: '100%', border: '1px solid ' + COLORS.lightGray, borderRadius: 12, padding: 12, fontSize: fs(14), marginBottom: 20, background: COLORS.lightGray, color: COLORS.darkGray, boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowAddLog(false)} style={{ flex: 1, padding: 12, borderRadius: 12, background: COLORS.lightGray, color: COLORS.darkGray, fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Batal</button>
              <button onClick={addLogistik} style={{ flex: 1, padding: 12, borderRadius: 12, background: COLORS.blue, color: COLORS.white, fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Simpan</button>
            </div>
          </div>
        </div>
      )}

      {lview === 'rekap' && <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          <button onClick={exportLogistik} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: fs(13), fontWeight: 'bold', background: COLORS.green, color: COLORS.white, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>📊 Excel</button>
          <button onClick={exportLogistikPdf} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: fs(13), fontWeight: 'bold', background: COLORS.red, color: COLORS.white, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>📄 PDF</button>
        </div>
        <div style={{ background: COLORS.white, borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: 16 }}>
          <div style={{ padding: '14px 16px', background: 'linear-gradient(135deg, ' + COLORS.red + '11, ' + COLORS.darkRed + '11)', borderBottom: '1px solid ' + COLORS.lightGray }}>
            <div style={{ fontSize: fs(16), fontWeight: 'bold', color: COLORS.darkGray }}>📦 Rekap Logistik</div>
            <div style={{ fontSize: fs(12), color: COLORS.gray, marginTop: 2 }}>{tAll + ' item • ' + tCek + ' siap • ' + fmt(totalBelanja) + ' dibeli'}</div>
          </div>
          <div style={{ padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 4px', borderBottom: '2px solid ' + COLORS.lightGray, fontSize: fs(12), fontWeight: 'bold', color: COLORS.gray }}>
              <span>Kategori</span>
              <span style={{ display: 'flex', gap: 12 }}><span>Item</span><span>Siap</span><span>Belanja</span></span>
            </div>
            {[{ key: 'perlengkapan', label: '🧰 Perlengkapan' }, { key: 'konsumsi', label: '🍽️ Konsumsi' }, { key: 'bawaan', label: '🧺 Bawaan' }].map(function(kt) {
              var kItems = 0; var kCek = 0; var kBeli = 0;
              logistikList.forEach(function(it, i) {
                if (it.kategori === kt.key) {
                  kItems++;
                  if (logCek[i]) kCek++;
                  if (it.harga > 0) kBeli += it.harga;
                }
              });
              return (
                <div key={kt.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 4px', borderBottom: '1px solid ' + COLORS.lightGray }}>
                  <span style={{ fontSize: fs(14), fontWeight: 'bold', color: COLORS.darkGray }}>{kt.label}</span>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: fs(13), color: COLORS.darkGray, width: 40, textAlign: 'right' }}>{kItems}</span>
                    <span style={{ fontSize: fs(13), color: COLORS.green, width: 40, textAlign: 'right' }}>{kCek}</span>
                    <span style={{ fontSize: fs(13), fontWeight: 'bold', color: kBeli > 0 ? COLORS.blue : COLORS.gray, width: 90, textAlign: 'right' }}>{kBeli > 0 ? fmt(kBeli) : '-'}</span>
                  </div>
                </div>
              );
            })}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 4px 4px', borderTop: '2px solid ' + COLORS.darkGray }}>
              <span style={{ fontSize: fs(15), fontWeight: 'bold', color: COLORS.darkGray }}>TOTAL</span>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontSize: fs(14), fontWeight: 'bold', color: COLORS.darkGray, width: 40, textAlign: 'right' }}>{tAll}</span>
                <span style={{ fontSize: fs(14), fontWeight: 'bold', color: COLORS.green, width: 40, textAlign: 'right' }}>{tCek}</span>
                <span style={{ fontSize: fs(14), fontWeight: 'bold', color: COLORS.blue, width: 90, textAlign: 'right' }}>{fmt(totalBelanja)}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: COLORS.white, borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: 16 }}>
          <div style={{ padding: '14px 16px', background: 'linear-gradient(135deg, ' + COLORS.green + '11, ' + COLORS.darkRed + '11)', borderBottom: '1px solid ' + COLORS.lightGray }}>
            <div style={{ fontSize: fs(16), fontWeight: 'bold', color: COLORS.darkGray }}>💸 Kas Sodakoh Iuran</div>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 4px', borderBottom: '1px solid ' + COLORS.lightGray }}>
              <span style={{ fontSize: fs(14), color: COLORS.darkGray }}>Iuran Terkumpul</span>
              <span style={{ fontSize: fs(14), fontWeight: 'bold', color: COLORS.green }}>{fmt(totalTerkumpul)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 4px', borderBottom: '1px solid ' + COLORS.lightGray }}>
              <span style={{ fontSize: fs(14), color: COLORS.darkGray }}>Belanja Logistik (dibeli)</span>
              <span style={{ fontSize: fs(14), fontWeight: 'bold', color: COLORS.blue }}>− {fmt(totalBelanja)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 4px 4px' }}>
              <span style={{ fontSize: fs(16), fontWeight: 'bold', color: COLORS.darkGray }}>Sisa Sodakoh</span>
              <span style={{ fontSize: fs(18), fontWeight: 'bold', color: sisaSodakoh >= 0 ? COLORS.green : COLORS.red }}>{fmt(sisaSodakoh)}</span>
            </div>
          </div>
        </div>

        <div style={{ background: COLORS.white, borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: fs(16), fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 12 }}>📊 Ringkasan Kategori</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, textAlign: 'center', padding: 12, background: COLORS.cream, borderRadius: 12 }}>
              <div style={{ fontSize: fs(11), color: COLORS.gray }}>Total Item</div>
              <div style={{ fontSize: fs(24), fontWeight: 'bold', color: COLORS.darkGray }}>{tAll}</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: 12, background: COLORS.cream, borderRadius: 12 }}>
              <div style={{ fontSize: fs(11), color: COLORS.gray }}>Perlengkapan</div>
              <div style={{ fontSize: fs(20), fontWeight: 'bold', color: COLORS.blue }}>{tPL}</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: 12, background: COLORS.cream, borderRadius: 12 }}>
              <div style={{ fontSize: fs(11), color: COLORS.gray }}>Konsumsi</div>
              <div style={{ fontSize: fs(20), fontWeight: 'bold', color: COLORS.green }}>{tKM}</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: 12, background: COLORS.cream, borderRadius: 12 }}>
              <div style={{ fontSize: fs(11), color: COLORS.gray }}>Bawaan</div>
              <div style={{ fontSize: fs(20), fontWeight: 'bold', color: '#FF9800' }}>{tBW}</div>
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState('home');
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 900);
  const [scores, setScores] = usePersistedState('scores', {});
  const [hadiahMap, setHadiahMap] = usePersistedState('hadiahMap', {});
  const [lombaHadiah, setLombaHadiah] = usePersistedState('lombaHadiah', LOMBA_HADIAH_AWAL);
  const [statusBayar, setStatusBayar] = usePersistedState('statusBayar', STATUS_AWAL);
  const [wargaList, setWargaList] = usePersistedState('wargaList', () => DATA_KEUANGAN.map(g => ({ ...g, warga: [...g.warga] })));
  const [iuranPerWarga, setIuranPerWarga] = usePersistedState('iuranPerWarga', 65000);
  const [iuranMap, setIuranMap] = usePersistedState('iuranMap', {});

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const totalTerkumpul = wargaList.reduce((s, g) => s + g.warga.reduce((acc, _, i) => {
    const k = `${g.area}-${i}`;
    if (statusBayar[k] === 'lunas') return acc + (iuranMap[k] !== undefined ? iuranMap[k] : iuranPerWarga);
    return acc;
  }, 0), 0);

  const screens = {
    home: <HomeScreen onNavigate={setTab} />,
    lomba: <LombaScreen />,
    peserta: <PesertaScreen />,
    penilaian: <PenilaianScreen scores={scores} setScores={setScores} />,
    hadiah: <HadiahScreen hadiahMap={hadiahMap} setHadiahMap={setHadiahMap} lombaHadiah={lombaHadiah} setLombaHadiah={setLombaHadiah} />,
    juara: <JuaraScreen scores={scores} hadiahMap={hadiahMap} lombaHadiah={lombaHadiah} />,
    keuangan: <KeuanganScreen wargaList={wargaList} setWargaList={setWargaList} statusBayar={statusBayar} setStatusBayar={setStatusBayar} iuranPerWarga={iuranPerWarga} iuranMap={iuranMap} setIuranMap={setIuranMap} />,
    logistik: <LogistikScreen totalTerkumpul={totalTerkumpul} />,
  };

  const tabs = [
    { key: 'home', label: 'Beranda', icon: '🏠' },
    { key: 'lomba', label: 'Lomba', icon: '🏆' },
    { key: 'penilaian', label: 'Penilaian', icon: '📋' },
    { key: 'hadiah', label: 'Hadiah', icon: '🎁' },
    { key: 'juara', label: 'Juara', icon: '🥇' },
    { key: 'logistik', label: 'Logistik', icon: '📦' },
    { key: 'keuangan', label: 'Keuangan', icon: '💰' },
    { key: 'peserta', label: 'Peserta', icon: '👤' },
  ];

  return (
    <>
      <style>{`
        @keyframes riFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .nav-btn { background: transparent; color: rgba(255,255,255,0.85); transition: all 0.2s ease; }
        .nav-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }
        .nav-btn.on { background: #fff; color: ${COLORS.red}; box-shadow: 0 4px 14px rgba(0,0,0,0.3); }
        .nav-btn.on .nav-icon { transform: scale(1.12); }
        .screen-anim { animation: riFade 0.25s ease; }
      `}</style>
      {isDesktop ? (
        <div style={{ minHeight: '100vh', display: 'flex', background: COLORS.cream }}>
          <div style={{ width: 200, flexShrink: 0, background: `linear-gradient(180deg, ${COLORS.red} 0%, ${COLORS.darkRed} 100%)`, padding: '20px 12px', display: 'flex', flexDirection: 'column', boxShadow: '4px 0 18px rgba(0,0,0,0.25)', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 100 }}>
            <div style={{ textAlign: 'center', marginBottom: 24, padding: '10px 0 14px', borderBottom: '2px solid rgba(255,255,255,0.3)' }}>
              <div style={{ fontSize: fs(36), marginBottom: 6, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>🇮🇩</div>
              <div style={{ fontSize: fs(16), fontWeight: 'bold', color: COLORS.white, letterSpacing: 1 }}>17 AGUSTUS</div>
              <div style={{ fontSize: fs(11), color: COLORS.gold, letterSpacing: 2, marginTop: 4 }}>2026</div>
            </div>
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`nav-btn${tab === t.key ? ' on' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 12px', marginBottom: 4, borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: fs(13), fontWeight: tab === t.key ? 'bold' : 'normal', textAlign: 'left' }}
              >
                <div className="nav-icon" style={{ fontSize: fs(20), width: 26, textAlign: 'center', transition: '0.2s' }}>{t.icon}</div>
                <div>{t.label}</div>
              </button>
            ))}
            <div style={{ marginTop: 'auto', textAlign: 'center', padding: '14px 4px 4px', borderTop: '1px solid rgba(255,255,255,0.25)', fontSize: fs(11), color: 'rgba(255,255,255,0.7)' }}>
              Dirgahayu RI 🇮🇩
            </div>
          </div>
          <div style={{ flex: 1, marginLeft: 200, display: 'flex', justifyContent: 'center' }}>
            <div className="screen-anim" key={tab} style={{ width: '100%', maxWidth: 1000 }}>{screens[tab]}</div>
          </div>
        </div>
      ) : (
        <div style={{ minHeight: '100vh', display: 'flex', background: COLORS.cream }}>
          <div style={{ width: 64, flexShrink: 0, background: `linear-gradient(180deg, ${COLORS.red} 0%, ${COLORS.darkRed} 100%)`, padding: '16px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '2px 0 12px rgba(0,0,0,0.25)', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 100 }}>
            <div style={{ fontSize: fs(24), marginBottom: 18 }}>🇮🇩</div>
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`nav-btn${tab === t.key ? ' on' : ''}`}
                title={t.label}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, marginBottom: 6, borderRadius: 12, border: 'none', cursor: 'pointer' }}
              >
                <div className="nav-icon" style={{ fontSize: fs(22), lineHeight: 1, transition: '0.2s' }}>{t.icon}</div>
              </button>
            ))}
            <div style={{ marginTop: 'auto', fontSize: fs(14) }}>🎖️</div>
          </div>
          <div className="screen-anim" key={tab} style={{ flex: 1, marginLeft: 64 }}>{screens[tab]}</div>
        </div>
      )}
    </>
  );
}
