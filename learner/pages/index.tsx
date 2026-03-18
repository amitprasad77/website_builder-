// pages/index.tsx
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { getAllWebsites } from '../lib/api';
import type { Website } from '../lib/api';

interface Props {
  websites: Website[];
  error?: string;
}

export default function Home({ websites, error }: Props) {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: '100vh', background: '#0d0d1a', color: '#ddd' }}>
      {/* Header */}
      <div style={{ padding: '40px', borderBottom: '1px solid #2d2d42' }}>
        <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, margin: 0 }}>
          Course Sites
        </h1>
        <p style={{ color: '#555', marginTop: '8px' }}>All published websites</p>
      </div>

      <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
        {error && (
          <div style={{ padding: '16px', background: '#ff6b6b11', border: '1px solid #ff6b6b33', borderRadius: '8px', color: '#ff6b6b', marginBottom: '24px' }}>
            {error}
          </div>
        )}

        {websites.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#444' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>🌐</div>
            <div>No published websites yet.</div>
            <div style={{ fontSize: '13px', marginTop: '8px', color: '#333' }}>
              Create a template in the admin builder and publish it.
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {websites.map((site) => (
            <Link key={site.id} href={`/${site.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#1e1e2e',
                border: '1px solid #2d2d42',
                borderRadius: '12px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = '#6c63ff';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = '#2d2d42';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🌐</div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '16px' }}>{site.name}</div>
                <div style={{ color: '#555', fontSize: '12px', marginTop: '6px' }}>/{site.slug}</div>
                <div style={{
                  display: 'inline-block',
                  marginTop: '12px',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 600,
                  background: site.status === 'PUBLISHED' ? '#16a34a22' : '#6c63ff22',
                  color: site.status === 'PUBLISHED' ? '#16a34a' : '#6c63ff',
                  border: `1px solid ${site.status === 'PUBLISHED' ? '#16a34a44' : '#6c63ff44'}`,
                }}>
                  {site.status}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const websites = await getAllWebsites();
    return { props: { websites } };
  } catch (e) {
    return { props: { websites: [], error: 'Failed to connect to backend.' } };
  }
};