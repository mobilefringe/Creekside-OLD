<template>
  <div v-if="currentContest">
    <inside-page-banner :pageBanner="pageBanner" :pageTitle="currentContest.name"></inside-page-banner>
    <div class="main_container">
      <div class="row">
        <div class="col-md-12">
          <breadcrumb-component page_name="Contest" :has_parent="false"></breadcrumb-component>
        </div>
      </div>
      <div class="row">
        <div class="col-md-8 col-md-offset-2">
          <img
            v-if="currentContest.image_url"
            class="img_max"
            :src="currentContest.image_url"
            :alt="currentContest.name"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-md-8 col-md-offset-2">
          <h2 v-if="currentContest.name" class="contest_title">{{currentContest.name}}</h2>
          <div
            v-if="currentContest.description"
            class="contest_desc"
            v-html="currentContest.description"
          ></div>
          <hr style="margin: 40px 0" />
          <transition name="fade">
            <div>
              <div
                id="send_contact_success"
                class="alert alert-success text-left"
                role="alert"
                v-show="formSuccess"
              >
                <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
                <span class="sr-only">Success</span>
                Good luck and thank you for entering our contest.
              </div>
              <div
                id="send_contact_error"
                class="alert alert-danger text-left"
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
            id="contest_form"
            class="form-horizontal clearfix"
            action="form-submit"
            v-on:submit.prevent="validateBeforeSubmit"
          >
            <div class="form-group">
              <div class="col-sm-6 col-xs-12" :class="{'has-error': errors.has('first_name')}">
                <label class="visuallyhidden" for="first_name">Please enter your First Name</label>
                <input
                  id="first_name"
                  v-model="form_data.first_name"
                  v-validate="'required:true'"
                  class="form-control"
                  :class="{'input': true}"
                  name="first_name"
                  type="text"
                  placeholder="First Name *"
                  data-vv-delay="500"
                  data-vv-as="first name"
                  required
                />
                <span
                  v-show="errors.has('first_name')"
                  class="form-control-feedback"
                >{{ errors.first('first_name') }}</span>
              </div>
              <div class="col-sm-6 col-xs-12" :class="{'has-error': errors.has('last_name')}">
                <label class="visuallyhidden" for="last_name">Please enter your Last Name</label>
                <input
                  id="last_name"
                  v-model="form_data.last_name"
                  v-validate="'required:true'"
                  class="form-control"
                  :class="{'input': true}"
                  name="last_name"
                  type="text"
                  placeholder="Last Name *"
                  data-vv-delay="500"
                  data-vv-as="last name"
                />
                <span
                  v-show="errors.has('last_name')"
                  class="form-control-feedback"
                >{{ errors.first('last_name') }}</span>
              </div>
            </div>
            <div class="form-group">
              <div class="col-sm-12 col-xs-12" :class="{'has-error': errors.has('email')}">
                <label class="visuallyhidden" for="email">Please enter your Email Address</label>
                <input
                  id="email"
                  v-model="form_data.email"
                  v-validate="'required|email'"
                  class="form-control"
                  :class="{'input': true}"
                  name="email"
                  type="email"
                  placeholder="Email Address *"
                  data-vv-delay="500"
                  data-vv-as="email"
                />
                <span
                  v-show="errors.has('email')"
                  class="form-control-feedback"
                >{{ errors.first('email') }}</span>
              </div>
              <!-- <div class="col-sm-6 col-xs-12" :class="{'has-error': errors.has('phone')}">
                <label class="visuallyhidden" for="phone">Please enter your Phone Number</label>
                <input
                  id="phone"
                  v-model="form_data.phone"
                  v-validate="'required:true'"
                  class="form-control"
                  :class="{'input': true}"
                  name="phone"
                  type="text"
                  placeholder="Phone Number *"
                  v-mask="'(999) 999-9999'"
                  data-vv-delay="500"
                  data-vv-as="phone"
                />
                <span
                  v-show="errors.has('phone')"
                  class="form-control-feedback"
                >{{ errors.first('phone') }}</span>
              </div> -->
              <div class="col-xs-12">
                <hr />
              </div>
            </div>
            <template v-if="currentContest.slug.includes('recognize-your-local-community-heroes')">
              <div class="form-group">
                <div class="col-sm-6 col-xs-12" :class="{'has-error': errors.has('hero_name')}">
                  <label class="visuallyhidden" for="hero_name">Please enter your Local Hero's Name</label>
                  <input
                    id="hero_name"
                    v-model="form_data.hero_name"
                    v-validate="'required:true'"
                    class="form-control"
                    :class="{'input': true}"
                    name="hero_name"
                    type="text"
                    placeholder="Local Hero's Name *"
                    data-vv-delay="500"
                    data-vv-as="hero_name"
                  />
                  <span
                    v-show="errors.has('hero_name')"
                    class="form-control-feedback"
                  >{{ errors.first('hero_name') }}</span>
                </div>
                <div class="col-sm-6 col-xs-12" :class="{'has-error': errors.has('hero_job')}">
                  <label
                    class="visuallyhidden"
                    for="hero_job"
                  >Please enter the Local Hero's Job Title or Field</label>
                  <input
                    id="hero_job"
                    v-model="form_data.hero_job"
                    v-validate="'required:true'"
                    class="form-control"
                    :class="{'input': true}"
                    name="hero_job"
                    type="text"
                    placeholder="Local Hero's Job Title or Field *"
                    data-vv-delay="500"
                    data-vv-as="hero_job"
                  />
                  <span
                    v-show="errors.has('hero_job')"
                    class="form-control-feedback"
                  >{{ errors.first('hero_job') }}</span>
                </div>
              </div>
            </template>
            <div class="form-group" v-if="currentContest.use_contest_image">
              <div class="col-sm-6 col-xs-12" :class="{'has-error': errors.has('contest_photo')}">
                <label
                  class="visuallyhidden"
                  for="contest_photo"
                >Please upload an image of your file</label>
                <input
                  id="contest_photo"
                  @change="onFileChange"
                  v-validate="'required:true'"
                  class
                  type="file"
                  name="contest_photo"
                  data-vv-delay="500"
                  data-vv-as="image"
                />
                <span
                  v-show="errors.has('contest_photo')"
                  class="form-control-feedback"
                >{{ errors.first('contest_photo') }}</span>
              </div>
            </div>

            <div class="form-inline row margin_40">
              <div class="col-xs-12">
                <label class="checkbox">
                  <input name="agree_terms" type="checkbox" required />
                  I am over the age of 18. *
                </label>
              </div>
              <div class="col-xs-12" :class="{'has-error': errors.has('agree_newsletter')}">
                <label class="checkbox">
                  <input name="agree_newsletter" type="checkbox" v-model="form_data.newsletter" />
                  I agree to receive newsletters from {{ property.name }}. (You can unsubscribe at anytime)
                </label>
              </div>
              <div class="col-xs-12">
                <hr style="margin: 40px 0" />
                <p>
                  For more details about personal privacy, please read our
                  <a
                    href="/pages/creekside-rules-and-regulations"
                    target="_blank"
                  >Privacy Policy</a>.
                </p>
              </div>
            </div>
            <div class="form-group">
              <div class="col-xs-12 margin_60">
                <button class="animated_btn" type="submit" :disabled="formSuccess">Submit</button>
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
import Vue from 'vue'

import AwesomeMask from 'awesome-mask'
import VueSocialSharing from 'vue-social-sharing'

Vue.use(VueSocialSharing)
export default {
  head() {
    return this.currentSEO
  },
  data() {
    return {
      tempSEO: {},
      currentSEO: {},
      currentContest: null,
      form_data: {},
      formSuccess: false,
      formError: false,
      showShareContainer: false
    }
  },
  directives: {
    mask: AwesomeMask
  },
  components: {
    InsidePageBanner: () => import('~/components/InsidePageBanner.vue'),
    BreadcrumbComponent: () => import('~/components/BreadcrumbComponent.vue')
  },
  async asyncData({ store, route }) {
    try {
      let results = await Promise.all([
        store.dispatch('LOAD_SEO', {
          url: '/contests/' + route.params.slug
        }),
        store.dispatch('getMMData', { resource: 'contests' })
      ])
      return {
        tempSEO: results[0].data
      }
    } catch (e) {
      console.log(e.message)
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.$nextTick(function() {
      this.updateCurrentContest(this.$route.params.slug)
    })

    next()
  },
  created() {
    this.updateCurrentContest(this.$route.params.slug)
  },
  watch: {
    formSuccess() {
      setTimeout(function() {
        var position = $('#send_contact_success').offset().top - 250
        $('html, body').animate(
          {
            scrollTop: position
          },
          500,
          'linear'
        )
      }, 700)
    }
  },
  computed: {
    ...mapGetters([
      'property',
      'timezone',
      'findBannerByName',
      'processedContests',
      'findContestBySlug'
    ]),

    pageBanner() {
      var pageBanner = null
      var temp_repo = this.findBannerByName('Events & Promotions Banner')
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
    updateCurrentContest(id) {
      this.currentContest = this.findContestBySlug(id)

      if (!this.currentContest) {
        this.$router.replace('/')
      }
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      this.contestPhoto = files[0]
    },
    validateBeforeSubmit(form) {
      this.$validator.validateAll().then(result => {
        if (result) {
          var vm = this
          let formData = new FormData()
          _.forOwn(this.form_data, function (value, key) {
            console.log(value, key)
            formData.append('json[' + key + ']', value)
          })
          if (this.currentContest.use_contest_image) {
            formData.append('contest_photo', this.contestPhoto)
          }
          
          var url =
            process.env.MM_API_URL + 'contest/' + this.currentContest.slug
          $.ajax({
            url: url,
            type: 'POST',
            processData: false,
            contentType: false,
            data: formData,
            success: function (data) {
              vm.formSuccess = true
            },
            error: function (data) {
              vm.formError = true
            },
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
