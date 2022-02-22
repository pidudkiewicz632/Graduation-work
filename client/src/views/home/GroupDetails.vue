<template>
  <b-container id="groupDetailsWrapper"
               class="shadow mx-auto col-11 col-lg-8 col-xl-5 p-0 mb-3">
    <div class="greenBadge col-12 row justify-content-between align-items-center mx-0 py-1">
      <b-icon-triangle-fill class="my-2" rotate="270" @click="changeOverlap"></b-icon-triangle-fill>
      <h2 class="mt-3">
        {{ currentOverlap }}
      </h2>
      <b-icon-triangle-fill class="my-2" rotate="90" @click="changeOverlap"></b-icon-triangle-fill>
    </div>
    <div class="py-2 px-4">
      <GroupInfo v-if="currentOverlap === 'Informacje'" :group-id="groupId"/>
      <GroupDiscards v-if="currentOverlap === 'Zrzutki'" :group-id="groupId"/>
    </div>
    <b-spinner style="position:fixed; top: 49%; left:49%;width:3rem;height:3rem"
               v-if="loading"></b-spinner>
  </b-container>
</template>

<script>
import groupInfo from '@/mixins/groupInfo';
import sortingFunctions from '@/mixins/sortingFunctions';
import GroupInfo from '@/components/GroupInfo.vue';
import GroupDiscards from '@/components/GroupDiscards.vue';

export default {
  name: 'GroupDetails',
  mixins: [groupInfo, sortingFunctions],
  components: {
    GroupInfo,
    GroupDiscards,
  },
  props: ['groupId'],
  data() {
    return {
      currentOverlap: 'Informacje',
    };
  },
  methods: {
    changeOverlap() {
      this.currentOverlap = this.currentOverlap === 'Informacje' ? 'Zrzutki' : 'Informacje';
    },
  },
  mounted() {
    this.loading = true;
    this.axios.get(`/group/details/${this.groupId}`)
      .then((res) => {
        if (res.data.info) {
          this.userPermission = res.data.permission === 'admin' || res.data.permission === 'owner';
          this.groupDetails = res.data.info;
          this.groupDiscards = res.data.discards;
          this.groupDiscards.forEach((item) => {
            // eslint-disable-next-line no-param-reassign
            item.tag = item.paidIn >= item.amount ? 'paid' : 'unpaid';
            const tempAmount = (item.amount - item.paidIn).toFixed(2);

            if (item.tag === 'paid') {
              // eslint-disable-next-line no-param-reassign
              item.amountOver = tempAmount < 0 ? tempAmount * -1 : tempAmount;
            } else {
              // eslint-disable-next-line no-param-reassign
              item.amountLeft = Number(tempAmount);
            }
          });
          this.groupMembers = this.groupDetails.members
            .sort((left, right) => this.sortingAsc(left.permission, right.permission));
          this.loading = false;
          return;
        }
        this.showMessage('Coś poszło nie tak', 'Szczegóły zrzutki', '/groups');
        this.loading = false;
      })
      // eslint-disable-next-line consistent-return
      .catch((err) => {
        if (err.response.status === 405) {
          return this.$router.push('groups');
        }
        this.loading = false;
        this.fetchErr(err);
      });
  },
};
</script>

<style lang="scss" scoped>
#groupDetailsWrapper {
  color: white;
  background-color: #1C1919;
}
</style>
