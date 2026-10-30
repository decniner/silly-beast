import {test} from 'node:test';
import assert from 'node:assert/strict';
import {COURSES} from '../courses.mjs';

test('each course offers three lanes, optional coin trails, bonus tokens and a power-up',()=>{
  assert.equal(COURSES.length,6);
  for(const course of COURSES){
    assert.ok(course.obstacles.length>=3);
    assert.ok(course.obstacles.every(o=>Number.isInteger(o.lane)&&o.lane>=0&&o.lane<=2));
    assert.ok(course.pickups.some(p=>p.type==='coin'));
    assert.ok(course.pickups.some(p=>p.type==='bonus'));
    assert.ok(course.pickups.some(p=>['shield','magnet','boost'].includes(p.type)));
    assert.ok(course.pickups.every(p=>Number.isInteger(p.lane)&&p.lane>=0&&p.lane<=2&&-p.z<course.length));
    assert.ok(course.obstacles.every(o=>-o.z<course.length));
  }
});
