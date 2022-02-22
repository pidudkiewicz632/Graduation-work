<template>
  <b-container id="emailConfirmationdWrapper"
               class="shadow mx-auto col-11 col-sm-8 darkBg col-md-7 col-lg-5 col-xl-4 p-3">
    <h2 class="mb-3 greenText">
      {{ title }}
    </h2>
    <div>
      {{message}}
    </div>
    <b-button class="btnGreen mt-2" @click="toHomePage"> Strona Główna</b-button>
  </b-container>
</template>

<script>
export default {
  name: 'EmailConfirmation',
  props: {
    message: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  methods: {
    toHomePage() {
      this.$router.push({ path: '/login' });
    },
  },
};
</script>

<style scoped>
#emailConfirmationdWrapper{
  color: white;
  background-color: #1C1919;
}
</style>
