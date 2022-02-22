<template>
  <b-container id="emailRequestWrapper" class="mx-auto col-11 col-lg-4 col-sm-8 shadow-lg
  p-0 mt-2 p-3">
    <h2 class="mb-3 greenText">{{title}}</h2>
    <b-form class="d-flex flex-column col-10 mx-auto">
      <b-form-group
        label="Podaj E-mail"
        :invalid-feedback="validationMessage"
        :state="validationState">
        <b-form-input class="mt-3" v-model="email"
                      placeholder="E-mail" :state="validationState"
                      @change="validateEmail" size="sm"></b-form-input>
      </b-form-group>
      <div class="my-2">
        <b-button class="mt-3 mx-1 shadow font-weight-bold btnGreen" @click="send">
          Ok
        </b-button>
        <b-button class="mt-3 mx-1 shadow font-weight-bold btnGreen" @click="back">
          Anuluj
        </b-button>
      </div>
    </b-form>
  </b-container>
</template>

<script>
export default {
  name: 'EmailRequestSend',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      validationState: null,
      validationMessage: '',
      email: '',
    };
  },
  methods: {
    async validateEmail() {
      this.validationState = true;
      this.validationMessages = '';
      await this.axios.get(`/user/checkEmail?email=${this.email}`).then((res) => {
        this.validationState = res.data.message;
      });
      this.validationMessage = this.validationState ? '' : 'Podany e-mail nie jest przypisany do żadnego konta.';
    },
    async send() {
      await this.validateEmail();

      if (this.validationState) {
        this.$emit('sendData', this.email);
      }
    },
    back() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
#emailRequestWrapper{
  background-color: #1c1919;
  color: #ffffff;
}
</style>
