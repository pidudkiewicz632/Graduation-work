<template>
  <b-container id="editGroupMembersWrapper"
               class="shadow mx-auto col-11 col-sm-10  col-md-9 col-lg-7 col-xl-4 py-3">
    <h2 class="mb-3">
      Edycja Członków Grupy
    </h2>
    <div class="d-inline-block justify-content-center col-12 col-sm-10  col-md-9 col-lg-8 col-xl-7">
      <EditMembersListItem v-for="item in groupMembersToPrint"
                           :key="item.id"
                           :member-info="item"
                           @changePermission="changePermission"
                           @restore="restoreMember"
                           @remove="removeMember"/>
    </div>
    <b-form-group class="d-flex mt-3 justify-content-center"
                  :invalid-feedback="validationNewMember.message"
                  label="Dodawanie Użytkowników"
                  :state="validationNewMember.state">
      <b-input-group-append>
          <b-form-input v-model="newMember" class="mr-1" size="sm"
                        list="users"
                        placeholder="Dodawanie Użytkowników"
                        :state="validationNewMember.state">
          </b-form-input>
          <datalist id="users" v-if="newMember.length>2">
            <option v-for="user in users" :key="user.id">{{user.login}}</option>
          </datalist>
          <b-button size="sm" class="btnGreen" @click="addNewMember">
            Dodaj
          </b-button>
      </b-input-group-append>
    </b-form-group>
    <b-row class="container">
      <UserListItem v-for="member in newMembers"
                    :key="member.idUser"
                    :userDataProp="member"
                    @remove="removeNewMember"></UserListItem>
    </b-row>
    <b-button class="btnGreen" @click="save">
      OK
    </b-button>
    <b-spinner style="position:fixed; top: 49%; left:49%;width:3rem;height:3rem"
               v-if="loading"></b-spinner>
  </b-container>
</template>

<script>
import EditMembersListItem from '@/components/EditMembersListItem.vue';
import UserListItem from '@/components/UserListItem.vue';

export default {
  name: 'EditGroupMembers',
  props: ['groupId'],
  components: {
    EditMembersListItem,
    UserListItem,
  },
  data() {
    return {
      newMembers: [],
      userId: '',
      newMember: '',
      modificatedMemberPermissions: [],
      users: [],
      groupMembers: [],
      groupMembersToPrint: [],
      userPermission: '',
      validationNewMember: {
        state: null,
        message: '',
      },
    };
  },
  methods: {
    removeNewMember(memberId) {
      this.newMembers.splice(this.newMembers
        .findIndex((element) => element.idUser === memberId), 1);
    },
    removeMember(memberId) {
      let tempUser = this.modificatedMemberPermissions
        .find((element) => element.idUser === memberId);

      if (tempUser) {
        tempUser.permission = 'deleted';
      } else {
        this.modificatedMemberPermissions.push({ idUser: memberId, permission: 'deleted' });
      }

      tempUser = this.groupMembersToPrint.find((element) => element.idUser.id === memberId);
      tempUser.permission = 'deleted';
    },
    restoreMember(memberId) {
      const isInModificatedList = this.modificatedMemberPermissions
        .map((element) => element.idUser)
        .indexOf(memberId);

      const isInGroupMembers = this.groupMembers.find((element) => element.idUser.id === memberId);

      if (isInModificatedList !== -1) {
        this.modificatedMemberPermissions.splice(isInModificatedList, 1);
      } else {
        this.modificatedMemberPermissions.push({ idUser: memberId, permission: 'member' });
      }

      let lastPermission = 'member';

      if (isInGroupMembers) {
        lastPermission = isInGroupMembers.permission === 'deleted' ? lastPermission : isInGroupMembers.permission;
      }
      const tempUser = this.groupMembersToPrint.find((element) => element.idUser.id === memberId);
      tempUser.permission = lastPermission;
    },
    changePermission(memberId, permission) {
      const tempUser = this.modificatedMemberPermissions
        .find((element) => element.idUser === memberId);

      if (tempUser) {
        tempUser.permission = permission;
      } else {
        this.modificatedMemberPermissions.push({ idUser: memberId, permission });
      }
    },
    addNewMember() {
      const newMembersNames = this.newMembers.map((element) => element.name);
      const oldMembersNames = this.groupMembers.map((element) => element.idUser.login);

      this.validationNewMember.state = true;
      if (this.newMember === this.$store.getters.login) {
        this.validationNewMember.state = false;
        this.validationNewMember.message = 'Nie możesz dodać samego siebie.';
      } else if (newMembersNames.indexOf(this.newMember) !== -1
        || oldMembersNames.indexOf(this.newMember) !== -1) {
        this.validationNewMember.state = false;
        this.validationNewMember.message = 'Dodałeś już tego użytkownika.';
      } else {
        this.axios.get(`/user/checkLogin?login=${this.newMember}`).then((res) => {
          if (res.data.message === true) {
            if (res.data.data.status === 'active') {
              this.validationNewMember.state = true;
              this.newMembers.push({ idUser: res.data.data.id, name: this.newMember });
              this.newMember = '';
            } else {
              this.validationNewMember.state = false;
              this.validationNewMember.message = 'Nie ma takiego użytkownika.';
            }
          } else {
            this.validationNewMember.state = false;
            this.validationNewMember.message = 'Nie ma takiego użytkownika.';
          }
        });
      }
    },
    save() {
      const data = new FormData();

      if (this.newMembers) {
        data.append('newMembers', JSON.stringify(this.newMembers));
      }

      if (this.modificatedMemberPermissions) {
        data.append('modificatedMemberPermissions', JSON.stringify(this.modificatedMemberPermissions));
      }

      data.append('groupId', this.groupId);

      this.loading = true;
      this.axios.post('/group/edit/members', data)
        .then(() => {
          this.showMessage('Grupa została zaktualizowana', 'Edycja grupy', `/group/details/${this.groupId}`);
          this.loading = false;
        })
        .catch((err) => {
          this.fetchErr(err);
          this.loading = false;
        });
    },
  },
  created() {
    this.userId = this.$store.getters.userId;
    this.loading = true;

    this.axios.get(`/group/edit/members/${this.groupId}`)
      .then((res) => {
        if (res.data) {
          this.groupMembers = res.data.data.members;
          this.users = res.data.data.users;
          const groupMembersCopy = this.groupMembers.map((element) => ({ ...element }));
          this.groupMembersToPrint = groupMembersCopy
            .filter((item) => item.permission !== 'owner' && item.idUser.id !== this.userId);
          this.userPermission = res.data.permission;
        } else {
          this.showMessage('Coś poszło nie tak', 'Edycja Członków grupy', '/groups');
        }
        this.loading = false;
      })
      // eslint-disable-next-line consistent-return
      .catch((err) => {
        this.loading = false;
        if (err.response.status === 405) {
          return this.$router.push('/groups');
        }
        this.fetchErr(err);
      });
  },
};
</script>

<style lang="scss" scoped>
#editGroupMembersWrapper{
  background-color: #1C1919;
  color: #FFFFFF;
  h2{
    color:#148a14;
  }
}
</style>
