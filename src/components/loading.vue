<template>
  <div v-if="isShow" class="loading">
    <p>{{ loadText }}</p>
  </div>
</template>
<script>
export default {
  name: 'Loading',
  data() {
    return {
      isShow: false,
      flag: null,
      loadText: '加载中'
    }
  },
  methods: {
    show() {
      this.isShow = true
      this.flag = setInterval(() => {
        if (this.loadText === '加载中...') {
          this.loadText = '加载中'
        } else {
          this.loadText += '.'
        }
      }, 500)
    },
    hide() {
      this.isShow = false
      clearInterval(this.flag)
    }
  }
}
</script>

<style lang="scss" scoped>
.loading {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    color: #ffffff;
    font-size: 24px;
  }
}
</style>
