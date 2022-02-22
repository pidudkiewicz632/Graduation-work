<template>
<EmailConfirmation :message="message" :title="'Zmiana E-mail'"/>
</template>

<script>
import EmailConfirmation from '@/components/EmailConfirmation.vue';

export default {
  name: 'EmailChangeConfirmation',
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

    this.axios.post('/user/email/change/confirmation', dataToSend)
      .then((res) => {
        this.message = res.data.data ? `E-mail został zmieniony na ${res.data.data}` : 'Link wygasł.';
      }).catch((err) => {
        this.fetchErr(err);
      });
  },
};
</script>

<style lang="scss" scoped>

</style>
