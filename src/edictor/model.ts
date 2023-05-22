import { Field, DefineField, FieldError } from './field';


export class ModelJsonError extends Error {
    name: string;
    message: string;
    constructor(message='') {
        super(message);
        this.name = 'ModelJsonError';
    }
};

export class DataError extends Error {
    name: string;
    message: string;
    constructor(message='') {
        super(message);
        this.name = 'DataError';
    }
}

export class DefineCallError extends Error {
    name: string;
    message: string;
    constructor(message='') {
        super(message);
        this.name = 'DefineCallError';
    }
}

export class DefineJsonError extends Error {
    name: string;
    message: string;
    constructor(message='') {
        super(message);
        this.name = 'DefineJsonError';
    }
};

export class UpdateError extends Error {
    name: string;
    message: string;
    constructor(message='') {
        super(message);
        this.name = 'UpdateError';
    }
};

interface ModelOption {
    strict?: boolean
}


export class Model {
    protected static _define = {};
    static _option: ModelOption = {strict: true};

    static define(model: Object = {}, option: ModelOption = {}) {
        const superClass = Object.getPrototypeOf(this);
        this._option = {...superClass._option, ...option};
        this._define = {...superClass._define};

        if (superClass.name === '') {
            throw new DefineCallError(`Model.define() is prohibited. `
            + `It must be called from a subclass`);
        }

        const errorMessage = {
            info: '',
            field: {}
        };

        for (let [key, defineField] of Object.entries(model)) {

            /** Get Field() instance if value is DefineField() */
            let field: Field;

            if (defineField instanceof DefineField) {
                field = defineField.field();
                if (field.name === undefined) { field.name = key };
            } else {
                errorMessage['field'][key] = 'Assigned value is not an instance of DefineField'
                continue;
            }
            if (field.option.initial !== undefined) {
                try {
                    field.validate(field.option.initial);
                } catch (e) {
                    errorMessage['field'][key] = `Field({initial: ${field.option.initial}})`
                    + ` conflicts with Field's validation => ${e}`
                }
            }
            model[key] = field;
        }
        if (Object.keys(errorMessage['field']).length > 0) {
            errorMessage['info'] = `${this.name}.define()`;
            throw new DefineJsonError(JSON.stringify(errorMessage));
        }
        this._define = {...this._define, ...model};
    }

    static get field() {
        return {...this._define};
    }

    protected _option: ModelOption;

    constructor(data: Object = {}, option: ModelOption = {}) {
        if (data instanceof Array) {
            throw new DataError(`new ${this.constructor.name}(data) => `
            + `data must be an instance of object. Received Array`);
        }
        if (!(data instanceof Object)) {
            throw new DataError(`new ${this.constructor.name}(data) => `
            + `data must be an instance of object, Received ${typeof(data)}`);
        }

        /** Isolate recevied data */
        data = {...data};
        const _class = this.constructor as typeof Model;
        this._option = {..._class._option, ...option};

        /** Setup Proxy */
        const proxy = new Proxy(this, {
            get: (target, key: PropertyKey, receiver): any => {
                return Reflect.get(target, key, receiver);
            },
            set: (target, key: string, value: any): boolean => {
                const field = _class.field[key] as Field;
                /** Check undefined field with Model._option.strict */
                if (field === undefined) {
                    if (this._option.strict) {
                        throw new FieldError(`${this.constructor.name}()["${key}"] is not defined`);
                    } else {
                        target[key] = value;
                        return true;
                    }
                }
                /** Validate value => Throw FieldError is invalid */
                value = field.validate(value);
                if (value === undefined) {
                    return Reflect.deleteProperty(target, key);
                }
                return Reflect.set(target, key, value);
            },
            deleteProperty: (target, key): boolean => {
                const _class = target.constructor as typeof Model;
                const field = _class._define[key] as Field;
                if (field) { field.validate(undefined)};
                return Reflect.deleteProperty(target, key);
            },
            ownKeys(target) {
                /** Remove protected _option */
                return Object.keys(target)
                    .filter(item => item != '_option');
            }
        });

        const errorMessage = {
            info: "",
            field: {}
        };

        /** Iterate defined field to validate and assign data.
         * - Also delete data[key] after assigned.
        */
        for (const key in _class._define) {
            if (data[key] === undefined) {
                proxy[key] = _class._define[key].option.initial;
                continue;
            }
            try {
                proxy[key] = data[key];
            } catch (e) {
                errorMessage['field'][key] = e.message;
            }
            delete data[key];
        }
        
        if (Object.keys(errorMessage["field"]).length > 0) {
            errorMessage['info'] = `new ${this.constructor.name}(data)`;
            throw new ModelJsonError(JSON.stringify(errorMessage));
        }

         /** If there's no data left, return proxy */
        if (Object.keys(data).length === 0) {
            return proxy;
        }

        /** Program reach here if there's some data left */
        
        /** If Model is stricted, throw ModelJsonError */
        if (this._option.strict) {
            for (const key of Object.keys(data)) {
                errorMessage['field'][key] = `Field is not defined`
            }
            if (Object.keys(errorMessage["field"]).length > 0) {
                errorMessage["info"] = `new ${this.constructor.name}(data)`
                throw new ModelJsonError(JSON.stringify(errorMessage));
            }
        }

        /** Model is not stricted. Assign data to Model() */
        Object.assign(proxy, data);
        return proxy;
    }

    /** Return a new native object with same data */
    object(): Object {
        return JSON.parse(JSON.stringify(this));
    }

    /** Return JSON */
    json(): string {
        return JSON.stringify(this);
    }

    update(data: Object): void {
        const class_ = this.constructor as typeof Model;
        try {
            new class_({ ...this.object(), ...data });
        } catch (e) {
            throw new UpdateError(JSON.stringify({
                info: `${this.constructor.name}().update(data)\n`,
                field: e.message["field"]
            }));
        }
        for (const key in data) {
            this[key] = data[key];
        }
    }
}