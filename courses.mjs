const obstacles=(items)=>items.map(([d,h])=>({z:-d,h}));
export const COURSES=[
{id:'warm-up',name:'First Sparks',subtitle:'Learn to leap',length:48,target:15,obstacles:obstacles([[10,.55],[23,.7],[37,.85]]),palette:{sky:'#747969',accent:'#bf6845',rail:'#c19b58'}},
{id:'brass-run',name:'Brass Boulevard',subtitle:'Find your rhythm',length:62,target:19,obstacles:obstacles([[10,.65],[22,.9],[35,.8],[48,1.05]]),palette:{sky:'#6b7c7e',accent:'#8a9b99',rail:'#bd9550'}},
{id:'mint-condition',name:'Mint Condition',subtitle:'A little higher',length:68,target:21,obstacles:obstacles([[11,.85],[24,1.05],[38,.65],[52,1.1]]),palette:{sky:'#59756d',accent:'#648f7e',rail:'#d7b579'}},
{id:'sunset-shift',name:'Sunset Shift',subtitle:'Keep your cool',length:76,target:24,obstacles:obstacles([[11,.6],[24,1.1],[37,.95],[50,.75],[64,1.05]]),palette:{sky:'#9c7c69',accent:'#bd7858',rail:'#c8a977'}},
{id:'night-owl',name:'Night Owl',subtitle:'Follow the lights',length:84,target:27,obstacles:obstacles([[12,.8],[25,1],[39,.7],[53,1.1],[67,.9],[77,.7]]),palette:{sky:'#283d48',accent:'#607f93',rail:'#c9a264'}},
{id:'grand-invention',name:'The Grand Invention',subtitle:'Put it all together',length:96,target:30,obstacles:obstacles([[11,.65],[24,1.05],[38,.8],[51,1.1],[64,.7],[77,1],[88,.85]]),palette:{sky:'#6c6863',accent:'#a57e9f',rail:'#cdbb80'}}
];
