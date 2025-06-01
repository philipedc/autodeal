<template>
  <router-view/>
</template>

<style lang="less">
@import '@fortawesome/fontawesome-free/css/all.css';
@import '@/assets/fonts/Gellix/stylesheet.less';

html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Gellix', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333;
  background-color: #faf9f5;
}

:root {
  --primaryColor: #b80b0b;
  --secondaryColor: #858586;
}

</style>
