export type Condition = ValueCondition | DuoCondition | NotCondition;
export type ConditionValue = string | number | boolean;
export type ValueOperator = "<=" | ">=" | "===" | "!==" | "==" | "!=" | "<" | ">";
export type BoolOperator = "AND" | "OR";
export type Property = (string | ArrayProperty)[];
export type ArrayProperty = {
    type: 'array';
    property?: Property | undefined;
};
export type ValueCondition = {
    property: Property;
    operator: ValueOperator;
    value: ConditionValue;
};
export type DuoCondition = {
    property?: undefined;
    operator: BoolOperator;
    left: Condition;
    right: Condition;
};
export type NotCondition = {
    property?: undefined;
    operator?: undefined;
    not: Condition;
};
export declare function parse(input: string): Condition;
