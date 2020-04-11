import sculpt from '../src/sculpt.js';
import SculptError from '../src/objects/SculptError.js';
import Provider from '../src/objects/Provider.js';
import {identity} from '../src/bindings.js';



class TestProvider extends Provider {
  async find() {
    return Promise.resolve([])
  }
  async create(){}
}



class TestClass {

}

describe('calling sculpt.commit', () => {


  let testSculpt;

  beforeEach(() => {
    testSculpt = sculpt();
  });

  describe('with an unregistered model', () => {
    it('should reject', async() => {
      let result = testSculpt.commit(new TestClass());
      await expectAsync(result).toBeRejectedWith(new SculptError("No model for type 'TestClass'"))
    });
  });


  describe('without a provider', () => {
    it('should reject', async() => {
      testSculpt.model(TestClass, {});
      let result = testSculpt.commit(new TestClass());
      await expectAsync(result).toBeRejectedWith(new SculptError("Model 'TestClass' doesn't have a provider"))
    });
  });


  describe('with a registered model and provider', () => {

    describe('for a model without an identity', () => {
      it('should reject', async() => {
        testSculpt.model(TestClass, {});
        testSculpt.provider(new TestProvider(), TestClass);
        let result = testSculpt.commit(new TestClass());
        await expectAsync(result).toBeRejectedWith(new SculptError('An identity binding is required to commit'))
      });
    });


    describe('a model with an identity', () => {
      beforeEach(() => {
        testSculpt.model(TestClass, {
          id: identity()
        });
        testSculpt.provider(new TestProvider(), TestClass);
      });

      it('should reject if a new instance has a pre-set identity', async() => {
        let testInstance = new TestClass();
        testInstance.id = 9999;
        await expectAsync(testSculpt.commit(testInstance)).toBeRejectedWith(new SculptError('Identity binding values cannot be set externally'))
      });

      it('should reject if an existing instance has a modified identity', async() => {
        let testInstance = new TestClass();
        await testSculpt.commit(testInstance);
        testInstance.id = 9999;
        await expectAsync(testSculpt.commit(testInstance)).toBeRejectedWith(new SculptError('Identity binding values cannot be set externally'))
      });
    });
  });

});

