<template>
  <div class="stepFourSpreadingAmoun text-white">
    <h4 class="mt-3">Przydział składek</h4>
    <div class="col-12 col-md-10 col-lg-9 col-xl-8 mx-auto my-3">
      <b-form-group class="col-9 mx-auto">
        <b-form-select v-model="spreadType"
                       :options="typesOfSpread"
                       @change="clearData"
                       size="sm">
        </b-form-select>
      </b-form-group>
      <div v-if="spreadType === 'spreading'" class="mx-auto">
        <b-form-group
          class="col-9 mx-auto px-auto"
          label="Kwota"
          :invalid-feedback="validationMessage"
          :state="validationState">
          <PriceInput v-model="totalAmount"
                      class="col-12 mx-auto px-auto"
                      :validate-status-prop="validationState"
                      key="spreadingInput"
                      @input="calculateSingleAmount();validate()"/>
        </b-form-group>
        <p>
          Każdy użytkownik będzie musiał zapłacić
          <b-badge class="greenBadge">
            {{ amountInfo }}
          </b-badge>
        </p>
      </div>
      <div v-else-if="spreadType === 'specified'" class="mx-auto">
        <b-form-group class="col-9 mx-auto"
                      label="Kwota"
                      :invalid-feedback="validationMessage"
                      :state="validationState">
          <PriceInput v-model="singleAmount"
                      class="mx-auto"
                      :validate-status-prop="validationState"
                      key="specifiedInput"
                      @input="calculateTotalAmount();validate()"/>
        </b-form-group>
        <p>
          Suma:
          <b-badge class="greenBadge">
            {{ amountInfo }}
          </b-badge>
        </p>
      </div>
      <div v-else>
        <div class="d-inline-block col-12 justify-content-center">
          <ManualAmountMemberItem
            v-for="item in addDiscardMembers"
            v-model="item.amount"
            :key="item.id"
            :member-amount-element="item"/>
        </div>
        <b-form-invalid-feedback :state="validationState">
          {{validationMessage}}
        </b-form-invalid-feedback>
        <p>
          Suma:
          <b-badge class="greenBadge">
            {{ amountInfo }}
          </b-badge>
        </p>
      </div>
    </div>
    <b-button class="btnGreen" @click="nextStep">Zakończ</b-button>
    <b-button class="btnGreen ml-1" @click="$emit('prevStep')">Wstecz</b-button>
  </div>
</template>

<script>
import ManualAmountMemberItem from '@/components/ManualAmountMemberItem.vue';
import PriceInput from '@/components/PriceInput.vue';

export default {
  name: 'StepFourSpreadingAmount',
  components: {
    ManualAmountMemberItem,
    PriceInput,
  },
  data() {
    return {
      spreadType: 'spreading',
      amountInput: 0,
      totalAmount: 0,
      singleAmount: 0,
      validationMessage: '',
      validationState: null,
      typesOfSpread: [
        {
          value: 'spreading',
          text: 'Rozłożenie kwoty',
        },
        {
          value: 'specified',
          text: 'Określona składka',
        },
        {
          value: 'manual',
          text: 'Ręczne',
        },
      ],
    };
  },
  computed: {
    amountInfo() {
      switch (this.spreadType) {
        case 'spreading':
          return this.singleAmount;
        case 'specified':
          return this.totalAmount;
        default:
          this.calculateTotalAmountForManual();
          return this.totalAmount;
      }
    },
    addDiscardMembers: {
      get() {
        return this.$store.getters.addDiscardMembers;
      },
      set(value) {
        this.$store.commit('addDiscardMembers', value);
      },
    },
  },
  methods: {
    validate() {
      this.validationMessage = '';
      this.validationState = true;

      if (this.spreadType === 'manual') {
        // eslint-disable-next-line no-param-reassign,no-return-assign
        this.addDiscardMembers.forEach((element) => element.status = true);

        const invalidAmounts = this.addDiscardMembers.filter((element) => element.amount < 1);

        if (invalidAmounts.length) {
          // eslint-disable-next-line no-param-reassign,no-return-assign
          invalidAmounts.forEach((element) => element.status = false);
          this.validationMessage = 'Składka na jednego użytkownika nie może być mniejsza od 1';
          this.validationState = false;
        }
      } else if (this.singleAmount < 1) {
        this.validationMessage = 'Składka na jednego użytkownika nie może być mniejsza od 1';
        this.validationState = false;
      }
    },
    calculateTotalAmount() {
      this.totalAmount = (this.singleAmount * this.addDiscardMembers.length).toFixed(2);
    },
    calculateSingleAmount() {
      this.singleAmount = (this.totalAmount / this.addDiscardMembers.length).toFixed(2);
    },
    calculateTotalAmountForManual() {
      this.totalAmount = this.addDiscardMembers.reduce((sum, item) => sum + Number(item.amount), 0);
    },
    clearData() {
      this.addDiscardMembers.forEach((element) => {
        // eslint-disable-next-line no-param-reassign
        element.status = null;
        // eslint-disable-next-line no-param-reassign
        element.amount = '0';
      });
      this.totalAmount = '0';
      this.singleAmount = '0';
      this.validationState = null;
    },
    addAmountsToUsers() {
      if (this.spreadType === 'manual') {
        this.addDiscardMembers = this.addDiscardMembers
          .map((element) => ({
            id: element.id,
            amount: element.amount,
          }));
      } else {
        this.addDiscardMembers = this.addDiscardMembers
          .map((element) => ({
            id: element.id,
            amount: this.singleAmount,
          }));
      }
    },
    nextStep() {
      this.validate();

      if (this.validationState) {
        this.addAmountsToUsers();
        this.$emit('end');
      }
    },
  },
  created() {
    this.addDiscardMembers = this.addDiscardMembers.map((element) => ({
      id: element.id,
      login: element.login,
      amount: '0',
      status: null,
    }));
  },
};
</script>

<style scoped>

</style>
