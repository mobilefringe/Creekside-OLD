<template>
  <div class="google_map_container">
    <div class="g_map" :id="divID"></div>
  </div>
</template>

<script>
export default {
  head: {
    script: [
      {
        src:
          'https://maps.googleapis.com/maps/api/js?key=AIzaSyBvHM4ewuH0uIMvBknY9TZFmrfPP07QSmo'
      }
    ]
  },
  transition: 'page',
  props: {
    zoom: {
      type: Number,
      default: 15
    },
    icon: {
      type: String
    },
    divID: {
      type: String,
      default: 'map'
    },
    lat: {
      type: Number,
      default: 15
    },
    lng: {
      type: Number,
      default: 15
    },
    showInfoBox: {
      type: Boolean,
      default: false
    },
    image: {
      type: String
    },
    name: {
      type: String
    },
    street: {
      type: String
    },
    city: {
      type: String
    },
    state: {
      type: String
    },
    zipcode: {
      type: String
    },
    phone: {
      type: String
    }
  },
  data: function() {
    return {
      position: null
    }
  },
  mounted() {
    var new_pos = {}
    new_pos.lat = this.lat
    new_pos.lng = this.lng
    this.position = new_pos
  },
  watch: {
    position() {
      setTimeout(
        () => {
          this.initMap()
        },
        500,
        this
      )
    }
  },
  methods: {
    initMap() {
      // Styles a map in night mode.
      var map = new google.maps.Map(document.getElementById(this.divID), {
        center: this.position,
        zoom: this.zoom,
        styles: []
      })
      if (this.showInfoBox) {
        var contentString =
          '<div id="mapMallInfoWindow" class="row no-gutters ff-primary p-3">' +
          '<div class="col-4 pr-3">' +
          '<img src="' +
          this.image +
          '" class="img-fluid">' +
          '</div>' +
          '<div class="col-8">' +
          '<span class="h6">' +
          this.name +
          '</span> <br>' +
          this.street +
          ' <br>' +
          this.city +
          ', ' +
          this.state +
          ' ' +
          this.zipcode +
          '<br>' +
          this.phone +
          '</div>' +
          '</div>'
        var infowindow = new google.maps.InfoWindow({
          content: contentString
        })
      }
      if (this.icon) {
        var marker = new google.maps.Marker({
          position: this.position,
          icon: this.icon,
          map: map
        })
        if (infowindow) {
          infowindow.open(map, marker)
        }
      } else {
        var marker = new google.maps.Marker({
          position: this.position,
          map: map
        })
        if (infowindow) {
          infowindow.open(map, marker)
        }
      }
    }
  }
}
</script>

<style>
/* Always set the map height explicitly to define the size of the div
       * element that contains the map. */
.g_map {
  height: 100%;
}
</style>
