<template>
  <b-form-row class="row align-items-center justify-content-center">
    <b-form-group v-if="label" class="align-items-center ml-1" :label="label"
                  label-cols-md="3"
                  :state="validateStatus"
                  label-size="sm">
      <b-input :value="value"
               class="col-10"
               size="sm"
               type="number"
               :state="validateStatus"
               step="any"
               :min="min"
               :max="max"
               @keypress="key($event)"
               @change="formatPrice">
      </b-input>
    </b-form-group>
    <b-input v-else
             :value="value"
             class="col-12"
             size="sm"
             type="number"
             :state="validateStatusProp"
             step="any"
             :min="min"
             :max="max"
             @keypress="key($event)"
             @change="formatPrice">
    </b-input>
  </b-form-row>
</template>

<script>
export default {
  name: 'PriceInput',
  props: {
    validateStatusProp: Boolean,
    label: String,
    min: Number,
    max: Number,
    value: Number,
  },
  data() {
    return {
      minVal: null,
      maxVal: null,
      validateStatus: null,
    };
  },
  methods: {
    key(e) {
      const code = e.keyCode;

      if (code === 45 || code === 43 || code === 101) {
        e.preventDefault();
      }
    },
    formatPrice(val) {
      let value = val.toString().replace(',', '.');
      value = parseFloat(value.replace(/[^\d.]/g, '')).toFixed(2);

      // eslint-disable-next-line no-restricted-globals
      if (isNaN(value)) {
        value = '0';
      }

      value = Number(value);

      this.$emit('input', value);
    },
  },
  created() {
    this.validateStatus = this.validateStatusProp;
  },
};
</script>

<style scoped>

</style>
