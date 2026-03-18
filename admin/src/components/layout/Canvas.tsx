// src/components/layout/Canvas.tsx
import { useBuilderStore } from '../../store/builderStore';
import CanvasNode from './CanvasNode';

export default function Canvas() {
  const { page } = useBuilderStore();

  return (
    <div style={{
      flex: 1, background: '#0d0d1a',
      overflowY: 'auto', position: 'relative',
    }}>
      <div style={{
        maxWidth: '960px', margin: '32px auto',
        background: '#ffffff',
        minHeight: 'calc(100vh - 64px)',
        borderRadius: '12px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        overflow: 'visible',
      }}>
        <CanvasNode node={page} />
      </div>
    </div>
  );
}