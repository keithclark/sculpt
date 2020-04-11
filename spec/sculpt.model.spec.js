import sculpt from '../src/sculpt.js';

class TestClass {}

describe('calling sculpt.model', () => {

  let testSculpt;

  beforeEach(() => {
    testSculpt = sculpt();
  });


  describe('with anything other than a class for the first argument', () => {
    it('should throw a TypeError', () => {
      expect(() => testSculpt.model()).toThrowError(TypeError);
      expect(() => testSculpt.model(0)).toThrowError(TypeError);
      expect(() => testSculpt.model(false)).toThrowError(TypeError);
      expect(() => testSculpt.model('')).toThrowError(TypeError);
      expect(() => testSculpt.model([])).toThrowError(TypeError);
      expect(() => testSculpt.model({})).toThrowError(TypeError);
      expect(() => testSculpt.model(null)).toThrowError(TypeError);
      expect(() => testSculpt.model(undefined)).toThrowError(TypeError);
    });
  });

  describe('with anything other than an object for the second argument', () => {
    it('should throw a TypeError', () => {
      expect(() => testSculpt.model(TestClass)).toThrowError(TypeError);
      expect(() => testSculpt.model(TestClass, 0)).toThrowError(TypeError);
      expect(() => testSculpt.model(TestClass, false)).toThrowError(TypeError);
      expect(() => testSculpt.model(TestClass, '')).toThrowError(TypeError);
      expect(() => testSculpt.model(TestClass, [])).toThrowError(TypeError);
      expect(() => testSculpt.model(TestClass, null)).toThrowError(TypeError);
      expect(() => testSculpt.model(TestClass, undefined)).toThrowError(TypeError);
      expect(() => testSculpt.model(TestClass, ()=>{})).toThrowError(TypeError);
    });
  });


  describe('with a valid class and bindings', () => {
    it('should successfully register it', () => {
      expect(() => testSculpt.model(TestClass, {})).not.toThrow()
    });
  });

});
