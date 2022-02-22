<template>
  <div id="app">
    <div v-if="isLoginIn" class="pageContent">
      <HeadBar :linksInput="links"/>
      <transition name="routerAnimation" class="mt-3" mode="out-in">
        <router-view />
      </transition>
    </div>
    <b-spinner style="position:fixed; top: 49%; left:49%;width:3rem;height:3rem"
               v-if="loading"></b-spinner>
  </div>
</template>
<script>
import HeadBar from '../../components/HeadBar.vue';

export default {
  name: 'Index',
  components: {
    HeadBar,
  },
  data() {
    return {
      login: '',
      showCover: false,
      links: [
        {
          route: '/',
          name: 'Home',
        },
        {
          route: '/discards',
          name: 'Zrzutki',
        },
        {
          route: '/groups',
          name: 'Grupy',
        },
        {
          route: '/notifications',
          name: 'Powiadomienia',
        },
        {
          route: '/invites',
          name: 'Zaproszenia',
        },
        {
          route: '/settings',
          name: 'Ustawienia',
        },
      ],
    };
  },
  computed: {
    isLoginIn() {
      return this.$store.getters.isLogIn;
    },
  },
  beforeCreate() {
    this.loading = true;
    if (!this.$store.getters.isLogIn) {
      window.location.href = 'login.html';
    }

    const vue = this;
    vue.$store.dispatch('refreshNumberOfNotifications');
    // eslint-disable-next-line
    setInterval(function () {
      vue.$store.dispatch('refreshNumberOfNotifications');
    }, 30000);
  },
};
</script>

<style lang="scss">
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';

* {
  box-sizing: border-box;
}

body{
     background-color: #342A2A;
}

html, body, #app, .pageContent{
  min-height: 100% !important;
  height: 100%;
  margin: 0;
}

a{
  color: #148a14;
}

.pagination{
  padding-bottom: 20% !important;
}

.fewElements{
  padding-bottom: 20% !important;
}

a:hover{
  color: #FFFFFF;
  text-decoration: none;
}

#cover{
  background-color: white;
  top:0;
  position: absolute;
  width: 100%;
  height: 100%;
}

.modal-content{
  background-color: #1C1919;
  color: white;
  button{
    background-color: #148a14;
    border: none;
  }
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  .btnGreen{
          background-color: #148a14;
          border: none;
     }
  .greenBadge{
    background-color: #148a14;
  }
  .spinner-border{
    color: #FFFFFF!important;
  }
  .greenText{
    color: #148a14;
  }

  .list-enter-active,
  .list-leave-active,
  .list-move{
    transition: all .2s ease-out;
  }

  .list-leave-to {
    opacity: 0;
    transform: scaleX(0);
  }

  .list-enter {
    opacity: 0;
    transform: scaleY(0);
  }

  .list-leave-active {
    position: absolute;
  }

  .list-enter-to {
    opacity: 1;
    transform: scaleY(1);
  }

  .routerAnimation-enter-active, .routerAnimation-leave-active {
    transition: opacity .5s cubic-bezier(0.5, 0.7, 1.0, 1), transform .3s ease-out;
  }
  .routerAnimation-enter, .routerAnimation-leave-to {
    opacity: 0;
    transform: translateX(4%);
  }
  .pagination{
    .page-item.active .page-link {
      background-color: #148a14 !important;
      color: #FFFFFF !important;
      border-color: #148a14 !important;
    }
    .page-link {
      color: #148a14 !important;
      font-weight: bold;
      background-color: #342A2A !important;
      border-color: #342A2A !important;
    }
  }
}
</style>
