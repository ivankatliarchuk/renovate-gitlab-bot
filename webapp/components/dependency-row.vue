<template>
  <tr class="dependency-entry">
    <td><gl-icon :size="16" :name="statusIcon" /></td>
    <td>{{ dependency.manager }}</td>
    <td>{{ dependency.depName }}</td>
    <td>{{ dependency.currentVersion }}</td>
    <td class="update-info">
      <span v-if="dependency?.updates?.length" v-for="u in dependency.updates">
        {{ u.updateType }}
        &rarrb; {{ u.newVersion }}
        <span v-if="u.mr"
          >&middot; MR:
          <a :href="u.mr.web_url">{{ u.mr.reference }}</a>
          <br />
        </span>
      </span>
    </td>
    <td>
      <details>
        <pre>{{ dependency }}</pre>
      </details>
    </td>
  </tr>
</template>
<script>
import { GlIcon } from "./gitlab-ui";
export default {
  components: { GlIcon },
  props: {
    dependency: {
      type: Object,
      required: true,
    },
  },
  computed: {
    statusIcon() {
      switch (this.dependency.status) {
        case "success":
          return "status_success";
        case "upgrade":
          return "upgrade";
        case "disabled":
          return "status_canceled";
        default:
          return "status_skipped";
      }
    },
  },
};
</script>
