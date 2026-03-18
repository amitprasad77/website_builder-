// src/components/layout/CanvasNode.tsx
import { useBuilderStore, isContainer } from '../../store/builderStore';
import { dragState } from '../../store/dragState';
import NodeRenderer from '../common/NodeRenderer';
import type { LayoutNode, ComponentType, SectionProps, ContainerProps, GridProps, ColumnsProps } from '../../types/builder';

interface Props { node: LayoutNode; depth?: number; }

function isDescendant(root: LayoutNode, ancestorId: string): boolean {
  if (root.id === ancestorId) return true;
  return (root.children || []).some(c => isDescendant(c, ancestorId));
}

function findNodeById(root: LayoutNode, id: string): LayoutNode | null {
  if (root.id === id) return root;
  for (const child of root.children || []) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}

function findParentId(root: LayoutNode, childId: string): string | null {
  for (const child of root.children || []) {
    if (child.id === childId) return root.id;
    const found = findParentId(child, childId);
    if (found) return found;
  }
  return null;
}

// Global mouse handlers
let canvasMouseMove: ((e: MouseEvent) => void) | null = null;
let canvasMouseUp: ((e: MouseEvent) => void) | null = null;

function cleanupCanvasHandlers() {
  if (canvasMouseMove) { document.removeEventListener('mousemove', canvasMouseMove); canvasMouseMove = null; }
  if (canvasMouseUp) { document.removeEventListener('mouseup', canvasMouseUp); canvasMouseUp = null; }
}

export default function CanvasNode({ node, depth = 0 }: Props) {
  const {
    selectedId, setSelected,
    deleteComponent, duplicateComponent,
    addComponent, moveComponent,
    moveComponentBeforeAfter,
    page,
  } = useBuilderStore();

  const isNodeContainer = isContainer(node.type);
  const isSelected = selectedId === node.id;
  const isRoot = node.type === 'page';

  // ─── Get siblings for move up/down ───────────────────────────────────────
  const getParentAndIndex = () => {
    const parentId = findParentId(page, node.id);
    if (!parentId) return null;
    const parent = findNodeById(page, parentId);
    if (!parent?.children) return null;
    const index = parent.children.findIndex(c => c.id === node.id);
    return { parent, index };
  };

  const canMoveUp = () => {
    const info = getParentAndIndex();
    return info ? info.index > 0 : false;
  };

  const canMoveDown = () => {
    const info = getParentAndIndex();
    return info ? info.index < info.parent.children!.length - 1 : false;
  };

  const handleMoveUp = () => {
    const info = getParentAndIndex();
    if (!info || info.index === 0) return;
    const prevSibling = info.parent.children![info.index - 1];
    moveComponentBeforeAfter(node.id, prevSibling.id, 'before');
  };

  const handleMoveDown = () => {
    const info = getParentAndIndex();
    if (!info || info.index >= info.parent.children!.length - 1) return;
    const nextSibling = info.parent.children![info.index + 1];
    moveComponentBeforeAfter(node.id, nextSibling.id, 'after');
  };

  // ─── Mouse drag ───────────────────────────────────────────────────────────
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isRoot) return;
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('[data-toolbar]')) return;
    e.preventDefault();
    e.stopPropagation();

    let isDragging = false;
    const startX = e.clientX;
    const startY = e.clientY;
    cleanupCanvasHandlers();

    canvasMouseMove = (moveEvent: MouseEvent) => {
      const dx = Math.abs(moveEvent.clientX - startX);
      const dy = Math.abs(moveEvent.clientY - startY);
      if (!isDragging && (dx > 5 || dy > 5)) {
        isDragging = true;
        dragState.startCanvasDrag(node.id, node.type);
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

    canvasMouseUp = (upEvent: MouseEvent) => {
      cleanupCanvasHandlers();
      document.querySelectorAll('[data-droppable]').forEach(el => {
        (el as HTMLElement).style.outline = '';
        (el as HTMLElement).style.background = '';
      });
      document.querySelectorAll('[data-leaf]').forEach(el => {
        (el as HTMLElement).style.borderTop = '3px solid transparent';
        (el as HTMLElement).style.borderBottom = '3px solid transparent';
      });

      if (isDragging && dragState.active && dragState.source === 'canvas') {
        const sourceId = dragState.nodeId!;
        if (dragState.ghost) dragState.ghost.style.display = 'none';
        const el = document.elementFromPoint(upEvent.clientX, upEvent.clientY);
        if (dragState.ghost) dragState.ghost.style.display = '';
        const dropTarget = el?.closest('[data-droppable]') as HTMLElement | null;
        const targetNodeId = dropTarget?.getAttribute('data-node-id');
        dragState.clear();

        if (!targetNodeId || targetNodeId === sourceId) return;
        const sourceNode = findNodeById(page, sourceId);
        const targetNode = findNodeById(page, targetNodeId);
        if (!sourceNode || !targetNode) return;
        if (isDescendant(targetNode, sourceId)) return;

        const isTargetContainer = isContainer(targetNode.type) || targetNode.type === 'page';
        const isLeaf = dropTarget?.hasAttribute('data-leaf');

        if (isLeaf) {
          const rect = dropTarget!.getBoundingClientRect();
          const pos = upEvent.clientY - rect.top < rect.height / 2 ? 'before' : 'after';
          moveComponentBeforeAfter(sourceId, targetNodeId, pos);
        } else if (isTargetContainer) {
          moveComponent(sourceId, targetNodeId, null);
        }
      } else {
        dragState.clear();
      }
    };

    document.addEventListener('mousemove', canvasMouseMove);
    document.addEventListener('mouseup', canvasMouseUp);
  };

  // ─── ROOT ─────────────────────────────────────────────────────────────────
  if (isRoot) {
    return (
      <div
        data-droppable
        data-node-id={node.id}
        onClick={() => setSelected(null)}
        style={{ minHeight: '100vh', background: '#ffffff', position: 'relative' }}
      >
        {(!node.children || node.children.length === 0) && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <span style={{ fontSize: 48, opacity: 0.1 }}>⊕</span>
            <span style={{ fontSize: 14, color: '#999' }}>Click a component to add</span>
            <span style={{ fontSize: 12, color: '#bbb' }}>or drag it here</span>
          </div>
        )}
        {node.children?.map(child => <CanvasNode key={child.id} node={child} depth={depth + 1} />)}
      </div>
    );
  }

  // ─── CONTAINER ────────────────────────────────────────────────────────────
  if (isNodeContainer) {
    return (
      <div
        onMouseDown={handleMouseDown}
        onClick={e => { e.stopPropagation(); setSelected(node.id); }}
        style={{
          position: 'relative',
          cursor: 'grab',
          outline: isSelected ? '2px solid #6c63ff' : 'none',
          outlineOffset: 2,
          ...getWrapStyle(node),
        }}
      >
        {isSelected && (
          <Toolbar
            label={node.type}
            canMoveUp={canMoveUp()}
            canMoveDown={canMoveDown()}
            isContainer={true}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onDuplicate={() => duplicateComponent(node.id)}
            onDelete={() => deleteComponent(node.id)}
            onAddChild={() => {
              // Add a heading inside container by default
              addComponent('heading' as ComponentType, node.id);
            }}
          />
        )}
        <div
          data-droppable
          data-node-id={node.id}
          style={getInnerStyle(node)}
        >
          {(!node.children || node.children.length === 0) && (
            <div style={{ minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #ddd', borderRadius: 8, color: '#bbb', fontSize: 13, pointerEvents: 'none' }}>
              Drop inside {node.type}
            </div>
          )}
          {node.children?.map(child => <CanvasNode key={child.id} node={child} depth={depth + 1} />)}
        </div>
      </div>
    );
  }

  // ─── LEAF ─────────────────────────────────────────────────────────────────
  return (
    <div
      data-droppable
      data-leaf
      data-node-id={node.id}
      onMouseDown={handleMouseDown}
      onClick={e => { e.stopPropagation(); setSelected(node.id); }}
      style={{
        position: 'relative',
        cursor: 'grab',
        outline: isSelected ? '2px solid #6c63ff' : 'none',
        outlineOffset: 1,
        borderTop: '3px solid transparent',
        borderBottom: '3px solid transparent',
        userSelect: 'none',
      }}
    >
      {isSelected && (
        <Toolbar
          label={node.type}
          canMoveUp={canMoveUp()}
          canMoveDown={canMoveDown()}
          isContainer={false}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onDuplicate={() => duplicateComponent(node.id)}
          onDelete={() => deleteComponent(node.id)}
        />
      )}
      <NodeRenderer node={node} />
    </div>
  );
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────
interface ToolbarProps {
  label: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  isContainer: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onAddChild?: () => void;
}

function Toolbar({ label, canMoveUp, canMoveDown, isContainer, onMoveUp, onMoveDown, onDuplicate, onDelete, onAddChild }: ToolbarProps) {
  return (
    <div
      data-toolbar
      style={{
        position: 'absolute', top: -34, left: 0, zIndex: 999,
        display: 'flex', alignItems: 'center', gap: 2,
        background: '#6c63ff', borderRadius: '6px 6px 0 0',
        padding: '4px 8px', whiteSpace: 'nowrap',
        boxShadow: '0 -2px 8px rgba(108,99,255,0.3)',
      }}
      onMouseDown={e => e.stopPropagation()}
      onClick={e => e.stopPropagation()}
    >
      {/* Label */}
      <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, marginRight: 4 }}>{label}</span>
      <Divider />

      {/* Move up */}
      <ToolBtn
        onClick={onMoveUp}
        disabled={!canMoveUp}
        title="Move Up"
      >↑</ToolBtn>

      {/* Move down */}
      <ToolBtn
        onClick={onMoveDown}
        disabled={!canMoveDown}
        title="Move Down"
      >↓</ToolBtn>

      <Divider />

      {/* Duplicate */}
      <ToolBtn onClick={onDuplicate} title="Duplicate">⧉</ToolBtn>

      {/* Add child (containers only) */}
      {isContainer && onAddChild && (
        <ToolBtn onClick={onAddChild} title="Add component inside">⊕</ToolBtn>
      )}

      <Divider />

      {/* Delete */}
      <ToolBtn onClick={onDelete} title="Delete" danger>✕</ToolBtn>
    </div>
  );
}

function Divider() {
  return <div style={{ width: 1, height: 14, background: '#ffffff33', margin: '0 4px' }} />;
}

function ToolBtn({ onClick, disabled, title, danger, children }: {
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onMouseDown={e => e.stopPropagation()}
      onClick={e => { e.stopPropagation(); if (!disabled) onClick(); }}
      title={title}
      style={{
        background: 'none', border: 'none',
        color: disabled ? '#ffffff44' : danger ? '#ff6b6b' : '#fff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 13, padding: '2px 5px', lineHeight: 1,
        borderRadius: 4,
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => {
        if (!disabled) (e.currentTarget as HTMLElement).style.background = '#ffffff22';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = 'none';
      }}
    >
      {children}
    </button>
  );
}

// ─── Style Helpers ─────────────────────────────────────────────────────────────
function getWrapStyle(node: LayoutNode): React.CSSProperties {
  const p = node.props;
  if (node.type === 'section') return { padding: (p as SectionProps).padding || '40px', background: (p as SectionProps).bgColor || '#f9f9f9' };
  if (node.type === 'container') return { maxWidth: (p as ContainerProps).maxWidth || '1200px', margin: '0 auto', padding: (p as ContainerProps).padding || '0 20px' };
  return {};
}

function getInnerStyle(node: LayoutNode): React.CSSProperties {
  const base: React.CSSProperties = { minHeight: 60 };
  if (node.type === 'grid') return { ...base, display: 'grid', gridTemplateColumns: `repeat(${(node.props as GridProps).columns || 3}, 1fr)`, gap: (node.props as GridProps).gap || '24px' };
  if (node.type === 'columns') return { ...base, display: 'flex', gap: (node.props as ColumnsProps).gap || '24px', alignItems: 'flex-start', flexWrap: 'wrap' };
  return base;
}