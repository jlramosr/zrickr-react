const theme = require('./docs/theme')

module.exports = {
  theme,
  title: 'TinyERP Style Guide',
  sections: [
    {
      name: 'Introduction',
      content: 'docs/introduction.md'
    },
    {
      name: 'UI Components',
      content: 'docs/components.md',
      components: 'src/components/**/*.js'
    },
    {
      name: 'Actions',
      content: 'docs/actions.md',
      components: 'src/actions/*.js'
    }
  ],
  showUsage: true
  /*styleguideComponents: {
    Wrapper: 'docs/wrapper'
  }*/
}