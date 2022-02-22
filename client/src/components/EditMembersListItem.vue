<template>
    <b-badge class="memberItemWrapper greenBadge rounded col-12 px-1 my-1">
      <b-row class="align-items-center">
        <b-col class="m-0">
          <div class="d-flex justify-content-start align-items-center">
            <b-avatar class="mr-1 bv-d-sm-down-none" variant="light" :src="avatarLink"/>
            <div class="font-weight-bold">
              {{ memberInfo.idUser.login }}
            </div>
          </div>
        </b-col>
        <b-col class="col-3 m-0">
          <b-form-select v-show="showSelect"
                         v-model="selectedPermission"
                         size="sm"
                         :options="memberOptions"
                         @change="$emit('changePermission',
                       memberInfo.idUser.id, selectedPermission)">
          </b-form-select>
          <b-button class="bg-light text-black-50"
                    v-show="memberInfo.permission === 'deleted'"
                    @click="restore"
                    size="sm">
            Przywróć
          </b-button>
        </b-col>
        <b-col class="col-2 m-0"
               @click="$emit('remove',memberInfo.idUser.id)">
          <b-icon-x class="text-white"
                    font-scale="2">
          </b-icon-x>
        </b-col>
      </b-row>
    </b-badge>
</template>

<script>
export default {
  name: 'EditMembersListItem',
  props: {
    memberInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      avatarLink: '',
      memberOptions: [
        {
          value: 'member',
          text: 'członek',
        },
        {
          value: 'admin',
          text: 'administrator',
        },
      ],
      selectedPermission: this.memberInfo.permission,
    };
  },
  computed: {
    showSelect() {
      return this.memberInfo.permission !== 'pending' && this.memberInfo.permission !== 'deleted';
    },
  },
  methods: {
    restore() {
      this.$emit('restore', this.memberInfo.idUser.id);
      this.selectedPermission = this.memberInfo.permission;
    },
  },
  mounted() {
    this.avatarLink = `${process.env.VUE_APP_API_BASE_URL}user/avatar/${this.memberInfo.idUser.id}`;
  },
};
</script>

<style lang="scss" scoped>
select{
  font-size: 0.8rem;
}
</style>
