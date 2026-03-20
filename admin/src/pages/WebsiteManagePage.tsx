// src/pages/WebsiteManagePage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getWebsite, updateWebsite, publishWebsite,
  createCourse, updateCourse, addLesson, deleteLesson,
} from '../services/websiteService';
import type { Website, Course, Lesson } from '../services/websiteService';

type Tab = 'course' | 'lessons' | 'settings';

export default function WebsiteManagePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [website, setWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('course');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchWebsite();
  }, [id]);

  const fetchWebsite = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getWebsite(id);
      setWebsite(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <LoadingScreen />;
  if (!website) return <div style={{ padding: 40, color: '#ff6b6b' }}>Website not found</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a', color: '#ddd', fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <div style={{ background: '#0a0a16', borderBottom: '1px solid #2d2d42', padding: '0 32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate('/dashboard')} style={{ ...ghostBtn, padding: '6px 10px' }}>← Back</button>
          <span style={{ color: '#2d2d42' }}>|</span>
          <span style={{ color: '#fff', fontWeight: 700 }}>{website.name}</span>
          <StatusBadge status={website.status} />
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {saved && <span style={{ fontSize: 12, color: '#16a34a' }}>✓ Saved</span>}
          {website.status === 'DRAFT' && (
            <button
              onClick={async () => {
                await publishWebsite(website.id);
                setWebsite(prev => prev ? { ...prev, status: 'PUBLISHED' } : prev);
              }}
              style={{ ...ghostBtn, background: '#16a34a', borderColor: '#16a34a', color: '#fff', fontWeight: 600 }}
            >
              🚀 Publish
            </button>
          )}
          <button onClick={() => navigate('/builder')} style={ghostBtn}>
            ✏️ Edit Template
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: '#0a0a16', borderBottom: '1px solid #2d2d42', padding: '0 32px', display: 'flex', gap: 0 }}>
        {(['course', 'lessons', 'settings'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'none', border: 'none', borderBottom: activeTab === tab ? '2px solid #6c63ff' : '2px solid transparent',
              padding: '14px 20px', color: activeTab === tab ? '#6c63ff' : '#555',
              fontSize: 13, fontWeight: activeTab === tab ? 600 : 400,
              cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.15s',
            }}
          >
            {tab === 'course' ? '📚 Course Details' : tab === 'lessons' ? '🎬 Lessons' : '⚙️ Settings'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '32px', maxWidth: 800 }}>
        {activeTab === 'course' && (
          <CourseDetailsTab
            website={website}
            onUpdate={(updatedWebsite) => { setWebsite(updatedWebsite); showSaved(); }}
          />
        )}
        {activeTab === 'lessons' && (
          <LessonsTab
            website={website}
            onUpdate={(updatedWebsite) => { setWebsite(updatedWebsite); showSaved(); }}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsTab
            website={website}
            onUpdate={(updatedWebsite) => { setWebsite(updatedWebsite); showSaved(); }}
          />
        )}
      </div>
    </div>
  );
}

// ─── Course Details Tab ────────────────────────────────────────────────────────
function CourseDetailsTab({ website, onUpdate }: { website: Website; onUpdate: (w: Website) => void }) {
  const [form, setForm] = useState({
    title: website.course?.title || '',
    description: website.course?.description || '',
    instructor: website.course?.instructor || '',
    thumbnail: website.course?.thumbnail || '',
    price: website.course?.price?.toString() || '',
    duration: website.course?.duration || '',
    level: website.course?.level || 'Beginner',
    tags: website.course?.tags?.join(', ') || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price) || 0,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        websiteId: website.id,
      };

      if (website.course?.id) {
        await updateCourse(website.course.id, payload);
      } else {
        await createCourse(payload);
      }

      const updated = await getWebsite(website.id);
      onUpdate(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 style={{ color: '#fff', fontSize: 18, marginTop: 0, marginBottom: 24 }}>Course Details</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <FormField label="Course Title" full>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} placeholder="e.g. React Masterclass 2025" />
        </FormField>

        <FormField label="Instructor Name">
          <input value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} style={inputStyle} placeholder="e.g. John Doe" />
        </FormField>

        <FormField label="Price ($)">
          <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} style={inputStyle} placeholder="49" type="number" />
        </FormField>

        <FormField label="Duration">
          <input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} style={inputStyle} placeholder="e.g. 42 Hours" />
        </FormField>

        <FormField label="Level">
          <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} style={inputStyle}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
            <option>Beginner to Advanced</option>
          </select>
        </FormField>

        <FormField label="Tags (comma separated)">
          <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} style={inputStyle} placeholder="react, typescript, frontend" />
        </FormField>

        <FormField label="Thumbnail URL" full>
          <input value={form.thumbnail} onChange={e => setForm({ ...form, thumbnail: e.target.value })} style={inputStyle} placeholder="https://..." />
          {form.thumbnail && <img src={form.thumbnail} alt="thumbnail" style={{ marginTop: 8, width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 8 }} />}
        </FormField>

        <FormField label="Description" full>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} placeholder="Describe your course..." />
        </FormField>
      </div>

      {/* Variable hints */}
      <div style={{ background: '#1a1a2e', border: '1px solid #2d2d42', borderRadius: 8, padding: 16, marginTop: 8, marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: '#6c63ff', margin: '0 0 8px', fontWeight: 600 }}>💡 Template Variables</p>
        <p style={{ fontSize: 11, color: '#555', margin: 0, lineHeight: 1.8 }}>
          These values auto-replace placeholders in your template:<br />
          <code style={{ color: '#a78bfa' }}>{'{{course.title}}'}</code> · <code style={{ color: '#a78bfa' }}>{'{{course.description}}'}</code> · <code style={{ color: '#a78bfa' }}>{'{{course.price}}'}</code> · <code style={{ color: '#a78bfa' }}>{'{{course.instructor}}'}</code> · <code style={{ color: '#a78bfa' }}>{'{{course.duration}}'}</code> · <code style={{ color: '#a78bfa' }}>{'{{course.level}}'}</code> · <code style={{ color: '#a78bfa' }}>{'{{course.thumbnail}}'}</code>
        </p>
      </div>

      <button onClick={handleSave} disabled={saving} style={{ ...ghostBtn, background: '#6c63ff', borderColor: '#6c63ff', color: '#fff', fontWeight: 600, padding: '10px 24px', opacity: saving ? 0.7 : 1 }}>
        {saving ? 'Saving...' : '↑ Save Course Details'}
      </button>
    </div>
  );
}

// ─── Lessons Tab ───────────────────────────────────────────────────────────────
function LessonsTab({ website, onUpdate }: { website: Website; onUpdate: (w: Website) => void }) {
  const lessons = website.course?.lessons || [];
  const [newLesson, setNewLesson] = useState({ title: '', description: '', duration: '', videoUrl: '' });
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = async () => {
    if (!newLesson.title) return;
    if (!website.course?.id) {
      alert('Please save course details first!');
      return;
    }
    setAdding(true);
    try {
      await addLesson(website.course.id, {
        ...newLesson,
        order: lessons.length + 1,
      });
      const updated = await getWebsite(website.id);
      onUpdate(updated);
      setNewLesson({ title: '', description: '', duration: '', videoUrl: '' });
      setShowForm(false);
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (lessonId: string) => {
    if (!confirm('Delete this lesson?')) return;
    await deleteLesson(lessonId);
    const updated = await getWebsite(website.id);
    onUpdate(updated);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ color: '#fff', fontSize: 18, margin: 0 }}>Lessons ({lessons.length})</h2>
        <button onClick={() => setShowForm(!showForm)} style={{ ...ghostBtn, background: '#6c63ff', borderColor: '#6c63ff', color: '#fff', fontWeight: 600 }}>
          + Add Lesson
        </button>
      </div>

      {!website.course?.id && (
        <div style={{ padding: 16, background: '#f59e0b11', border: '1px solid #f59e0b33', borderRadius: 8, color: '#f59e0b', fontSize: 13, marginBottom: 16 }}>
          ⚠️ Please fill in Course Details first before adding lessons.
        </div>
      )}

      {/* Add Lesson Form */}
      {showForm && (
        <div style={{ background: '#13131f', border: '1px solid #6c63ff44', borderRadius: 10, padding: 20, marginBottom: 20 }}>
          <h3 style={{ color: '#fff', fontSize: 14, margin: '0 0 16px' }}>New Lesson</h3>
          <FormField label="Title" full>
            <input value={newLesson.title} onChange={e => setNewLesson({ ...newLesson, title: e.target.value })} style={inputStyle} placeholder="e.g. Introduction to React" />
          </FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Duration">
              <input value={newLesson.duration} onChange={e => setNewLesson({ ...newLesson, duration: e.target.value })} style={inputStyle} placeholder="e.g. 45 min" />
            </FormField>
            <FormField label="Video URL">
              <input value={newLesson.videoUrl} onChange={e => setNewLesson({ ...newLesson, videoUrl: e.target.value })} style={inputStyle} placeholder="https://..." />
            </FormField>
          </div>
          <FormField label="Description" full>
            <textarea value={newLesson.description} onChange={e => setNewLesson({ ...newLesson, description: e.target.value })} style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} placeholder="What will students learn?" />
          </FormField>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button onClick={() => setShowForm(false)} style={ghostBtn}>Cancel</button>
            <button onClick={handleAdd} disabled={adding} style={{ ...ghostBtn, background: '#6c63ff', borderColor: '#6c63ff', color: '#fff', fontWeight: 600, opacity: adding ? 0.7 : 1 }}>
              {adding ? 'Adding...' : '+ Add Lesson'}
            </button>
          </div>
        </div>
      )}

      {/* Lessons List */}
      {lessons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#555' }}>
          <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.2 }}>🎬</div>
          <div>No lessons yet. Add your first lesson!</div>
        </div>
      ) : (
        <div>
          {lessons.sort((a, b) => a.order - b.order).map((lesson, index) => (
            <div key={lesson.id} style={{ background: '#13131f', border: '1px solid #2d2d42', borderRadius: 10, padding: '16px 20px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#6c63ff22', border: '1px solid #6c63ff44', color: '#6c63ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                {index + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: 14 }}>{lesson.title}</div>
                <div style={{ fontSize: 12, color: '#555', marginTop: 3 }}>
                  {lesson.duration && <span>⏱ {lesson.duration}</span>}
                  {lesson.description && <span style={{ marginLeft: 12 }}>📝 {lesson.description.slice(0, 60)}...</span>}
                </div>
              </div>
              {lesson.videoUrl && (
                <span style={{ fontSize: 11, color: '#6c63ff', background: '#6c63ff22', padding: '3px 8px', borderRadius: 20 }}>▶ Video</span>
              )}
              <button onClick={() => handleDelete(lesson.id)} style={{ ...smallBtn, borderColor: '#ff6b6b33', color: '#ff6b6b' }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Settings Tab ──────────────────────────────────────────────────────────────
function SettingsTab({ website, onUpdate }: { website: Website; onUpdate: (w: Website) => void }) {
  const [form, setForm] = useState({ name: website.name, slug: website.slug });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateWebsite(website.id, form);
      onUpdate({ ...website, ...updated });
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 style={{ color: '#fff', fontSize: 18, marginTop: 0, marginBottom: 24 }}>Website Settings</h2>

      <FormField label="Website Name" full>
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
      </FormField>

      <FormField label="Slug (URL)" full>
        <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} style={inputStyle} />
        <p style={{ fontSize: 12, color: '#555', marginTop: 4 }}>
          Learner URL: <span style={{ color: '#6c63ff' }}>localhost:3000/{form.slug}</span>
        </p>
      </FormField>

      <FormField label="Status" full>
        <div style={{ padding: '10px 12px', background: '#1e1e2e', border: '1px solid #2d2d42', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <StatusBadge status={website.status} />
          {website.status === 'DRAFT' && (
            <button
              onClick={async () => {
                await publishWebsite(website.id);
                onUpdate({ ...website, status: 'PUBLISHED' });
              }}
              style={{ ...ghostBtn, background: '#16a34a', borderColor: '#16a34a', color: '#fff', fontWeight: 600 }}
            >
              🚀 Publish Now
            </button>
          )}
        </div>
      </FormField>

      <div style={{ marginTop: 8, padding: 16, background: '#13131f', border: '1px solid #2d2d42', borderRadius: 8 }}>
        <p style={{ fontSize: 12, color: '#888', margin: '0 0 8px', fontWeight: 600 }}>Website ID</p>
        <code style={{ fontSize: 12, color: '#555' }}>{website.id}</code>
      </div>

      <button onClick={handleSave} disabled={saving} style={{ ...ghostBtn, background: '#6c63ff', borderColor: '#6c63ff', color: '#fff', fontWeight: 600, padding: '10px 24px', marginTop: 24, opacity: saving ? 0.7 : 1 }}>
        {saving ? 'Saving...' : '↑ Save Settings'}
      </button>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
      background: status === 'PUBLISHED' ? '#16a34a22' : '#f59e0b22',
      color: status === 'PUBLISHED' ? '#16a34a' : '#f59e0b',
      border: `1px solid ${status === 'PUBLISHED' ? '#16a34a44' : '#f59e0b44'}`,
    }}>
      {status}
    </span>
  );
}

function FormField({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div style={{ marginBottom: 16, gridColumn: full ? '1 / -1' : undefined }}>
      <label style={{ display: 'block', color: '#888', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d0d1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
      Loading...
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
  fontSize: 12, cursor: 'pointer', fontWeight: 500,
};