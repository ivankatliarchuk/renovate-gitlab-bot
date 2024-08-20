<template>
  <form class="gl-mb-4">
    <input placeholder="Search" v-model.trim="searchString" />
    <gl-token-selector
      placeholder="Dependency managers"
      :dropdown-items="managerDropdownItems"
      v-model="managers"
    />
    <gl-token-selector
      placeholder="Statuses"
      :dropdown-items="statusDropdownItems"
      v-model="statuses"
    />
  </form>
  <repository-status
    v-for="r in repositories"
    :repository="r"
    @addManagers="addManagers"
    @addStatuses="addStatuses"
  />
</template>
<script>
import { computed } from "vue";
import { GlTokenSelector } from "./components/gitlab-ui.js";
import RepositoryStatus from "./components/repository-status.vue";
export default {
  components: {
    GlTokenSelector,
    RepositoryStatus,
  },
  provide() {
    // use function syntax so that we can access `this`
    return {
      searchOn: computed(() => {
        return !this.showAll;
      }),
      searchFn: computed(() => {
        if (this.showAll) {
          return () => true;
        }
        const searchString = this.searchString.toLocaleLowerCase();
        const managers = this.managers.map((x) => x.id);
        const statuses = this.statuses.map((x) => x.id);

        return (dependency) => {
          if (
            searchString &&
            !dependency?.depName?.toLocaleLowerCase()?.includes(searchString)
          ) {
            return false;
          }

          if (managers.length && !managers.includes(dependency.manager)) {
            return false;
          }

          if (statuses.length && !statuses.includes(dependency.status)) {
            return false;
          }

          return true;
        };
      }),
    };
  },
  data() {
    return {
      searchString: "",
      managers: [],
      statuses: [],
      allManagers: {},
      allStatuses: {},
      repositories: [],
    };
  },
  props: {
    dataPromise: {
      required: true,
      type: Promise,
    },
  },
  async created() {
    const url = new URL(window.location.href);
    this.searchString = url.searchParams.get("search") || "";
    this.repositories = await this.dataPromise;
  },
  mounted() {
    performance.mark("mountEnd");
    console.log(performance.measure("mountedCycle", "mountStart", "mountEnd"));
  },
  beforeUpdate() {
    performance.mark("updateStart");
  },
  updated() {
    performance.mark("updateEnd");
    console.log(performance.measure("renderCycle", "updateStart", "updateEnd"));
    console.log(performance.measure("rendered", "mountStart", "updateEnd"));
  },
  beforeMount() {
    performance.mark("mountStart");
  },
  watch: {
    searchString() {
      const url = new URL(window.location.href);
      if (this.searchString) {
        url.searchParams.set("search", this.searchString);
      } else {
        url.searchParams.delete("search");
      }
      history.replaceState({}, "", url.href);
    },
  },
  computed: {
    showAll() {
      return !Boolean(
        this.searchString.length || this.managers.length || this.statuses.length
      );
    },
    managerDropdownItems() {
      return Object.entries(this.allManagers).map(([name, value]) => {
        return { id: name, name: `${name} (${value})` };
      });
    },
    statusDropdownItems() {
      return Object.entries(this.allStatuses).map(([name, value]) => {
        return { id: name, name: `${name} (${value})` };
      });
    },
  },
  methods: {
    addManagers(managers) {
      for (const m of managers) {
        this.allManagers[m] ||= 0;
        this.allManagers[m] += 1;
      }
    },
    addStatuses(managers) {
      for (const m of managers) {
        this.allStatuses[m] ||= 0;
        this.allStatuses[m] += 1;
      }
    },
  },
};
</script>
