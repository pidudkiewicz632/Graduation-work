<template>
  <b-container id="singleDiscardEditWrapper"
               class="shadow mx-auto col-11 col-lg-8 col-xl-5 p-0 p-3">
    <SingleDiscardForm :discard-id="discardId" :is-edit="true"/>
  </b-container>
</template>

<script>
import SingleDiscardForm from '@/components/SingleDiscardForm.vue';

export default {
  name: 'SingleDiscardEdit',
  props: ['discardId'],
  components: {
    SingleDiscardForm,
  },
};
</script>

<style scoped>
#singleDiscardEditWrapper{
  color: white;
  background-color: #1C1919;
}
</style>
