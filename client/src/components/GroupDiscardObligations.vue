<template>
<div class="groupDiscardObligationsWrapper">
  <div class="col-12 col-sm-8 mx-auto font-weight-bold mb-3">
    <div class="row justify-content-between">
      <div class="col-4"></div>
      <div class="col-3 editDiscardColumnNames">Należność</div>
      <div class="col-3 editDiscardColumnNames">Wpłata</div>
    </div>
    <DiscardObligationItem v-for="item in obligationsData" :key="item.id" :obligation-data="item"/>
    <div class="row justify-content-between">
      <div class="col-4">Suma</div>
      <div class="col-3 editDiscardColumnNames">
        {{amountsSum}}
      </div>
      <div class="col-3 editDiscardColumnNames">
        {{ paidInSum }}
      </div>
    </div>
  </div>
    <b-button class="btnGreen mr-1" v-if="permission" @click="$emit('toEditObligations')">
      Edytuj
    </b-button>
</div>
</template>

<script>
import DiscardObligationItem from '@/components/DiscardObligationItem.vue';
import groupDiscardDetails from '@/mixins/groupDiscardDetails';

export default {
  name: 'GroupDiscardObligations',
  mixins: [groupDiscardDetails],
  props: ['discardId'],
  components: {
    DiscardObligationItem,
  },
  data() {
    return {
      amountsSum: 0,
      paidInSum: 0,
      obligationsData: [],
    };
  },
  methods: {
    calculateObligations(val) {
      this.paidInSum = 0;
      this.amountsSum = 0;
      this.obligationsData = val;
      this.obligationsData.forEach((item) => {
        const paidIn = Number(item.paidIn);
        const amount = Number(item.amount);
        this.paidInSum += paidIn;
        this.amountsSum += amount;
        // eslint-disable-next-line no-param-reassign
        item.amount = amount;
        // eslint-disable-next-line no-param-reassign
        item.paidIn = paidIn;
      });
      this.paidInSum = this.paidInSum.toFixed(2);
      this.amountsSum = this.amountsSum.toFixed(2);
    },
  },
  watch: {
    allObligations(val) {
      this.calculateObligations(val);
    },
  },
  created() {
    this.calculateObligations(this.allObligations);
  },
};
</script>

<style lang="scss" scoped>
  .editDiscardColumnNames{
    font-size: smaller;
  }
</style>
