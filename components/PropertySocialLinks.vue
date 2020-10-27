<template>
  <div class="social_icon_container">
    <span class="social_icon" v-for="(item, index) in social_media_links" :key="index">
    <a


      :href="item.url"
      target="_blank"
      :aria-label="item.callout"
    >
      <p class="accessibility">{{ item.social_type }}</p>
      <i class="fab fa-facebook" v-if="item.social_type == 'Facebook'"></i>
      <i class="fab fa-instagram" v-if="item.social_type == 'Instagram'"></i>
      <i class="fab fa-twitter" v-if="item.social_type == 'Twitter'"></i>
      <i class="fab fa-youtube" v-if="item.social_type == 'Youtube'"></i>
      <i class="fab fa-pinterest" v-if="item.social_type == 'Pinterest'"></i>
      <i class="fab fa-yelp" v-if="item.social_type == 'Yelp'"></i>
      <i class="fab fa-tripadvisor" v-if="item.social_type == 'Trip Advisor'"></i>
      <i class="fab fa-weibo" v-if="item.social_type == 'Weibo'"></i>
    </a>
    </span>
  </div>
</template>

<script>
export default {
  transition: 'page',
  props: ['type'],
  data: function(){
    return {
      social_media_links:[{id: 1, social_type:"Facebook",url:"https://www.facebook.com/creeksidetowncenter/",iconClass:"fab fa-facebook", callout: "Facebook"},
      {id: 2, social_type:"Instagram",url:"https://www.instagram.com/Creeksidetowncenterroseville/",iconClass:"fab fa-instagram", callout: "Instagram"}],
    }
  }
}
</script>
