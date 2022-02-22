<template>
  <div class="discardObligationItem row justify-content-between align-items-center
     greenBadge rounded py-2 my-2">
      <div class="col-4 d-flex justify-content-start align-items-center">
        <b-avatar class="mr-1 bv-d-md-down-none" variant="light" :src="avatarLink"/>
        <div v-if="isEdit" class="font-weight-bold">
          {{ obligationData.login }}
        </div>
        <div v-else class="font-weight-bold">
          {{ obligationData.idUser.login }}
        </div>
      </div>
      <div class="col-3">
        <div v-if="isEdit">
          <PriceInput v-if="editAmount" v-model="obligationData.amount"
                      :validate-status-prop="obligationData.validateAmountState"/>
          <div v-else>{{ obligationData.amount }}</div>
        </div>
        <div v-else>
          {{ obligationData.amount }}
        </div>
      </div>
      <div class="col-3">
        <div v-if="isEdit">
          <PriceInput v-model="obligationData.paidIn"
                      :validate-status-prop="obligationData.validatePaidState"/>
        </div>
        <div v-else>
          {{ obligationData.paidIn }}
        </div>
      </div>
      <div v-if="isEdit" @click="$emit('remove',obligationData.userId)">
        <b-icon-x class="text-white"
                  font-scale="2">
        </b-icon-x>
      </div>
  </div>
</template>

<script>
import PriceInput from '@/components/PriceInput.vue';

export default {
  name: 'DiscardObligationItem',
  props: {
    obligationData: {
      type: Object,
      required: true,
    },
    isEdit: {
      type: Boolean,
    },
    editAmount: {
      type: Boolean,
    },
  },
  components: {
    PriceInput,
  },
  data() {
    return {
      avatarLink: '',
    };
  },
  mounted() {
    if (this.obligationData.idUser) {
      this.avatarLink = `${process.env.VUE_APP_API_BASE_URL}user/avatar/${this.obligationData.idUser.id}`;
    } else {
      this.avatarLink = `${process.env.VUE_APP_API_BASE_URL}user/avatar/${this.obligationData.userId}`;
    }
  },
};
</script>

<style scoped>

</style>
