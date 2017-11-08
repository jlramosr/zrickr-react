const spaceFactor = 8

module.exports = {
  space: [
    spaceFactor / 2,
    spaceFactor,
    spaceFactor * 2,
    spaceFactor * 3,
    spaceFactor * 4,
    spaceFactor * 5,
    spaceFactor * 6
  ],
  color: {
    base: '#355915',
    light: '#999',
    lightest: '#ccc',
    link: '#B45C00',
    linkHover: '#F57C00',
    border: '#e8e8e8',
    name: '#7f9a44',
    type: '#b77daa',
    error: '#fff',
    baseBackground: '#fff',
    errorBackground: '#c00',
    codeBackground: '#f5f5f5',
    sidebarBackground: '#A0D374'
  },
  fontFamily: {
    base: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Roboto"',
      '"Oxygen"',
      '"Ubuntu"',
      '"Cantarell"',
      '"Fira Sans"',
      '"Droid Sans"',
      '"Helvetica Neue"',
      'sans-serif'
    ],
    monospace: ['Consolas', '"Liberation Mono"', 'Menlo', 'monospace']
  },
  fontSize: {
    base: 15,
    text: 16,
    small: 13,
    h1: 48,
    h2: 36,
    h3: 24,
    h4: 18,
    h5: 16,
    h6: 16
  },
  mq: {
    small: '@media (max-width: 600px)'
  },
  borderRadius: 3,
  maxWidth: 1000,
  sidebarWidth: 200
}