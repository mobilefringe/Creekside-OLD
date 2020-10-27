<template>
  <div>
    <header-component :menu_items="menu_items" />
    <main class="main-content-container">
      <nuxt class="router-content" :class="{'inside-pages' : $route.path !== '/'}" />
    </main>
    <footer-component />
    <image-popup></image-popup>
  </div>
</template>
<script>
import '@fortawesome/fontawesome-pro/css/all.css'
import 'lazysizes'
import 'lazysizes/plugins/unveilhooks/ls.unveilhooks'
export default {
  components: {
    HeaderComponent: () => import('~/components/HeaderComponent.vue'),
    FooterComponent: () => import('~/components/FooterComponent.vue'),
    ImagePopup: () => import('~/components/ImagePopup.vue')
  },
  data() {
    return {
      menu_items: [
        {
          name: 'Directory',
          id: 'menu1',

          sub_menu: [
            {
              name: 'Directory',
              href: '/stores',
              target: false
            },
            {
              name: 'Center Map',
              href: '/map',
              target: false
            },
            {
              name: 'Dining',
              href: '/dine',
              target: false
            },
            {
              name: 'Delivery',
              href: '/delivery',
              target: false
            }
          ]
        },
        {
          name: 'Events & Promotions',
          href: '/events-and-promotions'
        },
        {
          name: 'Location',
          href: '/location'
        },
        {
          name: 'Center Information',
          id: 'menu3',

          sub_menu: [
            {
              name: 'Contact Us',
              href: '/contact-us',
              target: false
            },
            {
              name: 'Jobs',
              href: '/jobs',
              target: false
            },
            
            {
              name: 'Leasing',
              href: '/leasing',
              target: false
            },
            {
              name: 'Speciality Leasing',
              href: '/speciality-leasing',
              target: false
            },
            
            {
              name: 'Newsletter Sign Up',
              href: '/newsletter',
              target: false
            }
          ]
        }
      ]
    }
  },
  methods: {}
}
</script>
