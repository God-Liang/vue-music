<template>
  <div class="m-list">
    <h1>总时长：{{ totalTime }}秒</h1>
    <table border="1" border-color="#ccc" cellspacing="0">
      <thead>
        <tr>
          <td>Id</td>
          <td>音乐名称</td>
          <td>歌手</td>
          <td>时长</td>
          <td>操作</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in mList" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.singer }}</td>
          <td>{{ item.date }}</td>
          <td>
            <img class="playOrPause" v-if="isPlay && currentMusic.id === item.id" src="@/assets/playmusic/pause.png" alt="" />
            <img class="playOrPause" v-else src="@/assets/playmusic/play.png" alt="" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getMList } from './mList.js'
export default {
  name: 'MList',
  data() {
    return {
      isPlay: false,
      currentMusic: {
        id: null,
        name: '',
        singer: '',
        date: '',
        time: ''
      }
    }
  },
  setup() {
    const { mList, totalTime } = getMList()
    return { mList, totalTime }
  },
  mounted() {}
}
</script>

<style scoped lang="scss">
.m-list {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  h1 {
    margin-bottom: 20px;
  }
  table {
    width: 100%;
    text-align: center;
    tr {
      height: 30px;
      td {
        .playOrPause {
          width: 20px;
          height: 20px;
          margin-top: 5px;
        }
      }
      .m-id {
      }
      .m-name {
      }
      .m-singer {
      }
    }
  }
}
</style>
