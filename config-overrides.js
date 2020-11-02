const {addLessLoader, override} = require('customize-cra');

module.exports = override(addLessLoader({}));

// module.exports = {
//   // The Webpack config to use when compiling your react app for development or production.
//   webpack: function (config, env) {
//     // ...add your webpack config
//     const {module} = config;
//     return {
//       ...config,
//       module: {
//         ...module,
//         rules: [
//           ...module.rules,
//           {
//             test: /\.(gltf)$/,
//             loader: ['gltf-webpack-loader', 'file-loader'],
//           },
//           {
//             test: /\.less$/,
//             use: [
//               'style-loader',
//               {
//                 loader: 'css-loader',
//                 options: {sourceMap: true},
//               },
//               {
//                 loader: 'less-loader',
//                 options: {
//                   lessOptions: {
//                     sourceMap: true,
//                     javascriptEnabled: true,
//                   },
//                 },
//               },
//             ],
//           },
//         ],
//       },
//     };
//   },
// };
