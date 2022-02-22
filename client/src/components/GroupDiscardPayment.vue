<template>
<div id="groupDiscardPaymentWrapper">
  <div class="col-12 col-sm-9 col-md-8 col-xl-6 mx-auto" v-if="payments.length">
    <GroupDiscardPaymentItem v-for="item in payments" :key="item.id" :payment-data="item"
                             @modalMessage="printMessage"/>
  </div>
  <div v-else>
    Brak Nowych Wpłat
  </div>
  <b-modal id="modalPayment" hide-footer title="Płatność">
    <p class="my-4">{{modalInfo}}!</p>
    <b-button id="buttonModal" class="mt-3"
              @click="$bvModal.hide('modalPayment')">
      Ok
    </b-button>
  </b-modal>
</div>
</template>

<script>
import GroupDiscardPaymentItem from '@/components/GroupDiscardPaymentItem.vue';
import groupDiscardDetails from '@/mixins/groupDiscardDetails';

export default {
  name: 'GroupDiscardPayment',
  mixins: [groupDiscardDetails],
  props: {
    discardId: {
      type: String,
    },
  },
  components: {
    GroupDiscardPaymentItem,
  },
  data() {
    return {
      modalInfo: '',
    };
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    printMessage(message) {
      if (message[2]) {
        this.fetchErr(message[2]);
      } else {
        this.$store.dispatch('getDiscardDetails', this.discardId);
        // this.paymentsData = this.paymentsData.filter((element) => element.id !== message[1]);
        // eslint-disable-next-line prefer-destructuring
        this.modalInfo = message[0];
        this.$bvModal.show('modalPayment');
      }
    },
  },
};
</script>

<style lang="scss">
#modalPayment{
  .modal-content{
    background-color: #1c1919;
    color: #ffffff;
  }
  .close{
    color: #ffffff;
    border: none;
  }
  #buttonModal{
    background-color: #148a14;
    border: none;
  }
}
</style>
