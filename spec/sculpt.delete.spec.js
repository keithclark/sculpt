const sculpt = require('../sculpt');
const {identity} = require('../bindings');


const nullProvider = () => ({
  delete: () => 1
});


class TestClass {}





xdescribe('calling sculpt.delete', () => {

  let testSculpt;

  beforeEach(() => {
    testSculpt = sculpt();
  });


  describe('with an unregistered model', () => {
    it('should reject', async() => {
      let result = testSculpt.delete(new TestClass());
      await expectAsync(result).toBeRejectedWith(new Error('No model'))
    });
  });


  describe('without a provider', () => {
    it('should reject', async() => {
      testSculpt.model(TestClass, {});
      let result = testSculpt.delete(new TestClass());
      await expectAsync(result).toBeRejectedWith(new Error('No provider'))
    });
  });

});

