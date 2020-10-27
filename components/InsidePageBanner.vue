<template>
  <div
      class="inside_page_header"
      :style="{ backgroundImage: 'url(' + pageBanner.image_url + ')' }"
    >
      <div class="main_container position_relative" v-if="pageTitle || (pageBanner && pageBanner.name)">
        <h1>{{pageTitle ? pageTitle : pageBanner.name}}</h1>
      </div>
    </div>
</template>
<script>
export default {
  props: ['pageBanner', 'pageTitle']
}
</script>
