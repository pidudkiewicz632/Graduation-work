<template>
  <GroupForm :edited-group-id="groupId" :is-edit="true" />
</template>

<script>
import GroupForm from '@/components/GroupForm.vue';

export default {
  name: 'EditGroup',
  components: {
    GroupForm,
  },
  props: ['groupId'],
};
</script>

<style lang="scss" scoped>

</style>
