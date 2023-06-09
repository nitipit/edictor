import { Model } from './model';
import { defineField } from './field';

class DataTestResult extends Model {};

DataTestResult.define({
    valid: defineField()
        .instance('object'),
    invalid: defineField()
        .instance('object'),
    error: defineField()
        .instance('object'),
    errorMessage: defineField()
        .instance('string')
})

export { DataTestResult };