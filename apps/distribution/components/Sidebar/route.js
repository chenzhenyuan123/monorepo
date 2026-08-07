const routes = [
  {
    path: '/home',
    name: 'home',
    meta: {
      title: 'router.Home',
      icon: 'icon-home-line'
    }
  },
  {
    path: '/products',
    name: 'products',
    meta: {
      title: 'router.Products',
      icon: 'icon-cube-01'
    }
  },
 {
    path: '/account',
    name: 'account',
    meta: {
      title: 'router.Account',
      icon: 'icon-user-01'
    },
    children: [
      {
        path: '/account/profile',
        name: 'account-profile',
        meta: {
          title: 'router.Profile',
        }
      },
      {
        path: '/account/wallet',
        name: 'account-wallet',
        meta: {
          title: 'router.Wallet',
        }
      },
      {
        path: '/account/myCoupons',
        name: 'My-Coupons',
        meta: {
          title: 'router.MyCoupons',
          // hot: true // hot标志 -接口获取
          // unread: true // 未读红点 -接口获取
        }
      },
      {
        path: '/account/invitation',
        name: 'account-invitation',
        meta: {
          title: 'router.Invitation',
        }
      },
      {
        path: '/account/moreMerchantApply',
        name: 'account-moreMerchantApply',
        meta: {
          title: 'router.MoreMerchantApply',
          // hot: true // hot标志 -接口获取
        }
      }
    ]
  }
]

export default routes