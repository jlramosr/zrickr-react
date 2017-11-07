const path = require('path')

module.exports = {
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
  ]
  /*styleguideComponents: {
    Wrapper: path.join(__dirname, 'styleguide.wrapper')
  }*/
}