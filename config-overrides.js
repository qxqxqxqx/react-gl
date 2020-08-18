module.exports = {
  // The Webpack config to use when compiling your react app for development or production.
  webpack: function (config, env) {
    // ...add your webpack config
    const {module} = config;
    return {
      ...config,
      module: {
        ...module,
        rules: [
          ...module.rules,
          {
            test: /\.(gltf)$/,
            loader: ['gltf-webpack-loader', 'file-loader'],
          }
        ],
      },
    };
  },
};
