<template>
  <div id="app">
    <nav
      role="navigation"
      aria-label="main navigation"
      class="navbar is-fixed-top has-shadow"
    >
      <div class="navbar-brand">
        <img
          src="img/icons/icon.png"
          alt="Hyperlinkr"
          class="navbar-logo ml-2"
        />
        <span class="is-size-3 is-family-primary ml-2">Hyperlinkr</span>
      </div>
    </nav>
    <div class="container">
      <h1 class="is-size-2 mb-4">Generate Hyperlinks</h1>
      <form class="form mb-6" @submit.prevent="generate">
        <b-field
          :type="!url || urlValid ? 'is-light' : 'is-danger'"
          position="is-centered"
          grouped
          message="Enter the URL you want to turn into a Hyperlink."
        >
          <div class="control is-expanded input-container">
            <b-input placeholder="URL" v-model="url" type="url" />
            <b-button
              icon-left="content-paste"
              :class="['paste-clipboard-button', !clipboardText && 'hide']"
              type="is-light"
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
        <b-field>
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
        <div v-else>Please enter a URL to be converted to a hyperlink.</div>
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
          >
            Copy
          </b-button>
        </div>
        <section>
          <pre
            class="has-text-left"
          ><code>{{ markdown ? markdown : '' }}</code></pre>
        </section>
      </div>
      <input type="hidden" id="markdown-copy" :value="markdown" />
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
          >
            Copy
          </b-button>
        </div>
        <section>
          <pre class="has-text-left"><code>{{ html ? html : '' }}</code></pre>
        </section>
      </div>
      <input type="hidden" id="html-copy" :value="html" />
      <div class="mb-4">
        <p class="is-size-4">What is Hyperlinkr?</p>
        <p class="has-text-grey">
          Hyperlinkr is a simple, Vue-based PWA that uses the
          <a href="https://url-metadata.herokuapp.com/">Url Metadata API</a>
          under the hood to generate hyperlinks using the page title as the
          text.
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
        </p>
      </div>
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
            <b-button icon-left="content-copy" @click="copyHtml" class="mr-2">
              Copy HTML
            </b-button>
            <b-button icon-left="content-copy" @click="copyMarkdown">
              Copy Markdown
            </b-button>
          </div>
          <div v-else-if="clipboardText" class="buttons">
            <b-button icon-left="content-copy" @click="paste">
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

export default {
  name: "App",
  mixins: [update],
  data: function () {
    return {
      url: "",
      title: "",
      loading: false,
      clipboardText: "",
      lastClipboardText: "",
      clipboardInterval: null,
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
        `[${this.title}](${this.url})`
      );
    },
    urlValid() {
      return this.validURL(this.url);
    },
    canCopy() {
      return this.title && this.url && this.urlValid;
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
          `https://url-metadata.herokuapp.com/api/metadata?url=${this.url}`,
        );
        this.title = res.data.data.title;
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
  color: #2c3e50;
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
    display: block !important;

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

@media only screen and (max-height: 750px) {
  .container {
    margin: 60px auto 0 !important;
  }
}
</style>
