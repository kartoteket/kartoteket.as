<template>
  <main class="md:w-2/3">
    <h1 class="main-header">
      Contact us
    </h1>
    <div class="lg:flex justify-between">
      <article itemscope itemtype="http://schema.org/Organization" class="mb-8 mr-8">
        <h1 class="text-lg mb-2 border-b border-white-500">
          <a itemprop="url" href="http://kartoteket.as"><span itemprop="name">Kartoteket AS</span></a>
        </h1>
        <ul class="mb-4">
          <li>
            Email: <a href="mailto:office@kartoteket.as" itemprop="email">office@kartoteket.as</a><br>
          </li>
          <li itemprop="telephone">
            Phone: +47 991 62 147
          </li>
        </ul>
        <ul>
          <li>
            Github: <a itemprop="sameAs" class="link" href="https://github.com/kartoteket">kartoteket</a>
          </li>
          <li class="mb-4">
            Observable: <a itemprop="sameAs" class="link" href="https://observablehq.com/@kartoteket/">kartoteket</a>
          </li>
          <li>
            Twitter: <a itemprop="sameAs" class="link" href="https://twitter.com/3x5Kartoteket">3x5Kartoteket</a>
          </li>
        </ul>
      </article>
      <article itemscope itemtype="http://schema.org/Person" class="mb-8 mr-8">
        <h1 itemprop="name" class="text-lg mb-2 border-b border-white-500">
          Bård I. Røtzer
        </h1>
        <ul class="mb-4">
          <li itemprop="email">
            Email: <a class="link" href="mailto:bard@kartoteket.as">bard@kartoteket.as</a>
          </li>
          <li itemprop="telephone">
            Phone: +47 404 53 445
          </li>
        </ul>
        <ul>
          <li>
            Github: <a itemprop="sameAs" class="link" href="https://github.com/bardrotzer">bardrotzer</a>
          </li>
          <li class="mb-4">
            Observable: <a itemprop="sameAs" class="link" href="https://observablehq.com/@bardrotzer/">bardrotzer</a>
          </li>
          <li>
            LinkedIn: <a itemprop="sameAs" class="link" href="https://www.linkedin.com/in/bardrotzer/">bardrotzer</a>
          </li>
        </ul>
      </article>
      <article class="mr-8">
        <h1 itemprop="name" class="text-lg mb-2 border-b border-white-500">
          Svale A. Fossåskaret
        </h1>
        <ul class="mb-4">
          <li itemprop="email">
            Email: <a class="link" href="mailto:svale@kartoteket.as">svale@kartoteket.as</a>
          </li>
          <li itemprop="telephone">
            Phone: +47 991 62 147
          </li>
        </ul>
        <ul>
          <li>
            Github: <a itemprop="sameAs" class="link" href="https://github.com/svale">svale</a>
          </li>
          <li class="mb-4">
            Observable: <a itemprop="sameAs" class="link" href="https://observablehq.com/@svale/">svale</a>
          </li>
          <li>
            LinkedIn: <a itemprop="sameAs" class="link" href="https://www.linkedin.com/in/svalef/">svalef</a>
          </li>
          <li>
            Twitter: <a itemprop="sameAs" class="link" href="https://twitter.com/fossesvale">@Fossesvale</a>
          </li>
        </ul>
      </article>
    </div>
  </main>
</template>
<script>
import head from '~/mixins/head.js';
import {
  webSite,
  organisation,
  webPage,
  breadCrumbs
} from '@/utils/structureddata.js';

export default {
  mixins: [head],
  data() {
    return {
      page: {
        title: 'Contact Us',
        slug: 'contact',
        description:
          'Please contact us for any projects on websites, data visualisations and data driven maps. Or a chat.',
        url: `https://kartoteket.as/contact`
      }
    };
  },
  computed: {
    structuredData() {
      return {
        '@context': 'https://schema.org',
        '@graph': [
          webSite,
          organisation,
          webPage({
            url: this.page.url,
            name: this.page.title,
            description: this.page.description,
            main: this.page.url
          }),
          {
            '@context': 'https://schema.org/',
            '@type': 'Person',
            name: 'Svale A. Fossåskaret',
            url: 'https://kartoteket.as',
            image: '',
            sameAs: [
              'https://twitter.com/fossesvale',
              'https://www.linkedin.com/in/svalef/',
              'https://github.com/svale',
              'https://observablehq.com/@svale/'
            ],
            jobTitle: 'Developer',
            worksFor: {
              '@id': 'https://kartoteket.as/#identity'
            }
          },
          {
            '@context': 'https://schema.org/',
            '@type': 'Person',
            name: 'Bård I. Røtzer',
            url: 'https://kartoteket.as',
            image: '',
            sameAs: [
              'https://github.com/bardrotzer',
              'https://observablehq.com/@bardrotzer/',
              'https://www.linkedin.com/in/bardrotzer/'
            ],
            jobTitle: 'Developer',
            worksFor: {
              '@id': 'https://kartoteket.as/#identity'
            }
          },
          breadCrumbs([['Homepage', ''], [this.page.title, this.page.slug]])
        ]
      };
    }
  }
};
</script>
