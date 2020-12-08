<template>
  <div class="m-container">
    <mlist></mlist>
    <player></player>
  </div>
</template>

<script>
// import { ref, onMounted } from 'vue'
import mlist from '@/components/m-list.vue'
import player from '@/components/player.vue'

export default {
  setup() {
    return {}
  },
  components: {
    mlist,
    player
  },
  methods: {
    show() {
      this.$refs.loading.show()
    },
    hide() {
      this.$refs.loading.hide()
    }
  }
}
</script>
