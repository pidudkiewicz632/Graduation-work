<template>
    <b-badge class="greenBadge d-flex justify-content-center align-items-center m-1 p-1">
      <b-avatar variant="light" :src="avatarLink"/>
      <div>
        <div class="font-weight-bold m-2">
          {{ memberInfo.idUser.login }}
        </div>
        <div>
          {{ permission }}
        </div>
      </div>
    </b-badge>
</template>

<script>
export default {
  name: 'GroupMembersItem',
  props: {
    memberInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      avatarLink: '',
    };
  },
  computed: {
    permission() {
      switch (this.memberInfo.permission) {
        case 'deleted':
          return 'usunięty';
        case 'owner':
          return 'właściciel';
        default:
          return this.memberInfo.permission;
      }
    },
  },
  mounted() {
    this.avatarLink = `${process.env.VUE_APP_API_BASE_URL}user/avatar/${this.memberInfo.idUser.id}`;
  },
};
</script>

<style lang="scss" scoped>

</style>
