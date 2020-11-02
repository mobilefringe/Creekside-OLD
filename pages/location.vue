<template>
  <div class="contact-us-container location">
    <inside-page-banner :pageBanner="pageBanner" pageTitle="Location"></inside-page-banner>

    <div class="main_container">
      <div class="row">
        <div class="col-md-12">
          <breadcrumb-component page_name="Location"
            :has_parent="false"
            parent_slug="/location"></breadcrumb-component>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div v-if="currentPage" v-html="currentPage.body"></div>
        </div>
      </div>
    </div>
    <div class="main_container">
      <div class="location_map">
        <p class="visuallyhidden">
          <a
            :href="'https://maps.google.com/?q=' + property.name"
          >View {{ property.name }} on Google Maps</a>.
        </p>
        <iframe
          aria-hidden="true"
          :title="'Google Map for ' + property.name"
          :src="propertyAddress()"
          width="100%"
          height="490"
          frameborder="0"
          style="border:0"
          allowfullscreen
        ></iframe>
      </div>
    </div>
    <div class="main_container">
      <div class="row">
        <div class="col-md-6">
          <div v-if="address" v-html="address.body"></div>
        </div>
        <div class="col-md-6">
          <div v-if="directions" v-html="directions.body"></div>
        </div>
      </div>
    </div>
    <div class="location_image_container">
      <div class="location_image" v-if="pageImages" v-for="item in pageImages" :key="item.id">
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
      address: null,
      directions: null,
    }
  },
  async asyncData({ store, params, route }) {
    try {
      let results = await Promise.all([
        store.dispatch('LOAD_SEO', { url: '/location' }),
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
      var temp_repo = this.findBannerByName('Location Banner')
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
      var temp_repo = this.findBannerByName('Location Images')
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
      this.currentPage = this.findPageBySlug('creekside-location')
      this.address =
        this.currentPage.subpages && this.currentPage.subpages[0]
          ? this.currentPage.subpages[0]
          : null
      this.directions =
        this.currentPage.subpages && this.currentPage.subpages[1]
          ? this.currentPage.subpages[1]
          : null

      // this.pageImages =
      //   this.currentPage.galleries && this.currentPage.galleries[0]
      //     ? this.currentPage.galleries[0].gallery_items
      //     : null
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
