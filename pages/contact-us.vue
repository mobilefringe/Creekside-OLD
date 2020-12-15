<template>
  <div class="contact-us-container">
    <inside-page-banner :pageBanner="pageBanner" pageTitle="Contact Us"></inside-page-banner>

    <div class="main_container">
      <div class="row">
        <div class="col-md-12">
          <breadcrumb-component
            page_name="Contact Us"
            :has_parent="false"
          ></breadcrumb-component>
        </div>
      </div>

      <div class="row">
        <div class="col-md-4 contact_us_container">
          <div v-if="contactInfo" class="margin_60 padding_60" v-html="contactInfo.body"></div>
        </div>
        <div class="col-md-8">
          <transition name="fadeIn">
            <div>
              <div
                id="send_contact_success"
                class="alert alert-success"
                role="alert"
                v-show="formSuccess"
              >
                <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                <span class="sr-only">Success</span>
                Thank you for contacting us. A member from our team will contact you shortly.
              </div>
              <div
                id="send_contact_error"
                class="alert alert-danger"
                role="alert"
                v-show="formError"
              >
                <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                <span class="sr-only">Error:</span>
                There was an error when trying to submit your request. Please try again later.
              </div>
            </div>
          </transition>
          <form
            id="contact_form"
            class="form-horizontal clearfix"
            action="form-submit"
            v-on:submit.prevent="validateBeforeSubmit"
          >
            <div class="row">
              <div class="col-xs-12 col-md-6" :class="{'has-error': errors.has('name')}">
                <label class="visuallyhidden" for="name">Name</label>
                <input
                  id="name"
                  v-model="form_data.name"
                  v-validate="'required|alpha_spaces'"
                  class="form-control"
                  :class="{'input': true}"
                  name="name"
                  type="text"
                  data-vv-delay="1000"
                  placeholder="Name *"
                />
                <span
                  v-show="errors.has('name')"
                  class="form-control-feedback"
                >{{ errors.first('name') }}</span>
              </div>
              <div class="col-xs-12 col-md-6" :class="{'has-error': errors.has('email')}">
                <label class="visuallyhidden" for="email">Email</label>
                <input
                  id="email"
                  v-model="form_data.email"
                  v-validate="'required|email'"
                  class="form-control"
                  :class="{'input': true}"
                  name="email"
                  type="email"
                  data-vv-delay="1000"
                  placeholder="Email *"
                />
                <span
                  v-show="errors.has('email')"
                  class="form-control-feedback"
                >{{ errors.first('email') }}</span>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-12 col-md-6" :class="{'has-error': errors.has('phone')}">
                <label class="visuallyhidden" for="phone">Phone</label>
                <input
                  id="phone"
                  v-model="form_data.phone"
                  v-validate="'required:true'"
                  class="form-control"
                  :class="{'input': true}"
                  name="phone"
                  type="text"
                  v-mask="'(999) 999-9999'"
                  data-vv-delay="1000"
                  placeholder="Phone *"
                />
                <span
                  v-show="errors.has('phone')"
                  class="form-control-feedback"
                >{{ errors.first('phone') }}</span>
              </div>
              <div class="col-xs-12 col-md-6" :class="{'has-error': errors.has('subject')}">
                <label class="visuallyhidden" for="subject">Subject</label>
                <input
                  id="subject"
                  v-model="form_data.subject"
                  v-validate="'required:true'"
                  class="form-control"
                  :class="{'input': true}"
                  name="subject"
                  type="text"
                  data-vv-delay="1000"
                  placeholder="Subject *"
                />
                <span
                  v-show="errors.has('subject')"
                  class="form-control-feedback"
                >{{ errors.first('subject') }}</span>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-12" :class="{'has-error': errors.has('message')}">
                <label class="visuallyhidden" for="message">Message</label>
                <textarea
                  id="message"
                  v-model="form_data.message"
                  v-validate="'required:true'"
                  class="form-control"
                  :class="{'input': true}"
                  name="message"
                  type="text"
                  data-vv-delay="1000"
                  placeholder="Message *"
                ></textarea>
                <span
                  v-show="errors.has('message')"
                  class="form-control-feedback"
                >{{ errors.first('message') }}</span>
              </div>
            </div>
            <div class="row margin_60">
              <div class="col-xs-12">
                <button class="submit animated_btn" type="submit" :disabled="formSuccess">Submit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import AwesomeMask from 'awesome-mask'
export default {
  head() {
    return this.currentSEO
  },
  data() {
    return {
      tempSEO: {},
      currentSEO: {},
      currentPage: null,
      contactInfo: null,
      form_data: {},
      loginPending: null,
      formSuccess: false,
      formError: false,
      time: new Date()
    }
  },
  directives: {
    mask: AwesomeMask
  },
  async asyncData({ store, params, route }) {
    try {
      let results = await Promise.all([
        store.dispatch('LOAD_SEO', { url: '/contact-us' }),
        store.dispatch('getMMData', { resource: 'pages' })
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
    BreadcrumbComponent: () => import('~/components/BreadcrumbComponent.vue'),
    googleMap: () => import('~/components/googleMap.vue')
  },
  created() {
    if (!_.isEmpty(this.tempSEO)) {
      this.currentSEO = this.localeSEO(this.tempSEO)
    }
    this.updateCurrentPage()
  },
  computed: {
    ...mapGetters([
      'timezone',
      'findBannerByName',
      'propertyHours',
      'propertyHolidayHours',
      'findPageBySlug',
      'findBannerByName'
    ]),
    pageBanner() {
      var pageBanner = null
      var temp_repo = this.findBannerByName('Contact Us Banner')
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
    }
  },
  methods: {
    updateCurrentPage() {
      this.currentPage = this.findPageBySlug('creekside-contact-us')
      this.contactInfo =
        this.currentPage.subpages && this.currentPage.subpages[0]
          ? this.currentPage.subpages[0]
          : null
    },

    validateBeforeSubmit(form) {
      this.$validator.validateAll().then(result => {
        // if no error submit the form
        if (result) {
          var vm = this

          let send_data = new FormData()
          send_data.append('mailto', 'smartinez@vestar.com,hmccue@vestar.com') // smartinez@vestar.com,hmccue@vestar.com
          send_data.append('from_email', this.form_data.email)
          send_data.append(
            'subject',
            this.form_data.subject + ' from ' + this.property.name
          )
          send_data.append('custom[Name]', this.form_data.name)
          send_data.append('custom[Email]', this.form_data.email)
          send_data.append('custom[Phone]', this.form_data.phone)
          send_data.append('custom[Subject]', this.form_data.subject)
          send_data.append('custom[Message]', this.form_data.message)

          fetch('https://home.mallmaverick.com/custom_email.js', {
            method: 'post',
            body: send_data
          })
            .then(result => {
              vm.formSuccess = true
              vm.formError = false
            })
            .catch(error => {
              vm.formError = true
              vm.formSuccess = false
            })
        } else {
          // this.formError = true
          return false
        }
      })
    }
  }
}
</script>
