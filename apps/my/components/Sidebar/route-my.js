const myRoutes = [
  {
    path: '/orders',
    name: 'orders',
    meta: {
      title: 'router.Orders',
      icon: 'icon-file-02',
      matchPaths: ['/orders/:id']
    }
  }, {
    path: '/account',
    name: 'account',
    meta: {
      title: 'router.Account',
      icon: 'icon-user-01'
    }
  }
]

export default myRoutes