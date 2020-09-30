<template>
  <ck-editor v-model="edVal" :editor="ed" :config="editorConfig" v-if="isClient"></ck-editor>
</template>
<script>
export default {
  name: "editor",
  model: {
    prop: "value",
    event: "ed_input",
  },
  data: () => ({
    edVal: "",
    editorConfig: {
      placeholder: "请输入内容。。。",
      language: "zh-cn",
    },
    isClient: false
  }),
  watch: {
    edVal(val, old) {
      let that = this;
      if (val && val !== that.value) {
        that.$emit("ed_input", val);
      }
    },
    value(val, old) {
      let that = this;
      if (!that.ed) return;
      if (val && val !== that.edVal) {
        that.edVal = that.value;
      }
      if (val === that.value) return;
      that.$emit("ed_input", val);
    },
  },
  props: {
    value: String,
  },
  methods: {},
  mounted() {
    let that = this;
    if (process.browser) {
      const ClassicEditor =  require("@ckeditor/ckeditor5-build-classic");
      const { component } = require("@ckeditor/ckeditor5-vue")
      require("@ckeditor/ckeditor5-build-classic/build/translations/zh-cn.js");
      that.$options.components = {ckEditor: component}
      that.ed = ClassicEditor;
      that.isClient = true;
    }
  },
  created() {
    let that = this;
    that.edVal = that.value;
  },
};
</script>
<style lang="scss">
.ck-editor__editable {
  min-height: 200px;
}
</style>