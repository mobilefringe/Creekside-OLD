<template>
  <div class="popup-container" v-if="currentPopup && showPopup">
    <i class="fa fa-times close-popup" @click="closePopup()"></i>
    <a v-if="currentPopup.photo_link" :href="currentPopup.photo_link" target="_target">
      <img :src="currentPopup.image_url" alt />
    </a>
    <template v-else>
      <img :src="currentPopup.image_url" alt />
    </template>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Cookies from 'js-cookie'
export default {
  data() {
    return {
      showPopup: false,
      currentPopup: null
    }
  },
  created() {
    this.loadData().then(response => {
      var popup = null

      if (this.$store.state.popups && this.$store.state.popups.length > 0) {
        popup = this.$store.state.popups[0]
      }
      this.currentPopup = popup
      var viewed = null
      viewed = Cookies.get('popup_viewed')

      if (this.currentPopup && viewed !== 'true') {
        Cookies.set('popup_viewed', 'true')
        this.showPopup = true

        $('<div class="modal-backdrop custom-backdrop"></div>').appendTo(
          document.body
        )
      }
    })
  },
  watch: {
    showPopup() {
      if (this.showPopup === true) {
        document.body.classList.add('no-scroll')
      } else if (this.showPopup === false) {
        document.body.classList.remove('no-scroll')
      }
    }
  },
  computed: {
    ...mapGetters(['property', 'timezone'])
  },
  methods: {
    closePopup() {
      this.showPopup = false
      $('.modal-backdrop').remove()
    },
    loadData: async function() {
      try {
        let results = await Promise.all([
          this.$store.dispatch('getMMData', { resource: 'popups' })
        ])
        return results
      } catch (e) {
        console.log('Error loading data: ' + e.message)
      }
    }
  }
}
</script>
<style>
/******** popup ***********/
.custom-backdrop {
  opacity: 0.5;
}

.close-popup {
  height: 33px;
  width: 56px;
  left: auto;
  right: 0px;
  bottom: auto;
  top: 0px;
  padding: 8px;
  color: #000000;
  font-size: 12px;
  line-height: 14px;
  border-left: 1px solid #000000;
  border-bottom: 1px solid #000000;
  border-radius: 0px;
  box-shadow: 0px 0px 0px 0px rgba(2, 2, 2, 0.23);
  text-shadow: 0px 0px 0px rgba(0, 0, 0, 0.23);
  background-color: #ccc;
  text-align: center;
  position: absolute;
  font-weight: 700;
  cursor: pointer;
}

.popup-container {
  position: absolute;
  z-index: 1041;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.popup-container img {
  max-width: 100%;
  max-height: 800px;
}
.no-scroll {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

@media (max-width: 425px) {
  .popup-container {
    width: 90%;
  }
}
</style>
