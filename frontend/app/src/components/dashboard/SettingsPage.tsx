import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useTranslation } from 'react-i18next';
import {
  User, Bell, Shield, Zap,
  Globe, ChevronRight, Check, Palette, Save,
} from 'lucide-react';

const bolmeler = [
  { id: 'profil',     icon: User,    adKey: 'profil' },
  { id: 'bildirish',  icon: Bell,    adKey: 'bildirisher' },
  { id: 'enerji',     icon: Zap,     adKey: 'enerjiParametrleri' },
  { id: 'gorunus',    icon: Palette, adKey: 'gorunus' },
  { id: 'dil',        icon: Globe,   adKey: 'dilVeRegion' },
  { id: 'tehlukesiz', icon: Shield,  adKey: 'tehlukesizlik' },
];

function Toggle({ aktiv, onChange, disabled = false }: { aktiv: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={aktiv}
      onClick={onChange}
      disabled={disabled}
      style={{
      width: 40, height: 22, borderRadius: 11, cursor: 'pointer',
      background: aktiv ? '#2a9d8f' : 'rgba(255,255,255,0.12)',
      position: 'relative', transition: 'background 0.2s', flexShrink: 0,
      border: 0, padding: 0, opacity: disabled ? 0.55 : 1,
    }}>
      <div style={{
        position: 'absolute', top: 3,
        left: aktiv ? 21 : 3,
        width: 16, height: 16, borderRadius: '50%',
        background: '#fff', transition: 'left 0.2s',
      }} />
    </button>
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

const applyAppearance = (theme: string, animations: boolean, compact: boolean) => {
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.animations = animations ? 'on' : 'off';
  document.documentElement.dataset.density = compact ? 'compact' : 'comfortable';
  localStorage.setItem('theme', theme);
  localStorage.setItem('animations', animations ? 'on' : 'off');
  localStorage.setItem('density', compact ? 'compact' : 'comfortable');
};

type BildirishSettings = {
  emailBildirish: boolean;
  pikXeberdar: boolean;
  batareyaXeberdar: boolean;
  heftelikHesabat: boolean;
  sistemXeberdar: boolean;
};

type EnerjiSettings = {
  avtomatikOptimizasiya: boolean;
  pikSaatlarindenQacin: boolean;
  batareyaOncelik: boolean;
  geceSaatlariSarj: boolean;
};

const DEFAULT_BILDIRISH: BildirishSettings = {
  emailBildirish: true,
  pikXeberdar: true,
  batareyaXeberdar: false,
  heftelikHesabat: true,
  sistemXeberdar: false,
};

const DEFAULT_ENERJI: EnerjiSettings = {
  avtomatikOptimizasiya: true,
  pikSaatlarindenQacin: true,
  batareyaOncelik: false,
  geceSaatlariSarj: true,
};

const readStoredObject = <T extends Record<string, boolean>>(key: string, defaults: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
};

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const [aktivBolme, setAktivBolme] = useState('profil');
  const [rengSxemi, setRengSxemi] = useState(() => localStorage.getItem('theme') || 'okean');
  
  const changeTheme = (kod: string) => {
    setRengSxemi(kod);
    applyAppearance(kod, gorunus.animasiyalar, gorunus.kompaktGoruntuq);
  };

  const [valyuta, setValyuta] = useState(() => localStorage.getItem('ecoai_currency') || 'USD');
  const [saveMsg, setSaveMsg] = useState('');
  const [saving, setSaving] = useState(false);

  // Profil
  const [profil, setProfil] = useState({ full_name: '', email: '', phone: '', address: 'Bakı, Azərbaycan' });

  // Şifrə
  const [curPass, setCurPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confPass, setConfPass] = useState('');

  // Bildiriş
  const [bildirish, setBildirish] = useState<BildirishSettings>(() => (
    readStoredObject('ecoai_notification_settings', DEFAULT_BILDIRISH)
  ));

  // Enerji
  const [enerji, setEnerji] = useState<EnerjiSettings>(() => (
    readStoredObject('ecoai_energy_settings', DEFAULT_ENERJI)
  ));

  // Görünüş
  const [gorunus, setGorunus] = useState(() => ({
    animasiyalar: localStorage.getItem('animations') !== 'off',
    kompaktGoruntuq: localStorage.getItem('density') === 'compact',
  }));

  const changeAnimations = () => {
    setGorunus(prev => {
      const next = { ...prev, animasiyalar: !prev.animasiyalar };
      applyAppearance(rengSxemi, next.animasiyalar, next.kompaktGoruntuq);
      return next;
    });
  };

  const changeDensity = () => {
    setGorunus(prev => {
      const next = { ...prev, kompaktGoruntuq: !prev.kompaktGoruntuq };
      applyAppearance(rengSxemi, next.animasiyalar, next.kompaktGoruntuq);
      return next;
    });
  };

  const changeLanguage = (kod: string) => {
    i18n.changeLanguage(kod);
    localStorage.setItem('ecoai_lang', kod);
  };

  const requestNotificationAccess = async () => {
    if (!('Notification' in window) || Notification.permission !== 'default') return;
    await Notification.requestPermission();
  };

  const updateBildirish = async (key: keyof BildirishSettings) => {
    if (key !== 'emailBildirish' && !bildirish[key]) {
      await requestNotificationAccess();
    }

    setBildirish(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem('ecoai_notification_settings', JSON.stringify(next));
      window.dispatchEvent(new CustomEvent('ecoai:notification-settings-changed', { detail: next }));
      showMsg(t('yaddaSaxlandi'));
      return next;
    });
  };

  const updateEnerji = (key: keyof EnerjiSettings) => {
    setEnerji(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem('ecoai_energy_settings', JSON.stringify(next));
      window.dispatchEvent(new CustomEvent('ecoai:energy-settings-changed', { detail: next }));
      showMsg(t('yaddaSaxlandi'));
      return next;
    });
  };

  const changeCurrency = (kod: string) => {
    setValyuta(kod);
    localStorage.setItem('ecoai_currency', kod);
    showMsg(t('yaddaSaxlandi'));
  };

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
      showMsg(t('yaddaSaxlandi'));
    } catch {
      showMsg(t('xetaBasvVerdi'));
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async () => {
    if (newPass !== confPass) { showMsg(t('sifrelerUygunDeyil')); return; }
    if (newPass.length < 6) { showMsg(t('sifreEnAz')); return; }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPass });
    setSaving(false);
    if (error) { showMsg(t('xetaBasvVerdi')); return; }
    showMsg(t('sifreYenilendi'));
    setCurPass(''); setNewPass(''); setConfPass('');
  };

  const renderMezmun = () => {
    switch (aktivBolme) {

      case 'profil':
        return (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 20px 0' }}>{t('profilMelumatlari')}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 12 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(42,157,143,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#2a9d8f', fontWeight: 600 }}>
                {(profil.full_name?.[0] || profil.email?.[0] || 'U').toUpperCase()}
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: 0 }}>{profil.full_name || t('profil')}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: '2px 0 0 0' }}>{profil.email}</p>
              </div>
            </div>

            {[
              { label: t('adSoyad'), key: 'full_name', placeholder: 'Ömər Babayev' },
              { label: t('telefon'), key: 'phone', placeholder: '+994 50 000 00 00' },
              { label: t('unvan'), key: 'address', placeholder: 'Bakı, Azərbaycan' },
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
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 6 }}>{t('ePoct')}</label>
              <input value={profil.email} disabled style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                <button onClick={saveProfil} disabled={saving} style={{ padding: '10px 24px', fontSize: 13, fontWeight: 500, background: saving ? 'color-mix(in srgb, var(--accent) 50%, transparent)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Save style={{ width: 14, height: 14 }} />
                {saving ? t('saxlanilir') : t('yaddaSaxla')}
              </button>
              {saveMsg && <span style={{ fontSize: 13, color: saveMsg.startsWith('✓') ? '#2a9d8f' : '#e63946' }}>{saveMsg}</span>}
            </div>
          </div>
        );

      case 'bildirish':
        return (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 20px 0' }}>{t('bildirisiParametrleri')}</h3>
            <SectionRow label={t('ePochtBildirisleri')} desc={t('ePochtBildirisleriDesc')}>
              <Toggle aktiv={bildirish.emailBildirish} onChange={() => updateBildirish('emailBildirish')} />
            </SectionRow>
            <SectionRow label={t('pikSaatXeberdarligi')} desc={t('pikSaatXeberdarligiDesc')}>
              <Toggle aktiv={bildirish.pikXeberdar} onChange={() => updateBildirish('pikXeberdar')} />
            </SectionRow>
            <SectionRow label={t('batareyaXeberdarligi')} desc={t('batareyaXeberdarligiDesc')}>
              <Toggle aktiv={bildirish.batareyaXeberdar} onChange={() => updateBildirish('batareyaXeberdar')} />
            </SectionRow>
            <SectionRow label={t('heftelikHesabat')} desc={t('heftelikHesabatDesc')}>
              <Toggle aktiv={bildirish.heftelikHesabat} onChange={() => updateBildirish('heftelikHesabat')} />
            </SectionRow>
            <SectionRow label={t('sistemXeberdarliqlar')} desc={t('sistemXeberdarliqlarDesc')}>
              <Toggle aktiv={bildirish.sistemXeberdar} onChange={() => updateBildirish('sistemXeberdar')} />
            </SectionRow>
          </div>
        );

      case 'enerji':
        return (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 20px 0' }}>{t('energiIdareetmesi')}</h3>
            <SectionRow label={t('avtomatikOptimallashdirma')} desc={t('avtomatikOptimallashdirmaDesc')}>
              <Toggle aktiv={enerji.avtomatikOptimizasiya} onChange={() => updateEnerji('avtomatikOptimizasiya')} />
            </SectionRow>
            <SectionRow label={t('pikSaatlarindenQac')} desc={t('pikSaatlarindenQacDesc')}>
              <Toggle aktiv={enerji.pikSaatlarindenQacin} onChange={() => updateEnerji('pikSaatlarindenQacin')} />
            </SectionRow>
            <SectionRow label={t('batareyaPrioriteti')} desc={t('batareyaPrioritetiDesc')}>
              <Toggle aktiv={enerji.batareyaOncelik} onChange={() => updateEnerji('batareyaOncelik')} />
            </SectionRow>
            <SectionRow label={t('geceSaatlarindaSarj')} desc={t('geceSaatlarindaSarjDesc')}>
              <Toggle aktiv={enerji.geceSaatlariSarj} onChange={() => updateEnerji('geceSaatlariSarj')} />
            </SectionRow>
          </div>
        );

      case 'gorunus':
        return (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 20px 0' }}>{t('gorunus')}</h3>
            <SectionRow label={t('animasiyalar')} desc={t('animasiyalarDesc')}>
              <Toggle aktiv={gorunus.animasiyalar} onChange={changeAnimations} />
            </SectionRow>
            <SectionRow label={t('kompaktGoruntuq')} desc={t('kompaktGoruntuqDesc')}>
              <Toggle aktiv={gorunus.kompaktGoruntuq} onChange={changeDensity} />
            </SectionRow>
            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 12 }}>{t('rengSxemi')}</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { ad: t('derinOkean'), reng: '#001219', kod: 'okean' },
                  { ad: t('gece'), reng: '#0d1117', kod: 'gece' },
                  { ad: t('tundYasil'), reng: '#001a1a', kod: 'yasil' },
                ].map(r => (
                  <div key={r.kod} onClick={() => changeTheme(r.kod)} style={{ padding: '10px 14px', borderRadius: 8, cursor: 'pointer', background: rengSxemi === r.kod ? 'var(--accent-soft)' : 'rgba(255,255,255,0.05)', border: `1px solid ${rengSxemi === r.kod ? 'color-mix(in srgb, var(--accent) 40%, transparent)' : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 16, height: 16, borderRadius: 4, background: r.reng, border: '1px solid rgba(255,255,255,0.2)' }} />
                    <span style={{ fontSize: 12, color: rengSxemi === r.kod ? '#fff' : 'rgba(255,255,255,0.5)' }}>{r.ad}</span>
                    {rengSxemi === r.kod && <Check style={{ width: 12, height: 12, color: 'var(--accent)' }} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'dil':
        return (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 20px 0' }}>{t('dilVeRegion')}</h3>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 8 }}>{t('interfeysDili')}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { kod: 'az', ad: 'Azərbaycan dili' }, 
                  { kod: 'en', ad: 'English' }, 
                  { kod: 'ru', ad: 'Русский' }
                ].map(d => (
                  <div 
                    key={d.kod} 
                    onClick={() => changeLanguage(d.kod)}
                    style={{ padding: '12px 14px', borderRadius: 8, cursor: 'pointer', background: i18n.language === d.kod ? 'rgba(42,157,143,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${i18n.language === d.kod ? 'rgba(42,157,143,0.3)' : 'rgba(255,255,255,0.07)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} // justifycontent düzəldildi -> justifyContent
                  >
                    <span style={{ fontSize: 13, color: '#fff' }}>{d.ad}</span>
                    {i18n.language === d.kod && <Check style={{ width: 14, height: 14, color: 'var(--accent)' }} />}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 8 }}>{t('valyuta')}</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['USD', 'EUR', 'AZN'].map(v => (
                  <div key={v} onClick={() => changeCurrency(v)} style={{ padding: '8px 16px', borderRadius: 8, cursor: 'pointer', background: valyuta === v ? 'var(--accent-soft)' : 'rgba(255,255,255,0.04)', border: `1px solid ${valyuta === v ? 'color-mix(in srgb, var(--accent) 40%, transparent)' : 'rgba(255,255,255,0.07)'}`, fontSize: 13, color: valyuta === v ? '#fff' : 'rgba(255,255,255,0.5)' }}>{v}</div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'tehlukesiz':
        return (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 20px 0' }}>{t('tehlukesizlikTitle')}</h3>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 6 }}>{t('cariSifre')}</label>
              <input type="password" value={curPass} onChange={e => setCurPass(e.target.value)} placeholder="••••••••" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 6 }}>{t('yeniSifre')}</label>
              <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="••••••••" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 6 }}>{t('sifreyiTesdiqle')}</label>
              <input type="password" value={confPass} onChange={e => setConfPass(e.target.value)} placeholder="••••••••" style={inputStyle} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={savePassword} disabled={saving} style={{ padding: '10px 24px', fontSize: 13, fontWeight: 500, background: '#2a9d8f', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                {t('sifreyiYenile')}
              </button>
              {saveMsg && <span style={{ fontSize: 13, color: saveMsg.includes('✓') ? '#2a9d8f' : '#e63946' }}>{saveMsg}</span>}
            </div>
            <div style={{ marginTop: 24, padding: 16, background: 'rgba(230,57,70,0.08)', borderRadius: 10, border: '1px solid rgba(230,57,70,0.2)' }}>
              <p style={{ fontSize: 13, color: '#e63946', fontWeight: 500, margin: '0 0 6px 0' }}>{t('hesabiSil')}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '0 0 12px 0' }}>{t('hesabiSilDesc')}</p>
              <button 
                onClick={async () => { 
                  const eminSiniz = i18n.language === 'az' ? 'Əminsiniz?' : i18n.language === 'en' ? 'Are you sure?' : 'Вы уверены?';
                  if (confirm(eminSiniz)) { 
                    await supabase.auth.signOut(); 
                    window.location.href = '/login'; 
                  } 
                }} 
                style={{ padding: '8px 16px', fontSize: 12, background: 'transparent', color: '#e63946', border: '1px solid rgba(230,57,70,0.4)', borderRadius: 6, cursor: 'pointer' }}
              >
                {t('hesabiSil')}
              </button>
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-5">
      <div className="liquid-glass w-full lg:w-[200px]" style={{ padding: 8, flexShrink: 0, alignSelf: 'flex-start' }}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
        {bolmeler.map(b => {
          const Icon = b.icon;
          return (
            <div key={b.id} onClick={() => setAktivBolme(b.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, cursor: 'pointer', background: aktivBolme === b.id ? 'var(--accent-soft)' : 'transparent', border: aktivBolme === b.id ? '1px solid color-mix(in srgb, var(--accent) 30%, transparent)' : '1px solid transparent', marginBottom: 0, transition: 'background 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon style={{ width: 15, height: 15, color: aktivBolme === b.id ? 'var(--accent)' : 'rgba(255,255,255,0.45)' }} />
                <span style={{ fontSize: 13, color: aktivBolme === b.id ? '#fff' : 'rgba(255,255,255,0.6)' }}>{t(b.adKey)}</span>
              </div>
              {aktivBolme === b.id && <ChevronRight style={{ width: 12, height: 12, color: 'var(--accent)' }} />}
            </div>
          );
        })}
        </div>
      </div>
      <div className="liquid-glass w-full" style={{ padding: 16, flex: 1 }}>
        {renderMezmun()}
        {saveMsg && aktivBolme !== 'profil' && aktivBolme !== 'tehlukesiz' && (
          <p style={{ fontSize: 12, color: '#2a9d8f', margin: '14px 0 0 0' }}>{saveMsg}</p>
        )}
      </div>
    </div>
  );
}
