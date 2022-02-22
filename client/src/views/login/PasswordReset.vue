<template>
  <b-container id="resetPasswordWrapper"
               class="shadow mx-auto col-11 col-sm-8 darkBg col-md-7 col-lg-5 col-xl-4 p-3">
    <h2 class="mb-3 greenText">
      Zmiana Hasła
    </h2>
    <b-form class="d-flex flex-column col-10 mx-auto" v-if="isCorrectRequest">
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
      <b-button class="mt-3 mx-auto shadow font-weight-bold btnGreen" @click="save">
        Zapisz
      </b-button>
    </b-form>
    <div v-else>
      Link jest niepoprawny.
    </div>
  </b-container>
</template>

<script>
export default {
  name: 'PasswordReset',
  props: ['requestId'],
  data() {
    return {
      validationRequiredStates: {
        password: null,
        passwordTwo: null,
      },
      validationMessages: {
        passwordTwo: 'Hasła są od siebie różne',
      },
      message: 'Link jest nieważny',
      isCorrectRequest: false,
      password: '',
      passwordTwo: '',
    };
  },
  methods: {
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
      this.validatePassword();
      this.validateTwoPassword();
    },
    save() {
      this.validateAll();
      const isCorrect = Object.values(this.validationRequiredStates)
        .find((element) => element === false);

      if (isCorrect === undefined) {
        const dataToSend = new FormData();
        dataToSend.append('password', this.password);
        dataToSend.append('requestId', this.requestId);

        this.axios.post('/user/password/reset/change', dataToSend)
          .then(() => {
            this.showMessage('Hasło zostało zmienione', 'Resetowanie Hasła', '/login');
          }).catch((err) => {
            this.fetchErr(err);
          });
      }
    },
  },
  mounted() {
    this.axios.get(`/user/request/check/${this.requestId}`).then((res) => {
      this.isCorrectRequest = res.data.data;
    });
  },
};
</script>

<style lang="scss" scoped>
#resetPasswordWrapper{
  color: white;
  background-color: #1C1919;
}
</style>
