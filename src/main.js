import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import * as bootstrap from 'bootstrap'; // 引入 Bootstrap JS
window.bootstrap = bootstrap; // 將 bootstrap 掛載到 window 物件
import Loading from 'vue3-loading-overlay';
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import 'element-plus/dist/index.css';

import './assets/scss/main.scss';
import { createPinia } from 'pinia';
import piniaPersistedState from 'pinia-plugin-persist';

const app = createApp(App);
app.use(router); // 啟用 Vue Router
const pinia = createPinia();
pinia.use(piniaPersistedState);
app.use(pinia);
app.use(ElementPlus, {
    locale: zhCn,
});
app.component('Loading', Loading);
app.mount('#app');
