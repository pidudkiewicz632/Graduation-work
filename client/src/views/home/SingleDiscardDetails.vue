<template>
<b-container id="singleDiscardDetailsWrapper"
             class="shadow mx-auto col-11 col-lg-8 col-xl-5 p-4 mb-3">
  <h2 v-if="discardInfo.idDiscard" class="greenText">
    {{ discardInfo.idDiscard.name }}
  </h2>
  <div class="my-3 font-weight-bold">
    Termin:
    <span class="greenText">
        {{ discardInfo.dateOfPayment }}
      </span>
  </div>
  <div v-if="discardInfo.idDiscard" class="my-4">
    <div v-if="discardInfo.idDiscard.description">
      {{ discardInfo.idDiscard.description }}
    </div>
    <div v-else>
      Brak Opisu
    </div>
  </div>
  <div>
    <div v-if="permission === 'recipient'">
      <div class="my-3 font-weight-bold">
        Dłużnik
        <span class="greenText">
        {{ discardInfo.obligation.idUser.login }}
      </span>
      </div>
      <div class="col-12 col-sm-9 col-md-8 col-xl-6 mx-auto">
        <GroupDiscardPaymentItem v-for="item in payments" :key="item.id" :payment-data="item"
                                 @modalMessage="printMessage"/>
      </div>
    </div>
    <div v-else>
      <div class="my-3 font-weight-bold">
        Odbiorca
        <span v-if="discardInfo.idDiscard" class="greenText">
          {{ discardInfo.idDiscard.idRecipient.login }}
        </span>
      </div>
    </div>
    <b-badge class="greenBadge p-1 mb-1 mx-1">
      <div class="h5">
        Do zapłaty
      </div>
      <div v-if="discardInfo.obligation" class="h5 p-0">
        {{ discardInfo.obligation.amount }}
      </div>
    </b-badge>
    <b-badge class="greenBadge p-1 mb-1 mx-1">
      <div class="h5">
        {{ labelAmount }}
      </div>
      <div v-if="discardInfo.obligation" class="h5 p-0">
        {{ amountToPrint }}
      </div>
    </b-badge>
    <b-badge class="greenBadge p-1 mb-1 mx-1">
      <div class="h5">
        Wpłacono
      </div>
      <div v-if="discardInfo.obligation" class="h5 p-0">
        {{ discardInfo.obligation.paidIn }}
      </div>
    </b-badge>
  </div>
  <div>
    <b-button class="btnGreen mx-1" v-if="permission === 'debtor' && !isPaid"  @click="toPayment">
      Zapłać
    </b-button>
    <b-button class="btnGreen mx-1" v-if="permission === 'recipient'" @click="toEdit()">
      Edytuj
    </b-button>
    <b-button class="btnGreen mx-1" v-if="permission === 'recipient'" @click="showConfirmModal">
      Usuń
    </b-button>
  </div>
  <b-modal id="modalPayment" hide-footer title="Płatność">
    <p class="my-4">{{modalInfo}}</p>
    <b-button id="buttonModal" class="mt-3"
              @click="$bvModal.hide('modalPayment')">
      Ok
    </b-button>
  </b-modal>
  <b-spinner style="position:fixed; top: 49%; left:49%;width:3rem;height:3rem"
             v-if="loading"></b-spinner>
</b-container>
</template>

<script>
import GroupDiscardPaymentItem from '@/components/GroupDiscardPaymentItem.vue';

export default {
  name: 'SingleDiscardDetails',
  props: ['discardId'],
  components: {
    GroupDiscardPaymentItem,
  },
  data() {
    return {
      discardInfo: {},
      permission: '',
      amountLeft: 0,
      payments: [],
      isPaid: false,
      modalInfo: '',
      confirmModalValue: '',
    };
  },
  computed: {
    labelAmount() {
      return !this.isPaid ? 'Pozostało' : 'Nadwyżka';
    },
    amountToPrint() {
      return !this.isPaid ? this.amountLeft : this.amountLeft * -1;
    },
  },
  methods: {
    showConfirmModal() {
      this.confirmModalValue = '';
      this.$bvModal.msgBoxConfirm('Czy na pewno chcesz usunąć?', {
        okTitle: 'Tak',
        cancelTitle: 'Nie',
      })
        .then((value) => {
          if (value) {
            this.loading = true;
            const data = new FormData();
            data.append('discardCycleId', this.discardId);
            this.axios.post('/discard/single/delete', data).then(() => {
              this.showMessage('Zrzutka została usunięta.', 'Usunięcie zrzutki', '/');
              this.loading = false;
            }).catch((err) => {
              this.fetchErr(err);
              this.loading = false;
            });
          }
        });
    },
    printMessage(message) {
      if (message[2]) {
        this.fetchErr(message[2]);
      } else {
        this.loadData();
        // eslint-disable-next-line prefer-destructuring
        this.modalInfo = message[0];
        this.$bvModal.show('modalPayment');
      }
    },
    toEdit() {
      this.$router.push({ path: `/discard/single/edit/${this.discardId}` });
    },
    toPayment() {
      this.$router.push({ path: `/payment/single/${this.discardId}` });
    },
    loadData() {
      this.axios.get(`/discard/single/details/${this.discardId}`)
        .then((res) => {
          if (res.data.info) {
            this.discardInfo = res.data.info;
            this.permission = res.data.permission;
            this.payments = res.data.payments;
            this.discardInfo.dateOfPayment = this.$dayjs(this.discardInfo.dateOfPayment).format('YYYY-MM-DD');
            // eslint-disable-next-line max-len
            this.amountLeft = Number((this.discardInfo.obligation.amount - this.discardInfo.obligation.paidIn).toFixed(2));
            this.isPaid = this.discardInfo.obligation.amount <= this.discardInfo.obligation.paidIn;
            this.loading = false;
            return;
          }
          this.showMessage('Coś poszło nie tak', 'Szczegóły zrzutki', '/home');
          this.loading = false;
        })
        // eslint-disable-next-line consistent-return
        .catch((err) => {
          if (err.response.status === 405) {
            return this.$router.push('/home');
          }
          this.loading = false;
          this.fetchErr(err);
        });
    },
  },
  created() {
    this.loadData();
  },
};
</script>

<style lang="scss" scoped>
#singleDiscardDetailsWrapper{
    color: white;
    background-color: #1C1919;
}
</style>
