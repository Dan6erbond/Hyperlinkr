export default {
  data() {
    return {
      darkMode: true,
    };
  },
  watch: {
    darkMode: {
      immediate: true,
      handler(to, from) {
        if (to) {
          document.body.classList.add("dark");
          if (from !== undefined) {
            localStorage.setItem("theme", "dark");
          }
        } else {
          document.body.classList.remove("dark");
          if (from !== undefined) {
            localStorage.setItem("theme", "light");
          }
        }
      },
    },
  },
  mounted() {
    const theme = localStorage.getItem("theme");

    if (theme === "light") {
      this.darkMode = false;
    } else if (!theme) {
      const userPrefersLight =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: light)").matches;

      if (userPrefersLight) {
        this.darkMode = false;
      } else {
        this.darkMode = true;
      }
    }
  },
};
