const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: '', component: () => import('src/pages/Home.vue'), name: 'Home' },
      //{ path: '/padel', component: () => import('src/pages/3DaysCalendarPage.vue'), name: 'Calendar3' },
      { path: '/calendar', component: () => import('src/pages/Calendar.vue'), name: 'Calendar' },
      { path: '/access', component: () => import('src/pages/Access/AccessCalendar.vue'), name: 'Access' },
      { path: '/login', component: () => import('pages/Login.vue'), name: 'Login' },
      { path: '/register', component: () => import('pages/Register.vue'), name: 'Register' },
      { path: '/profile', component: () => import('pages/Profile.vue'), name: 'Profile' },
      { path: '/confirmation', component: () => import('pages/Confirmation.vue'), name: 'Confirmation' },
      { path: '/confirmation/acc', component: () => import('pages/Access/AccessConfirmation.vue'), name: 'ConfirmationAcc' },
      { path: '/admin', component: () => import('pages/Admin.vue'), name: 'Admin' },
      { path: '/resOk', component: () => import('src/pages/ConfirmationOk.vue'), name: 'PaymentOk' },
      { path: '/resOk/acc', component: () => import('src/pages/Access/AccessConfirmationOk.vue'), name: 'PaymentOkAcc' },
      { path: '/resError', component: () => import('src/pages/ConfirmationError.vue'), name: 'PaymentError' },
      { path: '/resError/acc', component: () => import('src/pages/Access/AccessConfirmationError.vue'), name: 'PaymentErrorAcc' },
      
    ],
  },
  { path: '/legal/terms', component: () => import('src/pages/LegalTerms.vue'), name: 'Terms' },
  { path: '/legal/privacy', component: () => import('src/pages/LegalPrivacy.vue'), name: 'Privacy' },
  

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes
