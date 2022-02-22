<template>
  <div class="groupDiscardPaymentItem greenBadge shadow rounded
  row justify-content-between align-items-center mx-auto px-3 py-2 my-2"
       @click="more">
    <div>
      {{ paymentData.idUser.login }} wpłacił {{ paymentData.amount }}
    </div>
    <b-icon-triangle-fill font-scale="1" :rotate="degrees">
    </b-icon-triangle-fill>
    <div class="col-12 row justify-content-center align-items-center mt-2 mx-auto" v-if="showMore">
      <b-button class="shadow" @click="acceptInvite(true)">Akceptuj</b-button>
      <b-button class="shadow" @click="acceptInvite(false)">Odrzuć</b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GroupDiscardPaymentItem',
  props: {
    paymentData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showMore: false,
      degrees: 180,
    };
  },
  methods: {
    more() {
      this.showMore = !this.showMore;
      this.degrees = this.degrees === 180 ? 0 : 180;
    },
    acceptInvite(accepted) {
      const paymentData = new FormData();

      paymentData.append('isAccepted', accepted);
      paymentData.append('paymentId', this.paymentData.id);

      this.axios.post('/discard/payment/accept', paymentData)
        .then(() => {
          const message = accepted ? 'Płatność została zakceptowana' : 'Płatność została odrzucona';
          this.$emit('modalMessage', [message, this.paymentData.id]);
        })
        .catch(() => {
          this.$emit('modalMessage', ['Coś poszło nie tak', this.paymentData.id]);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.groupDiscardPaymentItem{
  button{
    background-color: #1C1919;
    border: none;
  }
}
</style>
