export type Condition = TruthyCondition | ValueCondition | DuoCondition | NotCondition;
export type ConditionValue = string | number | boolean;

export type BasicValueOperator = '===' | '!==' | '==' | '!=';
export type NumericValueOperator = '<=' | '>=' | '<' | '>';
export type ValueOperator = BasicValueOperator | NumericValueOperator;
export type BoolOperator = 'AND' | 'OR';
export type Property = (string | ArrayProperty)[];
export type ArrayProperty = {
  type: 'array';
  property?: Property | undefined;
};
export type TruthyCondition = {
  property: Property;
  operator?: undefined;
  value?: undefined;
};
export type BasicValueCondition = {
  property: Property;
  operator: BasicValueOperator;
  value: ConditionValue;
};
export type NumericValueCondition = {
  property: Property;
  operator: NumericValueOperator;
  value: number;
};
export type ValueCondition = BasicValueCondition | NumericValueCondition;
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
export declare function parse (input: string): Condition;
