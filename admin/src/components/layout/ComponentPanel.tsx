// // src/components/layout/ComponentPanel.tsx
// import { useEffect } from 'react';
// import type { PanelGroup, PanelItem, ComponentType } from '../../types/builder';
// import { useBuilderStore, isContainer } from '../../store/builderStore';
// import { dragState } from '../../store/dragState';

// const COMPONENT_GROUPS: PanelGroup[] = [
//   {
//     label: 'Layout',
//     items: [
//       { type: 'section', label: 'Section', icon: '▭' },
//       { type: 'container', label: 'Container', icon: '⬜' },
//       { type: 'grid', label: 'Grid', icon: '⊞' },
//       { type: 'columns', label: 'Columns', icon: '⫿' },
//     ],
//   },
//   {
//     label: 'Content',
//     items: [
//       { type: 'heading', label: 'Heading', icon: 'H' },
//       { type: 'text', label: 'Text', icon: 'T' },
//       { type: 'image', label: 'Image', icon: '🖼' },
//       { type: 'button', label: 'Button', icon: '⬡' },
//       { type: 'video', label: 'Video', icon: '▶' },
//     ],
//   },
//   {
//     label: 'Website',
//     items: [
//       { type: 'navbar', label: 'Navbar', icon: '≡' },
//       { type: 'hero', label: 'Hero', icon: '★' },
//       { type: 'footer', label: 'Footer', icon: '▬' },
//     ],
//   },
// ];

// // Global mouse move/up handlers
// let mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
// let mouseUpHandler: ((e: MouseEvent) => void) | null = null;

// function cleanupMouseHandlers() {
//   if (mouseMoveHandler) {
//     document.removeEventListener('mousemove', mouseMoveHandler);
//     mouseMoveHandler = null;
//   }
//   if (mouseUpHandler) {
//     document.removeEventListener('mouseup', mouseUpHandler);
//     mouseUpHandler = null;
//   }
// }

// function PaletteItem({ type, label, icon }: PanelItem) {
//   const { addComponent, selectedId, page } = useBuilderStore();

//   const getTargetId = () => {
//     if (!selectedId) return 'page-root';
//     const findNode = (n: any, id: string): any => {
//       if (n.id === id) return n;
//       for (const c of n.children || []) { const f = findNode(c, id); if (f) return f; }
//       return null;
//     };
//     const findParent = (n: any, id: string): any => {
//       for (const c of n.children || []) {
//         if (c.id === id) return n;
//         const f = findParent(c, id);
//         if (f) return f;
//       }
//       return null;
//     };
//     const sel = findNode(page, selectedId);
//     if (sel && isContainer(sel.type)) return selectedId;
//     const parent = findParent(page, selectedId);
//     return parent ? parent.id : 'page-root';
//   };

//   const handleMouseDown = (e: React.MouseEvent) => {
//     // Only left click
//     if (e.button !== 0) return;
//     e.preventDefault();

//     let isDragging = false;
//     const startX = e.clientX;
//     const startY = e.clientY;

//     cleanupMouseHandlers();

//     mouseMoveHandler = (moveEvent: MouseEvent) => {
//       const dx = Math.abs(moveEvent.clientX - startX);
//       const dy = Math.abs(moveEvent.clientY - startY);

//       // Start drag after moving 5px
//       if (!isDragging && (dx > 5 || dy > 5)) {
//         isDragging = true;
//         dragState.startPaletteDrag(type, label);
//       }

//       if (isDragging) {
//         dragState.moveGhost(moveEvent.clientX, moveEvent.clientY);

//         // Highlight drop target under cursor
//         const el = document.elementFromPoint(moveEvent.clientX, moveEvent.clientY);
//         const dropTarget = el?.closest('[data-droppable]') as HTMLElement | null;

//         // Clear previous highlights
//         document.querySelectorAll('[data-droppable]').forEach(el => {
//           (el as HTMLElement).style.outline = '';
//           (el as HTMLElement).style.background = '';
//         });

//         // Highlight current target
//         if (dropTarget) {
//           dropTarget.style.outline = '2px dashed #6c63ff';
//           dropTarget.style.background = '#6c63ff08';
//         }
//       }
//     };

//     mouseUpHandler = (upEvent: MouseEvent) => {
//       cleanupMouseHandlers();

//       // Clear highlights
//       document.querySelectorAll('[data-droppable]').forEach(el => {
//         (el as HTMLElement).style.outline = '';
//         (el as HTMLElement).style.background = '';
//       });

//       if (isDragging && dragState.active) {
//         // Find drop target under cursor
//         const el = document.elementFromPoint(upEvent.clientX, upEvent.clientY);
//         const dropTarget = el?.closest('[data-droppable]') as HTMLElement | null;
//         const targetNodeId = dropTarget?.getAttribute('data-node-id');

//         if (targetNodeId) {
//           addComponent(type as ComponentType, targetNodeId);
//         } else {
//           // Dropped on canvas but not on a specific node
//           addComponent(type as ComponentType, 'page-root');
//         }
//         dragState.clear();
//       } else if (!isDragging) {
//         // It was a click — add to selected or root
//         addComponent(type as ComponentType, getTargetId());
//       }
//     };

//     document.addEventListener('mousemove', mouseMoveHandler);
//     document.addEventListener('mouseup', mouseUpHandler);
//   };

//   return (
//     <div
//       onMouseDown={handleMouseDown}
//       style={{
//         display: 'flex', alignItems: 'center', gap: '10px',
//         padding: '9px 12px', borderRadius: '8px',
//         background: '#1e1e2e', border: '1px solid #2d2d42',
//         marginBottom: '6px', cursor: 'grab', userSelect: 'none',
//         transition: 'all 0.15s',
//       }}
//       onMouseEnter={e => {
//         (e.currentTarget as HTMLElement).style.background = '#252538';
//         (e.currentTarget as HTMLElement).style.borderColor = '#6c63ff';
//       }}
//       onMouseLeave={e => {
//         (e.currentTarget as HTMLElement).style.background = '#1e1e2e';
//         (e.currentTarget as HTMLElement).style.borderColor = '#2d2d42';
//       }}
//     >
//       <span style={{ width: 24, textAlign: 'center', fontSize: 14, color: '#6c63ff' }}>{icon}</span>
//       <span style={{ fontSize: 13, color: '#ccc', fontWeight: 500 }}>{label}</span>
//       <span style={{ marginLeft: 'auto', fontSize: 11, color: '#444' }}>+</span>
//     </div>
//   );
// }

// export default function ComponentPanel() {
//   const { selectedId } = useBuilderStore();

//   // Cleanup on unmount
//   useEffect(() => () => cleanupMouseHandlers(), []);

//   return (
//     <div style={{
//       width: '220px', minWidth: '220px', background: '#13131f',
//       borderRight: '1px solid #2d2d42', display: 'flex',
//       flexDirection: 'column', overflowY: 'auto', height: '100%', userSelect: 'none',
//     }}>
//       <div style={{ padding: '16px 12px 8px', borderBottom: '1px solid #2d2d42' }}>
//         <p style={{ color: '#888', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
//           Components
//         </p>
//         <p style={{ color: '#555', fontSize: 10, marginTop: 4, marginBottom: 0 }}>
//           {selectedId ? '→ adds to selected' : 'click or drag to canvas'}
//         </p>
//       </div>
//       <div style={{
//         margin: '8px 10px 0', padding: '8px 10px',
//         background: '#1a1a2e', border: '1px solid #2d2d42',
//         borderRadius: '6px', fontSize: 10, color: '#6c63ff', lineHeight: 1.6,
//       }}>
//         💡 <strong>Side by side:</strong> Add <strong>Columns</strong> first, then drop inside.
//       </div>
//       <div style={{ padding: '12px', flex: 1 }}>
//         {COMPONENT_GROUPS.map(group => (
//           <div key={group.label} style={{ marginBottom: '20px' }}>
//             <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>
//               {group.label}
//             </p>
//             {group.items.map(item => <PaletteItem key={item.type} {...item} />)}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// src/components/layout/ComponentPanel.tsx
import { useEffect } from 'react';
import type { PanelGroup, PanelItem, ComponentType } from '../../types/builder';
import { useBuilderStore, isContainer } from '../../store/builderStore';
import { dragState } from '../../store/dragState';

const COMPONENT_GROUPS: PanelGroup[] = [
  {
    label: 'Layout',
    items: [
      { type: 'section', label: 'Section', icon: '▭' },
      { type: 'container', label: 'Container', icon: '⬜' },
      { type: 'grid', label: 'Grid', icon: '⊞' },
      { type: 'columns', label: 'Columns', icon: '⫿' },
      { type: 'spacer', label: 'Spacer', icon: '↕' },
      { type: 'divider', label: 'Divider', icon: '—' },
    ],
  },
  {
    label: 'Content',
    items: [
      { type: 'heading', label: 'Heading', icon: 'H' },
      { type: 'text', label: 'Text', icon: 'T' },
      { type: 'image', label: 'Image', icon: '🖼' },
      { type: 'button', label: 'Button', icon: '⬡' },
      { type: 'video', label: 'Video', icon: '▶' },
      { type: 'badge', label: 'Badge', icon: '⬟' },
      { type: 'codeblock', label: 'Code Block', icon: '<>' },
    ],
  },
  {
    label: 'Components',
    items: [
      { type: 'testimonial', label: 'Testimonial', icon: '💬' },
      { type: 'pricing', label: 'Pricing Card', icon: '💰' },
      { type: 'faq', label: 'FAQ', icon: '❓' },
      { type: 'progress', label: 'Progress Bar', icon: '▰' },
      { type: 'icontext', label: 'Icon + Text', icon: '⚡' },
    ],
  },
  {
    label: 'Website',
    items: [
      { type: 'navbar', label: 'Navbar', icon: '≡' },
      { type: 'hero', label: 'Hero', icon: '★' },
      { type: 'footer', label: 'Footer', icon: '▬' },
    ],
  },
];

let mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
let mouseUpHandler: ((e: MouseEvent) => void) | null = null;

function cleanupMouseHandlers() {
  if (mouseMoveHandler) { document.removeEventListener('mousemove', mouseMoveHandler); mouseMoveHandler = null; }
  if (mouseUpHandler) { document.removeEventListener('mouseup', mouseUpHandler); mouseUpHandler = null; }
}

function PaletteItem({ type, label, icon }: PanelItem) {
  const { addComponent, selectedId, page } = useBuilderStore();

  const getTargetId = () => {
    if (!selectedId) return 'page-root';
    const findNode = (n: any, id: string): any => {
      if (n.id === id) return n;
      for (const c of n.children || []) { const f = findNode(c, id); if (f) return f; }
      return null;
    };
    const findParent = (n: any, id: string): any => {
      for (const c of n.children || []) {
        if (c.id === id) return n;
        const f = findParent(c, id);
        if (f) return f;
      }
      return null;
    };
    const sel = findNode(page, selectedId);
    if (sel && isContainer(sel.type)) return selectedId;
    const parent = findParent(page, selectedId);
    return parent ? parent.id : 'page-root';
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    let isDragging = false;
    const startX = e.clientX;
    const startY = e.clientY;
    cleanupMouseHandlers();

    mouseMoveHandler = (moveEvent: MouseEvent) => {
      const dx = Math.abs(moveEvent.clientX - startX);
      const dy = Math.abs(moveEvent.clientY - startY);
      if (!isDragging && (dx > 5 || dy > 5)) {
        isDragging = true;
        dragState.startPaletteDrag(type, label);
      }
      if (isDragging) {
        dragState.moveGhost(moveEvent.clientX, moveEvent.clientY);
        if (dragState.ghost) dragState.ghost.style.display = 'none';
        const el = document.elementFromPoint(moveEvent.clientX, moveEvent.clientY);
        if (dragState.ghost) dragState.ghost.style.display = '';
        const dropTarget = el?.closest('[data-droppable]') as HTMLElement | null;
        document.querySelectorAll('[data-droppable]').forEach(el => {
          (el as HTMLElement).style.outline = '';
          (el as HTMLElement).style.background = '';
        });
        document.querySelectorAll('[data-leaf]').forEach(el => {
          (el as HTMLElement).style.borderTop = '3px solid transparent';
          (el as HTMLElement).style.borderBottom = '3px solid transparent';
        });
        if (dropTarget) {
          const isLeaf = dropTarget.hasAttribute('data-leaf');
          if (isLeaf) {
            const rect = dropTarget.getBoundingClientRect();
            if (moveEvent.clientY - rect.top < rect.height / 2) {
              dropTarget.style.borderTop = '3px solid #6c63ff';
            } else {
              dropTarget.style.borderBottom = '3px solid #6c63ff';
            }
          } else {
            dropTarget.style.outline = '2px dashed #6c63ff';
            dropTarget.style.background = '#6c63ff08';
          }
        }
      }
    };

    mouseUpHandler = (upEvent: MouseEvent) => {
      cleanupMouseHandlers();
      document.querySelectorAll('[data-droppable]').forEach(el => {
        (el as HTMLElement).style.outline = '';
        (el as HTMLElement).style.background = '';
      });
      document.querySelectorAll('[data-leaf]').forEach(el => {
        (el as HTMLElement).style.borderTop = '3px solid transparent';
        (el as HTMLElement).style.borderBottom = '3px solid transparent';
      });

      if (isDragging && dragState.active) {
        if (dragState.ghost) dragState.ghost.style.display = 'none';
        const el = document.elementFromPoint(upEvent.clientX, upEvent.clientY);
        if (dragState.ghost) dragState.ghost.style.display = '';
        const dropTarget = el?.closest('[data-droppable]') as HTMLElement | null;
        const targetNodeId = dropTarget?.getAttribute('data-node-id');
        const isLeaf = dropTarget?.hasAttribute('data-leaf');

        dragState.clear();

        if (targetNodeId) {
          if (isLeaf) {
            // Get the store and use moveComponentBeforeAfter-like logic
            // For palette items we just add to parent
            const { addComponent: add, page, moveComponentBeforeAfter } = useBuilderStore.getState();
            const findParentFn = (root: any, id: string): any => {
              for (const c of root.children || []) {
                if (c.id === id) return root;
                const f = findParentFn(c, id);
                if (f) return f;
              }
              return null;
            };
            const parent = findParentFn(page, targetNodeId);
            const parentId = parent ? parent.id : 'page-root';
            add(type as ComponentType, parentId);
          } else {
            addComponent(type as ComponentType, targetNodeId);
          }
        } else {
          addComponent(type as ComponentType, 'page-root');
        }
      } else if (!isDragging) {
        addComponent(type as ComponentType, getTargetId());
      }
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '9px 12px', borderRadius: '8px',
        background: '#1e1e2e', border: '1px solid #2d2d42',
        marginBottom: '6px', cursor: 'grab', userSelect: 'none',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = '#252538';
        (e.currentTarget as HTMLElement).style.borderColor = '#6c63ff';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = '#1e1e2e';
        (e.currentTarget as HTMLElement).style.borderColor = '#2d2d42';
      }}
    >
      <span style={{ width: 24, textAlign: 'center', fontSize: 14, color: '#6c63ff' }}>{icon}</span>
      <span style={{ fontSize: 13, color: '#ccc', fontWeight: 500 }}>{label}</span>
      <span style={{ marginLeft: 'auto', fontSize: 11, color: '#444' }}>+</span>
    </div>
  );
}

export default function ComponentPanel() {
  const { selectedId } = useBuilderStore();
  useEffect(() => () => cleanupMouseHandlers(), []);

  return (
    <div style={{
      width: '220px', minWidth: '220px', background: '#13131f',
      borderRight: '1px solid #2d2d42', display: 'flex',
      flexDirection: 'column', overflowY: 'auto', height: '100%', userSelect: 'none',
    }}>
      <div style={{ padding: '16px 12px 8px', borderBottom: '1px solid #2d2d42' }}>
        <p style={{ color: '#888', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
          Components
        </p>
        <p style={{ color: '#555', fontSize: 10, marginTop: 4, marginBottom: 0 }}>
          {selectedId ? '→ adds to selected' : 'click or drag to canvas'}
        </p>
      </div>
      <div style={{ padding: '12px', flex: 1 }}>
        {COMPONENT_GROUPS.map(group => (
          <div key={group.label} style={{ marginBottom: '20px' }}>
            <p style={{ color: '#555', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>
              {group.label}
            </p>
            {group.items.map(item => <PaletteItem key={item.type} {...item} />)}
          </div>
        ))}
      </div>
    </div>
  );
}