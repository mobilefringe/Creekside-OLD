<template>
  <div>
    <inside-page-banner :pageBanner="pageBanner" :pageTitle="currentPage.title"></inside-page-banner>

    <div class="main_container">
      <div class="row">
        <div class="col-md-12">
          <breadcrumb-component :page_name="currentPage.title" :has_parent="false"></breadcrumb-component>
        </div>
      </div>
      <div class="row margin_60">
        <div class="col-md-12">
          <div class="page_body" v-html="currentPage.body"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: ['currentPage'],
  components: {
    InsidePageBanner: () => import('~/components/InsidePageBanner.vue'),
    BreadcrumbComponent: () => import('~/components/BreadcrumbComponent.vue')
  },
  computed: {
    ...mapGetters(['property', 'findBannerByName']),

    pageBanner() {
      var currentPageBanner = {}

      var slug = this.$route.params.slug

      if (this.currentPage && this.currentPage.banner_url) {
        currentPageBanner.image_url = this.currentPage.banner_url
      } else {
        var temp_repo = null
        temp_repo = this.findBannerByName('Pages Banner')
        var pageBanner = null
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
        currentPageBanner = pageBanner
      }
      return currentPageBanner
    }
  }
}
</script>
