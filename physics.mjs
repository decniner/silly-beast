export const obstacles=[{z:-10,h:.65},{z:-22,h:1.05},{z:-35,h:.8},{z:-48,h:1.2}];
export const speedFor=(body,move)=>[4.1,3.45,3.7][move]*(body===1?.92:1);
export const jumpFor=move=>[7.2,9.2,7.7][move];
export function advance(state,dt,body,move,jump=false,layout=obstacles){
 const s={...state};s.cooldown=Math.max(0,s.cooldown-dt);
 if(jump&&s.height===0){s.vy=jumpFor(move);s.jumps++}
 const prev=s.dist;s.dist+=dt*speedFor(body,move)*(s.cooldown>0?.38:1);
 s.vy-=18*dt;s.height=Math.max(0,s.height+s.vy*dt);if(s.height===0)s.vy=0;
 for(const o of layout)if(prev< -o.z-1.4&&s.dist>=-o.z-1.4&&s.height<o.h+.05){s.bumps++;s.cooldown=.8;s.height=Math.max(s.height,o.h+.1);s.vy=4;}
 return s;
}
export function replayIndexAt(history,time,start=0){let i=start;while(i<history.length-1&&history[i+1].time<=time)i++;return i}
