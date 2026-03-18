// // src/components/layout/PropertiesPanel.tsx
// import { useBuilderStore } from '../../store/builderStore';
// import type{ LayoutNode, ComponentProps } from '../../types/builder';

// // ─── Find node helper ─────────────────────────────────────────────────────────
// function findNode(node: LayoutNode, id: string): LayoutNode | null {
//   if (node.id === id) return node;
//   if (!node.children) return null;
//   for (const child of node.children) {
//     const found = findNode(child, id);
//     if (found) return found;
//   }
//   return null;
// }

// // ─── Field types ──────────────────────────────────────────────────────────────
// interface Field {
//   key: string;
//   label: string;
//   type: 'text' | 'textarea' | 'color' | 'select' | 'number';
//   placeholder?: string;
//   min?: number;
//   max?: number;
//   options?: { value: string; label: string }[];
// }

// // ─── Fields per component type ────────────────────────────────────────────────
// function getFields(type: string): Field[] {
//   switch (type) {
//     case 'heading':
//       return [
//         { key: 'text', label: 'Text', type: 'textarea' },
//         { key: 'fontSize', label: 'Font Size', type: 'text', placeholder: '2rem' },
//         {
//           key: 'alignment', label: 'Alignment', type: 'select',
//           options: [
//             { value: 'left', label: 'Left' },
//             { value: 'center', label: 'Center' },
//             { value: 'right', label: 'Right' },
//           ],
//         },
//         { key: 'color', label: 'Color', type: 'color' },
//       ];

//     case 'text':
//       return [
//         { key: 'text', label: 'Content', type: 'textarea' },
//         { key: 'fontSize', label: 'Font Size', type: 'text', placeholder: '1rem' },
//         { key: 'color', label: 'Color', type: 'color' },
//       ];

//     case 'button':
//       return [
//         { key: 'label', label: 'Button Text', type: 'text' },
//         { key: 'href', label: 'Link URL', type: 'text', placeholder: '#' },
//         {
//           key: 'variant', label: 'Variant', type: 'select',
//           options: [
//             { value: 'primary', label: 'Primary' },
//             { value: 'secondary', label: 'Secondary (outline)' },
//           ],
//         },
//       ];

//     case 'image':
//       return [
//         { key: 'src', label: 'Image URL', type: 'text' },
//         { key: 'alt', label: 'Alt Text', type: 'text' },
//         { key: 'width', label: 'Width', type: 'text', placeholder: '100%' },
//       ];

//     case 'video':
//       return [
//         { key: 'src', label: 'Video URL', type: 'text' },
//         { key: 'width', label: 'Width', type: 'text', placeholder: '100%' },
//       ];

//     case 'navbar':
//       return [
//         { key: 'logo', label: 'Logo Text', type: 'text', placeholder: '{{course.title}}' },
//         { key: 'bgColor', label: 'Background', type: 'color' },
//       ];

//     case 'hero':
//       return [
//         { key: 'title', label: 'Title', type: 'text', placeholder: '{{course.title}}' },
//         { key: 'subtitle', label: 'Subtitle', type: 'textarea', placeholder: '{{course.description}}' },
//         { key: 'buttonText', label: 'Button Text', type: 'text' },
//         { key: 'buttonHref', label: 'Button Link', type: 'text', placeholder: '#' },
//         { key: 'bgColor', label: 'Background Color', type: 'color' },
//         { key: 'bgImage', label: 'Background Image URL', type: 'text' },
//       ];

//     case 'footer':
//       return [
//         { key: 'text', label: 'Footer Text', type: 'text', placeholder: '© 2025 {{course.title}}' },
//         { key: 'bgColor', label: 'Background', type: 'color' },
//         { key: 'color', label: 'Text Color', type: 'color' },
//       ];

//     case 'section':
//       return [
//         { key: 'padding', label: 'Padding', type: 'text', placeholder: '60px 40px' },
//         { key: 'bgColor', label: 'Background', type: 'color' },
//       ];

//     case 'container':
//       return [
//         { key: 'maxWidth', label: 'Max Width', type: 'text', placeholder: '1200px' },
//         { key: 'padding', label: 'Padding', type: 'text', placeholder: '0 20px' },
//       ];

//     case 'grid':
//       return [
//         { key: 'columns', label: 'Columns', type: 'number', min: 1, max: 6 },
//         { key: 'gap', label: 'Gap', type: 'text', placeholder: '24px' },
//       ];

//     case 'columns':
//       return [
//         { key: 'count', label: 'Column Count', type: 'number', min: 1, max: 6 },
//         { key: 'gap', label: 'Gap', type: 'text', placeholder: '24px' },
//       ];

//     default:
//       return [];
//   }
// }

// // ─── Single Field Row ─────────────────────────────────────────────────────────
// interface FieldRowProps {
//   field: Field;
//   value: unknown;
//   onChange: (val: unknown) => void;
// }

// function FieldRow({ field, value, onChange }: FieldRowProps) {
//   const strVal = value !== undefined && value !== null ? String(value) : '';

//   const inputStyle: React.CSSProperties = {
//     width: '100%',
//     padding: '8px 10px',
//     background: '#1e1e2e',
//     border: '1px solid #2d2d42',
//     borderRadius: '6px',
//     color: '#dddddd',
//     fontSize: '13px',
//     outline: 'none',
//     boxSizing: 'border-box',
//   };

//   const label = (
//     <label style={{
//       display: 'block',
//       color: '#888888',
//       fontSize: '11px',
//       fontWeight: 600,
//       letterSpacing: '0.05em',
//       marginBottom: '5px',
//       textTransform: 'uppercase',
//     }}>
//       {field.label}
//     </label>
//   );

//   if (field.type === 'textarea') {
//     return (
//       <div style={{ marginBottom: '14px' }}>
//         {label}
//         <textarea
//           value={strVal}
//           onChange={(e) => onChange(e.target.value)}
//           rows={3}
//           placeholder={field.placeholder}
//           style={{ ...inputStyle, resize: 'vertical' }}
//         />
//         {field.placeholder?.includes('{{') && (
//           <p style={{ fontSize: '10px', color: '#6c63ff', marginTop: '4px' }}>
//             💡 Supports {'{{course.title}}'} variables
//           </p>
//         )}
//       </div>
//     );
//   }

//   if (field.type === 'color') {
//     return (
//       <div style={{ marginBottom: '14px' }}>
//         {label}
//         <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
//           <input
//             type="color"
//             value={strVal || '#000000'}
//             onChange={(e) => onChange(e.target.value)}
//             style={{
//               width: '36px', height: '36px',
//               border: 'none', borderRadius: '6px',
//               cursor: 'pointer', padding: 0,
//             }}
//           />
//           <input
//             type="text"
//             value={strVal}
//             onChange={(e) => onChange(e.target.value)}
//             style={{ ...inputStyle, flex: 1 }}
//             placeholder="#000000"
//           />
//         </div>
//       </div>
//     );
//   }

//   if (field.type === 'select') {
//     return (
//       <div style={{ marginBottom: '14px' }}>
//         {label}
//         <select
//           value={strVal}
//           onChange={(e) => onChange(e.target.value)}
//           style={{ ...inputStyle }}
//         >
//           {field.options?.map((o) => (
//             <option key={o.value} value={o.value}>{o.label}</option>
//           ))}
//         </select>
//       </div>
//     );
//   }

//   if (field.type === 'number') {
//     return (
//       <div style={{ marginBottom: '14px' }}>
//         {label}
//         <input
//           type="number"
//           value={strVal}
//           onChange={(e) => onChange(Number(e.target.value))}
//           min={field.min}
//           max={field.max}
//           style={inputStyle}
//         />
//       </div>
//     );
//   }

//   // Default: text
//   return (
//     <div style={{ marginBottom: '14px' }}>
//       {label}
//       <input
//         type="text"
//         value={strVal}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={field.placeholder}
//         style={inputStyle}
//       />
//       {field.placeholder?.includes('{{') && (
//         <p style={{ fontSize: '10px', color: '#6c63ff', marginTop: '4px' }}>
//           💡 Supports {'{{course.title}}'} variables
//         </p>
//       )}
//     </div>
//   );
// }

// // ─── Properties Panel ─────────────────────────────────────────────────────────
// export default function PropertiesPanel() {
//   const { page, selectedId, updateProps } = useBuilderStore();
//   const node = selectedId ? findNode(page, selectedId) : null;

//   if (!node || node.type === 'page') {
//     return (
//       <div style={panelStyle}>
//         <div style={headerStyle}>
//           <span>Properties</span>
//         </div>
//         <div style={{
//           padding: '24px 16px',
//           color: '#555555',
//           fontSize: '13px',
//           textAlign: 'center',
//           lineHeight: 1.6,
//         }}>
//           <div style={{ fontSize: '24px', marginBottom: '8px' }}>←</div>
//           Select a component to edit its properties
//         </div>
//       </div>
//     );
//   }

//   const fields = getFields(node.type);
//   const props = node.props as Record<string, unknown>;

//   return (
//     <div style={panelStyle}>
//       <div style={headerStyle}>
//         <span style={{ color: '#6c63ff', marginRight: '6px' }}>◆</span>
//         <span style={{ textTransform: 'capitalize' }}>{node.type}</span>
//       </div>

//       <div style={{ padding: '12px', overflowY: 'auto', flex: 1 }}>
//         {fields.length === 0 ? (
//           <p style={{ color: '#555', fontSize: '13px' }}>
//             No editable properties for this component.
//           </p>
//         ) : (
//           fields.map((field) => (
//             <FieldRow
//               key={field.key}
//               field={field}
//               value={props[field.key]}
//               onChange={(val) => updateProps(node.id, { [field.key]: val } as Partial<ComponentProps>)}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// // ─── Styles ───────────────────────────────────────────────────────────────────
// const panelStyle: React.CSSProperties = {
//   width: '260px',
//   minWidth: '260px',
//   background: '#13131f',
//   borderLeft: '1px solid #2d2d42',
//   display: 'flex',
//   flexDirection: 'column',
//   height: '100%',
// };

// const headerStyle: React.CSSProperties = {
//   padding: '16px 12px',
//   borderBottom: '1px solid #2d2d42',
//   color: '#aaaaaa',
//   fontSize: '12px',
//   fontWeight: 700,
//   letterSpacing: '0.08em',
//   textTransform: 'uppercase',
//   display: 'flex',
//   alignItems: 'center',
// };


// src/components/layout/PropertiesPanel.tsx
import { useBuilderStore } from '../../store/builderStore';
import type { LayoutNode, ComponentProps } from '../../types/builder';

function findNode(node: LayoutNode, id: string): LayoutNode | null {
  if (node.id === id) return node;
  if (!node.children) return null;
  for (const child of node.children) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}

interface Field {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'color' | 'select' | 'number';
  placeholder?: string;
  min?: number;
  max?: number;
  options?: { value: string; label: string }[];
}

function getFields(type: string): Field[] {
  const alignOptions = [
    { value: 'left', label: '← Left' },
    { value: 'center', label: '↔ Center' },
    { value: 'right', label: '→ Right' },
  ];

  switch (type) {
    case 'heading':
      return [
        { key: 'text', label: 'Text', type: 'textarea' },
        { key: 'fontSize', label: 'Font Size', type: 'text', placeholder: '2rem' },
        { key: 'alignment', label: 'Alignment', type: 'select', options: alignOptions },
        { key: 'color', label: 'Color', type: 'color' },
      ];

    case 'text':
      return [
        { key: 'text', label: 'Content', type: 'textarea' },
        { key: 'fontSize', label: 'Font Size', type: 'text', placeholder: '1rem' },
        { key: 'alignment', label: 'Alignment', type: 'select', options: alignOptions },
        { key: 'color', label: 'Color', type: 'color' },
      ];

    case 'button':
      return [
        { key: 'label', label: 'Button Text', type: 'text' },
        { key: 'href', label: 'Link URL', type: 'text', placeholder: '#' },
        { key: 'variant', label: 'Variant', type: 'select', options: [{ value: 'primary', label: 'Primary (filled)' }, { value: 'outline', label: 'Outline' }] },
        { key: 'alignment', label: 'Alignment', type: 'select', options: alignOptions },
        { key: 'bgColor', label: 'Button Color', type: 'color' },
        { key: 'color', label: 'Text Color', type: 'color' },
        { key: 'fontSize', label: 'Font Size', type: 'text', placeholder: '14px' },
        { key: 'borderRadius', label: 'Border Radius', type: 'text', placeholder: '8px' },
        { key: 'padding', label: 'Padding', type: 'text', placeholder: '12px 28px' },
      ];

    case 'image':
      return [
        { key: 'src', label: 'Image URL', type: 'text' },
        { key: 'alt', label: 'Alt Text', type: 'text' },
        { key: 'width', label: 'Width', type: 'text', placeholder: '100%' },
        { key: 'alignment', label: 'Alignment', type: 'select', options: alignOptions },
        { key: 'borderRadius', label: 'Border Radius', type: 'text', placeholder: '0px' },
      ];

    case 'video':
      return [
        { key: 'src', label: 'Video URL', type: 'text' },
        { key: 'width', label: 'Width', type: 'text', placeholder: '100%' },
      ];

    case 'divider':
      return [
        { key: 'color', label: 'Color', type: 'color' },
        { key: 'thickness', label: 'Thickness', type: 'text', placeholder: '1px' },
        { key: 'margin', label: 'Margin', type: 'text', placeholder: '16px 0' },
      ];

    case 'spacer':
      return [
        { key: 'height', label: 'Height', type: 'text', placeholder: '40px' },
      ];

    case 'badge':
      return [
        { key: 'text', label: 'Text', type: 'text' },
        { key: 'bgColor', label: 'Background', type: 'color' },
        { key: 'color', label: 'Text Color', type: 'color' },
        { key: 'borderRadius', label: 'Border Radius', type: 'text', placeholder: '20px' },
      ];

    case 'testimonial':
      return [
        { key: 'quote', label: 'Quote', type: 'textarea' },
        { key: 'author', label: 'Author Name', type: 'text' },
        { key: 'role', label: 'Role / Company', type: 'text' },
        { key: 'avatar', label: 'Avatar URL', type: 'text' },
        { key: 'bgColor', label: 'Background', type: 'color' },
      ];

    case 'pricing':
      return [
        { key: 'title', label: 'Plan Name', type: 'text' },
        { key: 'price', label: 'Price', type: 'text', placeholder: '$49' },
        { key: 'period', label: 'Period', type: 'text', placeholder: '/month' },
        { key: 'buttonText', label: 'Button Text', type: 'text' },
        { key: 'highlighted', label: 'Style', type: 'select', options: [{ value: 'false', label: 'Normal' }, { value: 'true', label: 'Highlighted (purple)' }] },
      ];

    case 'faq':
      return [
        { key: 'question', label: 'Question', type: 'text' },
        { key: 'answer', label: 'Answer', type: 'textarea' },
      ];

    case 'progress':
      return [
        { key: 'label', label: 'Label', type: 'text' },
        { key: 'value', label: 'Value (0-100)', type: 'number', min: 0, max: 100 },
        { key: 'color', label: 'Bar Color', type: 'color' },
        { key: 'bgColor', label: 'Track Color', type: 'color' },
      ];

    case 'icontext':
      return [
        { key: 'icon', label: 'Icon (emoji)', type: 'text', placeholder: '⚡' },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'text', label: 'Description', type: 'textarea' },
      ];

    case 'codeblock':
      return [
        { key: 'language', label: 'Language', type: 'text', placeholder: 'javascript' },
        { key: 'code', label: 'Code', type: 'textarea' },
      ];

    case 'navbar':
      return [
        { key: 'logo', label: 'Logo Text', type: 'text', placeholder: '{{course.title}}' },
        { key: 'bgColor', label: 'Background', type: 'color' },
      ];

    case 'hero':
      return [
        { key: 'title', label: 'Title', type: 'text', placeholder: '{{course.title}}' },
        { key: 'subtitle', label: 'Subtitle', type: 'textarea', placeholder: '{{course.description}}' },
        { key: 'buttonText', label: 'Button Text', type: 'text' },
        { key: 'buttonHref', label: 'Button Link', type: 'text', placeholder: '#' },
        { key: 'bgColor', label: 'Background Color', type: 'color' },
        { key: 'bgImage', label: 'Background Image URL', type: 'text' },
      ];

    case 'footer':
      return [
        { key: 'text', label: 'Footer Text', type: 'text', placeholder: '© 2025 {{course.title}}' },
        { key: 'bgColor', label: 'Background', type: 'color' },
        { key: 'color', label: 'Text Color', type: 'color' },
        { key: 'alignment', label: 'Alignment', type: 'select', options: alignOptions },
      ];

    case 'section':
      return [
        { key: 'padding', label: 'Padding', type: 'text', placeholder: '60px 40px' },
        { key: 'bgColor', label: 'Background', type: 'color' },
        { key: 'textAlign', label: 'Content Align', type: 'select', options: alignOptions },
      ];

    case 'container':
      return [
        { key: 'maxWidth', label: 'Max Width', type: 'text', placeholder: '1200px' },
        { key: 'padding', label: 'Padding', type: 'text', placeholder: '0 20px' },
      ];

    case 'grid':
      return [
        { key: 'columns', label: 'Columns', type: 'number', min: 1, max: 6 },
        { key: 'gap', label: 'Gap', type: 'text', placeholder: '24px' },
      ];

    case 'columns':
      return [
        { key: 'gap', label: 'Gap', type: 'text', placeholder: '24px' },
      ];

    default:
      return [];
  }
}

interface FieldRowProps {
  field: Field;
  value: unknown;
  onChange: (val: unknown) => void;
}

function FieldRow({ field, value, onChange }: FieldRowProps) {
  const strVal = value !== undefined && value !== null ? String(value) : '';

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 10px',
    background: '#1e1e2e', border: '1px solid #2d2d42',
    borderRadius: '6px', color: '#dddddd',
    fontSize: '13px', outline: 'none', boxSizing: 'border-box',
  };

  const label = (
    <label style={{ display: 'block', color: '#888', fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '5px', textTransform: 'uppercase' }}>
      {field.label}
    </label>
  );

  if (field.type === 'textarea') return (
    <div style={{ marginBottom: '14px' }}>
      {label}
      <textarea value={strVal} onChange={e => onChange(e.target.value)} rows={3} placeholder={field.placeholder} style={{ ...inputStyle, resize: 'vertical' }} />
      {field.placeholder?.includes('{{') && <p style={{ fontSize: '10px', color: '#6c63ff', marginTop: '4px' }}>💡 Supports {'{{course.title}}'} variables</p>}
    </div>
  );

  if (field.type === 'color') return (
    <div style={{ marginBottom: '14px' }}>
      {label}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input type="color" value={strVal || '#000000'} onChange={e => onChange(e.target.value)} style={{ width: '36px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: 0 }} />
        <input type="text" value={strVal} onChange={e => onChange(e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder="#000000" />
      </div>
    </div>
  );

  if (field.type === 'select') return (
    <div style={{ marginBottom: '14px' }}>
      {label}
      <select value={strVal} onChange={e => onChange(e.target.value)} style={inputStyle}>
        {field.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  if (field.type === 'number') return (
    <div style={{ marginBottom: '14px' }}>
      {label}
      <input type="number" value={strVal} onChange={e => onChange(Number(e.target.value))} min={field.min} max={field.max} style={inputStyle} />
    </div>
  );

  return (
    <div style={{ marginBottom: '14px' }}>
      {label}
      <input type="text" value={strVal} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} style={inputStyle} />
      {field.placeholder?.includes('{{') && <p style={{ fontSize: '10px', color: '#6c63ff', marginTop: '4px' }}>💡 Supports {'{{course.title}}'} variables</p>}
    </div>
  );
}

export default function PropertiesPanel() {
  const { page, selectedId, updateProps } = useBuilderStore();
  const node = selectedId ? findNode(page, selectedId) : null;

  if (!node || node.type === 'page') {
    return (
      <div style={panelStyle}>
        <div style={headerStyle}><span>Properties</span></div>
        <div style={{ padding: '24px 16px', color: '#555', fontSize: '13px', textAlign: 'center', lineHeight: 1.6 }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>←</div>
          Select a component to edit its properties
        </div>
      </div>
    );
  }

  const fields = getFields(node.type);
  const props = node.props as Record<string, unknown>;

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <span style={{ color: '#6c63ff', marginRight: '6px' }}>◆</span>
        <span style={{ textTransform: 'capitalize' }}>{node.type}</span>
      </div>
      <div style={{ padding: '12px', overflowY: 'auto', flex: 1 }}>
        {fields.length === 0 ? (
          <p style={{ color: '#555', fontSize: '13px' }}>No editable properties.</p>
        ) : (
          fields.map(field => (
            <FieldRow
              key={field.key}
              field={field}
              value={props[field.key]}
              onChange={val => updateProps(node.id, { [field.key]: val } as Partial<ComponentProps>)}
            />
          ))
        )}
      </div>
    </div>
  );
}

const panelStyle: React.CSSProperties = {
  width: '260px', minWidth: '260px', background: '#13131f',
  borderLeft: '1px solid #2d2d42', display: 'flex',
  flexDirection: 'column', height: '100%',
};

const headerStyle: React.CSSProperties = {
  padding: '16px 12px', borderBottom: '1px solid #2d2d42',
  color: '#aaa', fontSize: '12px', fontWeight: 700,
  letterSpacing: '0.08em', textTransform: 'uppercase',
  display: 'flex', alignItems: 'center',
};