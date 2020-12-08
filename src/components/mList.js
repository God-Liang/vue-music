import { reactive, ref } from 'vue'
import load from 'audio-loader'

function getMList() {
  const mList = reactive([
    {
      id: 1,
      name: '独家记忆',
      singer: '陈小春',
      url: require('@/assets/mp3/01.mp3')
    },
    {
      id: 2,
      name: '淘汰',
      singer: '陈奕迅',
      url: require('@/assets/mp3/02.mp3')
    }
  ])
  const totalTime = ref(0)
  mList.forEach(e => {
    load(e.url).then(buffer => {
      e.time = parseInt(buffer.duration)
      e.date = handleTime(e.time)
      totalTime.value += parseInt(buffer.duration)
    })
  })
  return { mList, totalTime }
}

function handleTime(time) {
  const minute = parseInt(time / 60)
  const second = time % 60
  const data = (minute > 9 ? minute : '0' + minute) + ':' + (second > 9 ? second : '0' + second)
  return data
}
export { getMList }
