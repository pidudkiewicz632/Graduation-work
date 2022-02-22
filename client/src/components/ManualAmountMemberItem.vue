<template>
  <b-badge class="greenBadge mt-2 col-12">
    <b-row class="align-items-center">
      <b-col>
        <div class="d-flex justify-content-start align-items-center">
          <b-avatar class="mr-2 bv-d-md-down-none" variant="light" :src="avatarLink"/>
          <div class="font-weight-bold">
            {{memberAmountElement.login}}
          </div>
        </div>
      </b-col>
      <b-col>
          <PriceInput @input="$emit('input', $event)"
                      :key="memberAmountElement.id"
                      :validate-status-prop="memberAmountElement.status"/>
      </b-col>
    </b-row>
  </b-badge>
</template>

<script>
import PriceInput from '@/components/PriceInput.vue';

export default {
  name: 'ManualAmountMemberItem',
  components: {
    PriceInput,
  },
  props: {
    memberAmountElement: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      avatarLink: '',
      validationAmountState: null,
    };
  },
  mounted() {
    this.avatarLink = `${process.env.VUE_APP_API_BASE_URL}user/avatar/${this.memberAmountElement.id}`;
  },
};
</script>

<style lang="scss" scoped>
select{
  font-size: 0.8rem;
}
</style>
