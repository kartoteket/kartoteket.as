<template>
  <section class="flex flex-col">
    <header>
      <h1 class="main-header">
        Notes
      </h1>
      <div id="lead" class="rtf md:text-lg leading-relaxed">
        <p>Notes, writings, scribbles. Storytelling</p>
      </div>
    </header>
    <div class="md:flex flex-row-reverse flex-1">
      <aside class="md:w-1/3 xl:w-1/2 self-end mb-16">
        <h2 class="aside-header">
          Citations
        </h2>
        <div class="rtf">
          <p>
            Custom dataset citations
          </p>
        </div>
        <h2 class="aside-header">
          About this website
        </h2>
        <div class="rtf">
          <p>This website is partly an experiment in itself. Read more...</p>
        </div>
      </aside>
      <main class="md:w-2/3 xl:w-1/2 md:pr-8 md:mr-8">
        <article v-for="(entry, index) in tempdata" :key="index" class="mb-16 border-t border-white-500">
          <h1 class="text-2xl mb-2">
            {{ entry.title }}
          </h1>
          <p>
            {{ entry.lead }}
            <a v-if="entry.slug" :href="entry.slug">Read more...</a>
          </p>
        </article>
      </main>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      tempdata: [
        {
          title: '#31dagermeddata / #31daysofdata',
          slug: '/notes/31dagermeddata',
          lead:
            '#31dagermeddata is a simple inhouse experiment. Could we publish one dataviz every day through january 2020? The following is in NORWEAGIN'
        },
        {
          title: '#31dagermeddata / #31daysofdata',
          slug: '/notes/31dagermeddata',
          lead:
            '#31dagermeddata is a simple inhouse experiment. Could we publish one dataviz every day through january 2020? The following is in NORWEAGIN'
        },
        {
          title: '#31dagermeddata / #31daysofdata',
          slug: '/notes/31dagermeddata',
          lead:
            '#31dagermeddata is a simple inhouse experiment. Could we publish one dataviz every day through january 2020? The following is in NORWEAGIN'
        }
      ]
    };
  }
};
</script>
