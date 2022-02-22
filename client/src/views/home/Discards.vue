<template>
  <b-container id="discardsWrapper"
               class="mx-auto col-12 col-md-10 col-lg-9 col-xl-8 text-white">
    <h2 class="my-5">Zrzutki</h2>
    <b-form-input class="col-xl-3 col-lg-4 col-md-5 col-10 mx-auto pb-0 my-4"
                  v-model="discardNameSearch"
                  type="search"
                  size="sm"
                  placeholder="Nazwa">
    </b-form-input>
    <transition-group :class="{fewElements: numberOfItems <= itemsPerPage}"
      name="list" class="row justify-content-center discardsList mx-auto
  col-12 col-xl-10">
      <DiscardListItem v-for="item of selectedItems" :key="item.id" :discard-data="item"
                       :all-discards="true"/>
    </transition-group>
    <p v-if="selectedItems.length === 0 && !loading" class="mt-5"> Brak Zrzutek</p>
    <b-pagination v-model="currentPage"
                  v-if="numberOfItems > itemsPerPage"
                  class="pagination"
                  align="center"
                  :total-rows="numberOfItems"
                  :per-page="itemsPerPage">
    </b-pagination>
    <FilterButtonsModal link="/discard/type" :permission-add="true">
      <div class="row mx-auto align-items-start justify-content-center bv-d-md-down-none
      mx-auto my-4">
      <div class="col-sm-7 col-lg-6 col-xl-5">
        <div class="text-left">Data</div>
        <b-form-row>
          <b-form-group  class="align-items-center col-6" label="Od:"
                         label-cols-md="2"
                         label-size="sm">
            <b-form-datepicker v-model="dateFrom"
                               label-no-date-selected="wybierz"
                               :max="dateTo"
                               size="sm"
                               :date-format-options="datePickerFormat">
            </b-form-datepicker>
          </b-form-group>
          <b-form-group class="align-items-center col-6" label="Do:"
                        label-cols-md="2"
                        label-size="sm">
            <b-form-datepicker v-model="dateTo"
                               :min="dateFrom"
                               label-no-date-selected="wybierz"
                               size="sm"
                               :date-format-options="datePickerFormat">
            </b-form-datepicker>
          </b-form-group>
        </b-form-row>
      </div>
      <div class="col-5">
        <div class="text-left">Składka</div>
        <b-form-row>
          <PriceInput class="col-6"
                      v-model="amountFrom"
                      :validate-status-prop="null"
                      :min="0"
                      :max="amountTo"
                      key="amountFrom"
                      label="Od:"/>
          <PriceInput class="col-6"
                      v-model="amountTo"
                      :validate-status-prop="null"
                      :min="amountFrom"
                      key="amountTo"
                      label="Do:"/>
        </b-form-row>
      </div>
      <div class="col-md-3 col-xl-2">
        <div class="text-left">Typ</div>
        <b-form-select id="sortSelect" class="ml-2"
                       v-model="selectedType"
                       :options="typeOptions"
                       size="sm"
                       @change="clearOptionsOnChangeType">
        </b-form-select>
      </div>
      <div class="col-md-3 col-xl-2" v-if="selectedType === 'group'">
        <div class="text-left">Grupa</div>
        <b-form-select id="sortSelect" class="ml-2"
                       v-model="selectedGroup"
                       :options="groups"
                       size="sm">
        </b-form-select>
      </div>
      <div class="col-3">
        <div class="text-left">Gdzie</div>
        <b-form-select  class="mx-auto"
                        v-model="whereValue"
                        :options="whereOptions"
                        @change="clearOnWhereOptionChange"
                        size="sm">
        </b-form-select>
      </div>
      <div class="col-md-3 col-xl-2" v-if="selectedType === 'single' && whereValue === true">
        <div class="text-left">Odbiorca</div>
        <b-form-select id="sortSelect" class="ml-2"
                       v-model="selectedRecipient"
                       :options="recipients"
                       size="sm">
        </b-form-select>
      </div>
      <div class="col-md-3 col-xl-2" v-if="selectedType === 'single' && whereValue === false">
        <div class="text-left">Dłużnik</div>
        <b-form-select id="sortSelect" class="ml-2"
                       v-model="selectedDebtor"
                       :options="debtors"
                       size="sm">
        </b-form-select>
      </div>
      <div class="col-3">
        <div class="text-left">Sortowanie</div>
        <b-form-select  class="ml-2"
                        v-model="sortingValue"
                        :options="sortingOptions"
                        size="sm">
        </b-form-select>
      </div>
      <b-form-group class="col-3">
        <div class="text-left">Pokaż</div>
        <b-form-checkbox-group
          id="checkbox-group-1"
          v-model="selectedShow"
          :options="showOptions"
          name="flavour-1"
        ></b-form-checkbox-group>
      </b-form-group>
      <div class="col-3">
        <div class="text-left">Na stronie</div>
        <b-form-select  class="ml-2"
                        v-model="itemsPerPage"
                        :options="pageOptions"
                        @change="perPageChange"
                        size="sm">
        </b-form-select>
      </div>
      </div>
      <div class="row justify-content-center mb-4 d-lg-none">
        <div class="col-8">
          <div class="text-left">Data</div>
          <b-form-row class="mx-auto row justify-content-center">
            <b-form-group  class="col-6 mx-auto"
                           label="Od:"
                           label-size="sm">
              <b-form-datepicker v-model="dateFrom"
                                 label-no-date-selected="wybierz"
                                 :max="dateTo"
                                 size="sm"
                                 :date-format-options="datePickerFormat">
              </b-form-datepicker>
            </b-form-group>
            <b-form-group class="col-6 mx-auto"
                          label="Do:"
                          label-size="sm">
              <b-form-datepicker v-model="dateTo"
                                 :min="dateFrom"
                                 label-no-date-selected="wybierz"
                                 size="sm"
                                 :date-format-options="datePickerFormat">
              </b-form-datepicker>
            </b-form-group>
          </b-form-row>
        </div>
        <div class="col-8">
          <div class="text-left">Składka</div>
          <b-form-row class="mx-auto row justify-content-center">
            <PriceInput class="col-6 mx-auto"
                        v-model="amountFrom"
                        :validate-status-prop="null"
                        :min="0"
                        :max="amountTo"
                        key="amountFromModal"
                        label="Od:"/>
            <PriceInput class="col-6 mx-auto"
                        v-model="amountTo"
                        :validate-status-prop="null"
                        :min="amountFrom"
                        key="amountToModal"
                        label="Do:"/>
          </b-form-row>
        </div>
        <div class="col-8">
          <div class="text-left">Typ</div>
          <b-form-select id="sortSelect" class="ml-2"
                         v-model="selectedType"
                         :options="typeOptions"
                         size="sm"
                         @change="clearOptionsOnChangeType">
          </b-form-select>
        </div>
        <div class="col-8 px-auto" v-if="selectedType === 'group'">
          <div class="text-left">Grupa</div>
          <b-form-select id="sortSelect" class="ml-2"
                         v-model="selectedGroup"
                         :options="groups"
                         size="sm">
          </b-form-select>
        </div>
        <div class="col-8">
          <div class="text-left">Gdzie</div>
          <b-form-select  class="ml-2"
                          v-model="whereValue"
                          :options="whereOptions"
                          @change="clearOnWhereOptionChange"
                          size="sm">
          </b-form-select>
        </div>
        <div class="col-8" v-if="selectedType === 'single' && whereValue === true">
          <div class="text-left">Odbiorca</div>
          <b-form-select id="sortSelect" class="ml-2"
                         v-model="selectedRecipient"
                         :options="recipients"
                         size="sm">
          </b-form-select>
        </div>
        <div class="col-8" v-if="selectedType === 'single' && whereValue === false">
          <div class="text-left">Dłużnik</div>
          <b-form-select id="sortSelect" class="ml-2"
                         v-model="selectedDebtor"
                         :options="debtors"
                         size="sm">
          </b-form-select>
        </div>
        <div class="col-8">
          <div class="text-left">Sortowanie</div>
          <b-form-select  class="ml-2"
                          v-model="sortingValue"
                          :options="sortingOptions"
                          size="sm">
          </b-form-select>
        </div>
        <b-form-group class="col-8">
          <div class="text-left">Pokaż</div>
          <b-form-checkbox-group
            id="checkbox-group-1"
            class="ml-2"
            v-model="selectedShow"
            :options="showOptions"
            name="flavour-1"
          ></b-form-checkbox-group>
        </b-form-group>
        <div class="col-8">
          <div class="text-left">Na stronie</div>
          <b-form-select  class="ml-2"
                          v-model="itemsPerPage"
                          :options="pageOptions"
                          @change="perPageChange"
                          size="sm">
          </b-form-select>
        </div>
      </div>
    </FilterButtonsModal>
    <b-spinner style="position:fixed; top: 49%; left:49%;width:3rem;height:3rem"
               v-if="loading"></b-spinner>
  </b-container>
</template>

<script>
import DiscardListItem from '@/components/DiscardListItem.vue';
import PriceInput from '@/components/PriceInput.vue';
import sortingFunctions from '@/mixins/sortingFunctions';
import FilterButtonsModal from '@/components/filterButtonsModal.vue';
import pagination from '@/mixins/pagination';

export default {
  name: 'Discards',
  mixins: [sortingFunctions, pagination],
  components: {
    DiscardListItem,
    PriceInput,
    FilterButtonsModal,
  },
  data() {
    return {
      discards: [],
      discardNameSearch: '',
      groups: [],
      recipients: [],
      debtors: [],
      selectedRecipient: null,
      selectedDebtor: null,
      selectedGroup: null,
      amountTo: 0,
      amountFrom: 0,
      dateFrom: null,
      dateTo: null,
      sortingValue: 5,
      selectedType: null,
      whereValue: null,
      selectedShow: ['paid', 'unpaid'],
      datePickerFormat: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      },
      showOptions: [
        { text: 'Opłacone', value: 'paid' },
        { text: 'Nieopłacone', value: 'unpaid' },
      ],
      typeOptions: [
        {
          value: null,
          text: 'Wszystkie',
        },
        {
          value: 'single',
          text: 'Pojedyńcze',
        },
        {
          value: 'group',
          text: 'Grupowe',
        },
      ],
      pageOptions: [
        {
          value: 10,
          text: '10',
        },
        {
          value: 20,
          text: '20',
        },
        {
          value: 30,
          text: '30',
        },
      ],
      sortingOptions: [
        {
          value: 1,
          text: 'Rosnąco po nazwie',
        },
        {
          value: 2,
          text: 'Malejąco po nazwie',
        },
        {
          value: 3,
          text: 'Rosnąco po kwocie',
        },
        {
          value: 4,
          text: 'Malejąco po kwocie',
        },
        {
          value: 5,
          text: 'Rosnąco po dacie',
        },
        {
          value: 6,
          text: 'Malejąco po dacie',
        },
      ],
      whereOptions: [
        {
          value: null,
          text: 'Wszystko',
        },
        {
          value: true,
          text: 'jestem dłużnikiem',
        },
        {
          value: false,
          text: 'jestem odbiorcą',
        },
      ],
    };
  },
  computed: {
    filtredItems() {
      if (!this.discards) {
        return [];
      }

      let tempDiscards = this.discards;

      tempDiscards = tempDiscards.filter((item) => {
        if (!this.selectedShow.includes(item.isPaid ? 'paid' : 'unpaid')) {
          return false;
        }

        if (this.discardNameSearch) {
          if (item.name
            .toUpperCase().indexOf(this.discardNameSearch.toUpperCase()) === -1) {
            return false;
          }
        }

        if (this.selectedType) {
          if (item.type !== this.selectedType) {
            return false;
          }

          if (this.selectedRecipient) {
            if (item.recipient !== this.selectedRecipient) {
              return false;
            }
          }

          if (this.selectedDebtor) {
            if (item.debtor !== this.selectedDebtor) {
              return false;
            }
          }
        }
        if (this.selectedGroup) {
          if (item.groupName !== this.selectedGroup) {
            return false;
          }
        }

        if (this.whereValue !== null && this.whereValue !== item.takePart) {
          return false;
        }

        if (this.selectedUser) {
          if (item.userName !== this.selectedUser) {
            return false;
          }
        }

        if (this.amountFrom) {
          const amount = item.isPaid ? item.amountOver : item.amountLeft;
          if (amount < this.amountFrom) {
            return false;
          }
        }

        if (this.amountTo) {
          const amount = item.isPaid ? item.amountOver : item.amountLeft;
          if (amount > this.amountTo) {
            return false;
          }
        }

        if (this.dateFrom) {
          const dateFrom = this.$dayjs(this.dateFrom);
          const tempDate = this.$dayjs(item.dateOfPayment);

          if (tempDate < dateFrom) {
            return false;
          }
        }

        if (this.dateTo) {
          const dateTo = this.$dayjs(this.dateTo);
          const tempDate = this.$dayjs(item.dateOfPayment);

          if (tempDate > dateTo) {
            return false;
          }
        }
        return true;
      });

      switch (this.sortingValue) {
        case 1:
          tempDiscards = tempDiscards
            // eslint-disable-next-line max-len
            .sort((left, right) => this.sortingAsc(left.name.toUpperCase(), right.name.toUpperCase()));
          break;
        case 2:
          tempDiscards = tempDiscards
            // eslint-disable-next-line max-len
            .sort((left, right) => this.sortingDsc(left.name.toUpperCase(), right.name.toUpperCase()));
          break;
        case 3:
          tempDiscards = tempDiscards
            .sort((left, right) => {
              const leftValue = left.isPaid ? left.amountOver : left.amountLeft;
              const rightValue = right.isPaid ? right.amountOver : right.amountLeft;
              console.log(leftValue, rightValue);
              return this.sortingAsc(leftValue, rightValue);
            });
          break;
        case 4:
          tempDiscards = tempDiscards
            .sort((left, right) => {
              const leftValue = left.isPaid ? left.amountOver : left.amountLeft;
              const rightValue = right.isPaid ? right.amountOver : right.amountLeft;
              return this.sortingDsc(leftValue, rightValue);
            });
          break;
        case 5:
          tempDiscards = tempDiscards
            // eslint-disable-next-line max-len
            .sort((left, right) => this.sortingAsc(left.dateOfPayment, right.dateOfPayment));
          break;
        default:
          tempDiscards = tempDiscards
            // eslint-disable-next-line max-len
            .sort((left, right) => this.sortingDsc(left.dateOfPayment, right.dateOfPayment));
      }

      return tempDiscards;
    },
  },
  methods: {
    clearOptionsOnChangeType() {
      this.selectedGroup = null;
      this.selectedDebtor = null;
      this.selectedRecipient = null;
      this.whereValue = null;
    },
    clearOnWhereOptionChange() {
      this.selectedRecipient = null;
      this.selectedDebtor = null;
    },
  },
  created() {
    this.loading = true;
    this.axios.get('/discard/all')
      .then((res) => {
        this.discards = res.data.data;
        if (this.discards.length) {
          this.discards = this.discards.map((item) => {
            let temp = {
              id: item.id,
              name: item.idDiscard.name,
              dateOfPayment: this.$dayjs(item.dateOfPayment).format('YYYY-MM-DD'),
              groupName: item.idDiscard.idGroup ? item.idDiscard.idGroup.name : null,
              type: item.idDiscard.type,
            };

            let paidIn = 0;
            let amount = 0;

            if (item.obligation) {
              paidIn = item.obligation.paidIn;
              amount = item.obligation.amount;
              temp.debtor = this.$store.getters.login;
            } else if (temp.type === 'group') {
              item.obligations.forEach((obligation) => {
                paidIn += obligation.paidIn;
                amount += obligation.amount;
              });
            } else {
              paidIn = item.obligations[0].paidIn;
              amount = item.obligations[0].amount;
              temp.debtor = item.obligations[0].idUser.login;
            }

            temp = { // eslint-disable-next-line max-len
              amount,
              paidIn,
              ...temp,
            };

            const tempAmount = Number((temp.amount - temp.paidIn).toFixed(2));

            if (tempAmount > 0) {
              temp.isPaid = false;
              temp.amountLeft = tempAmount;
            } else {
              temp.isPaid = true;
              temp.amountOver = tempAmount < 0 ? tempAmount * -1 : 0;
            }

            if (temp.type === 'single') {
              temp.recipient = item.idDiscard.idRecipient.login;
            }

            temp.takePart = temp.debtor === this.$store.getters.login;
            temp.obligation = item.obligation;

            return temp;
          });
          const dates = this.discards.map((item) => new Date(item.dateOfPayment));

          const amounts = this.discards.map((item) => {
            if (item.isPaid) {
              return item.amountOver;
            }
            return item.amountLeft;
          });

          const tempSingleDiscards = this.discards
            .filter((item) => item.type === 'single');

          const tempGroupDiscards = this.discards
            .filter((item) => item.type === 'group');

          this.debtors = tempSingleDiscards.map((item) => item.debtor)
            .filter((item) => item !== this.$store.getters.login);
          this.recipients = tempSingleDiscards.map((item) => item.recipient)
            .filter((item) => item !== this.$store.getters.login);
          this.groups = tempGroupDiscards.map((item) => item.groupName);

          this.debtors = [...new Set(this.debtors)];
          this.debtors = this.debtors.map((item) => ({
            value: item,
            text: item,
          }));

          this.debtors.unshift({
            value: null,
            text: 'Wybierz',
          });

          this.recipients = [...new Set(this.recipients)];

          this.recipients = this.recipients.map((item) => ({
            value: item,
            text: item,
          }));

          this.recipients.unshift({
            value: null,
            text: 'Wybierz',
          });

          this.groups = [...new Set(this.groups)];

          this.groups = this.groups.map((item) => ({
            value: item,
            text: item,
          }));
          this.groups.unshift({
            value: null,
            text: 'Wybierz',
          });

          this.dateFrom = this.$dayjs(Math.min.apply(null, dates)).format('YYYY-MM-DD');
          this.dateTo = this.$dayjs(Math.max.apply(null, dates)).format('YYYY-MM-DD');

          // eslint-disable-next-line no-multi-assign
          this.amountFrom = Math.min.apply(null, amounts);
          // eslint-disable-next-line no-multi-assign
          this.amountTo = Math.max.apply(null, amounts);

          this.loading = false;
        }
        this.loading = false;
      })
      .catch((err) => {
        this.fetchErr(err);
        this.loading = false;
      });
  },
};
</script>

<style scoped>

</style>
