// import helper from '~/assets/javascripts/helper'
import Vue from 'vue'
import moment from 'moment';
import tz from 'moment-timezone';
import velocity from 'velocity-animate'
import {
  mapGetters
} from 'vuex'

Vue.mixin({
  data() {
    return {
      isMobile: false,
      isTablet: false,
      subdomain: '', // UPDATE SUBDOMAIN
      windowWidth: window.innerWidth,
      siteInfo: {
        "googleMapsURL": "https://goo.gl/maps/rdPC7Hm3LQT2",
        "instagramURL": "https://www.instagram.com/districtatgvr",
        "propertyManagementName": "Vestar",
        "propertyManagementURL": "http://www.vestar.com/"
      }
    }
  },
  created() {
    window.addEventListener('resize', this.getWindowWidth);
    this.getWindowWidth();
  },
  computed: {
    ...mapGetters(['property']),
    defaultLogoURL() {
      return ''; // UPDATE DEFAULT LOGO URL
    },
    twitterUsername() {
      return ''; // UPDATE PROPERTY TWITTER USERNAME
    },
    propertyBanner() {
      var pageBanner = null
      var temp_repo = this.findBannerByName('Property Banner')
      if (temp_repo && temp_repo.gallery_items) {
        pageBanner = temp_repo.gallery_items[0]
      } else {
        pageBanner = {}
        pageBanner.image_url = ''
      }
      return pageBanner
    },
    social_media() {
      var social = this.property.social_links
      return social
    },
    getPropertyAddress() {
      return (
        this.property.address1 +
        ', ' +
        this.property.city +
        ', ' +
        this.property.province_state +
        ' ' +
        this.property.postal_code
      )
    }
  },
  methods: {
    getWindowWidth() {
      this.windowWidth = window.innerWidth
      if (window.innerWidth <= 768) {
        this.isMobile = true
      } else {
        this.isMobile = false
      }

    },
    checkImageURL(value) {
      if (!value.image_url) {
        if (!value.store) {
          return this.default_logo_url;
        } else if (
          value.store &&
          !value.store.logo_image_url) {
          return null;
        } else {
          return value.store.logo_image_url
        }
      } else {
        return value.image_url
      }
    },
    isMultiDay(item) {
      if (item.start_date && item.end_date) {
        var start_date = moment(item.start_date).tz(this.timezone).format('MM-DD-YYYY')
        var end_date = moment(item.end_date).tz(this.timezone).format('MM-DD-YYYY')
        if (start_date === end_date) {
          return false
        } else {
          return true
        }
      }
      return false
    },
    checkStoreImageURL(store) {
      if (store === null || store === undefined) {
        return this.default_logo_url;
      } else if (
        store != null &&
        store != undefined &&
        _.includes(store.store_front_url_abs, 'missing')
      ) {
        return this.default_logo_url;
      } else {
        return store.store_front_url_abs
      }
    },
    truncate(val_body, length, delimiter = '...') {
      var truncate = _.truncate(val_body, {
        length: length,
        separator: " ",
        omission: delimiter
      });
      return truncate;
    },
    snakeCase(val) {
      return _.snakeCase(val);
    },
    isMissingImage(image_url) {
      return _.includes(image_url, 'missing');
    },
    serializeObject(obj) {
      var newObj = [];
      _.forEach(obj, function (value, key) {
        var tempVal = {};
        tempVal.name = key;
        tempVal.value = value;
        newObj.push(tempVal);
      });
      return newObj;
    },
    beforeEnter: function (el) {
      el.style.opacity = 0
    },
    enter: function (el, done) {
      velocity(el, 'slideDown', {
        duration: 700
      })
    },
    leave: function (el, done) {
      velocity(el, 'slideUp', {
        duration: 700
      })
    },
    shareURL(slug, path) {
      var share_url = 'https://www.shopthedistrictgvr.com/' + path + '/' + slug
      return share_url
    },
    localeSEO(tempSEO) {
      var seo = {
        meta: []
      }
      // Set static copyright tag
      var copyright_year = moment().year();
      seo.meta.push({
        hid: 'copyright',
        name: 'copyright',
        content: copyright_year + ' All Rights Reserved' // add property management here
      })
      // Set og:url tag
      var current_route = this.$route;
      var current_url = "";
      if (_.includes(current_route.name, "index")) {
        current_url = this.property.url;
      } else {
        current_url = this.property.url + this.$route.fullPath;
      }
      seo.meta.push({
        hid: 'og:url',
        name: 'og:url',
        content: current_url
      })
      //Set og:type tag
      seo.meta.push({
        hid: 'og:type',
        name: 'og:type',
        content: 'website'
      })

      if (tempSEO) {
        //update seo
        if (tempSEO.meta_title) {
          seo.title = tempSEO.meta_title
          seo.meta.push({
            hid: 'title',
            name: 'title',
            content: tempSEO.meta_title
          })
          //for facebook scrapping
          seo.meta.push({
            hid: 'og:title',
            name: 'og:title',
            content: tempSEO.meta_title
          })
        }

        if (tempSEO.meta_description) {
          seo.meta.push({
            hid: 'description',
            name: 'description',
            content: tempSEO.meta_description
          })
          //for facebook scrapping
          seo.meta.push({
            hid: 'og:description',
            name: 'og:description',
            content: tempSEO.meta_description
          })
        }

        if (tempSEO.meta_keywords) {
          seo.meta.push({
            hid: 'keywords',
            name: 'keywords',
            content: tempSEO.meta_keywords
          })
        }

        if (tempSEO.image_url) {
          seo.meta.push({
            hid: 'image',
            name: 'image',
            content: tempSEO.image_url
          })
          //for facebook scrapping
          seo.meta.push({
            hid: 'og:image',
            name: 'og:image',
            content: tempSEO.image_url
          })
        }

        if (tempSEO.canonical) {
          //canonical tag
          seo.link = [];
          seo.link.push({
            rel: 'canonical',
            href: tempSEO.canonical
          })
        }
      }
      return seo
    },
    removeTags(string) {
      var first = string.replace(/<[^>]*>/g, ' ').trim()
      var second = _.unescape(first)
      return unescape(second)
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.getWindowWidth)
  }
})
