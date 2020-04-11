import sculpt from '../src/sculpt.js';


describe('calling sculpt.decorate', () => {

  let testSculpt;

  beforeEach(() => {
    testSculpt = sculpt();
  });


  describe('with anything other than a class for the first argument', () => {
    it('should throw a TypeError', () => {
      expect(() => testSculpt.decorate()).toThrowError(TypeError);
      expect(() => testSculpt.decorate(0)).toThrowError(TypeError);
      expect(() => testSculpt.decorate(false)).toThrowError(TypeError);
      expect(() => testSculpt.decorate('')).toThrowError(TypeError);
      expect(() => testSculpt.decorate([])).toThrowError(TypeError);
      expect(() => testSculpt.decorate({})).toThrowError(TypeError);
      expect(() => testSculpt.decorate(null)).toThrowError(TypeError);
      expect(() => testSculpt.decorate(undefined)).toThrowError(TypeError);
    });
  });

  describe('with an object', () => {

    let Test;

    beforeEach(() => {
      Test = class {};
      testSculpt.model(Test, {});
      testSculpt.decorate(Test);
    })

    it('should add a save() method to the prototype', () => {
      expect(Test.prototype.save).toBeInstanceOf(Function);
    });

    it('should add a delete() method to the prototype', () => {
      expect(Test.prototype.delete).toBeInstanceOf(Function);
    });

    it('should add a find() static method', () => {
      expect(Test.find).toBeInstanceOf(Function);
    });

  });
})
