import BetweenFilter from './BetweenFilter.js';

export default class NotBetweenFilter extends BetweenFilter {

  test(value) {
    return !super.test(value);
  }

};
