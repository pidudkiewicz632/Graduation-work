<template>
     <b-form class="d-flex flex-column" @submit.prevent="loginIn">
          <b-form-input id="login" class="mt-3" placeholder="Login" size="sm"
          v-model="loginInput" type="text" @input="clearError" required></b-form-input>
          <b-form-input id="password" class="mt-3" placeholder="Hasło"
          required size="sm" v-model="passwordInput" type="password" @input="clearError">
          </b-form-input>
          <b-form-invalid-feedback :state="loginErrorMessage === ''">
               {{loginErrorMessage}}
          </b-form-invalid-feedback>
       <div class="mt-3 d-flex flex-column">
         <a class="ml-0" @click="goToReset">Resetowanie hasła</a>
         <a class="ml-0" @click="goToLoginRemember">Przypomnij login</a>
       </div>
          <b-button type="submit" id="d" class="mt-3 mx-auto shadow font-weight-bold">
               Zaloguj
          </b-button>
       <b-spinner style="position:fixed; top: 49%; left:49%;width:3rem;height:3rem;color: #148A14"
                  v-if="loading"></b-spinner>
     </b-form>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginInput: '',
      passwordInput: '',
      loginErrorMessage: '',
      loading: false,
    };
  },
  methods: {
    clearError() {
      this.loginErrorMessage = '';
    },
    goToReset() {
      this.$router.push({ path: '/login/password/reset' });
    },
    goToLoginRemember() {
      this.$router.push({ path: '/login/remember' });
    },
    loginIn() {
      const loginData = new FormData();
      loginData.append('login', this.loginInput);
      loginData.append('password', this.passwordInput);

      this.loading = true;
      this.$store.dispatch('loginIn', loginData).then(() => {
        window.location.href = '/';
        this.loading = false;
      }).catch((err) => {
        if (err.response.data.data === 'notActive') {
          this.loginErrorMessage = 'Musisz aktywować konto, sprawdź e-mail.';
        } else if (err.response.data.data === 'deleted') {
          this.loginErrorMessage = 'Konto jest usunięte.';
        } else {
          this.loginErrorMessage = 'Logowanie nie powiodło się.';
        }
        this.loading = false;
      });
    },
  },
};
</script>

<style>

</style>
