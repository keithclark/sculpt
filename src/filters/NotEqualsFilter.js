import EqualsFilter from './EqualsFilter.js';

export default class NotEqualsFilter extends EqualsFilter {

  test(value) {
    return !super.test(value);
  }

};
