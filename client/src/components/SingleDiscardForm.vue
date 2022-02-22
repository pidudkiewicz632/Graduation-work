<template>
  <div class="col-11 col-sm-9 col-md-8 col-xl-7 mx-auto">
    <h2 class="greenText">{{ title }}</h2>
    <b-form-group label="Nazwa*"
                  :state="validationRequiredStates.name"
                  :invalid-feedback="validationMessages.name">
      <b-input v-model="discardName"
               size="sm"
               :state="validationRequiredStates.name"
               @input="validationName">
      </b-input>
    </b-form-group>
    <b-form-group label="Opis"
                  description="Można też tu umieścić opis sposobu platności"
                  :invalid-feedback="validationMessages.description"
                  :state="validationDescriptionState">
      <b-textarea v-model="discardDescription"
                  :state="validationDescriptionState"
                  @input="validationDescription"
                  size="sm"></b-textarea>
    </b-form-group>
    <b-form-group
      label="Wybierz datę płatności z listy*">
      <b-select
        v-model="dateOfPayment"
        :options="dateOptions"
        @change="validationDate"
        size="sm">
      </b-select>
    </b-form-group>
    <b-form-group class="mt-2"
                  label="lub podaj własną"
                  :invalid-feedback="validationMessages.date"
                  :state="validationRequiredStates.date">
      <b-form-datepicker class="text-left"
                         v-model="dateOfPayment"
                         placeholder="Termin płatności"
                         :date-format-options="datePickerFormat"
                         :state="validationRequiredStates.date"
                         @input="validationDate"
                         size="sm">
      </b-form-datepicker>
    </b-form-group>
    <b-form-group label="Typ*">
      <b-radio-group class="mx-auto"
                     v-model="discardType"
                     :options="typeOptions">
      </b-radio-group>
    </b-form-group>
    <div v-if="discardType === 'cyclical'" class="mx-auto mt-4">
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
    <div v-if="isEdit !== true">
      <b-form-group label="Jestem*">
        <b-radio-group class="mx-auto"
                       v-model="userIs"
                       :options="userIsOptions">
        </b-radio-group>
      </b-form-group>
      <b-form-group class="mt-4"
                    :state="validationRequiredStates.user"
                    :invalid-feedback="validationMessages.user"
                    :label="userLabel">
        <b-input v-model="userName"
                 size="sm"
                 list="users"
                 :state="validationRequiredStates.user"
                 @change="validateUser">
        </b-input>
        <datalist id="users" v-if="userName.length>2">
          <option v-for="user in users" :key="user.id">{{user.login}}</option>
        </datalist>
      </b-form-group>
    </div>
    <b-form-group class="mx-auto"
                  label="Kwota*"
                  :invalid-feedback="validationMessages.amount"
                  :state="validationRequiredStates.amount">
      <PriceInput v-model="discardAmount"
                  class="mx-auto"
                  :validate-status-prop="validationRequiredStates.amount"
                  key="specifiedInput"
                  @input="validationAmount"/>
    </b-form-group>
    <b-form-group class="mx-auto"
                  v-if="isEdit === true"
                  label="Wpłacono"
                  :invalid-feedback="validationMessages.paidIn"
                  :state="validationRequiredStates.paidIn">
      <PriceInput v-model="paidIn"
                  class="mx-auto"
                  :validate-status-prop="validationRequiredStates.paidIn"
                  key="specifiedInput"
                  @input="validatePaidIn"/>
    </b-form-group>
    <b-form-text>Pola oznaczone * są wymagane</b-form-text>
    <b-button class="mt-3 mx-auto shadow font-weight-bold btnGreen" @click="createDiscard">
      {{ buttonText }}
    </b-button>
    <b-spinner style="position:fixed; top: 49%; left:49%;width:3rem;height:3rem"
               v-if="loading"></b-spinner>
  </div>
</template>

<script>
import PriceInput from '@/components/PriceInput.vue';

export default {
  name: 'SingleDiscardForm',
  props: {
    discardId: {
      type: String,
    },
    isEdit: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    PriceInput,
  },
  data() {
    return {
      users: [],
      dateOptions: [],
      title: '',
      buttonText: '',
      dateOfPayment: '',
      discardInfo: {},
      payment: {},
      discardType: 'oneTime',
      intervalValue: null,
      discardAmount: 0,
      datePickerFormat: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      },
      discardName: '',
      paidIn: 0,
      discardDescription: '',
      userIs: 'recipient',
      userName: '',
      userId: '',
      validationDescriptionState: null,
      validationRequiredStates: {
        date: null,
        name: null,
        interval: null,
        user: null,
        amount: null,
        paidIn: null,
      },
      startDate: '',
      validationMessages: {
        date: '',
        description: '',
        name: '',
        interval: '',
        user: '',
        amount: '',
        paidIn: '',
      },
      userIsOptions: [
        {
          value: 'recipient',
          text: 'Odbiorcą',
        },
        {
          value: 'debtor',
          text: 'Spłacającym',
        },
      ],
      typeOptions: [
        {
          value: 'oneTime',
          text: 'Jednorazowa',
        },
        {
          value: 'cyclical',
          text: 'Cykliczna',
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
    userLabel() {
      return this.userIs === 'recipient' ? 'Spłacający' : 'Odbiorca';
    },
  },
  methods: {
    async createDiscard() {
      if (this.isEdit) {
        this.validationName();
        this.validationDescription();
        this.validationDate();
        this.validateInterval();
        this.validationAmount();
        this.validatePaidIn();

        const isCorrect = Object.values(this.validationRequiredStates)
          .find((element) => element === false);

        if (isCorrect === undefined) {
          const dataToSend = new FormData();

          dataToSend.append('name', this.discardName);
          dataToSend.append('isCyclic', this.discardType === 'cyclical');
          dataToSend.append('date', this.dateOfPayment);
          dataToSend.append('amount', this.discardAmount);
          dataToSend.append('discardCycleId', this.discardId);
          dataToSend.append('paidIn', this.paidIn);

          if (this.discardType === 'cyclical') {
            dataToSend.append('cyclicalInterval', this.intervalValue);
          }

          if (this.validationDescriptionState) {
            dataToSend.append('description', this.discardDescription);
          }

          this.axios.post('/discard/single/edit', dataToSend)
            .then(() => {
              this.showMessage('Zrzutka została zmieniona',
                'Tworzenie zrzutki', `/discard/single/details/${this.discardId}`);
            })
            .catch((err) => {
              this.fetchErr(err);
            });
        }
      } else {
        await this.validateUser();
        this.validationName();
        this.validationDescription();
        this.validationDate();
        this.validateInterval();
        this.validationAmount();

        const isCorrect = Object.values(this.validationRequiredStates)
          .find((element) => element === false);

        if (isCorrect === undefined) {
          const dataToSend = new FormData();

          dataToSend.append('name', this.discardName);
          dataToSend.append('isCyclic', this.discardType === 'cyclical');
          dataToSend.append('date', this.dateOfPayment);
          dataToSend.append('amount', this.discardAmount);

          if (this.discardType === 'cyclical') {
            dataToSend.append('cyclicalInterval', this.intervalValue);
          }

          if (this.validationDescriptionState) {
            dataToSend.append('description', this.discardDescription);
          }

          if (this.userIs === 'recipient') {
            dataToSend.append('recipientId', this.$store.getters.userId);
            dataToSend.append('debtorId', this.userId);
          } else {
            dataToSend.append('recipientId', this.userId);
            dataToSend.append('debtorId', this.$store.getters.userId);
          }

          this.loading = true;
          this.axios.post('/discard/single/add', dataToSend)
            .then((res) => {
              this.showMessage('Zrzutka została dodana',
                'Tworzenie zrzutki', `/discard/single/details/${res.data.data.discardId}`);
              this.$bvModal.show('modalInfo');
              this.loading = false;
            })
            .catch((err) => {
              this.fetchErr(err);
              this.loading = false;
            });
        }
      }
    },
    validationAmount() {
      this.validationRequiredStates.amount = true;
      this.validationMessages.amount = '';

      if (this.discardAmount < 1) {
        this.validationRequiredStates.amount = false;
        this.validationMessages.amount = 'Nie może być mniejsza od 1';
      }
    },
    validationName() {
      this.validationRequiredStates.name = true;
      this.validationMessages.name = '';

      if (!/^[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9\s]{3,40}$/.test(this.discardName)) {
        this.validationRequiredStates.name = false;

        if (this.discardName.length < 3 || this.discardName.length > 40) {
          this.validationMessages.name += 'Długość od 3 do 40 znaków. ';
        }

        if (!/^[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9\s]*$/.test(this.discardName)) {
          this.validationMessages.name += 'Dozwolone litery i cyfry oraz spację ';
        }
      }
    },
    validationDescription() {
      this.validationDescriptionState = true;
      this.validationMessages.description = '';

      if (!this.discardDescription) {
        this.validationDescriptionState = null;
      } else if (!/^[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9,.!?()\-\s]{1,150}$/.test(this.discardDescription)) {
        this.validationDescriptionState = false;

        if (this.discardDescription.length > 150) {
          this.validationMessages.description += 'Maksymalna długość to 150 znaków. ';
        }

        if (!/^[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9,.!?()\-\s]+$/.test(this.discardDescription)) {
          this.validationMessages.description += 'Dozwolone litery, cyfry oraz spację, enter oraz ( - , ( ) ! ? )';
        }
      }
    },
    validationDate() {
      this.validationRequiredStates.date = true;
      this.validationMessages.date = '';
      if (!this.dateOfPayment) {
        this.validationRequiredStates.date = false;
        this.validationMessages.date = 'To pole nie może by puste.';
      } else {
        const currentDate = this.$dayjs(this.$dayjs().format('YYYY-MM-DD'));
        const dateOfPayment = this.$dayjs(this.dateOfPayment);
        const diffrence = Math.abs(dateOfPayment.diff(currentDate, 'days'));

        if (currentDate > dateOfPayment && this.isEdit === false) {
          this.validationRequiredStates.date = false;
          this.validationMessages.date = 'Nie może być mniejszy od aktualnej daty.';
        } else if (dateOfPayment.format('YYYY-MM-DD') < this.startDate && this.isEdit) {
          this.validationRequiredStates.date = false;
          this.validationMessages.date = 'Data nie może byc mniejsza od daty edytowanej';
        } else if (diffrence > 365) {
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
    validatePaidIn() {
      this.validationRequiredStates.paidIn = true;
      this.validationMessages.paidIn = '';

      if (this.paidIn < 0) {
        this.validationRequiredStates.paidInl = false;
        this.validationMessages.paidIn = 'Nie może być mniejsze od zera.';
      } else {
        this.validationRequiredStates.paid = null;
      }
    },
    async validateUser() {
      this.validationRequiredStates.user = true;
      this.validationMessages.user = '';

      if (this.userName === this.$store.getters.login) {
        this.validationRequiredStates.user = false;
        this.validationMessages.user = 'Nie możesz dodać samego siebie.';
      } else {
        this.loading = true;
        await this.axios.get(`/user/checkLogin?login=${this.userName}`).then((res) => {
          if (res.data.message === true) {
            if (res.data.data.status === 'active') {
              this.validationRequiredStates.user = true;
              this.userId = res.data.data.id;
            } else {
              this.validationRequiredStates.user = false;
              this.validationMessages.user += 'Nie ma takiego użytkownika.';
            }
          } else {
            this.validationRequiredStates.user = false;
            this.validationMessages.user += 'Nie ma takiego użytkownika.';
          }
          this.loading = false;
        });
      }
    },
  },
  created() {
    const today = this.$dayjs();
    this.title = this.isEdit ? 'Edycja zrzutki' : 'Tworzenie pojedyńczej zbiórki';
    this.buttonText = this.isEdit ? 'Zapisz' : 'Dodaj';

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

    if (this.isEdit) {
      this.axios.get(`/discard/single/edit/${this.discardId}`)
        // eslint-disable-next-line consistent-return
        .then((res) => {
          if (res.data.info) {
            this.discardInfo = res.data.info;
            this.discardInfo.dateOfPayment = this.$dayjs(this.discardInfo.dateOfPayment).format('YYYY-MM-DD');
            this.discardAmount = this.discardInfo.obligation.amount;
            this.discardName = this.discardInfo.idDiscard.name;
            this.discardDescription = this.discardInfo.idDiscard.description;
            this.dateOfPayment = this.discardInfo.dateOfPayment;
            this.discardType = this.discardInfo.idDiscard.isCyclic ? 'cyclical' : 'oneTime';
            this.paidIn = this.discardInfo.obligation.paidIn;
            this.startDate = this.$dayjs(this.discardInfo.dateOfPayment).format('YYYY-MM-DD');
            this.loading = false;
            // eslint-disable-next-line consistent-return
            return;
          }
          this.showMessage('Coś poszło nie tak', 'Szczegóły zrzutki', '/home');
          this.loading = false;
        })
        // eslint-disable-next-line consistent-return
        .catch((err) => {
          if (err.response.status === 405) {
            return this.$router.push('/home');
          }
          this.loading = false;
          this.fetchErr(err);
        });
    } else {
      this.loading = true;
      this.axios.get('/user/list')
        .then((res) => {
          if (res.data) {
            this.users = res.data.data;
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
    }
  },
};
</script>

<style scoped>

</style>
