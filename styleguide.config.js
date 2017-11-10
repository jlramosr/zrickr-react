const theme = require('./docs/theme')
const path = require('path')

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
  showUsage: true/*,
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'docs/wrapper')
  },
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader?modules'
        },
        {
          test: /\.svg$/,
          loader: 'url-loader'
        }
      ]
    }
  }*/
}