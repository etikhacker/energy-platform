import { useState } from 'react';
import {
  User, Bell, Shield, Zap,
  Globe, ChevronRight, Check, Palette,
} from 'lucide-react';

const bolmeler = [
  { id: 'profil',     icon: User,    ad: 'Profil' },
  { id: 'bildirish',  icon: Bell,    ad: 'Bildirişlər' },
  { id: 'enerji',     icon: Zap,     ad: 'Enerji Parametrləri' },
  { id: 'gorunus',    icon: Palette, ad: 'Görünüş' },
  { id: 'dil',        icon: Globe,   ad: 'Dil və Region' },
  { id: 'tehlukesiz', icon: Shield,  ad: 'Təhlükəsizlik' },
];

function Toggle({ aktiv, onChange }: { aktiv: boolean; onChange: () => void }) {
  return (
    <div onClick={onChange} style={{
      width: 40, height: 22, borderRadius: 11, cursor: 'pointer',
      background: aktiv ? '#2a9d8f' : 'rgba(255,255,255,0.12)',
      position: 'relative', transition: 'background 0.2s', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: 3,
        left: aktiv ? 21 : 3,
        width: 16, height: 16, borderRadius: '50%',
        background: '#fff', transition: 'left 0.2s',
      }} />
    </div>
  );
}

function SectionRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 0',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div>
        <p style={{ fontSize: 13, color: '#fff', margin: 0 }}>{label}</p>
        {desc && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0 0' }}>{desc}</p>}
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [aktivBolme, setAktivBolme] = useState('profil');
  const [rengSxemi, setRengSxemi] = useState('okean');
  const [dil, setDil] = useState('az');
  const [valyuta, setValyuta] = useState('USD');

  const [bildirish, setBildirish] = useState({
    emailBildirish: true,
    pikXeberdar: true,
    batareyaXeberdar: false,
    heftəlikHesabat: true,
    sistemXeberdar: false,
  });

  const [enerji, setEnerji] = useState({
    avtomatikOptimizasiya: true,
    pikSaatlarindenQacin: true,
    batareyaOncelik: false,
    geceSaatlariSarj: true,
  });

  const [gorunus, setGorunus] = useState({
    animasiyalar: true,
    kompaktGoruntuq: false,
  });

  const toggleBildirish = (key: keyof typeof bildirish) => {
    setBildirish(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleEnerji = (key: keyof typeof enerji) => {
    setEnerji(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleGorunus = (key: keyof typeof gorunus) => {
    setGorunus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderMezmun = () => {
    switch (aktivBolme) {

      case 'profil':
        return (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 20px 0' }}>Profil Məlumatları</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 12 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(42,157,143,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, color: '#2a9d8f', fontWeight: 600,
              }}>A</div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: 0 }}>Alex Rivera</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: '2px 0 0 0' }}>alex@aether.io</p>
              </div>
            </div>
            {[
              { label: 'Ad Soyad', value: 'Alex Rivera' },
              { label: 'E-poçt',   value: 'alex@aether.io' },
              { label: 'Telefon',  value: '+994 50 123 45 67' },
              { label: 'Ünvan',    value: 'Bakı, Azərbaycan' },
            ].map((f, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                <input
                  defaultValue={f.value}
                  style={{
                    width: '100%', padding: '10px 14px', fontSize: 13,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8, color: '#fff', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            ))}
            <button style={{
              marginTop: 8, padding: '10px 24px', fontSize: 13, fontWeight: 500,
              background: '#2a9d8f', color: '#fff', border: 'none',
              borderRadius: 8, cursor: 'pointer',
            }}>Yadda Saxla</button>
          </div>
        );

      case 'bildirish':
        return (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 20px 0' }}>Bildiriş Parametrləri</h3>
            <SectionRow label="E-poçt bildirişləri" desc="Vacib hadisələr üçün e-poçt al">
              <Toggle aktiv={bildirish.emailBildirish} onChange={() => toggleBildirish('emailBildirish')} />
            </SectionRow>
            <SectionRow label="Pik saat xəbərdarlığı" desc="Yüksək tarif saatlarından əvvəl xəbərdar et">
              <Toggle aktiv={bildirish.pikXeberdar} onChange={() => toggleBildirish('pikXeberdar')} />
            </SectionRow>
            <SectionRow label="Batareya xəbərdarlığı" desc="Batareya 20%-dən aşağı düşdükdə">
              <Toggle aktiv={bildirish.batareyaXeberdar} onChange={() => toggleBildirish('batareyaXeberdar')} />
            </SectionRow>
            <SectionRow label="Həftəlik hesabat" desc="Həftəlik enerji statistikası">
              <Toggle aktiv={bildirish.heftəlikHesabat} onChange={() => toggleBildirish('heftəlikHesabat')} />
            </SectionRow>
            <SectionRow label="Sistem xəbərdarlıqları" desc="Şəbəkə kəsilməsi və texniki xətalar">
              <Toggle aktiv={bildirish.sistemXeberdar} onChange={() => toggleBildirish('sistemXeberdar')} />
            </SectionRow>
          </div>
        );

      case 'enerji':
        return (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 20px 0' }}>Enerji İdarəetməsi</h3>
            <SectionRow label="Avtomatik optimallaşdırma" desc="Enerji istifadəsini AI ilə optimallaşdır">
              <Toggle aktiv={enerji.avtomatikOptimizasiya} onChange={() => toggleEnerji('avtomatikOptimizasiya')} />
            </SectionRow>
            <SectionRow label="Pik saatlardan qaç" desc="Yüksək tarif saatlarında istehlakı azalt">
              <Toggle aktiv={enerji.pikSaatlarindenQacin} onChange={() => toggleEnerji('pikSaatlarindenQacin')} />
            </SectionRow>
            <SectionRow label="Batareya prioriteti" desc="Şəbəkə əvəzinə batareyadan istifadə et">
              <Toggle aktiv={enerji.batareyaOncelik} onChange={() => toggleEnerji('batareyaOncelik')} />
            </SectionRow>
            <SectionRow label="Gecə saatlarında şarj" desc="23:00-06:00 arasında batareyaları şarj et">
              <Toggle aktiv={enerji.geceSaatlariSarj} onChange={() => toggleEnerji('geceSaatlariSarj')} />
            </SectionRow>
            <div style={{ marginTop: 20 }}>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 8 }}>
                Minimum batareya səviyyəsi: <span style={{ color: '#2a9d8f' }}>20%</span>
              </label>
              <input type="range" min={5} max={50} defaultValue={20} style={{ width: '100%', accentColor: '#2a9d8f' }} />
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 8 }}>
                Pik saat başlangıcı: <span style={{ color: '#2a9d8f' }}>17:00</span>
              </label>
              <input type="range" min={14} max={20} defaultValue={17} style={{ width: '100%', accentColor: '#2a9d8f' }} />
            </div>
          </div>
        );

      case 'gorunus':
        return (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 20px 0' }}>Görünüş</h3>
            <SectionRow label="Animasiyalar" desc="İnterfeys animasiyalarını aktiv et">
              <Toggle aktiv={gorunus.animasiyalar} onChange={() => toggleGorunus('animasiyalar')} />
            </SectionRow>
            <SectionRow label="Kompakt görüntü" desc="Daha sıx məlumat göstər">
              <Toggle aktiv={gorunus.kompaktGoruntuq} onChange={() => toggleGorunus('kompaktGoruntuq')} />
            </SectionRow>
            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 12 }}>Rəng Sxemi</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { ad: 'Dərin Okean', reng: '#001219', kod: 'okean' },
                  { ad: 'Gecə',        reng: '#0d1117', kod: 'gece'  },
                  { ad: 'Tünd Yaşıl',  reng: '#001a1a', kod: 'yasil' },
                ].map((r) => (
                  <div
                    key={r.kod}
                    onClick={() => setRengSxemi(r.kod)}
                    style={{
                      padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
                      background: rengSxemi === r.kod ? 'rgba(42,157,143,0.15)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${rengSxemi === r.kod ? 'rgba(42,157,143,0.4)' : 'rgba(255,255,255,0.08)'}`,
                      display: 'flex', alignItems: 'center', gap: 8,
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ width: 16, height: 16, borderRadius: 4, background: r.reng, border: '1px solid rgba(255,255,255,0.2)' }} />
                    <span style={{ fontSize: 12, color: rengSxemi === r.kod ? '#fff' : 'rgba(255,255,255,0.5)' }}>{r.ad}</span>
                    {rengSxemi === r.kod && <Check style={{ width: 12, height: 12, color: '#2a9d8f' }} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'dil':
        return (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 20px 0' }}>Dil və Region</h3>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 8 }}>İnterfeys Dili</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { kod: 'az', ad: 'Azərbaycan dili' },
                  { kod: 'en', ad: 'English' },
                  { kod: 'ru', ad: 'Русский' },
                ].map(d => (
                  <div key={d.kod} onClick={() => setDil(d.kod)} style={{
                    padding: '12px 14px', borderRadius: 8, cursor: 'pointer',
                    background: dil === d.kod ? 'rgba(42,157,143,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${dil === d.kod ? 'rgba(42,157,143,0.3)' : 'rgba(255,255,255,0.07)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    transition: 'all 0.2s',
                  }}>
                    <span style={{ fontSize: 13, color: '#fff' }}>{d.ad}</span>
                    {dil === d.kod && <Check style={{ width: 14, height: 14, color: '#2a9d8f' }} />}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 8 }}>Valyuta</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['USD', 'EUR', 'AZN'].map(v => (
                  <div key={v} onClick={() => setValyuta(v)} style={{
                    padding: '8px 16px', borderRadius: 8, cursor: 'pointer',
                    background: valyuta === v ? 'rgba(42,157,143,0.12)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${valyuta === v ? 'rgba(42,157,143,0.3)' : 'rgba(255,255,255,0.07)'}`,
                    fontSize: 13, color: valyuta === v ? '#fff' : 'rgba(255,255,255,0.5)',
                    transition: 'all 0.2s',
                  }}>{v}</div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'tehlukesiz':
        return (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 20px 0' }}>Təhlükəsizlik</h3>
            {[
              { label: 'Cari Şifrə',       placeholder: '••••••••' },
              { label: 'Yeni Şifrə',        placeholder: '••••••••' },
              { label: 'Şifrəni Təsdiqlə', placeholder: '••••••••' },
            ].map((f, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                <input
                  type="password"
                  placeholder={f.placeholder}
                  style={{
                    width: '100%', padding: '10px 14px', fontSize: 13,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8, color: '#fff', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            ))}
            <button style={{
              marginTop: 8, padding: '10px 24px', fontSize: 13, fontWeight: 500,
              background: '#2a9d8f', color: '#fff', border: 'none',
              borderRadius: 8, cursor: 'pointer',
            }}>Şifrəni Yenilə</button>
            <div style={{ marginTop: 24, padding: 16, background: 'rgba(230,57,70,0.08)', borderRadius: 10, border: '1px solid rgba(230,57,70,0.2)' }}>
              <p style={{ fontSize: 13, color: '#e63946', fontWeight: 500, margin: '0 0 6px 0' }}>Hesabı Sil</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '0 0 12px 0' }}>Bu əməliyyat geri qaytarıla bilməz.</p>
              <button style={{
                padding: '8px 16px', fontSize: 12,
                background: 'transparent', color: '#e63946',
                border: '1px solid rgba(230,57,70,0.4)',
                borderRadius: 6, cursor: 'pointer',
              }}>Hesabı Sil</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <div className="liquid-glass" style={{ padding: 8, width: 200, flexShrink: 0, alignSelf: 'flex-start' }}>
        {bolmeler.map(b => {
          const Icon = b.icon;
          return (
            <div key={b.id} onClick={() => setAktivBolme(b.id)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
              background: aktivBolme === b.id ? 'rgba(42,157,143,0.12)' : 'transparent',
              marginBottom: 2, transition: 'background 0.2s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon style={{ width: 15, height: 15, color: aktivBolme === b.id ? '#2a9d8f' : 'rgba(255,255,255,0.45)' }} />
                <span style={{ fontSize: 13, color: aktivBolme === b.id ? '#fff' : 'rgba(255,255,255,0.6)' }}>{b.ad}</span>
              </div>
              {aktivBolme === b.id && <ChevronRight style={{ width: 12, height: 12, color: '#2a9d8f' }} />}
            </div>
          );
        })}
      </div>

      <div className="liquid-glass" style={{ padding: 20, flex: 1 }}>
        {renderMezmun()}
      </div>
    </div>
  );
}