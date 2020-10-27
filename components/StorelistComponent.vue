<template>
  <div>
    <inside-page-banner :pageBanner="pageBanner" :pageTitle="pageTitle ? pageTitle : null"></inside-page-banner>

    <div class="main_container">
      <div class="row">
        <div class="col-md-12">
          <breadcrumb-component
            :page_name="breadcrumb.page_name"
            :has_parent="breadcrumb.has_parent"
            :parent_name="breadcrumb.parent_name"
            :parent_slug="breadcrumb.parent_slug"
          ></breadcrumb-component>
        </div>
      </div>
      <div class="row margin_40">
        <div class="col-md-6 clearfix">
          <button class="animated_btn stores_btn" @click="toggleView()">{{ toggleText }}</button>
          <nuxt-link to="/map">
            <div class="animated_btn stores_btn">Center Map</div>
          </nuxt-link>
        </div>
        <div class="col-md-6 clearfix">
          <div class="store_search">
            <search-component
              v-if="allStores"
              :list="allStores"
              placeholder="Search"
              suggestion-attribute="name"
              v-model="search_result"
              @select="onOptionSelect"
              class="text-left"
            >
              <template slot="item" scope="option" class="manual">
                <article class="media">
                  <p>{{ option.data.name }}</p>
                </article>
              </template>
            </search-component>
            <i class="fa fa-search"></i>
          </div>
          <div class="store_category">
            <v-select
              v-model="selectedCat"
              :options="dropDownCats"
              :searchable="false"
              :on-change="filterByCategory"
              class="category-select"
              placeholder="Category"
              id="selectByCat"
              transition="dropdown-fade"
            ></v-select>
          </div>
        </div>
      </div>
      <!-- Logo View -->
      <div v-if="logoView" class="margin_60">
        <div
          v-masonry
          transition-duration="0.3s"
          item-selector=".stores-grid-item"
          horizontal-order="true"
        >
          <transition-group
            name="custom-classes-transition"
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
            tag="div"
          >
            <div
              v-masonry-tile
              v-for="(store, index) in filteredStores"
              :key="index"
              class="stores-grid-item"
            >
              <div class="store_logo_container">
                <nuxt-link :to="'/stores/'+ store.slug">
                  <!--<img class="store_img" :src="store.image_url" alt="">-->
                  <div v-if="!store.no_store_logo">
                    <img
                      class="transparent_logo"
                      src="/images/default_background.png"
                      alt="transparent logo"
                    />
                    <img class="store_img" :src="store.logo_image_url" alt />
                  </div>

                  <div v-else class="no_logo_container">
                    <img class="transparent_logo" src="/images/default_background.png" alt />
                    <div class="no_logo_text">
                      <div class="store_text">
                        <h2>{{ store.name }}</h2>
                      </div>
                    </div>
                  </div>
                  <div v-if="store.store_flags">
                    <div class="store_tag" v-for="(tag, index) in store.store_flags">
                      <div class="store_tag_text">{{ tag }}</div>
                    </div>
                  </div>
                  <div class="store_details">
                    <div class="store_text">
                      <h2>{{ store.name }}</h2>
                    </div>
                  </div>
                </nuxt-link>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
      <!-- List View -->
      <div v-if="listView" class="margin_60 listView">
        <transition-group
          name="custom-classes-transition"
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          tag="div"
        >
          <div v-for="(store, index) in filteredStores" :key="index">
            <div class="store_name">
              <nuxt-link :to="'/stores/'+ store.slug" class="hvr-underline-from-center">
                <p>{{ store.name }}</p>
              </nuxt-link>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import NoSSR from 'vue-no-ssr'
import Vue from 'vue'
import { VueMasonryPlugin } from 'vue-masonry'

Vue.use(VueMasonryPlugin)
export default {
  head() {
    return this.currentSEO
  },
  props: ['pageBanner', 'pageTitle', 'dropDownCats', 'allStores', 'breadcrumb'],
  data() {
    return {
      selectedCat: null,
      filteredStores: null,
      search_result: null,
      query: '',
      toggleText: 'Display as List',
      logoView: true,
      listView: false
    }
  },
  components: {
    SearchComponent: () => import('~/components/SearchComponent.vue'),
    VSelect: () => import('vue-select'),
    'no-ssr': NoSSR,
    InsidePageBanner: () => import('~/components/InsidePageBanner.vue'),
    BreadcrumbComponent: () => import('~/components/BreadcrumbComponent.vue')
  },

  // beforeMount() {
  //   window.addEventListener('scroll', this.isScrolled)
  // },
  created() {
    if (!_.isEmpty(this.tempSEO)) {
      this.currentSEO = this.localeSEO(this.tempSEO)
    }
    this.query = this.$route.query.category

    if (this.query == 'dining_full_service') {
      this.selectedCat = 'Dining Full Service'
      this.filterByCategory
    } else {
      this.selectedCat = 'All'
      this.filteredStores = this.allStores
    }
  },
  mounted() {
    if (typeof this.$redrawVueMasonry === 'function') {
      this.$redrawVueMasonry()
    }
  },
  watch: {
    $route: function() {
      this.query = this.$route.query.category
      if (this.query == 'dining_full_service') {
        this.selectedCat = 'Dining Full Service'
        this.filterByCategory
      } else {
        this.selectedCat = 'All'
        this.filteredStores = this.allStores
      }
    },
    selectedCat: function() {
      this.$nextTick(function() {
        if (typeof this.$redrawVueMasonry === 'function') {
          this.$redrawVueMasonry()
        }
      })
    },
    windowWidth: function() {
      if (this.windowWidth <= 768) {
        this.mobile_store = true
      } else {
        this.mobile_store = false
      }
    }
  },
  computed: {
    ...mapGetters([
      'property',
      'timezone',
      'findBannerByName',
      'processedStores',
      'processedCategories',
      'findCategoryByName'
    ]),
    filterByCategory() {
      var category_id = this.selectedCat
      if (
        category_id == 'All' ||
        category_id == null ||
        category_id == undefined
      ) {
        category_id = 'All'
      } else {
        category_id = this.findCategoryByName(category_id).id
      }

      if (category_id == 'All') {
        this.filteredStores = this.allStores
      } else {
        var find = this.findCategoryById
        var filtered = _.filter(this.allStores, function(o) {
          return _.indexOf(o.categories, _.toNumber(category_id)) > -1
        })
        this.filteredStores = filtered
      }
      var el = document.getElementById('selectByCat')
      if (el) {
        el.classList.remove('open')
      }
    }
  },
  methods: {
    toggleView() {
      if (this.logoView) {
        this.toggleText = 'Display as Logos'
        this.listView = true
        this.logoView = false
      } else if (this.listView) {
        this.toggleText = 'Display as List'
        this.logoView = true
        this.listView = false
      }
    },
    onOptionSelect(option) {
      this.search_result = ''
      this.$router.push('/stores/' + option.slug)
    }
    // loadMore() {
    //   if (this.showMore <= this.filteredStores.length) {
    //     var num = this.showMore + this.incrementBy
    //     this.showMore = num
    //   }
    // },
    // isScrolled() {
    //   if (window.pageYOffset > 300) {
    //     var button = document.getElementById('load_more')
    //     if (button) {
    //       this.isScrolledIntoView(button)
    //     }
    //   }
    // },
    // isScrolledIntoView(button) {
    //   var docViewTop = $(window).scrollTop()
    //   var docViewBottom = docViewTop + $(window).height()
    //   var elemTop = $(button).offset().top
    //   var elemBottom = elemTop + $(button).height()

    //   if (elemBottom <= docViewBottom && elemTop >= docViewTop) {
    //     this.loadMore()
    //   }
    // }
  }
  // beforeDestroy: function() {
  //   window.removeEventListener('scroll', this.isScrolled)
  // }
}
</script>
