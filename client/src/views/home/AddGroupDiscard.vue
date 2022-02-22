<template>
  <b-container id="addGroupDiscardWrapper"
               class="shadow mx-auto mb-3 col-11 col-sm-8  col-md-7 col-lg-5 col-xl-4 p-3">
    <h2>Tworzenie zrzutki</h2>
    <StepOneInfo v-if="step === 0"
                 @nextStep="nextStep"
                 @prevStep="prevStep">
    </StepOneInfo>
    <StepTwoType v-if="step === 1"
                 @nextStep="nextStep"
                 @prevStep="prevStep">
    </StepTwoType>
    <StepThreeAddMembers v-if="step === 2"
                         :members="groupMembers"
                         @nextStep="nextStep"
                         @prevStep="prevStep">
    </StepThreeAddMembers>
    <StepFourSpreadingAmount v-if="step === 3"
                             @end="addDiscard"
                             @prevStep="prevStep">
    </StepFourSpreadingAmount>
    <b-spinner style="position:fixed; top: 49%; left:49%;width:3rem;height:3rem"
               v-if="loading"></b-spinner>
  </b-container>
</template>

<script>
import StepOneInfo from '@/components/groupDiscard/StepOneInfo.vue';
import StepTwoType from '@/components/groupDiscard/StepTwoType.vue';
import StepThreeAddMembers from '@/components/groupDiscard/StepThreeAddMembers.vue';
import StepFourSpreadingAmount from '@/components/groupDiscard/StepFourSpreadingAmount.vue';

export default {
  name: 'AddGroupDiscard',
  props: ['groupId'],
  components: {
    StepOneInfo,
    StepTwoType,
    StepThreeAddMembers,
    StepFourSpreadingAmount,
  },
  data() {
    return {
      step: 0,
      groupMembers: [],
    };
  },
  methods: {
    nextStep() {
      if (this.step < 3) {
        this.step += 1;
      }
    },
    prevStep() {
      if (this.step > 0) {
        this.step -= 1;
      }
    },
    addDiscard() {
      const dataToSend = new FormData();

      this.loading = true;
      dataToSend.append('name', this.$store.getters.addDiscardName);
      dataToSend.append('date', this.$store.getters.addDiscardDateOfPayment);
      dataToSend.append('isCyclic', this.$store.getters.addDiscardType === 'cyclical');
      dataToSend.append('groupId', this.groupId);
      dataToSend.append('spreadType', this.$store.getters.addDiscardSpreadType);
      dataToSend.append('members', JSON.stringify(this.$store.getters.addDiscardMembers));

      if (this.$store.getters.addDiscardType === 'cyclical') {
        dataToSend.append('cyclicalInterval', this.$store.getters.addDiscardCyclicalInterval);
      }

      if (this.$store.getters.addDiscardDescription) {
        dataToSend.append('description', this.$store.getters.addDiscardDescription);
      }

      this.axios.post('/discard/group/add', dataToSend)
        .then(() => {
          this.showMessage('Zrzutka została dodana', 'Tworzenie zrzutki', `/group/details/${this.groupId}`);
          this.loading = false;
        }).catch((err) => {
          this.fetchErr(err);
          this.loading = false;
        });
    },
  },
  created() {
    this.userId = this.$store.getters.userId;

    this.loading = true;

    this.axios.get(`/discard/group/add/${this.groupId}`)
      .then((res) => {
        if (res.data.members) {
          this.groupMembers = res.data.members;
        } else {
          this.showMessage('Coś poszło nie tak', 'Tworzenie zrzutki', '/groups');
        }
        this.loading = false;
      })
      // eslint-disable-next-line consistent-return
      .catch((err) => {
        if (err.response.status === 405) {
          return this.$router.push('/groups');
        }
        this.fetchErr(err);
        this.loading = false;
      });
  },
};
</script>

<style lang="scss" scoped>
#addGroupDiscardWrapper{
  background-color: #1C1919;
  h2{
    color:#148a14;
  }
}
</style>
