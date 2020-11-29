import { Provider } from "./types";

export interface Mapper<K, V> {
    map: (source: K) => V
}

type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

export class ModelMapper<K, V> implements Mapper<K, V> {

    private mappers: Record<keyof K, Mapper<any, any>> = {} as Record<keyof K, Mapper<any, any>>;
    private excludeFieldNames: (keyof K)[] = [];
    private additionalFields: Record<keyof V, Provider<any, any>> = {} as Record<keyof V, Provider<any, any>>;

    public addField<T extends keyof V>(fieldName: T, provider: Provider<K, PropType<V, T>>) {
        this.additionalFields[fieldName] = provider;
        return this as ModelMapper<K, V>;
    }

    public excludeFields(...fieldNames: (keyof K)[]) {
        this.excludeFieldNames.push(...fieldNames);
        return this as ModelMapper<K, V>;
    }

    public addMapper<S extends keyof K & keyof V>(fieldName: S, mapper: Mapper<PropType<K, S>, PropType<V, S>>) {
        this.mappers[fieldName] = mapper;
        return this as ModelMapper<K, V>;
    }

    public map(source: K): V {
        const target: Record<string, any> = {};
        for (const key in source) {
            if (this.excludeFieldNames.includes(key)) continue;

            if (!(key in this.mappers)) target[key] = source[key];
            else {
                const mapper = this.mappers[key];
                const newField = mapper.map(source[key]);
                target[key] = newField;
            }
        }

        for (const key in this.additionalFields) target[key] = this.additionalFields[key](source);

        return target as V;
    }
}