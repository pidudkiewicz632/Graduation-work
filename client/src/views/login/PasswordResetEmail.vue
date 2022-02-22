<template>
  <div>
    <EmailRequestSend :title="'Resetowanie Hasła'" @sendData="send"/>
  </div>
</template>

<script>
import EmailRequestSend from '@/components/EmailRequestSend.vue';

export default {
  name: 'PasswordResetEmail',
  components: {
    EmailRequestSend,
  },
  methods: {
    send(email) {
      const data = new FormData();
      data.append('email', email);

      this.axios.post('/user/password/reset', data)
        .then(() => {
          this.showMessage('Na podany adres e-mail została wysłana wiadomość z linkiem.', 'Resetowanie hasła', 'login');
        }).catch((err) => {
          this.fetchErr(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
