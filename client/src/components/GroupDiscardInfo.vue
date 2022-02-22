<template>
  <div id="groupDiscardInfoWrapper">
    <div v-if="discardInfo.idDiscard" class="row mx-auto justify-content-center mb-3">
      <div>Grupa:</div>
      <a v-if="discardInfo.idDiscard.idGroup" href="" @click="toGroup">
        {{discardInfo.idDiscard.idGroup.name}}
      </a>
    </div>
    <div class="my-3 font-weight-bold">
      Termin:
      <span class="greenText">
        {{ discardInfo.dateOfPayment }}
      </span>
    </div>
    <div class="my-4">
      <div v-if="discardInfo.idDiscard.description">
        {{ discardInfo.idDiscard.description }}
      </div>
      <div v-else>
        Brak Opisu
      </div>
    </div>
    <div class="py-3" v-if="userObligation">
      <div class="h3">
        Twoja należność
      </div>
      <div class="h3">
        {{userObligation.amount}}
      </div>
      <div class="my-3" v-if="userObligation.paidIn > 0 && !isPaid">
        <div class="h3">
          Wpłacono
        </div>
        <div class="h3">
          {{userObligation.paidIn }}
        </div>
      </div>
      <div class="greenText font-weight-bold" v-if="isPaid">
        Zapłacono
      </div>
    </div>
    <div>
      <b-button class="btnGreen mx-1" v-if="showPaymentButton"  @click="$emit('toPayment')">
        Zapłać
      </b-button>
      <b-button class="btnGreen mx-1" v-if="permission" @click="$emit('toEditInfo')">
       Edytuj
      </b-button>
      <b-button class="btnGreen mx-1" v-if="permission" @click="showConfirmModal">
        Usuń
      </b-button>
    </div>
  </div>
</template>

<script>
import groupDiscardDetails from '@/mixins/groupDiscardDetails';

export default {
  name: 'GroupDiscardInfo',
  mixins: [groupDiscardDetails],
  props: {
    discardId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      confirmModalValue: '',
    };
  },
  computed: {
    isPaid() {
      if (this.userObligation) {
        return this.userObligation.paidIn >= this.userObligation.amount;
      }
      return false;
    },
    showPaymentButton() {
      if (!this.userObligation) {
        return false;
      }
      return !this.isPaid;
    },
  },
  methods: {
    toGroup() {
      this.$router.push(`/group/details/${this.discardInfo.idDiscard.idGroup.id}`);
    },
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
            this.axios.post('/discard/group/delete', data).then(() => {
              this.showMessage('Zrzutka została usunięta.', 'Usunięcie zrzutki', '/');
              this.loading = false;
            }).catch((err) => {
              this.fetchErr(err);
              this.loading = false;
            });
          }
        });
    },
  },
};
</script>

<style scoped>

</style>
