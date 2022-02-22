export default {
  computed: {
    discardInfo() {
      const tempInfo = this.$store.getters.discardDetailsInfo;
      tempInfo.dateOfPayment = this.$dayjs(tempInfo.dateOfPayment).format('YYYY-MM-DD');
      return tempInfo;
    },
    userObligation() {
      return this.$store.getters.discardDetailsUserObligation;
    },
    payments() {
      return this.$store.getters.discardDetailsPayments;
    },
    permission() {
      return this.$store.getters.discardDetailsUserPermission;
    },
    allObligations() {
      return this.$store.getters.discardDetailsAllObligation;
    },
  },
};
