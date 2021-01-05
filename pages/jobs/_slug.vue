<template>
  <div v-if="currentJob">
    <inside-page-banner :pageBanner="pageBanner"></inside-page-banner>
    <div class="main_container">
      <div class="row hidden-xs">
        <div class="col-md-12">
          <breadcrumb-component
            :page_name="currentJob.name"
            :has_parent="true"
            parent_name="Jobs"
            parent_slug="/jobs"
          ></breadcrumb-component>
        </div>
      </div>
      <div>
        <div class="row">
          <div class="col-md-8">
            <p
              v-if="currentJob.jobable_type == 'Property'"
              class="event_store_name"
            >{{ property.name }}</p>
            <p v-else class="event_store_name">{{ currentJob.store ? currentJob.store.name : ''}}</p>
            <h2 class="event_name">{{ currentJob.name }}</h2>
            <p
              class="event_dates"
              v-if="isMultiDay(currentJob)"
            >{{ currentJob.start_date | moment("MMMM D", timezone)}} - {{ currentJob.end_date | moment("MMMM D", timezone)}}</p>
            <p class="event_dates" v-else>{{ currentJob.start_date | moment("MMMM D", timezone)}}</p>
            <div class="event_desc event_details" v-html="currentJob.description"></div>
          </div>
          <div class="col-md-4">
            <a :href="currentJob.image_url" :data-lightbox="currentJob.name">
              <img
                v-lazy="currentJob.image_url"
                :alt="'Promotion: ' + currentJob.name"
                class="margin_20 img_max"
              />
            </a>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="row margin_30">
              <div class="col-md-12">
                <nuxt-link to="/jobs">
                  <div class="animated_btn pull-left">Back to Jobs</div>
                </nuxt-link>
              </div>
            </div>
            <div class="social_share margin_60">
              <ShareNetwork
                network="facebook"
                class="facebook"
                :title="currentJob.name"
                :url="shareURL(currentJob.slug, 'jobs')"
                :description="removeTags(currentJob.description)"
              >
                <i class="fab fa-facebook-f social_icons" aria-hidden="true"></i>
              </ShareNetwork>
              <ShareNetwork
                network="twitter"
                class="twitter"
                :title="currentJob.name"
                :url="shareURL(currentJob.slug, 'jobs')"
                :twitter-user="twitterUsername"
              >
                <i class="fab fa-twitter social_icons" aria-hidden="true"></i>
              </ShareNetwork>
              <ShareNetwork
                network="email"
                class="email"
                :title="currentJob.name"
                :description="removeTags(currentJob.description)"
                :url="shareURL(currentJob.slug, 'jobs')"
              >
                <i class="fas fa-envelope-open social_icons" aria-hidden="true"></i>
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
      currentJob: null,
      showShareContainer: false,
    }
  },
  async asyncData({ store, route }) {
    try {
      let results = await Promise.all([
        store.dispatch('LOAD_SEO', {
          url: '/jobs/' + route.params.slug,
        }),
        store.dispatch('getMMData', { resource: 'jobs' }),
      ])
      return {
        tempSEO: results[0].data,
      }
    } catch (e) {
      console.log(e.message)
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.$nextTick(function () {
      this.updateCurrentJob(this.$route.params.slug)
    })

    next()
  },
  created() {
    this.updateCurrentJob(this.$route.params.slug)
  },

  components: {
    InsidePageBanner: () => import('~/components/InsidePageBanner.vue'),
    BreadcrumbComponent: () => import('~/components/BreadcrumbComponent.vue'),
  },
  computed: {
    ...mapGetters([
      'property',
      'timezone',
      'findJobBySlug',
      'findStoreById',
      'findBannerByName',
    ]),
    pageBanner() {
      var pageBanner = null
      var temp_repo = this.findBannerByName('Jobs Banner')
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
  },
  methods: {
    updateCurrentJob(id) {
      this.currentJob = this.findJobBySlug(id)

      if (this.currentJob) {
        // if this is a store event, get store data
        if (this.currentJob.jobable_type === 'Store') {
          this.updateStoreInfo(this.currentJob.jobable_id)
        }
        //update seo
        if (!_.isEmpty(this.tempSEO)) {
          this.currentSEO = this.localeSEO(this.tempSEO)
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
            process.env.API_KEY,
        })
        .then(
          function (response) {
            _this.currentJob.store = response.data
            _this.$forceUpdate()
          },
          function (error) {
            console.error(
              'Could not retrieve data from server. Please check internet connection and try again.'
            )
          }
        )
    },
  },
}
</script>
