import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Thermometer, Lightbulb, Droplets, Wind,
  Tv, Refrigerator, WashingMachine, Microwave,
  Power, TrendingUp, Clock, Zap,
} from 'lucide-react';

const cihazlar = [
  { id: 1, ad: 'İstilik Sistemi',   icon: Thermometer,   oda: 'Qonaq otağı', guc: 2400, aktiv: false, avtomatik: true,  gunlukIstifade: 4.8 },
  { id: 2, ad: 'İşıqlandırma',      icon: Lightbulb,     oda: 'Bütün otaqlar', guc: 120, aktiv: true,  avtomatik: false, gunlukIstifade: 0.8 },
  { id: 3, ad: 'Su Qızdırıcı',      icon: Droplets,      oda: 'Hamam',       guc: 3000, aktiv: false, avtomatik: true,  gunlukIstifade: 3.2 },
  { id: 4, ad: 'Kondisioner',        icon: Wind,          oda: 'Yataq otağı', guc: 1800, aktiv: true,  avtomatik: false, gunlukIstifade: 5.4 },
  { id: 5, ad: 'Televizor',          icon: Tv,            oda: 'Qonaq otağı', guc: 150,  aktiv: true,  avtomatik: false, gunlukIstifade: 1.2 },
  { id: 6, ad: 'Soyuducu',           icon: Refrigerator,  oda: 'Mətbəx',      guc: 180,  aktiv: true,  avtomatik: false, gunlukIstifade: 2.1 },
  { id: 7, ad: 'Paltar Yuyucu',      icon: WashingMachine,oda: 'Mətbəx',      guc: 2200, aktiv: false, avtomatik: false, gunlukIstifade: 1.8 },
  { id: 8, ad: 'Mikrodalğa',         icon: Microwave,     oda: 'Mətbəx',      guc: 900,  aktiv: false, avtomatik: false, gunlukIstifade: 0.5 },
];

const saatlikIstifade = [
  { saat: '00', guc: 1.2 },
  { saat: '03', guc: 0.8 },
  { saat: '06', guc: 1.5 },
  { saat: '09', guc: 3.2 },
  { saat: '12', guc: 4.8 },
  { saat: '15', guc: 5.1 },
  { saat: '18', guc: 6.3 },
  { saat: '21', guc: 4.2 },
];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div style={{
      padding: 10,
      background: 'rgba(0,42,53,0.95)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 8,
    }}>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginBottom: 4 }}>{label}:00</p>
      <span style={{ fontSize: 13, color: '#94d2bd', fontFamily: 'JetBrains Mono' }}>{payload[0]?.value} kW</span>
    </div>
  );
}

export default function DevicesPage() {
  const [cihazliste, setCihazliste] = useState(cihazlar);
  const [secilmisOda, setSecilmisOda] = useState('Hamısı');

  const odalar = ['Hamısı', 'Qonaq otağı', 'Yataq otağı', 'Mətbəx', 'Hamam', 'Bütün otaqlar'];

  const toggle = (id: number) => {
    setCihazliste(prev =>
      prev.map(c => c.id === id ? { ...c, aktiv: !c.aktiv } : c)
    );
  };

  const filteredCihazlar = secilmisOda === 'Hamısı'
    ? cihazliste
    : cihazliste.filter(c => c.oda === secilmisOda);

  const aktivSayi = cihazliste.filter(c => c.aktiv).length;
  const umumiGuc = cihazliste.filter(c => c.aktiv).reduce((sum, c) => sum + c.guc, 0);
  const gunlukCemi = cihazliste.reduce((sum, c) => sum + c.gunlukIstifade, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Yuxarı stat kartları */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <div className="liquid-glass" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Power style={{ width: 16, height: 16, color: '#2a9d8f' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Aktiv Cihazlar</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 600, color: '#fff', fontFamily: 'JetBrains Mono', marginBottom: 4 }}>
            {aktivSayi} <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>/ {cihazliste.length}</span>
          </div>
          <span style={{ fontSize: 11, color: '#2a9d8f' }}>İşləyir</span>
        </div>

        <div className="liquid-glass" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Zap style={{ width: 16, height: 16, color: '#e9d8a6' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Cari Güc</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 600, color: '#e9d8a6', fontFamily: 'JetBrains Mono', marginBottom: 4 }}>
            {(umumiGuc / 1000).toFixed(1)} <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>kW</span>
          </div>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Anlıq istehlak</span>
        </div>

        <div className="liquid-glass" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <TrendingUp style={{ width: 16, height: 16, color: '#94d2bd' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Günlük İstifadə</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 600, color: '#94d2bd', fontFamily: 'JetBrains Mono', marginBottom: 4 }}>
            {gunlukCemi.toFixed(1)} <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>kWh</span>
          </div>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Bu gün</span>
        </div>

        <div className="liquid-glass" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Clock style={{ width: 16, height: 16, color: '#0a9396' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Avtomatik</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 600, color: '#0a9396', fontFamily: 'JetBrains Mono', marginBottom: 4 }}>
            {cihazliste.filter(c => c.avtomatik).length} <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>cihaz</span>
          </div>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Cədvəllə idarə olunur</span>
        </div>
      </div>

      {/* Cihaz siyahısı + Saatlıq qrafik */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>

        {/* Cihazlar */}
        <div className="liquid-glass" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: 0 }}>Cihazlar</h3>
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
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredCihazlar.map(c => {
              const Icon = c.icon;
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
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                        {c.oda} · {c.guc} W
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {c.avtomatik && (
                      <span style={{
                        fontSize: 9, padding: '2px 8px', borderRadius: 4,
                        background: 'rgba(233,216,166,0.12)', color: '#e9d8a6',
                      }}>AVT</span>
                    )}
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'JetBrains Mono' }}>
                      {c.gunlukIstifade} kWh
                    </span>
                    {/* Toggle */}
                    <div
                      onClick={() => toggle(c.id)}
                      style={{
                        width: 40, height: 22, borderRadius: 11, cursor: 'pointer',
                        background: c.aktiv ? '#2a9d8f' : 'rgba(255,255,255,0.12)',
                        position: 'relative', transition: 'background 0.2s',
                      }}
                    >
                      <div style={{
                        position: 'absolute', top: 3,
                        left: c.aktiv ? 21 : 3,
                        width: 16, height: 16, borderRadius: '50%',
                        background: '#fff', transition: 'left 0.2s',
                      }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Saatlıq istifadə qrafiği */}
        <div className="liquid-glass" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 16px 0' }}>
            Saatlıq İstifadə
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={saatlikIstifade} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="saat" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="guc" name="Güc" fill="#94d2bd" opacity={0.8} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          {/* Ən çox işlədən cihazlar */}
          <div style={{ marginTop: 16 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 10 }}>Ən çox istehlak</p>
            {[...cihazliste].sort((a, b) => b.gunlukIstifade - a.gunlukIstifade).slice(0, 3).map((c, i) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'JetBrains Mono', width: 16 }}>
                    {i + 1}
                  </span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{c.ad}</span>
                </div>
                <span style={{ fontSize: 12, color: '#94d2bd', fontFamily: 'JetBrains Mono' }}>
                  {c.gunlukIstifade} kWh
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}