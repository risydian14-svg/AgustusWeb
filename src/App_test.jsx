import React, { useState, useEffect, useRef } from 'react';

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
  { id: '4', waktu: '08.00 - 08.20', nama: 'Makan Kerupuk', tipe: 'lomba', icon: '🍘', kategori: 'Kelas C', durasi: 20, status: 'akan_datang' },
  { id: '5', waktu: '08.20 - 08.40', nama: 'Makan Kerupuk', tipe: 'lomba', icon: '🍘', kategori: 'Kelas B', durasi: 20, status: 'akan_datang' },
  { id: '6', waktu: '08.40 - 09.00', nama: 'Makan Kerupuk', tipe: 'lomba', icon: '🍘', kategori: 'Kelas A', durasi: 20, status: 'akan_datang' },
  { id: '7', waktu: '09.00 - 09.20', nama: 'Makan Kerupuk', tipe: 'lomba', icon: '🍘', kategori: 'PAUD', durasi: 20, status: 'akan_datang' },
  { id: '8', waktu: '09.20 - 09.40', nama: 'Makan Kerupuk', tipe: 'lomba', icon: '🍘', kategori: 'Pra-remaja', durasi: 20, status: 'akan_datang' },
  { id: '9', waktu: '09.40 - 10.00', nama: 'Ambil Bendera', tipe: 'lomba', icon: '🏴', kategori: 'PAUD', durasi: 20, status: 'akan_datang' },
  { id: '10', waktu: '10.00 - 10.20', nama: 'Sepak Kardus Botol', tipe: 'lomba', icon: '👟', kategori: 'Kelas B', durasi: 20, status: 'akan_datang' },
  { id: '11', waktu: '10.20 - 10.40', nama: 'Sepak Kardus Botol', tipe: 'lomba', icon: '👟', kategori: 'Kelas C', durasi: 20, status: 'akan_datang' },
  { id: '12', waktu: '10.40 - 11.20', nama: 'Lomba Ibu-Ibu', tipe: 'lomba', icon: '👩', kategori: 'Ibu-Ibu', durasi: 40, status: 'akan_datang' },
  { id: '13', waktu: '11.20 - 12.00', nama: 'Lomba Bapak-bapak', tipe: 'lomba', icon: '👨', kategori: 'Bapak-bapak', durasi: 40, status: 'akan_datang' },
  { id: '14', waktu: '12.00 - 12.00', nama: 'Foto Bersama', tipe: 'foto', icon: '📸', kategori: 'Umum', status: 'akan_datang' },
  { id: '15', waktu: '12.00 - 13.00', nama: 'ISHOMA', tipe: 'istirahat', icon: '🍽️', kategori: 'Umum', status: 'akan_datang' },
  { id: '16', waktu: '13.00 - 13.20', nama: 'Estafet Kardus Botol', tipe: 'lomba', icon: '🏃', kategori: 'Kelas A', durasi: 20, status: 'akan_datang' },
  { id: '17', waktu: '13.20 - 13.40', nama: 'Paku Botol', tipe: 'lomba', icon: '📌', kategori: 'Kelas B', durasi: 20, status: 'akan_datang' },
  { id: '18', waktu: '13.40 - 14.00', nama: 'Gelas Balon', tipe: 'lomba', icon: '🎈', kategori: 'Pra-remaja', durasi: 20, status: 'akan_datang' },
  { id: '19', waktu: '14.00 - 14.20', nama: 'Estafet Sedotan Botol', tipe: 'lomba', icon: '🥤', kategori: 'Kelas A', durasi: 20, status: 'akan_datang' },
  { id: '20', waktu: '14.20 - 14.40', nama: 'Air Spons', tipe: 'lomba', icon: '🧽', kategori: 'PAUD', durasi: 20, status: 'akan_datang' },
  { id: '21', waktu: '14.40 - 15.00', nama: 'Karung Helm', tipe: 'lomba', icon: '⛑️', kategori: 'Kelas C', durasi: 20, status: 'akan_datang' },
  { id: '22', waktu: '15.00 - 15.20', nama: 'Pingpong Air', tipe: 'lomba', icon: '🏓', kategori: 'Pra-remaja', durasi: 20, status: 'akan_datang' },
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
  { area: 'Komplek Bawah', warga: ['Bapak Warnan','Ibu Ita','Ibu Maya','Bapak Mariman','Bapak Rustam','Bapak Iman','Ibu Yuli','Ibu Wina','Bapak Kasino','Bapak Iwan','Bapak Sofian','Bapak Arfan'] },
  { area: 'Komplek Atas', warga: ['Bapak Ali','Bapak Agung','Bapak Radi','Mba Siti','Bapak Kasno','Bapak Pandi','Ibu Mia','Bapak Gunadi','Bapak Opang','Bapak Supdi','Bapak Hadi','Bapak Suni','Bapak Marwan','Bapak Angga','Bapak Gito','Bapak Budi','Ibu Lia'] },
  { area: 'Luar Komplek', warga: ['Bapak Pur','Ibu Wagiyem','Bapak Sapto','Bapak Sabit','Bapak Fendy','Ibu Untung','Bapak Usm'] },
];

const DEFAULT_HADIAH = [
  { posisi: 1, label: 'Juara 1', hadiah: 'Tropi + Bingkisan 🏆', icon: '🥇' },
  { posisi: 2, label: 'Juara 2', hadiah: 'Tropi + Bingkisan 🎁', icon: '🥈' },
  { posisi: 3, label: 'Juara 3', hadiah: 'Tropi + Bingkisan 🎀', icon: '🥉' },
];

const getHadiah = (hadiahMap, kategori, jk) => {
  if (hadiahMap[kategori]?.[jk]) return hadiahMap[kategori][jk];
  return DEFAULT_HADIAH;
};

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

const s = {
  container: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: COLORS.cream },
  header: { background: `linear-gradient(135deg, ${COLORS.red}, ${COLORS.darkRed})`, paddingTop: 50, paddingBottom: 30, textAlign: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: COLORS.white, letterSpacing: 4 },
  headerSub: { fontSize: 14, color: COLORS.white, marginTop: 4, letterSpacing: 2 },
  headerYear: { fontSize: 18, fontWeight: 'bold', color: COLORS.gold, marginTop: 10, letterSpacing: 3 },
  card: { background: COLORS.white, borderRadius: 16, padding: 20, margin: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 15, padding: '0 16px' },
  badge: (color) => ({ background: color, color: COLORS.white, padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 'bold' }),
  tab: { flex: 1, textAlign: 'center', padding: '8px 0', cursor: 'pointer', border: 'none', background: 'none', color: COLORS.white, fontSize: 11, fontWeight: 'bold' },
  tabActive: { color: COLORS.gold },
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
        <div style={{ fontSize: 60 }}>🇮🇩</div>
        <div style={s.headerTitle}>DIRGAHAYU RI</div>
        <div style={s.headerSub}>REPUBLIK INDONESIA</div>
        <div style={s.headerYear}>17 AGUSTUS 2026</div>
      </div>

      <div style={s.card}>
        <div style={{ textAlign: 'center', fontSize: 12, color: COLORS.gray }}>Hitung Mundur Menuju</div>
        <div style={{ textAlign: 'center', fontSize: 22, fontWeight: 'bold', color: COLORS.red, marginBottom: 15 }}>HARI KEMERDEKAAN</div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {[['Hari', cd.d], ['Jam', cd.h], ['Menit', cd.m], ['Detik', cd.s]].map(([l, v]) => (
            <div key={l} style={{ textAlign: 'center', background: COLORS.lightGray, borderRadius: 10, padding: '12px 14px', minWidth: 70 }}>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: COLORS.red }}>{String(v).padStart(2, '0')}</div>
              <div style={{ fontSize: 11, color: COLORS.gray, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        <div style={s.sectionTitle}>Menu Utama</div>
        {menuItems.map((item) => (
          <div key={item.key} onClick={() => onNavigate(item.key)} style={{ display: 'flex', alignItems: 'center', background: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
            <div style={{ width: 50, height: 50, borderRadius: 25, background: COLORS.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{item.icon}</div>
            <div style={{ flex: 1, marginLeft: 15 }}>
              <div style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.darkGray }}>{item.title}</div>
              <div style={{ fontSize: 12, color: COLORS.gray, marginTop: 2 }}>{item.desc}</div>
            </div>
            <div style={{ fontSize: 30, color: COLORS.red, fontWeight: 'bold' }}>›</div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', padding: 30, marginTop: 10 }}>
        <div style={{ fontSize: 14, color: COLORS.gray }}>Merah Putih tetap berkibar!</div>
        <div style={{ fontSize: 40, marginTop: 10 }}>🎖️</div>
      </div>
    </div>
  );
}

const EMOJI_OPTIONS = ['🏃','🧗','🍘','🥄','🪢','🩴','⚽','🏐','🎯','🎪','🎮','🎤','🎨','🧩','♟️','🏅','🎲','🤸'];

function LombaScreen() {
  const [jadwal, setJadwal] = useState(JADWAL_LINTAS);
  const [selected, setSelected] = useState(null);
  const [filterKategori, setFilterKategori] = useState('Semua');
  const [showEdit, setShowEdit] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({});
  const [now, setNow] = useState(new Date());
  const [stopwatch, setStopwatch] = useState({ running: false, elapsed: 0, lombaId: null });
  const swRef = useRef(null);

  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (stopwatch.running) {
      swRef.current = setInterval(() => {
        setStopwatch(prev => ({ ...prev, elapsed: prev.elapsed + 1 }));
      }, 1000);
    } else {
      clearInterval(swRef.current);
    }
    return () => clearInterval(swRef.current);
  }, [stopwatch.running]);

  const startStopwatch = (lombaId) => {
    setStopwatch({ running: true, elapsed: 0, lombaId });
  };

  const stopStopwatch = () => {
    setStopwatch(prev => ({ ...prev, running: false }));
  };

  const resetStopwatch = () => {
    setStopwatch({ running: false, elapsed: 0, lombaId: null });
  };

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

  const inputSt = { width: '100%', border: `1px solid ${COLORS.lightGray}`, borderRadius: 12, padding: 12, fontSize: 14, marginBottom: 12, background: COLORS.lightGray, color: COLORS.darkGray, outline: 'none' };

  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ ...s.header, paddingBottom: 20 }}>
        <div style={{ fontSize: 40, marginBottom: 5 }}>📋</div>
        <div style={s.headerTitle}>Running Order</div>
        <div style={{ fontSize: 14, color: COLORS.gold, marginTop: 4 }}>17 Agustus 2026</div>
      </div>

      <div style={{ padding: '12px 16px 5px' }}>
        <div style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 6 }}>Filter Kategori:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['Semua', ...semuaKategori].map(k => (
            <button key={k} onClick={() => setFilterKategori(k)} style={{
              display: 'flex', alignItems: 'center', padding: '6px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 11,
              background: filterKategori === k ? COLORS.red : COLORS.white,
              color: filterKategori === k ? COLORS.white : COLORS.darkGray,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>{k}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        <div style={{ textAlign: 'center', padding: '12px 0 4px', fontSize: 24, fontWeight: 'bold', color: COLORS.red, fontVariantNumeric: 'tabular-nums' }}>
          {now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        <div style={{ textAlign: 'center', fontSize: 11, color: COLORS.gray, marginBottom: 8 }}>WIB • {now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>

        {currentIdx !== -1 && (
          <div style={{ background: getTimeLeft(jadwal[currentIdx]) < 0 ? 'linear-gradient(135deg, #FFEBEE, #FFCDD2)' : 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', borderRadius: 12, padding: 14, marginBottom: 12, border: `2px solid ${getTimeLeft(jadwal[currentIdx]) < 0 ? '#DC3545' : COLORS.green}`, textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 'bold', color: getTimeLeft(jadwal[currentIdx]) < 0 ? '#DC3545' : COLORS.green, marginBottom: 4 }}>{getTimeLeft(jadwal[currentIdx]) < 0 ? '⚠️ LEBUR WAKTU' : '🔴 SISA WAKTU'}</div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: getTimeLeft(jadwal[currentIdx]) < 0 ? '#DC3545' : COLORS.darkGray, fontVariantNumeric: 'tabular-nums' }}>{fmtCountdown(getTimeLeft(jadwal[currentIdx]))}</div>
            <div style={{ fontSize: 12, color: COLORS.gray }}>{jadwal[currentIdx].icon} {jadwal[currentIdx].nama} • {jadwal[currentIdx].kategori}</div>
          </div>
        )}

        {stopwatch.running && (
          <div style={{ background: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)', borderRadius: 12, padding: 14, marginBottom: 12, border: `2px solid ${COLORS.orange}`, textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 'bold', color: COLORS.orange, marginBottom: 4 }}>⏱️ STOPWATCH {jadwal.find(j => j.id === stopwatch.lombaId)?.nama || ''}</div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: COLORS.darkGray, fontVariantNumeric: 'tabular-nums' }}>{fmtSw(stopwatch.elapsed)}</div>
            <button onClick={stopStopwatch} style={{ marginTop: 8, padding: '8px 20px', borderRadius: 10, background: COLORS.orange, color: COLORS.white, fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: 12 }}>BERHENTI</button>
            <button onClick={resetStopwatch} style={{ marginTop: 8, marginLeft: 8, padding: '8px 20px', borderRadius: 10, background: COLORS.gray, color: COLORS.white, fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: 12 }}>RESET</button>
          </div>
        )}
        {filtered.map((item, idx) => {
          const status = getStatus(item);
          const isCurrent = status === 'sedang_berlangsung';
          return (
          <div key={item.id} onClick={() => setSelected(item)} style={{ display: 'flex', marginBottom: 2, cursor: 'pointer' }}>
            <div style={{ width: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ width: isCurrent ? 16 : 12, height: isCurrent ? 16 : 12, borderRadius: 8, background: statusColor(status), border: '2px solid white', boxShadow: `0 0 0 2px ${statusColor(status)}`, zIndex: 1, transition: 'all 0.3s' }} />
              {idx < filtered.length - 1 && <div style={{ flex: 1, width: 2, background: '#ddd', minHeight: 20 }} />}
            </div>
            <div style={{ flex: 1, background: isCurrent ? '#E8F5E9' : status === 'selesai' ? '#F5F5F5' : tipeBg(item.tipe), borderRadius: 12, padding: '12px 14px', marginBottom: 8, border: isCurrent ? `2px solid ${COLORS.green}` : 'none', transition: 'all 0.3s' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 22 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 'bold', color: tipeColor(item.tipe), letterSpacing: 0.5 }}>{item.waktu}</div>
                    <div style={{ fontSize: 14, fontWeight: 'bold', color: status === 'selesai' ? COLORS.gray : COLORS.darkGray }}>{item.nama}</div>
                    <div style={{ fontSize: 10, color: statusColor(status), fontWeight: 'bold', marginTop: 2 }}>{statusLabel(status)}</div>
                  </div>
                </div>
                <span style={{ ...s.badge(tipeColor(item.tipe)), fontSize: 10, padding: '2px 8px' }}>{item.kategori}</span>
              </div>
              {isCurrent && item.tipe === 'lomba' && !stopwatch.running && (
                <button onClick={(e) => { e.stopPropagation(); startStopwatch(item.id); }} style={{ marginTop: 8, padding: '6px 14px', borderRadius: 8, background: COLORS.orange, color: COLORS.white, fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: 11 }}>⏱️ Mulai Stopwatch</button>
              )}
              {isCurrent && getTimeLeft(item) !== null && (
                <div style={{ marginTop: 6, fontSize: 12, fontWeight: 'bold', color: getTimeLeft(item) < 0 ? '#DC3545' : statusColor('sedang_berlangsung'), fontVariantNumeric: 'tabular-nums' }}>
                  {getTimeLeft(item) < 0 ? '⚠️ Lebih ' : 'Sisa: '}{fmtCountdown(getTimeLeft(item))}
                </div>
              )}
            </div>
          </div>
          );
        })}
      </div>

      <button onClick={() => { setForm({ nama: '', waktu: '', kategori: 'Umum', icon: '🏃', tipe: 'lomba' }); setEditItem(null); setShowEdit(true); }} style={{ position: 'fixed', right: 20, bottom: 80, width: 60, height: 60, borderRadius: 30, background: COLORS.red, color: COLORS.white, fontSize: 30, fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 100 }}>+</button>

      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: 16, padding: 25, width: '85%', maxWidth: 400, textAlign: 'center' }}>
            <div style={{ fontSize: 50, marginBottom: 10 }}>{selected.icon}</div>
            <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 20, background: tipeColor(selected.tipe), color: COLORS.white, fontSize: 11, fontWeight: 'bold', marginBottom: 10 }}>{selected.tipe.toUpperCase()}</div>
            <div style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 5 }}>{selected.nama}</div>
            <div style={{ fontSize: 16, color: tipeColor(selected.tipe), fontWeight: 'bold', marginBottom: 5 }}>{selected.waktu}</div>
            <div style={{ fontSize: 13, color: statusColor(getStatus(selected)), fontWeight: 'bold', marginBottom: 15 }}>{statusLabel(getStatus(selected))}</div>
            <div style={{ background: tipeBg(selected.tipe), borderRadius: 12, padding: 15, marginBottom: 20, textAlign: 'left' }}>
              <div style={{ marginBottom: 8, fontSize: 14, color: COLORS.darkGray }}>📌 Kategori: <strong>{selected.kategori}</strong></div>
              {selected.durasi && <div style={{ fontSize: 14, color: COLORS.darkGray }}>⏱️ Durasi: <strong>{selected.durasi} menit</strong></div>}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setSelected(null); openEdit(selected); }} style={{ flex: 1, padding: 12, borderRadius: 12, background: COLORS.blue, color: COLORS.white, fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: 13 }}>Edit</button>
              <button onClick={() => handleDeleteItem(selected.id)} style={{ flex: 1, padding: 12, borderRadius: 12, background: '#DC3545', color: COLORS.white, fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: 13 }}>Hapus</button>
              <button onClick={() => setSelected(null)} style={{ flex: 1, padding: 12, borderRadius: 12, background: COLORS.gray, color: COLORS.white, fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: 13 }}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {showEdit && (
        <div onClick={() => setShowEdit(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: 16, padding: 25, width: '85%', maxWidth: 400, maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.darkGray, textAlign: 'center', marginBottom: 20 }}>{editItem ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}</div>

            <div style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 8 }}>Icon:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {EMOJI_OPTIONS.map(em => (
                <div key={em} onClick={() => setForm({...form, icon: em})} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, fontSize: 20, cursor: 'pointer', border: form.icon === em ? `2px solid ${COLORS.red}` : '2px solid transparent', background: form.icon === em ? '#FFE5E5' : COLORS.lightGray }}>{em}</div>
              ))}
            </div>

            <input value={form.nama || ''} onChange={e => setForm({...form, nama: e.target.value})} placeholder="Nama Kegiatan" style={inputSt} />
            <input value={form.waktu || ''} onChange={e => setForm({...form, waktu: e.target.value})} placeholder="Waktu (contoh: 08.00 - 08.20)" style={inputSt} />

            <div style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 8 }}>Tipe:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {[{n:'upacara',l:'Upacara'},{n:'lomba',l:'Lomba'},{n:'persiapan',l:'Persiapan'},{n:'istirahat',l:'Istirahat'},{n:'foto',l:'Foto'},{n:'penutup',l:'Penutup'}].map(t => (
                <button key={t.n} onClick={() => setForm({...form, tipe: t.n})} style={{ padding: '6px 12px', borderRadius: 20, border: form.tipe === t.n ? `2px solid ${tipeColor(t.n)}` : '2px solid transparent', cursor: 'pointer', fontSize: 12, background: form.tipe === t.n ? tipeBg(t.n) : COLORS.lightGray, color: COLORS.darkGray, fontWeight: form.tipe === t.n ? 'bold' : 'normal' }}>{t.l}</button>
              ))}
            </div>

            <div style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 8 }}>Kategori Peserta:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
              {semuaKategori.map(k => (
                <button key={k} onClick={() => setForm({...form, kategori: k})} style={{ padding: '6px 12px', borderRadius: 20, border: form.kategori === k ? `2px solid ${COLORS.red}` : '2px solid transparent', cursor: 'pointer', fontSize: 12, background: form.kategori === k ? '#FFE5E5' : COLORS.lightGray, color: COLORS.darkGray }}>{k}</button>
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
  const [pesertaList, setPesertaList] = useState([...PESERTA_LIST]);
  const [search, setSearch] = useState('');
  const [filterJk, setFilterJk] = useState('Semua');
  const [filterGrup, setFilterGrup] = useState('Semua');
  const [filterKategori, setFilterKategori] = useState('Semua');
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newP, setNewP] = useState({ nama: '', jk: 'L', grup: 'Pra-paud' });

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

  const inputSt = { width: '100%', border: `1px solid ${COLORS.lightGray}`, borderRadius: 12, padding: 12, fontSize: 14, marginBottom: 12, background: COLORS.lightGray, color: COLORS.darkGray, outline: 'none' };

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ ...s.header, paddingBottom: 20 }}>
        <div style={s.headerTitle}>Peserta Lomba</div>
        <div style={{ fontSize: 14, color: COLORS.gold, marginTop: 4 }}>{PESERTA_LIST.length} Peserta Terdaftar</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', background: COLORS.white, borderRadius: 12, margin: 16, padding: '0 15px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <span style={{ fontSize: 18, marginRight: 10 }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari peserta..." style={{ flex: 1, border: 'none', padding: '14px 0', fontSize: 14, outline: 'none', background: 'transparent', color: COLORS.darkGray }} />
      </div>

      <div style={{ padding: '0 16px 10px' }}>
        <div style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 6 }}>Jenis Kelamin:</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[{ key: 'Semua', label: 'Semua', icon: '👥' }, { key: 'L', label: 'Laki-laki', icon: '👦' }, { key: 'P', label: 'Perempuan', icon: '👧' }].map(g => (
            <button key={g.key} onClick={() => setFilterJk(g.key)} style={{
              display: 'flex', alignItems: 'center', padding: '6px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12,
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
        <div style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 6 }}>Grup Usia:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['Semua', ...GRUP_KATEGORI.map(g => g.nama)].map(g => (
            <button key={g} onClick={() => setFilterGrup(g)} style={{
              display: 'flex', alignItems: 'center', padding: '6px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12,
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
        <div style={{ fontSize: 13, fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 6 }}>Kategori:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['Semua', ...KATEGORI_PESERTA.map(k => k.nama)].map(k => (
            <button key={k} onClick={() => setFilterKategori(k)} style={{
              display: 'flex', alignItems: 'center', padding: '6px 12px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12,
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
        <div style={{ fontSize: 12, color: COLORS.gray, marginBottom: 8 }}>Menampilkan {filtered.length} peserta</div>
        {filtered.map(p => (
          <div key={p.id} onClick={() => setSelected(p)} style={{ display: 'flex', alignItems: 'center', background: COLORS.white, borderRadius: 12, padding: 14, marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
            <div style={{ width: 45, height: 45, borderRadius: 25, background: grupColor(p.grup), display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, fontSize: 20, fontWeight: 'bold', color: COLORS.white }}>{p.nama.charAt(0)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.darkGray }}>{p.nama}</div>
              <div style={{ fontSize: 11, color: COLORS.gray, marginTop: 3 }}>{p.grup} • {p.jk === 'L' ? '👦 Laki-laki' : '👧 Perempuan'}</div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <span style={{ ...s.badge(p.jk === 'L' ? '#4A90D9' : '#E91E63'), padding: '2px 8px', fontSize: 11 }}>{p.jk === 'L' ? '👦' : '👧'}</span>
              <span style={s.badge(grupColor(p.grup))}>{p.grup}</span>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => setShowAdd(true)} style={{ position: 'fixed', right: 20, bottom: 80, width: 60, height: 60, borderRadius: 30, background: COLORS.red, color: COLORS.white, fontSize: 30, fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 100 }}>+</button>

      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: 16, padding: 25, width: '85%', maxWidth: 400, textAlign: 'center' }}>
            <div style={{ width: 70, height: 70, borderRadius: 35, background: grupColor(selected.grup), display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: 32, fontWeight: 'bold', color: COLORS.white }}>{selected.nama.charAt(0)}</div>
            <div style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 5 }}>{selected.nama}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 15 }}>
              <span style={s.badge(grupColor(selected.grup))}>{selected.grup}</span>
            </div>
            <div style={{ background: COLORS.lightGray, borderRadius: 12, padding: 15, marginBottom: 20, textAlign: 'left' }}>
              <div style={{ fontSize: 14, color: COLORS.darkGray }}>👥 Grup: <strong>{selected.grup}</strong></div>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: COLORS.red, color: COLORS.white, padding: '12px 30px', borderRadius: 12, border: 'none', fontWeight: 'bold', fontSize: 14, cursor: 'pointer' }}>Tutup</button>
          </div>
        </div>
      )}

      {showAdd && (
        <div onClick={() => setShowAdd(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: 16, padding: 25, width: '85%', maxWidth: 400 }}>
            <div style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.darkGray, textAlign: 'center', marginBottom: 20 }}>Tambah Peserta Baru</div>
            <input value={newP.nama} onChange={e => setNewP({...newP, nama: e.target.value})} placeholder="Nama Peserta" style={{ width: '100%', border: `1px solid ${COLORS.lightGray}`, borderRadius: 12, padding: 12, fontSize: 14, marginBottom: 12, background: COLORS.lightGray, color: COLORS.darkGray }} />
            <div style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 8 }}>Jenis Kelamin:</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {[{ key: 'L', label: '👦 Laki-laki' }, { key: 'P', label: '👧 Perempuan' }].map(g => (
                <button key={g.key} onClick={() => setNewP({...newP, jk: g.key})} style={{ flex: 1, padding: '10px', borderRadius: 12, border: newP.jk === g.key ? `2px solid ${COLORS.blue}` : '2px solid transparent', cursor: 'pointer', fontSize: 13, background: newP.jk === g.key ? '#E3F2FD' : COLORS.lightGray, fontWeight: newP.jk === g.key ? 'bold' : 'normal', color: COLORS.darkGray }}>{g.label}</button>
              ))}
            </div>
            <div style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 8 }}>Pilih Grup:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {GRUP_KATEGORI.map(k => (
                <button key={k.id} onClick={() => setNewP({...newP, grup: k.nama})} style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', borderRadius: 20, border: newP.grup === k.nama ? `2px solid ${COLORS.red}` : '2px solid transparent', cursor: 'pointer', fontSize: 12, background: newP.grup === k.nama ? '#FFE5E5' : COLORS.lightGray, color: newP.grup === k.nama ? COLORS.red : COLORS.darkGray }}>
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
    </div>
  );
}

function PenilaianScreen({ scores, setScores }) {
  const [selectedLomba, setSelectedLomba] = useState(null);
  const [scoreInputs, setScoreInputs] = useState({});

  const lombaList = JADWAL_LINTAS.filter(l => l.tipe === 'lomba');

  const getParticipants = (lomba) => {
    return PESERTA_LIST.filter(p => p.grup === lomba.kategori);
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
          <div onClick={() => { setSelectedLomba(null); setScoreInputs({}); }} style={{ position: 'absolute', left: 16, top: 50, fontSize: 28, color: COLORS.white, cursor: 'pointer' }}>←</div>
          <div style={{ fontSize: 40, marginBottom: 5 }}>{selectedLomba.icon}</div>
          <div style={s.headerTitle}>Penilaian</div>
          <div style={{ fontSize: 14, color: COLORS.gold, marginTop: 4 }}>{selectedLomba.nama} • {selectedLomba.kategori}</div>
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
                    <div style={{ fontSize: 15, fontWeight: 'bold', color: jk === 'L' ? '#4A90D9' : '#E91E63', marginBottom: 8, marginTop: 12, padding: '4px 8px', background: jk === 'L' ? '#E3F2FD' : '#FCE4EC', borderRadius: 8 }}>{label} ({group.length})</div>
                    {group.map((p, i) => (
                      <div key={p.id} style={{ display: 'flex', alignItems: 'center', background: COLORS.white, borderRadius: 12, padding: 14, marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 18, background: jk === 'L' ? '#4A90D9' : '#E91E63', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, fontSize: 14, fontWeight: 'bold', color: COLORS.white }}>{i + 1}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.darkGray }}>{p.nama}</div>
                          <div style={{ fontSize: 11, color: COLORS.gray }}>{p.grup} • {p.jk === 'L' ? '👦' : '👧'}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0-100"
                            value={scoreInputs[p.id] !== undefined ? scoreInputs[p.id] : getScore(selectedLomba.id, p.id)}
                            onChange={(e) => handleScoreChange(p.id, e.target.value)}
                            style={{ width: 70, padding: '8px 6px', borderRadius: 8, border: `2px solid ${COLORS.lightGray}`, textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: COLORS.darkGray, outline: 'none' }}
                          />
                          <span style={{ fontSize: 12, color: COLORS.gray }}>poin</span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </>
          )}
          {participants.length > 0 && (
            <button onClick={handleSaveScores} style={{ width: '100%', padding: 14, borderRadius: 12, background: COLORS.green, color: COLORS.white, fontWeight: 'bold', fontSize: 16, border: 'none', cursor: 'pointer', marginTop: 10 }}>Simpan Penilaian</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={s.header}>
        <div style={s.headerTitle}>Penilaian Lomba</div>
        <div style={{ fontSize: 14, color: COLORS.gold, marginTop: 4 }}>Pilih lomba untuk memberi penilaian</div>
      </div>

      <div style={{ padding: 16 }}>
        {lombaList.map(l => {
          const participants = getParticipants(l);
          const lScores = scores[l.id] || {};
          const scored = Object.keys(lScores).length;
          return (
            <div key={l.id} onClick={() => { setSelectedLomba(l); setScoreInputs({}); }} style={{ display: 'flex', alignItems: 'center', background: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
              <div style={{ width: 50, height: 50, borderRadius: 25, background: scored > 0 ? COLORS.green : COLORS.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginRight: 15 }}>{l.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.darkGray }}>{l.nama}</div>
                <div style={{ fontSize: 12, color: COLORS.gray, marginTop: 2 }}>{l.kategori} • {participants.length} peserta • {scored > 0 ? `${scored}/${participants.length} dinilai` : 'Belum dinilai'}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {scored > 0 && <span style={s.badge(COLORS.green)}>✓</span>}
                <span style={{ fontSize: 24, color: COLORS.gray }}>›</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function JuaraScreen({ scores, hadiahMap }) {
  const [selectedLomba, setSelectedLomba] = useState(null);

  const lombaList = JADWAL_LINTAS.filter(l => l.tipe === 'lomba');

  const getParticipants = (lomba) => {
    return PESERTA_LIST.filter(p => p.grup === lomba.kategori);
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

  if (selectedLomba) {
    const ranking = getRanking(selectedLomba);
    const hasScores = ranking.some(r => r.score !== null);

    return (
      <div style={{ paddingBottom: 20 }}>
        <div style={{ ...s.header, paddingBottom: 20 }}>
          <div onClick={() => setSelectedLomba(null)} style={{ position: 'absolute', left: 16, top: 50, fontSize: 28, color: COLORS.white, cursor: 'pointer' }}>←</div>
          <div style={{ fontSize: 40, marginBottom: 5 }}>{selectedLomba.icon}</div>
          <div style={s.headerTitle}>Juara Lomba</div>
          <div style={{ fontSize: 14, color: COLORS.gold, marginTop: 4 }}>{selectedLomba.nama} • {selectedLomba.kategori}</div>
        </div>

        <div style={{ padding: 16 }}>
          {!hasScores ? (
            <div style={{ textAlign: 'center', padding: 50, color: COLORS.gray }}>
              <div style={{ fontSize: 50, marginBottom: 15 }}>📋</div>
              <div style={{ fontSize: 16, marginBottom: 5 }}>Belum ada penilaian</div>
              <div style={{ fontSize: 13 }}>Silakan beri penilaian di menu Penilaian terlebih dahulu</div>
            </div>
          ) : (
            [['L', '👦 Laki-laki'], ['P', '👧 Perempuan']].map(([jk, label]) => {
              const group = ranking.filter(r => r.score !== null && r.jk === jk);
              if (group.length === 0) return null;
              return (
                <div key={jk}>
                  <div style={{ fontSize: 15, fontWeight: 'bold', color: jk === 'L' ? '#4A90D9' : '#E91E63', marginBottom: 8, marginTop: 12, padding: '4px 8px', background: jk === 'L' ? '#E3F2FD' : '#FCE4EC', borderRadius: 8 }}>{label}</div>
                  {group.map((r, i) => (
                    <div key={r.id} style={{ background: i < 3 ? `linear-gradient(135deg, ${medalColor(i)}22, ${medalColor(i)}11)` : COLORS.white, borderRadius: 16, padding: 16, marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: i < 3 ? `2px solid ${medalColor(i)}55` : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: 45, height: 45, borderRadius: 25, background: i < 3 ? medalColor(i) : COLORS.gray, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 15, fontSize: i < 3 ? 22 : 16, fontWeight: 'bold', color: COLORS.white }}>{medalEmoji(i)}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.darkGray }}>{r.nama}</div>
                          <div style={{ fontSize: 12, color: COLORS.gray, marginTop: 2 }}>{r.grup}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.red }}>{r.score}</div>
                          <div style={{ fontSize: 11, color: COLORS.gray }}>poin</div>
                        </div>
                      </div>
                      {i < 3 && (
                        <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${medalColor(i)}33`, fontSize: 13, color: medalColor(i), fontWeight: 'bold', textAlign: 'center' }}>
                          {getHadiah(hadiahMap, selectedLomba.kategori, jk)[i].icon} {getHadiah(hadiahMap, selectedLomba.kategori, jk)[i].hadiah}
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
        <div style={{ fontSize: 50, marginBottom: 5 }}>🏆</div>
        <div style={s.headerTitle}>Daftar Juara</div>
        <div style={{ fontSize: 14, color: COLORS.gold, marginTop: 4 }}>Hasil penilaian seluruh lomba</div>
      </div>

      {hasAnyScores && (
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 12 }}>🏅 Juara Umum (Rata-rata Poin)</div>
          {overall.length > 0 ? (
            [['L', '👦 Laki-laki'], ['P', '👧 Perempuan']].map(([jk, label]) => {
              const group = overall.filter(r => r.jk === jk).slice(0, 3);
              if (group.length === 0) return null;
              return (
                <div key={jk} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 'bold', color: jk === 'L' ? '#4A90D9' : '#E91E63', marginBottom: 8, padding: '4px 8px', background: jk === 'L' ? '#E3F2FD' : '#FCE4EC', borderRadius: 8 }}>{label}</div>
                  {group.map((r, i) => (
                    <div key={r.id} style={{ background: i < 3 ? `linear-gradient(135deg, ${medalColor(i)}22, ${medalColor(i)}11)` : COLORS.white, borderRadius: 16, padding: 14, marginBottom: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: i < 3 ? `2px solid ${medalColor(i)}55` : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: 42, height: 42, borderRadius: 25, background: i < 3 ? medalColor(i) : COLORS.gray, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, fontSize: i < 3 ? 20 : 14, fontWeight: 'bold', color: COLORS.white }}>{medalEmoji(i)}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.darkGray }}>{r.name}</div>
                          <div style={{ fontSize: 11, color: COLORS.gray }}>{r.rt} • {r.count} lomba</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.red }}>{r.avg.toFixed(1)}</div>
                          <div style={{ fontSize: 11, color: COLORS.gray }}>rata-rata</div>
                        </div>
                      </div>
                      {i < 3 && (
                        <div style={{ marginTop: 6, paddingTop: 6, borderTop: `1px solid ${medalColor(i)}33`, fontSize: 12, color: medalColor(i), fontWeight: 'bold', textAlign: 'center' }}>
                          {getHadiah(hadiahMap, r.rt, jk)[i].icon} {getHadiah(hadiahMap, r.rt, jk)[i].hadiah}
                        </div>
                      )}
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
        <div style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 12 }}>📋 Juara Per Lomba</div>
        {lombaList.map(l => {
          const participants = getParticipants(l);
          const ranking = getRanking(l).filter(r => r.score !== null);
          const hasData = ranking.length > 0;

          return (
            <div key={l.id} onClick={() => hasData && setSelectedLomba(l)} style={{ background: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: hasData ? 'pointer' : 'default', opacity: hasData ? 1 : 0.6 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: hasData ? 12 : 0 }}>
                <div style={{ fontSize: 32, marginRight: 12 }}>{l.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 'bold', color: COLORS.darkGray }}>{l.nama}</div>
                  <div style={{ fontSize: 12, color: COLORS.gray }}>{l.kategori} • {participants.length} peserta</div>
                </div>
                {hasData && <span style={{ fontSize: 24, color: COLORS.gray }}>›</span>}
              </div>
              {hasData && [['L', '👦'], ['P', '👧']].map(([jk, icon]) => {
                const g = ranking.filter(r => r.jk === jk).slice(0, 3);
                if (g.length === 0) return null;
                return (
                  <div key={jk}>
                    <div style={{ fontSize: 12, fontWeight: 'bold', color: jk === 'L' ? '#4A90D9' : '#E91E63', marginTop: 6, marginBottom: 4 }}>{icon} {jk === 'L' ? 'Laki-laki' : 'Perempuan'}</div>
                    {g.map((r, i) => (
                      <div key={r.id} style={{ padding: '4px 0', borderTop: i > 0 ? `1px solid ${COLORS.lightGray}` : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ width: 28, textAlign: 'center', fontSize: 16 }}>{medalEmoji(i)}</span>
                          <span style={{ flex: 1, fontSize: 13, color: COLORS.darkGray, marginLeft: 6 }}>{r.nama}</span>
                          <span style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.red }}>{r.score} poin</span>
                        </div>
                        <div style={{ marginTop: 2, marginLeft: 34, fontSize: 11, color: medalColor(i), fontWeight: 'bold' }}>
                          {getHadiah(hadiahMap, l.kategori, jk)[i].icon} {getHadiah(hadiahMap, l.kategori, jk)[i].hadiah}
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

function HadiahScreen({ hadiahMap, setHadiahMap }) {
  return <div>HadiahScreen stub</div>;
}

function KeuanganScreen() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [filterBayar, setFilterBayar] = useState('Semua');
  const [statusBayar, setStatusBayar] = useState({});
  const [wargaList, setWargaList] = useState(DATA_KEUANGAN.map(g => ({ ...g, warga: [...g.warga] })));
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [newWarga, setNewWarga] = useState({ nama: '', area: DATA_KEUANGAN[0].area });
  const [editNama, setEditNama] = useState('');
  const iuranPerWarga = 65000;

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
  const totalLunas = Object.values(statusBayar).filter(v => v === 'lunas').length;
  const totalIuran = totalWarga * iuranPerWarga;
  const totalTerkumpul = totalLunas * iuranPerWarga;
  const totalKurang = totalIuran - totalTerkumpul;

  const fmt = (n) => 'Rp ' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ ...s.header, paddingBottom: 20 }}>
        <div style={{ fontSize: 50, marginBottom: 5 }}>💰</div>
        <div style={s.headerTitle}>Keuangan</div>
        <div style={{ fontSize: 14, color: COLORS.gold, marginTop: 4 }}>Iuran {fmt(iuranPerWarga)}/warga</div>
      </div>

      <div style={{ padding: 16, display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, background: COLORS.white, borderRadius: 12, padding: 12, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: 11, color: COLORS.gray }}>Target</div>
          <div style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.darkGray }}>{fmt(totalIuran)}</div>
        </div>
        <div style={{ flex: 1, background: COLORS.white, borderRadius: 12, padding: 12, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: 11, color: COLORS.gray }}>Terkumpul</div>
          <div style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.green }}>{fmt(totalTerkumpul)}</div>
        </div>
        <div style={{ flex: 1, background: COLORS.white, borderRadius: 12, padding: 12, textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: 11, color: COLORS.gray }}>Kurang</div>
          <div style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.red }}>{fmt(totalKurang)}</div>
        </div>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', gap: 6 }}>
        {[{ key: 'Semua', label: `Semua (${totalWarga})` }, { key: 'lunas', label: `✅ Lunas (${totalLunas})` }, { key: 'belum', label: `❌ Belum (${totalWarga - totalLunas})` }].map(f => (
          <button key={f.key} onClick={() => setFilterBayar(f.key)} style={{
            flex: 1, padding: '8px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 'bold',
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
          const terkumpulArea = lunasArea * iuranPerWarga;
          return (
            <div key={g.area} style={{ background: COLORS.white, borderRadius: 16, marginBottom: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <div onClick={() => setSelectedArea(selectedArea === g.area ? null : g.area)} style={{ display: 'flex', alignItems: 'center', padding: 16, cursor: 'pointer', background: `linear-gradient(135deg, ${COLORS.red}11, ${COLORS.darkRed}11)` }}>
                <div style={{ fontSize: 28, marginRight: 12 }}>{g.area === 'Komplek Bawah' ? '⬇️' : g.area === 'Komplek Atas' ? '⬆️' : '📍'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 'bold', color: COLORS.darkGray }}>{g.area}</div>
                  <div style={{ fontSize: 11, color: COLORS.gray }}>{g.warga.length} warga • {lunasArea} lunas • {fmt(terkumpulArea)} / {fmt(totalArea)}</div>
                </div>
                <span style={{ fontSize: 24, color: COLORS.gray, transform: selectedArea === g.area ? 'rotate(90deg)' : 'rotate(0deg)', transition: '0.2s' }}>›</span>
              </div>
              {selectedArea === g.area && (
                <div style={{ padding: '8px 16px 16px' }}>
                  {filtered.map((nama, i) => {
                    const realIdx = g.warga.indexOf(nama);
                    const lunas = statusBayar[`${g.area}-${realIdx}`] === 'lunas';
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderTop: i > 0 ? `1px solid ${COLORS.lightGray}` : 'none' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 16, background: lunas ? COLORS.green : COLORS.red, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 10, fontSize: 12, fontWeight: 'bold', color: COLORS.white }}>{realIdx + 1}</div>
                        <div style={{ flex: 1, fontSize: 14, color: COLORS.darkGray }}>{nama}</div>
                        <div style={{ fontSize: 11, color: COLORS.gray, marginRight: 8 }}>{fmt(iuranPerWarga)}</div>
                        <button onClick={() => toggleBayar(g.area, realIdx)} style={{
                          padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 'bold',
                          background: lunas ? COLORS.green : COLORS.lightGray,
                          color: lunas ? COLORS.white : COLORS.darkGray,
                          marginRight: 6,
                        }}>
                          {lunas ? '✅ Lunas' : '❌ Belum'}
                        </button>
                        <button onClick={() => { if (confirm(`Hapus ${nama}?`)) { setWargaList(prev => prev.map(gg => gg.area === g.area ? { ...gg, warga: gg.warga.filter((_, fi) => fi !== realIdx) } : gg)); } }} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 16, background: '#FFE5E5', color: COLORS.red, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 4 }}>🗑️</button>
                        <button onClick={() => { setShowEdit({ area: g.area, idx: realIdx }); setEditNama(nama); }} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, background: '#E3F2FD', color: '#4A90D9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✏️</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button onClick={() => setShowAdd(true)} style={{ position: 'fixed', right: 20, bottom: 80, width: 60, height: 60, borderRadius: 30, background: COLORS.red, color: COLORS.white, fontSize: 30, fontWeight: 'bold', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 100 }}>+</button>

      {showAdd && (
        <div onClick={() => setShowAdd(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: 16, padding: 25, width: '85%', maxWidth: 400 }}>
            <div style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.darkGray, textAlign: 'center', marginBottom: 20 }}>Tambah Warga</div>
            <input value={newWarga.nama} onChange={e => setNewWarga({...newWarga, nama: e.target.value})} placeholder="Nama warga..." style={{ width: '100%', border: `1px solid ${COLORS.lightGray}`, borderRadius: 12, padding: 12, fontSize: 14, marginBottom: 12, background: COLORS.lightGray, color: COLORS.darkGray, boxSizing: 'border-box' }} />
            <div style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.darkGray, marginBottom: 8 }}>Pilih Area:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {DATA_KEUANGAN.map(a => (
                <button key={a.area} onClick={() => setNewWarga({...newWarga, area: a.area})} style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', borderRadius: 20, border: newWarga.area === a.area ? `2px solid ${COLORS.red}` : '2px solid transparent', cursor: 'pointer', fontSize: 12, background: newWarga.area === a.area ? '#FFE5E5' : COLORS.lightGray, color: newWarga.area === a.area ? COLORS.red : COLORS.darkGray }}>{a.area}</button>
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
            <div style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.darkGray, textAlign: 'center', marginBottom: 20 }}>Edit Warga</div>
            <input value={editNama} onChange={e => setEditNama(e.target.value)} placeholder="Nama warga..." style={{ width: '100%', border: `1px solid ${COLORS.lightGray}`, borderRadius: 12, padding: 12, fontSize: 14, marginBottom: 20, background: COLORS.lightGray, color: COLORS.darkGray, boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowEdit(null)} style={{ flex: 1, padding: 12, borderRadius: 12, background: COLORS.lightGray, color: COLORS.darkGray, fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Batal</button>
              <button onClick={() => { if (editNama) { setWargaList(prev => prev.map(gg => gg.area === showEdit.area ? { ...gg, warga: gg.warga.map((w, wi) => wi === showEdit.idx ? editNama : w) } : gg)); setShowEdit(null); } else alert('Isi nama warga'); }} style={{ flex: 1, padding: 12, borderRadius: 12, background: COLORS.red, color: COLORS.white, fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState('home');
  const [scores, setScores] = useState({});
  const [hadiahMap, setHadiahMap] = useState({});

  const screens = {
    home: <HomeScreen onNavigate={setTab} />,
    lomba: <LombaScreen />,
    peserta: <PesertaScreen />,
    penilaian: <PenilaianScreen scores={scores} setScores={setScores} />,
    hadiah: <HadiahScreen hadiahMap={hadiahMap} setHadiahMap={setHadiahMap} />,
    juara: <JuaraScreen scores={scores} hadiahMap={hadiahMap} />,
    keuangan: <KeuanganScreen />,
  };

  const tabs = [
    { key: 'home', label: 'Beranda', icon: '🏠' },
    { key: 'lomba', label: 'Lomba', icon: '🏆' },
    { key: 'penilaian', label: 'Penilaian', icon: '📋' },
    { key: 'hadiah', label: 'Hadiah', icon: '🎁' },
    { key: 'juara', label: 'Juara', icon: '🥇' },
    { key: 'keuangan', label: 'Keuangan', icon: '💰' },
    { key: 'peserta', label: 'Peserta', icon: '👤' },
  ];

  return (
    <div style={s.container}>
      <div style={{ flex: 1 }}>{screens[tab]}</div>
      <div style={{ display: 'flex', background: `linear-gradient(135deg, ${COLORS.red}, ${COLORS.darkRed})`, paddingBottom: 10, paddingTop: 8, boxShadow: '0 -4px 12px rgba(0,0,0,0.3)' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ ...s.tab, ...(tab === t.key ? s.tabActive : {}) }}>
            <div style={{ fontSize: 22 }}>{t.icon}</div>
            <div style={{ marginTop: 2 }}>{t.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
