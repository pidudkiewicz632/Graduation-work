module.exports = {
  pages: {
    login: {
      entry: 'src/views/login/main.js',
      template: 'public/index.html',
      title: 'CashFriends',
      chunks: ['chunk-vendors', 'chunk-common', 'login'],
    },
    index: {
      entry: 'src/views/home/main.js',
      template: 'public/index.html',
      title: 'CashFriends',
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
  },
};
