<template>
  <b-container id="groupDiscardEditObligationWrapper"
               class="shadow mx-auto col-11 col-lg-8 col-xl-5 p-0 p-3">
    <h2 class="my-3">Edycja Należności</h2>
    <h3 class="my-3">{{ name }}</h3>
    <b-form-group class="col-10 col-sm-7 col-md-5 col-xl-4 mx-auto">
      <b-form-select v-model="spreadType"
                     :options="typesOfSpread"
                     @change="calculateAmountInput"
                     size="sm">
      </b-form-select>
    </b-form-group>
    <b-form-group class="col-10 col-sm-7 col-md-5 col-xl-4 mx-auto"
                  v-if="spreadType !== 'manual'"
                  label="Kwota">
      <PriceInput v-model="amountInput"
                  :validate-status-prop="validationState"
                  key="specifiedInput"
                  @input="calculateAmount"/>
    </b-form-group>
    <div class="col-12 mx-auto">
      <div class="row justify-content-between align-items-center py-2 my-2">
      <div class="col-4">
      </div>
      <div class="col-3 editDiscardColumnNames">
        Należność
      </div>
      <div class="col-3 editDiscardColumnNames">
        Wpłata
      </div>
        <div>
          <b-icon-x class="invisible"
                    font-scale="2">
          </b-icon-x>
        </div>
      </div>
      <DiscardObligationItem v-for="item in obligations" :key="item.userId"
                             :obligation-data="item"
                             :is-edit="true"
                             :edit-amount="manualEditAmount"
                             @remove="removeMember"/>
    </div>
    <p>
      Suma:
      <b-badge class="greenBadge">
        {{ amountInfo }}
      </b-badge>
    </p>
    <div>
      <div v-if="notObligatedUsers.length"
           class="mx-auto col-11 col-xs-7 col-md-8 col-lg-7 col-xl-6">
        <b-form-select class="my-3"
                       v-model="membersToAdd" :options="notObligatedUsers"
                       text-field="login"
                       value-field="id"
                       multiple :select-size="4">
        </b-form-select>
          <b-button class="btnGreen" @click="addMembers">
            Dodaj
          </b-button>
      </div>
    </div>
    <b-form-invalid-feedback class="my-3" :state="validationState">
      {{validationMessage}}
    </b-form-invalid-feedback>
    <b-button class="btnGreen my-3" @click="saveChanges">
      Zapisz
    </b-button>
    <b-button class="btnGreen ml-1" @click="loadData">
      Wyczyść Pola
    </b-button>
    <b-spinner style="position:fixed; top: 49%; left:49%;width:3rem;height:3rem"
               v-if="loading"></b-spinner>
  </b-container>
</template>

<script>
import DiscardObligationItem from '@/components/DiscardObligationItem.vue';
import PriceInput from '@/components/PriceInput.vue';

export default {
  name: 'GroupDiscardEditObligation',
  props: ['discardId'],
  components: {
    DiscardObligationItem,
    PriceInput,
  },
  data() {
    return {
      obligations: [],
      obligationsToRemove: [],
      members: [],
      membersToAdd: [],
      name: '',
      amountInput: 0,
      spreadType: '',
      validationState: null,
      validationMessage: '',
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
    manualEditAmount() {
      return this.spreadType === 'manual';
    },
    amountInfo() {
      return this.obligations
        .reduce((sum, item) => sum + Number(item.amount), 0).toFixed(2);
    },
    notObligatedUsers() {
      const obligatedUsers = this.obligations.map((item) => item.userId);
      return this.members.filter((item) => !obligatedUsers.includes(item.id));
    },
  },
  methods: {
    calculateAmountInput() {
      switch (this.spreadType) {
        case 'spreading':
          this.amountInput = this.obligations
            // eslint-disable-next-line max-len
            .reduce((sum, item) => sum + Number(item.amount), 0);
          break;
        case 'specified':
          this.amountInput = this.obligations.length ? this.obligations[0].amount : 0;
          break;
        default:
      }
      this.amountInput = this.amountInput.toFixed(2);
    },
    calculateAmount() {
      switch (this.spreadType) {
        case 'spreading':
          // eslint-disable-next-line no-case-declarations
          const amount = (this.amountInput / this.obligations.length).toFixed(2);
          // eslint-disable-next-line no-param-reassign,no-return-assign
          this.obligations.forEach((item) => item.amount = amount);
          break;
        case 'specified':
          // eslint-disable-next-line no-param-reassign,no-return-assign
          this.obligations.forEach((item) => item.amount = this.amountInput);
          break;
        default:
      }
    },
    addMembers() {
      this.membersToAdd.forEach((item) => {
        const isInRemoved = this.obligationsToRemove
          .findIndex((element) => element.userId === item);

        if (isInRemoved !== -1) {
          this.obligations.push(this.obligationsToRemove[isInRemoved]);
          this.obligationsToRemove.splice(isInRemoved, 1);
        } else {
          const { login } = this.members.find((element) => item === element.id);
          this.obligations.push({
            userId: item,
            obligationId: null,
            amount: 0,
            login,
            paidIn: 0,
            validateAmountState: null,
            validatePaidState: null,
          });
        }
      });
      this.calculateAmount();
    },
    removeMember(id) {
      const elementIndex = this.obligations.findIndex((item) => item.userId === id);
      if (this.obligations[elementIndex].obligationId) {
        this.obligationsToRemove.push(this.obligations[elementIndex]);
      }
      this.obligations.splice(elementIndex, 1);
      this.calculateAmount();
    },
    saveChanges() {
      this.calculateAmount();
      this.validate();

      if (this.validationState) {
        const discardData = new FormData();
        const removedObligations = this.obligationsToRemove.map((item) => item.obligationId);
        const modifiedObligations = this.obligations.map((item) => ({
          obligationId: item.obligationId,
          userId: item.userId,
          amount: item.amount,
          paidIn: item.paidIn,
        }));

        discardData.append('removedObligations', JSON.stringify(removedObligations));
        discardData.append('discardCycleId', this.discardId);
        discardData.append('newAndModifiedObligations', JSON.stringify(modifiedObligations));
        discardData.append('spreadType', this.spreadType);

        this.loading = true;
        this.axios({
          method: 'post',
          url: '/discard/obligations/edit/',
          data: discardData,
          headers: { 'Content-Type': 'multipart/form-data' },
        }).then(() => {
          this.$store.dispatch('getDiscardDetails', this.discardId);
          this.showMessage('Należności zostały zaakutualizowane', 'Edycja Należności', `/discard/details/1/${this.discardId}`);
          this.loading = false;
        }).catch((err) => {
          this.fetchErr(err);
          this.loading = false;
        });
      }
    },
    validate() {
      this.validationMessage = '';
      this.validationState = true;

      this.obligations.forEach((element) => {
        // eslint-disable-next-line no-param-reassign
        element.validateAmountState = true;
        // eslint-disable-next-line no-param-reassign
        element.validatePaidState = true;
      });

      // eslint-disable-next-line max-len
      const invalidAmounts = this.obligations.filter((element) => element.amount < 1 || element.paidIn < 0);

      if (invalidAmounts.length) {
        // eslint-disable-next-line no-param-reassign,no-return-assign
        invalidAmounts.forEach((element) => {
          if (element.amount < 1) {
            // eslint-disable-next-line no-param-reassign
            element.validateAmountState = false;
          } else {
            // eslint-disable-next-line no-param-reassign
            element.validatePaidState = false;
          }
        });
        this.validationMessage += 'Wpłata >= 0; Należność >=1';
        this.validationState = false;
      }

      if (!this.obligations.length) {
        this.validationMessage += 'Lista nie może być pusta.';
        this.validationState = false;
      }
    },
    loadData() {
      this.loading = true;

      this.axios.get(`/discard/obligations/edit/${this.discardId}`)
        .then((res) => {
          if (res.data.data) {
            this.obligations = res.data.data.discard.obligations;
            this.obligations = this.obligations.map((item) => ({
              obligationId: item.id,
              userId: item.idUser.id,
              amount: item.amount,
              login: item.idUser.login,
              paidIn: item.paidIn,
              validateAmountState: null,
              validatePaidState: null,
            }));

            this.obligationsBeforeEdit = this.obligations;

            this.name = res.data.data.discard.idDiscard.name;
            this.spreadType = res.data.data.discard.typeOfSpread;
            this.members = res.data.data.members;
            this.calculateAmountInput();
          } else {
            this.showMessage(res.data.data.message, 'Edycja Należności', '/groups');
          }
          this.loading = false;
        })
        // eslint-disable-next-line consistent-return
        .catch((err) => {
          this.loading = false;
          if (err.response.status === 405) {
            return this.$router.push('groups');
          }
          this.fetchErr(err);
        });
    },
  },
  created() {
    this.loadData();
  },
};
</script>

<style lang="scss" scoped>
#groupDiscardEditObligationWrapper {
  color: white;
  background-color: #1C1919;

  .editDiscardColumnNames{
    font-size: smaller;
  }
}
</style>
