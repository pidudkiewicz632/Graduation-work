export default {
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  methods: {
    perPageChange() {
      this.currentPage = 1;
    },
  },
  computed: {
    selectedItems() {
      const end = this.currentPage * this.itemsPerPage;
      const start = end - this.itemsPerPage;

      return this.filtredItems.slice(start, end);
    },
    numberOfItems() {
      return this.filtredItems.length;
    },
  },
};
