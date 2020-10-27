export default async (ctx) => {
  // use this file to load endpoints at app startup
  await Promise.all([
    ctx.store.dispatch("getMMData", {
      resource: ""
    }),
    ctx.store.dispatch("getMMData", {
      resource: "banners"
    })
  ]);
}
