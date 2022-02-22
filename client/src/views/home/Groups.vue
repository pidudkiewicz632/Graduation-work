<template>
<div id="groupsWrapper" class="mx-auto col-12 col-sm-10  col-md-9">
     <div id="contentGroups">
       <h2 class="my-5">Twoje Grupy</h2>
       <b-form-input class="col-xl-3 col-lg-4 col-md-5 col-10 mx-auto mb-5"
                     type="search"
                     size="sm"
                     placeholder="Nazwa Grupy"
                     v-model="groupNameSearch">
       </b-form-input>
       <transition-group :class="{fewElements: numberOfItems <= itemsPerPage}"
                          name="list" mode="in-out" class="row
                         justify-content-center mb-5 mt-3">
            <GroupItem v-for="item in selectedItems"
                       :key="item.id"
                       :groupDataProp="item"
                       @toDetails="toGroupDetails">
            </GroupItem>
       </transition-group>
       <p v-if="filtredItems.length === 0 && !loading"> Brak Grup</p>
       <b-pagination v-model="currentPage"
                     v-if="numberOfItems > itemsPerPage"
                     class="pagination"
                     align="center"
                     :total-rows="numberOfItems"
                     :per-page="itemsPerPage">
       </b-pagination>
     </div>
  <FilterButtonsModal link="/addGroup" :permission-add="true">
      <div class="row align-items-center col-12 justify-content-between bv-d-md-down-none mr-5">
        <b-form-group class="row align-items-center justify-content-between"
                      label="Sortuj:"
                      label-for="sortSelect"
                      label-cols="2"
                      label-size="sm">
          <b-form-select id="sortSelect" class="ml-2" v-model="sortingValue"
                         :options="sortingOptions" size="sm">
          </b-form-select>
        </b-form-group>
        <b-form-group class="row align-items-center justify-content-between"
                      label="Gdzie jestem:"
                      label-for="membershipSelect"
                      label-cols="2"
                      label-size="sm">
          <b-form-select id="membershipSelect" class="ml-2" v-model="membershipValue"
                         :options="membershipOptions" size="sm">
          </b-form-select>
        </b-form-group>
        <b-form-group class="row align-items-center justify-content-between"
                      label="Na stronie:"
                      label-for="perPageSelect"
                      label-cols="2"
                      label-size="sm">
          <b-form-select id="perPageSelect" class="ml-4"
                         v-model="itemsPerPage"
                         :options="pageOptions"
                         @change="perPageChange"
                         size="sm">
          </b-form-select>
        </b-form-group>
      </div>
    <div class="d-lg-none">
      <b-form-group class="mx-auto" label="Sortuj:"
                    label-for="sortSelect" label-size="sm">
        <b-form-select id="sortSelect" class="ml-1" v-model="sortingValue"
                       :options="sortingOptions" size="sm">
        </b-form-select>
      </b-form-group>
      <b-form-group class="mx-auto" label="Gdzie jestem:"
                    label-for="membershipSelect" label-size="sm">
        <b-form-select id="membershipSelect" class="ml-1" v-model="membershipValue"
                       :options="membershipOptions" size="sm">
        </b-form-select>
      </b-form-group>
      <b-form-group class="mx-auto" label="Na stronie:"
                    label-for="perPageSelect" label-size="sm">
        <b-form-select id="perPageSelect" class="ml-1"
                       v-model="itemsPerPage"
                       :options="pageOptions"
                       @change="perPageChange"
                       size="sm">
        </b-form-select>
      </b-form-group>
    </div>
  </FilterButtonsModal>
  <b-spinner style="position:fixed; top: 49%; left:49%;width:3rem;height:3rem"
             v-if="loading"></b-spinner>
</div>
</template>

<script>
import FilterButtonsModal from '@/components/filterButtonsModal.vue';
import pagination from '@/mixins/pagination';
import sortingFunctions from '@/mixins/sortingFunctions';
import GroupItem from '../../components/GroupItem.vue';

export default {
  name: 'Groups',
  mixins: [sortingFunctions, pagination],
  components: {
    GroupItem,
    FilterButtonsModal,
  },
  data() {
    return {
      groupNameSearch: '',
      sortingValue: null,
      itemsPerPage: 20,
      membershipValue: null,
      pageOptions: [
        {
          value: 20,
          text: '20',
        },
        {
          value: 40,
          text: '40',
        },
        {
          value: 60,
          text: '60',
        },
      ],
      membershipOptions: [
        {
          value: null,
          text: 'Wszystko',
        },
        {
          value: 'owner',
          text: 'Administratorem',
        },
        {
          value: 'member',
          text: 'Członkiem.',
        },
      ],
      sortingOptions: [
        {
          value: null,
          text: 'Wybierz',
        },
        {
          value: 1,
          text: 'Rosnąco po nazwie',
        },
        {
          value: 2,
          text: 'Malejąco po nazwie',
        },
      ],
      groups: [],
    };
  },
  computed: {
    filtredItems() {
      if (!this.groups) {
        return [];
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.loading = true;
      let tempGroups = this.groups;

      if (this.membershipValue) {
        tempGroups = tempGroups.filter((item) => item.permission === this.membershipValue);
      }

      if (this.sortingValue === 1) {
        tempGroups = tempGroups.sort((left, right) => this.sortingAsc(left.name, right.name));
      } else if (this.sortingValue === 2) {
        tempGroups = tempGroups.sort((left, right) => this.sortingDsc(left.name, right.name));
      }

      if (this.groupNameSearch) {
        tempGroups = tempGroups.filter(
          (item) => item.name.toUpperCase().indexOf(this.groupNameSearch.toUpperCase()) > -1,
        );
      }

      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.loading = false;

      return tempGroups;
    },
  },
  methods: {
    toGroupDetails(groupId) {
      this.$router.push({ path: `/group/details/${groupId}` });
    },
  },
  created() {
    this.loading = true;

    this.axios.get('/group/userGroups').then((res) => {
      this.groups = res.data.data;
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
#contentGroups{
     @media only screen and (max-width: 767px) {
          margin-bottom: 18%;
     }
}
#groupsWrapper{
     color: #ffffff;
}
</style>
