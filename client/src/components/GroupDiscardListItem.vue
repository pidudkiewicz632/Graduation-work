<template>
  <div class="groupDiscardItemWrapper col-12 col-sm-11 col-md-9 my-3 p-0 mx-auto"
       @click="$emit('toDetails', discardData.id)">
    <div class="content shadow">
      <div class="row align-items-center justify-content-between
      greenBadge shadow col-12 py-2 ml-0">
        <div class="font-weight-bold">
          {{ discardData.name }}
        </div>
        <b-icon-triangle-fill font-scale="1" rotate="90">
        </b-icon-triangle-fill>
      </div>
      <b-row class="p-3 align-items-center justify-content-between">
        <b-col class="text-left font-weight-bold col-6">
          <div>Termin</div>
          <div class="greenText">
            {{ discardData.dateOfPayment }}
          </div>
        </b-col>
        <b-col class="text-right font-weight-bold col-5">
          <div v-if="discardData.tag === 'paid'">
            <div>Nadpłata</div>
            <div class="greenText">
              {{ discardData.amountOver}}
            </div>
          </div>
          <div v-else-if="discardData.tag === 'others'">
            <div>Suma</div>
            <div class="greenText">
              {{discardData.sum}}
            </div>
          </div>
          <div v-else>
            <div>Pozostało</div>
            <div class="greenText">
              {{ discardData.amountLeft}}
            </div>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GroupDiscardListItem',
  props: {
    discardData: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.discardData.dateOfPayment = this.$dayjs(this.discardData.dateOfPayment).format('YYYY-MM-DD');
  },
};
</script>

<style lang="scss" scoped>
.groupDiscardItemWrapper{
  .content{
    background-color: #1c1912;
  }
}
</style>
