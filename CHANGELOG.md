## 2.1.0 (2019-09-18)

* **Improvements**: Now more liberal and consistent in what plain property names it allows: It allows underscores (`_`), numbers and upper case characters.
* **Semi-breaking**: As more characters was added above, a change was bade to disallow `-` and any other non-alphabetic characters as the very first character in a property name. This to simplify parsing and avoid mistakes due to missing whitespace or similar.

## 2.0.0 (2019-08-10)

* **Breaking**: Require Node >=10.x

## 1.0.1 (2016-08-18)

* Better Readme

## 1.0.0 (2016-08-17)

Initial release
