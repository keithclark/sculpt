import sculpt from '../src/sculpt.js';
import Provider from '../src/objects/Provider.js';

class TestClass {

}

class TestProvider extends Provider {
  async find() {
    return Promise.resolve([])
  }
}

describe('calling sculpt.provider', () => {

  let testSculpt;

  beforeEach(() => {
    testSculpt = sculpt();
  });

  describe('with an invalid type for the first argument', () => {
    it('should throw a TypeError', () => {
      expect(() => testSculpt.provider()).toThrowError(TypeError);
      expect(() => testSculpt.provider(0)).toThrowError(TypeError);
      expect(() => testSculpt.provider(false)).toThrowError(TypeError);
      expect(() => testSculpt.provider('')).toThrowError(TypeError);
      expect(() => testSculpt.provider([])).toThrowError(TypeError);
      expect(() => testSculpt.provider({})).toThrowError(TypeError);
      expect(() => testSculpt.provider(undefined)).toThrowError(TypeError);
      expect(() => testSculpt.provider(class{})).toThrowError(TypeError);
    });
  });

  describe('using a valid first argument', () => {

    let provider;

    beforeEach(() => {
      provider = new TestProvider();
      testSculpt.model(TestClass, {});
      testSculpt.provider(provider, TestClass);
    });


    describe('with a `Provider` instance', () => {
      it('should set the provider', async () => {
        let spy = spyOn(provider, 'find').and.callThrough();
        await testSculpt.find(TestClass);
        expect(spy).toHaveBeenCalled();
      });
    });

    describe('with `null`', () => {
      it('should remove the provider', async () => {
        testSculpt.provider(null, TestClass);
        await expectAsync(testSculpt.find(TestClass)).toBeRejectedWithError("Model 'TestClass' doesn't have a provider")
      })
    });
  });

});
