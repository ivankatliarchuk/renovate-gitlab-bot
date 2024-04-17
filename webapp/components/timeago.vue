<template>
  <abbr :title="timestamp"
    ><time :datetime="timestamp">{{ minAgo }}</time></abbr
  >
</template>
<script>
import { minAgo } from "../lib/timeago.js";

export default {
  props: {
    timestamp: {
      type: String,
      required: true,
    },
  },
  computed: {
    minAgo() {
      return minAgo(new Date(this.timestamp));
    },
  },
};
</script>
