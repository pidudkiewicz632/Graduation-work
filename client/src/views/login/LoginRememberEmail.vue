<template>
  <EmailRequestSend :title="'Przypomnienie Loginu'" @sendData="send"/>
</template>

<script>
import EmailRequestSend from '@/components/EmailRequestSend.vue';

export default {
  name: 'LoginRememberEmail',
  components: {
    EmailRequestSend,
  },
  methods: {
    send(email) {
      const data = new FormData();
      data.append('email', email);

      this.axios.post('/user/login/remember', data)
        .then(() => {
          this.showMessage('Na podany adres e-mail została wysłana wiadomość z loginem.', 'Przypomnienie loginu', 'login');
        }).catch((err) => {
          this.fetchErr(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
