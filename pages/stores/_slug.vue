<template>
  <div class="store-details-container" v-if="currentStore">
    <inside-page-banner :pageBanner="pageBanner" :pageTitle="currentStore.name"></inside-page-banner>
    <div class="main_container">
      <div class="row">
        <div class="col-md-12">
          <!-- <breadcrumb></breadcrumb> -->
          <breadcrumb-component
            :page_name="currentStore.name"
            :has_parent="true"
            parent_name="Directory"
            parent_slug="/stores"
          ></breadcrumb-component>
        </div>
      </div>
      <div class="row">
        <div class="col-md-4">
          <div class="sidebar">
            <div v-if="!currentStore.logo_image_url" class="store_details_no_logo center-block">
              <div class="no_logo">
                <img class="transparent_logo" src="/images/default_background.png" alt />
                <p class="store_details_name">{{ currentStore.name }}</p>
              </div>
            </div>
            <div v-else id="store_dets_logo_container">
              <img class="transparent_logo" src="/images/default_background.png" alt />
              <img class="store_details_image" :src="currentStore.logo_image_url" alt />
            </div>
            <div class="margin_20 center" v-if="currentStore.phone">
              <a
                class="store_details_phone"
                :href="'tel:' + currentStore.phone"
              >{{ currentStore.phone }}</a>
            </div>
            <div class="margin_20 center" v-if="currentStore.website">
              <a class="store_details_phone" :href="currentStore.website" target="_blank">Website</a>
            </div>
            <div
              v-if="currentStore.is_temporarily_closed"
              class="store_details_hours_list text-center"
            >Temporarily Closed</div>
            <ul v-else-if="storeHours && storeHours.length > 0" class="store_details_hours_list">
              <li
                v-for="hour in storeHours"
                :class="{ 'today': hour.day_of_week == todaysHour.day_of_week}"
              >
                <div v-if="!hour.is_closed">
                  <span class="hours_list_day">{{hour.day_of_week | moment("dddd", timezone)}}</span>
                  <span
                    class="hours_list_time"
                  >{{hour.open_time | moment("h:mma", timezone)}} - {{hour.close_time | moment("h:mma", timezone)}}</span>
                </div>
                <div v-else>
                  <span class="hours_list_day">{{hour.day_of_week | moment("dddd", timezone)}}</span>
                  <span class="hours_list_time">CLOSED</span>
                </div>
              </li>
              <li class="hours_vary">*Hours may vary</li>
            </ul>
          </div>
        </div>
        <div class="col-md-8">
          <div id="map" class="margin_20">
            <mapplic-map
              class
              ref="map_ref"
              :height="314"
              :minimap="false"
              :deeplinking="false"
              :sidebar="false"
              :hovertip="true"
              :maxscale="5"
              :mousewheel="false"
              :storelist="processedStores"
              :mapData="mapData"
              tooltiplabel="Store Info"
              @updateMap="updateMap"
            ></mapplic-map>
          </div>
          <div class="margin_30 store_details_desc" v-html="currentStore.description"></div>

          <div v-if="deliveryAvailable" class="margin_30">
            <h2 class="store_details_title">Delivery Options:</h2>
            <div class="store_details_delivery">
              <img
                v-if="hasDoordash"
                class="delivery_option"
                src="/images/doordash.png"
                alt="Delivery available with DoorDash"
              />
              <img
                v-if="hasGrubhub"
                class="delivery_option"
                src="/images/grubhub.png"
                alt="Delivery available with Grubhub"
              />
              <img
                v-if="hasPostmates"
                class="delivery_option"
                src="/images/postmates.png"
                alt="Delivery available with Postmates"
              />
              <div v-if="hasRestaurantDelivery" class="delivery_option">
                <span>Restaurant Delivery</span>
              </div>
              <img
                v-if="hasUberEats"
                class="delivery_option"
                src="/images/ubereats.png"
                alt="Delivery available with Uber Eats"
              />
            </div>
          </div>

          <div v-if="this.currentStore.active_events_count > 0">
            <h3 class="store_details_title">Current Events</h3>
            <div class="row margin_40">
              <div class="col-md-6" v-if="storeEvents" v-for="item in storeEvents">
                <div class="feature_item_container">
                  <nuxt-link class="tile" :to="'/events/'+ item.slug ">
                    <div
                      class="feature_image"
                      :style="{ backgroundImage: 'url(' + item.image_url + ')' }"
                    >
                      <div class="details">
                        <span class="title">
                          <h3>{{ item.name }}</h3>
                        </span>
                        <span class="info">
                          <p
                            v-if="isMultiDay(item)"
                          >{{ item.start_date | moment("MMMM D", timezone)}} to {{ item.end_date | moment("MMMM D", timezone)}}</p>
                          <p v-else>{{ item.start_date | moment("MMMM D", timezone)}}</p>
                          <p>
                            View Event Details
                            <i
                              class="fa fa-angle-double-right"
                              aria-hidden="true"
                            ></i>
                          </p>
                        </span>
                      </div>
                    </div>
                  </nuxt-link>
                </div>
              </div>
            </div>
          </div>
          <div v-if="this.currentStore.active_promotions_count > 0">
            <h3 class="store_details_title">Current Promotions</h3>
            <div class="row margin_40">
              <div class="col-md-6" v-if="storePromotions" v-for="item in storePromotions">
                <div class="feature_item_container">
                  <nuxt-link class="tile" :to="'/promotions/'+ item.slug ">
                    <div
                      class="feature_image"
                      :style="{ backgroundImage: 'url(' + item.image_url + ')' }"
                    >
                      <div class="details">
                        <span class="title">
                          <h3>{{ item.name }}</h3>
                        </span>
                        <span class="info">
                          <p
                            v-if="isMultiDay(item)"
                          >{{ item.start_date | moment("MMMM D", timezone)}} to {{ item.end_date | moment("MMMM D", timezone)}}</p>
                          <p v-else>{{ item.start_date | moment("MMMM D", timezone)}}</p>
                          <p>
                            View Promotion Details
                            <i
                              class="fa fa-angle-double-right"
                              aria-hidden="true"
                            ></i>
                          </p>
                        </span>
                      </div>
                    </div>
                  </nuxt-link>
                </div>
              </div>
            </div>
          </div>
          <div class="row margin_60">
            <div class="col-md-12">
              <nuxt-link class="pull-right" to="/stores">
                <div class="animated_btn store_details_btn">Back to Directory</div>
              </nuxt-link>
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

export default {
  head() {
    return this.currentSEO
  },
  components: {
    MapplicMap: () => import('~/components/Mapplic.vue'),
    InsidePageBanner: () => import('~/components/InsidePageBanner.vue'),
    BreadcrumbComponent: () => import('~/components/BreadcrumbComponent.vue'),
  },
  async asyncData({ store, route, error }) {
    try {
      let results = await Promise.all([
        store.dispatch('LOAD_SEO', {
          url: route.fullPath,
        }),
        store.dispatch('LOAD_PAGE_DATA', {
          url:
            process.env.MM_API_URL +
            '/store_by_slug/' +
            route.params.slug +
            '?api_key=' +
            process.env.API_KEY,
        }),
        store.dispatch('LOAD_PAGE_DATA', {
          url:
            process.env.MM_API_URL + '/mapplic?api_key=' + process.env.API_KEY,
        }),
        store.dispatch('getMMData', { resource: 'categories' }),
      ])
      return {
        tempSEO: results[0].data,
        currentStore: results[1].data,
        mapData: results[2].data,
      }
    } catch (e) {
      console.log(e.message)
      if (e.response.status == 404) {
        error({ statusCode: 404, message: 'Store not found' })
        $nuxt.$router.push('/')
      }
    }
  },
  data() {
    return {
      currentSEO: {},
      tempSEO: {},
      currentStore: null,
      mapData: null,
      storeEvents: null,
      storePromotions: null,
      storeCoupons: null,
      deliveryAvailable: false,
      hasDoordash: false,
      hasGrubhub: false,
      hasPostmates: false,
      hasRestaurantDelivery: false,
      hasUberEats: false,
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.$nextTick(function() {
      this.updateCurrentStore()
    })
    next()
  },
  created() {
    this.updateCurrentStore()
  },

  computed: {
    ...mapGetters([
      'property',
      'timezone',
      'processedStores',
      'findBannerByName',
      'findCategoryById',
      'processedCategories',
      'findPromoById',
    ]),
    pageBanner() {
      var pageBanner = null
      var temp_repo = this.findBannerByName('Directory Banner')
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

    orderedHours() {
      var ordered_hours = _.sortBy(
        _.filter(this.storeHours, function(o) {
          return o.day_of_week !== 0
        }),
        ['day_of_week']
      )
      var sunday = _.find(this.storeHours, function(o) {
        return o.day_of_week === 0
      })
      ordered_hours.push(sunday)
      return ordered_hours
    },
  },
  methods: {
    updateCurrentStore() {
      if (this.currentStore) {
        var vm = this
        //reformat websites
        if (this.currentStore.website) {
          if (_.includes(this.currentStore.website, 'https')) {
            this.currentStore.website = _.replace(
              this.currentStore.website,
              'https://',
              ''
            )
          } else if (_.includes(this.currentStore.website, 'http')) {
            this.currentStore.website = _.replace(
              this.currentStore.website,
              'http://',
              ''
            )
          }
          this.currentStore.website = 'http://' + this.currentStore.website
        }
        // DELIVERY
        var delivery_category = _.find(this.processedCategories, function(o) {
          return o.slug === 'delivery'
        })
        var categories = this.currentStore.categories
        var subcategories = _.filter(this.processedCategories, function(o) {
          return o.parent_category_id === delivery_category.id
        })

        if (delivery_category && !_.isEmpty(subcategories)) {
          var _this = this

          _.forEach(subcategories, function(val) {
            if (_.includes(_this.currentStore.categories, val.id)) {
              if (_.includes(val.slug, 'uber')) {
                _this.hasUberEats = true
              }

              if (_.includes(val.slug, 'doordash')) {
                _this.hasDoordash = true
              }
              if (_.includes(val.slug, 'grubhub')) {
                _this.hasGrubhub = true
              }
              if (_.includes(val.slug, 'postmates')) {
                _this.hasPostmates = true
              }
              if (_.includes(val.slug, 'restaurant-delivery')) {
                _this.hasRestaurantDelivery = true
              }
            }
          })
          if (
            this.hasUberEats ||
            this.hasDoordash ||
            this.hasPostmates ||
            this.hasRestaurantDelivery
          ) {
            this.deliveryAvailable = true
          }
        }

        this.storePromotions = this.currentStore.promotions
        this.storeEvents = this.currentStore.storeEvents

        // Update store hours with holiday hours
        var _this = this
        if (this.currentStore.hours) {
          var storeHours = []
          var _this = this
          //find holiday in the current week
          var next_holiday = []
          var start_week = moment()
            .tz(this.timezone)
            .startOf('isoWeek')
          start_week = moment(start_week).format('X')
          var end_week = moment()
            .tz(this.timezone)
            .endOf('isoWeek')
          end_week = moment(end_week).format('X')
          _.forEach(this.currentStore.hours.holiday_hours, function(
            value,
            key
          ) {
            var this_holiday = value
            var holiday_date = moment(this_holiday.holiday_date)
              .hour(0)
              .minute(0)
              .tz(_this.timezone)
              .format('X')
            // If its a multiday holiday, check to see if any holidays are in that week
            if (this_holiday.holiday_end_date) {
              // Convert end date
              var holiday_end_date = moment(this_holiday.holiday_end_date)
                .tz(_this.timezone)
                .format('X')
              _.forEach(
                _.range(
                  0,
                  moment(this_holiday.holiday_end_date).diff(
                    moment(this_holiday.holiday_date),
                    'days'
                  ) + 1
                ),

                function(i) {
                  var current_holiday = {}
                  var current_date = moment(this_holiday.holiday_date).add(
                    i,
                    'days'
                  )

                  // current_holiday.day_of_week = moment(current_holiday.date).day()
                  current_holiday.date = current_date
                    .hour(0)
                    .minute(0)
                    .format()
                  current_holiday.close_time = this_holiday.close_time
                  current_holiday.day_of_week = moment(
                    current_holiday.date
                  ).day()
                  current_holiday.holiday_date = current_date
                  current_holiday.holiday_name = this_holiday.holiday_name
                  current_holiday.open_time = this_holiday.open_time
                  current_holiday.is_closed = this_holiday.is_closed
                  current_holiday.is_holiday = this_holiday.is_holiday
                  current_holiday.open_full_day = this_holiday.open_full_day

                  var temp_date = moment(current_holiday.date).format('X')

                  if (temp_date >= start_week && temp_date <= end_week) {
                    next_holiday.push(current_holiday)
                  }
                }
              )
            } else if (holiday_date >= start_week && holiday_date <= end_week) {
              // Set the day_of_week for each Holiday Date
              this_holiday.day_of_week = moment(this_holiday.holiday_date).day()
              next_holiday.push(this_holiday)
            }
          })
          //go through regular hours and replace it with holiday hours
          _.forEach(this.currentStore.hours.regular_hours, function(
            value,
            key
          ) {
            var holiday = _.find(next_holiday, function(o) {
              return o.day_of_week === value.day_of_week
            })
            if (holiday) {
              value = holiday
            }
            if (value.day_of_week === 0) {
              value.order = 7
            } else {
              value.order = value.day_of_week
            }
            storeHours.push(value)
          })
          this.storeHours = _.orderBy(storeHours, ['order'])
          this.todaysHour = this.currentStore.hours.todays_hours
          console.log(this.todaysHour)
        }

        //update seo
        if (!_.isEmpty(this.tempSEO)) {
          this.currentSEO = this.localeSEO(this.tempSEO)
        }
      } else {
        this.$router.replace('/stores')
      }
    },
    updateMap(map) {
      this.map = map
      setTimeout(
        () => {
          this.dropPin(this.currentStore)
        },
        500,
        this
      )
    },
    dropPin(store) {
      if (this.$refs.map_ref) {
        var map_id = null
        // Find store data from mapplic
        _.forEach(this.mapData.levels, function(o) {
          map_id = _.find(o.locations, function(location) {
            return location.store_id == store.id
          })
          if (map_id) return false
        })
        if (map_id) this.$refs.map_ref.showLocation(map_id.id)
      }
    },
  },
}
</script>
