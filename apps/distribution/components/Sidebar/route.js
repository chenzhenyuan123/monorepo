export const routes = [
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
        path: '/account/invitation',
        name: 'account-invitation',
        meta: {
          title: 'router.Invitation',
        }
      }
    ]
  }
]

export const routesDeveloper = [
  {
    path: '/openapi/home',
    name: 'openapiHome',
    meta: {
      title: 'router.Developer',
      icon: 'icon-home-line'
    }
  }
]