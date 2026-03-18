// // src/components/common/Toolbar.tsx
// import { useState } from 'react';
// import { useBuilderStore } from '../../store/builderStore';

// interface Props {
//   templateName: string;
//   setTemplateName: (name: string) => void;
//   onSave: () => void;
//   onPreview: () => void;
//   onExport: () => void;
//   saving: boolean;
//   isSaved: boolean;
// }

// export default function Toolbar({
//   templateName,
//   setTemplateName,
//   onSave,
//   onPreview,
//   onExport,
//   saving,
//   isSaved,
// }: Props) {
//   const { clearPage } = useBuilderStore();
//   const [confirmClear, setConfirmClear] = useState(false);

//   const handleClear = () => {
//     if (confirmClear) {
//       clearPage();
//       setConfirmClear(false);
//     } else {
//       setConfirmClear(true);
//       setTimeout(() => setConfirmClear(false), 3000);
//     }
//   };

//   return (
//     <div style={{
//       height: '52px',
//       background: '#0a0a16',
//       borderBottom: '1px solid #2d2d42',
//       display: 'flex',
//       alignItems: 'center',
//       padding: '0 16px',
//       gap: '10px',
//       flexShrink: 0,
//     }}>

//       {/* Logo */}
//       <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px' }}>
//         <div style={{
//           width: '28px',
//           height: '28px',
//           borderRadius: '8px',
//           background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           color: '#ffffff',
//           fontWeight: 800,
//           fontSize: '14px',
//         }}>
//           W
//         </div>
//         <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '14px' }}>
//           WebBuilder
//         </span>
//       </div>

//       <div style={{ width: '1px', height: '24px', background: '#2d2d42' }} />

//       {/* Template Name */}
//       <input
//         value={templateName}
//         onChange={(e) => setTemplateName(e.target.value)}
//         placeholder="Template name..."
//         style={{
//           background: '#1e1e2e',
//           border: '1px solid #2d2d42',
//           borderRadius: '6px',
//           padding: '6px 12px',
//           color: '#dddddd',
//           fontSize: '13px',
//           outline: 'none',
//           width: '200px',
//         }}
//       />

//       <div style={{ flex: 1 }} />

//       {/* Actions */}
//       <button
//         onClick={handleClear}
//         style={{
//           ...ghostBtn,
//           borderColor: confirmClear ? '#ef4444' : '#2d2d42',
//           color: confirmClear ? '#ef4444' : '#aaaaaa',
//         }}
//       >
//         {confirmClear ? '⚠ Confirm Clear?' : '↺ Clear'}
//       </button>

//       <button onClick={onExport} style={ghostBtn}>
//         ↓ Export JSON
//       </button>

//       <button onClick={onPreview} style={ghostBtn}>
//         👁 Preview
//       </button>

//       <button
//         onClick={onSave}
//         disabled={saving}
//         style={{
//           ...ghostBtn,
//           background: isSaved ? '#16a34a22' : '#6c63ff',
//           borderColor: isSaved ? '#16a34a' : '#6c63ff',
//           color: '#ffffff',
//           fontWeight: 600,
//           opacity: saving ? 0.7 : 1,
//           cursor: saving ? 'not-allowed' : 'pointer',
//         }}
//       >
//         {saving ? '⏳ Saving...' : isSaved ? '✓ Saved' : '↑ Save Template'}
//       </button>

//     </div>
//   );
// }

// const ghostBtn: React.CSSProperties = {
//   background: 'transparent',
//   border: '1px solid #2d2d42',
//   borderRadius: '6px',
//   padding: '6px 14px',
//   color: '#aaaaaa',
//   fontSize: '12px',
//   cursor: 'pointer',
//   fontWeight: 500,
//   whiteSpace: 'nowrap',
// };

// src/components/common/Toolbar.tsx
import { useState } from 'react';
import { useBuilderStore } from '../../store/builderStore';

interface Props {
  templateName: string;
  setTemplateName: (name: string) => void;
  onSave: () => void;
  onPreview: () => void;
  onExport: () => void;
  onOpenTemplates: () => void;
  saving: boolean;
  isSaved: boolean;
}

export default function Toolbar({
  templateName, setTemplateName,
  onSave, onPreview, onExport, onOpenTemplates,
  saving, isSaved,
}: Props) {
  const { clearPage } = useBuilderStore();
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClear = () => {
    if (confirmClear) {
      clearPage();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  return (
    <div style={{
      height: '52px', background: '#0a0a16',
      borderBottom: '1px solid #2d2d42',
      display: 'flex', alignItems: 'center',
      padding: '0 16px', gap: '10px', flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px' }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '8px',
          background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 800, fontSize: '14px',
        }}>W</div>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>WebBuilder</span>
      </div>

      <div style={{ width: '1px', height: '24px', background: '#2d2d42' }} />

      {/* Template Name */}
      <input
        value={templateName}
        onChange={(e) => setTemplateName(e.target.value)}
        placeholder="Template name..."
        style={{
          background: '#1e1e2e', border: '1px solid #2d2d42',
          borderRadius: '6px', padding: '6px 12px',
          color: '#ddd', fontSize: '13px', outline: 'none', width: '200px',
        }}
      />

      <div style={{ flex: 1 }} />

      {/* Actions */}
      <button
        onClick={handleClear}
        style={{
          ...ghostBtn,
          borderColor: confirmClear ? '#ef4444' : '#2d2d42',
          color: confirmClear ? '#ef4444' : '#aaa',
        }}
      >
        {confirmClear ? '⚠ Confirm?' : '↺ Clear'}
      </button>

      <button onClick={onExport} style={ghostBtn}>↓ Export</button>

      <button onClick={onPreview} style={ghostBtn}>👁 Preview</button>

      {/* Templates button */}
      <button
        onClick={onOpenTemplates}
        style={{ ...ghostBtn, borderColor: '#6c63ff44', color: '#a78bfa' }}
      >
        📄 Templates
      </button>

      {/* Save button */}
      <button
        onClick={onSave}
        disabled={saving}
        style={{
          ...ghostBtn,
          background: isSaved ? '#16a34a22' : '#6c63ff',
          borderColor: isSaved ? '#16a34a' : '#6c63ff',
          color: '#fff', fontWeight: 600,
          opacity: saving ? 0.7 : 1,
          cursor: saving ? 'not-allowed' : 'pointer',
        }}
      >
        {saving ? '⏳ Saving...' : isSaved ? '✓ Saved' : '↑ Save'}
      </button>
    </div>
  );
}

const ghostBtn: React.CSSProperties = {
  background: 'transparent', border: '1px solid #2d2d42',
  borderRadius: '6px', padding: '6px 14px',
  color: '#aaa', fontSize: '12px', cursor: 'pointer',
  fontWeight: 500, whiteSpace: 'nowrap',
};