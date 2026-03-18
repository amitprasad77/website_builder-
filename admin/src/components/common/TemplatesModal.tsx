// src/components/common/TemplatesModal.tsx
import { useEffect, useState } from 'react';
import { getTemplates, deleteTemplate } from '../../services/templateService';
import { useBuilderStore } from '../../store/builderStore';
import type { LayoutNode } from '../../types/builder';

interface Template {
  id: string;
  name: string;
  layout: LayoutNode;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  onClose: () => void;
  onLoad: (template: Template) => void;
}

export default function TemplatesModal({ onClose, onLoad }: Props) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch (e) {
      setError('Failed to load templates. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this template?')) return;
    setDeleting(id);
    try {
      await deleteTemplate(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch {
      alert('Failed to delete template.');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const countComponents = (node: LayoutNode): number => {
    if (!node.children) return 0;
    return node.children.length + node.children.reduce((acc, child) => acc + countComponents(child), 0);
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#13131f',
          border: '1px solid #2d2d42',
          borderRadius: '12px',
          width: '680px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #2d2d42',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: '16px', fontWeight: 700, margin: 0 }}>
              Saved Templates
            </h2>
            <p style={{ color: '#555', fontSize: '12px', margin: '4px 0 0' }}>
              {templates.length} template{templates.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={fetchTemplates} style={ghostBtn} title="Refresh">
              ↺ Refresh
            </button>
            <button onClick={onClose} style={{ ...ghostBtn, color: '#ff6b6b', borderColor: '#ff6b6b33' }}>
              ✕ Close
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '16px 24px' }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#555' }}>
              Loading templates...
            </div>
          )}

          {error && (
            <div style={{
              padding: '16px', background: '#ff6b6b11', border: '1px solid #ff6b6b33',
              borderRadius: '8px', color: '#ff6b6b', fontSize: '13px', textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          {!loading && !error && templates.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#555' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.3 }}>📄</div>
              <div>No templates saved yet.</div>
              <div style={{ fontSize: '12px', marginTop: '8px', color: '#444' }}>
                Build something on the canvas and click Save Template.
              </div>
            </div>
          )}

          {!loading && templates.map((template) => (
            <div
              key={template.id}
              onClick={() => onLoad(template)}
              style={{
                padding: '16px',
                background: '#1e1e2e',
                border: '1px solid #2d2d42',
                borderRadius: '10px',
                marginBottom: '10px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#6c63ff';
                (e.currentTarget as HTMLDivElement).style.background = '#252538';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#2d2d42';
                (e.currentTarget as HTMLDivElement).style.background = '#1e1e2e';
              }}
            >
              {/* Icon */}
              <div style={{
                width: '48px', height: '48px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #6c63ff22, #a78bfa22)',
                border: '1px solid #6c63ff33',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', flexShrink: 0,
              }}>
                📄
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>
                  {template.name}
                </div>
                <div style={{ color: '#555', fontSize: '12px', marginTop: '4px' }}>
                  {countComponents(template.layout)} components · Updated {formatDate(template.updatedAt)}
                </div>
                <div style={{ color: '#333', fontSize: '11px', marginTop: '2px', fontFamily: 'monospace' }}>
                  ID: {template.id.slice(0, 8)}...
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); onLoad(template); }}
                  style={{
                    ...ghostBtn,
                    background: '#6c63ff',
                    borderColor: '#6c63ff',
                    color: '#fff',
                    fontWeight: 600,
                  }}
                >
                  ↓ Load
                </button>
                <button
                  onClick={(e) => handleDelete(template.id, e)}
                  disabled={deleting === template.id}
                  style={{
                    ...ghostBtn,
                    borderColor: '#ff6b6b33',
                    color: '#ff6b6b',
                    opacity: deleting === template.id ? 0.5 : 1,
                  }}
                >
                  {deleting === template.id ? '...' : '✕'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const ghostBtn: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid #2d2d42',
  borderRadius: '6px',
  padding: '6px 12px',
  color: '#aaa',
  fontSize: '12px',
  cursor: 'pointer',
  fontWeight: 500,
  whiteSpace: 'nowrap',
};