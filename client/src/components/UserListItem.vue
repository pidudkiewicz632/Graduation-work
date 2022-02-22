<template>
<div class="userItemWrapper m-1 rounded">
  <b-badge class="greenBadge">
    {{ this.userData.name }}
    <b-icon-x @click="$emit('remove',userData.idUser)"></b-icon-x>
  </b-badge>
</div>
</template>

<script>
export default {
  name: 'UserListItem',
  props: {
    userDataProp: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      groupData: null,
    };
  },
  created() {
    this.userData = this.userDataProp;
  },
};
</script>

<style lang="scss">
.userItemWrapper{
    background-color: #148a14;
    color: #ffffff;
  .greenBadge{
    font-size: 1.1rem;
  }
}
</style>
