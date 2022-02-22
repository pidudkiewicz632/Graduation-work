<template>
  <b-container id="homeWrapper"
               class="mx-auto col-12 col-md-10 col-lg-9 col-xl-8 text-white">
      <h2 class="my-5">Nieopłacone Zrzutki</h2>
      <b-form-input class="col-xl-3 col-lg-4 col-md-5 col-10 mx-auto pb-0 mb-5"
                    v-model="discardNameSearch"
                    type="search"
                    size="sm"
                    placeholder="Nazwa Zrzutki">
      </b-form-input>
      <transition-group :class="{fewElements: numberOfItems <= itemsPerPage}"
                        name="list" class="row justify-content-center discardsList mx-auto
   col-12">
        <DiscardListItem v-for="item of selectedItems" :key="item.id" :discard-data="item"
                         :all-discards="false"/>
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
      <div class="row mx-auto align-items-start justify-content-center
      mx-auto my-4 bv-d-md-down-none">
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
                         @change="clearGroupUser">
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
        <div class="col-md-3 col-xl-2" v-else-if="selectedType === 'single'">
          <div class="text-left">Odbiorca</div>
          <b-form-select id="sortSelect" class="ml-2"
                         v-model="selectedUser"
                         :options="users"
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
                         @change="clearGroupUser">
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
        <div class="col-8 px-auto" v-else-if="selectedType === 'single'">
          <div class="text-left">Odbiorca</div>
          <b-form-select id="sortSelect" class="ml-2"
                         v-model="selectedUser"
                         :options="users"
                         size="sm">
          </b-form-select>
        </div>
        <div class="col-8 px-auto">
          <div class="text-left">Sortowanie</div>
          <b-form-select  class="ml-2"
                          v-model="sortingValue"
                          :options="sortingOptions"
                          size="sm">
          </b-form-select>
        </div>
        <div class="col-8 px-auto">
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
    <b-spinner style="position:fixed; top: 50%; left:50%;width:3rem;height:3rem"
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
  name: 'Home',
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
      users: [],
      selectedUser: null,
      selectedGroup: null,
      amountTo: 0,
      amountFrom: 0,
      dateFrom: null,
      dateTo: null,
      sortingValue: 5,
      selectedType: null,
      datePickerFormat: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      },
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
          text: 'Rosnąco po pozostałe',
        },
        {
          value: 4,
          text: 'Malejąco po pozostałe',
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
    };
  },
  computed: {
    filtredItems() {
      if (!this.discards) {
        return [];
      }

      let tempDiscards = this.discards;

      tempDiscards = tempDiscards.filter((item) => {
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
        }

        if (this.selectedGroup) {
          if (item.groupName !== this.selectedGroup) {
            return false;
          }
        }

        if (this.selectedUser) {
          if (item.recipient !== this.selectedUser) {
            return false;
          }
        }

        if (this.amountFrom) {
          if (item.amountLeft < this.amountFrom) {
            return false;
          }
        }

        if (this.amountTo) {
          if (item.amountLeft > this.amountTo) {
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
            .sort((left, right) => this.sortingAsc(left.amountLeft, right.amountLeft));
          break;
        case 4:
          tempDiscards = tempDiscards
            .sort((left, right) => this.sortingDsc(left.amountLeft, right.amountLeft));
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
    clearGroupUser() {
      this.selectedGroup = null;
      this.selectedUser = null;
    },
  },
  created() {
    this.loading = true;
    this.axios.get('/discard/user', {
      params: {
        isPaid: false,
      },
    })
      .then((res) => {
        this.discards = res.data.data;

        if (this.discards) {
          this.discards = this.discards.map((item) => ({
            id: item.idDiscardCycle.id,
            name: item.idDiscardCycle.idDiscard.name,
            dateOfPayment: this.$dayjs(item.idDiscardCycle.dateOfPayment).format('YYYY-MM-DD'),
            amountLeft: Number((item.amount - item.paidIn).toFixed(2)),
            // eslint-disable-next-line max-len
            groupName: item.idDiscardCycle.idDiscard.idGroup ? item.idDiscardCycle.idDiscard.idGroup.name : null,
            amount: item.amount,
            paidIn: item.paidIn,
            type: item.idDiscardCycle.idDiscard.type,
            // eslint-disable-next-line max-len
            recipient: item.idDiscardCycle.idDiscard.idRecipient ? item.idDiscardCycle.idDiscard.idRecipient.login : null,
          }));
          this.groups = this.discards.map((item) => item.groupName)
            .filter((item) => item);
          this.groups = [...new Set(this.groups)];
          this.groups = this.groups.map((item) => ({
            value: item,
            text: item,
          }));
          this.groups.unshift({
            value: null,
            text: 'Wybierz',
          });

          this.users = this.discards.map((item) => item.recipient)
            .filter((item) => item);
          this.users = [...new Set(this.users)];
          this.users = this.users.map((item) => ({
            value: item,
            text: item,
          }));

          this.users.push({
            value: null,
            text: 'Wybierz',
          });

          const dates = this.discards.map((item) => new Date(item.dateOfPayment));
          const amounts = this.discards.map((item) => item.amountLeft);

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

<style lang="scss" scoped>
.discardsList{
  float: none;
}
#homeWrapper{
  height: 100%;
  width: 100%;
}
</style>
