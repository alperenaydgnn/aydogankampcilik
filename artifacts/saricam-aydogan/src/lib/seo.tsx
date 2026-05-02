import { Helmet } from 'react-helmet-async';
import { SITE_URL, SITE_NAME } from './schemas';

interface SEOProps {
  title?:       string;
  description?: string;
  image?:       string;
  url?:         string;
  type?:        "website" | "product" | "article";
  keywords?:    string;
  noindex?:     boolean;
  canonical?:   string;
}

const DEFAULT_DESCRIPTION =
  "Trabzon'da kamp malzemeleri, balık malzemeleri ve outdoor ekipmanları. " +
  "Kamp çadırı, olta takımı, kamp feneri ve balıkçı malzemeleri. WhatsApp ile hızlı sipariş.";
const DEFAULT_IMAGE = "/mock/hero.jpg";
const DEFAULT_KEYWORDS =
  "kamp malzemeleri, balık malzemeleri, olta ekipmanları, kamp çadırı, " +
  "balıkçı malzemeleri, outdoor ekipmanları, kamp ekipmanları, Trabzon";

export function SEO({
  title,
  description,
  image,
  url,
  type       = "website",
  keywords,
  noindex    = false,
  canonical,
}: SEOProps) {
  const siteTitle      = title ? `${title} | Sarıçam Aydoğan` : SITE_NAME;
  const metaDescription = description || DEFAULT_DESCRIPTION;
  const metaImage      = image
    ? (image.startsWith("http") ? image : `${SITE_URL}${image}`)
    : `${SITE_URL}${DEFAULT_IMAGE}`;
  const canonicalPath  = canonical ?? url;
  const canonicalHref  = canonicalPath ? `${SITE_URL}${canonicalPath}` : SITE_URL;
  const metaKeywords   = keywords || DEFAULT_KEYWORDS;

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description"    content={metaDescription} />
      <meta name="keywords"       content={metaKeywords} />
      {noindex
        ? <meta name="robots" content="noindex, nofollow" />
        : <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
      }
      <link rel="canonical" href={canonicalHref} />

      <meta property="og:type"        content={type} />
      <meta property="og:url"         content={canonicalHref} />
      <meta property="og:title"       content={siteTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image"       content={metaImage} />
      <meta property="og:image:width"  content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale"      content="tr_TR" />
      <meta property="og:site_name"   content="Sarıçam Aydoğan" />

      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:url"         content={canonicalHref} />
      <meta name="twitter:title"       content={siteTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image"       content={metaImage} />
    </Helmet>
  );
}
