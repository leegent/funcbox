import Vue from 'vue';
import App from './App.vue';
import VueCodemirror from 'vue-codemirror';
import 'codemirror/mode/javascript/javascript.js';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/hopscotch.css';
import 'codemirror/theme/mdn-like.css';
import 'codemirror/theme/solarized.css';

Vue.config.productionTip = false;
Vue.use(VueCodemirror);

new Vue({
  render: h => h(App),
}).$mount('#app');