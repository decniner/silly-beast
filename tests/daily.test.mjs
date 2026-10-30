import {test} from 'node:test';import assert from 'node:assert/strict';
import {utcDate,validChallengeDate,dailyChallenge,readDailyRecords,saveDailyRecords,recordDailyResult} from '../daily.mjs';

const memory=(raw=null)=>({getItem:()=>raw,setItem:(key,value)=>raw=value});

test('daily date keys use UTC rather than the device timezone',()=>{
  assert.equal(utcDate(new Date('2026-10-30T23:59:59Z')),'2026-10-30');
  assert.equal(utcDate(new Date('2026-10-31T00:00:00Z')),'2026-10-31');
});

test('only real ISO calendar dates no later than today are accepted',()=>{
  const now=new Date('2026-10-30T12:00:00Z');
  for(const date of ['2026-02-29','2026-13-01','2026-10-3','2026-10-31','not-a-date'])assert.equal(validChallengeDate(date,now),false,date);
  assert.equal(validChallengeDate('2024-02-29',now),true);
  assert.equal(validChallengeDate('2026-10-30',now),true);
});

test('challenge setup is deterministic and stable for historical share links',()=>{
  assert.deepEqual(dailyChallenge('2026-10-28'),{date:'2026-10-28',course:5,body:0,move:1});
  assert.deepEqual(dailyChallenge('2026-10-29'),{date:'2026-10-29',course:4,body:2,move:1});
  assert.deepEqual(dailyChallenge('2026-10-30'),dailyChallenge('2026-10-30'));
  assert.equal(dailyChallenge('2026-10-31'),null);
});

test('better stars win first, then faster times; attempts always increase',()=>{
  let records=recordDailyResult({},'2026-10-29',{elapsed:22.45,bumps:2,jumps:4});
  records=recordDailyResult(records,'2026-10-29',{elapsed:24,bumps:0,jumps:7});
  assert.deepEqual(records['2026-10-29'],{best:24,bumps:0,jumps:7,stars:3,runs:2});
  records=recordDailyResult(records,'2026-10-29',{elapsed:20,bumps:0,jumps:5});
  assert.deepEqual(records['2026-10-29'],{best:20,bumps:0,jumps:5,stars:3,runs:3});
});

test('daily history retains the 30 most recently attempted dates',()=>{
  let records={};
  for(let day=1;day<=31;day++)records=recordDailyResult(records,`2020-01-${String(day).padStart(2,'0')}`,{elapsed:20,bumps:0,jumps:1});
  assert.equal(Object.keys(records).length,30);
  assert.equal(records['2020-01-01'],undefined);
  assert.ok(records['2020-01-31']);
});

test('corrupt, oversized and denied reads recover safely',()=>{
  assert.deepEqual(readDailyRecords(memory('{broken')),{});
  assert.deepEqual(readDailyRecords(memory('x'.repeat(40000))),{});
  assert.deepEqual(readDailyRecords({getItem(){throw Error('denied')}}),{});
  assert.deepEqual(readDailyRecords(memory(JSON.stringify({version:1,records:{'2026-10-29':{best:-1,stars:9}}}))),{});
});

test('daily records round-trip and denied writes return false',()=>{
  const store=memory();
  const records=recordDailyResult({},'2026-10-29',{elapsed:18.347,bumps:1,jumps:3});
  assert.equal(saveDailyRecords(store,records),true);
  assert.deepEqual(readDailyRecords(store),records);
  assert.equal(saveDailyRecords({setItem(){throw Error('denied')}},records),false);
});

test('invalid daily results cannot alter the record set',()=>{
  const records={};
  assert.equal(recordDailyResult(records,'2026-10-31',{elapsed:10,bumps:0,jumps:1}),records);
  assert.equal(recordDailyResult(records,'2026-10-29',{elapsed:0,bumps:0,jumps:1}),records);
  assert.equal(recordDailyResult(records,'2026-10-29',{elapsed:10,bumps:-1,jumps:1}),records);
});
