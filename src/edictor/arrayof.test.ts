import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    ArrayOf,
    SetValueError,
    PushError,
    SetError,
    ValidationError
} from './arrayof';
import { AssertError, assert } from './util';


describe('Usage', () => {
    test('Normal Usage', () => {
        let array = new ArrayOf('string', 'number');
        array.set('0', 1);
        try {
            array.set(true, 1, true);
        } catch (error) { // Error at index: 0,2
            // console.error(error.errorInfo);
            expect(Object.keys(error.errorInfo)).toEqual(['0', '2']);
        }

        // High order array
        array = new ArrayOf(['string', 'number'], 'boolean');
        array.set([0, 1, '2'], false, true);

        try {
            array.set(true, [0, 1, false]);
        } catch (error) {
            // console.error(error.errorInfo);
            expect(Object.keys(error.errorInfo)).toEqual(['1']);
        }
    });

    test('High order constrains', () => {
        let array = new ArrayOf(['string', 'number'], 'boolean');
        array.set(['0', 1], [0, '1'], true);
        try {
            array.set('0', [true, false]);
        } catch (error) {
            expect(error).toBeInstanceOf(SetError);
        }
    })
})

describe('class ArrayOf', () => {
    let validators: any;
    let array: ArrayOf;

    beforeEach(() => {
        validators = ['string', 'number'];
        array = new ArrayOf(...validators);
    })

    test('new ArrayOf()', () => {
        expect(array).toBeInstanceOf(ArrayOf)
        array[0] = 'test string';
        try {
            array[1] = true;
        } catch (error) {
            expect(error).toBeInstanceOf(SetValueError);
        }
        
    })

    test('ArrayOf()._validate()', () => {
        let validator: any = ['string', 'boolean'];
        array = new ArrayOf();
        array._validate([true, 'a'], validator);
        expect(() => array._validate([1, 'a'], validator)).toThrow(SetError);

        validator = (value) => { assert(value <= 100) };
        array._validate(100, validator);

        class Test {};
        const test = new Test();
        validator = Array;
        array._validate(test, Test);
        expect(() => array._validate('a', Test)).toThrow(AssertError);
    })

    test('ArrayOf()._validate_value_with_validators()', () => {
        array = new ArrayOf();
        array._validate_value_with_validators(1, []);
        expect(() => {
            array._validate_value_with_validators(true, ['string', 'number'])
        }).toThrow(ValidationError);
    })

    test('ArrayOf().validators', () => {
        expect(array.validators).toEqual(validators);
    })

    test('ArrayOf().validators_to_string()', () => {
        let validators_: any = array.validators_to_string();
        validators_ = validators_.replaceAll('"', '').split(',');
        expect(validators_).toEqual(validators);
    })

    test('ArrayOf().validator_to_string()', () => {
        let validator = ['string', 'boolean'];
        array = new ArrayOf();

        /** validator is an Array */
        let validator_ = array.validator_to_string(validator);
        validator_ = JSON.parse(validator_);
        expect(validator_).toEqual(validator);

        /** validator is a function */
        let less_or_eq_100 = (value) => {
            assert(value <= 100, "value must be <= 100")
        }
        expect(array.validator_to_string(less_or_eq_100))
            .toEqual(`${less_or_eq_100.name}()`);

        /** validator is a class*/
        class Package {}
        expect(array.validator_to_string(Package))
            .toEqual(Package.name);

    })

    test('ArrayOf().test()', () => {
        array = new ArrayOf(['string', 'number']);
    })

    test('ArrayOf().set()', () => {
        array.set(1,2);
        try {
            array.set(true);
        } catch (error) {
            expect(error).toBeInstanceOf(SetError);
        }
    })

    test('ArrayOf().push()', () => {
        array.push(1,2);
        try {
            array.push(true);
        } catch (error) {
            expect(error).toBeInstanceOf(PushError);
        }
    })
    
    test('ArrayOf().object()', () => {
        const values = ['a', 'b', 0, 1];
        array = new ArrayOf('string', 'number');
        array.set(...values);

        expect(array.object()).toEqual(values);
    
        /** Return plain Array */
        expect(array.object()).not.toBeInstanceOf(ArrayOf);
        expect(array.object()).toBeInstanceOf(Array);
    });

    test('ArrayOf().json()', () => {
        expect(JSON.parse(array.json())).toEqual(array);
    });
})