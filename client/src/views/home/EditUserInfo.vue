<template>
  <b-container id="editUserInfoWrapper"
               class="shadow mx-auto col-11 col-sm-8 darkBg col-md-7 col-lg-5 col-xl-4 p-3">
    <h2 class="mb-3 greenText">
      Ustawienia
    </h2>
    <b-form class="d-flex flex-column col-10 mx-auto">
      <b-form-group :invalid-feedback="validationMessages.login"
                    :state="validationRequiredStates.login">
        <b-form-input class="mt-3" placeholder="Login"
                      v-model="login" :state="validationRequiredStates.login"
                      @input="validateLogin" size="sm">
        </b-form-input>
      </b-form-group>
      <b-form-group
        :invalid-feedback="validationMessages.email"
        :state="validationRequiredStates.email">
        <b-form-input class="mt-3" placeholder="E-mail" v-model="email"
                      :state="validationRequiredStates.email"
                      @input="validateEmail" size="sm"></b-form-input>
      </b-form-group>
      <b-form-group
        :invalid-feedback="validationMessages.avatar"
        :state="validationNotRequiredStates.avatar">
        <b-form-file class="mt-3 text-left" placeholder="Wgraj avatar"
                     drop-placeholder="Wgraj avatar"
                     :state="validationNotRequiredStates.avatar"
                     @change="uploadAvatar($event)" size="sm">
        </b-form-file>
      </b-form-group>
      <b-button class="mt-3 mx-auto shadow font-weight-bold btnGreen" @click="save">
        Zapisz
      </b-button>
    </b-form>
    <b-spinner style="position:fixed; top: 49%; left:49%;width:3rem;height:3rem"
               v-if="loading"></b-spinner>
  </b-container>
</template>

<script>
export default {
  name: 'EditUserInfo',
  data() {
    return {
      validationRequiredStates: {
        login: null,
        email: null,
      },
      validationNotRequiredStates: {
        avatar: null,
      },
      validationMessages: {},
      login: '',
      oldLogin: '',
      email: '',
      oldEmail: '',
      userAvatar: '',
    };
  },
  methods: {
    checkLoginavailability() {
      this.validationRequiredStates.login = true;
      this.validationMessages.login = '';
      if (this.login !== this.oldLogin) {
        this.axios.get(`/user/checkLogin?login=${this.login}`).then((res) => {
          if (res.data.message === true) {
            this.validationRequiredStates.login = false;
            this.validationMessages.login = ' Login jest już w użyciu.';
          } else {
            this.validationRequiredStates.login = true;
          }
        });
      }
    },
    checkEmailavailability() {
      this.validationRequiredStates.email = true;
      this.validationMessages.email = '';
      if (this.email !== this.oldEmail) {
        this.axios.get(`/user/checkEmail?email=${this.email}`).then((res) => {
          if (res.data.message === true) {
            this.validationRequiredStates.email = false;
            this.validationMessages.email = ' E-mail jest już w użyciu.';
          } else {
            this.validationRequiredStates.email = true;
          }
        });
      }
    },
    uploadAvatar(e) {
      [this.userAvatar] = [e.target.files[0]];
      this.validationMessages.avatar = '';
      this.validationNotRequiredStates.avatar = true;

      const allowedExt = ['JPG', 'PNG'];
      const fileExt = this.userAvatar.name.split('.').pop().toUpperCase();
      const isCorrectExt = allowedExt.find((element) => element === fileExt);

      if (isCorrectExt === undefined) {
        this.validationNotRequiredStates.avatar = false;
        this.validationMessages.avatar += 'Tylko jpg i png';
      }

      if (this.userAvatar.size > 1024000) {
        this.validationNotRequiredStates.avatar = false;
        this.validationMessages.avatar += 'Maksymalny rozmiar avatara to 1 mb.';
      }
    },
    validateLogin() {
      this.validationRequiredStates.login = true;
      this.validationMessages.login = '';

      if (!/^[a-zA-Z0-9]([_-](?![_-])|[a-zA-Z0-9]){3,19}[a-zA-Z0-9]$/.test(this.login)) {
        this.validationRequiredStates.login = false;

        if (this.login.length < 5) {
          this.validationMessages.login += '- jest zbyt krótki ';
        }

        if (this.login.length > 21) {
          this.validationMessages.login += '- jest za długi ';
        }

        if (!/^[a-zA-Z0-9]/.test(this.login)) {
          this.validationMessages.login += '- musi rozpoczynać się od litery lub cyfry ';
        }

        if (!/[a-zA-Z0-9]$/.test(this.login)) {
          this.validationMessages.login += '- musi kończyć się literą lub cyfrą ';
        }

        if (!/^[a-zA-Z0-9_-]*$/.test(this.login)) {
          this.validationMessages.login += '- może zawierać litery i cyfry oraz - i _ ';
        }
        if (/[_-]{2,}/.test(this.login)) {
          this.validationMessages.login += '- _ i - nie mogą występować podwójnie lub obok siebie';
        }
      } else {
        this.checkLoginavailability();
      }
    },
    validateEmail() {
      this.validationRequiredStates.email = true;
      this.validationMessages.email = '';

      if (!/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.email)) {
        this.validationRequiredStates.email = false;
        this.validationMessages.email = ' E-mail jest nieprawidłowy';
      } else {
        this.checkEmailavailability();
      }
    },
    validateAll() {
      this.validateLogin();
      this.validateEmail();
    },
    save() {
      this.validateAll();
      const isCorrect = Object.values(this.validationRequiredStates)
        .find((element) => element === false);

      if (isCorrect === undefined) {
        const dataToSend = new FormData();
        dataToSend.append('login', this.login);
        dataToSend.append('email', this.email);

        if (this.validationNotRequiredStates.avatar) {
          dataToSend.append('userAvatar', this.userAvatar);
        }

        this.loading = true;
        this.axios({
          method: 'post',
          url: '/user/info/edit',
          data: dataToSend,
          headers: { 'Content-Type': 'multipart/form-data' },
        }).then(() => {
          const message = this.email === this.oldEmail ? 'Informacje zostały zmienione'
            : 'Informacje zostały zmienione. Zmiane e-mail musisz potwierdzić poprzez link wysłany w wiadomości na twój stary e-mail.,';
          this.showMessage(message, 'Informacje o użytkowniku', '/settings');
          this.$store.dispatch('setLogin', this.login);
          this.loading = false;
        }).catch((err) => {
          this.fetchErr(err);
          this.loading = false;
        });
      }
    },
  },
  created() {
    // eslint-disable-next-line no-multi-assign
    this.login = this.oldLogin = this.$store.getters.login;
    this.loading = true;
    this.axios.get('/user/info').then((res) => {
      // eslint-disable-next-line no-multi-assign
      this.email = this.oldEmail = res.data.data;
      this.loading = false;
    }).catch((err) => {
      this.fetchErr(err);
      this.loading = false;
    });
  },
};
</script>

<style lang="scss" scoped>
#editUserInfoWrapper{
  color: white;
  background-color: #1C1919;
}
</style>
