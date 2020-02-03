const rootUrl = 'https://kartoteket.as/';

const webSite = {
  '@type': 'WebSite',
  '@id': `${rootUrl}#website`,
  url: rootUrl,
  name: 'Kartoteket'
};

const organisation = {
  '@type': 'Organization',
  '@id': `${rootUrl}#identity`,
  name: 'Kartoteket',
  alternateName: '3by5',
  url: rootUrl,
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
    url: `${rootUrl}logo-2048.png`,
    width: '2048'
  },
  logo: {
    '@type': 'ImageObject',
    height: '60',
    url: `${rootUrl}logo-60.png`,
    width: '60'
  }
};

const webPage = ({
  url = rootUrl,
  name = 'Kartoteket',
  description = '',
  main = ''
}) => {
  return {
    '@type': 'WebPage',
    '@id': `${rootUrl}#webpage`,
    inLanguage: 'en-US',
    url,
    description,
    name,
    mainEntityOfPage: main,
    isPartOf: {
      '@id': `${rootUrl}#website`
    },
    author: {
      '@id': `${rootUrl}#identity`
    },
    creator: {
      '@id': `${rootUrl}#identity`
    },
    copyrightHolder: {
      '@id': `${rootUrl}#identity`
    },
    datePublished: new Date(),
    dateModified: new Date()
  };
};

const breadCrumbs = crumbs => {
  const itemListElement = crumbs.map((item, index) => {
    return {
      '@type': 'ListItem',
      position: index + 1,
      item: {
        name: item[0],
        '@id': rootUrl + item[1]
      }
    };
  });
  return {
    '@type': 'BreadcrumbList',
    name: 'Breadcrumbs',
    description: 'Breadcrumbs list',
    itemListElement
  };
};

export { webSite, organisation, webPage, breadCrumbs };
