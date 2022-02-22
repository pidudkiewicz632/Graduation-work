<template>
  <div id="groupDiscardsWrapper" class="py-2 px-2">
        <b-form-input class="col-xl-3 col-lg-4 col-md-5 col-6 mx-auto"
                      v-model="discardNameSearch"
                      size="sm"
                      placeholder="Nazwa">
        </b-form-input>
    <transition-group :class="{fewElements: numberOfItems <= itemsPerPage}"
      name="list" class="row justify-content-center discardsList mx-auto
  col-12">
      <GroupDiscardListItem v-for="item in selectedItems" :key="item.id" :discard-data="item"
                            @toDetails="toDiscardDetails"/>
    </transition-group>
    <b-pagination v-model="currentPage"
                  v-if="numberOfItems > itemsPerPage"
                  class="pagination"
                  align="center"
                  :total-rows="numberOfItems"
                  :per-page="itemsPerPage">
    </b-pagination>
    <p v-if="selectedItems.length === 0 && !loading" class="mt-5"> Brak Zrzutek</p>
    <FilterButtonsModal :link="linkToAdd" :permission-add="userPermission">
      <div class="row mx-auto align-items-start justify-content-center bv-d-md-down-none
      mx-auto mb-2">
        <div class="col-sm-7 col-lg-8 col-xl-10">
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
            <b-form-group class="align-items-center col-6"
                          label="Do:"
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
        <div class="col-5 col-xl-7">
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
        <div class="col-4" v-if="userPermission">
          <div class="text-left">Wyświetl</div>
          <b-form-select  class="mx-auto"
                          v-model="whereValue"
                          :options="whereOptions"
                          @change="perPageChange"
                          size="sm">
          </b-form-select>
        </div>
        <b-form-group class="col-6">
          <div class="text-left">Pokaż</div>
          <b-form-checkbox-group
            id="checkbox-group-1"
            v-model="selectedShow"
            :options="showOptions"
            name="flavour-1"
          ></b-form-checkbox-group>
        </b-form-group>
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
          <div class="text-left">Sortowanie</div>
          <b-form-select  class="mx-auto"
                          v-model="sortingValue"
                          :options="sortingOptions"
                          size="sm">
          </b-form-select>
        </div>
        <div class="col-8">
          <div class="text-left">Na stronie</div>
          <b-form-select  class="mx-auto"
                          v-model="itemsPerPage"
                          :options="pageOptions"
                          @change="perPageChange"
                          size="sm">
          </b-form-select>
        </div>
        <div class="col-8" v-if="userPermission">
          <div class="text-left">Gdzie</div>
          <b-form-select  class="mx-auto"
                          v-model="whereValue"
                          :options="whereOptions"
                          @change="perPageChange"
                          size="sm">
          </b-form-select>
        </div>
        <b-form-group class="col-8">
          <div class="text-left">Pokaż</div>
          <b-form-checkbox-group
            id="checkbox-group-1"
            v-model="selectedShow"
            :options="showOptions"
            name="flavour-1"
          ></b-form-checkbox-group>
        </b-form-group>
      </div>
    </FilterButtonsModal>
    <b-spinner style="width: 3rem; height: 3rem;" v-if="loading"></b-spinner>
  </div>
</template>

<script>
import GroupDiscardListItem from '@/components/GroupDiscardListItem.vue';
import sortingFunctions from '@/mixins/sortingFunctions';
import PriceInput from '@/components/PriceInput.vue';
import groupInfo from '@/mixins/groupInfo';
import pagination from '@/mixins/pagination';
import FilterButtonsModal from '@/components/filterButtonsModal.vue';

export default {
  name: 'GroupDiscards',
  mixins: [groupInfo, sortingFunctions, pagination],
  props: {
    groupId: String,
  },
  components: {
    GroupDiscardListItem,
    PriceInput,
    FilterButtonsModal,
  },
  data() {
    return {
      dateFrom: null,
      dateTo: null,
      amountTo: null,
      amountFrom: null,
      discardNameSearch: '',
      linkToAdd: '',
      itemsPerPage: 10,
      sortingValue: 5,
      whereValue: null,
      selectedShow: ['others', 'paid', 'unpaid'],
      datePickerFormat: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      },
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
      whereOptions: [
        {
          value: null,
          text: 'Wszystko',
        },
        {
          value: true,
          text: 'gdzie uczestniczę',
        },
        {
          value: false,
          text: 'gdzie nie uczestniczę',
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
          text: 'Rosnąco po składce',
        },
        {
          value: 4,
          text: 'Malejąco po składce',
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
      showOptions: [
        { text: 'Opłacone', value: 'paid' },
        { text: 'Nieopłacone', value: 'unpaid' },
      ],
    };
  },
  computed: {
    filtredItems() {
      let discardsTemp = this.groupDiscards;

      if (this.selectedShow.length) {
        discardsTemp = discardsTemp
          // eslint-disable-next-line array-callback-return
          .filter((item) => {
            if (!this.selectedShow.includes(item.tag)) {
              return false;
            }
            if (this.discardNameSearch) {
              if (item.name
                .toUpperCase().indexOf(this.discardNameSearch.toUpperCase()) === -1) {
                return false;
              }
            }

            if (this.whereValue !== null && this.whereValue !== item.takePart) {
              return false;
            }

            if (this.amountFrom) {
              const amount = item.amountLeft || item.amountOver || item.sum;
              if (amount < this.amountFrom) {
                return false;
              }
            }

            if (this.amountTo) {
              const amount = item.amountLeft || item.amountOver || item.sum;
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
      } else {
        discardsTemp = [];
      }

      switch (this.sortingValue) {
        case 1:
          discardsTemp = discardsTemp
            // eslint-disable-next-line max-len
            .sort((left, right) => this.sortingAsc(left.name.toUpperCase(), right.name.toUpperCase()));
          break;
        case 2:
          discardsTemp = discardsTemp
            // eslint-disable-next-line max-len
            .sort((left, right) => this.sortingDsc(left.name.toUpperCase(), right.name.toUpperCase()));
          break;
        case 3:
          discardsTemp = discardsTemp
            .sort((left, right) => {
              const leftAmount = left.amountLeft || left.amountOver || left.sum;
              const rightAmount = right.amountLeft || right.amountOver || right.sum;
              return this.sortingAsc(leftAmount, rightAmount);
            });
          break;
        case 4:
          discardsTemp = discardsTemp
            .sort((left, right) => {
              const leftAmount = left.amountLeft || left.amountOver || left.sum;
              const rightAmount = right.amountLeft || right.amountOver || right.sum;
              return this.sortingDsc(leftAmount, rightAmount);
            });
          break;
        case 5:
          discardsTemp = discardsTemp
            // eslint-disable-next-line max-len
            .sort((left, right) => this.sortingAsc(left.dateOfPayment, right.dateOfPayment));
          break;
        default:
          discardsTemp = discardsTemp
            // eslint-disable-next-line max-len
            .sort((left, right) => this.sortingDsc(left.dateOfPayment, right.dateOfPayment));
      }

      return discardsTemp;
    },
  },
  methods: {
    toDiscardDetails(discardId) {
      this.$router.push({ path: `/discard/details/0/${discardId}` });
    },
  },
  mounted() {
    if (this.groupDiscards.length) {
      const dates = this.groupDiscards.map((item) => new Date(item.dateOfPayment));
      const amounts = this.groupDiscards.map((item) => {
        if (item.tag === 'unpaid') {
          return item.amountLeft;
        }
        if (item.tag === 'paid') {
          return item.amountOver;
        }
        return item.sum;
      });
      // eslint-disable-next-line no-multi-assign
      this.amountFrom = Math.min.apply(null, amounts);
      // eslint-disable-next-line no-multi-assign
      this.amountTo = Math.max.apply(null, amounts);

      this.dateFrom = this.$dayjs(Math.min.apply(null, dates)).format('YYYY-MM-DD');
      this.dateTo = this.$dayjs(Math.max.apply(null, dates)).format('YYYY-MM-DD');
    }

    this.linkToAdd = `/group/discard/add/${this.groupId}`;
  },
};
</script>

<style lang="scss">

</style>
