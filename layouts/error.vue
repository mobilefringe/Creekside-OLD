<template>
  <div>
    <div class="container" style="margin-top:100px;text-align:center;">
      <h2>Sorry, there was an error processing your request!</h2>
      <h4>{{error.message}}</h4>
    </div>
  </div>
</template>

<script>
export default {
  props: ['error'],
  created() {
    console.error('error', this.error)
  }
}
</script>
