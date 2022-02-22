<template>
  <div id="bottomPanel" class="fixed-bottom d-flex mx-auto col-12 col-sm-10  col-md-9 col-lg-7
        pb-2">
    <b-modal id="modalFilter" size="xl" title="Filtrowanie" hide-footer>
      <slot></slot>
      <b-button id="buttonModal" class="col-3 mx-auto" block @click="$bvModal.hide('modalFilter')">
        Filtruj
      </b-button>
    </b-modal>
    <b-link class="mr-auto" v-b-modal.modalFilter>
      <b-icon-filter class="rounded m-2" font-scale="3">
      </b-icon-filter>
    </b-link>
    <b-link class="ml-auto" :to="link">
      <b-icon-plus class="rounded m-2" v-if="permissionAdd" to="/addGroup"
                   font-scale="3" rotate="90">
      </b-icon-plus>
    </b-link>
  </div>
</template>

<script>
export default {
  name: 'filterButtonsModal',
  props: {
    link: {
      type: String,
      required: true,
    },
    permissionAdd: {
      type: Boolean,
    },
  },
};
</script>

<style lang="scss">
#bottomPanel{
  z-index: 1;
  svg{
    background-color: #FFFFFF !important;
    color: #000;
  }
}
#modalFilter{
  .modal-content{
    background-color: #1c1919 !important;
    color: #ffffff;
  }
  .close{
    color: #ffffff !important;
    border: none;
  }
  header{
    button {
      background-color: #1c1919 !important;
    }
  }
  button {
    background-color: white !important;
  }
  #buttonModal{
    background-color: #148a14 !important;
    border: none;
  }
}
</style>
