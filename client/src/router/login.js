import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginRegister from '@/views/login/LoginRegister.vue';
import PasswordResetEmail from '@/views/login/PasswordResetEmail.vue';
import PasswordReset from '@/views/login/PasswordReset.vue';
import EmailChangeConfirmation from '@/views/login/EmailChangeConfirmation.vue';
import AccountActivate from '@/views/login/AccountActivate.vue';
import LoginRememberEmail from '@/views/login/LoginRememberEmail.vue';
import RestoreAccount from '@/views/login/RestoreAccount.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'LoginRegister',
    component: LoginRegister,
  },
  {
    path: '/login/password/reset',
    name: 'PasswordResetEmail',
    component: PasswordResetEmail,
  },
  {
    path: '/login/password/change/:requestId',
    name: 'PasswordReset',
    component: PasswordReset,
    props: true,
  },
  {
    path: '/login/email/change/confirmation/:requestId',
    name: 'EmailChangeConfirmation',
    component: EmailChangeConfirmation,
    props: true,
  },
  {
    path: '/login/account/activate/:requestId',
    name: 'AccountActivate',
    component: AccountActivate,
    props: true,
  },
  {
    path: '/login/remember',
    name: 'LoginRememberEmail',
    component: LoginRememberEmail,
    props: true,
  },
  {
    path: '/login/user/restore/:requestId',
    name: 'RestoreAccount',
    component: RestoreAccount,
    props: true,
  },
  {
    path: '/*',
    redirect: {
      name: 'LoginRegister',
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
