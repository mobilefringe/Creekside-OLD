<template>
  <header>
    <h1 class="accessibility">{{ property.name }}</h1>
    <section id="header" class="sticky">
      <div class="main_container">
        <div class="row">
          <div class="col-md-12">
            <div class="social_icon_container">
              <social-links></social-links>
            </div>
            <div class="site_logo center-block" :class="{ mini_logo: scrollY }">
              <a href="/">
                <img :alt="property.name" src="/images/mall-logo.jpg" />
              </a>
            </div>
            <div @click="showMenu = !showMenu" :class="{ open: showMenu }" id="menu-icon">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <nav v-if="menu_items" id="primary_nav" role="navigation" aria-label="Main">
              <ul>
                <li
                  v-for="(item) in menu_items"
                  :key="item.id"
                  :class="{'dropdown':item.sub_menu, 'toggle-on-focus': subMenuID == item.id}"
                >
                  <a v-if="item.external" :href="item.href" class="menu-item" target="_blank">
                    <span class="hvr-underline-from-center">{{item.name}}</span>
                  </a>
                  <nuxt-link v-else-if="item.href" class="menu-item" :to="item.href">
                    <span class="hvr-underline-from-center">{{item.name}}</span>
                  </nuxt-link>
                  <span
                    v-else
                    tabindex="0"
                    class="menu-item"
                    @focus="showSubMenu(item.id)"
                    @blur="hideSubMenu()"
                  >{{item.name}}</span>

                  <!-- <span v-if="item.sub_menu" class="fa fa-caret-down"></span> -->
                  <transition v-on:enter="enter" v-on:leave="leave">
                    <ul v-if="item.sub_menu" class="dropdown-content">
                      <!-- <ul class="container d-flex"> -->
                      <li
                        v-for="sub_menu in item.sub_menu"
                        :key="sub_menu.id"
                        class="dropdown-item"
                      >
                        <a
                          v-if="sub_menu.target"
                          :href="sub_menu.href"
                          class="submenu-item"
                          target="_blank"
                          @focus.native="showSubMenu(item.id)"
                          @blur.native="hideSubMenu()"
                          @click.native="hideSubMenu()"
                        >{{sub_menu.name}}</a>
                        <nuxt-link
                          v-else
                          :to="sub_menu.href"
                          class="submenu-item"
                          tabindex="0"
                          @focus.native="showSubMenu(item.id)"
                          @blur.native="hideSubMenu()"
                          @click.native="hideSubMenu()"
                        >{{sub_menu.name}}</nuxt-link>
                      </li>
                      <!-- </ul> -->
                    </ul>
                  </transition>
                </li>
              </ul>
            </nav>
            <div class="nav_container visible_phone">
              <transition
                name="custom-classes-transition"
                enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight"
              >
              <nav id="mobile_nav" v-show="showMenu" role="navigation" aria-label="Mobile">
                  <ul>
                    <li v-for="(item, key) in menu_items" class="menu_item">
                      <nuxt-link :to="item.href" v-if="item.href">
                        <div class="btn-block">{{item.name}}</div>
                      </nuxt-link>
                      <div v-else role="tablist">
                        <b-card no-body class="mb-1">
                          <b-card-header header-tag="div" class="p-1">
                            <b-btn block href="#" v-b-toggle="item.id" variant="info">
                              {{item.name}}
                              <span class="when-open"><i class="fas fa-angle-down"></i></span>
                              <span class="when-closed"><i class="fas fa-angle-right"></i></span>
                            </b-btn>
                          </b-card-header>
                          <b-collapse :id="item.id" accordion="my-accordion" class="accordion_body">
                            <b-card-body v-for="sub_menu in item.sub_menu">
                              <p class="card-text">
                                <a
                                  v-if="sub_menu.target"
                                  :href="sub_menu.href"
                                  target="_blank"
                                >{{ sub_menu.name }}</a>
                                <nuxt-link v-else :to="sub_menu.href">{{(sub_menu.name)}}</nuxt-link>
                              </p>
                            </b-card-body>
                          </b-collapse>
                        </b-card>
                      </div>
                    </li>
                  </ul>
                  <div class="mobile_social_icon_container">
                    <p class="social_title">Follow Us on social media</p>
                    <social-links></social-links>
                  </div>
                </nav>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </section>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import tz from 'moment-timezone'

export default {
  data() {
    return {
      showMenu: false,
      showMobileMenu: false,
      showSubMenuItem: false,
      subMenuID: '',
      noScroll: false,
      windowWidth: 0,
      scrollY: false
    }
  },
  props: ['menu_items'],
  components: {
    SocialLinks: () => import('~/components/PropertySocialLinks.vue')
  },
  watch: {
    $route() {
      if (this.windowWidth <= 768) {
        this.showMenu = false
      }
      _.forEach(this.menu_items, function(value, key) {
        value.show_sub_menu = false
      })
    },
    showMenu() {
      if (this.showMenu == true) {
        document.body.classList.add('no_scroll')
      } else if (this.showMenu == false) {
        document.body.classList.remove('no_scroll')
      }
    }
  },
  created() {
    this.$nextTick(function() {
      window.addEventListener('scroll', this.handleScroll)
      window.addEventListener('resize', this.getWindowWidth)
      this.getWindowWidth()
    })
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener('scroll', this.handleScroll)
      window.addEventListener('resize', this.getWindowWidth)
      //Init
      this.getWindowWidth()
    })
  },
  computed: {
    ...mapGetters(['property', 'timezone', 'hours', 'getTodayHours']),
    locale: {
      get() {
        return this.$store.state.locale
      },
      set(value) {
        this.$store.commit('SET_LOCALE', { lang: value })
      }
    },
    todays_hours() {
      return this.getTodayHours
    }
  },
  methods: {
    changeLocale(val) {
      // this will update the data store, which in turn will trigger the watcher to update the locale in the system
      this.locale = val
    },
    showSubMenu(id) {
      this.subMenuID = id
    },
    hideSubMenu() {
      this.subMenuID = null
    },
    handleScroll(event) {
      var scrolled = window.pageYOffset
      if (scrolled >= 150) {
        this.scrollY = true
      } else {
        this.scrollY = false
      }
    },
    getWindowWidth(event) {
      this.windowWidth = window.innerWidth
    },
    onOptionSelect(option) {
      this.$nextTick(function() {
        this.search = ''
      })
      this.$router.push('/stores/' + option.slug)
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('resize', this.getWindowWidth)
  }
}
</script>
