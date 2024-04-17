<template>
  <gl-card class="gl-mb-4" v-show="shallShow">
    <template v-slot:header>
      <ul
        class="gl-list-style-none gl-m-0 gl-p-0 gl-list-style-position-inside col-list"
      >
        <li>
          Repository:
          <a :href="repository.repository" target="_blank">{{
            repository.name
          }}</a>
        </li>
        <li>
          Managers:
          <gl-badge size="sm" v-for="m in repository.managers">{{
            m
          }}</gl-badge>
        </li>
        <li>Last run: <timeago :timestamp="repository.finishedAt" /></li>
        <li>
          Status: [{{ this.dependencies.length }}] Dependencies, [{{
            this.repository.mergeRequests.length
          }}] MRs
        </li>
        <li>Dependency Dashboard: TODO</li>
      </ul>
    </template>
    <template v-slot>
      <gl-tabs :value="activeTab" @input="(i) => (currentTab = i)">
        <gl-tab title="Dependencies" lazy>
          <table class="dependency-list" v-if="dependencies.length">
            <tbody>
              <dependency-row
                v-for="d in filteredDependencies"
                :dependency="d"
              />
            </tbody>
          </table>
          <p v-else>No dependencies found. There is likely something off...</p>
        </gl-tab>
        <gl-tab title="Latest log" lazy :disabled="searchOn">
          <table class="log-table" v-html="renderedRenovateLog" />
        </gl-tab>
        <gl-tab title="Configuration" lazy :disabled="searchOn">
          <p>
            Config source:
            <a :href="repository.configUrl" target="_blank">{{
              repository.configPath
            }}</a
            ><br />
            Config contents:
          </p>
          <pre>{{ repository.renovateConfig }}</pre>
        </gl-tab>
      </gl-tabs>
    </template>
  </gl-card>
</template>
<script>
import { GlCard, GlBadge, GlTabs, GlTab } from "./gitlab-ui";
import Timeago from "./timeago.vue";
import DependencyRow from "./dependency-row.vue";

function escapeHTML(x) {
  return `${x}`
    ?.replace(/&/g, "&amp;")
    ?.replace(/</g, "&lt;")
    ?.replace(/>/g, "&gt;")
    ?.replace(/"/g, "&quot;")
    ?.replace(/'/g, "&#039;");
}
function escapeLogEntry(logEntry) {
  const { time, msg, level, repository, branch, durationMs, ...rest } =
    logEntry;

  const message = [
    branch ? `(${branch}):` : false,
    msg,
    durationMs ? `(in ${durationMs} ms)` : false,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    level: parseInt(level, 20) > 20 ? escapeHTML(level) : false,
    message: escapeHTML(message),
    time: escapeHTML(time.split("T")?.[1]),
    rest: Object.keys(rest).length
      ? escapeHTML(JSON.stringify(rest, null, 2))
      : false,
  };
}
function renderLogItem(logEntry) {
  const { time, message, level, rest } = escapeLogEntry(logEntry);

  const line = [
    level ? `<tr class="level-${level}">` : "<tr>",
    `<td>${time}</td>`,
    `<td>`,
    rest
      ? `<details><summary>${message}</summary><pre>${rest}</pre></details>`
      : `${message}`,
    `</td></tr>`,
  ];
  return line.join("");
}

function flattenDependencies(managers = {}, mergeRequests = []) {
  return Object.entries(managers).flatMap(([manager, entries]) =>
    entries.flatMap(({ deps = [], ...otherInfo }) =>
      deps.map((dependency) => {
        const ret = {
          ...dependency,
          otherInfo,
          manager,
          status: "success",
        };

        if (dependency.updates?.length) {
          ret.updates = dependency.updates.map((update) => {
            const mr = mergeRequests.find(
              (mr) => mr.source_branch === update.branchName
            );
            return {
              ...update,
              mr,
            };
          });
          ret.status = "upgrade";
        }

        if (dependency.skipReason) {
          ret.status = dependency.skipReason;
        }

        return ret;
      })
    )
  );
}

export default {
  components: {
    DependencyRow,
    Timeago,
    GlCard,
    GlBadge,
    GlTabs,
    GlTab,
  },
  props: {
    repository: {
      required: true,
      type: Object,
    },
  },
  mounted() {
    this.$emit(
      "addManagers",
      this.dependencies.flatMap((x) => x.manager)
    );

    this.$emit(
      "addStatuses",
      this.dependencies.flatMap((x) => x.status)
    );
  },
  data() {
    return {
      currentTab: 0,
    };
  },
  inject: ["searchFn"],
  computed: {
    shallShow() {
      return this.filteredDependencies.length;
    },
    renovateLog() {
      return this.repository.renovateLog.flatMap((entry) => {
        delete entry["hostname"];
        delete entry["pid"];
        delete entry["logContext"];
        delete entry["name"];
        delete entry["v"];
        return entry;
      });
    },
    dependencies() {
      return Object.freeze(
        flattenDependencies(
          this.renovateLog.findLast((x) => {
            return x.repository && x.baseBranch && x.config;
          })?.config || {},
          this.repository.mergeRequests
        )
      );
    },
    filteredDependencies() {
      return this.dependencies.filter(this.searchFn);
    },
    renderedRenovateLog() {
      return this.renovateLog.map(renderLogItem).join("\n");
    },
    job() {
      const { ...job } = this.repository;
      delete job["renovateLog"];
      return job;
    },
    activeTab() {
      return this.searchOn ? 0 : this.currentTab;
    },
  },
};
</script>
