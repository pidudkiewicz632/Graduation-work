<template>
  <b-container id="groupDiscardEditWrapper"
               class="shadow mx-auto col-11 col-lg-8 col-xl-5 p-0 p-3">
    <div class="col-11 col-sm-9 col-md-8 col-xl-7 mx-auto">
      <h2 class="greenText mt-4">Edycja Informacji</h2>
      <b-form-group label="Nazwa"
                    :invalid-feedback="validationMessages.name"
                    :state="validationRequiredStates.name">
        <b-input v-model="discardInfo.idDiscard.name"
                 :state="validationRequiredStates.name"
                 @input="validationName">
        </b-input>
      </b-form-group>
      <b-form-group label="Opis"
                    :invalid-feedback="validationMessages.description"
                    :state="validationDescriptionState"
                    description="Można też tu umieścić opis sposobu platności">
        <b-textarea v-model="discardInfo.idDiscard.description"
                    :state="validationDescriptionState"
                    @input="validationDescription"></b-textarea>
      </b-form-group>
      <b-form-group
        label="Wybierz datę płatności z listy">
        <b-select
          v-model="selectedDate"
          :options="dateOptions"
          @change="changeSelectDate"
          size="sm">
        </b-select>
      </b-form-group>
      <b-form-group class="mt-2"
                    label="lub podaj własną"
                    :invalid-feedback="validationMessages.date"
                    :state="validationRequiredStates.date">
        <b-form-datepicker class="text-left"
                           v-model="discardInfo.dateOfPayment"
                           placeholder="Termin płatności"
                           size="sm"
                           :state="validationRequiredStates.date"
                           :date-format-options="datePickerFormat"
                           @input="validationDate">
        </b-form-datepicker>
      </b-form-group>
      <b-radio-group class="mt-4 mx-auto"
                     v-model="discardType"
                     :options="typeOptions">
      </b-radio-group>
      <div v-if="discardType === 'cyclical'" class="mx-auto my-4">
        <b-form-group
          label="Odnawiaj co"
          :state="validationRequiredStates.interval"
          :invalid-feedback="validationMessages.interval">
          <b-form-select
            v-model="intervalValue"
            size="sm"
            :options="cyclicalIntervalOptions"
            :state="validationRequiredStates.interval"
            @change="validateInterval">
          </b-form-select>
        </b-form-group>
      </div>
      <b-button class="btnGreen my-4" @click="saveChanges">Zapisz</b-button>
    </div>
    <b-spinner style="position:fixed; top: 49%; left:49%;width:3rem;height:3rem"
               v-if="loading"></b-spinner>
  </b-container>
</template>

<script>
export default {
  name: 'GroupDiscardEdit',
  props: ['discardId'],
  data() {
    return {
      discardInfo: {
        idDiscard: {},
      },
      intervalValue: null,
      discardType: 'oneTime',
      dateOptions: [],
      selectedDate: '',
      validationRequiredStates: {
        date: null,
        name: null,
        interval: null,
      },
      startDate: '',
      validationDescriptionState: null,
      validationMessages: {
        date: '',
        description: '',
        name: '',
        interval: '',
      },
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
      datePickerFormat: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      },
    };
  },
  methods: {
    changeSelectDate() {
      this.discardInfo.dateOfPayment = this.selectedDate;
      this.validationDate();
    },
    validationName() {
      this.validationRequiredStates.name = true;
      this.validationMessages.name = '';

      if (!/^[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9\s]{3,40}$/.test(this.discardInfo.idDiscard.name)) {
        this.validationRequiredStates.name = false;

        // eslint-disable-next-line max-len
        if (this.discardInfo.idDiscard.name.length < 3 || this.discardInfo.idDiscard.name.length > 40) {
          this.validationMessages.name += 'Długość od 3 do 40 znaków. ';
        }

        if (!/^[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9\s]*$/.test(this.discardInfo.idDiscard.name)) {
          this.validationMessages.name += 'Dozwolone litery i cyfry oraz spację ';
        }
      }
    },
    validationDescription() {
      this.validationDescriptionState = true;
      this.validationMessages.description = '';

      if (!this.discardInfo.idDiscard.description) {
        this.validationDescriptionState = null;
      } else if (!/^[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9,.!?()\-\s]{1,150}$/.test(this.discardInfo.idDiscard.description)) {
        this.validationDescriptionState = false;

        if (this.discardInfo.idDiscard.description.length > 150) {
          this.validationMessages.description += 'Maksymalna długość to 150 znaków. ';
        }

        if (!/^[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9,.!?()\-\s]+$/.test(this.discardInfo.idDiscard.description)) {
          this.validationMessages.description += 'Dozwolone litery, cyfry oraz spację, enter oraz ( - , ( ) ! ? )';
        }
      }
    },
    validationDate() {
      this.validationRequiredStates.date = true;
      this.validationMessages.date = '';

      if (!this.discardInfo.dateOfPayment) {
        this.validationRequiredStates.date = false;
        this.validationMessages.date = 'To pole nie może by puste.';
      } else if (this.discardInfo.dateOfPayment < this.startDate) {
        this.validationRequiredStates.date = false;
        this.validationMessages.date = 'Data nie może byc mniejsza od daty edytowanej';
      } else {
        const currentDate = this.$dayjs(this.$dayjs().format('YYYY-MM-DD'));
        const dateOfPayment = this.$dayjs(this.discardInfo.dateOfPayment);
        const diffrence = Math.abs(dateOfPayment.diff(currentDate, 'days'));

        if (diffrence > 365) {
          this.validationRequiredStates.date = false;
          this.validationMessages.date = 'Nie może być większy niż rok.';
        }
      }
    },
    validateInterval() {
      this.validationRequiredStates.interval = true;
      this.validationMessages.interval = '';

      if (this.discardType === 'cyclical' && !this.intervalValue) {
        this.validationRequiredStates.interval = false;
        this.validationMessages.interval = 'Wybierz jedną z opcji.';
      } else {
        this.validationRequiredStates.interval = null;
      }
    },
    saveChanges() {
      this.validationDescription();
      this.validationDate();
      this.validationName();
      this.validateInterval();

      const isCorrect = Object.values(this.validationRequiredStates)
        .find((element) => element === false);

      if (isCorrect === undefined) {
        const dataToSend = new FormData();

        const isCyclic = this.discardType === 'cyclical';

        dataToSend.append('name', this.discardInfo.idDiscard.name);
        dataToSend.append('dateOfPayment', this.discardInfo.dateOfPayment);
        dataToSend.append('isCyclic', isCyclic);
        dataToSend.append('discardId', this.discardInfo.idDiscard.id);
        dataToSend.append('discardCycleId', this.discardId);

        if (isCyclic) {
          dataToSend.append('cyclicalInterval', this.intervalValue);
        }

        if (this.discardInfo.idDiscard.description) {
          dataToSend.append('description', this.discardInfo.idDiscard.description);
        }

        this.loading = true;

        this.axios.post('/discard/group/discard/info/edit/', dataToSend)
          .then(() => {
            this.showMessage('Zrzutka została zaktualizowana', 'Edycja zrzutki', `/discard/details/0/${this.discardId}`);
            this.loading = false;
          }).catch((err) => {
            this.fetchErr(err);
            this.loading = false;
          });
      }
    },
  },
  created() {
    this.loading = true;

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

    this.axios.get(`/discard/group/discard/info/edit/${this.discardId}`)
      .then((res) => {
        if (res.data.data) {
          this.discardInfo = res.data.data;
          this.discardInfo.dateOfPayment = this.$dayjs(this.discardInfo.dateOfPayment).format('YYYY-MM-DD');
          this.startDate = this.$dayjs(this.discardInfo.dateOfPayment).format('YYYY-MM-DD');
          this.discardType = this.discardInfo.idDiscard.isCyclic ? 'cyclical' : 'oneTime';
          this.intervalValue = this.discardType === 'cyclical' ? this.discardInfo.idDiscard.cyclicalInterval : null;
        } else {
          this.infoDataModal.title = 'Edycja Informacji';
          // eslint-disable-next-line prefer-destructuring
          this.infoDataModal.info = 'Coś poszło nie tak';
          this.infoDataModal.buttonText = 'Do listy grup';
          this.location = '/groups';
          this.$bvModal.show('modalInfo');
        }
        this.loading = false;
      })
      // eslint-disable-next-line consistent-return
      .catch((err) => {
        if (err.response.status === 405) {
          return this.$router.push('groups');
        }
        this.fetchErr(err);
        this.loading = false;
      });
  },
};
</script>

<style lang="scss" scoped>
#groupDiscardEditWrapper {
  color: white;
  background-color: #1C1919;
}
</style>
