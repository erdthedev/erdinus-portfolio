import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const configured = SUPABASE_URL.startsWith('http') && SUPABASE_ANON_KEY.length > 30;
const supabase = configured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const seed = {
  profile: {
    full_name: 'Erdinus',
    role: 'Mahasiswa Informatika • Staff Accounting',
    headline: 'Saya membangun sistem web yang rapi, fungsional, dan mudah dipakai.',
    bio: 'Fokus pada administrasi, accounting, dan pengembangan web app yang praktis untuk bisnis. Saya suka membuat sistem yang bukan cuma terlihat bagus, tapi juga bisa dipakai untuk kerja nyata.',
    email: 'erdinus19@gmail.com',
    whatsapp: '',
    github: 'https://github.com/erdthedev',
    linkedin: '',
    instagram: ''
  },
  projects: [
    { id: crypto.randomUUID(), title: 'UangKu', category: 'Finance Web App', description: 'Aplikasi pencatatan keuangan dengan dashboard, laporan, premium, dan admin panel.', tech_stack: 'Vite, Supabase, Vercel', demo_url: 'https://uangku-vercel.vercel.app/', repo_url: '', image_url: '' },
    { id: crypto.randomUUID(), title: 'Company Web App', category: 'Business System', description: 'Konsep sistem perusahaan untuk HRD, absensi karyawan, voucher, dan dashboard admin.', tech_stack: 'JavaScript, Supabase', demo_url: '', repo_url: '', image_url: '' },
    { id: crypto.randomUUID(), title: 'Portfolio App', category: 'Personal Branding', description: 'Portofolio dinamis yang bisa dikelola dari admin panel tanpa edit coding.', tech_stack: 'Supabase, Vercel', demo_url: '', repo_url: '', image_url: '' }
  ],
  skills: [
    { id: crypto.randomUUID(), name: 'Accounting & Administration', description: 'Mencatat, merapikan, dan membaca data kerja operasional.', level: 88 },
    { id: crypto.randomUUID(), name: 'Web Development', description: 'Membangun web app ringan dengan JavaScript dan Supabase.', level: 78 },
    { id: crypto.randomUUID(), name: 'UI System Thinking', description: 'Menyusun fitur agar mudah dipahami dan dipakai user.', level: 74 }
  ],
  experience: [
    { id: crypto.randomUUID(), title: 'Staff Accounting', organization: 'Perusahaan / Kantor', period: 'Sekarang', description: 'Mengelola pekerjaan accounting dan administrasi harian.', sort_order: 1 },
    { id: crypto.randomUUID(), title: 'Mahasiswa Informatika', organization: 'Program Studi Informatika', period: 'Aktif', description: 'Belajar pemrograman, database, sistem web, dan pengembangan aplikasi.', sort_order: 2 }
  ],
  messages: []
};

let state = loadLocal();
let session = null;

function loadLocal() {
  const raw = localStorage.getItem('portfolio_app_data');
  return raw ? JSON.parse(raw) : structuredClone(seed);
}
function saveLocal() { localStorage.setItem('portfolio_app_data', JSON.stringify(state)); }
function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2600);
}
function escapeHtml(text = '') {
  return String(text).replace(/[&<>'"]/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '\'':'&#39;', '"':'&quot;' }[c]));
}
function formToObject(form) { return Object.fromEntries(new FormData(form).entries()); }
function setFormValues(form, data = {}) { Object.keys(data).forEach(k => { if (form.elements[k]) form.elements[k].value = data[k] ?? ''; }); }

async function dbSelect(table, fallback) {
  if (!supabase) return fallback;
  const { data, error } = await supabase.from(table).select('*').order(table === 'experience' ? 'sort_order' : 'created_at', { ascending: table === 'experience' });
  if (error) { console.warn(error); return fallback; }
  return data || fallback;
}
async function dbProfile() {
  if (!supabase) return state.profile;
  const { data, error } = await supabase.from('profile').select('*').limit(1).maybeSingle();
  if (error || !data) return state.profile;
  return data;
}
async function refreshData() {
  state.profile = await dbProfile();
  state.projects = await dbSelect('projects', state.projects);
  state.skills = await dbSelect('skills', state.skills);
  state.experience = await dbSelect('experience', state.experience);
  state.messages = await dbSelect('messages', state.messages);
  saveLocal();
  renderAll();
}

function renderAll() {
  renderProfile(); renderSkills(); renderProjects(); renderExperience(); renderAdminLists();
}
function renderProfile() {
  const p = state.profile;
  $('#brandName').textContent = p.full_name || 'Portfolio';
  $('#profileName').textContent = p.full_name || 'Portfolio';
  $('#profileRole').textContent = p.role || '';
  $('#heroTitle').textContent = p.headline || '';
  $('#heroSubtitle').textContent = p.bio || '';
  $('#profileBio').textContent = p.bio || '';
  $('#avatarInitial').textContent = (p.full_name || 'E').trim()[0]?.toUpperCase() || 'E';
  $('#statProjects').textContent = state.projects.length;
  $('#statSkills').textContent = state.skills.length;
  $('#statExperience').textContent = state.experience.length;
  const links = [
    ['Email', p.email ? `mailto:${p.email}` : ''],
    ['WhatsApp', p.whatsapp ? `https://wa.me/${p.whatsapp.replace(/\D/g, '')}` : ''],
    ['GitHub', p.github], ['LinkedIn', p.linkedin], ['Instagram', p.instagram]
  ].filter(([, url]) => url);
  $('#socialLinks').innerHTML = links.map(([label, url]) => `<a href="${escapeHtml(url)}" target="_blank" rel="noreferrer">${label}</a>`).join('');
  setFormValues($('#profileForm'), p);
}
function renderSkills() {
  $('#skillsGrid').innerHTML = state.skills.length ? state.skills.map(s => `
    <article class="skill-card">
      <h3>${escapeHtml(s.name)}</h3>
      <p class="muted">${escapeHtml(s.description || '')}</p>
      <div class="meter" aria-label="Level ${escapeHtml(s.level)}"><span style="--level:${Number(s.level || 0)}%"></span></div>
    </article>`).join('') : '<div class="empty">Belum ada skill.</div>';
}
function renderProjects() {
  $('#projectsGrid').innerHTML = state.projects.length ? state.projects.map(p => `
    <article class="project-card">
      ${p.image_url ? `<img class="project-thumb" src="${escapeHtml(p.image_url)}" alt="${escapeHtml(p.title)}" />` : `<div class="project-thumb">${escapeHtml((p.title || 'P')[0])}</div>`}
      <div class="project-body">
        <span class="badge">${escapeHtml(p.category || 'Project')}</span>
        <h3>${escapeHtml(p.title)}</h3>
        <p class="muted">${escapeHtml(p.description || '')}</p>
        <small>${escapeHtml(p.tech_stack || '')}</small>
        <div class="card-actions">
          ${p.demo_url ? `<a href="${escapeHtml(p.demo_url)}" target="_blank" rel="noreferrer">Demo</a>` : ''}
          ${p.repo_url ? `<a href="${escapeHtml(p.repo_url)}" target="_blank" rel="noreferrer">Repo</a>` : ''}
        </div>
      </div>
    </article>`).join('') : '<div class="empty">Belum ada project.</div>';
}
function renderExperience() {
  const sorted = [...state.experience].sort((a,b) => Number(a.sort_order || 0) - Number(b.sort_order || 0));
  $('#experienceList').innerHTML = sorted.length ? sorted.map(e => `
    <article class="timeline-item">
      <span>${escapeHtml(e.period || '')}</span>
      <h3>${escapeHtml(e.title)} — ${escapeHtml(e.organization)}</h3>
      <p>${escapeHtml(e.description || '')}</p>
    </article>`).join('') : '<div class="empty">Belum ada pengalaman.</div>';
}
function renderAdminLists() {
  $('#adminProjects').innerHTML = renderList('projects', state.projects, 'title', 'description');
  $('#adminSkills').innerHTML = renderList('skills', state.skills, 'name', 'description');
  $('#adminExperience').innerHTML = renderList('experience', state.experience, 'title', 'organization');
  $('#adminMessages').innerHTML = state.messages.length ? state.messages.map(m => `<div class="list-item"><div><strong>${escapeHtml(m.name)}</strong><p>${escapeHtml(m.email)} — ${escapeHtml(m.message)}</p></div></div>`).join('') : '<div class="empty">Belum ada pesan.</div>';
}
function renderList(type, rows, titleKey, subKey) {
  return rows.length ? rows.map(item => `<div class="list-item">
    <div><strong>${escapeHtml(item[titleKey])}</strong><p>${escapeHtml(item[subKey] || '')}</p></div>
    <div class="list-actions">
      <button class="btn btn-secondary" data-edit="${type}" data-id="${item.id}">Edit</button>
      <button class="btn btn-danger" data-delete="${type}" data-id="${item.id}">Hapus</button>
    </div>
  </div>`).join('') : '<div class="empty">Belum ada data.</div>';
}

async function upsert(table, payload) {
  payload.updated_at = new Date().toISOString();
  if (!supabase) {
    if (table === 'profile') state.profile = { ...state.profile, ...payload };
    else {
      if (!payload.id) payload.id = crypto.randomUUID();
      const idx = state[table].findIndex(x => x.id === payload.id);
      if (idx >= 0) state[table][idx] = { ...state[table][idx], ...payload };
      else state[table].unshift({ ...payload, created_at: new Date().toISOString() });
    }
    saveLocal(); return;
  }
  const { error } = await supabase.from(table).upsert(payload);
  if (error) throw error;
}
async function removeRow(table, id) {
  if (!supabase) { state[table] = state[table].filter(x => x.id !== id); saveLocal(); return; }
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
}

$('#adminToggle').addEventListener('click', () => $('#adminPanel').classList.add('show'));
$('#closeAdmin').addEventListener('click', () => $('#adminPanel').classList.remove('show'));
$$('.tab-btn').forEach(btn => btn.addEventListener('click', () => {
  $$('.tab-btn').forEach(b => b.classList.remove('active'));
  $$('.tab-content').forEach(c => c.classList.add('hidden'));
  btn.classList.add('active');
  $(`#tab-${btn.dataset.tab}`).classList.remove('hidden');
}));

$('#loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!supabase) { session = { user: { email: 'demo@local' } }; showDashboard(); toast('Mode demo aktif. Isi config Supabase untuk login asli.'); return; }
  const { email, password } = formToObject(e.target);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return toast(error.message);
  session = data.session;
  showDashboard(); toast('Login berhasil.');
});
$('#logoutBtn').addEventListener('click', async () => {
  if (supabase) await supabase.auth.signOut();
  session = null;
  $('#loginView').classList.remove('hidden');
  $('#dashboardView').classList.add('hidden');
});
function showDashboard() {
  $('#loginView').classList.add('hidden');
  $('#dashboardView').classList.remove('hidden');
}

$('#profileForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  try { await upsert('profile', { id: state.profile.id, ...formToObject(e.target) }); await refreshData(); toast('Profil disimpan.'); }
  catch (err) { toast(err.message); }
});
['project','skill','experience'].forEach(kind => {
  $(`#${kind}Form`).addEventListener('submit', async (e) => saveEntity(e, kind));
});
async function saveEntity(e, kind) {
  e.preventDefault();
  const table = kind === 'project' ? 'projects' : kind === 'skill' ? 'skills' : 'experience';
  const payload = formToObject(e.target);
  if (!payload.id) delete payload.id;
  if (payload.level) payload.level = Number(payload.level);
  if (payload.sort_order) payload.sort_order = Number(payload.sort_order);
  try { await upsert(table, payload); e.target.reset(); await refreshData(); toast('Data disimpan.'); }
  catch (err) { toast(err.message); }
}
document.addEventListener('click', async (e) => {
  const edit = e.target.closest('[data-edit]');
  const del = e.target.closest('[data-delete]');
  if (edit) {
    const table = edit.dataset.edit; const id = edit.dataset.id;
    const item = state[table].find(x => x.id === id);
    const formId = table === 'projects' ? 'projectForm' : table === 'skills' ? 'skillForm' : 'experienceForm';
    setFormValues($(`#${formId}`), item);
    toast('Data dimuat ke form edit.');
  }
  if (del) {
    const table = del.dataset.delete; const id = del.dataset.id;
    if (!confirm('Hapus data ini?')) return;
    try { await removeRow(table, id); await refreshData(); toast('Data dihapus.'); }
    catch (err) { toast(err.message); }
  }
});
$('#contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = { id: crypto.randomUUID(), ...formToObject(e.target), created_at: new Date().toISOString() };
  try {
    if (supabase) {
      const { error } = await supabase.from('messages').insert(payload);
      if (error) throw error;
    } else { state.messages.unshift(payload); saveLocal(); }
    e.target.reset(); await refreshData(); toast('Pesan terkirim.');
  } catch (err) { toast(err.message); }
});

(async function init() {
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    session = data.session;
    if (session) showDashboard();
  }
  await refreshData();
})();
