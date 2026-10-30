import {COURSES} from './courses.mjs';import {advance,speedFor,jumpFor} from './physics.mjs';
export const FIXED_STEP=1/120;
const option=(v,max)=>Number.isInteger(v)&&v>=0&&v<=max?v:0;
export function createRun(body=0,move=0,course=0){body=option(body,2);move=option(move,2);course=option(course,COURSES.length-1);return {body,move,course,speed:speedFor(body,move),dist:0,lane:1,height:0,vy:0,cooldown:0,bumps:0,jumps:0,coins:0,bonuses:0,collected:[],powerup:'',powerupTime:0,elapsed:0,finished:false}}
export function laneDeltaFromSwipe(startX,endX){const delta=endX-startX;return Math.abs(delta)>38?Math.sign(delta):0}
export function tickRun(state,dt,jump=false,laneDelta=0){if(state.finished)return state;const c=COURSES[state.course],step=Math.max(0,Math.min(dt,.05));const next=advance(state,step,state.body,state.move,jump,c.obstacles,c.pickups,laneDelta);next.elapsed=state.elapsed+step;next.finished=next.dist>=c.length;return next}
export function recordFrame(frames,state){frames.push({...state})}
export function replayAt(frames,time){if(!frames.length)return null;let low=0,high=frames.length-1;while(low<high){const mid=Math.ceil((low+high)/2);if(frames[mid].elapsed<=time)low=mid;else high=mid-1}return frames[low]}
export function stepBuffered(state,dt,queue,laneDelta=0){const consume=queue>0&&state.height===0;const next=tickRun(state,dt,consume,laneDelta);return {state:next,queue:consume?0:Math.max(0,queue-dt),jumped:next.jumps>state.jumps}}
export function jumpWindow(move,barrierHeight){const v=jumpFor(move),clearance=barrierHeight+.12,root=Math.sqrt(Math.max(0,v*v-36*clearance));return {late:(v-root)/18+.025,early:(v+root)/18-.035}}
