<template>
<div id="app" class="m-0 d-flex align-items-center">
  <div class="col-12">
    <div class="row align-items-center justify-content-center m-0">
      <img class="img-fluid" width="100" alt="Vue logo" src="../../assets/logo.svg" />
      <h1 class="greenText font-weight-bold">CashFriends</h1>
    </div>
    <transition name="routerAnimation" mode="out-in">
      <router-view />
    </transition>
  </div>
</div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Index',
  beforeCreate() {
    if (this.$store.getters.isLogIn && this.$route.name !== 'EmailChangeConfirmation') {
      window.location.href = 'index.html';
    }
  },
};
</script>

<style lang="scss">
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';

* {
  box-sizing: border-box !important;
  margin: 0;
}
html, body, #app{
  min-height: 100% !important;
  height: 100%;
  margin: 0;
}
body{
  background-color: #342A2A;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  .greenText{
    color: #148a14;
  }
  .btnGreen{
    background-color: #148a14;
    border: none;
  }
}

a{
  color: #148a14;
}
a:hover{
  color: #FFFFFF;
  text-decoration: none;
}
button{
  background-color: #148a14!important;
  border: none;
}

#nav {
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #148a14;
    }
  }
}

.routerAnimation-enter-active, .routerAnimation-leave-active {
  transition: opacity .5s cubic-bezier(0.5, 0.7, 1.0, 1), transform .3s ease-out;
}
.routerAnimation-enter, .routerAnimation-leave-to {
  opacity: 0;
  transform: translateX(4%);
}

.modal-content{
  background-color: #1C1919;
  color: white;
  button{
    background-color: #148a14;
    border: none;
  }
}
</style>
