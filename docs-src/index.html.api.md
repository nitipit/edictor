<h2 class="width-100" style="text-align: center;">
    APIs to help, not to mess things up.
</h2>

No overwhelming APIs, the APIs are simple, easy to use.
It's designed to enhance javascript expressions and statements
to validate any kind of javascript object/data.

<el-title-code>typescript</el-title-code>
```ts
declare class DefineField {
    constructor(option = {required: false, grant: [], initial: undefined});
    instance(...types); // Validate data instance to be one of provided types.
    regexp(regexp_); // Validate data with regular expression.
    assert(func, msg); // Validate with function to be true or false.
    apply(func); // Validate data by using function and set value to returned data.
    arrayOf(...validators); // Validate array data.
    model(model_class); // Validate nested data.
}
```