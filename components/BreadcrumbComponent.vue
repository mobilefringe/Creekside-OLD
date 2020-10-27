<template>
  <div class="row">
    <div class="col-md-12">
      <!-- <nuxt-link to="/">Home</nuxt-link>&nbsp;&rsaquo; -->
      <div class="page-breadcrumb">
        <nuxt-link to="/">Home</nuxt-link>
        <nav class="breadcrumbs">
          <ul>
            <template v-if="has_parent">
              <li>
                <i class="fa fa-chevron-right"></i>
                <nuxt-link :to="parent_slug" v-if="parent_slug">{{ parent_name }}</nuxt-link>
                <span v-else>{{parent_name}}</span>
              </li>
            </template>

            <li>
              <i class="fa fa-chevron-right"></i>
              {{ page_name }}
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['page_name', 'has_parent', 'parent_name', 'parent_slug'],
  data() {
    return {
      breadcrumb: null
    }
  }
}
</script>
