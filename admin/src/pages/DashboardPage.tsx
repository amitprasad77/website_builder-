// src/pages/DashboardPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWebsites, deleteWebsite, publishWebsite, createWebsite } from '../services/websiteService';
import { getTemplates } from '../services/templateService';
import type { Website } from '../services/websiteService';
import type { Template } from '../services/templateService';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [w, t] = await Promise.all([getWebsites(), getTemplates()]);
      setWebsites(w);
      setTemplates(t);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this website?')) return;
    await deleteWebsite(id);
    setWebsites(prev => prev.filter(w => w.id !== id));
  };

  const handlePublish = async (id: string) => {
    await publishWebsite(id);
    setWebsites(prev => prev.map(w => w.id === id ? { ...w, status: 'PUBLISHED' } : w));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a', color: '#ddd', fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <div style={{ background: '#0a0a16', borderBottom: '1px solid #2d2d42', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #6c63ff, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14 }}>W</div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>WebBuilder</span>
          <span style={{ color: '#2d2d42' }}>|</span>
          <span style={{ color: '#888', fontSize: 13 }}>Dashboard</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => navigate('/builder')}
            style={ghostBtn}
          >
            ✏️ Open Builder
          </button>
          <button
            onClick={() => setShowCreate(true)}
            style={{ ...ghostBtn, background: '#6c63ff', borderColor: '#6c63ff', color: '#fff', fontWeight: 600 }}
          >
            + New Website
          </button>
        </div>
      </div>

      <div style={{ padding: '32px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Websites', value: websites.length, icon: '🌐', color: '#6c63ff' },
            { label: 'Published', value: websites.filter(w => w.status === 'PUBLISHED').length, icon: '✅', color: '#16a34a' },
            { label: 'Drafts', value: websites.filter(w => w.status === 'DRAFT').length, icon: '📝', color: '#f59e0b' },
            { label: 'Templates', value: templates.length, icon: '🎨', color: '#a78bfa' },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#13131f', border: '1px solid #2d2d42', borderRadius: 12, padding: '20px 24px' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Websites List */}
        <div style={{ background: '#13131f', border: '1px solid #2d2d42', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #2d2d42', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#fff' }}>All Websites</h2>
            <button onClick={fetchData} style={ghostBtn}>↺ Refresh</button>
          </div>

          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#555' }}>Loading...</div>
          ) : websites.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#555' }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.2 }}>🌐</div>
              <div>No websites yet.</div>
              <button onClick={() => setShowCreate(true)} style={{ ...ghostBtn, marginTop: 16, background: '#6c63ff', borderColor: '#6c63ff', color: '#fff' }}>
                + Create your first website
              </button>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2d2d42' }}>
                  {['Name', 'Slug', 'Status', 'Template', 'Course', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: 11, color: '#555', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {websites.map(website => (
                  <tr key={website.id} style={{ borderBottom: '1px solid #1a1a2e' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#1a1a2e'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 24px' }}>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: 14 }}>{website.name}</div>
                      <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{website.id.slice(0, 8)}...</div>
                    </td>
                    <td style={{ padding: '14px 24px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#6c63ff' }}>/{website.slug}</span>
                    </td>
                    <td style={{ padding: '14px 24px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                        background: website.status === 'PUBLISHED' ? '#16a34a22' : '#f59e0b22',
                        color: website.status === 'PUBLISHED' ? '#16a34a' : '#f59e0b',
                        border: `1px solid ${website.status === 'PUBLISHED' ? '#16a34a44' : '#f59e0b44'}`,
                      }}>
                        {website.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 24px', fontSize: 13, color: '#888' }}>
                      {website.template?.name || '—'}
                    </td>
                    <td style={{ padding: '14px 24px', fontSize: 13, color: '#888' }}>
                      {website.course?.title || <span style={{ color: '#444' }}>No course</span>}
                    </td>
                    <td style={{ padding: '14px 24px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => navigate(`/dashboard/website/${website.id}`)}
                          style={{ ...smallBtn, borderColor: '#6c63ff44', color: '#6c63ff' }}
                        >
                          ✏️ Manage
                        </button>
                        {website.status === 'DRAFT' && (
                          <button
                            onClick={() => handlePublish(website.id)}
                            style={{ ...smallBtn, borderColor: '#16a34a44', color: '#16a34a' }}
                          >
                            🚀 Publish
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(website.id)}
                          style={{ ...smallBtn, borderColor: '#ff6b6b33', color: '#ff6b6b' }}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Templates Section */}
        <div style={{ marginTop: 32, background: '#13131f', border: '1px solid #2d2d42', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #2d2d42', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#fff' }}>Templates</h2>
            <button onClick={() => navigate('/builder')} style={ghostBtn}>+ Create Template</button>
          </div>
          <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {templates.map(t => (
              <div key={t.id} style={{ background: '#1e1e2e', border: '1px solid #2d2d42', borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>📄</div>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: 13 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>
                  {new Date(t.updatedAt).toLocaleDateString()}
                </div>
                <button
                  onClick={() => navigate('/builder')}
                  style={{ ...smallBtn, marginTop: 10, width: '100%', justifyContent: 'center', borderColor: '#6c63ff44', color: '#6c63ff' }}
                >
                  ✏️ Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Website Modal */}
      {showCreate && (
        <CreateWebsiteModal
          templates={templates}
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); fetchData(); }}
        />
      )}
    </div>
  );
}

// ─── Create Website Modal ──────────────────────────────────────────────────────
function CreateWebsiteModal({ templates, onClose, onCreated }: {
  templates: Template[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({ name: '', slug: '', templateId: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!form.name || !form.slug || !form.templateId) {
      setError('All fields are required');
      return;
    }
    setSaving(true);
    try {
      await createWebsite(form);
      onCreated();
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to create website');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#13131f', border: '1px solid #2d2d42', borderRadius: 12, width: 480, padding: 32 }} onClick={e => e.stopPropagation()}>
        <h2 style={{ margin: '0 0 24px', color: '#fff', fontSize: 18 }}>Create New Website</h2>

        {error && <div style={{ padding: 12, background: '#ff6b6b11', border: '1px solid #ff6b6b33', borderRadius: 8, color: '#ff6b6b', fontSize: 13, marginBottom: 16 }}>{error}</div>}

        <Field label="Website Name" placeholder="e.g. React Masterclass">
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="e.g. React Masterclass" />
        </Field>

        <Field label="Slug (URL)" placeholder="e.g. react-masterclass">
          <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} style={inputStyle} placeholder="e.g. react-masterclass" />
          <p style={{ fontSize: 11, color: '#555', marginTop: 4 }}>URL: localhost:3000/{form.slug || 'your-slug'}</p>
        </Field>

        <Field label="Template">
          <select value={form.templateId} onChange={e => setForm({ ...form, templateId: e.target.value })} style={inputStyle}>
            <option value="">Select a template...</option>
            {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </Field>

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={{ ...ghostBtn, flex: 1 }}>Cancel</button>
          <button onClick={handleSubmit} disabled={saving} style={{ ...ghostBtn, flex: 1, background: '#6c63ff', borderColor: '#6c63ff', color: '#fff', fontWeight: 600, opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Creating...' : 'Create Website'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, placeholder }: { label: string; children: React.ReactNode; placeholder?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', color: '#888', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px',
  background: '#1e1e2e', border: '1px solid #2d2d42',
  borderRadius: 8, color: '#ddd', fontSize: 14,
  outline: 'none', boxSizing: 'border-box',
};

const ghostBtn: React.CSSProperties = {
  background: 'transparent', border: '1px solid #2d2d42',
  borderRadius: 8, padding: '8px 16px',
  color: '#aaa', fontSize: 13, cursor: 'pointer',
  fontWeight: 500, whiteSpace: 'nowrap',
};

const smallBtn: React.CSSProperties = {
  background: 'transparent', border: '1px solid #2d2d42',
  borderRadius: 6, padding: '5px 10px',
  fontSize: 12, cursor: 'pointer',
  fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4,
};