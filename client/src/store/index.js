import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;

export default new Vuex.Store({
  state: {
    userData: JSON.parse(localStorage.getItem('user-data')) || '',
    numberOfNewNotifications: 0,
    addDiscardData: {
      dateOfPayment: null,
      description: null,
      name: null,
      type: 'oneTime',
      cyclicalInterval: null,
      members: [],
      spreadType: 'spreading',
    },
    currentGroupInfo: {
      groupId: null,
      userPermission: null,
      groupDetails: [],
      groupMembers: [],
      groupDiscards: [],
    },
    discardDetails: {
      discardInfo: {
        idDiscard: {},
      },
      userObligation: null,
      payments: [],
      userPermission: false,
      allObligations: [],
    },
  },
  getters: {
    isLogIn: (state) => Boolean(state.userData),
    isLog: () => Boolean(JSON.parse(localStorage.getItem('user-data'))),
    login: (state) => state.userData.login,
    userId: (state) => state.userData.id,
    token: (state) => state.userData.token,
    addDiscardDateOfPayment: (state) => state.addDiscardData.dateOfPayment,
    addDiscardDescription: (state) => state.addDiscardData.description,
    addDiscardName: (state) => state.addDiscardData.name,
    addDiscardType: (state) => state.addDiscardData.type,
    addDiscardCyclicalInterval: (state) => state.addDiscardData.cyclicalInterval,
    addDiscardMembers: (state) => state.addDiscardData.members,
    addDiscardSpreadType: (state) => state.addDiscardData.spreadType,
    groupInfoPermission: (state) => state.currentGroupInfo.userPermission,
    groupInfoId: (state) => state.currentGroupInfo.groupId,
    groupInfoDetails: (state) => state.currentGroupInfo.groupDetails,
    groupInfoMembers: (state) => state.currentGroupInfo.groupMembers,
    groupInfoDiscards: (state) => state.currentGroupInfo.groupDiscards,
    discardDetailsInfo: (state) => state.discardDetails.discardInfo,
    discardDetailsUserObligation: (state) => state.discardDetails.userObligation,
    discardDetailsUserPermission: (state) => state.discardDetails.userPermission,
    discardDetailsPayments: (state) => state.discardDetails.payments,
    discardDetailsAllObligation: (state) => state.discardDetails.allObligations,
    numberOfNewNotifications: (state) => state.numberOfNewNotifications,
  },
  mutations: {
    loginSuccess(state, data) {
      state.userData = data;
    },
    deleteToken(state) {
      state.userData = '';
    },
    addDiscardDateOfPayment(state, data) {
      state.addDiscardData.dateOfPayment = data;
    },
    addDiscardName(state, data) {
      state.addDiscardData.name = data;
    },
    addDiscardDescription(state, data) {
      state.addDiscardData.description = data;
    },
    addDiscardType(state, data) {
      state.addDiscardData.type = data;
    },
    addDiscardCyclicalInterval(state, data) {
      state.addDiscardData.cyclicalInterval = data;
    },
    addDiscardMembers(state, data) {
      state.addDiscardData.members = data;
    },
    addDiscardSpreadType(state, data) {
      state.addDiscardData.spreadType = data;
    },
    groupInfoPermission(state, data) {
      state.currentGroupInfo.userPermission = data;
    },
    groupInfoId(state, data) {
      state.currentGroupInfo.groupId = data;
    },
    groupInfoDetails(state, data) {
      state.currentGroupInfo.groupDetails = data;
    },
    groupInfoMembers(state, data) {
      state.currentGroupInfo.groupMembers = data;
    },
    groupInfoDiscards(state, data) {
      state.currentGroupInfo.groupDiscards = data;
    },
    numberOfNewNotifications(state, data) {
      state.numberOfNewNotifications = data;
    },
    discardDetails(state, data) {
      state.discardDetails.discardInfo = data.discard;
      state.discardDetails.userObligation = data.userObligation;
      state.discardDetails.allObligations = data.obligations;
      state.discardDetails.payments = data.payments;
      state.discardDetails.userPermission = data.permission === 'admin' || data.permission === 'owner';
    },
  },
  actions: {
    setLogin({ commit, state }, login) {
      const user = state.userData;
      user.login = login;
      localStorage.setItem('user-data', JSON.stringify(user));
      commit('loginSuccess', user);
    },
    loginIn({ commit }, loginData) {
      return new Promise((resolve, reject) => {
        axios.post('user/login', loginData)
          .then((res) => {
            const { user } = res.data;
            localStorage.setItem('user-data', JSON.stringify(user));
            commit('loginSuccess', user);
            resolve(res);
          })
          .catch((err) => {
            localStorage.removeItem('user-data');
            commit('deleteToken');
            reject(err);
          });
      });
    },
    loginOut({
      commit,
    }) {
      return new Promise((resolve) => {
        localStorage.removeItem('user-data');
        commit('deleteToken');
        resolve();
      });
    },
    getDiscardDetails({ commit }, discardId) {
      return new Promise((resolve, reject) => {
        axios.get(`discard/group/details/${discardId}`)
          .then((res) => {
            if (res.data.data) {
              commit('discardDetails', res.data.data);
            }
            resolve(res.data.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    refreshNumberOfNotifications({ commit }) {
      axios.get('/notification/number')
        .then((res) => {
          if (res.data.data !== null) {
            commit('numberOfNewNotifications', res.data.data);
            console.log(res.data.data);
          }
        });
    },
  },
  modules: {
  },
});
