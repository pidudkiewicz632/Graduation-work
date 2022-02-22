<template>
  <b-container id="settingsWrapper"
               class="shadow mx-auto col-11 col-lg-8 col-xl-5 p-0 mb-3 py-3">
    <h2>Informacje</h2>
    <div class="row justify-content-center align-items-center mb-3 mt-2">
      <b-avatar class="mr-1" variant="light" :src="avatarLink"/>
      <h3 class="mt-3 justify-content-center text-red px-3">
        {{ login }}
      </h3>
    </div>
    <div class="my-3">
      {{email}}
    </div>
    <div>
      <b-button class="btnGreen mx-1" @click="toEditInfo">
        Edytuj
      </b-button>
      <b-button class="btnGreen mx-1" @click="toEditPassword">
        Zmień Hasło
      </b-button>
      <b-button class="btnGreen mx-1" @click="showConfirmModal">
        Usuń
      </b-button>
    </div>
  </b-container>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    return {
      login: '',
      avatarLink: '',
      email: '',
    };
  },
  methods: {
    toEditInfo() {
      this.$router.push({ path: '/settings/edit' });
    },
    toEditPassword() {
      this.$router.push({ path: '/settings/password' });
    },
    showConfirmModal() {
      this.confirmModalValue = '';
      this.$bvModal.msgBoxConfirm('Czy na pewno chcesz usunąć?', {
        okTitle: 'Tak',
        cancelTitle: 'Nie',
      })
        .then((value) => {
          if (value) {
            this.loading = true;
            this.axios.post('/user/remove').then(() => {
              this.$store.dispatch('loginOut').then(() => {
                this.showMessage('Twoje konto zostało usunięte, aby je przywrócić sprawdź mail.', 'Usunięcie konta', 'login');
              });
              this.loading = false;
            }).catch((err) => {
              this.fetchErr(err);
              this.loading = false;
            });
          }
        });
    },
  },
  created() {
    this.login = this.$store.getters.login;
    this.avatarLink = `${process.env.VUE_APP_API_BASE_URL}user/avatar/${this.$store.getters.userId}`;
    this.loading = true;
    this.axios.get('/user/info').then((res) => {
      this.email = res.data.data;
      this.loading = false;
    }).catch((err) => {
      this.fetchErr(err);
      this.loading = false;
    });
  },
};
</script>

<style lang="scss" scoped>
#settingsWrapper{
  color: white;
  background-color: #1C1919;
}
</style>
