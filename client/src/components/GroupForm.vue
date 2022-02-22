<template>
  <b-container id="addGroupWrapper"
               class="shadow mx-auto col-11 col-sm-8 darkBg col-md-7 col-lg-5 col-xl-4 p-3">
    <h2 class="mb-3">
      {{ formTitle }}
    </h2>
    <b-form class="d-flex flex-column col-10 mx-auto" @submit.prevent="addGroup">
      <b-form-group class="text-left"
                    label="Nazwa*"
                    :invalid-feedback="validationMessages.groupName"
                    :state="validationRequiredStates.groupName">
        <b-form-input v-model="groupName" class="my-2" placeholder="Nazwa Grupy"
                      size="sm" @input="validationName"
                      :state="validationRequiredStates.groupName"></b-form-input>
      </b-form-group>
      <b-form-group class="text-left"
                    label="Opis"
                    :invalid-feedback="validationMessages.groupDescription"
                    :state="validationNotRequiredStates.groupDescription">
        <b-form-textarea v-model="groupDescription" class="my-2"
                         :state="validationNotRequiredStates.groupDescription"
                         placeholder="Opis grupy"
                         @input="validationDescription">
        </b-form-textarea>
      </b-form-group>
      <b-form-group class="text-left"
                    label="Logo"
                    :invalid-feedback="validationMessages.logo"
                    :state="validationNotRequiredStates.logo">
        <b-form-file class="my-2 greenText" size="sm" plain
                     @change="uploadLogo($event)"></b-form-file>
      </b-form-group>
      <b-form-group v-if="isEdit === false"  class="d-flex justify-content-center text-left"
                    label="Dodawanie Użytkowników"
                    :invalid-feedback="validationMessages.groupMember"
                    :state="validationNotRequiredStates.groupMember">
        <b-input-group-append>
          <b-form-input v-model="groupMember" class="mr-1" size="sm"
                        placeholder="Dodawanie Użytkowników"
                        list="users"
                        :state="validationNotRequiredStates.groupMember">
          </b-form-input>
          <datalist id="users" v-if="groupMember.length>2">
            <option v-for="user in users" :key="user.id">{{user.login}}</option>
          </datalist>
          <b-button size="sm" class="btnGreen" @click="addMember">
            {{ buttonText }}
          </b-button>
        </b-input-group-append>
      </b-form-group>
      <b-row v-if="isEdit === false" class="container">
        <UserItemList v-for="member in groupMembers"
                      :key="member.idUser"
                      :userDataProp="member"
                      @remove="removeMember"></UserItemList>
      </b-row>
      <b-form-text>Pola oznaczone * są obowiązkowe</b-form-text>
      <b-button type="submit" id="d" class="mt-3 mx-auto shadow font-weight-bold btnGreen">
        {{ buttonText }}
      </b-button>
    </b-form>
    <b-spinner style="position:fixed; top: 49%; left:49%;width:3rem;height:3rem"
               v-if="loading"></b-spinner>
  </b-container>
</template>

<script>
import UserItemList from './UserListItem.vue';

export default {
  name: 'GroupForm',
  components: {
    UserItemList,
  },
  props: {
    isEdit: {
      type: Boolean,
      required: true,
    },
    editedGroupId: {
      type: String,
    },
  },
  data() {
    return {
      groupName: '',
      groupDescription: '',
      groupLogo: '',
      groupMember: '',
      buttonText: this.isEdit ? 'Zapisz' : 'Dodaj',
      formTitle: this.isEdit ? 'Edycja Grupy' : 'Dodawanie Grupy',
      groupMembers: [],
      validationRequiredStates: {
        groupName: null,
      },
      validationNotRequiredStates: {
        groupDescription: null,
        groupMember: null,
        logo: null,
      },
      validationMessages: {},
    };
  },
  created() {
    if (this.isEdit) {
      this.loading = true;
      this.axios.get(`/group/edit/info/${this.editedGroupId}`)
        .then((res) => {
          if (res.data.data) {
            const { data } = res.data;
            this.groupName = data.name ? data.name : '';
            this.groupDescription = data.description ? data.description : '';
          } else {
            this.showMessage('Coś poszło nie tak', 'Dodawanie grupy', '/groups');
          }
          this.loading = false;
        })
        // eslint-disable-next-line consistent-return
        .catch((err) => {
          if (err.response.status === 405) {
            return this.$router.push('/groups');
          }
          this.fetchErr(err);
          this.loading = false;
        });
    } else {
      this.loading = true;
      this.axios.get('/user/list')
        .then((res) => {
          if (res.data) {
            this.users = res.data.data;
          }
          this.loading = false;
        })
        // eslint-disable-next-line consistent-return
        .catch((err) => {
          if (err.response.status === 405) {
            return this.$router.push('/groups');
          }
          this.fetchErr(err);
          this.loading = false;
        });
    }
  },
  methods: {
    removeMember(memberId) {
      this.groupMembers.splice(this.groupMembers
        .findIndex((element) => element.idUser !== memberId), 1);
    },
    addMember() {
      const membersNames = this.groupMembers.map((element) => element.name);
      this.validationNotRequiredStates.groupMember = true;
      if (this.groupMember === this.$store.getters.login) {
        this.validationNotRequiredStates.groupMember = false;
        this.validationMessages.groupMember = 'Nie możesz dodać samego siebie.';
      } else if (membersNames.indexOf(this.groupMember) !== -1) {
        this.validationNotRequiredStates.groupMember = false;
        this.validationMessages.groupMember = 'Dodałeś już tego użytkownika.';
      } else {
        this.axios.get(`/user/checkLogin?login=${this.groupMember}`).then((res) => {
          if (res.data.message === true) {
            if (res.data.data.status === 'active') {
              this.validationNotRequiredStates.groupMember = true;
              this.groupMembers.push({
                idUser: res.data.data.id,
                name: this.groupMember,
              });
              this.groupMember = '';
            } else {
              this.validationNotRequiredStates.groupMember = false;
              this.validationMessages.groupMember = 'Nie ma takiego użytkownika.';
            }
          } else {
            this.validationNotRequiredStates.groupMember = false;
            this.validationMessages.groupMember = 'Nie ma takiego użytkownika.';
          }
        });
      }
    },
    uploadLogo(e) {
      [this.groupLogo] = [e.target.files[0]];
      this.validationMessages.logo = '';
      this.validationNotRequiredStates.logo = true;

      const allowedExt = ['JPG', 'PNG'];
      const fileExt = this.groupLogo.name.split('.').pop().toUpperCase();
      const isCorrectExt = allowedExt.find((element) => element === fileExt);

      if (isCorrectExt === undefined) {
        this.validationNotRequiredStates.logo = false;
        this.validationMessages.logo += 'Tylko jpg i png';
      }

      if (this.groupLogo.size > 1024000) {
        this.validationNotRequiredStates.logo = false;
        this.validationMessages.logo += 'Maksymalny rozmiar logoa to 1 mb.';
      }
    },
    validationName() {
      this.validationRequiredStates.groupName = true;
      this.validationMessages.groupName = '';

      if (!/^[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9\s]{3,40}$/.test(this.groupName)) {
        this.validationRequiredStates.groupName = false;

        if (this.groupName.length < 3 || this.groupName.length > 40) {
          this.validationMessages.groupName += 'Długość od 3 do 40 znaków. ';
        }

        if (!/^[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9\s]*$/.test(this.groupName)) {
          this.validationMessages.groupName += 'Dozwolone litery i cyfry oraz spację ';
        }
      }
    },
    validationDescription() {
      this.validationNotRequiredStates.groupDescription = true;
      this.validationMessages.groupDescription = '';

      if (!this.groupDescription.length) {
        this.validationNotRequiredStates.groupDescription = null;
      } else if (!/^[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9,.!?()\-\s]{1,100}$/.test(this.groupDescription)) {
        this.validationNotRequiredStates.groupDescription = false;

        if (this.groupDescription.length > 100) {
          this.validationMessages.groupDescription += 'Maksymalna długość to 100 znaków. ';
        }

        if (!/^[a-zA-ZżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9,.!?()\-\s]+$/.test(this.groupDescription)) {
          this.validationMessages.groupDescription += 'Dozwolone litery, cyfry oraz spację, enter oraz ( - , ( ) ! ? )';
        }
      }
    },
    validationAll() {
      this.validationDescription();
      this.validationName();
    },
    addGroup() {
      this.validationAll();

      if (this.validationRequiredStates.groupName) {
        const groupData = new FormData();

        groupData.append('name', this.groupName);

        if (this.validationNotRequiredStates.groupDescription) {
          groupData.append('description', this.groupDescription);
        }

        if (this.groupLogo) {
          groupData.append('logo', this.groupLogo);
        }

        if (this.isEdit) {
          groupData.append('groupId', this.editedGroupId);

          this.loading = true;

          this.axios({
            method: 'post',
            url: '/group/edit/info',
            data: groupData,
            headers: { 'Content-Type': 'multipart/form-data' },
          }).then(() => {
            this.showMessage('Grupa została zaktualizowana', 'Edycja grupy', `/group/details/${this.editedGroupId}`);
            this.loading = false;
          }).catch((err) => {
            this.fetchErr(err);
            this.loading = false;
          });
        } else {
          if (this.groupMembers.length) {
            groupData.append('members', JSON.stringify(this.groupMembers));
          }

          this.loading = true;
          this.axios({
            method: 'post',
            url: '/group/add',
            data: groupData,
            headers: { 'Content-Type': 'multipart/form-data' },
          }).then(() => {
            this.showMessage('Grupa została dodana', 'Dodawanie grupy', '/groups');
            this.loading = false;
          }).catch((err) => {
            this.fetchErr(err);
            this.loading = false;
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#addGroupWrapper{
  background-color: #1C1919;
  color: #FFFFFF;
  h2{
    color:#148a14;
  }
}
</style>
