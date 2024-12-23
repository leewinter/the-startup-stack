export const domain =
  {
    production: 'merlijn.site',
    dev: 'dev.merlijn.site',
  }[$app.stage] || `${$app.stage}.merlijn.site`
