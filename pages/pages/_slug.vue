<template>
  <!-- <div v-if="currentPage"> -->
  <!-- <template-one v-if="currentPage.template_id==12" :currentPage="currentPage"></template-one>
    <template-two v-else-if="currentPage.template_id==13" :currentPage="currentPage"></template-two>
    <template-three v-else-if="currentPage.template_id==14" :currentPage="currentPage"></template-three>
    <template-four v-else-if="currentPage.template_id==15" :currentPage="currentPage"></template-four>
  <template-five v-else-if="currentPage.template_id==16" :currentPage="currentPage"></template-five>-->
  <default-template :currentPage="currentPage" v-if="currentPage"></default-template>
  <!-- </div> -->
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import tz from 'moment-timezone'
export default {
  head() {
    return this.currentSEO
  },
  components: {
    DefaultTemplate: () =>
      import('~/components/CustomPageTemplates/DefaultTemplate.vue')
    // templateOne: () =>
    //   import('~/components/customPageTemplates/templateOne.vue'),
    // templateTwo: () =>
    //   import('~/components/customPageTemplates/templateTwo.vue'),
    // templateThree: () =>
    //   import('~/components/customPageTemplates/templateThree.vue'),
    // templateFour: () =>
    //   import('~/components/customPageTemplates/templateFour.vue'),
    // templateFive: () =>
    //   import('~/components/customPageTemplates/templateFive.vue')
  },
  data: function data() {
    return {
      tempSEO: null,
      currentSEO: {},
      currentPage: {}
    }
  },
  async asyncData({ store, params, error, route }) {
    try {
      let results = await Promise.all([
        store.dispatch('getMMData', { resource: 'pages' }),
        store.dispatch('LOAD_SEO', { url: route.fullPath })
      ])
      return { tempSEO: results[1].data }
    } catch (e) {
      console.log(e.message)
    }
  },
  watch: {
    $route: function() {
      this.updateCurrentPage(this.$route.params.slug)
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.updateCurrentPage(this.$route.params.slug)
    next()


  },
  created() {
    this.$parent.$emit('update-transparency', true)
    this.updateCurrentPage(this.$route.params.slug, this.$route)
  },
  computed: {
    ...mapGetters(['property', 'findBannerByName', 'findPageBySlug']),
    pageBanner() {
      var pageBannerURL = null

      if (this.currentPage.banner_url) {
        pageBannerURL = this.currentPage.banner_url
      } else {
        var temp_repo = null
        temp_repo = this.findBannerByName('Pages Banner')
        var pageBanner = null
        if (
          temp_repo &&
          temp_repo.gallery_items &&
          temp_repo.gallery_items.length > 0
        ) {
          pageBanner = temp_repo.gallery_items[0]
        } else if (this.propertyBanner) {
          pageBanner = this.propertyBanner
        } else {
          pageBanner = {}
          pageBanner.image_url = ''
        }
        pageBannerURL = pageBanner.image_url
      }

      return pageBannerURL
    }
  },
  methods: {
    updateCurrentPage(id, route) {
      this.currentPage = this.findPageBySlug(id)
      //reload SEO for new page - async function doesn't run again when only sub route is updated
      var _this = this
      this.$store
        .dispatch('LOAD_SEO', {
          url: this.$route.fullPath
        })
        .then(
          function(response) {
            _this.tempSEO = response.data
            if (!_.isEmpty(_this.tempSEO)) {
              _this.currentSEO = _this.localeSEO(_this.tempSEO)
            }
          },
          function(error) {
            console.error(
              'Could not retrieve SEO from server. Please check internet connection and try again.'
            )
          }
        )
    }
  }
}
</script>
