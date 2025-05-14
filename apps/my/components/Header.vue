<script setup name="Header">
const isMobile = useIsMobile()
</script>

<template>
  <header>
    <div class="header" :class="{ m: isMobile }">
      <a href="" class="logo left">
        <img src="~@/assets/imgs/Flylinking-logo.svg" alt="Flylinking">
      </a>

      <Language />
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  max-width: 1440px;
  margin: 0 32px;
}
.header.m{margin: 0 24px;}

.logo {
  height: 30px;
  > img {
    height: 100%;
  }
}

.lang {
}
</style>
