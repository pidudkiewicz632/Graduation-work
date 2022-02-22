<template>
  <b-container id="header" class="row justify-content-between align-items-center col-12 sticky-top
  m-0 p-3 mb-3">
    <div class="row align-items-center ml-1" @click="toHome">
      <img class="img-fluid" width="40" alt="Vue logo" src="../assets/logo.svg" />
      <div class="greenText font-weight-bol">CashFriends</div>
    </div>
    <div class="row flex-row-reverse ml-auto">
      <b-icon-justify class="greenIcon mx-3" font-scale="2" v-b-toggle.navBar>
      </b-icon-justify>
      <div @click="toNotifications">
        <b-icon-bell-fill class="greenIcon" font-scale="2">
        </b-icon-bell-fill>
        <b-badge class="notifiCounter rounded" variant="light">
          {{ notificationNumber }}
        </b-badge>
      </div>
      <b-sidebar id="navBar" z-index="100" right shadow>
        <b-nav vertical>
          <router-link v-for="(link, index) in links" :key="index"
                       :to="link.route" class="my-2">
            {{link.name}}
          </router-link>
        </b-nav>
        <template v-slot:footer>
          <div id="loginPanel" class="pb-2 d-flex align-items-center justify-content-center pt-3">
            <b-avatar variant="light"
                      :src="avatarLink"></b-avatar>
            <div class="mx-3 font-weight-bold">{{login}}</div>
            <div id="logOut" class="p-1">
              <b-icon-arrow-right-square-fill id="logIcon" font-scale="2" @click="logOut">
              </b-icon-arrow-right-square-fill>
            </div>
          </div>
        </template>
      </b-sidebar>
    </div>
  </b-container>
</template>

<script>
export default {
  name: 'HeadBar',
  data() {
    return {
      links: [],
      avatarLink: '',
      login: '',
    };
  },
  props: {
    linksInput: {
      type: Array,
      required: true,
    },
  },
  computed: {
    notificationNumber() {
      return this.$store.getters.numberOfNewNotifications;
    },
  },
  mounted() {
    this.links = this.linksInput;
    this.login = this.$store.getters.login;
    this.avatarLink = `${process.env.VUE_APP_API_BASE_URL}user/avatar/${this.$store.getters.userId}`;
  },
  methods: {
    logOut() {
      this.$store.dispatch('loginOut').then(() => {
        window.location.href = '/login.html';
      });
    },
    toNotifications() {
      this.$router.push({ path: '/notifications' });
    },
    toHome() {
      this.$router.push({ path: '/' });
    },
  },
};
</script>

<style lang="scss">
#header{
  color: #FFFFFF;
  background-color: #1C1919;
  width: 100%;
  #loginPanel{
    background-color: #148A14;
    #logIcon{
      color: white !important;
    }
  }
     .greenIcon{
          color: #148A14;
     }
  .notifiCounter{
    position: relative;
    right: 10px;
  }
  #navBar{
       background-color: #1C1919 !important;
       height: 100% !important;

       a {
          font-weight: bold;
          color: #FFFFFF;

          &.router-link-exact-active {
               color: #42b983;
          }
       }
       svg{
            color:#148A14;
            font-size: 2.5rem;
       }
       footer{
            color: #FFFFFF;
       }
  }
}
</style>
