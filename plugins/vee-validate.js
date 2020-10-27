import Vue from 'vue';
import VeeValidate from 'vee-validate';
import {
  Validator
} from 'vee-validate';


const dict = {
  custom: {
    postal_code: {
      regex: 'Please enter postal code in Z9Z Z9Z'
    }
  }
};

Validator.localize('en', dict);
Vue.use(VeeValidate);
Vue.config.debug = true;
