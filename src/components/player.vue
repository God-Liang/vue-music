<template>
  <div class="play-music">
    <p class="audioName">歌名：{{ playList[currentIndex].name }}</p>
    <div class="player-music-left">
      <div class="play" @click="toggle()">
        <img src="@/assets/playmusic/play.png" alt v-show="!isPlay" />
        <img src="@/assets/playmusic/pause.png" alt v-show="isPlay" />
      </div>
    </div>
    <div class="player-music-right" v-if="playList[currentIndex] != null">
      <audio
        :src="playList[currentIndex].src"
        autoplay
        ref="audio"
        @timeupdate="audioTimeUpdate()"
        @pause="musicPause()"
        @ended="musicEnded()"
        @play="playLoad()"
        @playing="musicPlaying()"
        @error="musicErr()"
      ></audio>
      <div class="music-pro">
        <div class="currentTime">{{ currentTime }}</div>
        <music-progress class="music-pro-progress" ref="music_pro" :loading="loading" @childclick="setMusicCurrent" />
        <div class="totalTime">{{ duration }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import musicProgress from '@/components/progress.vue'
import load from 'audio-loader'
export default {
  name: 'Player',
  components: {
    musicProgress
  },
  data() {
    return {
      isPlay: false,
      playList: [
        {
          id: 1,
          name: '独家记忆',
          singer: '陈小春',
          src: require('@/assets/mp3/01.mp3')
        },
        {
          id: 2,
          name: '淘汰',
          singer: '陈奕迅',
          src: require('@/assets/mp3/02.mp3')
        }
      ],
      currentIndex: 0,
      currentTime: '00:00',
      totalTime: 0,
      loading: true // 音频加载中
    }
  },
  computed: {
    duration() {
      return this.formatDate(new Date(this.totalTime * 1000), 'mm:ss')
    },
    beforeTime() {
      return this.getBeforeTime()
    }
  },
  mounted() {
    this.getTotalTime()
  },
  methods: {
    // 获取总时长
    getTotalTime() {
      let allIndex = 0
      this.playList.forEach(e => {
        load(e.src).then(buffer => {
          e.time = parseInt(buffer.duration)
          this.totalTime += parseInt(buffer.duration)
          allIndex++
          if (allIndex === this.playList.length) {
            this.loading = false
          }
        })
      })
    },
    // 之前的所有时长
    getBeforeTime() {
      return this.playList.reduce((num, val, index) => {
        if (index < this.currentIndex) {
          num = num + val.time
        }
        return num
      }, 0)
    },
    // 播放、暂停切换
    toggle() {
      this.isPlay = !this.isPlay
      if (this.isPlay) {
        this.$refs.audio.play()
      } else {
        this.$refs.audio.pause()
      }
      this.getItemAllTime()
    },
    setMusicCurrent(scale) {
      this.getItemAllTime()
      // 防止canplaythrough监听事件出现不明bug，使用缓存scale，
      window.localStorage.setItem('scale', scale)
      const curTime = scale * this.totalTime
      // 是否是正在播放的音频
      if (curTime > this.beforeTime && curTime - this.beforeTime <= this.$refs.audio.duration) {
        console.log('正在播放')
        this.$refs.audio.currentTime = curTime - this.beforeTime
      } else {
        console.log('不正在播放')
        // 获取时间对应的音频
        this.loading = true
        this.currentIndex = this.playList.findIndex(e => e.allTime >= curTime)
        this.$refs.audio.addEventListener('canplaythrough', () => {
          console.log('loading', this.loading)
          if (!this.loading) {
            this.$refs.audio.currentTime = window.localStorage.getItem('scale') * this.totalTime - this.beforeTime
            console.log('currentTime', this.$refs.audio.currentTime)
            if (!this.isPlay) {
              this.isPlay = !this.isPlay
              this.$refs.audio.play()
            }
            this.loading = false
          }
        })
      }
    },
    // 防止获取音频事件顺序随机性。单独处理单条音频之前的时长之和
    getItemAllTime() {
      if (!this.playList[0].allTime) {
        let allTime = 0
        this.playList.forEach(e => {
          allTime += e.time
          e.allTime = allTime
        })
      }
    },
    // 播放中
    audioTimeUpdate() {
      if (this.$refs.audio != null) {
        this.currentTime = this.formatDate(new Date((this.$refs.audio.currentTime + this.beforeTime) * 1000), 'mm:ss')
        let scale = (this.$refs.audio.currentTime + this.beforeTime) / this.totalTime
        this.$refs.music_pro.setProgress(scale)
      }
    },
    // 暂停
    musicPause() {
      // this.isPlay = false
    },
    // 结束
    musicEnded() {
      this.loading = true
      this.currentIndex++
    },
    playLoad() {
      console.log(123)
    },
    // 播放
    musicPlaying() {
      this.isPlay = true
      this.loading = false
    },
    // 错误处理
    musicErr() {
      console.warn('当前音频不可用')
      this.currentIndex++
    },
    formatDate(date, fmt) {
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
      }
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + ''
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : this.padLeftZero(str))
        }
      }
      return fmt
    },
    padLeftZero(str) {
      return ('00' + str).substr(str.length)
    }
  }
}
</script>
<style lang="scss" scoped>
.audioName {
  position: fixed;
  bottom: 70px;
  left: 30px;
  font-weight: bold;
}
.play-music {
  width: 100%;
  height: 60px;
  background: #212124;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  .player-music-left {
    .play {
      img {
        width: 50px;
        height: 50px;
        display: block;
      }
    }
  }
  .player-music-right {
    flex: 1;
    color: #fff;
    .music-pro {
      width: 100%;
      height: 100%;
      float: left;
      display: flex;
      align-items: center;
      text-align: center;
    }
    .currentTime,
    .totalTime {
      width: 60px;
    }
    .music-pro-progress {
      flex: 1;
    }
  }
}
</style>
