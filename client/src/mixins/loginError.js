export default {
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    showMessage(message, title, location) {
      this.$bvModal.msgBoxOk(message, {
        title,
        size: 'sm',
        buttonSize: 'sm',
        headerClass: 'p-2 border-bottom-0',
        footerClass: 'p-2 border-top-0',
        centered: true,
      })
        .then(() => {
          if (location === 'login') {
            window.location.href = 'login.html';
          } else if (location === '/settings') {
            window.location.href = '/settings';
          } else if (location) {
            this.$router.push(location);
          }
        });
    },
    fetchErr(err) {
      if (err.response) {
        if (err.response.status === 401) {
          this.$store.dispatch('loginOut')
            .then(() => {
              this.showMessage('Błąd autoryzacji! Zaloguj się ponownie.', 'Błąd', 'login');
            });
        } else if (err.response.status === 405) {
          this.$router.push('/home');
        } else if (err.response.status === 400) {
          this.showMessage(err.response.data.message, 'Błąd', '/');
        }
      } else {
        this.showMessage('Błąd serwera, proszę spróbować później.', 'Błąd', '/');
      }
    },
  },
};
