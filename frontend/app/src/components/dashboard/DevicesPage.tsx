import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Thermometer, Lightbulb, Droplets, Wind,
  Tv, Refrigerator, WashingMachine, Microwave,
  Power, TrendingUp, Clock, Zap, Plus, Trash2,
} from 'lucide-react';

const ikonlar: Record<string, React.ElementType> = {
  Thermometer, Lightbulb, Droplets, Wind,
  Tv, Refrigerator, WashingMachine, Microwave, Zap,
};

const saatlikIstifade = [
  { saat: '00', guc: 1.2 }, { saat: '03', guc: 0.8 },
  { saat: '06', guc: 1.5 }, { saat: '09', guc: 3.2 },
  { saat: '12', guc: 4.8 }, { saat: '15', guc: 5.1 },
  { saat: '18', guc: 6.3 }, { saat: '21', guc: 4.2 },
];

const baslangicCihazlar = [
  { id: 1, ad: 'İstilik Sistemi',  ikonAd: 'Thermometer',   oda: 'Qonaq otağı',   guc: 2400, aktiv: false, avtomatik: true,  gunlukIstifade: 4.8 },
  { id: 2, ad: 'İşıqlandırma',     ikonAd: 'Lightbulb',     oda: 'Bütün otaqlar', guc: 120,  aktiv: true,  avtomatik: false, gunlukIstifade: 0.8 },
  { id: 3, ad: 'Su Qızdırıcı',     ikonAd: 'Droplets',      oda: 'Hamam',         guc: 3000, aktiv: false, avtomatik: true,  gunlukIstifade: 3.2 },
  { id: 4, ad: 'Kondisioner',       ikonAd: 'Wind',          oda: 'Yataq otağı',   guc: 1800, aktiv: true,  avtomatik: false, gunlukIstifade: 5.4 },
  { id: 5, ad: 'Televizor',         ikonAd: 'Tv',            oda: 'Qonaq otağı',   guc: 150,  aktiv: true,  avtomatik: false, gunlukIstifade: 1.2 },
  { id: 6, ad: 'Soyuducu',          ikonAd: 'Refrigerator',  oda: 'Mətbəx',        guc: 180,  aktiv: true,  avtomatik: false, gunlukIstifade: 2.1 },
  { id: 7, ad: 'Paltar Yuyucu',     ikonAd: 'WashingMachine',oda: 'Mətbəx',        guc: 2200, aktiv: false, avtomatik: false, gunlukIstifade: 1.8 },
  { id: 8, ad: 'Mikrodalğa',        ikonAd: 'Microwave',     oda: 'Mətbəx',        guc: 900,  aktiv: false, avtomatik: false, gunlukIstifade: 0.5 },
];

const odaSecenekleri = ['Qonaq otağı', 'Yataq otağı', 'Mətbəx', 'Hamam', 'Bütün otaqlar', 'Ümumi'];
const ikonSecenekleri = Object.keys(ikonlar);

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div style={{ padding: 10, background: 'rgba(0,42,53,0.95)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8 }}>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginBottom: 4 }}>{label}:00</p>
      <span style={{ fontSize: 13, color: '#94d2bd', fontFamily: 'JetBrains Mono' }}>{payload[0]?.value} kW</span>
    </div>
  );
}

export default function DevicesPage() {
  const [cihazliste, setCihazliste] = useState(baslangicCihazlar);
  const [secilmisOda, setSecilmisOda] = useState('Hamısı');
  const [modalAciq, setModalAciq] = useState(false);
  const [yeniCihaz, setYeniCihaz] = useState({ ad: '', ikonAd: 'Zap', oda: 'Qonaq otağı', guc: 100, avtomatik: false });

  const odalar = ['Hamısı', ...odaSecenekleri];

  const toggle = (id: number) => {
    setCihazliste(prev => prev.map(c => c.id === id ? { ...c, aktiv: !c.aktiv } : c));
  };

  const sil = (id: number) => {
    setCihazliste(prev => prev.filter(c => c.id !== id));
  };

  const elave = () => {
    if (!yeniCihaz.ad.trim()) return;
    setCihazliste(prev => [...prev, {
      id: Date.now(),
      ad: yeniCihaz.ad,
      ikonAd: yeniCihaz.ikonAd,
      oda: yeniCihaz.oda,
      guc: yeniCihaz.guc,
      aktiv: false,
      avtomatik: yeniCihaz.avtomatik,
      gunlukIstifade: +(yeniCihaz.guc * 8 / 1000).toFixed(1),
    }]);
    setYeniCihaz({ ad: '', ikonAd: 'Zap', oda: 'Qonaq otağı', guc: 100, avtomatik: false });
    setModalAciq(false);
  };

  const filteredCihazlar = secilmisOda === 'Hamısı' ? cihazliste : cihazliste.filter(c => c.oda === secilmisOda);
  const aktivSayi = cihazliste.filter(c => c.aktiv).length;
  const umumiGuc = cihazliste.filter(c => c.aktiv).reduce((sum, c) => sum + c.guc, 0);
  const gunlukCemi = cihazliste.reduce((sum, c) => sum + c.gunlukIstifade, 0);

  const inputSt = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 8, color: '#fff',
    padding: '8px 12px', fontSize: 13, width: '100%', outline: 'none',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Stat kartları */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { label: 'Aktiv Cihazlar',   value: `${aktivSayi} / ${cihazliste.length}`, color: '#2a9d8f', icon: Power,     alt: 'İşləyir' },
          { label: 'Cari Güc',         value: `${(umumiGuc/1000).toFixed(1)} kW`,    color: '#e9d8a6', icon: Zap,       alt: 'Anlıq istehlak' },
          { label: 'Günlük İstifadə',  value: `${gunlukCemi.toFixed(1)} kWh`,        color: '#94d2bd', icon: TrendingUp, alt: 'Bu gün' },
          { label: 'Avtomatik',        value: `${cihazliste.filter(c=>c.avtomatik).length} cihaz`, color: '#0a9396', icon: Clock, alt: 'Cədvəllə' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="liquid-glass" style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Icon style={{ width: 16, height: 16, color: s.color }} />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{s.label}</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 600, color: s.color, fontFamily: 'JetBrains Mono', marginBottom: 4 }}>{s.value}</div>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{s.alt}</span>
            </div>
          );
        })}
      </div>

      {/* Cihazlar + Qrafik */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
        <div className="liquid-glass" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: 0 }}>Cihazlar</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {odalar.map(oda => (
                  <button key={oda} onClick={() => setSecilmisOda(oda)} style={{
                    padding: '3px 10px', fontSize: 10, borderRadius: 6, border: 'none', cursor: 'pointer',
                    background: secilmisOda === oda ? 'rgba(255,255,255,0.14)' : 'transparent',
                    color: secilmisOda === oda ? '#fff' : 'rgba(255,255,255,0.4)',
                    transition: 'all 0.2s',
                  }}>{oda}</button>
                ))}
              </div>
              <button
                onClick={() => setModalAciq(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '5px 12px', fontSize: 11, borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: 'rgba(42,157,143,0.2)', color: '#2a9d8f', fontWeight: 500,
                }}
              >
                <Plus style={{ width: 13, height: 13 }} /> Əlavə et
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredCihazlar.map(c => {
              const Icon = ikonlar[c.ikonAd] || Zap;
              return (
                <div key={c.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: c.aktiv ? 'rgba(42,157,143,0.08)' : 'rgba(255,255,255,0.03)',
                  borderRadius: 10,
                  border: `1px solid ${c.aktiv ? 'rgba(42,157,143,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  transition: 'all 0.2s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8,
                      background: c.aktiv ? 'rgba(42,157,143,0.15)' : 'rgba(255,255,255,0.06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon style={{ width: 18, height: 18, color: c.aktiv ? '#2a9d8f' : 'rgba(255,255,255,0.4)' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500, color: '#fff', margin: 0 }}>{c.ad}</p>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{c.oda} · {c.guc} W</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {c.avtomatik && (
                      <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 4, background: 'rgba(233,216,166,0.12)', color: '#e9d8a6' }}>AVT</span>
                    )}
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono' }}>{c.gunlukIstifade} kWh</span>
                    <div onClick={() => toggle(c.id)} style={{
                      width: 40, height: 22, borderRadius: 11, cursor: 'pointer',
                      background: c.aktiv ? '#2a9d8f' : 'rgba(255,255,255,0.12)',
                      position: 'relative', transition: 'background 0.2s',
                    }}>
                      <div style={{
                        position: 'absolute', top: 3,
                        left: c.aktiv ? 21 : 3,
                        width: 16, height: 16, borderRadius: '50%',
                        background: '#fff', transition: 'left 0.2s',
                      }} />
                    </div>
                    <button onClick={() => sil(c.id)} style={{
                      background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.2)',
                      borderRadius: 6, padding: '5px 7px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                    }}>
                      <Trash2 style={{ width: 13, height: 13, color: '#e63946' }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Qrafik */}
        <div className="liquid-glass" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 16px 0' }}>Saatlıq İstifadə</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={saatlikIstifade} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="saat" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="guc" fill="#94d2bd" opacity={0.8} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 10 }}>Ən çox istehlak</p>
            {[...cihazliste].sort((a, b) => b.gunlukIstifade - a.gunlukIstifade).slice(0, 3).map((c, i) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono', width: 16 }}>{i + 1}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{c.ad}</span>
                </div>
                <span style={{ fontSize: 12, color: '#94d2bd', fontFamily: 'JetBrains Mono' }}>{c.gunlukIstifade} kWh</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalAciq && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setModalAciq(false)}>
          <div className="liquid-glass" style={{ width: 400, padding: 24 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 16, fontWeight: 500, color: '#fff', margin: '0 0 20px 0' }}>Yeni Cihaz Əlavə Et</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>Cihaz adı</label>
                <input value={yeniCihaz.ad} onChange={e => setYeniCihaz(p => ({ ...p, ad: e.target.value }))}
                  placeholder="Məs: Ütü" style={inputSt} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>İkon</label>
                  <select value={yeniCihaz.ikonAd} onChange={e => setYeniCihaz(p => ({ ...p, ikonAd: e.target.value }))} style={inputSt}>
                    {ikonSecenekleri.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>Otaq</label>
                  <select value={yeniCihaz.oda} onChange={e => setYeniCihaz(p => ({ ...p, oda: e.target.value }))} style={inputSt}>
                    {odaSecenekleri.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6 }}>Güc (W)</label>
                <input type="number" value={yeniCihaz.guc} onChange={e => setYeniCihaz(p => ({ ...p, guc: +e.target.value }))}
                  style={inputSt} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div onClick={() => setYeniCihaz(p => ({ ...p, avtomatik: !p.avtomatik }))} style={{
                  width: 40, height: 22, borderRadius: 11, cursor: 'pointer',
                  background: yeniCihaz.avtomatik ? '#2a9d8f' : 'rgba(255,255,255,0.12)',
                  position: 'relative', transition: 'background 0.2s',
                }}>
                  <div style={{
                    position: 'absolute', top: 3, left: yeniCihaz.avtomatik ? 21 : 3,
                    width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s',
                  }} />
                </div>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Avtomatik idarəetmə</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setModalAciq(false)} style={{
                flex: 1, padding: '10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)',
                background: 'transparent', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 13,
              }}>Ləğv et</button>
              <button onClick={elave} style={{
                flex: 1, padding: '10px', borderRadius: 8, border: 'none',
                background: 'rgba(42,157,143,0.8)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500,
              }}>Əlavə et</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}