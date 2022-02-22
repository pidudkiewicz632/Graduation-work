import Vue from 'vue';
import VueRouter from 'vue-router';
import GroupDetails from '@/views/home/GroupDetails.vue';
import EditGroup from '@/views/home/EditGroup.vue';
import EditGroupMembers from '@/views/home/EditGroupMembers.vue';
import AddGroupDiscard from '@/views/home/AddGroupDiscard.vue';
import Payment from '@/views/home/Payment.vue';
import GroupDiscardEditObligation from '@/views/home/GroupDiscardEditObligation.vue';
import GroupDiscardEdit from '@/views/home/GroupDiscardEdit.vue';
import SingleDiscardCreate from '@/views/home/SingleDiscardCreate.vue';
import SingleDiscardDetails from '@/views/home/SingleDiscardDetails.vue';
import SingleDiscardEdit from '@/views/home/SingleDiscardEdit.vue';
import Discards from '@/views/home/Discards.vue';
import Invites from '@/views/home/Invites.vue';
import Settings from '@/views/home/Settings.vue';
import EditUserInfo from '@/views/home/EditUserInfo.vue';
import ChangePassword from '@/views/home/ChangePassword.vue';
import ChooseDiscardType from '@/views/home/ChooseDiscardType.vue';
import Home from '../views/home/Home.vue';
import Groups from '../views/home/Groups.vue';
import AddGroup from '../views/home/AddGroup.vue';
import Notifications from '../views/home/Notifications.vue';
import GroupDiscardDetails from '../views/home/GroupDiscardDetails.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/groups',
    name: 'Groups',
    component: Groups,
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: Notifications,
  },
  {
    path: '/addGroup',
    name: 'AddGroup',
    component: AddGroup,
  },
  {
    path: '/group/details/:groupId',
    name: 'GroupDetails',
    component: GroupDetails,
    props: true,
  },
  {
    path: '/group/edit/:groupId',
    name: 'EditGroup',
    component: EditGroup,
    props: true,
  },
  {
    path: '/group/edit/members/:groupId',
    name: 'EditGroupMembers',
    component: EditGroupMembers,
    props: true,
  },
  {
    path: '/group/discard/add/:groupId',
    name: 'AddGroupDiscard',
    component: AddGroupDiscard,
    props: true,
  },
  {
    path: '/discard/details/:overlap/:discardId',
    name: 'GroupDiscardDetails',
    component: GroupDiscardDetails,
    props: true,
  },
  {
    path: '/payment/:type/:discardId',
    name: 'Payment',
    component: Payment,
    props: true,
  },
  {
    path: '/group/obligations/edit/:discardId',
    name: 'GroupDiscardEditObligation',
    component: GroupDiscardEditObligation,
    props: true,
  },
  {
    path: '/discard/info/edit/:discardId',
    name: 'GroupDiscardEdit',
    component: GroupDiscardEdit,
    props: true,
  },
  {
    path: '/discard/single/create',
    name: 'SingleDiscardCreate',
    component: SingleDiscardCreate,
  },
  {
    path: '/discard/single/details/:discardId',
    name: 'SingleDiscardDetails',
    component: SingleDiscardDetails,
    props: true,
  },
  {
    path: '/discard/single/edit/:discardId',
    name: 'SingleDiscardEdit',
    component: SingleDiscardEdit,
    props: true,
  },
  {
    path: '/discards/',
    name: 'Discards',
    component: Discards,
  },
  {
    path: '/invites/',
    name: 'Invites',
    component: Invites,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
  },
  {
    path: '/settings/edit',
    name: 'EditUserInfo',
    component: EditUserInfo,
  },
  {
    path: '/settings/password',
    name: 'ChangePassword',
    component: ChangePassword,
  },
  {
    path: '/discard/type',
    name: 'ChooseDiscardType',
    component: ChooseDiscardType,
  },
  {
    path: '/*',
    redirect: {
      name: 'Home',
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
