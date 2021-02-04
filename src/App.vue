<template>
  <div id="app">
    <b-navbar shadow :mobile-burger="false" fixed-top>
      <template #brand>
        <img
          src="img/icons/icon.png"
          alt="Hyperlinkr"
          class="navbar-logo ml-2"
        />
        <span class="is-size-3 is-family-primary ml-2">Hyperlinkr</span>
      </template>
    </b-navbar>
    <div class="container">
      <h1 class="is-size-2 mb-4">Link Generator</h1>
      <form class="form mb-6" @submit.prevent="generate">
        <b-field
          position="is-centered"
          grouped
          message="Enter the URL you want to turn into a Hyperlink."
        >
          <b-input placeholder="URL" expanded v-model="url" />
          <p class="control">
            <b-button
              label="Generate"
              type="is-primary"
              native-type="submit"
              :loading="loading"
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
        <div v-if="title && url">
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
          <pre class="has-text-left">
            <code>{{ markdown ? markdown : '' }}</code>
          </pre>
        </section>
      </div>
      <input type="hidden" id="markdown-copy" :value="markdown" />
      <div>
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
          <pre class="has-text-left">
            <code>{{ html ? html : '' }}</code>
          </pre>
        </section>
      </div>
      <input type="hidden" id="html-copy" :value="html" />
    </div>
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
  },
  methods: {
    async generate() {
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
  max-width: 720px;
  margin: 140px auto 0;
  padding: 0 1.5rem;
}

.form {
  max-width: 600px;
  margin: 0 auto;
}

.copy-notification {
  position: fixed !important;
  width: 480px;
  top: 20px;
  right: 20px;
}

.navbar-logo {
  height: 2rem;
}

.navbar-brand {
  align-items: center !important;
}

@media only screen and (max-height: 750px) {
  #app {
    margin: 60px auto 0;
  }
}
</style>
