const sculpt = require('../sculpt');
const {identity} = require('../bindings');


const nullProvider = () => ({
  create: () => 1
});


class TestClass {

}

xdescribe('calling sculpt.commit', () => {


  let testSculpt;

  beforeEach(() => {
    testSculpt = sculpt();
  });

  describe('with an unregistered model', () => {
    it('should reject', async() => {
      let result = testSculpt.commit(new TestClass());
      await expectAsync(result).toBeRejectedWith(new Error('No model'))
    });
  });


  describe('without a provider', () => {
    it('should reject', async() => {
      testSculpt.model(TestClass, {});
      let result = testSculpt.commit(new TestClass());
      await expectAsync(result).toBeRejectedWith(new Error('No provider'))
    });
  });


  describe('with a registered model and provider', () => {
    beforeEach(() => testSculpt.provider(nullProvider()))


    describe('for a model without an identity', () => {
      beforeEach(() => {
        testSculpt.model(TestClass, {});
      });

      it('should reject', async() => {
        let result = testSculpt.commit(new TestClass());
        await expectAsync(result).toBeRejectedWith(new Error('An identity binding is required to commit'))
      });
    });


    describe('a model with an identity', () => {
      beforeEach(() => {
        testSculpt.model(TestClass, {
          id: identity()
        });
      });

      it('should reject if a new instance has a pre-set identity', async() => {
        let testInstance = new TestClass();
        testInstance.id = 9999;
        await expectAsync(testSculpt.commit(testInstance)).toBeRejectedWith(new Error('Identity binding values cannot be set externally'))
      });

      it('should reject if an existing instance has a modified identity', async() => {
        let testInstance = new TestClass();
        await testSculpt.commit(testInstance);
        testInstance.id = 9999;
        await expectAsync(testSculpt.commit(testInstance)).toBeRejectedWith(new Error('Identity binding values cannot be set externally'))
      });
    });
  });

});

