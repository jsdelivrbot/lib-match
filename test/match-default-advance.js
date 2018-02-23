const assert = require('assert');
const match = require('../dist/match');
let params;
let data;

it('multi token || and ||| usage', function() {
    params = {
        id: 0,
        c: 1,
        city: 2,
    };
    data = match.parse(params, {
        id: '$${{ids}} || 123',
        city: '$${{c}} || $${{city}} || 1',
        city2: '$${{province}} || 4',
        city3: '$${{c2}} || $${{city}} || 1',
        city4: '$${{id}} ||| 1',
        city5: '$${{city}} ||| 1',
        city6: '$${{ids}} ||| 1',
        city7: '$${{ids}} || $${{id}} ||| 1',
        city8: '$${{id}} || $${{ids}} ||| 1',
    });
    assert.deepEqual(data, {
        id: 123,
        city: 1,
        city2: 4,
        city3: 2,
        city4: 1,
        city5: 2,
        city6: 1,
        city7: 1,
        city8: 0,
    });
});
