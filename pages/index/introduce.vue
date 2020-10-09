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
  vName: "introduce",
  data: () => ({
    file: {},
    data: "",
  }),
  async asyncData({app, query}){
    // let res = await app.api.getNodeById({id: 1});
    console.log(query);
    // let _node = await ctx.$axios
  },
  methods: {
    async test() {
      let that = this;
      console.log(that.file);
      let res = await that.api.upload(that.file, that);
      console.log(res);
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
    console.log(that.$cookies)
    // that.$toast({msg:'确定要这么做吗？'})
  },
};
</script>
<style lang="scss" scoped>
</style>
