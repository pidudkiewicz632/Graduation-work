<template>
  <b-container id="chooseDiscardTypeWrapper"
               class="shadow mx-auto col-11 col-sm-8 darkBg col-md-7 col-lg-5 col-xl-4 p-3
               d-inline-block">
    <h2 class="greenText">Tworzenie Zrzutki</h2>
    <div class="col-11 col-sm-8 col-md-7 col-lg-5 col-xl-4 mx-auto">
      <b-form-group class="d-flex justify-content-center" label="Typ zbiórki">
        <b-radio-group class="text-justify"
                       v-model="selectedType"
                       :options="typeOptions">
        </b-radio-group>
      </b-form-group>
      <b-form-group v-if="selectedType === 'group'" class="my-4 mx-auto" label="Grupa"
      :invalid-feedback="feedback" :state="state">
        <b-form-select id="sortSelect" class="ml-2"
                       v-model="selectedGroup"
                       :options="groups"
                       :state="state">
                       size="sm">
        </b-form-select>
      </b-form-group>
      <b-button class="btnGreen mr-1 mx-auto" @click="goToCreate">Dalej</b-button>
    </div>
    <b-spinner style="position:fixed; top: 49%; left:49%;width:3rem;height:3rem"
               v-if="loading"></b-spinner>
  </b-container>
</template>

<script>
export default {
  name: 'ChooseDiscardType',
  data() {
    return {
      selectedType: 'single',
      groups: [],
      selectedGroup: null,
      feedback: 'Wybierz grupę',
      state: null,
      typeOptions: [
        {
          value: 'single',
          text: 'Pojedyńcza',
        },
        {
          value: 'group',
          text: 'Grupowa',
        },
      ],
    };
  },
  methods: {
    goToCreate() {
      this.state = true;
      if (this.selectedType === 'single') {
        this.$router.push({ path: '/discard/single/create' });
      } else if (this.selectedGroup) {
        this.$router.push({ path: `/group/discard/add/${this.selectedGroup}` });
      } else {
        this.state = false;
      }
    },
  },
  created() {
    this.loading = true;
    this.axios.get('/group/type/choose').then((res) => {
      if (res.data.data) {
        this.groups = res.data.data;
        this.groups = this.groups.map((item) => ({
          value: item.id,
          text: item.name,
        }));
        this.groups.unshift({
          value: null,
          text: 'Wybierz',
        });
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
#chooseDiscardTypeWrapper{
  background-color: #1C1919;
  color: #FFFFFF;
}
</style>
