import Vue from 'vue'
import Router from 'vue-router'

import Login from './components/Login'
import Register from './components/Register'
import EditUser from './components/EditUser'
import AdminUsers from './components/AdminUsers'
import ResetPassword from './components/ResetPassword'
import search from '@/components/tabs/search'
import home from '@/components/tabs/home'
import view from '@/components/tabs/view'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/edit-user',
      name: 'editUser',
      component: EditUser
    },
    {
      path: '/admin-users',
      name: 'adminUsers',
      component: AdminUsers
    },
    {
      path: '/reset-password/:tokenId',
      name: 'resetPassword',
      component: ResetPassword
    },
    {
      path: '/Search',
      name: 'search',
      component: search
    },
    {
      path: '/View',
      name: 'view',
      component: view
    }
  ]
})

export default router
