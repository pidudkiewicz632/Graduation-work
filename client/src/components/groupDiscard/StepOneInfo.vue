<template>
  <div class="stepOneInfoWrapper text-white">
    <h4 class="mt-3">Informacje</h4>
    <div class="mx-auto col-12 col-md-8 col-lg-6">
      <b-form-group
        :invalid-feedback="validationMessages.name"
        :state="validationRequiredStates.name"
        label="Nazwa*">
        <b-form-input class="my-2"
                      v-model="addDiscardName"
                      :state="validationRequiredStates.name"
                      @input="validationName"
                      placeholder="Nazwa"
                      size="sm">
        </b-form-input>
      </b-form-group>
      <b-form-group
        label="Wybierz datę płatności z listy*">
        <b-select
          v-model="addDiscardDateOfPayment"
          :options="dateOptions"
          size="sm"
          @input="validationDate">
        </b-select>
      </b-form-group>
      <b-form-group class="mt-2"
                    label="lub podaj własną"
                    :invalid-feedback="validationMessages.date"
                    :state="validationRequiredStates.date">
        <b-form-datepicker class="text-left"
                           v-model="addDiscardDateOfPayment"
                           placeholder="Termin płatności"
                           :state="validationRequiredStates.date"
                           :date-format-options="datePickerFormat"
                           @input="validationDate"
                           size="sm"
        >
        </b-form-datepicker>
      </b-form-group>
      <b-form-group
        :invalid-feedback="validationMessages.description"
        :state="validationDescriptionState"
        label="Opis"
        description="Można też tu umieścić opis sposobu platności">
        <b-form-textarea class="my-2"
                         v-model="addDiscardDescription"
                         :state="validationDescriptionState"
                         @input="validationDescription"
                         placeholder="Opis">
        </b-form-textarea>
      </b-form-group>
      <b-form-text class="my-2">Pola oznaczone * są obowiązkowe</b-form-text>
      <b-button class="btnGreen" @click="nextStep">Dalej</b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StepOneInfo',
  data() {
    return {
      dateOptions: [],
      validationRequiredStates: {
        date: null,
        name: null,
      },
      validationDescriptionState: null,
      validationMessages: {
        date: '',
        description: '',
        name: '',
      },
      datePickerFormat: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      },
    };
  },
  computed: {
    addDiscardName: {
      get() {
        return this.$store.getters.addDiscardName ? this.$store.getters.addDiscardName : '';
      },
      set(value) {
        this.$store.commit('addDiscardName', value);
      },
    },
    addDiscardDateOfPayment: {
      get() {
        return this.$store.getters.addDiscardDateOfPayment ? this.$store.getters.addDiscardDateOfPayment : '';
      },
      set(value) {
        this.$store.commit('addDiscardDateOfPayment', value);
      },
    },
    addDiscardDescription: {
      get() {
        return this.$store.getters.addDiscardDescription ? this.$store.getters.addDiscardDescription : '';
      },
      set(value) {
        this.$store.commit('addDiscardDescription', value);
      },
    },
  },
  methods: {
    validationName() {
      this.validationRequiredStates.name = true;
      this.validationMessages.name = '';

      if (!/^[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9\s]{3,40}$/.test(this.addDiscardName)) {
        this.validationRequiredStates.name = false;

        if (this.addDiscardName.length < 3 || this.addDiscardName.length > 40) {
          this.validationMessages.name += 'Długość od 3 do 40 znaków. ';
        }

        if (!/^[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9\s]*$/.test(this.addDiscardName)) {
          this.validationMessages.name += 'Dozwolone litery i cyfry oraz spację ';
        }
      }
    },
    validationDescription() {
      this.validationDescriptionState = true;
      this.validationMessages.description = '';

      if (!this.addDiscardDescription) {
        this.validationDescriptionState = null;
      } else if (!/^[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9,.!?()\-\s]{1,150}$/.test(this.addDiscardDescription)) {
        this.validationDescriptionState = false;

        if (this.addDiscardDescription.length > 150) {
          this.validationMessages.description += 'Maksymalna długość to 150 znaków. ';
        }

        if (!/^[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9,.!?()\-\s]+$/.test(this.addDiscardDescription)) {
          this.validationMessages.description += 'Dozwolone litery, cyfry oraz spację, enter oraz ( - , ( ) ! ? )';
        }
      }
    },
    validationDate() {
      this.validationRequiredStates.date = true;
      this.validationMessages.date = '';

      if (!this.addDiscardDateOfPayment) {
        this.validationRequiredStates.date = false;
        this.validationMessages.date = 'To pole nie może by puste.';
      } else {
        const currentDate = this.$dayjs(this.$dayjs().format('YYYY-MM-DD'));
        const dateOfPayment = this.$dayjs(this.addDiscardDateOfPayment);
        const diffrence = Math.abs(dateOfPayment.diff(currentDate, 'days'));

        if (currentDate > dateOfPayment) {
          this.validationRequiredStates.date = false;
          this.validationMessages.date = 'Nie może być mniejszy od aktualnej daty.';
        } else if (diffrence > 365) {
          this.validationRequiredStates.date = false;
          this.validationMessages.date = 'Nie może być większy niż rok.';
        }
      }
    },
    validationAll() {
      this.validationDescription();
      this.validationDate();
      this.validationName();
    },
    nextStep() {
      this.validationAll();

      const isValid = Object.values(this.validationRequiredStates)
        .find((element) => element === false);

      if (isValid === undefined) {
        this.$emit('nextStep');
      }
    },
  },
  created() {
    const today = this.$dayjs();
    this.dateOptions = [
      {
        text: 'Wybierz',
        value: '',
      },
      {
        text: 'Za tydzień',
        value: today.add(1, 'week').format('YYYY-MM-DD'),
      },
      {
        text: 'Za dwa tygodnie',
        value: today.add(2, 'week').format('YYYY-MM-DD'),
      },
      {
        text: 'Za miesiąc',
        value: today.add(1, 'month').format('YYYY-MM-DD'),
      },
      {
        text: 'Za dwa miesiące',
        value: today.add(2, 'month').format('YYYY-MM-DD'),
      },
      {
        text: 'Za pół roku',
        value: today.add(6, 'month').format('YYYY-MM-DD'),
      },
      {
        text: 'Za rok',
        value: today.add(1, 'year').format('YYYY-MM-DD'),
      },
    ];
  },
};
</script>

<style lang="scss" scoped>

</style>
