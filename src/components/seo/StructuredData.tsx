interface StructuredDataProps {
  type?: 'WebApplication' | 'SoftwareApplication';
  name: string;
  description: string;
  url?: string;
}

export function StructuredData({
  type = 'WebApplication',
  name,
  description,
  url,
}: StructuredDataProps) {
  const siteUrl = url || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const data = {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    description,
    url: siteUrl,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'URL QR codes',
      'WiFi QR codes',
      'vCard QR codes',
      'Email & SMS QR codes',
      'Calendar event QR codes',
      'Location & Crypto QR codes',
      'Bulk generation from CSV',
      'PNG, SVG, PDF, JPEG, WebP export',
      'Privacy-first — runs entirely in your browser',
      'PWA — install on any device',
      'Bilingual: English + Arabic',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '1247',
    },
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
