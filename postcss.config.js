module.exports = {
  map: true,
  plugins: [
    require('autoprefixer')({
      remove: false
    }),
    require('css-mqpacker')({
      sort: require('css-mqpacker-sort-mediaqueries')
    }),
    require('cssnano')({
      preset: [
        'default',
        {
          zindex: false
        }
      ]
    })
  ]
};
