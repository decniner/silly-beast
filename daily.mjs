import {COURSES} from './courses.mjs';

export const DAILY_KEY='silly-beast-daily-v1';
const MAX_DAYS=30,MAX_BYTES=40_000;

export function utcDate(now=new Date()){return now.toISOString().slice(0,10)}

function realDate(value){
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
  const parsed=new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime())&&parsed.toISOString().slice(0,10)===value;
}

export function validChallengeDate(value,now=new Date()){return realDate(value)&&value<=utcDate(now)}

function hash(value){let h=2166136261;for(const char of value)h=Math.imul(h^char.charCodeAt(0),16777619);return h>>>0}

export function dailyChallenge(date){
  if(!validChallengeDate(date))return null;
  return {date,course:hash(`${date}:course`)%COURSES.length,body:hash(`${date}:body`)%3,move:hash(`${date}:move`)%3};
}

function validRecord(r){return r&&Number.isFinite(r.best)&&r.best>0&&r.best<3600&&Number.isInteger(r.bumps)&&r.bumps>=0&&r.bumps<=100&&Number.isInteger(r.jumps)&&r.jumps>=0&&r.jumps<=1000&&Number.isInteger(r.stars)&&r.stars>=1&&r.stars<=3&&Number.isInteger(r.runs)&&r.runs>=1&&r.runs<=1_000_000}

function cleanRecords(records){
  if(!records||typeof records!=='object'||Array.isArray(records))return {};
  return Object.fromEntries(Object.entries(records).filter(([date,record])=>validChallengeDate(date)&&validRecord(record)).slice(-MAX_DAYS));
}

export function readDailyRecords(storage){
  try{const raw=storage?.getItem(DAILY_KEY);if(!raw||raw.length>MAX_BYTES)return {};const data=JSON.parse(raw);return data?.version===1?cleanRecords(data.records):{}}catch{return {}}
}

export function saveDailyRecords(storage,records){
  try{if(!storage?.setItem)return false;storage.setItem(DAILY_KEY,JSON.stringify({version:1,records:cleanRecords(records)}));return true}catch{return false}
}

export function recordDailyResult(records,date,result){
  if(!validChallengeDate(date)||!result||!Number.isFinite(result.elapsed)||result.elapsed<=0||result.elapsed>=3600||!Number.isInteger(result.bumps)||result.bumps<0||result.bumps>100||!Number.isInteger(result.jumps)||result.jumps<0||result.jumps>1000)return records;
  const safe=cleanRecords(records),old=safe[date],stars=result.bumps===0?3:result.bumps<=2?2:1;
  const isBetter=!old||stars>old.stars||stars===old.stars&&result.elapsed<old.best;
  const entry={best:isBetter?Math.round(result.elapsed*100)/100:old.best,bumps:isBetter?result.bumps:old.bumps,jumps:isBetter?result.jumps:old.jumps,stars:Math.max(stars,old?.stars||0),runs:Math.min((old?.runs||0)+1,1_000_000)};
  const next={...safe};delete next[date];next[date]=entry;
  return Object.fromEntries(Object.entries(next).slice(-MAX_DAYS));
}
