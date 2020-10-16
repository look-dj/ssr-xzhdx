import Vue from 'vue'
import toastComponent from './myToast.vue'
let ToastConstructor = Vue.extend(toastComponent)
let t = undefined
ToastConstructor.prototype.close = function () {
  let that = t
  if (t) {
    t = undefined
  }
  setTimeout(() => {
    if (that.$el && that.$el.parentNode) {
      that.$el.parentNode.removeChild(that.$el)
    }
    that.$destroy();
  }, 200)
}

const Toast = (options = {}) => {
  if (t) {
    return t
  }
  const opts = {
    msg: '',
    ...options
  }
  const instance = new ToastConstructor({
    el: document.createElement('div'),
    data: opts,
  })
  let parent = document.querySelector('#app')?document.querySelector('#app'):document.querySelector('#__nuxt');
  parent.appendChild(instance.$el);
  Vue.nextTick(() => {
    instance.bool = true
  })
  t = instance
  return instance
}

export default Toast
