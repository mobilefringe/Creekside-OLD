<template>
  <div style="position:relative; margin: auto;width: 100%;overflow: hidden;">
    <div id="mapplic" class="mapplic"></div>
  </div>
</template>

<script>
import mapplic from '~/assets/javascripts/mapplic'
import '~/assets/stylesheets/mapplic.css'
export default {
  props: {
    mapData: {
      type: Object,
      required: true
    },
    storelist: {
      type: Array,
      required: true
    },
    categories: {
      type: Array
    },
    height: {
      type: Number,
      default: 1000
    },
    landmark: {
      type: String,
      default: null
    },
    mapfill: {
      type: Boolean,
      default: false
    },
    markers: {
      type: Boolean,
      default: true
    },
    minimap: {
      type: Boolean,
      default: true
    },
    sidebar: {
      type: Boolean,
      default: true
    },
    search: {
      type: Boolean,
      default: true
    },
    lightbox: {
      type: Boolean,
      default: false
    },
    deeplinking: {
      type: Boolean,
      default: true
    },
    clearbutton: {
      type: Boolean,
      default: false
    },
    zoombuttons: {
      type: Boolean,
      default: true
    },
    zoomoutclose: {
      type: Boolean,
      default: false
    },
    hovertip: {
      type: Boolean,
      default: false
    },
    tooltip: {
      type: Object,
      default: function() {
        return {
          thumb: true,
          desc: true,
          link: true
        }
      }
    },
    smartip: {
      type: Boolean,
      default: true
    },
    mousewheel: {
      type: Boolean,
      default: true
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    fillcolor: {
      type: String,
      default: 'none'
    },
    action: {
      type: String,
      default: 'tooltip'
    },
    maxscale: {
      type: Number,
      default: 4
    },
    zoom: {
      type: Boolean,
      default: true
    },
    bindLocationOpened: {
      type: Boolean,
      default: false
    },
    bindLocationClosed: {
      type: Boolean,
      default: false
    },
    bindLevelSwitched: {
      type: Boolean,
      default: false
    },
    bindPositionChanged: {
      type: Boolean,
      default: false
    },
    svgWidth: {
      type: Number,
      default: 2500
    },
    svgHeight: {
      type: Number,
      default: 2500
    },
    svgId: {
      type: String,
      default: 'landmarks-1'
    },
    tooltiplabel: {
      type: String,
      default: 'More'
    },
    showPin: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      map: null,
      self: null,
      developer: false,
      showLoader: true,
      locationJSON: {}
    }
  },
  computed: {
    options() {
      var options = {
        source: this.locationJSON,
        height: this.height,
        landmark: this.landmark,
        mapfill: this.mapfill,
        markers: this.markers,
        minimap: this.minimap,
        sidebar: this.sidebar,
        search: this.search,
        lightbox: this.lightbox,
        deeplinking: this.deeplinking,
        clearbutton: this.clearbutton,
        zoombuttons: this.zoombuttons,
        zoomoutclose: this.zoomoutclose,
        hovertip: this.hovertip,
        tooltip: this.tooltip,
        smartip: this.smartip,
        mousewheel: this.mousewheel,
        fullscreen: this.fullscreen,
        developer: this.developer,
        fillcolor: this.fillcolor,
        action: this.action,
        maxscale: this.maxscale,
        zoom: this.zoom,
        tooltiplabel: this.tooltiplabel
      }
      return options
    },
    svgList() {
      return _.map(this.storelist, 'svgmap_region')
    }
  },
  mounted() {
    // Lets loops through mapData and hide pins
    this.locationJSON = this.mapData
    var _this = this
    _.forEach(this.locationJSON.levels, function(level) {
      _.forEach(level.locations, function(location) {
        _this.$set(location, 'pin', 'hidden')
        var store = _.find(_this.storelist, function(o) {
          return o.id == location.store_id
        })
        if (store) {
          //   //custom image
          //   if (store.store_front_image_url) {
          //     location.image = store.store_front_image_url
          //   }
          //custom location link
          location.link = '/stores/' + store.slug
          //   if (store.phone || store.location_information) {
          //     // custom location description
          //     location.description = '<p>' + '<ul class="list-unstyled">'
          //     if (store.phone) {
          //       location.description +=
          //         ' <li class="mb-4">' +
          //         '<div class="font-weight-bold text-uppercase">Phone</div>' +
          //         '<span id="storePhone">' +
          //         store.phone +
          //         '</span>' +
          //         ' </li>'
          //     }
          //     if (store.location_information) {
          //       location.description +=
          //         '<li class="mb-4">' +
          //         ' <div class="font-weight-bold text-uppercase">Location</div>' +
          //         '<span id="storeLocation">' +
          //         store.location_information +
          //         '</span>' +
          //         '</li>'
          //     }
          //     location.description += '</ul>' + '</p>'
          //   }
        }
        location.zoom = 5
      })
    })

    if (this.locationJSON.levels && this.locationJSON.levels.length > 0) {
      // Create Init Store
      var initZoom = {}
      initZoom.id = 'init'
      initZoom.pin = 'hidden'
      initZoom.z_coordinate = 1
      initZoom.x = 0.5
      initZoom.y = 0.5
      if (this.isMobile) {
        initZoom.zoom = 1
      } else {
        initZoom.zoom = 2
      }
      this.locationJSON.levels[0].locations.push(initZoom)
    }
    // this.store_source = this.loadStoreData();
    this.initMapplic()
  },
  methods: {
    getTooltip() {
      //   { thumb: true, desc: true, link: true }
      return {
        thumb: true,
        desc: true,
        link: true
      }
    },
    initMapplic() {
      this.map = $('#mapplic').mapplic(this.options)
      //this.self = this.map.data('mapplic');
      this.map.on('mapready', this.mapready)
      if (this.bindLocationOpened) {
        $('body').on('locationopened', this.locationopened)
      }
      if (this.bindLocationClosed) {
        $('body').on('locationclosed', this.locationclosed)
      }
      if (this.bindLevelSwitched) {
        $('body').on('levelswitched', this.levelswitched)
      }
      if (this.bindPositionChanged) {
        $('body').on('positionchanged', this.positionchanged)
      }
    },
    mapready(e, location) {
      console.log('Map is ready!')
      this.self = location

      // this.mapLoaded()
      this.$emit('updateMap')
    },
    locationopened(e, loc) {
      if (loc) {
        console.log(loc.title + ' opened.')
        console.log(loc)
      }
    },
    locationclosed(e) {
      console.log('Location closed.')
    },
    levelswitched(e, level) {
      if (level) {
        console.log('Switched to ' + level + ' level.')
      }
    },
    positionchanged(e, self) {
      if (self) {
        console.log('Pan or zoom performed, current scale: ' + self)
      }
    },
    switchLevel(target) {
      this.self.switchLevel(target)
    },
    moveTo(x, y, s, d) {
      this.self.moveTo(x, y, s, d)
    },
    getLocationData(id) {
      this.self.getLocationData(id)
    },
    showLocation(id, d) {
      this.self.showLocation(id, d)
      
    },
    hideLocation() {
      this.self.hideLocation()
    },
    updateLocation(id) {
      this.self.updateLocation(id)
    },
    addActiveClass(id) {
      $('#' + id).removeClass('mapplic-active')
      $('#' + id).addClass('mapplic-active')
    }
  },
  beforeDestroy: function() {
    // this.map.destroy();

    this.map.off('mapready', this.mapready)
    if (this.bindLocationOpened) {
      $('body').off('locationopened', this.locationopened)
    }
    if (this.bindLocationClosed) {
      $('body').off('locationclosed', this.locationclosed)
    }
    if (this.bindLevelSwitched) {
      $('body').off('levelswitched', this.levelswitched)
    }
    if (this.bindPositionChanged) {
      $('body').off('positionchanged', this.positionchanged)
    }

    console.log('Destroyed!')
  }
}
</script>


<style lang="scss">
// @import '~/assets/stylesheets/mapplic.css';
.mapplic-pin {
  /*background-color: transparent!important;    */
}

/* INTERACTIVE ELEMENTS */

/* clickable elements */

.mapplic-clickable:not(g),
g.mapplic-clickable > * {
  opacity: 1 !important;
  /*fill: #b7a6bd*/
}

/* hovered elements */

.mapplic-clickable:not(g):hover,
g.mapplic-clickable:hover > * {
  opacity: 1;
  fill: #858585;
}

/* active elements */

.mapplic-active,
a.mapplic-active > path,
g.mapplic-active > * {
  fill: #6b6b6b;
  opacity: 1 !important;
}


/*.mapplic-coordinates {*/

/*    visibility: hidden;*/

/*}*/
</style>
