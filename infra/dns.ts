export const domain =
  {
    production: 'sivir.tech',
    dev: 'dev.sivir.tech',
  }[$app.stage] || `${$app.stage}.sivir.tech`

// export const zone = cloudflare.getZoneOutput({
//   name: 'sivir.tech',
// })
