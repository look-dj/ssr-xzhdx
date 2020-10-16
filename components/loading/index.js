import Vue from 'vue';
import LoadingComponent from './loading.vue';
import vuetify from 'vuetify';
let LoadingConstructor = Vue.extend(LoadingComponent);

let l = undefined;

LoadingConstructor.prototype.close = function () {
	if (l) l = undefined;
	setTimeout(() => {
		if (this.$el && this.$el.parentNode) {
			this.$el.parentNode.removeChild(this.$el)
		}
		this.$destroy();
	}, 0)
}

let loading = (options = {}) => {
	if (l) return l
	let opts = {
		msg: '加载',
		...options
	}
	const instance = new LoadingConstructor({
		el: document.createElement('div'),
		data: opts,
		vuetify: new vuetify()
  })
  
	let parent = document.querySelector('#app')?document.querySelector('#app'):document.querySelector('#__nuxt');

	parent.appendChild(instance.$el)
	Vue.nextTick(() => {
		instance.bool = true
	})
	l = instance;
	return instance
}

export default loading
