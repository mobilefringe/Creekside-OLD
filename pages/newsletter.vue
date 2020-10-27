<template>
  <div v-if="currentPage">
    <inside-page-banner :pageBanner="pageBanner" :pageTitle="currentPage.title"></inside-page-banner>

    <div class="main_container">
      <div class="row">
        <div class="col-md-12">
          <breadcrumb-component
            page_name="Newsletter Sign-Up"
            :has_parent="false"
          ></breadcrumb-component>
          <div v-if="currentPage" v-html="currentPage.body"></div>
          <form class="newsletter_form form-horizontal" action="//mobilefringe.createsend.com/t/d/s/urall/" method="post">
                                <div class="row">
                                    <div class="col-sm-6" >
                                        <label for="fieldgvuhk" class="visuallyhidden">First Name</label>
                                        <input v-model="form_data.first_name" required class="margin_20 form-control" id="fieldgvuhk" name="cm-f-gvuhk" type="text" placeholder="First Name">
                                    </div>
                                    <div class="col-sm-6" >
                                        <label for="fieldgvuhu" class="visuallyhidden">Last Name</label>
                                        <input v-model="form_data.last_name" required class="margin_20 form-control" id="fieldgvuhu" name="cm-f-gvuhu" type="text" placeholder="Last Name">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-12">
                                        <label for="newsletter_email" class="visuallyhidden">Email</label>
                                        <input v-model="form_data.email" required class="margin_20 form-control" name="cm-urall-urall" type="email" placeholder="Email" id="newsletter_email">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div style="margin-left: 20px">
                                            <label class="checkbox">
                                                <input name="agree_newsletter" required  type="checkbox">
                                                    I agree to receive communications from {{ property.name }}.
                                            </label>
                                        </div>
            					    </div>
            					</div>
        					    <div class="margin_20 clearfix"></div>
        					    <div class="row margin_20">
                                    <div class="col-xs-12">
                                        <button class="animated_btn" type="submit" :disabled="formSuccess">Subscribe</button>
                                    </div>
                                </div>
                                <!--<div id="send_contact_success" class="alert alert-success" role="alert" v-show="formSuccess">-->
                                <!--    <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>-->
                                <!--    <span class="sr-only">{{$t("newsletter_page.success")}} : </span>-->
                                <!--    Thank you! Your subscription has been confirmed.-->
                                <!--</div>-->
                                <!--<div id="send_contact_error" class="alert alert-danger" role="alert" v-show="formError">-->
                                <!--    <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>-->
                                <!--    <span class="sr-only">{{$t("newsletter_page.error")}} : </span>-->
                                <!--    There was an error when trying to submit your request. Please try again later.-->
                                <!--</div>-->
                            </form> 
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  head() {
   return{
      title: this.tempSEO.meta_title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.tempSEO.meta_description
        }
      ],
      script: [
        {
          src:
            'https://js.createsend1.com/javascript/copypastesubscribeformlogic.js',
          type: 'text/javascript'
        }
      ]
    }
  },
  data() {
    return {
      tempSEO: {},
      currentSEO: {},
      currentPage: null,
      form_data: {},
      formSuccess: false,
      formError: false
    }
  },
  components: {
    InsidePageBanner: () => import('~/components/InsidePageBanner.vue'),
    BreadcrumbComponent: () => import('~/components/BreadcrumbComponent.vue')
  },
  async asyncData({ store, params, route }) {
    try {
      let results = await Promise.all([
        store.dispatch('LOAD_SEO', { url: '/newsletter' }),
        store.dispatch('getMMData', { resource: 'pages' })
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
    this.updateCurrentPage()
  },
  mounted() {
    this.form_data.first_name = this.$route.query.name
    $('#fieldfihudt').val(this.form_data.first_name)
    this.form_data.email = this.$route.query.email
    $('#newsletter_email').val(this.form_data.email)
  },
  watch: {
    $route() {
      this.form_data.first_name = this.$route.query.name
      $('#fieldfihudt').val(this.form_data.first_name)
      this.form_data.email = this.$route.query.email
      $('#newsletter_email').val(this.form_data.email)
    }
  },
  computed: {
    ...mapGetters(['property', 'findBannerByName', 'findPageBySlug']),

    pageBanner() {
      var currentPageBanner = {}

      var slug = this.$route.params.slug

      if (this.currentPage && this.currentPage.banner_url) {
        currentPageBanner.image_url = this.currentPage.banner_url
      } else {
        var temp_repo = null
        temp_repo = this.findBannerByName('Newsletter Banner')
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
  },
  methods: {
    updateCurrentPage() {
      this.currentPage = this.findPageBySlug('creekside-newsletter')
    }
  }
}
</script>
