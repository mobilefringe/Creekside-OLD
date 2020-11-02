<template>
  <div class="contact-us-container">
    <inside-page-banner :pageBanner="pageBanner" pageTitle="Pop-Up Specialty Leasing"></inside-page-banner>

    <div class="main_container">
      <div class="row">
        <div class="col-md-12">
          <breadcrumb-component
            page_name="Specialty Leasing"
            :has_parent="false"
          ></breadcrumb-component>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 margin_60">
          <div v-if="currentPage" v-html="currentPage.body"></div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <a v-if="leasingBooklet" :href="leasingBooklet" target="_blank">
            <div class="animated_btn leasing_btn">Leasing Booklet</div>
          </a>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4" v-if="leasingInfo" v-for="item in leasingInfo">
          <p class="amenities_title">{{ item.title }}</p>
          <div class="amenities_body" v-html="item.body"></div>
        </div>
      </div>
    </div>

    <div class="location_image_container">
      <div class="location_image" v-if="pageImages" v-for="item in pageImages">
        <img :src="item.image_url" alt="item.id" class="img_max" />
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
      leasingInfo: null,
      leasingBooklet: null,
    }
  },
  async asyncData({ store, params, route }) {
    try {
      let results = await Promise.all([
        store.dispatch('LOAD_SEO', { url: '/speciality-leasing' }),
        store.dispatch('getMMData', { resource: 'banners' }),
        store.dispatch('getMMData', { resource: 'pages' }),
        store.dispatch('getMMData', { resource: 'hours' })
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
    BreadcrumbComponent: () => import('~/components/BreadcrumbComponent.vue')
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
      var temp_repo = this.findBannerByName('Specialty Leasing Banner')
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
    },
    pageImages() {
      var pageImages = []
      var temp_repo = this.findBannerByName('Leasing Images')
      if (
        temp_repo &&
        temp_repo.gallery_items &&
        temp_repo.gallery_items.length > 0
      ) {
        pageImages = temp_repo.gallery_items;
      }
      return pageImages
    }
  },
  methods: {
    updateCurrentPage() {
      this.currentPage = this.findPageBySlug('creekside-pop-up-specialty-leasing')
      this.leasingInfo = this.currentPage.subpages
        ? this.currentPage.subpages
        : null
    },
    propertyAddress() {
      var address =
        this.property.name +
        '+' +
        this.property.address1 +
        '+' +
        this.property.city +
        '+' +
        this.property.province_state +
        '+' +
        this.property.country +
        this.property.postal_code
      var key = 'AIzaSyCukCjH3fsuDYBdI44hZKL43m60jEToJjY'
      var src =
        'https://www.google.com/maps/embed/v1/place?q=' +
        address +
        '&key=' +
        key
      return src
    }
  }
}
</script>
