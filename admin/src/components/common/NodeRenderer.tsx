// // src/components/common/NodeRenderer.tsx
// import type{ LayoutNode, HeroProps, HeadingProps, TextProps, ButtonProps, ImageProps, FooterProps, NavbarProps, SectionProps, ContainerProps, GridProps, ColumnsProps } from '../../types/builder';

// interface Props {
//   node: LayoutNode;
// }

// export default function NodeRenderer({ node }: Props) {
//   const { type, props } = node;

//   switch (type) {
//     case 'navbar': {
//       const p = props as NavbarProps;
//       return (
//         <nav style={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           padding: '14px 32px',
//           background: p.bgColor || '#ffffff',
//           borderBottom: '1px solid #eee',
//         }}>
//           <span style={{ fontWeight: 700, fontSize: '18px' }}>
//             {p.logo || 'MySite'}
//           </span>
//           <div style={{ display: 'flex', gap: '24px' }}>
//             {(p.links || ['Home', 'About', 'Contact']).map((link, i) => (
//               <a key={i} href="#" style={{ color: '#333', textDecoration: 'none', fontSize: '14px' }}>
//                 {link}
//               </a>
//             ))}
//           </div>
//         </nav>
//       );
//     }

//     case 'hero': {
//       const p = props as HeroProps;
//       return (
//         <div style={{
//           padding: '80px 40px',
//           textAlign: 'center',
//           background: p.bgImage
//             ? `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url(${p.bgImage}) center/cover`
//             : (p.bgColor || '#1a1a2e'),
//           color: '#ffffff',
//         }}>
//           <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 16px', lineHeight: 1.2 }}>
//             {p.title || 'Hero Title'}
//           </h1>
//           <p style={{ fontSize: '1.2rem', opacity: 0.85, marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
//             {p.subtitle || 'Your subtitle here'}
//           </p>
//           {p.buttonText && (
//             <a href={p.buttonHref || '#'} style={{
//               display: 'inline-block',
//               padding: '14px 32px',
//               borderRadius: '8px',
//               background: '#6c63ff',
//               color: '#ffffff',
//               textDecoration: 'none',
//               fontWeight: 600,
//             }}>
//               {p.buttonText}
//             </a>
//           )}
//         </div>
//       );
//     }

//     case 'heading': {
//       const p = props as HeadingProps;
//       return (
//         <h2 style={{
//           fontSize: p.fontSize || '2rem',
//           textAlign: p.alignment || 'left',
//           color: p.color || '#111111',
//           margin: '8px 0',
//           fontWeight: 700,
//         }}>
//           {p.text || 'Heading'}
//         </h2>
//       );
//     }

//     case 'text': {
//       const p = props as TextProps;
//       return (
//         <p style={{
//           fontSize: p.fontSize || '1rem',
//           color: p.color || '#444444',
//           lineHeight: 1.6,
//           margin: '8px 0',
//         }}>
//           {p.text || 'Write something here...'}
//         </p>
//       );
//     }

//     case 'button': {
//       const p = props as ButtonProps;
//       return (
//         <a href={p.href || '#'} style={{
//           display: 'inline-block',
//           padding: '12px 28px',
//           borderRadius: '8px',
//           background: p.variant === 'secondary' ? 'transparent' : '#6c63ff',
//           color: p.variant === 'secondary' ? '#6c63ff' : '#ffffff',
//           border: p.variant === 'secondary' ? '2px solid #6c63ff' : 'none',
//           textDecoration: 'none',
//           fontWeight: 600,
//           fontSize: '14px',
//           cursor: 'pointer',
//         }}>
//           {p.label || 'Click Me'}
//         </a>
//       );
//     }

//     case 'image': {
//       const p = props as ImageProps;
//       return (
//         <img
//           src={p.src || 'https://placehold.co/600x300'}
//           alt={p.alt || ''}
//           style={{
//             width: p.width || '100%',
//             display: 'block',
//             borderRadius: '8px',
//           }}
//         />
//       );
//     }

//     case 'video': {
//       return (
//         <div style={{
//           width: '100%',
//           paddingTop: '56.25%',
//           background: '#000000',
//           borderRadius: '8px',
//           position: 'relative',
//         }}>
//           <span style={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             color: '#ffffff',
//             fontSize: '3rem',
//           }}>
//             ▶
//           </span>
//         </div>
//       );
//     }

//     case 'footer': {
//       const p = props as FooterProps;
//       return (
//         <footer style={{
//           padding: '32px 40px',
//           textAlign: 'center',
//           background: p.bgColor || '#111111',
//           color: p.color || '#ffffff',
//           fontSize: '14px',
//         }}>
//           {p.text || '© 2025. All rights reserved.'}
//         </footer>
//       );
//     }

//     case 'section': {
//       const p = props as SectionProps;
//       return (
//         <div style={{
//           padding: p.padding || '40px',
//           background: p.bgColor || 'transparent',
//           minHeight: '60px',
//         }}>
//           {node.children?.map((child) => (
//             <NodeRenderer key={child.id} node={child} />
//           ))}
//         </div>
//       );
//     }

//     case 'container': {
//       const p = props as ContainerProps;
//       return (
//         <div style={{
//           maxWidth: p.maxWidth || '1200px',
//           margin: '0 auto',
//           padding: p.padding || '0 20px',
//         }}>
//           {node.children?.map((child) => (
//             <NodeRenderer key={child.id} node={child} />
//           ))}
//         </div>
//       );
//     }

//     case 'grid': {
//       const p = props as GridProps;
//       return (
//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: `repeat(${p.columns || 3}, 1fr)`,
//           gap: p.gap || '24px',
//         }}>
//           {node.children?.map((child) => (
//             <NodeRenderer key={child.id} node={child} />
//           ))}
//         </div>
//       );
//     }

//     case 'columns': {
//       const p = props as ColumnsProps;
//       return (
//         <div style={{
//           display: 'flex',
//           gap: p.gap || '24px',
//           flexWrap: 'wrap',
//         }}>
//           {node.children?.map((child) => (
//             <div key={child.id} style={{ flex: 1 }}>
//               <NodeRenderer node={child} />
//             </div>
//           ))}
//         </div>
//       );
//     }

//     default:
//       return (
//         <div style={{
//           padding: '16px',
//           background: '#f0f0ff',
//           border: '1px dashed #6c63ff',
//           borderRadius: '6px',
//           color: '#6c63ff',
//           fontSize: '13px',
//         }}>
//           Unknown: {type}
//         </div>
//       );
//   }
// }


// src/components/common/NodeRenderer.tsx
import type {
  LayoutNode, NavbarProps, HeroProps, HeadingProps, TextProps,
  ButtonProps, ImageProps, FooterProps, SectionProps, ContainerProps,
  GridProps, ColumnsProps, TestimonialProps, PricingProps, FaqProps,
  ProgressProps, IconTextProps, DividerProps, SpacerProps, BadgeProps, CodeBlockProps
} from '../../types/builder';

interface Props { node: LayoutNode; }

export default function NodeRenderer({ node }: Props) {
  const { type, props } = node;

  switch (type) {
    case 'navbar': {
      const p = props as NavbarProps;
      return (
        <nav style={{ background: p.bgColor || '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 700, fontSize: '18px', color: '#1a1a2e' }}>{p.logo}</div>
          <div style={{ display: 'flex', gap: '24px' }}>
            {(p.links || []).map((link, i) => (
              <span key={i} style={{ color: '#555', fontSize: '14px', fontWeight: 500 }}>{link}</span>
            ))}
          </div>
        </nav>
      );
    }

    case 'hero': {
      const p = props as HeroProps;
      return (
        <div style={{ background: p.bgColor || '#1a1a2e', backgroundImage: p.bgImage ? `url(${p.bgImage})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center', padding: '100px 40px', textAlign: 'center', color: '#ffffff' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 16px', lineHeight: 1.2 }}>{p.title}</h1>
          <p style={{ fontSize: '1.2rem', color: '#aaaacc', maxWidth: '600px', margin: '0 auto 32px' }}>{p.subtitle}</p>
          {p.buttonText && (
            <a href={p.buttonHref || '#'} style={{ display: 'inline-block', background: '#6c63ff', color: '#fff', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '15px' }}>
              {p.buttonText}
            </a>
          )}
        </div>
      );
    }

    case 'heading': {
      const p = props as HeadingProps;
      return (
        <h2 style={{ fontSize: p.fontSize || '2rem', textAlign: (p.alignment as any) || 'left', color: p.color || '#111111', margin: '0 0 8px', fontWeight: 700, lineHeight: 1.3 }}>
          {p.text || 'Heading'}
        </h2>
      );
    }

    case 'text': {
      const p = props as TextProps;
      return (
        <p style={{ fontSize: p.fontSize || '1rem', color: p.color || '#444444', textAlign: (p.alignment as any) || 'left', margin: '0 0 8px', lineHeight: 1.7 }}>
          {p.text || 'Write something here...'}
        </p>
      );
    }

    case 'button': {
      const p = props as ButtonProps;
      const justifyMap: Record<string, string> = { left: 'flex-start', center: 'center', right: 'flex-end' };
      return (
        <div style={{ display: 'flex', justifyContent: justifyMap[p.alignment || 'left'] || 'flex-start', margin: '0 0 8px' }}>
          <a href={p.href || '#'} style={{
            display: 'inline-block',
            background: p.variant === 'outline' ? 'transparent' : (p.bgColor || '#6c63ff'),
            color: p.color || '#ffffff',
            border: p.variant === 'outline' ? `2px solid ${p.bgColor || '#6c63ff'}` : 'none',
            padding: p.padding || '12px 28px',
            borderRadius: p.borderRadius || '8px',
            textDecoration: 'none', fontWeight: 600,
            fontSize: p.fontSize || '14px', cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            {p.label || 'Click Me'}
          </a>
        </div>
      );
    }

    case 'image': {
      const p = props as ImageProps;
      const justifyMap: Record<string, string> = { left: 'flex-start', center: 'center', right: 'flex-end' };
      return (
        <div style={{ display: 'flex', justifyContent: justifyMap[p.alignment || 'left'] || 'flex-start' }}>
          <img src={p.src || 'https://placehold.co/600x300'} alt={p.alt || ''} style={{ width: p.width || '100%', height: 'auto', borderRadius: p.borderRadius || '0px', display: 'block' }} />
        </div>
      );
    }

    case 'video': {
      const p = props as any;
      return p.src ? (
        <video src={p.src} controls style={{ width: p.width || '100%', borderRadius: '8px', display: 'block' }} />
      ) : (
        <div style={{ width: '100%', height: '200px', background: '#1e1e2e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '14px', borderRadius: '8px' }}>
          ▶ Add a video URL in Properties
        </div>
      );
    }

    case 'divider': {
      const p = props as DividerProps;
      return <hr style={{ border: 'none', borderTop: `${p.thickness || '1px'} solid ${p.color || '#e5e7eb'}`, margin: p.margin || '16px 0' }} />;
    }

    case 'spacer': {
      const p = props as SpacerProps;
      return <div style={{ height: p.height || '40px' }} />;
    }

    case 'badge': {
      const p = props as BadgeProps;
      return (
        <span style={{ display: 'inline-block', background: p.bgColor || '#6c63ff22', color: p.color || '#6c63ff', padding: '4px 12px', borderRadius: p.borderRadius || '20px', fontSize: '12px', fontWeight: 600 }}>
          {p.text || 'Badge'}
        </span>
      );
    }

    case 'testimonial': {
      const p = props as TestimonialProps;
      return (
        <div style={{ background: p.bgColor || '#f9f9f9', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '1.1rem', color: '#333', fontStyle: 'italic', lineHeight: 1.7, margin: '0 0 20px' }}>"{p.quote}"</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {p.avatar && <img src={p.avatar} alt={p.author} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />}
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#111' }}>{p.author}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>{p.role}</div>
            </div>
          </div>
        </div>
      );
    }

    case 'pricing': {
      const p = props as PricingProps;
      return (
        <div style={{ background: p.highlighted ? '#6c63ff' : '#ffffff', borderRadius: '16px', padding: '40px 32px', boxShadow: p.highlighted ? '0 8px 32px rgba(108,99,255,0.3)' : '0 2px 12px rgba(0,0,0,0.08)', border: p.highlighted ? 'none' : '1px solid #e5e7eb', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: p.highlighted ? '#fff' : '#111', margin: '0 0 16px' }}>{p.title}</h3>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: p.highlighted ? '#fff' : '#6c63ff', margin: '0 0 4px' }}>{p.price}</div>
          <div style={{ fontSize: '14px', color: p.highlighted ? '#ffffffaa' : '#888', margin: '0 0 24px' }}>{p.period}</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', textAlign: 'left' }}>
            {(p.features || []).map((f, i) => (
              <li key={i} style={{ padding: '8px 0', color: p.highlighted ? '#fff' : '#444', fontSize: '14px', borderBottom: `1px solid ${p.highlighted ? '#ffffff22' : '#f0f0f0'}` }}>
                ✓ {f}
              </li>
            ))}
          </ul>
          <a href="#" style={{ display: 'block', background: p.highlighted ? '#fff' : '#6c63ff', color: p.highlighted ? '#6c63ff' : '#fff', padding: '14px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>
            {p.buttonText || 'Get Started'}
          </a>
        </div>
      );
    }

    case 'faq': {
      const p = props as FaqProps;
      return (
        <div style={{ borderBottom: '1px solid #e5e7eb', padding: '20px 0' }}>
          <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#111', margin: '0 0 10px', cursor: 'pointer' }}>
            {p.question}
          </h4>
          <p style={{ fontSize: '14px', color: '#555', margin: 0, lineHeight: 1.7 }}>{p.answer}</p>
        </div>
      );
    }

    case 'progress': {
      const p = props as ProgressProps;
      return (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#333' }}>{p.label}</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: p.color || '#6c63ff' }}>{p.value}%</span>
          </div>
          <div style={{ background: p.bgColor || '#e5e7eb', borderRadius: '99px', height: '8px', overflow: 'hidden' }}>
            <div style={{ background: p.color || '#6c63ff', width: `${p.value || 0}%`, height: '100%', borderRadius: '99px', transition: 'width 0.3s' }} />
          </div>
        </div>
      );
    }

    case 'icontext': {
      const p = props as IconTextProps;
      return (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', padding: '16px 0' }}>
          <div style={{ width: '48px', height: '48px', background: '#6c63ff22', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
            {p.icon || '⚡'}
          </div>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#111', margin: '0 0 6px' }}>{p.title}</h4>
            <p style={{ fontSize: '14px', color: '#555', margin: 0, lineHeight: 1.6 }}>{p.text}</p>
          </div>
        </div>
      );
    }

    case 'codeblock': {
      const p = props as CodeBlockProps;
      return (
        <div style={{ background: '#1e1e2e', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '8px 16px', background: '#252538', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: '#888', fontWeight: 600 }}>{p.language || 'javascript'}</span>
          </div>
          <pre style={{ margin: 0, padding: '16px', fontSize: '13px', color: '#cdd6f4', fontFamily: 'monospace', overflowX: 'auto', lineHeight: 1.6 }}>
            {p.code || '// Your code here'}
          </pre>
        </div>
      );
    }

    case 'footer': {
      const p = props as FooterProps;
      return (
        <footer style={{ background: p.bgColor || '#111111', color: p.color || '#ffffff', padding: '40px', textAlign: (p.alignment as any) || 'center', fontSize: '14px' }}>
          {p.text || '© 2025 Your Company'}
        </footer>
      );
    }

    case 'section': {
      const p = props as SectionProps;
      return (
        <section style={{ padding: p.padding || '60px 40px', background: p.bgColor || 'transparent', textAlign: (p as any).textAlign || undefined }}>
          {node.children?.map(child => <NodeRenderer key={child.id} node={child} />)}
        </section>
      );
    }

    case 'container': {
      const p = props as ContainerProps;
      return (
        <div style={{ maxWidth: p.maxWidth || '1200px', margin: '0 auto', padding: p.padding || '0 20px' }}>
          {node.children?.map(child => <NodeRenderer key={child.id} node={child} />)}
        </div>
      );
    }

    case 'grid': {
      const p = props as GridProps;
      return (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${p.columns || 3}, 1fr)`, gap: p.gap || '24px' }}>
          {node.children?.map(child => <NodeRenderer key={child.id} node={child} />)}
        </div>
      );
    }

    case 'columns': {
      const p = props as ColumnsProps;
      return (
        <div style={{ display: 'flex', gap: p.gap || '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {node.children?.map(child => (
            <div key={child.id} style={{ flex: 1, minWidth: '200px' }}>
              <NodeRenderer node={child} />
            </div>
          ))}
        </div>
      );
    }

    default:
      return null;
  }
}