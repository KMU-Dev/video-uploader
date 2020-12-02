import { Mapper } from ".";
import { Moment } from "moment";

export class EnumMapper<T> implements Mapper<string, T> {
    async map(source: string): Promise<T> {
        return source as unknown as T;
    }
}

export class DateMapper implements Mapper<number, Date> {
    async map(source: number): Promise<Date> {
        return new Date(source);
    }
}

export class ArrayMapper<Child> implements Mapper<any[], Child[]> {
    private mapper: Mapper<any, Child>;

    constructor(mapper: Mapper<any, Child>) {
        this.mapper = mapper;
    }

    async map(source: any[]) {
        const target: Child[] = [];
        for (const field of source) target.push(await this.mapper.map(field));
        return target;
    }
}

export class MomentNumberMapper implements Mapper<Moment, number> {
    async map(source: Moment): Promise<number> {
        const minOffset = source.toDate().getTimezoneOffset();
        return +source.subtract(minOffset, "minutes");
    }
}