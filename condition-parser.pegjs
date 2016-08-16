start
  = _* additive:additive _* { return additive; }

additive
  = left:multiplicative _+ operator:or_operator _+  right:additive _* { return { left: left, operator: operator, right: right }; }
  / multiplicative: multiplicative { return multiplicative; }

multiplicative
  =
  left:primary _+ operator:and_operator _+ right:multiplicative { return { left: left, operator: operator, right: right }; }
  / primary

primary
 = not_operator basic:basic_primary { return { not: basic }; }
 / basic_primary

basic_primary
  = statement
  / "(" _* additive:additive _* ")" { return additive; }

statement
  = property:property _* operator:comparison_operators _* value:value { return { property: property, operator:operator, value: value }; }
  / property:property { return { property: property}; }

property
  = head:property_name tail:subProperty { return [head].concat(tail); }
  / property:property_name { return [property]; }

subProperty
  = '.' property:property { return property; }
  / '[' value:value ']' tail:(subProperty)? { return [value].concat(tail || []); }
  / '[]' tail:(subProperty)? { var result = { array: true }; if (tail) { result.property = tail; } return [result]; }

property_name
  = term:[a-z-]+ { return term.join(''); }

value
  = quoted_value
  / bool
  / alpha
  / integer

quoted_value
  = '"' value:char* '"' { return value.join(''); }

bool
  = 'true' { return true; }
  / 'false' { return false; }

alpha
  = term:[a-z]+ { return term.join(''); }

integer
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

and_operator
  = ('AND' / 'and' / '&&') { return 'AND'; }

or_operator
  = ('OR' / 'or' / '||') { return 'OR'; }

not_operator
  = ('NOT' _+ / 'not' _+ / '!' _*) { return 'NOT'; }

comparison_operators
  = '<'
  / '>'
  / '<='
  / '>='
  / '==='
  / ('=' / '==') { return '=='; }
  / ('!=' / '<>') { return '!='; }

char
  = unescaped
  / escape
    sequence:(
        '"'
      / "\\"
    )
    { return sequence; }

escape = "\\"
unescaped = [^\0-\x1F\x22\x5C]

_ "whitespace"
  = [ \t\r\n\f]+
