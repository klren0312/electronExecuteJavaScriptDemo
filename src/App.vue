<template>
  <div id="app">
    <button @click="openWindow">open window</button>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  name: 'App',
  methods: {
    openWindow() {
      ipcRenderer.send('openSecondWindow')
    }
  }
}
</script>

<style lang="scss">
</style>
