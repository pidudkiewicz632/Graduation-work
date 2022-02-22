<template>
     <b-form class="d-flex flex-column"
     @submit.prevent="registration">
          <b-form-group label="Podaj Login*"
          :invalid-feedback="validationRegisterMessages.login"
          :state="validationRegisterStatesRequired.login">
               <b-form-input id="login"
                             class="mt-3" placeholder="Login"
                             v-model="loginRegister" :state="validationRegisterStatesRequired.login"
                             @input="validateLogin" size="sm">
               </b-form-input>
          </b-form-group>
          <b-form-group
          label="Podaj E-mail*"
          :invalid-feedback="validationRegisterMessages.email"
          :state="validationRegisterStatesRequired.email">
               <b-form-input id="email"
                             class="mt-3" placeholder="E-mail" v-model="emailRegister"
                             :state="validationRegisterStatesRequired.email"
                             @input="validateEmail" size="sm"></b-form-input>
          </b-form-group>
          <b-form-group
          label="Podaj Hasło*"
          :invalid-feedback="validationRegisterMessages.passwordRegister"
          :state="validationRegisterStatesRequired.passwordRegister">
               <b-form-input id="password"
                             class="mt-3" type="password" v-model="passwordRegister"
                             placeholder="Hasło"
                             :state="validationRegisterStatesRequired.passwordRegister"
                             @input="validatePassword" size="sm"></b-form-input>
          </b-form-group>
          <b-form-group
          label="Powtórz Hasło*"
          :invalid-feedback="validationRegisterMessages.passwordTwoRegister"
          :state="validationRegisterStatesRequired.passwordTwoRegister">
               <b-form-input id="passwordTwo"
                             class="mt-3" type="password" v-model="passwordTwoRegister"
                             placeholder="Powtórz Hasło"
                             :state="validationRegisterStatesRequired.passwordTwoRegister"
                             @input="validateTwoPassword" size="sm"></b-form-input>
          </b-form-group>
          <b-form-group
          label="Avatar"
          :invalid-feedback="validationRegisterMessages.avatar"
          :state="validationRegisterStatesNotRequired.avatar">
               <b-form-file class="mt-3 text-left" placeholder="Wgraj avatar"
               drop-placeholder="Wgraj avatar" :state="validationRegisterStatesNotRequired.avatar"
               @change="uploadAvatar($event)" size="sm">
               </b-form-file>
          </b-form-group>
          <b-form-text>Pola oznaczone * są obowiązkowe</b-form-text>
          <b-form-invalid-feedback :state="registerErrorMessage === ''">
               {{registerErrorMessage}}
          </b-form-invalid-feedback>
          <b-button type="submit" class="mt-3 mx-auto shadow font-weight-bold">
               Zarejestruj
          </b-button>
     </b-form>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      validationRegisterStatesRequired: {
        login: null,
        email: null,
        passwordRegister: null,
        passwordTwoRegister: null,
      },
      validationRegisterStatesNotRequired: {
        avatar: null,
      },
      validationRegisterMessages: {
        passwordTwoRegister: 'Hasła są od siebie różne',
      },
      loginRegister: '',
      passwordRegister: '',
      passwordTwoRegister: '',
      emailRegister: '',
      userAvatarRegister: '',
      registerErrorMessage: '',
    };
  },
  methods: {
    checkLoginavailability() {
      this.axios.get(`/user/checkLogin?login=${this.loginRegister}`).then((res) => {
        if (res.data.message === true) {
          this.validationRegisterStatesRequired.login = false;
          this.validationRegisterMessages.login = ' Login jest już w użyciu.';
        } else {
          this.validationRegisterStatesRequired.login = true;
        }
      });
    },
    checkEmailavailability() {
      this.axios.get(`/user/checkEmail?email=${this.emailRegister}`).then((res) => {
        if (res.data.message === true) {
          this.validationRegisterStatesRequired.email = false;
          this.validationRegisterMessages.email = ' E-mail jest już w użyciu.';
        } else {
          this.validationRegisterStatesRequired.email = true;
        }
      });
    },
    uploadAvatar(e) {
      [this.userAvatarRegister] = [e.target.files[0]];
      this.validationRegisterMessages.avatar = '';
      this.validationRegisterStatesNotRequired.avatar = true;

      const allowedExt = ['JPG', 'PNG'];
      const fileExt = this.userAvatarRegister.name.split('.').pop().toUpperCase();
      const isCorrectExt = allowedExt.find((element) => element === fileExt);

      if (isCorrectExt === undefined) {
        this.validationRegisterStatesNotRequired.avatar = false;
        this.validationRegisterMessages.avatar += 'Tylko jpg i png';
      }

      if (this.userAvatarRegister.size > 1024000) {
        this.validationRegisterStatesNotRequired.avatar = false;
        this.validationRegisterMessages.avatar += 'Maksymalny rozmiar avatara to 1 mb.';
      }
    },
    validateLogin() {
      this.validationRegisterStatesRequired.login = true;
      this.validationRegisterMessages.login = '';

      if (!/^[a-zA-Z0-9]([_-](?![_-])|[a-zA-Z0-9]){3,19}[a-zA-Z0-9]$/.test(this.loginRegister)) {
        this.validationRegisterStatesRequired.login = false;

        if (this.loginRegister.length < 5) {
          this.validationRegisterMessages.login += '- jest zbyt krótki ';
        }

        if (this.loginRegister.length > 21) {
          this.validationRegisterMessages.login += '- jest za długi ';
        }

        if (!/^[a-zA-Z0-9]/.test(this.loginRegister)) {
          this.validationRegisterMessages.login += '- musi rozpoczynać się od litery lub cyfry ';
        }

        if (!/[a-zA-Z0-9]$/.test(this.loginRegister)) {
          this.validationRegisterMessages.login += '- musi kończyć się literą lub cyfrą ';
        }

        if (!/^[a-zA-Z0-9_-]*$/.test(this.loginRegister)) {
          this.validationRegisterMessages.login += '- może zawierać litery i cyfry oraz - i _ ';
        }
        if (/[_-]{2,}/.test(this.loginRegister)) {
          this.validationRegisterMessages.login += '- _ i - nie mogą występować podwójnie lub obok siebie';
        }
      } else {
        this.checkLoginavailability();
      }
    },
    validateEmail() {
      this.validationRegisterStatesRequired.email = true;
      this.validationRegisterMessages.email = '';

      if (!/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.emailRegister)) {
        this.validationRegisterStatesRequired.email = false;
        this.validationRegisterMessages.email = ' E-mail jest nieprawidłowy';
      } else {
        this.checkEmailavailability();
      }
    },
    validatePassword() {
      this.validationRegisterStatesRequired.passwordRegister = true;
      this.validationRegisterMessages.passwordRegister = '';

      if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.{8,})/.test(this.passwordRegister)) {
        this.validationRegisterStatesRequired.passwordRegister = false;

        if (this.passwordRegister.length < 8) {
          this.validationRegisterMessages.passwordRegister += '- zbyt krótkie';
        }

        if (!/^(?=.*[A-Z])/.test(this.passwordRegister)) {
          this.validationRegisterMessages.passwordRegister += '- musi zawierać jedną dużą literę';
        }

        if (!/^(?=.*[a-z])/.test(this.passwordRegister)) {
          this.validationRegisterMessages.passwordRegister += '- musi zawierać jedną małą literę';
        }

        if (!/^(?=.*[0-9])/.test(this.passwordRegister)) {
          this.validationRegisterMessages.passwordRegister += '- musi zawierać jedną cyfrę.';
        }
      }
    },
    validateTwoPassword() {
      // eslint-disable-next-line max-len
      this.validationRegisterStatesRequired.passwordTwoRegister = !(this.passwordRegister !== this.passwordTwoRegister
        || this.validationRegisterStatesRequired.passwordRegister === false);
    },
    validationAll() {
      this.validateLogin();
      this.validateEmail();
      this.validatePassword();
      this.validateTwoPassword();
    },
    registration() {
      this.validationAll();

      const isCorrect = Object.values(this.validationRegisterStatesRequired)
        .find((element) => element === false);

      if (isCorrect === undefined) {
        const registerData = new FormData();
        registerData.append('login', this.loginRegister);
        registerData.append('email', this.emailRegister);
        registerData.append('password', this.passwordRegister);

        if (this.validationRegisterStatesNotRequired.avatar === true) {
          registerData.append('userAvatar', this.userAvatarRegister);
        }

        this.axios({
          method: 'post',
          url: '/user/register',
          data: registerData,
          headers: { 'Content-Type': 'multipart/form-data' },
        }).then(() => {
          this.showMessage('Zarejestrowano', 'Rejestracja', '');
        }).catch((err) => {
          this.registerErrorMessage = err.response.data.message;
          this.showMessage('Coś poszło nie tak', 'Edycja grupy', '');
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
