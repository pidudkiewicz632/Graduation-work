<template>
  <b-container id="paymentWrapper"
               class="shadow mx-auto col-11 col-sm-8  col-md-7 col-lg-5 col-xl-4 p-3 text-white">
    <h2 class="greenText">Płatność</h2>
    <h3 class="mt-4">
      {{discardInfo.idDiscard.name}}
    </h3>
    <div class="my-4">
      <div v-if="discardInfo.idDiscard.description">
        {{ discardInfo.idDiscard.description }}
      </div>
      <div v-else>
        Brak Opisu
      </div>
    </div>
    <b-badge class="greenBadge p-1 mb-1 mx-1">
      <div class="h5">
        Do zaplaty
      </div>
      <div class="h5 p-0">
        {{ obligation.amount }}
      </div>
    </b-badge>
    <b-badge class="greenBadge p-1 mb-1 mx-1">
    <div class="h5">
      Wpłacono
    </div>
    <div class="h5 p-0">
      {{ obligation.paidIn }}
    </div>
  </b-badge>
    <b-badge class="greenBadge p-1 mb-1 mx-1">
      <div class="h5">
        Pozostało
      </div>
      <div class="h5 p-0">
        {{ amountLeft }}
      </div>
    </b-badge>
    <b-form-group class="col-6 mx-auto"
                  label="Ile chcesz wpłacić"
                  :invalid-feedback="validationMessage"
                  :state="validationState">
      <PriceInput v-model="amount"
                  class="mx-auto"
                  key="specifiedInput"
                  :validate-status-prop="validationState"
                  @input="validationAmount"
                  />
    </b-form-group>
    <div>
      <b-button class="btnGreen mr-1" @click="addPayment">Ok</b-button>
    </div>
  </b-container>
</template>

<script>
import PriceInput from '@/components/PriceInput.vue';

export default {
  name: 'Payment',
  props: ['discardId', 'type'],
  components: {
    PriceInput,
  },
  data() {
    return {
      discardInfo: {
        idDiscard: {},
      },
      obligation: {},
      validationState: null,
      validationMessage: '',
      amount: 0,
      amountLeft: 0,
    };
  },
  methods: {
    validationAmount() {
      this.validationState = true;
      this.validationMessage = '';
      console.log(this.amount, this.obligation.amount);
      if (this.amount > this.amountLeft) {
        this.validationState = false;
        this.validationMessage = 'Nie może być większe od należności.';
      }
    },
    addPayment() {
      this.validationAmount();

      if (this.validationState) {
        const paymentData = new FormData();

        paymentData.append('amount', this.amount);
        paymentData.append('discardCycleId', this.discardId);

        this.axios({
          method: 'post',
          url: `/discard/${this.type}/payment/create/`,
          data: paymentData,
          headers: { 'Content-Type': 'multipart/form-data' },
        }).then(() => {
          const link = this.type === 'group' ? `/discard/details/0/${this.discardId}` : `/discard/single/details/${this.discardId}`;
          this.showMessage('Dodano', 'Tworzenie płatności', link);
        }).catch((err) => {
          this.fetchErr(err);
        });
      }
    },
  },
  created() {
    this.axios.get(`discard/${this.type}/payment/create/${this.discardId}`)
      .then((res) => {
        if (res.data.data) {
          this.discardInfo = res.data.data.discard;
          this.obligation = res.data.data.obligation;
          this.amountLeft = Number((this.obligation.amount - this.obligation.paidIn).toFixed(2));

          this.amount = this.amountLeft > 0 ? this.amountLeft : this.obligation.amount;

          return;
        }
        this.showMessage('Coś poszło nie tak', 'Tworzenie płatności', '/home');
      })
      // eslint-disable-next-line consistent-return
      .catch((err) => {
        if (err.response.status === 405) {
          return this.$router.push('groups');
        }
        this.fetchErr(err);
      });
  },
};
</script>

<style lang="scss" scoped>
#paymentWrapper{
  background-color: #1C1919;
}
</style>
