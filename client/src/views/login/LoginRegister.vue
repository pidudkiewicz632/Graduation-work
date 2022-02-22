<template>
  <div id="loginRegisterWrapper" class="mx-auto col-11 col-md-8 col-lg-6
  col-xl-4 shadow-lg p-0 mt-2">
    <div class="d-flex">
      <div id="log" :class="{active:selectedForm === 'register'}"
           class="col-6 p-3 font-weight-bold"
           @click="changeForm('login')">
        Logowanie
      </div>
      <div id="reg" :class="{active:selectedForm === 'login'}"
           class="col-6 p-3 font-weight-bold"
           @click="changeForm('register')">
        Rejestracja
      </div>
    </div>
    <div id="formContainer" class="mx-auto col-lg-8 col-xl-7 col-sm-9 col-10 p-3">
      <login v-if="selectedForm === 'login'"/>
      <register v-if="selectedForm === 'register'" @register="changeForm('login')"/>
    </div>
  </div>
</template>

<script>
import Login from '@/components/LoginForm.vue';
import Register from '@/components/RegisterForm.vue';

export default {
  name: 'LoginRegister',
  components: {
    Login,
    Register,
  },
  data() {
    return {
      selectedForm: 'login',
      infoData: {
        title: 'Rejestracja',
        info: 'Konto zostało utworzone!',
        buttonText: 'Do strony logowania',
      },
    };
  },
  methods: {
    changeForm(value) {
      this.selectedForm = value;
    },
  },
};
</script>

<style lang="scss" scoped>
#formContainer{
  button{
    background-color: #148a14;
    border: none;
  }
}
#loginRegisterWrapper {
  background-color: #1c1919;
  color: #ffffff;
}
.active{
  background-color: #148a14;
}
</style>
