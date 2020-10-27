<template>
  <div class="contact-us-container">
    <inside-page-banner :pageBanner="pageBanner"></inside-page-banner>

    <div class="main_container">
      <div class="row">
        <div class="col-md-12">
          <breadcrumb-component page_name="Center Information" :has_parent="false"></breadcrumb-component>
        </div>
      </div>
      <!-- <div class="row">
        <div class="col-md-12">
          <div v-if="currentPage" v-html="currentPage.body"></div>
        </div>
      </div>-->
      <div class="row">
                        <div class="col-md-12">
                            <h3 class="center inside_page_title">Amenities</h3>
                        </div>
                    </div>
      <template v-if="amenities && amenities.length > 0">
        <div class="row">
          <div class="col-md-12">
            <h2 class="center inside_page_title">Amenities</h2>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6" v-for="item in amenities">
            <p class="amenities_title">{{ item.title }}</p>
            <div class="amenities_body" v-html="item.body"></div>
          </div>
        </div>
      </template>
    </div>
    <div class="location_image_container">
      <div class="location_image" v-if="pageImages" v-for="item in pageImages">
        <img :src="item.image_url" alt />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  head() {
    return this.currentSEO
  },
  data() {
    return {
      tempSEO: {},
      currentSEO: {},
      currentPage: null,
      amenities: null,
      pageImages: null
    }
  },
  async asyncData({ store, params, route }) {
    try {
      let results = await Promise.all([
        store.dispatch('LOAD_SEO', { url: '/center-information' }),
        store.dispatch('getMMData', { resource: 'pages' })
      ])
      return {
        tempSEO: results[0].data
      }
    } catch (e) {
      console.log(e.message)
    }
  },
  components: {
    InsidePageBanner: () => import('~/components/InsidePageBanner.vue'),
    BreadcrumbComponent: () => import('~/components/BreadcrumbComponent.vue'),
    googleMap: () => import('~/components/googleMap.vue')
  },
  created() {
    if (!_.isEmpty(this.tempSEO)) {
      this.currentSEO = this.localeSEO(this.tempSEO)
    }
    this.updateCurrentPage()
  },
  computed: {
    ...mapGetters([
      'timezone',
      'findBannerByName',
      'propertyHours',
      'propertyHolidayHours',
      'findPageBySlug',
      'findBannerByName'
    ]),
    pageBanner() {
      var pageBanner = null
      var temp_repo = this.findBannerByName('Center Map Banner')
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
      this.pageTitle = pageBanner.name
      return pageBanner
    }
  },
  methods: {
    updateCurrentPage() {
      this.currentPage = this.findPageBySlug('creekside-services')
      this.amenities = this.currentPage.subpages
        ? this.currentPage.subpages
        : null

      this.pageImages =
        this.currentPage.galleries && this.currentPage.galleries[0]
          ? this.currentPage.galleries[0].gallery_items
          : null
    }
  }
}
</script>
