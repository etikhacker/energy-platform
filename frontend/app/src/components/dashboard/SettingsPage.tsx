import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  User, Bell, Shield, Zap,
  Globe, ChevronRight, Check, Palette, Save,
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
      padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div>
        <p style={{ fontSize: 13, color: '#fff', margin: 0 }}>{label}</p>
        {desc && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0 0' }}>{desc}</p>}
      </div>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', fontSize: 13,
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, color: '#fff', outline: 'none',
  boxSizing: 'border-box',
};

export default function SettingsPage() {
  const [aktivBolme, setAktivBolme] = useState('profil');
  const [rengSxemi, setRengSxemi] = useState(() => localStorage.getItem('theme') || 'okean');
  const changeTheme = (kod: string) => {
  setRengSxemi(kod);
  localStorage.setItem('theme', kod);
  const colors: Record<string, string> = {
    okean: '#001219',
    gece: '#0d1117',
    yasil: '#001a1a',
  };
  document.body.style.background = colors[kod];
};
  const [dil, setDil] = useState('az');
  const [valyuta, setValyuta] = useState('USD');
  const [saveMsg, setSaveMsg] = useState('');
  const [saving, setSaving] = useState(false);

  // Profil
  const [profil, setProfil] = useState({ full_name: '', email: '', phone: '', address: 'Bakı, Azərbaycan' });

  // Şifrə — switch xaricində
  const [curPass, setCurPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confPass, setConfPass] = useState('');

  // Bildiriş
  const [bildirish, setBildirish] = useState({
    emailBildirish: true, pikXeberdar: true,
    batareyaXeberdar: false, heftəlikHesabat: true, sistemXeberdar: false,
  });

  // Enerji
  const [enerji, setEnerji] = useState({
    avtomatikOptimizasiya: true, pikSaatlarindenQacin: true,
    batareyaOncelik: false, geceSaatlariSarj: true,
  });

  // Görünüş
  const [gorunus, setGorunus] = useState({ animasiyalar: true, kompaktGoruntuq: false });

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setProfil(prev => ({ ...prev, email: user.email || '' }));

      const { data: profile } = await supabase
        .from('profiles').select('*').eq('id', user.id).single();

      if (profile) {
        setProfil({
          full_name: profile.full_name || '',
          email: user.email || '',
          phone: profile.phone || '',
          address: profile.address || 'Bakı, Azərbaycan',
        });
      }
    };
    loadProfile();
  }, []);

  const showMsg = (msg: string) => {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(''), 3000);
  };

  const saveProfil = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('İstifadəçi tapılmadı');
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: profil.full_name,
        phone: profil.phone,
        address: profil.address,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      showMsg('✓ Yadda saxlandı');
    } catch {
      showMsg('✗ Xəta baş verdi');
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async () => {
    if (newPass !== confPass) { showMsg('✗ Şifrələr uyğun deyil'); return; }
    if (newPass.length < 6) { showMsg('✗ Şifrə ən az 6 simvol olmalıdır'); return; }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPass });
    setSaving(false);
    if (error) { showMsg('✗ Xəta baş verdi'); return; }
    showMsg('✓ Şifrə yeniləndi');
    setCurPass(''); setNewPass(''); setConfPass('');
  };

  const renderMezmun = () => {
    switch (aktivBolme) {

      case 'profil':
        return (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 20px 0' }}>Profil Məlumatları</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 12 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(42,157,143,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#2a9d8f', fontWeight: 600 }}>
                {(profil.full_name?.[0] || profil.email?.[0] || 'U').toUpperCase()}
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: 0 }}>{profil.full_name || 'İstifadəçi'}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: '2px 0 0 0' }}>{profil.email}</p>
              </div>
            </div>

            {[
              { label: 'Ad Soyad', key: 'full_name', placeholder: 'Ömər Babayev' },
              { label: 'Telefon', key: 'phone', placeholder: '+994 50 000 00 00' },
              { label: 'Ünvan', key: 'address', placeholder: 'Bakı, Azərbaycan' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                <input
                  value={profil[f.key as keyof typeof profil]}
                  onChange={e => setProfil(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  style={inputStyle}
                />
              </div>
            ))}

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 6 }}>E-poçt</label>
              <input value={profil.email} disabled style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
              <button onClick={saveProfil} disabled={saving} style={{ padding: '10px 24px', fontSize: 13, fontWeight: 500, background: saving ? 'rgba(42,157,143,0.4)' : '#2a9d8f', color: '#fff', border: 'none', borderRadius: 8, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Save style={{ width: 14, height: 14 }} />
                {saving ? 'Saxlanılır...' : 'Yadda Saxla'}
              </button>
              {saveMsg && <span style={{ fontSize: 13, color: saveMsg.includes('✓') ? '#2a9d8f' : '#e63946' }}>{saveMsg}</span>}
            </div>
          </div>
        );

      case 'bildirish':
        return (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 20px 0' }}>Bildiriş Parametrləri</h3>
            <SectionRow label="E-poçt bildirişləri" desc="Vacib hadisələr üçün e-poçt al">
              <Toggle aktiv={bildirish.emailBildirish} onChange={() => setBildirish(p => ({ ...p, emailBildirish: !p.emailBildirish }))} />
            </SectionRow>
            <SectionRow label="Pik saat xəbərdarlığı" desc="Yüksək tarif saatlarından əvvəl xəbərdar et">
              <Toggle aktiv={bildirish.pikXeberdar} onChange={() => setBildirish(p => ({ ...p, pikXeberdar: !p.pikXeberdar }))} />
            </SectionRow>
            <SectionRow label="Batareya xəbərdarlığı" desc="Batareya 20%-dən aşağı düşdükdə">
              <Toggle aktiv={bildirish.batareyaXeberdar} onChange={() => setBildirish(p => ({ ...p, batareyaXeberdar: !p.batareyaXeberdar }))} />
            </SectionRow>
            <SectionRow label="Həftəlik hesabat" desc="Həftəlik enerji statistikası">
              <Toggle aktiv={bildirish.heftəlikHesabat} onChange={() => setBildirish(p => ({ ...p, heftəlikHesabat: !p.heftəlikHesabat }))} />
            </SectionRow>
            <SectionRow label="Sistem xəbərdarlıqları" desc="Şəbəkə kəsilməsi və texniki xətalar">
              <Toggle aktiv={bildirish.sistemXeberdar} onChange={() => setBildirish(p => ({ ...p, sistemXeberdar: !p.sistemXeberdar }))} />
            </SectionRow>
          </div>
        );

      case 'enerji':
        return (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 20px 0' }}>Enerji İdarəetməsi</h3>
            <SectionRow label="Avtomatik optimallaşdırma" desc="Enerji istifadəsini AI ilə optimallaşdır">
              <Toggle aktiv={enerji.avtomatikOptimizasiya} onChange={() => setEnerji(p => ({ ...p, avtomatikOptimizasiya: !p.avtomatikOptimizasiya }))} />
            </SectionRow>
            <SectionRow label="Pik saatlardan qaç" desc="Yüksək tarif saatlarında istehlakı azalt">
              <Toggle aktiv={enerji.pikSaatlarindenQacin} onChange={() => setEnerji(p => ({ ...p, pikSaatlarindenQacin: !p.pikSaatlarindenQacin }))} />
            </SectionRow>
            <SectionRow label="Batareya prioriteti" desc="Şəbəkə əvəzinə batareyadan istifadə et">
              <Toggle aktiv={enerji.batareyaOncelik} onChange={() => setEnerji(p => ({ ...p, batareyaOncelik: !p.batareyaOncelik }))} />
            </SectionRow>
            <SectionRow label="Gecə saatlarında şarj" desc="23:00-06:00 arasında batareyaları şarj et">
              <Toggle aktiv={enerji.geceSaatlariSarj} onChange={() => setEnerji(p => ({ ...p, geceSaatlariSarj: !p.geceSaatlariSarj }))} />
            </SectionRow>
          </div>
        );

      case 'gorunus':
        return (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 20px 0' }}>Görünüş</h3>
            <SectionRow label="Animasiyalar" desc="İnterfeys animasiyalarını aktiv et">
              <Toggle aktiv={gorunus.animasiyalar} onChange={() => setGorunus(p => ({ ...p, animasiyalar: !p.animasiyalar }))} />
            </SectionRow>
            <SectionRow label="Kompakt görüntü" desc="Daha sıx məlumat göstər">
              <Toggle aktiv={gorunus.kompaktGoruntuq} onChange={() => setGorunus(p => ({ ...p, kompaktGoruntuq: !p.kompaktGoruntuq }))} />
            </SectionRow>
            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 12 }}>Rəng Sxemi</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { ad: 'Dərin Okean', reng: '#001219', kod: 'okean' },
                  { ad: 'Gecə', reng: '#0d1117', kod: 'gece' },
                  { ad: 'Tünd Yaşıl', reng: '#001a1a', kod: 'yasil' },
                ].map(r => (
                  <div key={r.kod} onClick={() => changeTheme(r.kod)} style={{ padding: '10px 14px', borderRadius: 8, cursor: 'pointer', background: rengSxemi === r.kod ? 'rgba(42,157,143,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${rengSxemi === r.kod ? 'rgba(42,157,143,0.4)' : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', gap: 8 }}>
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
                {[{ kod: 'az', ad: 'Azərbaycan dili' }, { kod: 'en', ad: 'English' }, { kod: 'ru', ad: 'Русский' }].map(d => (
                  <div key={d.kod} onClick={() => setDil(d.kod)} style={{ padding: '12px 14px', borderRadius: 8, cursor: 'pointer', background: dil === d.kod ? 'rgba(42,157,143,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${dil === d.kod ? 'rgba(42,157,143,0.3)' : 'rgba(255,255,255,0.07)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                  <div key={v} onClick={() => setValyuta(v)} style={{ padding: '8px 16px', borderRadius: 8, cursor: 'pointer', background: valyuta === v ? 'rgba(42,157,143,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${valyuta === v ? 'rgba(42,157,143,0.3)' : 'rgba(255,255,255,0.07)'}`, fontSize: 13, color: valyuta === v ? '#fff' : 'rgba(255,255,255,0.5)' }}>{v}</div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'tehlukesiz':
        return (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 20px 0' }}>Təhlükəsizlik</h3>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 6 }}>Cari Şifrə</label>
              <input type="password" value={curPass} onChange={e => setCurPass(e.target.value)} placeholder="••••••••" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 6 }}>Yeni Şifrə</label>
              <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="••••••••" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 6 }}>Şifrəni Təsdiqlə</label>
              <input type="password" value={confPass} onChange={e => setConfPass(e.target.value)} placeholder="••••••••" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={savePassword} disabled={saving} style={{ padding: '10px 24px', fontSize: 13, fontWeight: 500, background: '#2a9d8f', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                Şifrəni Yenilə
              </button>
              {saveMsg && <span style={{ fontSize: 13, color: saveMsg.includes('✓') ? '#2a9d8f' : '#e63946' }}>{saveMsg}</span>}
            </div>
            <div style={{ marginTop: 24, padding: 16, background: 'rgba(230,57,70,0.08)', borderRadius: 10, border: '1px solid rgba(230,57,70,0.2)' }}>
              <p style={{ fontSize: 13, color: '#e63946', fontWeight: 500, margin: '0 0 6px 0' }}>Hesabı Sil</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '0 0 12px 0' }}>Bu əməliyyat geri qaytarıla bilməz.</p>
              <button onClick={async () => { if (confirm('Əminsiniz?')) { await supabase.auth.signOut(); window.location.href = '/login'; } }} style={{ padding: '8px 16px', fontSize: 12, background: 'transparent', color: '#e63946', border: '1px solid rgba(230,57,70,0.4)', borderRadius: 6, cursor: 'pointer' }}>
                Hesabı Sil
              </button>
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <div className="liquid-glass" style={{ padding: 8, width: 200, flexShrink: 0, alignSelf: 'flex-start' }}>
        {bolmeler.map(b => {
          const Icon = b.icon;
          return (
            <div key={b.id} onClick={() => setAktivBolme(b.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, cursor: 'pointer', background: aktivBolme === b.id ? 'rgba(42,157,143,0.12)' : 'transparent', marginBottom: 2, transition: 'background 0.2s' }}>
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