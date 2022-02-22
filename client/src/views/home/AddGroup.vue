<template>
     <GroupForm :idEdit="false" />
</template>

<script>
import GroupForm from '@/components/GroupForm.vue';

export default {
  name: 'AddGroup',
  components: {
    GroupForm,
  },
};
</script>

<style lang="scss" scoped>

</style>
