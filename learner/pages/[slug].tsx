// pages/[slug].tsx
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getWebsiteBySlug } from '../lib/api';
import type { Website } from '../lib/api';
import NodeRenderer from '../components/NodeRenderer';

interface Props {
  website?: Website;
  error?: string;
}

export default function SitePage({ website, error }: Props) {
  if (error) {
    return (
      <div style={{ fontFamily: 'sans-serif', padding: '60px', textAlign: 'center', color: '#ff6b6b' }}>
        <h1>404</h1>
        <p>{error}</p>
        <a href="/" style={{ color: '#6c63ff' }}>← Back to all sites</a>
      </div>
    );
  }

  if (!website) return null;

  const title = website.course?.title || website.name;
  const description = website.course?.description || '';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {website.course?.thumbnail && (
          <meta property="og:image" content={website.course.thumbnail} />
        )}
      </Head>
      <NodeRenderer node={website.mergedLayout} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string;
  try {
    const website = await getWebsiteBySlug(slug);
    return { props: { website } };
  } catch (e) {
    return { props: { error: `No site found for "${slug}"` } };
  }
};