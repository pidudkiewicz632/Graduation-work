<template>
  <div class="discardListItemWrapper col-11 col-sm-5 col-md-5 col-lg-5 m-1 p-0">
      <div class="content shadow"
           @click="more">
        <div class="greenBadge shadow col-12 py-2 font-weight-bold">
          {{ discardData.name }}
        </div>
        <b-row v-if="discardData.type === 'group'" class="p-3">
          <b-col class="text-left font-weight-bold mb-1 col-5">
            <div>Termin:</div>
            <div class="greenText">
              {{ discardData.dateOfPayment }}
            </div>
          </b-col>
          <b-col class="text-right font-weight-bold mr-0"
                 v-if="discardData.isPaid === false || !allDiscards">
            <div>Pozostało:</div>
            <div class="greenText">
              {{ discardData.amountLeft }}
            </div>
          </b-col>
          <b-col class="text-right font-weight-bold mr-0"
                 v-if="discardData.isPaid  === true ">
            <div>Nadpłata:</div>
            <div class="greenText">
              {{ discardData.amountOver }}
            </div>
          </b-col>
          <b-col v-if="showMore"
                 class="text-left font-weight-bold col-5">
            <div>Grupa:</div>
            <div class="greenText">
              {{ discardData.groupName }}
            </div>
          </b-col>
        </b-row>
        <b-row v-if="discardData.type === 'single'" class="p-3">
          <b-col class="text-left font-weight-bold mb-1 col-5">
            <div>Termin:</div>
            <div class="greenText">
              {{ discardData.dateOfPayment }}
            </div>
          </b-col>
          <b-col class="text-right font-weight-bold mr-0"
                 v-if="discardData.isPaid === false || !allDiscards">
            <div>Pozostało:</div>
            <div class="greenText">
              {{ discardData.amountLeft }}
            </div>
          </b-col>
          <b-col class="text-right font-weight-bold mr-0"
                 v-if="discardData.isPaid === true ">
            <div>Nadpłata:</div>
            <div class="greenText">
              {{ discardData.amountOver }}
            </div>
          </b-col>
          <b-col v-if="showMore"
                 class="text-left font-weight-bold col-5">
            <div v-if="isCurrUserRecipient === true">
              <div>Dłużnik:</div>
              <div class="greenText">
                {{ discardData.debtor }}
              </div>
            </div>
            <div v-else>
              <div>Odbiorca:</div>
              <div class="greenText">
                {{ discardData.recipient }}
              </div>
            </div>
          </b-col>
        </b-row>
        <div v-if="showMore" class="mb-1">
          <b-button v-if="(discardData.takePart === true && !discardData.isPaid) || !allDiscards"
                    class="btnGreen shadow mx-1"
                    @click="toPayment">Zapłać</b-button>
          <b-button class="btnGreen shadow mx-1" @click="toDetails">Szczegóły</b-button>
        </div>
        <b-icon-triangle-fill class="my-2" :rotate="degrees">
        </b-icon-triangle-fill>
      </div>
  </div>
</template>

<script>
export default {
  name: 'DiscardListItem',
  props: {
    discardData: {
      type: Object,
      required: true,
    },
    allDiscards: {
      type: Boolean,
    },
  },
  data() {
    return {
      showMore: false,
      degrees: 180,
    };
  },
  computed: {
    isCurrUserRecipient() {
      return this.discardData.recipient === this.$store.getters.login;
    },
  },
  methods: {
    more() {
      this.showMore = !this.showMore;
      this.degrees = this.degrees === 180 ? 0 : 180;
    },
    toPayment() {
      this.$router.push({ path: `/payment/${this.discardData.type}/${this.discardData.id}` });
    },
    toDetails() {
      const link = this.discardData.type === 'group' ? `/discard/details/0/${this.discardData.id}` : `/discard/single/details/${this.discardData.id}`;
      this.$router.push({ path: link });
    },
  },
};
</script>

<style lang="scss" scoped>
.discardListItemWrapper{
  .content{
    background-color: #1C1919;
  }
}
</style>
