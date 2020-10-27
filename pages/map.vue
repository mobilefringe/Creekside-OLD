<template>
  <div class="map-content-container">
    <inside-page-banner :pageBanner="pageBanner" pageTitle="Center Map"></inside-page-banner>
    <div class="main_container">
      <div class="row">
        <div class="col-md-12">
          <breadcrumb-component
            page_name="Center Map"
            :has_parent="true"
            parent_name="Directory"
            parent_slug="/stores"
          ></breadcrumb-component>
        </div>
      </div>
      <div class="row margin_60">
        <div class="col-md-3">
          <h2 class="store_list_title margin_20">Select a Category</h2>
          <div class="map_category">
            <v-select
              v-model="selectedCat"
              :options="dropDownCats"
              :searchable="false"
              :on-change="filterByCategory"
              class="category-select"
              placeholder="Category"
              id="selectByCat"
            ></v-select>
          </div>
          <div class="map_search">
            <search-component
              v-model="storeSearch"
              :list="processedStores"
              :suggestion-attribute="suggestionAttribute"
              @select="onOptionSelect"
              :threshold="1"
            >
              <template slot="item" scope="option">
                <article class="media">
                  <p>{{ option.data.name }}</p>
                </article>
              </template>
            </search-component>
            <i id="store-search-icon" class="fa fa-search" aria-hidden="true"></i>
          </div>
          <div tabindex="0" class="store_list_container" v-if="filteredStores">
            <p
              tabindex="0"
              class="store_name"
              v-for="store in filteredStores"
              v-on:focus="dropPin(store)"
              v-on:click="dropPin(store)"
            >{{store.name}}</p>
          </div>
        </div>
        <div class="col-md-9">
          <!-- <mapplic-map
            ref="mapplic_ref"
            :height="664"
            :minimap="false"
            :deeplinking="false"
            :sidebar="false"
            :hovertip="true"
            :maxscale="5"
            :storelist="processedStores"
            tooltiplabel="View Store Details"
          ></mapplic-map>-->
          <mapplic-map
            class
            ref="map_ref"
            :height="664"
            :minimap="false"
            :deeplinking="false"
            :sidebar="false"
            :hovertip="true"
            :maxscale="5"
            :mousewheel="false"
            :storelist="processedStores"
            :mapData="mapData"
            tooltiplabel="View Store Details"
            @updateMap="updateMap"
          ></mapplic-map>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  head() {
    return this.currentSEO
  },
  data: function() {
    return {
      tempSEO: {},
      currentSEO: {},
      attributes: {
        ref: 'openIndicator',
        role: 'presentation',
        class: 'vs__open-indicator'
      },

      selectedCat: null,
      filteredStores: null,
      suggestionAttribute: 'name',
      storeSearch: null,
      currentSelection: null,
      dineFilter: 6174
    }
  },
  components: {
    MapplicMap: () => import('~/components/Mapplic.vue'),
    SearchComponent: () => import('~/components/SearchComponent.vue'),
    VSelect: () => import('vue-select'),
    InsidePageBanner: () => import('~/components/InsidePageBanner.vue'),
    BreadcrumbComponent: () => import('~/components/BreadcrumbComponent.vue')
  },
  async asyncData({ store, params, route }) {
    try {
      let results = await Promise.all([
        store.dispatch('LOAD_SEO', { url: '/map' }),
        store.dispatch('getMMData', { resource: 'stores' }),
        store.dispatch('LOAD_PAGE_DATA', {
          url:
            process.env.MM_API_URL + '/mapplic?api_key=' + process.env.API_KEY
        }),
        store.dispatch('getMMData', { resource: 'categories' })
      ])
      return {
        tempSEO: results[0].data,
        mapData: results[2].data
      }
    } catch (e) {
      console.log(e.message)
    }
  },
  // mounted() {
  //   // if params store_id is passed, set selectedStore
  //   var store_id = this.$route.params.store_id
  //   if (store_id) {
  //     this.selectedStore = _.find(this.processedStores, function(o) {
  //       return o.id == store_id
  //     })
  //   }
  // },
  created(){
    if (!_.isEmpty(this.tempSEO)) {
      this.currentSEO = this.localeSEO(this.tempSEO)
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
    pageBanner() {
      var pageBanner = null
      var temp_repo = this.findBannerByName('Map Banner')
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
    dropDownCats() {
      var vm = this
      var categories = this.processedCategories
      var cats = _.filter(categories, function(o) {
        return (
          _.toNumber(o.id) !== vm.dineFilter &&
          o.name &&
          o.name.length > 0 &&
          !o.parent_category_id
        )
      })

      cats = _.map(_.orderBy(cats, ['name']), 'name')
      cats.unshift('All')
      return cats
    },
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
        this.filteredStores = this.processedStores
      } else {
        var find = this.findCategoryById
        var filtered = _.filter(this.processedStores, function(o) {
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
    updateMap(map) {
      this.map = map
      if (this.selectedStore) {
        this.dropPin(this.selectedStore)
      }
    },
    dropPin(store) {
      if (this.$refs.map_ref) {
        if (this.isMobile) this.showStoreList = false
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
    onOptionSelect(option) {
      this.search_result = ''
      this.$refs.map_ref.hideLocation()
      this.dropPin(option)
    }
    // onSearchInput(val) {
    //   this.searchResult = val
    //   if (this.searchResult.length == 0) {
    //     // this.resetEvents()
    //     this.$refs.map_ref.hideLocation()
    //     this.$refs.map_ref.moveTo(0.5, 0.5, 1)
    //   }
    // }
  }
}
</script>
