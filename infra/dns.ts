export const domain =
  {
    production: 'stack.merlijn.site',
    dev: 'stack.dev.merlijn.site',
  }[$app.stage] || `stack.${$app.stage}.merlijn.site`
