const obstacles=(items)=>items.map(([d,h,lane])=>({z:-d,h,lane}));
const pickups=(length,variant)=>{
 const out=[];let i=0;
 for(let d=3.2;d<length-5;d+=2.8,i++){
  const lane=(Math.floor(d/7)+variant)%3;
  out.push({id:`coin-${i}`,z:-d,lane,type:'coin'});
 }
 for(const [i,d] of [length*.32,length*.68].entries())out.push({id:`bonus-${i}`,z:-d,lane:(variant+i+1)%3,type:'bonus'});
 out.push({id:'powerup-0',z:-length*.51,lane:(variant+2)%3,type:['shield','magnet','boost'][variant%3]});
 return out;
};
export const COURSES=[
{id:'warm-up',name:'First Sparks',subtitle:'Learn to leap',length:48,target:15,obstacles:obstacles([[10,.55,1],[23,.7,0],[37,.85,2]]),palette:{sky:'#747969',accent:'#bf6845',rail:'#c19b58'}},
{id:'brass-run',name:'Brass Boulevard',subtitle:'Find your rhythm',length:62,target:19,obstacles:obstacles([[10,.65,0],[22,.9,2],[35,.8,1],[48,1.05,0]]),palette:{sky:'#6b7c7e',accent:'#8a9b99',rail:'#bd9550'}},
{id:'mint-condition',name:'Mint Condition',subtitle:'A little higher',length:68,target:21,obstacles:obstacles([[11,.85,2],[24,1.05,0],[38,.65,1],[52,1.1,2]]),palette:{sky:'#59756d',accent:'#648f7e',rail:'#d7b579'}},
{id:'sunset-shift',name:'Sunset Shift',subtitle:'Keep your cool',length:76,target:24,obstacles:obstacles([[11,.6,1],[24,1.1,2],[37,.95,0],[50,.75,1],[64,1.05,2]]),palette:{sky:'#9c7c69',accent:'#bd7858',rail:'#c8a977'}},
{id:'night-owl',name:'Night Owl',subtitle:'Follow the lights',length:84,target:27,obstacles:obstacles([[12,.8,0],[25,1,2],[39,.7,1],[53,1.1,0],[67,.9,2],[77,.7,1]]),palette:{sky:'#283d48',accent:'#607f93',rail:'#c9a264'}},
{id:'grand-invention',name:'The Grand Invention',subtitle:'Put it all together',length:96,target:30,obstacles:obstacles([[11,.65,2],[24,1.05,0],[38,.8,1],[51,1.1,2],[64,.7,0],[77,1,1],[88,.85,2]]),palette:{sky:'#6c6863',accent:'#a57e9f',rail:'#cdbb80'}}
];
COURSES.forEach((course,index)=>{course.pickups=pickups(course.length,index)});
