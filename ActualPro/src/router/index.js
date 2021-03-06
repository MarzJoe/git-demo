import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Getdata from '@/components/Getdata'
import Getdata1 from '@/components/Getdata1'
import index from '@/components/index'
import InsertData from '@/components/InsertData'
import login from '@/components/login'
import productmanger from '@/components/productmanger'
import ordermanger from '@/components/ordermanger'
import test from '@/components/test'

Vue.use(Router)

export default new Router({
  routes: [{
      path: "/",
      component: login,
    },
    {
      path: '/index',
      name: "Index",
      component: index,
      children: [
        {
          path: '/Getdata',
          name: 'Getdata',
          component: Getdata
        },
        {
          path: '/ordermanger',
          name: 'ordermanger',
          component: ordermanger
        },
        {
          path: '/productmanger',
          name: 'productmanger',
          component: productmanger
        },
        {
          path: '/Getdata1',
          name: 'Getdata1',
          component: Getdata1
        },
        {
          path: '/InsertData',
          name: 'InsertData',
          component: InsertData
        },
      ]
    },

  ]
})
