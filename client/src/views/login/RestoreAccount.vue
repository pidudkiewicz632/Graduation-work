<template>
  <EmailConfirmation :message="message" :title="'Zmiana E-mail'"/>
</template>

<script>
import EmailConfirmation from '@/components/EmailConfirmation.vue';

export default {
  name: 'RestoreAccount',
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

    this.axios.post('/user/restore', dataToSend)
      .then((res) => {
        this.message = res.data.data ? `Konto ${res.data.data} zostało przywrócone` : 'Link wygasł.';
      }).catch((err) => {
        this.fetchErr(err);
      });
  },
};
</script>

<style scoped>

</style>
