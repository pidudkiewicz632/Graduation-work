<template>
  <b-container id="invitesWrapper" class="mx-auto col-12 col-sm-10  col-md-9 text-white">
    <h2 class="my-5">Zaproszenia</h2>
    <transition-group name="list" class="row justify-content-center mx-auto px-auto mb-5">
      <InviteItem v-for="(item) in invites"
                         :key="item.id"
                         :invite-data-data-prop="item"
                         @modalMessage="printMessage">
      </InviteItem>
    </transition-group>
    <p v-if="invites.length === 0 && !loading"> Brak Zaproszeń</p>
    <b-spinner style="position:fixed; top: 49%; left:49%;width:3rem;height:3rem"
               v-if="loading"></b-spinner>
  </b-container>
</template>

<script>
import InviteItem from '@/components/InviteItem.vue';

export default {
  name: 'Invites',
  components: {
    InviteItem,
  },
  data() {
    return {
      invites: [],
    };
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    printMessage(message) {
      if (message[2]) {
        this.fetchErr(message[2]);
      } else {
        this.invites = this.invites.filter((element) => element.id !== message[1]);
        this.showMessage(message[0], 'Zaproszenie');
      }
    },
  },
  mounted() {
    this.loading = true;
    this.axios.get('/group/invites').then((res) => {
      this.invites = res.data.data;
      this.loading = false;
    }).catch((err) => {
      this.fetchErr(err);
      this.loading = false;
    });
  },
};
</script>

<style lang="scss" scoped>
#invitesWrapper{
  h2{
    color: white;
  }
}
</style>
