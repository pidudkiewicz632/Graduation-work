<template>
  <div class="stepTwoTypeWrapper text-white d-inline-block">
    <h4 class="mt-3">Typ Zrzutki</h4>
    <b-radio-group class="text-justify my-4"
                   v-model="addDiscardType"
                   :options="typeOptions">
    </b-radio-group>
    <div v-if="addDiscardType === 'cyclical'" class="mx-auto">
      <b-form-group
        label="Odnawiaj co"
        :state="validationIntervalState"
        :invalid-feedback="validationIntervalMessage">
        <b-form-select v-model="addDiscardCyclicalInterval"
                       :options="cyclicalIntervalOptions"
                       :state="validationIntervalState"
                       @change="validateInterval"
                       size="sm">
        </b-form-select>
      </b-form-group>
    </div>
    <b-button class="btnGreen mr-1" @click="nextStep">Dalej</b-button>
    <b-button class="btnGreen ml-1" @click="$emit('prevStep')">Wstecz</b-button>
  </div>
</template>

<script>
export default {
  name: 'StepTwoType',
  data() {
    return {
      validationIntervalState: null,
      validationIntervalMessage: '',
      typeOptions: [
        {
          value: 'cyclical',
          text: 'Cykliczna',
        },
        {
          value: 'oneTime',
          text: 'Jednorazowa',
        },
      ],
      cyclicalIntervalOptions: [
        {
          value: null,
          text: 'Wybierz opcję',
        },
        {
          value: 'oneWeek',
          text: 'Tydzień',
        },
        {
          value: 'twoWeeks',
          text: 'Dwa tygodnie',
        },
        {
          value: 'oneMonth',
          text: 'Miesiąc',
        },
        {
          value: 'twoMonths',
          text: 'Dwa miesiące',
        },
        {
          value: 'halfYear',
          text: 'Pół roku',
        },
        {
          value: 'year',
          text: 'Rok',
        },
      ],
    };
  },
  computed: {
    addDiscardType: {
      get() {
        return this.$store.getters.addDiscardType ? this.$store.getters.addDiscardType : '';
      },
      set(value) {
        this.$store.commit('addDiscardType', value);
      },
    },
    addDiscardCyclicalInterval: {
      get() {
        return this.$store.getters.addDiscardCyclicalInterval;
      },
      set(value) {
        this.$store.commit('addDiscardCyclicalInterval', value);
      },
    },
  },
  methods: {
    validateInterval() {
      this.validationIntervalState = true;
      this.validationIntervalMessage = '';

      if (this.addDiscardType === 'cyclical' && !this.addDiscardCyclicalInterval) {
        this.validationIntervalState = false;
        this.validationIntervalMessage = 'Wybierz jedną z opcji.';
      } else {
        this.validationIntervalState = null;
      }
    },
    nextStep() {
      this.validateInterval();

      if (this.validationIntervalState !== false) {
        this.$emit('nextStep');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.stepTwoTypeWrapper{
  color: white;
}
</style>
