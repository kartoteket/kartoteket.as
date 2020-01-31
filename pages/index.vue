<template>
  <main class="p-page flex">
    <p class="text-4xl sm:text-2xl lg:text-4xl opacity-90 sm:w-3/4 lg:w-1/2 Xdebug pt-16 lg:pt-32 xl:pt-64">
      Kartoteket is a studio building websites, visualisations and data driven maps.
    </p>
  </main>
</template>
<script>
import { webSite, organisation } from '@/utils/structureddata.js';

export default {
  data() {
    return {
      structuredData: {
        '@context': 'https://schema.org',
        '@graph': [
          webSite,
          organisation,
          {
            '@type': 'WebPage',
            '@id': 'https://kartoteket.as/#webpage',
            url: 'https://kartoteket.as/',
            inLanguage: 'en-US',
            description:
              'Kartoteket is a studio that creates websites, data visualisations and data driven maps. We specialize in performance, accessibility and SEO',
            name: 'Kartoteket',
            mainEntityOfPage: 'https://kartoteket.as/',
            isPartOf: {
              '@id': 'https://kartoteket.as/#website'
            },
            author: {
              '@id': 'https://kartoteket.as/#identity'
            },
            creator: {
              '@id': 'https://kartoteket.as/#identity'
            },
            copyrightHolder: {
              '@id': 'https://kartoteket.as/#identity'
            },
            datePublished: '2020-01-30T11:33:41.350Z',
            dateModified: '2020-01-30T11:33:41.350Z'
          },
          {
            '@type': 'BreadcrumbList',
            description: 'Breadcrumbs list',
            itemListElement: [
              {
                '@type': 'ListItem',
                item: 'https://kartoteket.as/',
                name: 'Homepage',
                position: 1
              }
            ],
            name: 'Breadcrumbs'
          }
        ]
      }
    };
  },
  head() {
    return {
      __dangerouslyDisableSanitizers: ['script'],
      script: [
        {
          innerHTML: JSON.stringify(this.structuredData),
          type: 'application/ld+json'
        }
      ]
    };
  }
};
</script>
