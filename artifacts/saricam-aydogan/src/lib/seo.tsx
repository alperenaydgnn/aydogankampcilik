import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const DEFAULT_TITLE = 'Sarıçam Aydoğan Kamp & Balık Malzemeleri';
const DEFAULT_DESCRIPTION = 'Karadeniz\'in güvenilir kamp ve balık malzemeleri mağazası. Çadır, olta, fener ve outdoor ekipmanları.';
const DEFAULT_IMAGE = '/mock/hero.jpg'; // We can use the hero image as default OG

export function SEO({ title, description, image, url }: SEOProps) {
  const siteTitle = title ? `${title} | Sarıçam Aydoğan` : DEFAULT_TITLE;
  const metaDescription = description || DEFAULT_DESCRIPTION;
  const metaImage = image || DEFAULT_IMAGE;
  const siteUrl = url ? `https://saricamaydogan.com${url}` : 'https://saricamaydogan.com';

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={metaDescription} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={siteUrl} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
}
