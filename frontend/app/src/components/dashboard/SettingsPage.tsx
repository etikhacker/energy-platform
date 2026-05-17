import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import {
  User, Bell, Shield, Zap,
  Globe, ChevronRight, Check, Palette, Save,
} from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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
  const { t } = useTranslation();
  const [aktivBolme, setAktivBolme] = useState('profil');
  const [rengSxemi, setRengSxemi] = useState('okean');
  const [dil, setDil] = useState(localStorage.getItem('ecoai_lang') || 'az');
  const [valyuta, setValyuta] = useState('USD');
  const [saveMsg, setSaveMsg] = useState('');
  const [saving, setSaving] = useState(false);

  // Profil
  const [profil, setProfil] = useState({ full_name: '', email: '', phone: '', address: 'Bakı, Azərbaycan' });

  // Bildiriş
  const [bildirish, setBildirish] = useState({
    emailBildirish: true, pikXeberdar: true, batareyaXeberdar: false,
    heftəlikHesabat: true, sistemXeberdar: false,
  });

  // Enerji
  const [enerji, setEnerji] = useState({
    avtomatikOptimizasiya: true, pikSaatlarindenQacin: true,
    batareyaOncelik: false, geceSaatlariSarj: true,
  });

  // Görünüş
  const [gorunusState, setGorunusState] = useState({ animasiyalar: true, kompaktGoruntuq: false });

  // Təhlükəsizlik — hook-lar burda olmalıdır, switch içində yox!
  const [cur, setCur] = useState('');
  const [nw, setNw] = useState('');
  const [conf, setConf] = useState('');

  const bolmeler = [
    { id: 'profil',     icon: User,    ad: t('profil') },
    { id: 'bildirish',  icon: Bell,    ad: t('bildirisher') },
    { id: 'enerji',     icon: Zap,     ad: t('enerjiParametrleri') },
    { id: 'gorunus',    icon: Palette, ad: t('gorunus') },
    { id: 'dil',        icon: Globe,   ad: t('dilVeRegion') },
    { id: 'tehlukesiz', icon: Shield,  ad: t('tehlukesizlik') },
  ];

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setProfil(prev => ({ ...prev, email: user.email || '' }));
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
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

  const changeDil = (kod: string) => {
    setDil(kod);
    i18n.changeLanguage(kod);
    localStorage.setItem('ecoai_lang', kod);
  };

  const saveProfil = async () => {
    setSaving(true); setSaveMsg('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('İstifadəçi tapılmadı');
      const { error } = await supabase.from('profiles').upsert({
        id: user.id, full_name: profil.full_name,
        phone: profil.phone, address: profil.address,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      setSaveMsg(t('yaddaSaxlandi'));
    } catch {
      setSaveMsg(t('xetaBasvVerdi'));
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 3000);
    }
  };

  const savePassword = async () => {
    if (nw !== conf) { setSaveMsg(t('sifrelerUygunDeyil')); return; }
    if (nw.length < 6) { setSaveMsg(t('sifreEnAz')); return; }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: nw });
    setSaving(false);
    setSaveMsg(error ? t('xetaBasvVerdi') : t('sifreYenilendi'));
    setTimeout(() => setSaveMsg(''), 3000);
  };

  const renderMezmun = () => {
    switch (aktivBolme) {

      case 'profil':
        return (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 20px 0' }}>{t('profilMelumatlari')}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: 16, background: 'rgba(255,255,255,0.04)', borderRadius: 12 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(42,157,143,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#2a9d8f', fontWeight: 600 }}>
                {profil.full_name ? profil.full_name[0].toUpperCase() : profil.email[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: 0 }}>{profil.full_name || 'İstifadəçi'}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: '2px 0 0 0' }}>{profil.email}</p>
              </div>
            </div>
            {[
              { key: 'full_name', label: t('adSoyad'), placeholder: 'Ömər Babayev' },
              { key: 'phone', label: t('telefon'), placeholder: '+994 50 000 00 00' },
              { key: 'address', label: t('unvan'), placeholder: 'Bakı, Azərbaycan' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                <input value={(profil as any)[f.key]} onChange={e => setProfil(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={inputStyle} />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 6 }}>{t('ePoct')}</label>
              <input value={profil.email} disabled style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
              <button onClick={saveProfil} disabled={saving} style={{ padding: '10px 24px', fontSize: 13, fontWeight: 500, background: saving ? 'rgba(42,157,143,0.4)' : '#2a9d8f', color: '#fff', border: 'none', borderRadius: 8, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Save style={{ width: 14, height: 14 }} />
                {saving ? t('saxlanilir') : t('yaddaSaxla')}
              </button>
              {saveMsg && <span style={{ fontSize: 13, color: saveMsg.includes('✓') ? '#2a9d8f' : '#e63946' }}>{saveMsg}</span>}
            </div>
          </div>
        );

      case 'bildirish':
        return (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 20px 0' }}>{t('bildirisiParametrleri')}</h3>
            <SectionRow label={t('ePochtBildirisleri')} desc={t('ePochtBildirisleriDesc')}>
              <Toggle aktiv={bildirish.emailBildirish} onChange={() => setBildirish(p => ({ ...p, emailBildirish: !p.emailBildirish }))} />
            </SectionRow>
            <SectionRow label={t('pikSaatXeberdarligi')} desc={t('pikSaatXeberdarligiDesc')}>
              <Toggle aktiv={bildirish.pikXeberdar} onChange={() => setBildirish(p => ({ ...p, pikXeberdar: !p.pikXeberdar }))} />
            </SectionRow>
            <SectionRow label={t('batareyaXeberdarligi')} desc={t('batareyaXeberdarligiDesc')}>
              <Toggle aktiv={bildirish.batareyaXeberdar} onChange={() => setBildirish(p => ({ ...p, batareyaXeberdar: !p.batareyaXeberdar }))} />
            </SectionRow>
            <SectionRow label={t('heftelikHesabat')} desc={t('heftelikHesabatDesc')}>
              <Toggle aktiv={bildirish.heftəlikHesabat} onChange={() => setBildirish(p => ({ ...p, heftəlikHesabat: !p.heftəlikHesabat }))} />
            </SectionRow>
            <SectionRow label={t('sistemXeberdarliqlar')} desc={t('sistemXeberdarliqlarDesc')}>
              <Toggle aktiv={bildirish.sistemXeberdar} onChange={() => setBildirish(p => ({ ...p, sistemXeberdar: !p.sistemXeberdar }))} />
            </SectionRow>
          </div>
        );

      case 'enerji':
        return (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 20px 0' }}>{t('energiIdareetmesi')}</h3>
            <SectionRow label={t('avtomatikOptimallashdirma')} desc={t('avtomatikOptimallashdirmaDesc')}>
              <Toggle aktiv={enerji.avtomatikOptimizasiya} onChange={() => setEnerji(p => ({ ...p, avtomatikOptimizasiya: !p.avtomatikOptimizasiya }))} />
            </SectionRow>
            <SectionRow label={t('pikSaatlarindenQac')} desc={t('pikSaatlarindenQacDesc')}>
              <Toggle aktiv={enerji.pikSaatlarindenQacin} onChange={() => setEnerji(p => ({ ...p, pikSaatlarindenQacin: !p.pikSaatlarindenQacin }))} />
            </SectionRow>
            <SectionRow label={t('batareyaPrioriteti')} desc={t('batareyaPrioritetiDesc')}>
              <Toggle aktiv={enerji.batareyaOncelik} onChange={() => setEnerji(p => ({ ...p, batareyaOncelik: !p.batareyaOncelik }))} />
            </SectionRow>
            <SectionRow label={t('geceSaatlarindaSarj')} desc={t('geceSaatlarindaSarjDesc')}>
              <Toggle aktiv={enerji.geceSaatlariSarj} onChange={() => setEnerji(p => ({ ...p, geceSaatlariSarj: !p.geceSaatlariSarj }))} />
            </SectionRow>
          </div>
        );

      case 'gorunus':
        return (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 20px 0' }}>{t('gorunus')}</h3>
            <SectionRow label={t('animasiyalar')} desc={t('animasiyalarDesc')}>
              <Toggle aktiv={gorunusState.animasiyalar} onChange={() => setGorunusState(p => ({ ...p, animasiyalar: !p.animasiyalar }))} />
            </SectionRow>
            <SectionRow label={t('kompaktGoruntuq')} desc={t('kompaktGoruntuqDesc')}>
              <Toggle aktiv={gorunusState.kompaktGoruntuq} onChange={() => setGorunusState(p => ({ ...p, kompaktGoruntuq: !p.kompaktGoruntuq }))} />
            </SectionRow>
            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 12 }}>{t('rengSxemi')}</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { ad: t('derinOkean'), reng: '#001219', kod: 'okean' },
                  { ad: t('gece'), reng: '#0d1117', kod: 'gece' },
                  { ad: t('tundYasil'), reng: '#001a1a', kod: 'yasil' },
                ].map(r => (
                  <div key={r.kod} onClick={() => setRengSxemi(r.kod)} style={{ padding: '10px 14px', borderRadius: 8, cursor: 'pointer', background: rengSxemi === r.kod ? 'rgba(42,157,143,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${rengSxemi === r.kod ? 'rgba(42,157,143,0.4)' : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}>
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
            <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 20px 0' }}>{t('dilVeRegion')}</h3>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 8 }}>{t('interfeysDili')}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { kod: 'az', ad: 'Azərbaycan dili' },
                  { kod: 'en', ad: 'English' },
                  { kod: 'ru', ad: 'Русский' },
                ].map(d => (
                  <div key={d.kod} onClick={() => changeDil(d.kod)} style={{ padding: '12px 14px', borderRadius: 8, cursor: 'pointer', background: dil === d.kod ? 'rgba(42,157,143,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${dil === d.kod ? 'rgba(42,157,143,0.3)' : 'rgba(255,255,255,0.07)'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s' }}>
                    <span style={{ fontSize: 13, color: '#fff' }}>{d.ad}</span>
                    {dil === d.kod && <Check style={{ width: 14, height: 14, color: '#2a9d8f' }} />}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 8 }}>{t('valyuta')}</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['USD', 'EUR', 'AZN'].map(v => (
                  <div key={v} onClick={() => setValyuta(v)} style={{ padding: '8px 16px', borderRadius: 8, cursor: 'pointer', background: valyuta === v ? 'rgba(42,157,143,0.12)' : 'rgba(255,255,255,0.04)', border: `1px solid ${valyuta === v ? 'rgba(42,157,143,0.3)' : 'rgba(255,255,255,0.07)'}`, fontSize: 13, color: valyuta === v ? '#fff' : 'rgba(255,255,255,0.5)', transition: 'all 0.2s' }}>{v}</div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'tehlukesiz':
        return (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 20px 0' }}>{t('tehlukesizlikTitle')}</h3>
            {[
              { label: t('cariSifre'), val: cur, set: setCur },
              { label: t('yeniSifre'), val: nw, set: setNw },
              { label: t('sifreyiTesdiqle'), val: conf, set: setConf },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                <input type="password" value={f.val} onChange={e => f.set(e.target.value)} placeholder="••••••••" style={inputStyle} />
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={savePassword} disabled={saving} style={{ padding: '10px 24px', fontSize: 13, fontWeight: 500, background: '#2a9d8f', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                {t('sifreyiYenile')}
              </button>
              {saveMsg && <span style={{ fontSize: 13, color: saveMsg.includes('✓') ? '#2a9d8f' : '#e63946' }}>{saveMsg}</span>}
            </div>
            <div style={{ marginTop: 24, padding: 16, background: 'rgba(230,57,70,0.08)', borderRadius: 10, border: '1px solid rgba(230,57,70,0.2)' }}>
              <p style={{ fontSize: 13, color: '#e63946', fontWeight: 500, margin: '0 0 6px 0' }}>{t('hesabiSil')}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '0 0 12px 0' }}>{t('hesabiSilDesc')}</p>
              <button style={{ padding: '8px 16px', fontSize: 12, background: 'transparent', color: '#e63946', border: '1px solid rgba(230,57,70,0.4)', borderRadius: 6, cursor: 'pointer' }}>{t('hesabiSil')}</button>
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