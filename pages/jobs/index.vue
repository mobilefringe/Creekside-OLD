<template>
  <div>
    <inside-page-banner :pageBanner="pageBanner" pageTitle="Jobs"></inside-page-banner>
    <div class="main_container">
      <div class="row">
        <div class="col-md-12">
          <breadcrumb-component
            page_name="Jobs"
            :has_parent="false"
          ></breadcrumb-component>
        </div>
      </div>
      <div class="row event_container" v-if="jobs.length > 0" v-for="item in jobs" :key="item.id">
        <div class="col-sm-4">
          <div class="store_logo_container jobs event_img">
            <div v-if="item.image_url" class="logo_container">
              <img
                class="transparent_logo"
                src="/images/default_background.png"
                alt
              />
              <img
                class="store_img"
                :src="item.store.logo_image_url"
                :alt="item.name + 'Logo'"
              />
            </div>

            <div v-else class="no_logo_container">
              <img
                class="transparent_logo"
                src="/images/default_background.png"
                alt
              />
              <div class="no_logo_text">
                <div class="store_text">
                  <h2>{{ item.store.name }}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-8">
          <p
            v-if="item.jobable_type == 'Property'"
            class="event_store_name"
          >{{ property.name }}</p>
          <p v-else-if="item.store" class="event_store_name">
            <nuxt-link
              :to="'/stores/'+item.store.slug"
            >{{ item.store.name }}</nuxt-link>
          </p>
          <h2 class="event_name">{{ item.name }}</h2>
          <p class="event_dates">{{ item.end_date | moment("MMMM D", timezone)}}</p>
          <div class="event_desc" v-html="item.plain_text_description"></div>
          <nuxt-link :to="'/jobs/'+item.slug">
            <div class="animated_btn event_link">
              View Job Posting
              <i class="fas fa-angle-double-right"></i>
            </div>
          </nuxt-link>
          <hr class="event_seperator" />
        </div>
      </div>
      <div class="row event_container" v-if="jobs.length == 0">
        <div class="col-md-12">
          <p>There are no Job Postings at this time. Please check back soon.</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import tz from 'moment-timezone'
import '~/node_modules/slick-carousel/slick/slick.css'
import '~/node_modules/slick-carousel/slick/slick-theme.scss'
export default {
  head() {
    return this.currentSEO
  },
  data() {
    return {
      currentSEO: {},
      tempSEO: {}
    }
  },
  async asyncData({ store, route, error }) {
    try {
      let results = await Promise.all([
        store.dispatch('LOAD_SEO', {
          url: '/jobs'
        }),
        store.dispatch('getMMData', { resource: 'jobs' }),
        store.dispatch('getMMData', { resource: 'stores' })
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
  },
  computed: {
    ...mapGetters([
      'property',
      'timezone',
      'findBannerByName',
      'processedJobs',
      'processedStores'
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
    jobs() {
      var jobs = _.orderBy(this.processedJobs, 'end_date')

      var vm = this

      _.filter(jobs, function(val, key) {
        if (val.jobable_type == 'Store') {
          var store = _.find(vm.processedStores, function(o) {
            return o.id === val.jobable_id
          })
          vm.$set(val, 'store', store)
        }
      })
      return jobs
    }
  }
}
</script>
