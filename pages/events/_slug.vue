<template>
  <div v-if="currentEvent">
    <inside-page-banner :pageBanner="pageBanner" pageTitle="Events & Promotions"></inside-page-banner>
    <div class="main_container">
      <div class="row hidden-xs">
        <div class="col-md-12">
          <breadcrumb-component
            :page_name="currentEvent.name"
            :has_parent="true"
            parent_name="Events & Promotions"
            parent_slug="/events-and-promotions"
          ></breadcrumb-component>
        </div>
      </div>
      <div v-if="currentEvent">
        <div class="row">
          <div class="col-md-8">
            <h2 class="event_name">{{ currentEvent.name }}</h2>
            <p
              class="event_details_dates"
              v-if="isMultiDay(currentEvent)"
            >{{ currentEvent.start_date | moment("MMMM D", timezone)}} - {{ currentEvent.end_date | moment("MMMM D", timezone)}}</p>
            <p
              class="event_details_dates"
              v-else
            >{{ currentEvent.start_date | moment("MMMM D", timezone)}}</p>
            <p
              class="event_details_dates"
              v-if="currentEvent.tags && currentEvent.tags.length > 0"
            >{{currentEvent.tags[0]}}</p>
            <div class="event_desc event_details" v-html="currentEvent.description"></div>
          </div>
          <div class="col-md-4">
            <a :href="currentEvent.image_url" :data-lightbox="currentEvent.name">
              <img
                v-lazy="currentEvent.image_url"
                :alt="'Promotion: ' + currentEvent.name"
                class="margin_20 img_max"
              />
            </a>
          </div>
        </div>
        <div class="row margin_60">
          <div class="col-md-12">
            <div class="row margin_30">
              <div class="col-md-12">
                <nuxt-link to="/events-and-promotions">
                  <div class="animated_btn pull-left">Back to Events & Promotions</div>
                </nuxt-link>
              </div>
            </div>
            <!-- <social-sharing
              v-if="currentEvent"
              :url="shareURL(currentEvent.slug)"
              :title="currentEvent.name"
              :description="currentEvent.description"
              :quote="truncate(currentEvent.description)"
              :twitter-user="siteInfo.twitterHandle"
              :media="currentEvent.image_url"
              inline-template
            >
              <div class="social_share">
                <network network="facebook">
                  <i class="fab fa-facebook"></i>
                </network>
                <network network="twitter">
                  <i class="fab fa-twitter"></i>
                </network>
                <network network="email">
                  <i class="fas fa-envelope"></i>
                </network>
              </div>
            </social-sharing>-->
            <div class="social_share">
              <ShareNetwork
                network="facebook"
                class="facebook"
                :title="currentEvent.name"
                :url="shareURL(currentEvent.slug, 'events')"
                :description="removeTags(currentEvent.description)"
              >
                <i class="fab fa-facebook-f social_icons" aria-hidden="true"></i>
              </ShareNetwork>
              <!-- <ShareNetwork
                network="twitter"
                class="twitter"
                :title="currentEvent.name"
                :url="shareURL(currentEvent.slug, 'events')"
                :twitter-user="twitterUsername"
              >
                <i class="fab fa-twitter social_icons" aria-hidden="true"></i>
              </ShareNetwork> -->
              <ShareNetwork
                network="email"
                class="email"
                :title="currentEvent.name"
                :description="removeTags(currentEvent.description)"
                :url="shareURL(currentEvent.slug, 'events')"
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
      currentEvent: null,
      showShareContainer: false
    }
  },
  async asyncData({ store, route }) {
    try {
      let results = await Promise.all([
        store.dispatch('LOAD_SEO', {
          url: '/events/' + route.params.slug
        }),
        store.dispatch('getMMData', { resource: 'events' })
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
      this.updatecurrentEvent(this.$route.params.slug)
    })

    next()
  },
  created() {
    this.updatecurrentEvent(this.$route.params.slug)
  },

  components: {
    InsidePageBanner: () => import('~/components/InsidePageBanner.vue'),
    BreadcrumbComponent: () => import('~/components/BreadcrumbComponent.vue')
  },
  computed: {
    ...mapGetters([
      'property',
      'timezone',
      'findEventBySlug',
      'findStoreById',
      'processedEvents',
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
    updatecurrentEvent(id) {
      this.currentEvent = this.findEventBySlug(id)

      if (this.currentEvent) {
        // if this is a store event, get store data
        if (this.currentEvent.eventable_type === 'Store') {
          this.updateStoreInfo(this.currentEvent.eventable_id)
        }
        //update seo
        if (!_.isEmpty(this.tempSEO)) {
          this.currentSEO = this.localeSEO(this.tempSEO)
        }
        if(this.currentEvent.image_url == null) {
          this.currentEvent.image_url = require("@/static/images/mall-logo.jpg");
        }
      } else {
        this.$router.replace('/events')
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
            _this.currentEvent.store = response.data
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
