import { createApp } from 'vue'
import Application from './Application.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

loadFonts()

createApp(Application)
  .use(vuetify)
  .mount('#application')
