<template>
  <div>
    <div class="home_banner_container">
      <div class="prev">
        <i class="fas fa-caret-left"></i>
      </div>
      <slick ref="slick" :options="slickOptions">
        <div v-if="homeBanners" v-for="banner in homeBanners">
          <div v-if="banner.name && banner.callout" class="banner_height">
            <div
              class="banner_image"
              v-bind:style="{ backgroundImage: 'url(' + banner.image_url + ')' }"
            ></div>
            <div class="banner_content_container">
              <div class="banner_content">
                <span v-if="banner.heading" class="banner_heading">{{ banner.heading }}</span>
                <h1 class="banner_title">{{ banner.name }}</h1>
                <p class="banner_text">{{ banner.callout }}</p>
                <a :href="banner.url" :aria-label="banner.name">
                  <span class="banner_btn animated_btn">Find Out More</span>
                </a>
              </div>
            </div>
          </div>
          <div v-else-if="!banner.url">
            <div
              class="banner_image"
              v-bind:style="{ backgroundImage: 'url(' + banner.image_url + ')' }"
            ></div>
          </div>
          <div v-else>
            <a :href="banner.url" :aria-label="banner.name">
              <div
                class="banner_image"
                v-bind:style="{ backgroundImage: 'url(' + banner.image_url + ')' }"
              ></div>
            </a>
          </div>
        </div>
      </slick>
      <div class="next">
        <i class="fas fa-caret-right"></i>
      </div>
    </div>
    <div v-if="homepage" class="main_container">
      <div class="message_content">
        <h1 class="center" v-if="homepage.welcome_message">{{ homepage.welcome_message }}</h1>
        <p class="center" v-if="homepage.callout">{{ homepage.callout }}</p>
      </div>
    </div>
    <div class="main_container">
      <template v-if="featuredItems && featuredItems.length > 0">
      <h2 class="home_title center" >Events & Promotions</h2>
      <div class="row margin_40 home_events">
        <div class="col-sm-4" v-if="featuredItems" v-for="item in featuredItems">
          <div v-if="item.eventable_type" class="feature_item_container">
            <nuxt-link class="tile" :to="'/events/'+item.slug">
              <!-- <img :src="item.image_url" :alt="'Event: ' + item.name" /> -->
              <div class="feature_image" :style="{ backgroundImage: 'url(' + item.image_url + ')' }">
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
                    <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                  </p>
                </span>
              </div>
              </div>

            </nuxt-link>
          </div>
          <div v-if="item.promotionable_id" class="feature_item_container">
            <nuxt-link class="tile" :to="'/promotions/'+item.slug">
              <!-- <img :src="item.image_url" :alt="'Promotion: ' + item.name" /> -->
              <div class="feature_image" :style="{ backgroundImage: 'url(' + item.image_url + ')' }">
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
                    <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                  </p>
                </span>
              </div>
              </div>

            </nuxt-link>
          </div>
        </div>
      </div></template>
      <div v-if="instaFeed.length > 0">
      <h2 class="home_title center">In Our Feed</h2>
      </div>
      <div class="row hidden-xs margin_60">
        <div class="col-md-8 col-md-offset-2">
          <div class="insta-feed-container">
            <div class="insta-feed-image" v-for="(item, index) in instaFeed">
              <a
                :href="item.link"
                target="_blank"
                :aria-label="'View Post on Instagram: ' + item.caption.text"
              >
                <div
                  class="insta-img"
                  v-bind:style="{ 'background-image': 'url(' + item.images.standard_resolution.url + ')' }"
                ></div>
                <div class="insta_content">
                  <p class="insta_caption">{{ item.caption.text }}</p>
                  <p class="insta_user">@{{ item.user.username }}</p>
                  <i class="insta_icon fab fa-instagram"></i>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="visible-xs margin_60 insta-feed-container">
        <div class="insta_prev"></div>
        <slick ref="slick" :options="instaOptions">
          <div class="insta-feed-image" v-for="(item, index) in instaFeed">
            <a
              :href="item.link"
              target="_blank"
              :aria-label="'View Post on Instagram: ' + item.caption.text"
            >
              <div
                class="insta-img"
                v-bind:style="{ 'background-image': 'url(' + item.images.standard_resolution.url + ')' }"
              ></div>
              <div class="insta_content">
                <p class="insta_caption">{{ item.caption.text }}</p>
                <p class="insta_user">@{{ item.user.username }}</p>
                <i class="insta_icon fab fa-instagram"></i>
              </div>
            </a>
          </div>
        </slick>
        <div class="insta_next"></div>
      </div>
    </div>
  </div>
</template>

<script>
import '~/node_modules/slick-carousel/slick/slick.css'
import '~/node_modules/slick-carousel/slick/slick-theme.scss'

import { mapGetters } from 'vuex'
export default {
  head() {
    return this.currentSEO
  },
  components: {
    Slick: () => import('vue-slick')
  },
  data() {
    return {
      slickOptions: {
        adaptiveHeight: true,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 9000,
        cssEase: 'linear',
        dots: true,
        fade: true,
        infinite: true,
        slidesToShow: 1,
        speed: 1000,
        nextArrow: '.next',
        prevArrow: '.prev',
        responsive: [
          {
            breakpoint: 768,
            settings: {
              pauseOnFocus: false,
              pauseOnHover: false,
              swipe: false,
              waitForAnimate: false
            },
            breakpoint: 480,
            settings: {
              pauseOnFocus: false,
              pauseOnHover: false,
              swipe: false,
              waitForAnimate: false
            }
          }
        ]
      },
      instaOptions: {
        arrows: true,
        autoplay: true,
        autoplaySpeed: 8000,
        cssEase: 'linear',
        dots: false,
        fade: true,
        infinite: true,
        slidesToShow: 1,
        speed: 1000,
        nextArrow: '.insta_next',
        prevArrow: '.insta_prev'
      },
      tempSEO: {},
      currentSEO: {}
    }
  },
  async asyncData({ store, params, route }) {
    try {
      let results = await Promise.all([
        store.dispatch('LOAD_SEO', { url: route.fullPath }),
        store.dispatch('getMMData', { resource: 'homepage' }),
        store.dispatch('LOAD_PAGE_DATA', {
          url: 'https://assets.mallmaverick.com/api/v4/creekside/social.json'
        })
      ])
      return {
        tempSEO: results[0].data,
        socialFeed: results[2].data.social ? results[2].data.social : null
      }
    } catch (e) {
      console.log(e.message)
    }
  },
  created() {
    if (!_.isEmpty(this.tempSEO)) {
      this.currentSEO = this.localeSEO(this.tempSEO)
    }
  },
  computed: {
    ...mapGetters(['property', 'homepage', 'timezone']),
    homeBanners() {
      var banners = []
      var home_page = this.homepage
      if (
        home_page.banners &&
        home_page.banners[0] &&
        home_page.banners[0].gallery_items
      ) {
        banners = _.orderBy(
          home_page.banners[0].gallery_items,
          ['position'],
          ['asc']
        )
        var _this = this
        _.forEach(banners, function(banner, key) {
          if (!_.includes(banner.image_url, '?')) {
            banner.image_url = banner.image_url + '?auto=compress'
          }
        })
      }
      return banners
    },
    featuredItems() {
      var promos = this.homepage.featured_on_home_page_promotions
      var events = this.homepage.featured_on_home_page_events
      _.forEach(promos, function(val) {
        val.link = '/promotions/' + val.slug
        val.property_name = val.promotionable.name
        if(!val.image_url){
          val.image_url = require('@/static/images/mall-logo.jpg')
        }
      })
      _.forEach(events, function(val) {
        val.link = '/events/' + val.slug
        val.property_name = val.eventable.name
        if(!val.image_url){
          val.image_url = require('@/static/images/mall-logo.jpg')
        }
      })
      return _.concat(promos, events)
    },
    instaFeed() {
      var instaFeed = []
      if (this.socialFeed && this.socialFeed.instagram) {
        instaFeed = _.slice(
          _.orderBy(
            _.filter(this.socialFeed.instagram, function(o) {
              if (o.caption != null) {
                o.caption.text = _.truncate(o.caption.text, {
                  length: 60,
                  separator: ' '
                })
              }
              return !o.images['standard_resolution'].url.includes('//video-')
            }),
            ['created_time']
          ),
          0,
          6
        )
      }
      return instaFeed
    }
  }
}
</script>
