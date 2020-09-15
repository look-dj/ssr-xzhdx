<template>
  <div>
    <upload type="auto" v-model="file" accept="image"></upload>
    <v-btn @click="test">测试</v-btn>
  </div>
</template>
<script>
// 项目介绍
import Upload from "~/components/Upload.vue";
import Editor from "~/components/Editor.vue";
export default {
  name: "introduce",
  data: () => ({
    file: {},
    data: "",
  }),
  methods: {
    test() {
      this.$loading();
    },
  },
  watch: {
    data(val) {
      console.log(val);
    },
  },
  components: {
    Editor,
    Upload,
  },
  mounted() {
    let that = this;

    // that.$toast({msg:'确定要这么做吗？'})
  },
};
</script>
<style lang="scss" scoped>
</style>