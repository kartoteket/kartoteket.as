import sanityClient from '@sanity/client';

const client = sanityClient({
  projectId: 'kqscd500', // string, required
  dataset: 'production', // string, required
  token: '', // or leave blank to be anonymous user
  useCdn: true // `false` if you want to ensure fresh data
});
const query = '*[_type in ["note", "citation"]]{_type,slug}';

// Dynamicly generate routes
export default async function routes() {
  const result = await client.fetch(query);
  const routes = result
    .filter(d => Object.prototype.hasOwnProperty.call(d, 'slug'))
    .map(d => `/${d._type}s/${d.slug.current}`);

  // @todo: Should I attach a payload ?
  // const payloadRoutes = data.map((c, i, a) => {
  //   const payload = {
  //     entry
  //   }
  //   return {
  //     route: `/notes/${c.id}`,
  //     payload
  //   }
  // })

  return routes;
  //  return routesSet1.concat(routesSet12)
}
