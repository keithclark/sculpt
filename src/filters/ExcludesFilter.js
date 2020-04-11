import IncludesFilter from './IncludesFilter.js';

export default class ExcludesFilter extends IncludesFilter {

  test(value) {
    return !super.test(value);
  }

};
