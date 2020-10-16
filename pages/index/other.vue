<template>
  <v-container fluid :class="$vuetify.breakpoint.xs?'container':'px-12'">
    <v-card flat>
      <v-card-title>其他设置</v-card-title>
    </v-card>
  </v-container>
</template>
<script>
export default {
  vName: "other",
  data: () => ({}),
};
</script>
<style lang="scss" scoped>
.container{padding:0;padding-right:12px;padding-top:20px}
</style>