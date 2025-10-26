module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.jsx', '.js', '.json'],
        alias: {
          '@utils': './src/utility',
          '@apis': './src/constants/apis',
          '@constants': './src/constants',
          '@containers': './src/containers',
          '@components': './src/components',
          '@reuseableComponents': './src/reuseableComponents',
          '@reuseableFuntions': './src/reuseableFuntions',
          '@actionTypes': './src/actions/ActionTypes',
          '@serviceAction': './src/actions/ServiceAction',
          '@contexts': './src/contexts',
          '@services': './src/services',
          '@nav': './src/services/NavigationService',
          '@theme': './src/theme',
          '@hoc': './src/hoc',
          '@customHooks': './src/customHooks',
          '@multipicker': './src/services/MultipickerUtils',
          "@serviceManager": "./src/services/HttpServiceManager"

        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
