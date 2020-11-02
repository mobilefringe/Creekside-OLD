<template>
  <div v-if="currentPromo">
    <inside-page-banner :pageBanner="pageBanner" pageTitle="Events & Promotions"></inside-page-banner>
    <div class="main_container">
      <div class="row hidden-xs">
        <div class="col-md-12">
          <breadcrumb-component
            :page_name="currentPromo.name"
            :has_parent="true"
            parent_name="Events & Promotions"
            parent_slug="/events-and-promotions"
          ></breadcrumb-component>
        </div>
      </div>
      <div>
        <div class="row">
          <div class="col-md-8">
            <p
              v-if="currentPromo.promotionable_type == 'Property'"
              class="event_store_name"
            >{{ property.name }}</p>
            <p
              v-else
              class="event_store_name"
            >{{ currentPromo.store ? currentPromo.store.name : ''}}</p>
            <h2 class="event_name">{{ currentPromo.name }}</h2>
            <p
              class="event_dates"
              v-if="isMultiDay(currentPromo)"
            >{{ currentPromo.start_date | moment("MMMM D", timezone)}} - {{ currentPromo.end_date | moment("MMMM D", timezone)}}</p>
            <p class="event_dates" v-else>{{ currentPromo.start_date | moment("MMMM D", timezone)}}</p>
            <div class="event_desc event_details" v-html="currentPromo.rich_description"></div>
          </div>
          <div class="col-md-4">
            <a :href="currentPromo.image_url" :data-lightbox="currentPromo.name">
              <img
                v-lazy="currentPromo.image_url"
                :alt="'Promotion: ' + currentPromo.name"
                class="margin_20 img_max"
              />
            </a>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="row margin_30">
              <div class="col-md-12">
                <nuxt-link to="/events-and-promotions">
                  <div class="animated_btn pull-left">Back to Events & Promotions</div>
                </nuxt-link>
              </div>
            </div>
            <div class="social_share">
              <ShareNetwork
                network="facebook"
                class="facebook"
                :title="currentPromo.name"
                :url="shareURL(currentPromo.slug, 'events')"
                :description="removeTags(currentPromo.description)"
              >
                <i class="fab fa-facebook-f social_icons" aria-hidden="true"></i>
              </ShareNetwork>
              <!-- <ShareNetwork
                network="twitter"
                class="twitter"
                :title="currentPromo.name"
                :url="shareURL(currentPromo.slug, 'events')"
                :twitter-user="twitterUsername"
              >
                <i class="fab fa-twitter social_icons" aria-hidden="true"></i>
              </ShareNetwork> -->
              <ShareNetwork
                network="email"
                class="email"
                :title="currentPromo.name"
                :description="removeTags(currentPromo.description)"
                :url="shareURL(currentPromo.slug, 'events')"
              >
                <i class="fas fa-envelope social_icons" aria-hidden="true"></i>
              </ShareNetwork>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import tz from 'moment-timezone'
import Lightbox from 'lightbox2/dist/js/lightbox.min.js'
import 'lightbox2/dist/css/lightbox.min.css'
import Vue from 'vue'
import VueSocialSharing from 'vue-social-sharing'

Vue.use(VueSocialSharing)

export default {
  head() {
    return this.currentSEO
  },
  data() {
    return {
      tempSEO: {},
      currentSEO: {},
      currentPromo: null,
      showShareContainer: false
    }
  },
  async asyncData({ store, route }) {
    try {
      let results = await Promise.all([
        store.dispatch('LOAD_SEO', {
          url: '/promotions/' + route.params.slug
        }),
        store.dispatch('getMMData', { resource: 'promotions' })
      ])
      return {
        tempSEO: results[0].data
      }
    } catch (e) {
      console.log(e.message)
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.$nextTick(function() {
      this.updateCurrentPromo(this.$route.params.slug)
    })

    next()
  },
  created() {
    this.updateCurrentPromo(this.$route.params.slug)
  },

  components: {
    InsidePageBanner: () => import('~/components/InsidePageBanner.vue'),
    BreadcrumbComponent: () => import('~/components/BreadcrumbComponent.vue')
  },
  computed: {
    ...mapGetters([
      'property',
      'timezone',
      'findPromoBySlug',
      'findStoreById',
      'processedPromos',
      'findBannerByName'
    ]),
    pageBanner() {
      var pageBanner = null
      var temp_repo = this.findBannerByName('Events Banner')
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
    updateCurrentPromo(id) {
      this.currentPromo = this.findPromoBySlug(id)

      if (this.currentPromo) {
        // if this is a store event, get store data
        if (this.currentPromo.promotionable_type === 'Store') {
          this.updateStoreInfo(this.currentPromo.promotionable_id)
        }
        //update seo
        if (!_.isEmpty(this.tempSEO)) {
          this.currentSEO = this.localeSEO(this.tempSEO)
        }
        if(this.currentPromo.image_url == null) {
          this.currentPromo.image_url = require("@/static/images/mall-logo.jpg");
        }
      } else {
        this.$router.replace('/promotions')
      }
    },
    updateStoreInfo(id) {
      var _this = this
      this.$store
        .dispatch('LOAD_PAGE_DATA', {
          url:
            process.env.MM_API_HOST +
            '/stores/' +
            id +
            '?api_key=' +
            process.env.API_KEY
        })
        .then(
          function(response) {
            _this.currentPromo.store = response.data
            _this.$forceUpdate()
          },
          function(error) {
            console.error(
              'Could not retrieve data from server. Please check internet connection and try again.'
            )
          }
        )
    }
  }
}
</script>
