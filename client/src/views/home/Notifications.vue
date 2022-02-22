<template>
  <b-container id="notificationsWrapper" class="mx-auto col-12 col-sm-10  col-md-10 text-white">
    <h2 class="my-5">Powiadomienia</h2>
    <div class="my-2" v-if="numberOfItems > 0 ">
      <b-button class="mx-1 btnGreen shadow" @click="checkAll">Zaznacz wszystkie</b-button>
      <b-button class="mx-1 btnGreen shadow" @click="deleteNotifications">Usuń</b-button>
    </div>
    <transition-group :class="{fewElements: numberOfItems <= itemsPerPage}"
      name="list" class="row justify-content-center mx-auto px-auto mb-5">
      <NotificationsItem v-for="(item) in selectedItems"
                         :key="item.id"
                         :notificationData.sync="item"
                         @modalMessage="printMessage"
                         @toDetails="toDetails">
      </NotificationsItem>
    </transition-group>
    <p v-if="selectedItems.length === 0 && !loading"> Brak Powiadomień</p>
    <div class="col-10 col-sm-9 col-md-7 col-lg-5 col-xl-3 my-3 mx-auto"
         v-if="numberOfItems > itemsPerPage">
      <div class="mx-auto">Na stronie</div>
      <b-form-select  class="col-3 mx-auto"
                      v-model="itemsPerPage"
                      :options="pageOptions"
                      @change="perPageChange"
                      size="sm">
      </b-form-select>
    </div>
    <b-pagination v-model="currentPage"
                  v-if="numberOfItems > itemsPerPage"
                  class="pagination"
                  align="center"
                  :total-rows="numberOfItems"
                  :per-page="itemsPerPage">
    </b-pagination>
    <b-spinner style="position:fixed; top: 49%; left:49%;width:3rem;height:3rem"
               v-if="loading"></b-spinner>
  </b-container>
</template>

<script>
import NotificationsItem from '@/components/NotificationsItem.vue';
import pagination from '@/mixins/pagination';
import sortingFunctions from '@/mixins/sortingFunctions';

export default {
  name: 'Notifications',
  mixins: [pagination, sortingFunctions],
  components: {
    NotificationsItem,
  },
  data() {
    return {
      notifications: [],
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
    };
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    printMessage(message) {
      if (message[2]) {
        this.fetchErr(message[2]);
      } else {
        this.notifications = this.notifications.filter((element) => element.id !== message[1]);
        this.showMessage(message[0], 'Zaproszenie');
      }
    },
    toDetails(link) {
      if (link) {
        this.$router.push({ path: link });
      }
    },
    checkAll() {
      this.notifications.forEach((item) => {
        // eslint-disable-next-line no-param-reassign
        item.checked = true;
      });
    },
    deleteNotifications() {
      const notificationsToDelete = this.notifications.filter((item) => item.checked)
        .map((item) => item.id);

      if (notificationsToDelete.length) {
        const notificationsData = new FormData();
        notificationsData.append('notifications', JSON.stringify(notificationsToDelete));

        this.axios({
          method: 'post',
          url: '/notification/delete',
          data: notificationsData,
          headers: { 'Content-Type': 'multipart/form-data' },
        }).then(() => {
          this.notifications = this.notifications.filter((item) => !item.checked);
          this.showMessage('Powiadomienia zostały usunięte', 'Usuwanie powiadomień', '');
        }).catch((err) => {
          this.fetchErr(err);
        });
      }
    },
  },
  computed: {
    filtredItems() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.notifications
        // eslint-disable-next-line max-len
        .sort((left, right) => this.sortingDsc(left.date, right.date));
    },
  },
  mounted() {
    console.log(true > false);
    this.loading = true;
    this.axios.get('/notification/all').then((res) => {
      this.notifications = res.data.data;
      // eslint-disable-next-line no-param-reassign,no-return-assign
      this.notifications = this.notifications.map((item) => ({
        ...item,
        checked: false,
      }));
      this.notifications = this.notifications
        .sort((left, right) => this.sortingAsc(left.read, right.read));
      this.loading = false;
    }).catch((err) => {
      this.fetchErr(err);
      this.loading = false;
    });
  },
};
</script>

<style lang="scss" scoped>
#notificationsWrapper{
  h2{
    color: white;
  }
}
</style>
