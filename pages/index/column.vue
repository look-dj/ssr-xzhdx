<template>
  <v-container ref="container" fluid :class="$xs?'px-0':'px-12'">
    <v-card class="px-6 pb-3" elevation="1">
      <v-toolbar flat >
        <v-card-title>栏目管理</v-card-title>
        <v-spacer></v-spacer>
        <v-btn
          class="mr-4"
          @click="dialog = true"
          :style="[theme.bg_p, theme.co]"
          :small="$xs?true:false"
          >{{$xs?'+添加':'+添加栏目'}}</v-btn
        >
        <v-btn :style="[theme.bg_p, theme.co]" :small="$xs?true:false">更新排序</v-btn>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="columns"
        disable-sort
        disable-pagination
        hide-default-footer
      >
        <!-- 名称 -->
        <!-- <template v-slot:item.name="{ item }">
          <span>{{ item.origin !== nid ? item.name : '|—' + item.name }}</span>
        </template> -->
        <!-- 是否显示 -->
        <template v-slot:item.show="{ item }">
          <span>{{ item.show ? "显示" : "隐藏" }}</span>
        </template>
        <!-- 操作 -->
        <template v-slot:item.oper="{ item }">
          <v-btn
            fab
            x-small
            depressed
            title="添加子项目"
            class="mx-1"
            @click="addSonCol(item)"
            :style="[theme.bg_a, theme.co_p]"
            ><v-icon>iconfont-ic_add_line</v-icon></v-btn
          >
          <v-btn
            fab
            x-small
            depressed
            title="删除"
            class="mx-1"
            @click="deleteColumn(item)"
            :style="[theme.bg_a, theme.co_p]"
          >
            <v-icon>iconfont iconfont-customerarchivesrecycleBin</v-icon>
          </v-btn>
          <v-btn
            fab
            x-small
            depressed
            title="修改"
            class="mx-1"
            @click="clickEditBtn(item)"
            :style="[theme.bg_a, theme.co_p]"
          >
            <v-icon>iconfont iconfont-basepermissionapproveApply</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <!-- 添加栏目 -->
    <v-dialog v-model="dialog" fullscreen persistent hide-overlay>
      <v-card class="d-flex align-center flex-column" v-if="dialog">
        <v-card-title class="justify-center text-h4"
          >{{ dialogType == "add" ? "添加" : "修改" }}栏目</v-card-title
        >
        <v-col md="6">
          <v-card-text>
            <v-row dense>
              <v-col md="4" cols="6">
                <v-text-field
                  label="*栏目名称"
                  v-model="columnModel.name"
                  required
                  @input="$v.columnModel.name.$touch()"
                  @blur="$v.columnModel.name.$touch()"
                ></v-text-field>
              </v-col>
              <v-col md="4" cols="6"
                ><v-text-field
                  label="*栏目英文名称"
                  v-model="columnModel.ename"
                  required
                ></v-text-field
              ></v-col>
              <v-col md="4" cols="6"
                ><v-select
                  label="所属栏目"
                  :items="columnNodeList"
                  item-text="name"
                  item-value="self"
                  v-model="nodeModel.cid"
                ></v-select
              ></v-col>
              <v-col md="4" cols="6"
                ><v-select
                  v-model="columnModel.html_template"
                  label="*选择HTML模板"
                  :items="htmlList"
                ></v-select
              ></v-col>
              <v-col md="4" cols="6"
                ><v-select
                  v-model="nodeModel.path"
                  label="*选择VUE组件"
                  :items="fileList"
                  item-text="name"
                  item-value="path"
                ></v-select
              ></v-col>
              <v-col md="4" cols="6" class="d-flex flex-row align-center">
                <span>是否隐藏</span>
                <v-radio-group row class="ml-10" v-model="columnModel.show">
                  <v-radio
                    label="显示"
                    :value="1"
                    off-icon="iconfont-weixuan"
                    on-icon="iconfont-xuanzhong"
                  ></v-radio>
                  <v-radio
                    label="隐藏"
                    :value="0"
                    off-icon="iconfont-weixuan"
                    on-icon="iconfont-xuanzhong"
                  ></v-radio>
                </v-radio-group>
              </v-col>
              <v-col md="4" cols="6"
                ><v-text-field
                  label="链接地址"
                  v-model="columnModel.link"
                ></v-text-field
              ></v-col>
              <!-- <v-col cols="4"><v-text-field label="排序" v-model="columnModel.order"></v-text-field></v-col>/ -->
              <v-col md="4" cols="6"
                ><v-text-field
                  label="关键词"
                  v-model="columnModel.keywords"
                ></v-text-field
              ></v-col>
              <upload
                v-model="imgFile"
                type="card"
                cols="12"
                :src="columnModel.pic"
                ref="upload"
              ></upload>
              <v-col cols="12"
                ><v-textarea
                  label="栏目描述"
                  solo
                  auto-grow
                  v-model="columnModel.description"
                ></v-textarea
              ></v-col>
            </v-row>
          </v-card-text>
        </v-col>
        <v-card-actions>
          <v-btn
            width="100"
            class="mx-3"
            @click="submit"
            :style="[theme.bg_p, theme.co]"
            >{{ dialogType == "add" ? "提交" : "确认修改" }}</v-btn
          >
          <v-btn
            width="100"
            class="mx-3"
            @click="modelReset()"
            :style="[theme.bg_p, theme.co]"
            >关闭</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { required } from "vuelidate/lib/validators";
import Upload from "~/components/Upload.vue";
export default {
  name: "column",
  validations: {
    columnModel: {
      name: {
        required,
      },
      template: {
        required,
      },
    },
  },
  data: () => ({
    headers: [
      {
        text: "ID",
        value: "id",
        align: "center",
      },
      {
        text: "名称",
        value: "name",
        align: "left",
      },
      {
        text: "显示",
        value: "show",
        align: "center",
      },
      {
        text: "排序",
        value: "order",
        align: "center",
      },
      {
        text: "操作",
        value: "oper",
        align: "center",
      },
    ],
    dialog: false,
    dialogType: "add",
    imgFile: {},
    columnModel: {
      name: "",
      show: "1",
      description: "",
      keywords: "",
      pic: "",
      order: "",
      html_template: "",
      ename: "",
      link: "",
    },
    nodeModel: {
      path: "",
      auth: "user",
      icon: "",
      cid: "",
    },
    htmlList: [],
    columns:[]
  }),
  async asyncData({ app, query }) {
    let api = app.api;
    let columnCrud = api.plant("column");
    let res = await api.getNodeById({ id: query.nid });
    let files = require.context("./tp/", false, /\.vue$/);
    let fileList = [];
    files.keys().forEach((key) => {
      let temp = key.split("/");
      temp = temp[temp.length - 1];
      fileList.push({
        path: "/tp/" + temp.split(".")[0],
        name: temp,
      });
    });
    return { fileList, documentTitle: res.data.title };
  },
  head() {
    return {
      title: this.documentTitle,
    };
  },
  async mounted() {
    let that = this;
    that.nodeModel.path = that.fileList[0].path;
    that.getHtmlTemplate();
    that.getColumnList();
  },
  methods: {
    //获取所有的Html模板
    async getHtmlTemplate() {
      let that = this;
      try {
        let result = await that.api.getHtmlList({}, that);
        that.htmlList = result.code == 200 ? result.data : [];
        that.columnModel.html_template = that.htmlList[0];
      } catch (e) {
        console.log(e);
        that.$hint({ msg: "获取模板文件失败", type: "error" });
        throw new Error("获取模板文件失败");
      }
    },
    //获取所有栏目
    async getColumnList() {
      let that = this;
      try {
        let result = await that.crud.column.queryAll({}, that);
        that.columns = result.code == 200 ? result.data : [];
        console.log(that.columns);
        that.nodeModel.cid = that.columnNodeList[0].self;
      } catch (e) {
        console.log(e);
        that.$hint({ msg: "获取所有栏目失败", type: "error" });
        throw new Error("获取所有栏目失败");
      }
    },
    //添加栏目
    async submit() {
      let that = this;
      if (that.dialogType !== "add") return that.updateColumn();
      if (that.$u.checkObjectIsEmpty(that.imgFile))
        return that.$hint({ msg: "请选择上传的图片", type: "error" });
      let imgResult = await that.api.upload(that.imgFile, that);
      if (imgResult.code != 200)
        return that.$hint({ msg: "请选择上传的图片", type: "error" });
      that.nodeModel.title = that.nodeModel.call = that.columnModel.name;
      let _column = JSON.parse(that.nodeModel.cid);
      that.nodeModel.deep = Number(_column.deep) + 1;
      that.nodeModel.icon = "";
      that.nodeModel.cid = _column.nid;
      that.columnModel.pic = imgResult.data;
      delete that.columnModel.path;
      delete that.columnModel.cid;
      try {
        let result = await that.crud.column.add(
          { node: that.nodeModel, column: that.columnModel },
          that
        );
        if (result.code != 200) {
          return that.$hint({ msg: "添加栏目失败", type: "error" });
        }
        that.$hint({ msg: "添加栏目成功" });
        that.modelReset(1);
        console.log(result);
      } catch (e) {
        console.log(e);
        that.$hint({ msg: "添加栏目失败", type: "error" });
        throw new Error("添加栏目失败");
      }
    },
    //修改栏目
    clickEditBtn(params) {
      let that = this;
      that.columnModel = params;
      that.nodeModel.deep = params.deep;
      that.nodeModel.cid = that.columnNodeList.find((f) => f.nid == params.cid);
      that.nodeModel.cid = that.nodeModel.cid.self;
      that.nodeModel.path = params.path;
      that.nodeModel.id = params.nid;
      that.dialog = true;
      that.dialogType = "update";
    },
    async updateColumn() {
      let that = this;
      if (!that.$u.checkObjectIsEmpty(that.imgFile)) {
        let imgResult = await that.api.upload(that.imgFile, that);
        if (imgResult.code != 200)
          return that.$hint({ msg: "请选择上传的图片", type: "error" });
        that.columnModel.pic = imgResult.data;
      }
      that.nodeModel.title = that.nodeModel.call = that.columnModel.name;
      let _column = JSON.parse(that.nodeModel.cid);
      that.nodeModel.deep = Number(_column.deep) + 1;
      that.nodeModel.icon = "";
      that.nodeModel.cid = _column.nid;
      delete that.columnModel.path;
      delete that.columnModel.cid;
      delete that.columnModel.self;
      delete that.columnModel.deep;
      try {
        let result = await that.crud.column.update(
          { node: that.nodeModel, column: that.columnModel },
          that
        );
        if (result.code != 200) {
          return that.$hint({ msg: "更新栏目失败", type: "error" });
        }
        that.$hint({ msg: "更新栏目成功" });
        that.modelReset(1);
        console.log(result);
      } catch (e) {
        console.log(e);
        that.$hint({ msg: "更新栏目失败", type: "error" });
        throw new Error("更新栏目失败");
      }
    },
    //删除栏目
    deleteColumn(params) {
      let that = this;
      that.$toast({ msg: "确认删除这个栏目吗？" });
      that.$bus.$on("toastConfirm", async function () {
        try {
          let result = await that.crud.column.delete(
            { node: params.nid, column: params.id },
            that
          );
          if (result.code != 200) {
            return that.$hint({ msg: "删除栏目失败", type: "error" });
          }
          that.$hint({ msg: "删除栏目成功" });
          that.modelReset(1);
          console.log(result);
        } catch (e) {
          console.log(e);
          that.$hint({ msg: "删除栏目失败", type: "error" });
          throw new Error("删除栏目失败");
        }
      });
    },
    modelReset(type = null) {
      let that = this;
      that.dialog = false;
      that.dialogType = "add";
      that.columnModel = {
        name: "",
        show: "1",
        description: "",
        keywords: "",
        pic: "",
        order: "",
        html_template: "",
        ename: "",
        link: "",
      };
      that.nodeModel = {
        path: "",
        auth: "user",
        icon: "",
        cid: this.columnNodeList[0].self,
      };

      if (type) {
        localStorage.removeItem("menu");
        that.getColumnList();
      }
    },
  },
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.userModel.name.$dirty) return errors;
      !this.$v.userModel.name.required && errors.push("必填");
      return errors;
    },
    templateErrors() {
      const errors = [];
      if (!this.$v.userModel.template.$dirty) return errors;
      !this.$v.userModel.template.required && errors.push("必填");
      return errors;
    },
    theme() {
      return this.$store.getters.getTheme;
    },
    crud() {
      let that = this;
      return {
        column: that.api.plant("column"),
        node: that.api.plant("node"),
      };
    },
    columnNodeList() {
      let that = this;
      let nodeList = [];
      nodeList.unshift({ name: "顶级栏目", cid: "1", deep: "1", nid: "1" });
      if (that.columns.length > 0) {
        that.columns.forEach((i) => {
          nodeList.push(i);
        });
      }
      nodeList.forEach((i) => {
        i.self = JSON.stringify(i);
      });
      return nodeList;
    },
  },
  components: {
    Upload,
  },
};
</script>
<style lang="scss">
tbody > tr {
  cursor: pointer;
}
</style>
