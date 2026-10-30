export const obstacles=[{z:-10,h:.65},{z:-22,h:1.05},{z:-35,h:.8},{z:-48,h:1.2}];
export const speedFor=(body,move)=>[4.1,3.45,3.7][move]*(body===1?.92:1);
export const jumpFor=move=>[7.2,9.2,7.7][move];
const POWERUP_TIME={shield:7,magnet:7,boost:5};
export function advance(state,dt,body,move,jump=false,layout=obstacles,pickups=[],laneDelta=0){
 const s={...state,lane:Math.max(0,Math.min(2,(Number.isInteger(state.lane)?state.lane:1)+Math.sign(laneDelta))),coins:state.coins||0,bonuses:state.bonuses||0,collected:[...(state.collected||[])],powerup:state.powerup||'',powerupTime:Math.max(0,state.powerupTime||0)};
 s.cooldown=Math.max(0,s.cooldown-dt);s.powerupTime=Math.max(0,s.powerupTime-dt);if(!s.powerupTime)s.powerup='';
 if(jump&&s.height===0){s.vy=jumpFor(move);s.jumps++}
 const prev=s.dist,baseSpeed=speedFor(body,move);s.speed=baseSpeed*(s.powerup==='boost'?1.3:1);s.dist+=dt*s.speed*(s.cooldown>0?.38:1);
 s.vy-=18*dt;s.height=Math.max(0,s.height+s.vy*dt);if(s.height===0)s.vy=0;
 for(const p of pickups){const id=String(p.id);const crossed=prev< -p.z-.22&&s.dist>=-p.z-.22;if(!crossed||s.collected.includes(id)||Math.abs(s.lane-p.lane)>(s.powerup==='magnet'?1:0))continue;s.collected.push(id);if(p.type==='coin')s.coins++;else if(p.type==='bonus'){s.coins+=5;s.bonuses++}else if(POWERUP_TIME[p.type]){s.powerup=p.type;s.powerupTime=POWERUP_TIME[p.type]}}
 for(const o of layout)if((o.lane===undefined||o.lane===s.lane)&&prev< -o.z-1.4&&s.dist>=-o.z-1.4&&s.height<o.h+.05){if(s.powerup==='shield'){s.powerup='';s.powerupTime=0;continue}s.bumps++;s.cooldown=.8;s.height=Math.max(s.height,o.h+.1);s.vy=4;}
 s.speed=baseSpeed*(s.powerup==='boost'?1.3:1);
 return s;
}
export function replayIndexAt(history,time,start=0){let i=start;while(i<history.length-1&&history[i+1].time<=time)i++;return i}
