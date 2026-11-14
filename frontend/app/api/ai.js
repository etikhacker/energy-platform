import { createClient } from '@supabase/supabase-js';

const SYSTEM_PROMPT = 'Sən enerji qənaəti üzrə ekspertsən. Azərbaycan dilində, qısa və praktik cavab ver. Fakt kimi təqdim etdiyin rəqəmlər yalnız istifadəçinin verdiyi məlumatlara əsaslansın.';
const MAX_QUESTION_LENGTH = 1000;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) {
    return res.status(415).json({ error: 'JSON tələb olunur.' });
  }

  const authHeader = req.headers.authorization || '';
  const token = /^Bearer (\S+)$/i.exec(authHeader)?.[1];
  if (!token) return res.status(401).json({ error: 'Giriş tələb olunur.' });

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!supabaseUrl || !supabaseAnonKey || !geminiKey) {
    console.error('AI proxy is missing required server environment variables');
    return res.status(503).json({ error: 'AI xidməti hazırda konfiqurasiya edilməyib.' });
  }

  let question;
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    question = typeof body?.question === 'string' ? body.question.trim() : '';
  } catch {
    return res.status(400).json({ error: 'Yanlış JSON formatı.' });
  }
  if (question.length < 1 || question.length > MAX_QUESTION_LENGTH) {
    return res.status(400).json({ error: 'Sual 1–1000 simvol arasında olmalıdır.' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return res.status(401).json({ error: 'Sessiya etibarsızdır.' });

    const upstream = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': geminiKey },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: 'user', parts: [{ text: question }] }],
          generationConfig: { maxOutputTokens: 350 },
        }),
        signal: AbortSignal.timeout(18000),
      },
    );
    if (!upstream.ok) {
      console.error('AI provider returned HTTP', upstream.status);
      return res.status(502).json({ error: 'AI xidmətindən cavab alınmadı. Sonra yenidən yoxlayın.' });
    }
    const result = await upstream.json();
    const answer = result.candidates?.[0]?.content?.parts
      ?.map(part => typeof part.text === 'string' ? part.text : '')
      .filter(Boolean).join('\n').trim();
    if (!answer) return res.status(502).json({ error: 'AI cavabı boş gəldi.' });
    return res.status(200).json({ answer });
  } catch (error) {
    console.error('AI proxy request failed', error instanceof Error ? error.name : 'Unknown');
    return res.status(502).json({ error: 'AI xidməti müvəqqəti əlçatan deyil.' });
  }
}
