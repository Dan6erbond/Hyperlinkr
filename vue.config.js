module.exports = {
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "Hyperlinkr";
      args[0].description =
        "A simple web app to generate markdown and HTML hyperlinks using source metadata.";
      return args;
    });
  },
  pwa: {
    manifestOptions: {
      name: "Hyperlinkr",
      short_name: "Hyperlinkr",
      theme_color: "#00c4a7",
      background_color: "#363636",
      display: "standalone",
      scope: "/",
      start_url: "/",
      icons: [
        {
          src: "img/icons/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "img/icons/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      share_target: {
        action: "/index.html",
        params: {
          title: "title",
          text: "url",
        },
      },
    },
    themeColor: "#00c4a7",
    msTileColor: "#363636",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "#363636",
    iconPaths: {
      favicon32: "img/icons/favicon-32x32.png",
      favicon16: "img/icons/favicon-16x16.png",
      appleTouchIcon: "img/icons/apple-touch-icon.png",
      maskicon: null,
      msTileImage: "img/icons/mstile-150x150.png",
    },
    // configure the workbox plugin
    workboxPluginMode: "GenerateSW",
  },
};
