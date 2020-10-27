<template>
  <storelist-component
    :pageBanner="pageBanner"
    pageTitle="Directory"
    :dropDownCats="dropDownCats"
    :allStores="allStores"
    :breadcrumb="breadcrumb"
  ></storelist-component>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  head() {
    return this.currentSEO
  },
  data() {
    return {
      tempSEO: {},
      currentSEO: {},
      dineFilter: 6174,
      breadcrumb: {
        page_name: 'Directory',
        has_parent: false,
        parent_name: '',
        parent_slug: ''
      }
    }
  },
  components: {
    StorelistComponent: () => import('~/components/StorelistComponent.vue')
  },
  async asyncData({ store, params, route }) {
    try {
      let results = await Promise.all([
        store.dispatch('LOAD_SEO', { url: '/stores' }),
        store.dispatch('getMMData', { resource: 'stores' }),
        store.dispatch('getMMData', { resource: 'categories' }),
        store.dispatch('getMMData', { resource: 'banners' })
      ])
      return {
        tempSEO: results[0].data
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
    ...mapGetters([
      'findBannerByName',
      'processedStores',
      'processedCategories'
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
    allStores() {
      var store_list = []
      var vm = this
      _.forEach(this.processedStores, function(value, key) {
        if (!value.logo_image_url) {
          value.no_store_logo = true
        } else {
          value.no_store_logo = false
        }

        // Create list of custom store tags
        var flags = []
        if (value.tags) {
          var store_tags = value.tags
          _.forEach(store_tags, function(tag, key) {
            flags.push(tag)
          })
        }
        if (value.is_new_store) {
          flags.push('New')
        } else if (value.is_coming_soon_store) {
          flags.push('Coming Soon')
        } else if (value.is_relocated_store) {
          flags.push('Relocated')
        } else if (value.active_promotions_count > 0) {
          flags.push('Promotion')
        } else if (value.active_events_count > 0) {
          flags.push('Event')
        } else if (value.active_jobs_count > 0) {
          flags.push('Job')
        }
        if (flags.length > 3) {
          flags = _.slice(flags, 0, 3)
        }
        value.store_flags = flags
        store_list.push(value)
      })
      this.filteredStores = store_list
      return store_list
    },
    dropDownCats() {
      var vm = this;
      var categories = this.processedCategories
      var storeCats = this.processedStores.map(a => a.categories);
      var uniqueStoreCats = Array.from(new Set(storeCats.join().split(",").map(x=>+x).sort()));
      var cats = _.filter(categories, function(o) {
        return (
          o.name &&
          o.name.length > 0 &&
          !o.parent_category_id && uniqueStoreCats.includes(o.id)
        )
      })

      cats = _.map(_.orderBy(cats, ['name']), 'name')
      cats.unshift('All')
      return cats
    }
  }
}
</script>
