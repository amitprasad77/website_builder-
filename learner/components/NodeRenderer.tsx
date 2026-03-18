// components/NodeRenderer.tsx
import type { LayoutNode } from '../lib/api';

interface Props {
  node: LayoutNode;
}

export default function NodeRenderer({ node }: Props) {
  const { type, props, children } = node;

  switch (type) {
    case 'page':
      return (
        <div style={{ minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
          {children?.map((child) => <NodeRenderer key={child.id} node={child} />)}
        </div>
      );

    case 'section':
      return (
        <section style={{
          padding: props.padding || '60px 40px',
          background: props.bgColor || 'transparent',
        }}>
          {children?.map((child) => <NodeRenderer key={child.id} node={child} />)}
        </section>
      );

    case 'container':
      return (
        <div style={{
          maxWidth: props.maxWidth || '1200px',
          margin: '0 auto',
          padding: props.padding || '0 20px',
        }}>
          {children?.map((child) => <NodeRenderer key={child.id} node={child} />)}
        </div>
      );

    case 'grid':
      return (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${props.columns || 3}, 1fr)`,
          gap: props.gap || '24px',
        }}>
          {children?.map((child) => <NodeRenderer key={child.id} node={child} />)}
        </div>
      );

    case 'columns':
      return (
        <div style={{
          display: 'flex',
          gap: props.gap || '24px',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}>
          {children?.map((child) => (
            <div key={child.id} style={{ flex: 1, minWidth: '200px' }}>
              <NodeRenderer node={child} />
            </div>
          ))}
        </div>
      );

    case 'navbar':
      return (
        <nav style={{
          background: props.bgColor || '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          padding: '0 40px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <div style={{ fontWeight: 700, fontSize: '18px', color: '#1a1a2e' }}>
            {props.logo || 'Brand'}
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            {(props.links || []).map((link: string, i: number) => (
              <a key={i} href="#" style={{ color: '#555', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                {link}
              </a>
            ))}
          </div>
        </nav>
      );

    case 'hero':
      return (
        <section style={{
          background: props.bgColor || '#1a1a2e',
          padding: '100px 40px',
          textAlign: 'center',
          color: '#ffffff',
        }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 16px', lineHeight: 1.2 }}>
            {props.title || 'Welcome'}
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#aaaacc', maxWidth: '600px', margin: '0 auto 32px' }}>
            {props.subtitle || ''}
          </p>
          {props.buttonText && (
            <a
              href={props.buttonHref || '#'}
              style={{
                display: 'inline-block',
                background: '#6c63ff',
                color: '#fff',
                padding: '14px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '15px',
              }}
            >
              {props.buttonText}
            </a>
          )}
        </section>
      );

    case 'heading':
      return (
        <h2 style={{
          fontSize: props.fontSize || '2rem',
          textAlign: (props.alignment as any) || 'left',
          color: props.color || '#111111',
          margin: '0 0 16px',
          fontWeight: 700,
          lineHeight: 1.3,
        }}>
          {props.text || 'Heading'}
        </h2>
      );

    case 'text':
      return (
        <p style={{
          fontSize: props.fontSize || '1rem',
          color: props.color || '#444444',
          margin: '0 0 16px',
          lineHeight: 1.7,
        }}>
          {props.text || ''}
        </p>
      );

    case 'button':
      return (
        <a
          href={props.href || '#'}
          style={{
            display: 'inline-block',
            background: props.variant === 'outline' ? 'transparent' : '#6c63ff',
            color: props.variant === 'outline' ? '#6c63ff' : '#ffffff',
            border: '2px solid #6c63ff',
            padding: '12px 28px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14px',
            margin: '0 0 16px',
          }}
        >
          {props.label || 'Click Me'}
        </a>
      );

    case 'image':
      return (
        <img
          src={props.src || 'https://placehold.co/600x300'}
          alt={props.alt || ''}
          style={{
            width: props.width || '100%',
            height: 'auto',
            borderRadius: '8px',
            display: 'block',
            margin: '0 0 16px',
          }}
        />
      );

    case 'video':
      return props.src ? (
        <video
          src={props.src}
          controls
          style={{ width: props.width || '100%', borderRadius: '8px', margin: '0 0 16px' }}
        />
      ) : null;

    case 'footer':
      return (
        <footer style={{
          background: props.bgColor || '#111111',
          color: props.color || '#ffffff',
          padding: '40px',
          textAlign: 'center',
          fontSize: '14px',
        }}>
          {props.text || ''}
        </footer>
      );

    default:
      return null;
  }
}