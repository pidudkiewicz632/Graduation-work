<template>
  <b-container class="inviteItem col-11 col-sm-7 col-md-5 col-lg-3 m-2">
    <div class="content row rounded justify-content-between align-items-center
    shadow col-12 p-2 mx-auto px-auto"
         @click="more">
        <b-icon-person-plus font-scale="2">
        </b-icon-person-plus>
        <div>
          {{inviteData.group.name}}
        </div>
        <b-icon-triangle-fill font-scale="1" :rotate="degrees">
        </b-icon-triangle-fill>
      <div v-if="showMore" class="col-12 mt-2">
        <b-button class="shadow mr-1" @click="acceptInvite(true)">Akceptuj</b-button>
        <b-button class="shadow ml-1" @click="acceptInvite(false)">Odrzuć</b-button>
      </div>
    </div>
  </b-container>
</template>

<script>
export default {
  name: 'InviteItem',
  props: {
    inviteDataDataProp: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      inviteData: null,
      showMore: false,
      degrees: 180,
    };
  },
  methods: {
    more() {
      this.showMore = !this.showMore;
      this.degrees = this.degrees === 180 ? 0 : 180;
    },
    acceptInvite(accepted) {
      const inviteData = new FormData();

      inviteData.append('isAccepted', accepted);
      inviteData.append('idGroup', this.inviteData.idGroup);

      this.axios.post('/group/invite', inviteData)
        .then(() => {
          const message = accepted ? 'Zaproszenie zostało zakceptowane' : 'Zaproszenie zostało odrzucone';
          this.$emit('modalMessage', [message, this.inviteData.id]);
        })
        .catch((err) => {
          this.$emit('modalMessage', ['', this.inviteData.id, err.response.status]);
        });
    },
  },
  created() {
    this.inviteData = this.inviteDataDataProp;
    this.inviteData.date = this.$dayjs(this.inviteData.date).format('YYYY-MM-DD HH:mm:ss');
  },
};
</script>

<style lang="scss" scoped>
.inviteItem{
  color: #ffffff;
  .content{
    background-color: #148a14 !important;
  }
  .btn{
    background-color: #1C1919 !important;
    border: none;
  }
  .notificationDate{
    color: #1C1919;
    font-size: 0.8rem;
  }
}
</style>
