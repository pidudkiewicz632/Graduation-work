<template>
  <EmailConfirmation :message="message" :title="'Zmiana E-mail'"/>
</template>

<script>
import EmailConfirmation from '@/components/EmailConfirmation.vue';

export default {
  name: 'AccountActivate',
  components: {
    EmailConfirmation,
  },
  props: ['requestId'],
  data() {
    return {
      message: '',
    };
  },
  created() {
    const dataToSend = new FormData();

    dataToSend.append('requestId', this.requestId);

    this.axios.post('/user/account/activate', dataToSend)
      .then((res) => {
        this.message = res.data.data ? 'Konto zostało aktywowane' : 'Link wygasł.';
      }).catch((err) => {
        this.fetchErr(err);
      });
  },
};
</script>

<style scoped>

</style>
