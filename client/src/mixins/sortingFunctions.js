export default {
  methods: {
    sortingAsc(left, right) {
      if (left < right) { return -1; }
      if (left > right) { return 1; }
      return 0;
    },
    sortingDsc(left, right) {
      if (left < right) { return 1; }
      if (left > right) { return -1; }
      return 0;
    },
  },
};
