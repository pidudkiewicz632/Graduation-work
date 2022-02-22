<template>
  <b-container class="notificationItem col-11 col-sm-7 col-md-5 col-lg-3 m-2">
    <div class="content row rounded align-items-center shadow col-12 p-2 mx-auto px-auto"
         :style="{backgroundColor:bgColor}">
      <div class="d-flex justify-content-around align-items-center">
        <b-icon :icon="icon" font-scale="2">
        </b-icon>
        <div class="col-10 my-1" @click="$emit('toDetails', link)">
          <div class="text-justify">
            {{notificationData.message}}
          </div>
          <div class="notificationDate text-right font-weight-bold">
            {{ notificationData.date }}
          </div>
        </div>
        <b-form-checkbox v-model="notificationData.checked">
        </b-form-checkbox>
      </div>
    </div>
  </b-container>
</template>

<script>
export default {
  name: 'NotificationsItem',
  props: {
    notificationData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      link: '',
      bgColor: '#148a14',
      notification: null,
      icon: '',
    };
  },
  created() {
    this.notificationData.date = this.$dayjs(this.notificationData.date).format('YYYY-MM-DD HH:mm:ss');
    this.bgColor = this.notificationData.read === true ? '#1C1919' : '#148a14';

    switch (this.notificationData.type) {
      case 'invite':
        this.link = '/invites';
        this.icon = 'person-plus';
        break;
      case 'groupInfo':
        this.link = `/group/details/${this.notificationData.idOfEvent}`;
        this.icon = 'people-fill';
        break;
      case 'newDiscard':
        this.link = `discard/details/0/${this.notificationData.idOfEvent}`;
        this.icon = 'cash-stack';
        break;
      case 'newGroupPayment':
        this.link = `discard/details/2/${this.notificationData.idOfEvent}`;
        this.icon = 'cash-stack';
        break;
      case 'newSinglePayment':
        this.link = `discard/single/details/${this.notificationData.idOfEvent}`;
        this.icon = 'cash';
        break;
      case 'changeSinglePaymentState':
        this.link = `discard/single/details/${this.notificationData.idOfEvent}`;
        this.icon = 'cash';
        break;
      case 'changeGroupPaymentState':
        this.link = `discard/details/0/${this.notificationData.idOfEvent}`;
        this.icon = 'cash';
        break;
      case 'modifedDiscardObligations':
        this.link = `discard/details/0/${this.notificationData.idOfEvent}`;
        this.icon = 'cash-stack';
        break;
      case 'modifedDiscardInfo':
        this.link = `discard/details/0/${this.notificationData.idOfEvent}`;
        this.icon = 'cash-stack';
        break;
      case 'modifedSingleDiscardInfo':
        this.link = `discard/single/details/${this.notificationData.idOfEvent}`;
        this.icon = 'cash-stack';
        break;
      case 'changeGroupInviteState':
        this.link = `/group/details/${this.notificationData.idOfEvent}`;
        this.icon = 'people-fill';
        break;
      case 'removedFromGroup':
        this.link = '/groups';
        this.icon = 'people-fill';
        break;
      default:
        this.link = null;
    }
  },
};
</script>

<style lang="scss" scoped>
.notificationItem{
  color: #ffffff;
  .content{
    height: 100%;
  }
  .btn{
    border: none;
  }
  .notificationDate{
    color: #FFFFFF;
    font-size: 0.8rem;
  }
}
</style>
