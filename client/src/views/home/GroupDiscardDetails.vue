<template>
  <b-container id="groupDiscardDetailsWrapper"
               class="mx-auto col-11 col-lg-8 col-xl-5 p-0 mb-3">
    <div class="content shadow">
      <div class="greenBadge col-12 row justify-content-between align-items-center mx-0 py-1">
        <b-icon-triangle-fill v-if="permission" class="my-2" rotate="270"
                              @click="changeOverlap(-1)">
        </b-icon-triangle-fill>
        <h2 class="mt-3 mx-auto">
          {{ overlaps[currentOverlap] }}
        </h2>
        <b-icon-triangle-fill v-if="permission" class="my-2" rotate="90" @click="changeOverlap(1)">
        </b-icon-triangle-fill>
      </div>
      <div class="py-4 px-4">
        <div class="my-4 h2">
          {{ discardInfo.idDiscard.name }}
        </div>
        <GroupDiscardInfo v-if="overlaps[currentOverlap] === 'Informacje'"
                          :discardId="discardId"
                          @toPayment="toPayment"
                          @toEditInfo="toEditInfo">

        </GroupDiscardInfo>
        <GroupDiscardObligations v-if="overlaps[currentOverlap] === 'Należności'"
                                 @toEditObligations="toEditObligations"/>
        <GroupDiscardPayment v-if="overlaps[currentOverlap] === 'Wpłaty'"
                             :payments-data="payments"
                             :discard-id="discardId"/>
      </div>
    </div>
    <b-spinner style="position:fixed; top: 49%; left:49%;width:3rem;height:3rem"
               v-if="loading"></b-spinner>
  </b-container>
</template>

<script>
import sortingFunctions from '@/mixins/sortingFunctions';
import groupDiscardDetails from '@/mixins/groupDiscardDetails';
import GroupDiscardInfo from '@/components/GroupDiscardInfo.vue';
import GroupDiscardObligations from '@/components/GroupDiscardObligations.vue';
import GroupDiscardPayment from '@/components/GroupDiscardPayment.vue';

export default {
  name: 'GroupDiscardDetails',
  mixins: [sortingFunctions, groupDiscardDetails],
  components: {
    GroupDiscardInfo,
    GroupDiscardObligations,
    GroupDiscardPayment,
  },
  props: ['discardId', 'overlap'],
  data() {
    return {
      currentOverlap: Number(this.overlap),
      overlaps: ['Informacje', 'Należności', 'Wpłaty'],
      lastRoute: '',
    };
  },
  methods: {
    changeOverlap(direction) {
      const maxOverlap = this.permission ? 2 : 0;

      if (this.currentOverlap === maxOverlap && direction === 1) {
        this.currentOverlap = 0;
      } else if (this.currentOverlap === 0 && direction === -1) {
        this.currentOverlap = maxOverlap;
      } else {
        this.currentOverlap += direction;
      }
    },
    toPayment() {
      this.$router.push({ path: `/payment/group/${this.discardId}` });
    },
    toEditObligations() {
      this.$router.push({ path: `/group/obligations/edit/${this.discardId}` });
    },
    toEditInfo() {
      this.$router.push({ path: `/discard/info/edit/${this.discardId}` });
    },
  },
  created() {
    this.loading = true;
    this.$store.dispatch('getDiscardDetails', this.discardId).then((data) => {
      if (data) {
        this.discardInfo.dateOfPayment = this.$dayjs(this.discardInfo.dateOfPayment).format('YYYY-MM-DD');
        this.loading = false;
        return;
      }
      this.showMessage('Coś poszło nie tak', 'Edycja zrzutki', 'groups');
      this.loading = false;
      // eslint-disable-next-line consistent-return
    }).catch((err) => {
      this.loading = false;
      this.fetchErr(err);
    });
  },
};
</script>

<style lang="scss" scoped>
#groupDiscardDetailsWrapper {
  color: white;
  .content{
    background-color: #1C1919;
  }
}
</style>
