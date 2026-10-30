import {COURSES} from './courses.mjs';import {advance,speedFor,jumpFor} from './physics.mjs';
export const FIXED_STEP=1/120;
const option=(v,max)=>Number.isInteger(v)&&v>=0&&v<=max?v:0;
export function createRun(body=0,move=0,course=0){body=option(body,2);move=option(move,2);course=option(course,COURSES.length-1);return {body,move,course,speed:speedFor(body,move),dist:0,height:0,vy:0,cooldown:0,bumps:0,jumps:0,elapsed:0,finished:false}}
export function tickRun(state,dt,jump=false){if(state.finished)return state;const c=COURSES[state.course];const next=advance(state,Math.max(0,Math.min(dt,.05)),state.body,state.move,jump,c.obstacles);next.elapsed=state.elapsed+Math.max(0,Math.min(dt,.05));next.finished=next.dist>=c.length;return next}
export function recordFrame(frames,state){frames.push({...state})}
export function replayAt(frames,time){if(!frames.length)return null;let low=0,high=frames.length-1;while(low<high){const mid=Math.ceil((low+high)/2);if(frames[mid].elapsed<=time)low=mid;else high=mid-1}return frames[low]}
export function stepBuffered(state,dt,queue){const consume=queue>0&&state.height===0;const next=tickRun(state,dt,consume);return {state:next,queue:consume?0:Math.max(0,queue-dt),jumped:next.jumps>state.jumps}}
export function jumpWindow(move,barrierHeight){const v=jumpFor(move),clearance=barrierHeight+.12,root=Math.sqrt(Math.max(0,v*v-36*clearance));return {late:(v-root)/18+.025,early:(v+root)/18-.035}}
