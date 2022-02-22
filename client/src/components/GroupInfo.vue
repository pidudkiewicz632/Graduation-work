<template>
  <div class="py-2 px-4">
    <div class="row justify-content-center align-items-center mb-3 mt-2">
      <b-avatar variant="light" :src="logoLink"/>
      <div class="row justify-content-center align-items-center">
        <h3 class="mt-3 justify-content-center text-red mx-3">
          {{ groupDetails.name }}
        </h3>
        <b-link v-if="userPermission" class="greenText mt-2" @click="toEdit">
          Edytuj
        </b-link>
      </div>
    </div>
    <div v-if="groupDetails.description">
      {{ groupDetails.description }}
    </div>
    <div v-else>
      Brak Opisu
    </div>
    <div class="row my-4 justify-content-center align-items-center">
      <h3 class="mt-2">Członkowie</h3>
      <b-link v-if="userPermission" class="greenText ml-3 float-right" @click="toEditMembers">
        Edytuj
      </b-link>
    </div>
    <div class="row justify-content-center mb-4">
      <GroupMembersItem v-for="item in groupMembers" :key="item.id" :member-info="item"/>
    </div>
    <b-button v-if="userPermission" class="btnGreen mx-1" @click="showConfirmModal">Usuń</b-button>
    <b-spinner style="position:fixed; top: 49%; left:49%;width:3rem;height:3rem"
               v-if="loading"></b-spinner>
  </div>
</template>

<script>
import groupInfo from '@/mixins/groupInfo';
import GroupMembersItem from '@/components/GroupMembersItem.vue';

export default {
  name: 'GroupInfo',
  mixins: [groupInfo],
  props: ['groupId'],
  components: {
    GroupMembersItem,
  },
  data() {
    return {
      logoLink: '',
    };
  },
  methods: {
    toEdit() {
      this.$router.push({ path: `/group/edit/${this.groupId}` });
    },
    toEditMembers() {
      this.$router.push({ path: `/group/edit/members/${this.groupId}` });
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
            const data = new FormData();
            data.append('groupId', this.groupId);
            this.axios.post('/group/delete', data).then(() => {
              this.showMessage('Grupa została usunięta.', 'Usunięcie grupy', '/');
              this.loading = false;
            }).catch((err) => {
              this.fetchErr(err);
              this.loading = false;
            });
          }
        });
    },
  },
  mounted() {
    this.logoLink = `${process.env.VUE_APP_API_BASE_URL}group/logo/${this.groupId}`;
  },
};
</script>
