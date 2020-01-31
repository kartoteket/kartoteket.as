const webSite = {
  '@type': 'WebSite',
  '@id': 'https://kartoteket.as/#website',
  url: 'https://kartoteket.as/',
  name: 'Kartoteket'
};

const organisation = {
  '@type': 'Organization',
  '@id': 'https://kartoteket.as/#identity',
  name: 'Kartoteket',
  alternateName: '3by5',
  url: 'https://kartoteket.as',
  sameAs: [
    'https://github.com/kartoteket',
    'https://observablehq.com/@kartoteket/',
    'https://twitter.com/3x5Kartoteket'
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Storgata 36 C',
    addressLocality: 'Oslo',
    addressRegion: 'Oslo',
    postalCode: '0184',
    addressCountry: 'Norway'
  },
  description:
    'Kartoteket is a studio that creates websites, data visualisations and data driven maps. We specialize in performance, accessibility and SEO',
  email: 'office@kartoteket.as',
  founder: 'Bård I Røtzer, Svale A Fossåskaret',
  foundingDate: '2015-01-01',
  foundingLocation: 'Oslo, Norway',
  image: {
    '@type': 'ImageObject',
    height: '2048',
    url: 'https://kartoteket.as/logo-2048.png',
    width: '2048'
  },
  logo: {
    '@type': 'ImageObject',
    height: '60',
    url: 'https://kartoteket.as/logo-60.png',
    width: '60'
  }
};

export { webSite, organisation };
