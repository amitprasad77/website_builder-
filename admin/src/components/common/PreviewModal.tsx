// src/components/common/PreviewModal.tsx
import { useBuilderStore } from '../../store/builderStore';
import NodeRenderer from './NodeRenderer';

interface Props {
  onClose: () => void;
}

export default function PreviewModal({ onClose }: Props) {
  const { page } = useBuilderStore();

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Preview Toolbar */}
      <div style={{
        height: '48px',
        background: '#0a0a16',
        borderBottom: '1px solid #2d2d42',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: '12px',
        flexShrink: 0,
      }}>
        <span style={{ color: '#aaa', fontSize: '13px' }}>
          👁 Preview Mode
        </span>
        <div style={{ flex: 1 }} />
        <button
          onClick={onClose}
          style={{
            background: '#6c63ff',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 16px',
            color: '#ffffff',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          ✕ Close Preview
        </button>
      </div>

      {/* Preview Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          background: '#ffffff',
          minHeight: '500px',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        }}>
          {page.children?.length === 0 ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '400px',
              color: '#aaa',
              fontSize: '14px',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <span style={{ fontSize: '32px' }}>📄</span>
              <span>No components added yet</span>
            </div>
          ) : (
            page.children?.map((child) => (
              <NodeRenderer key={child.id} node={child} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}