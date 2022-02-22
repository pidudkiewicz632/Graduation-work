<template>
  <b-container id="changePasswordWrapper"
               class="shadow mx-auto col-11 col-sm-8 darkBg col-md-7 col-lg-5 col-xl-4 p-3">
    <h2 class="mb-3 greenText">
      Zmiana Hasła
    </h2>
    <b-form class="d-flex flex-column col-10 mx-auto">
      <b-form-group
        label="Stare Hasło"
        :invalid-feedback="validationMessages.oldPassword"
        :state="validationRequiredStates.oldPassword">
        <b-form-input class="mt-3" type="password" v-model="oldPassword"
                      placeholder="Hasło" :state="validationRequiredStates.oldPassword"
                      @input="validateOldPassword" size="sm"></b-form-input>
      </b-form-group>
      <b-form-group
        label="Nowe Hasło"
        :invalid-feedback="validationMessages.password"
        :state="validationRequiredStates.password">
        <b-form-input class="mt-3" type="password" v-model="password"
                      placeholder="Hasło" :state="validationRequiredStates.password"
                      @input="validatePassword" size="sm"></b-form-input>
      </b-form-group>
      <b-form-group
        label="Powtórz Hasło"
        :invalid-feedback="validationMessages.passwordTwo"
        :state="validationRequiredStates.passwordTwo">
        <b-form-input class="mt-3" type="password" v-model="passwordTwo"
                      placeholder="Powtórz Hasło"
                      :state="validationRequiredStates.passwordTwo"
                      @input="validateTwoPassword" size="sm"></b-form-input>
      </b-form-group>
      <b-form-invalid-feedback :state="badOldPassword === ''">
        {{badOldPassword}}
      </b-form-invalid-feedback>
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
  name: 'ChangePassword',
  data() {
    return {
      validationRequiredStates: {
        password: null,
        passwordTwo: null,
      },
      validationMessages: {
        passwordTwo: 'Hasła są od siebie różne',
      },
      password: '',
      passwordTwo: '',
      oldPassword: '',
      badOldPassword: '',
    };
  },
  methods: {
    validateOldPassword() {
      this.validationRequiredStates.oldPassword = true;
      this.validationMessages.oldPassword = '';
      this.badOldPassword = '';

      if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.{8,})/.test(this.oldPassword)) {
        this.validationRequiredStates.oldPassword = false;
        this.validationMessages.oldPassword = 'Hasło ma nieprawidłowy format.';
      }
    },
    validatePassword() {
      this.validationRequiredStates.password = true;
      this.validationMessages.password = '';

      if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.{8,})/.test(this.password)) {
        this.validationRequiredStates.password = false;

        if (this.password.length < 8) {
          this.validationMessages.password += '- zbyt krótkie';
        }

        if (!/^(?=.*[A-Z])/.test(this.password)) {
          this.validationMessages.password += '- musi zawierać jedną dużą literę';
        }

        if (!/^(?=.*[a-z])/.test(this.password)) {
          this.validationMessages.password += '- musi zawierać jedną małą literę';
        }

        if (!/^(?=.*[0-9])/.test(this.password)) {
          this.validationMessages.password += '- musi zawierać jedną cyfrę.';
        }
      }
    },
    validateTwoPassword() {
      // eslint-disable-next-line max-len
      this.validationRequiredStates.passwordTwo = !(this.password !== this.passwordTwo
        || this.validationRequiredStates.password === false);
    },
    validateAll() {
      this.validateOldPassword();
      this.validatePassword();
      this.validateTwoPassword();
    },
    save() {
      this.validateAll();
      const isCorrect = Object.values(this.validationRequiredStates)
        .find((element) => element === false);

      if (isCorrect === undefined) {
        const dataToSend = new FormData();
        dataToSend.append('oldPassword', this.oldPassword);
        dataToSend.append('password', this.password);

        this.loading = true;
        this.axios({
          method: 'post',
          url: '/user/password/change',
          data: dataToSend,
        }).then(() => {
          this.showMessage('Hasło zostało zmienione', 'Informacje o użytkowniku', '/settings');
          this.loading = false;
        }).catch((err) => {
          if (err.response) {
            if (err.response.status === 403) {
              this.badOldPassword = 'Stare hasło jest nieprawidłowe.';
            }
          }
          this.fetchErr(err);
          this.loading = false;
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#changePasswordWrapper{
  color: white;
  background-color: #1C1919;
}
</style>
