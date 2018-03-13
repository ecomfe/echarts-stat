/**
 * Created by hustcc on 18/3/13.
 * Contract: i@hust.cc
 */

var ecStat = require('../');

/**
 * test cases for regression
 */
describe('regression', function() {
  test('linear regression', function() {
    var data = [
      [1, 2],
      [3, 5]
    ];
    var myRegression = ecStat.regression('linear', data);
    expect(myRegression).toEqual({
      expression: 'y = 1.5x + 0.5',
      parameter: {
        gradient: 1.5,
        intercept: 0.5
      },
      points: [[1, 2], [3, 5]]
    });
  });
});
