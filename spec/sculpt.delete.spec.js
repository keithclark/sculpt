import sculpt from '../src/sculpt.js';
import Provider from '../src/objects/Provider.js';
import {identity} from '../src/bindings.js';



class TestProvider extends Provider {
  async find() {
    return Promise.resolve([])
  }
  async create(){}
}


class TestClass {}





describe('calling sculpt.delete', () => {

  let testSculpt;

  beforeEach(() => {
    testSculpt = sculpt();
  });

  describe('with an unregistered model', () => {
    it('should reject', async() => {
      let result = testSculpt.delete(new TestClass());
      await expectAsync(result).toBeRejectedWith(new Error("No model for type 'TestClass'"))
    });
  });

  describe('with a registered model', () => {

    beforeEach(() =>{
      testSculpt.model(TestClass, {id: identity()});
    });

    describe('without a provider', () => {
      it('should reject', async() => {
        let result = testSculpt.delete(new TestClass());
        await expectAsync(result).toBeRejectedWith(new Error("Model 'TestClass' doesn't have a provider"))
      });
    });

    describe('with a provider', () => {

      beforeEach(() =>{
        testSculpt.provider(new TestProvider(), TestClass);
      });

      it('should work', async() => {
        let result = testSculpt.delete(new TestClass());
        await expectAsync(result).toBeResolvedTo(false);
      });
    })
  });

});

