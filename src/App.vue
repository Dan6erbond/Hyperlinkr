<template>
  <div id="app">
    <nav
      role="navigation"
      aria-label="main navigation"
      class="navbar is-fixed-top has-shadow"
    >
      <div class="navbar-brand">
        <img
          src="/img/icons/icon.png"
          alt="Hyperlinkr"
          class="navbar-logo ml-4"
        />
        <span class="is-size-3 is-family-primary ml-2">Hyperlinkr</span>
      </div>
      <div class="navbar-menu">
        <div class="navbar-end is-align-items-center">
          <b-button
            :type="darkMode ? 'is-dark' : 'is-text'"
            size="is-medium"
            @click="darkMode = !darkMode"
            :icon-left="darkMode ? 'brightness-5' : 'brightness-7'"
            class="mr-2"
          />
        </div>
      </div>
    </nav>
    <div class="container">
      <h1 class="is-size-2 mb-4">Generate Hyperlinks</h1>
      <form class="form mb-6" @submit.prevent="generate">
        <b-field
          :type="
            !url || urlValid ? (darkMode ? 'is-dark' : 'is-light') : 'is-danger'
          "
          position="is-centered"
          grouped
          message="Enter the URL you want to turn into a Hyperlink."
        >
          <div class="control is-expanded input-container">
            <b-input placeholder="URL" v-model="url" type="url" />
            <b-button
              icon-left="content-paste"
              :class="['paste-clipboard-button', !clipboardText && 'hide']"
              :type="darkMode ? 'is-dark' : 'is-light'"
              @click="paste"
            >
              Paste Text From Clipboard
            </b-button>
          </div>
          <p class="control">
            <b-button
              label="Generate"
              type="is-primary"
              native-type="submit"
              :loading="loading"
              :disabled="url && !validURL"
            />
          </p>
        </b-field>
        <b-field :type="darkMode ? 'is-dark' : 'is-light'">
          <b-input
            placeholder="Title"
            v-model="title"
            v-if="url"
            :disabled="loading"
          />
        </b-field>
      </form>
      <div class="mb-6">
        <p class="is-size-4">Preview</p>
        <div v-if="canCopy">
          <div class="box">
            <a :href="url">{{ title }}</a>
          </div>
          <p class="has-text-grey">
            Your hyperlink will appear like this on platforms which support
            markdown or HTML syntax.
          </p>
        </div>
        <div v-else>
          <p :class="[darkMode && 'has-text-grey']">
            Please enter a URL to be converted to a hyperlink.
          </p>
        </div>
      </div>
      <div class="mb-4">
        <div
          class="is-flex is-justify-content-space-between is-align-items-baseline"
        >
          <p class="is-size-4">Markdown</p>
          <b-button
            size="is-small"
            icon-left="content-copy"
            @click="copyMarkdown"
            :disabled="!markdown"
            :type="darkMode ? 'is-dark' : 'is-light'"
          >
            Copy
          </b-button>
        </div>
        <b-input
          type="textarea"
          :rows="1"
          readonly
          v-model="markdown"
          custom-class="is-family-monospace has-fixed-size"
        />
        <input type="hidden" id="markdown-copy" :value="markdown" />
      </div>
      <div class="mb-6">
        <div
          class="is-flex is-justify-content-space-between is-align-items-baseline"
        >
          <p class="is-size-4">HTML</p>
          <b-button
            size="is-small"
            icon-left="content-copy"
            @click="copyHtml"
            :disabled="!html"
            :type="darkMode ? 'is-dark' : 'is-light'"
          >
            Copy
          </b-button>
        </div>
        <b-input
          type="textarea"
          :rows="1"
          readonly
          v-model="html"
          custom-class="is-family-monospace has-fixed-size"
        />
        <input type="hidden" id="html-copy" :value="html" />
      </div>
      <section>
        <p class="is-size-4">What is Hyperlinkr?</p>
        <p class="has-text-grey">
          Hyperlinkr is a simple, Vue-based PWA that uses a custom Netlify
          function under the hood to generate hyperlinks using the page title as
          the text.
          <br />
          <br />
          It supports directly pasting URLs from your clipboard if they are
          valid URLs, and in cases where URLs cannot be parsed by the API the
          title input field allows you to customize your markdown/HTML output.
          <br />
          <br />
          Outputs are generated as markdown (GitHub, Reddit, etc. flavor) as
          well as HTML anchor tags, and can directly be copied to your clipboard
          using the convenient buttons above the raw output.
          <br />
          <br />
          &#169; 2021, RaviAnand M.
          <br />
          <a href="https://ravianand.web.app" target="_blank">My Website</a>
          <br />
          <a href="https://github.com/Dan6erbond/Hyperlinkr" target="_blank">
            GitHub Repository
          </a>
          <b-button type="is-link" @click="showStats = !showStats">
            Stats for Nerds
          </b-button>
        </p>
        <pre v-if="showStats" class="has-text-left">{{ stats }}</pre>
      </section>
    </div>
    <nav
      role="navigation"
      aria-label="action-buttons"
      class="navbar is-hidden-desktop bottom-nav is-fixed-bottom"
      v-if="clipboardText || canCopy"
    >
      <div class="navbar-menu">
        <div class="navbar-start">
          <div v-if="canCopy" class="buttons">
            <b-button
              icon-left="content-copy"
              @click="copyHtml"
              class="mr-2"
              :type="darkMode ? 'is-dark' : 'is-light'"
            >
              Copy HTML
            </b-button>
            <b-button
              icon-left="content-copy"
              @click="copyMarkdown"
              :type="darkMode ? 'is-dark' : 'is-light'"
            >
              Copy Markdown
            </b-button>
          </div>
          <div v-else-if="clipboardText" class="buttons">
            <b-button
              icon-left="content-copy"
              @click="paste"
              :type="darkMode ? 'is-dark' : 'is-light'"
            >
              Paste Text From Clipboard
            </b-button>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import update from "./mixins/update";
import darkMode from "./mixins/darkMode";

export default {
  name: "App",
  mixins: [update, darkMode],
  data() {
    return {
      url: "",
      title: "",
      loading: false,
      clipboardText: "",
      lastClipboardText: "",
      clipboardInterval: null,
      showStats: false,
      href: "",
      metadata: null,
    };
  },
  watch: {
    updateExists(newVal) {
      if (newVal) {
        this.$buefy.snackbar.open({
          message: "An app update is available.",
          actionText: "Update",
          onAction: () => {
            this.refreshApp();
          },
        });
      }
    },
  },
  computed: {
    html() {
      return (
        this.url &&
        this.title &&
        !this.loading &&
        `<a href="${this.url}">${this.title}</a>`
      );
    },
    markdown() {
      return (
        this.url &&
        this.title &&
        !this.loading &&
        `[${this.title.replace(/(\[|\])/g, "\\$1")}](${this.url.replace(
          /(\(|\))/g,
          "\\$1",
        )})`
      );
    },
    urlValid() {
      return this.validURL(this.url);
    },
    canCopy() {
      return this.title && this.url && this.urlValid;
    },
    stats() {
      return {
        href: this.href,
        metadata: this.metadata,
        urlValid: this.urlValid,
      };
    },
  },
  methods: {
    async generate() {
      if (!this.urlValid) {
        return;
      }

      this.loading = true;
      try {
        const res = await this.$axios(
          `https://hyperlinkr.netlify.app/.netlify/functions/metadata?url=${this.url}`,
        );
        this.title = res.data.title;
        this.metadata = res.data;
      } catch (e) {
        console.error(e);
      }
      this.loading = false;
    },
    copyHtml() {
      const copyElm = document.querySelector("#html-copy");
      copyElm.setAttribute("type", "text");
      copyElm.select();
      try {
        const successful = document.execCommand("copy");
        if (successful) {
          this.$buefy.toast.open({
            message: "Successfully copied HTML hyperlink to clipboard!",
            type: "is-success",
          });
        } else {
          this.$buefy.toast.open({
            message: "Error copying HTML hyperlink to clipboard.",
            type: "is-danger",
          });
        }
      } catch (err) {
        console.error("Oops, unable to copy");
      }

      copyElm.setAttribute("type", "hidden");
      window.getSelection().removeAllRanges();
    },
    copyMarkdown() {
      const copyElm = document.querySelector("#markdown-copy");
      copyElm.setAttribute("type", "text");
      copyElm.select();
      try {
        const successful = document.execCommand("copy");
        if (successful) {
          this.$buefy.toast.open({
            message: "Successfully copied markdown hyperlink to clipboard!",
            type: "is-success",
          });
        } else {
          this.$buefy.toast.open({
            message: "Error copying markdown hyperlink to clipboard.",
            type: "is-danger",
          });
        }
      } catch (err) {
        console.error("Oops, unable to copy");
      }

      copyElm.setAttribute("type", "hidden");
      window.getSelection().removeAllRanges();
    },
    paste() {
      this.url = this.clipboardText;
      this.lastClipboardText = this.clipboardText;
      this.clipboardText = "";
      this.generate();
    },
    validURL(str) {
      const pattern = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
          "(\\#[-a-z\\d_]*)?$",
        "i", // fragment locator
      );
      return !!pattern.test(str);
    },
  },
  mounted() {
    navigator.permissions.query({ name: "clipboard-read" }).then((result) => {
      if (result.state === "granted" || result.state === "prompt") {
        const interval = setInterval(() => {
          navigator.clipboard
            .readText()
            .then((text) => {
              if (
                text !== this.clipboardText &&
                text !== this.lastClipboardText &&
                this.validURL(text) &&
                text !== this.url
              ) {
                this.clipboardText = text;
              }
            })
            .catch(console.warn);
        }, 500);
        this.clipboardInterval = interval;
      }
    });

    const params = new URLSearchParams(window.location.search);
    const url = params.get("url");
    const title = params.get("title");
    if (url) {
      this.url = url;
      if (title) {
        this.title = title;
      } else {
        this.generate();
      }
    }

    this.href = window.location.href;
  },
  beforeDestroy() {
    this.clipboardInterval && clearInterval(this.clipboardInterval);
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

html {
  background-color: transparent !important;
}

body {
  min-height: 100vh;
  color: #2c3e50;
  padding-top: 40px !important;
  padding-bottom: 80px !important;

  &.dark {
    background-color: #191a1c;
    color: white !important;

    .navbar {
      background-color: #191a1c !important;
      box-shadow: 0 2px 0 0 #131414 !important;

      .navbar-logo {
        filter: invert(1);
      }

      .navbar-menu {
        background-color: #191a1c !important;
      }
    }

    .box {
      background-color: #2f2f2f;
    }

    textarea,
    pre {
      background-color: #2f2f2f !important;
      color: #c7c7c7 !important;
    }

    .help.is-dark {
      color: #c7c7c7;
    }

    .input.is-dark {
      background-color: #2f2f2f;
      color: white;

      &::placeholder {
        /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: #c7c7c7;
      }

      &:-ms-input-placeholder {
        /* Internet Explorer 10-11 */
        color: #c7c7c7;
      }
    }
  }
}

.button {
  &:focus {
    box-shadow: none !important;
  }

  &.is-link {
    color: #3273dc !important;
    margin: auto !important;
    padding: 0 !important;
    display: block !important;
    text-align: center;
    background: none !important;
    height: auto !important;

    & > span {
      font-size: 1em;
      font-weight: 400 !important;
      line-height: 1.5;
    }

    &:hover {
      color: #363636 !important;
    }
  }
}

.container {
  max-width: 720px !important;
  margin: 140px auto 0 !important;
  padding: 0 1.5rem !important;
}

.form {
  max-width: 600px;
  margin: 0 auto;
}

.navbar {
  display: flex;
  justify-content: space-between;

  .navbar-menu {
    display: block !important;
    box-shadow: none !important;
  }
}

.navbar-logo {
  height: 2rem;
}

.navbar-brand {
  align-items: center !important;
}

.input-container {
  position: relative;

  .paste-clipboard-button {
    position: absolute;
    min-width: 100%;
    left: 0;
    margin-top: 2px;
    justify-content: start;
    opacity: 1;
    transition: all ease-in-out 230ms;
    z-index: 50;

    &.hide {
      opacity: 0;
      margin-top: -2px;
    }
  }
}

.bottom-nav {
  display: flex;
  padding: 1rem;

  .navbar-brand {
    display: none;
  }

  .navbar-menu {
    padding: 0;
    box-shadow: none;
    flex: 1;

    .navbar-start {
      .buttons {
        display: flex;

        .button {
          margin: 0;
          flex: 1;
        }
      }
    }
  }
}

textarea {
  box-shadow: none !important;
  border: none !important;
  border-radius: 0 !important;
  background-color: whitesmoke !important;
  font-size: 0.875em !important;
  padding: 1.25rem 1.5rem !important;
}

@media only screen and (max-height: 750px) {
  .container {
    margin: 60px auto 0 !important;
  }
}
</style>
