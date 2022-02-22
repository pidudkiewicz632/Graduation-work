<template>
  <b-container class="groupItem col-11 col-sm-7 col-md-5 col-lg-3 m-2 p-2
  row rounded align-items-center shadow justify-content-between"
               @click="$emit('toDetails', groupDataProp.id)">
                 <b-avatar variant="light" :src="groupData.logo"/>
                 <div class="col-8">
                      {{groupData.name}}
                 </div>
                 <b-icon-triangle-fill font-scale="1" rotate="90">
                           </b-icon-triangle-fill>
  </b-container>
</template>

<script>
export default {
  name: 'GroupItem',
  props: {
    groupDataProp: {
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
    this.groupData = this.groupDataProp;
    this.groupData.logo = `${process.env.VUE_APP_API_BASE_URL}group/logo/${this.groupData.id}`;
  },
};
</script>

<style lang="scss" >
.groupItem{
     background-color: #148a14;
     color: #ffffff;
}
</style>
