export default {
  computed: {
    userPermission: {
      get() {
        return this.$store.getters.groupInfoPermission;
      },
      set(value) {
        this.$store.commit('groupInfoPermission', value);
      },
    },
    groupDetails: {
      get() {
        return this.$store.getters.groupInfoDetails;
      },
      set(value) {
        this.$store.commit('groupInfoDetails', value);
      },
    },
    groupMembers: {
      get() {
        return this.$store.getters.groupInfoMembers;
      },
      set(value) {
        this.$store.commit('groupInfoMembers', value);
      },
    },
    groupDiscards: {
      get() {
        return this.$store.getters.groupInfoDiscards;
      },
      set(value) {
        this.$store.commit('groupInfoDiscards', value);
      },
    },
  },
};
