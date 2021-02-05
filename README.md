# Hyperlinkr

[![Netlify Status](https://api.netlify.com/api/v1/badges/7d0d1761-3ce8-4ca1-b133-3cdfe31cd5ab/deploy-status)](https://app.netlify.com/sites/hyperlinkr/deploys)
![Vue Version](https://img.shields.io/badge/Vue-2.6.11-brightgreen?style=flat&logo=vue.js)
![Buefy Version](https://img.shields.io/badge/Buefy-0.9.0-7957D5?style=flat&logo=buefy)

A Vue-based PWA to generate markdown and HTML hyperlinks. See it in action [here](https://hyperlinkr.netlify.app/).

## What does it do?

Hyperlinkr is a web app and PWA that uses the [Url Metadata API](https://url-metadata.herokuapp.com/) to fetch open graph or meta titles from a given URL and convert those inputs to markdown or HTML hyperlinks. This includes escaping special characters that might interfere with the output and the option to override the title manually.

Hyperlinkr polls your clipboard for changes, and allows you to quickly and intuitively paste URLs that you copied elsewhere, and also makes use of PWA `share_target`s so that you can share a web page and directly generate hyperlinks from them.

It's designed to be simply and friendly to use, and supports dark mode for night-time users.

## Why did I make this?

I'm constantly sharing links on sites which support markdown, or even while creating this README I had to insert multiple hyperlinks. More often than not, all I need is the site title for the text. This is data readily available to browser APIs and especially on mobile, copying the title can be a pain in certain scenarios. Reddit, for instance. With Hyperlinkr I can simply share the post to the PWA, retrieve the hyperlink and get on with my day.

© 2021, RaviAnand M.
