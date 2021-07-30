<template>
  <div>
    <inside-page-banner :pageBanner="pageBanner" pageTitle="Events & Promotions"></inside-page-banner>
    <div class="main_container">
      <div class="row">
        <div class="col-md-12">
          <breadcrumb-component page_name="Events & Promotions" :has_parent="false"></breadcrumb-component>
        </div>
      </div>
      <div class="row margin_40">
        <div class="col-md-6 clearfix">
          <button
            :class="{ change_color: toggleEvents }"
            class="animated_btn stores_btn"
            @click="toggleView('events')"
          >Events</button>
          <button
            :class="{ change_color: togglePromos }"
            class="animated_btn stores_btn"
            @click="toggleView('promos')"
          >Promotions</button>
        </div>
      </div>
      <div v-if="toggleEvents">
        <div v-if="eventList" v-for="(events, key) in eventList">
          <div class="row">
            <div class="col-md-12">
              <h2 class="event_date_heading">{{ key }}</h2>
            </div>
          </div>
          <div class="row event_container" v-for="event in events">
            <div class="col-md-4">
              <img :src="event.image_url" :alt="'Event: ' + event.name" class="event_img img_max" />
            </div>
            <div class="col-md-8">
              <h3 class="event_name">{{ event.name }}</h3>
              <p class="event_dates">
                <span v-if="event.tags && event.tags.length >0">{{event.tags[0]}} |</span>
                <span
                  v-if="isMultiDay(event)"
                >{{ event.start_date | moment("MMMM D", timezone)}} to {{ event.end_date | moment("MMMM D", timezone)}}</span>
                <span v-else>{{ event.start_date | moment("MMMM D", timezone)}}</span>
              </p>
              <div class="event_desc" v-html="event.description_short"></div>
              <nuxt-link :to="'/events/'+ event.slug ">
                <div class="animated_btn event_link">
                  View Event Details
                  <i class="fas fa-angle-double-right"></i>
                </div>
              </nuxt-link>
              <hr class="event_seperator" />
            </div>
          </div>
        </div>
        <div class="row margin_60" v-if="Object.keys(eventList).length === 0">
          <div class="col-md-12">
            <p>Sorry, there are no Events posted at this time. Please check back soon!</p>
          </div>
        </div>
      </div>
      <div v-if="togglePromos">
        <transition-group name="list" tag="div">
          <div v-if="promos.length >= 1" v-for="item in promos" :key="item.id">
            <div class="row event_container">
              <div class="col-sm-6 col-md-4">
                <img
                  :src="item.image_url"
                  :alt="'Promotion: ' + item.name"
                  class="event_img img_max"
                />
              </div>
              <div class="col-sm-6 col-md-8">
                <p
                  v-if="item.promotionable_type == 'Property'"
                  class="event_store_name"
                >{{ property.name }}</p>
                <p v-else class="event_store_name">
                  <nuxt-link :to="'/stores/'+ item.store.slug ">{{ item.store.name }}</nuxt-link>
                </p>
                <h2 class="event_name">{{ item.name }}</h2>
                <p class="event_dates">
                  <span
                    v-if="isMultiDay(item)"
                  >{{ item.start_date | moment("MMMM D", timezone)}} - {{ item.end_date | moment("MMMM D", timezone)}}</span>
                  <span v-else>{{ item.start_date | moment("MMMM D", timezone)}}</span>
                </p>
                <div class="event_desc" v-html="item.description_short"></div>
                <nuxt-link :to="'/promotions/'+ item.slug ">
                  <div class="animated_btn event_link">
                    View Promotion Details
                    <i class="fas fa-angle-double-right"></i>
                  </div>
                </nuxt-link>
                <hr class="event_seperator" />
              </div>
            </div>
          </div>
        </transition-group>
        <div v-if="promos.length == 0">
          <div class="row margin_60">
            <div class="col-md-12">
              <p>Sorry, there are no Promotions posted at this time. Please check back soon!</p>
            </div>
          </div>
        </div>
        <div v-if="!noMorePromos" class="row margin_60">
          <div class="col-md-12">
            <button
              class="animated_btn event_load_more"
              v-if="!noMorePromos"
              @click="handleButton"
            >Load More</button>
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

export default {
  head() {
    return this.currentSEO
  },
  data() {
    return {
      currentSEO: {},
      tempSEO: {},
      toggleEvents: true,
      togglePromos: false,
      promos: [],
      morePromos: [],
      morePromosFetched: false,
      noMorePromos: false,
      noPromos: false
    }
  },
  async asyncData({ store, route, error }) {
    try {
      let results = await Promise.all([
        store.dispatch('LOAD_SEO', {
          url: '/events-and-promotions'
        }),
        store.dispatch('getMMData', { resource: 'promotions' }),
        store.dispatch('getMMData', { resource: 'events' }),
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
    // this.resetPromos()
    // console.log('promos', this.promos)
  },
  computed: {
    ...mapGetters([
      'property',
      'timezone',
      'findBannerByName',
      'processedEvents',
      'processedPromos',
      'processedStores'
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
    },
    eventList() {
      var events = _.orderBy(this.processedEvents, function(o) {
        return o.start_date
      })
      var showEvents = []
      var month_heading = ''
      var _this = this
      _.forEach(events, function(value, key) {
        var today = moment.tz(_this.timezone).format()
        var showOnWebDate = moment
          .tz(value.show_on_web_date, _this.timezone)
          .format()
        var today_month = moment.tz(_this.timezone).format('MM-YYYY')
        if (today >= showOnWebDate) {
          var start_month = moment
            .tz(value.start_date, _this.timezone)
            .format('MM-YYYY')
          if (start_month <= today_month) {
            value.month = moment.tz(_this.timezone).format("MMMM YYYY");
            month_heading = today_month
          } else {
            value.month = moment
              .tz(value.start_date, _this.timezone)
              .format('MMMM YYYY')
            month_heading = start_month
          }

          if (value.eventable_type == 'Store') {
            var store = _.find(_this.processedStores, function(o) {
              return o.id === value.eventable_type_id
            })
            _this.$set(value, 'store', store)
          }
          // if (
          //   value.store != null &&
          //   value.store != undefined &&
          //   _.includes(value.store.image_url, 'missing')
          // ) {
          //   value.store.image_url =
          //     '//codecloud.cdn.speedyrails.net/sites/5de41d386e6f647ab13c0000/image/png/1542644938364/gvr_events.png'
          // }

          // if (_.includes(value.image_url, 'missing')) {
          //   value.image_url =
          //     '//codecloud.cdn.speedyrails.net/sites/5de41d386e6f647ab13c0000/image/png/1542644938364/gvr_events.png'
          // }

          value.description_short = _.truncate(value.plain_text_description, {
            length: 250,
            separator: ' '
          })

          if(value.image_url == null) {
            value.image_url = require("@/static/images/mall-logo.jpg");
          }

          showEvents.push(value)
        }
      })
      showEvents = _.orderBy(showEvents, function(o) {
        return o.end_date
      })
      showEvents = _.groupBy(showEvents, event => event.month)
      return showEvents
    },
    promoList() {
      var _this = this
      var showPromos = []
      _.forEach(this.processedPromos, function(value, key) {
        var today = moment.tz(_this.timezone).format()
        var showOnWebDate = moment
          .tz(value.show_on_web_date, _this.timezone)
          .format()
        if (today >= showOnWebDate) {
          if (value.promotionable_type == 'Store') {
            var store = _.find(_this.processedStores, function(o) {
              return o.id === value.promotionable_id
            })
            _this.$set(value, 'store', store)
          }
          // if (
          //   value.store != null &&
          //   value.store != undefined &&
          //   _.includes(value.store.image_url, 'missing')
          // ) {
          //   value.store.image_url =
          //     '//codecloud.cdn.speedyrails.net/sites/5de41d386e6f647ab13c0000/image/png/1542644978329/gvr_promos.png'
          // }

          // if (_.includes(value.image_url, 'missing')) {
          //   value.image_url =
          //     '//codecloud.cdn.speedyrails.net/sites/5de41d386e6f647ab13c0000/image/png/1542644978329/gvr_promos.png'
          // }

          value.description_short = _.truncate(value.plain_text_description, {
            length: 250,
            separator: ' '
          })

          if(value.image_url == null) {
            value.image_url = require("@/static/images/mall-logo.jpg");
          }

          showPromos.push(value)
        }
      })
      var sortedPromos = _.orderBy(showPromos, [
        function(o) {
          return o.end_date
        }
      ])
      return sortedPromos
    }
  },
  methods: {
    toggleView(item) {
      if (this.promos.length == 0) {
        this.handleButton()
      }

      var selected = item
      if (_.includes(item, 'events')) {
        if (!this.toggleEvents) {
          this.toggleEvents = true
          this.togglePromos = false
        }
      } else {
        if (!this.togglePromos) {
          this.togglePromos = true
          this.toggleEvents = false
        }
      }
    },
    handleButton() {
      if (!this.morePromosFetched) {
        this.morePromos = this.promoList
        this.promos = this.morePromos.splice(0, 3)
        this.morePromosFetched = true
      } else {
        var nextPromos = this.morePromos.splice(0, 3)
        // Add 3 more posts to posts array
        var _this = this
        _.forEach(nextPromos, function(value, key) {
          _this.promos.push(value)
        })
      }
      if (this.promoList.length === 0) {
        this.noMorePromos = true
        this.noPromos = true
      }
    }
  }
}
</script>
