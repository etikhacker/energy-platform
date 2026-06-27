import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Phone, User, Calendar, Trash2, Shield } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

interface Muraciet {
  id: string;
  tam_ad: string;
  email: string;
  mobil: string;
  created_at: string;
  oxunub: boolean;
}

export default function AdminPage() {
  const [muracietler, setMuracietler] = useState<Muraciet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [filter, setFilter] = useState<'hamisi' | 'oxunmamis' | 'oxunmus'>('hamisi');
  const isMobile = useIsMobile();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setChecking(false);
        return;
      }

      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      if (session.user.email === adminEmail) {
        setIsAdmin(true);
        loadMuracietler();
      }
    } catch (err) {
      console.error('Admin check error:', err);
    } finally {
      setChecking(false);
    }
  };

  const loadMuracietler = async () => {
    const { data } = await supabase
      .from('muracietler')
      .select('*')
      .order('created_at', { ascending: false });
    setMuracietler(data || []);
    setLoading(false);
  };

  const oxunduIsaretle = async (id: string) => {
    await supabase.from('muracietler').update({ oxunub: true }).eq('id', id);
    setMuracietler(prev => prev.map(m => m.id === id ? { ...m, oxunub: true } : { ...m }));
  };

  const sil = async (id: string) => {
    if (!confirm('Silmək istədiyinizdən əminsiniz?')) return;
    await supabase.from('muracietler').delete().eq('id', id);
    setMuracietler(prev => prev.filter(m => m.id !== id));
  };

  if (checking) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#001219' }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid #2a9d8f', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#001219', flexDirection: 'column', gap: 16, padding: 24, textAlign: 'center' }}>
        <Shield style={{ width: 48, height: 48, color: '#e63946' }} />
        <p style={{ color: '#fff', fontSize: 18, fontWeight: 500 }}>Giriş qadağandır</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Bu səhifəyə yalnız adminlər daxil ola bilər</p>
        <a href="/dashboard" style={{ marginTop: 8, padding: '8px 20px', borderRadius: 8, background: 'rgba(42,157,143,0.2)', border: '1px solid rgba(42,157,143,0.3)', color: '#2a9d8f', textDecoration: 'none', fontSize: 13 }}>
          Dashboard-a qayıt
        </a>
      </div>
    );
  }

  const filtered = muracietler.filter(m => {
    if (filter === 'oxunmamis') return !m.oxunub;
    if (filter === 'oxunmus') return m.oxunub;
    return true;
  });

  const oxunmamisSayi = muracietler.filter(m => !m.oxunub).length;

  const pagePadding = isMobile ? 16 : 32;
  const statsColumns = isMobile ? '1fr' : 'repeat(3, 1fr)';

  return (
    <div style={{ minHeight: '100vh', background: '#001219', padding: pagePadding }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        gap: isMobile ? 16 : 0,
        marginBottom: 24,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Shield style={{ width: 20, height: 20, color: '#2a9d8f' }} />
            <h1 style={{ fontSize: 22, fontWeight: 600, color: '#fff', margin: 0 }}>Admin Panel</h1>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Demo müraciətləri idarə edin</p>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          alignItems: 'center',
          width: isMobile ? '100%' : 'auto',
        }}>
          {[
            { key: 'hamisi', label: isMobile ? `Hamısı (${muracietler.length})` : `Hamısı (${muracietler.length})` },
            { key: 'oxunmamis', label: isMobile ? `Oxunmamış (${oxunmamisSayi})` : `Oxunmamış (${oxunmamisSayi})` },
            { key: 'oxunmus', label: 'Oxunmuş' },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key as 'hamisi' | 'oxunmamis' | 'oxunmus')} style={{
              padding: isMobile ? '8px 12px' : '7px 16px',
              fontSize: 12,
              borderRadius: 8,
              border: '1px solid',
              borderColor: filter === f.key ? '#2a9d8f' : 'rgba(255,255,255,0.12)',
              background: filter === f.key ? 'rgba(42,157,143,0.15)' : 'transparent',
              color: filter === f.key ? '#2a9d8f' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              flex: isMobile ? '1 1 auto' : '0 0 auto',
              minWidth: 0,
            }}>{f.label}</button>
          ))}
          <a href="/dashboard" style={{
            padding: isMobile ? '8px 12px' : '7px 16px',
            fontSize: 12,
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.5)',
            textDecoration: 'none',
            flex: isMobile ? '1 1 auto' : '0 0 auto',
            textAlign: 'center',
          }}>
            {isMobile ? '← Panel' : '← Dashboard'}
          </a>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: statsColumns, gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Ümumi Müraciət', value: muracietler.length, color: '#2a9d8f' },
          { label: 'Oxunmamış', value: oxunmamisSayi, color: '#e9d8a6' },
          { label: 'Oxunmuş', value: muracietler.length - oxunmamisSayi, color: '#94d2bd' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(0,22,30,0.82)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 16 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '0 0 8px 0' }}>{s.label}</p>
            <p style={{ fontSize: 24, fontWeight: 600, color: s.color, fontFamily: 'monospace', margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Müraciətlər */}
      {loading ? (
        <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>Yüklənir...</p>
      ) : filtered.length === 0 ? (
        <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 60 }}>Müraciət yoxdur</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(m => (
            <div key={m.id} style={{
              background: 'rgba(0,22,30,0.82)',
              border: `1px solid ${m.oxunub ? 'rgba(255,255,255,0.08)' : 'rgba(42,157,143,0.3)'}`,
              borderRadius: 12,
              padding: isMobile ? 14 : 20,
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              justifyContent: 'space-between',
              gap: isMobile ? 12 : 0,
            }}>
              <div style={{ display: 'flex', gap: isMobile ? 12 : 20, alignItems: 'flex-start', width: '100%', minWidth: 0 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(42,157,143,0.15)', border: '1px solid rgba(42,157,143,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User style={{ width: 18, height: 18, color: '#2a9d8f' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#fff', margin: '0 0 6px 0', wordBreak: 'break-word' }}>{m.tam_ad}</p>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: isMobile ? 8 : 16,
                    rowGap: 4,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0, maxWidth: '100%' }}>
                      <Mail style={{ width: 12, height: 12, color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.email}</span>
                    </div>
                    {m.mobil && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Phone style={{ width: 12, height: 12, color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{m.mobil}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Calendar style={{ width: 12, height: 12, color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                        {new Date(m.created_at).toLocaleDateString('az-AZ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: isMobile ? '100%' : 'auto',
                justifyContent: isMobile ? 'flex-end' : 'flex-start',
                flexWrap: 'wrap',
              }}>
                {!m.oxunub && (
                  <span style={{ fontSize: 10, padding: '3px 10px', borderRadius: 20, background: 'rgba(42,157,143,0.15)', color: '#2a9d8f', border: '1px solid rgba(42,157,143,0.3)' }}>YENİ</span>
                )}
                {!m.oxunub && (
                  <button onClick={() => oxunduIsaretle(m.id)} style={{ padding: '6px 14px', fontSize: 11, borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
                    Oxundu işarələ
                  </button>
                )}
                <button onClick={() => sil(m.id)} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(230,57,70,0.2)', background: 'rgba(230,57,70,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Trash2 style={{ width: 14, height: 14, color: '#e63946' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
