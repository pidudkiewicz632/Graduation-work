<template>
  <div class="stepThreeAddMembersWrapper text-white">
    <h4 class="mt-3">Dodawanie użytkowników</h4>
    <div class="col-10 col-sm-6 col-xl-5 mx-auto my-4">
      <b-form-group
        class="text-justify"
        label-align="center"
        label="Wybierz użytkowników">
        <b-form-checkbox-group
          v-model="addDiscardMembers"
          value-field="id"
          text-field="login"
          :options="membersOptions"
          @input="validateMembers"
        ></b-form-checkbox-group>
        <b-form-checkbox
          class="greenText"
          value="true"
          unchecked-value="false"
          @change="selectAll($event)">
            wszyscy
        </b-form-checkbox>
      </b-form-group>
      <b-form-invalid-feedback :state="validationMembersState">
          Wybierz co najmniej jednego
      </b-form-invalid-feedback>
    </div>
    <b-button class="btnGreen mr-1" @click="nextStep">Dalej</b-button>
    <b-button class="btnGreen ml-1" @click="$emit('prevStep')">Wstecz</b-button>
  </div>
</template>

<script>
export default {
  name: 'StepThreeAddMembers',
  props: {
    members: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      membersOptions: [],
      validationMembersState: null,
    };
  },
  computed: {
    addDiscardMembers: {
      get() {
        return this.$store.getters.addDiscardMembers;
      },
      set(value) {
        this.$store.commit('addDiscardMembers', value);
      },
    },
  },
  methods: {
    nextStep() {
      this.validateMembers();
      if (this.validationMembersState) {
        this.$emit('nextStep');
      }
    },
    selectAll(value) {
      this.addDiscardMembers = value === 'true' ? this.members : [];
    },
    validateMembers() {
      this.validationMembersState = this.addDiscardMembers.length !== 0;
    },
  },
  created() {
    this.membersOptions = this.members.map((element) => ({
      id: element,
      login: element.login,
    }));

    if (this.addDiscardMembers) {
      this.addDiscardMembers = this.addDiscardMembers.map((element) => ({
        id: element.id,
        login: element.login,
      }));
    }
  },
};
</script>

<style scoped>

</style>
