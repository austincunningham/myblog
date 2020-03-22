import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import BlogEntries from './static/bloglist.json';

Vue.use(Router)

const blogRoutes = Object.keys(BlogEntries).map(section => {
  const children = BlogEntries[section].map(child => ({
    path: child.id,
    name: child.id,
    component: () => import(`./markdown/${section}/${child.id}.md`)
  }))
  return {
    path: `/${section}`,
    name: section,
    component: () => import('./views/Blog.vue'),
    children
  }
})


export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', name: 'Home', component: Home },
    ...blogRoutes
    ],
    scrollBehavior () {
        return { x: 0, y: 0 }
      }
})