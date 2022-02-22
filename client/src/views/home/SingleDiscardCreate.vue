<template>
<b-container id="singleDiscardCreateWrapper"
  class="shadow mx-auto col-11 col-lg-8 col-xl-5 p-0 p-3">
  <SingleDiscardForm :is-edit="false"/>
</b-container>
</template>

<script>
import SingleDiscardForm from '@/components/SingleDiscardForm.vue';

export default {
  name: 'SingleDiscardCreate',
  components: {
    SingleDiscardForm,
  },
};
</script>

<style scoped>
#singleDiscardCreateWrapper {
  color: white;
  background-color: #1C1919;
}
</style>
