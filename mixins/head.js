export default {
  head() {
    return {
      title: this.page.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.page.description
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.page.title
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.page.description
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: this.page.url
        }
      ],
      script: [
        {
          type: 'application/ld+json',
          json: this.structuredData
        }
      ]
    };
  }
};
