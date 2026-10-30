export const AUDIO_KEY='silly-beast-audio-v1';
export const DEFAULT_AUDIO_SETTINGS=Object.freeze({volume:.55,ambience:true});
const VOICE_LIMIT=24;
const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
const variantOf=v=>Number.isInteger(v)&&v>=0&&v<=2?v:0;

export function cleanAudioSettings(value){
  if(!value||typeof value!=='object'||Array.isArray(value))return {...DEFAULT_AUDIO_SETTINGS};
  return {volume:typeof value.volume==='number'&&Number.isFinite(value.volume)?clamp(value.volume,0,1):DEFAULT_AUDIO_SETTINGS.volume,ambience:typeof value.ambience==='boolean'?value.ambience:DEFAULT_AUDIO_SETTINGS.ambience};
}
export function readAudioSettings(storage){try{const raw=storage?.getItem(AUDIO_KEY);if(!raw||raw.length>4096)return {...DEFAULT_AUDIO_SETTINGS};const data=JSON.parse(raw);return data?.version===1?cleanAudioSettings(data.settings):{...DEFAULT_AUDIO_SETTINGS}}catch{return {...DEFAULT_AUDIO_SETTINGS}}}
export function saveAudioSettings(storage,settings){try{if(!storage?.setItem)return false;storage.setItem(AUDIO_KEY,JSON.stringify({version:1,settings:cleanAudioSettings(settings)}));return true}catch{return false}}

const voice=(wave,frequency,duration,gain,endFrequency=null,cutoff=3000,delay=0,send=.12)=>({wave,frequency,duration,gain,endFrequency,cutoff,delay,send});
export function soundRecipe(event,detail={}){
  const move=variantOf(detail.movement),variant=variantOf(detail.variant);
  switch(event){
    case 'tap':return [voice('noise',360,.045,.025,null,1700),voice('sine',720,.075,.035,510,2400,0,.2)];
    case 'select':return [voice('triangle',[490,590,690][variant],.16,.045,[650,780,880][variant],3200,0,.28),voice('sine',[980,1180,1380][variant],.1,.023,null,4000,.025,.25)];
    case 'start':return [voice('sine',290,.2,.055,470,1800,0,.3),voice('triangle',580,.24,.026,820,3200,.08,.35)];
    case 'countdown':{const n=Number.isInteger(detail.value)?clamp(detail.value,1,3):3;return [voice('sine',350+n*48,.15,.06,null,1800,0,.18),voice('triangle',700+n*60,.12,.023,null,3200,.008,.22)]}
    case 'go':return [voice('sine',660,.32,.065,990,2600,0,.42),voice('triangle',990,.38,.035,1320,4000,.045,.48)];
    case 'jump':return [voice('triangle',[145,175,205][move],.32,.075,[520,710,590][move],1700,0,.48),voice('sine',[430,520,610][move],.25,.038,[860,1040,1220][move],3000,.018,.52)];
    case 'coin':return [voice('sine',880,.12,.05,1320,3600,0,.42),voice('triangle',1320,.09,.025,null,4200,.035,.36)];
    case 'bonus':return [voice('triangle',660,.24,.055,880,3000,0,.46),voice('sine',990,.28,.045,1480,4200,.08,.58),voice('sine',1480,.32,.035,null,5000,.16,.62)];
    case 'powerup':{const base=detail.kind==='shield'?520:detail.kind==='magnet'?690:820;return [voice('triangle',base,.2,.05,base*1.32,3200,0,.42),voice('sine',base*1.5,.24,.035,base*2,4500,.07,.52)]}
    case 'lane':return [voice('triangle',detail.direction<0?370:420,.06,.022,null,1600,0,.12)];
    case 'bump':return [voice('noise',120,.18,.075,null,420,0,.2),voice('sine',105,.24,.065,62,260,0,.12),voice('triangle',310,.11,.025,170,700,.018,.15)];
    case 'finish':{const stars=Number.isInteger(detail.stars)?clamp(detail.stars,1,3):1;const notes=stars===3?[523,659,784,1047]:stars===2?[440,554,659]:[392,494];return notes.map((n,i)=>voice(i===notes.length-1?'sine':'triangle',n,.5,.055,n*1.08,3600,i*.105,.65))}
    case 'roll':{
      if(move===0)return [voice('noise',260,.1,.024,null,720,.0,.08),voice('sine',110,.13,.012,82,380,.035,.06)];
      if(move===1)return [voice('triangle',190,.16,.028,135,800,.0,.12),voice('sine',420,.12,.016,660,1900,.05,.18)];
      return [voice('noise',190,.07,.02,null,950,.0,.08),voice('sine',245,.1,.02,165,640,.11,.1),voice('sine',310,.1,.018,205,800,.2,.12)];
    }
    default:return [];
  }
}

function setParam(param,value,time,duration=.18){if(!param)return;param.cancelScheduledValues?.(time);param.setValueAtTime?.(param.value,time);if(duration&&param.linearRampToValueAtTime)param.linearRampToValueAtTime(value,time+duration);else param.setValueAtTime?.(value,time)}

export function createAudioEngine({contextFactory=()=>{const C=globalThis.AudioContext||globalThis.webkitAudioContext;if(!C)throw Error('Web Audio unavailable');return new C()},storage=null,settings=DEFAULT_AUDIO_SETTINGS,enabled=false,schedule=(fn,ms)=>setInterval(fn,ms),cancelSchedule=id=>clearInterval(id)}={}){
  const prefs=cleanAudioSettings(settings);let volume=prefs.volume,ambience=prefs.ambience,active=enabled,scene='off',movement=0,context=null,master=null,compressor=null,convolver=null,reverb=null,ambientBus=null,noiseBuffer=null,ambientNodes=[],loopId=null;const voices=new Set();
  function ramp(param,value,duration=.2){if(!context||!param)return;setParam(param,value,context.currentTime,duration)}
  function makeImpulse(){const length=Math.floor(context.sampleRate*1.05),buffer=context.createBuffer(2,length,context.sampleRate);for(let ch=0;ch<2;ch++){const data=buffer.getChannelData(ch);let seed=0x6d2b79f5+ch;for(let i=0;i<length;i++){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;data[i]=(seed/2147483648)*Math.pow(1-i/length,3.2)}}return buffer}
  function ensure(){
    if(context)return true;
    try{
      context=contextFactory();master=context.createGain();compressor=context.createDynamicsCompressor();compressor.threshold.value=-22;compressor.knee.value=16;compressor.ratio.value=3;compressor.attack.value=.004;compressor.release.value=.22;master.gain.value=0;master.connect(compressor);compressor.connect(context.destination);
      convolver=context.createConvolver();convolver.buffer=makeImpulse();reverb=context.createGain();reverb.gain.value=.16;convolver.connect(reverb);reverb.connect(master);
      ambientBus=context.createGain();ambientBus.gain.value=0;ambientBus.connect(master);
      noiseBuffer=context.createBuffer(1,context.sampleRate,context.sampleRate);const noise=noiseBuffer.getChannelData(0);let seed=0x12345678;for(let i=0;i<noise.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;noise[i]=(seed/2147483648)-1}
      return true;
    }catch{context=null;return false}
  }
  function stopAmbient(){if(!context||!ambientNodes.length)return;ramp(ambientBus.gain,0,.35);for(const node of ambientNodes){try{node.stop?.(context.currentTime+.45)}catch{}}ambientNodes=[]}
  function startAmbient(){if(!context||!ambience||ambientNodes.length)return;try{
    const hum=context.createOscillator(),humGain=context.createGain(),lfo=context.createOscillator(),lfoGain=context.createGain();hum.type='sine';hum.frequency.value=68;humGain.gain.value=.15;lfo.type='sine';lfo.frequency.value=.13;lfoGain.gain.value=2;lfo.connect(lfoGain);lfoGain.connect(hum.detune);hum.connect(humGain);humGain.connect(ambientBus);hum.start();lfo.start();
    const source=context.createBufferSource(),filter=context.createBiquadFilter(),airGain=context.createGain();source.buffer=noiseBuffer;source.loop=true;filter.type='lowpass';filter.frequency.value=520;filter.Q.value=.25;airGain.gain.value=.12;source.connect(filter);filter.connect(airGain);airGain.connect(ambientBus);source.start();ambientNodes=[hum,lfo,source];ramp(ambientBus.gain,1,.6);
  }catch{stopAmbient()}}
  function stopLoop(){if(loopId!==null){cancelSchedule(loopId);loopId=null}}
  function refreshScene(){if(!context)return;if(!active){stopAmbient();stopLoop();return}ramp(master.gain,volume,.22);if(scene==='workshop'){stopLoop();startAmbient()}else{stopAmbient();if(scene==='course')startLoop();else stopLoop()}}
  function startLoop(){if(loopId!==null||!context)return;loopId=schedule(()=>play('roll',{movement}),[520,570,480][movement])}
  function play(event,detail={}){
    const recipe=soundRecipe(event,detail);if(!active||!recipe.length)return false;
    if(!ensure())return false;
    if(context.state!=='running'){context.resume?.().then(()=>{refreshScene();scheduleRecipe(recipe)}).catch(()=>{});return true}
    refreshScene();return scheduleRecipe(recipe);
  }
  function scheduleRecipe(recipe){if(!context||!active)return false;let made=0;for(const item of recipe){if(voices.size>=VOICE_LIMIT)break;try{
    const now=context.currentTime+item.delay,env=context.createGain(),filter=context.createBiquadFilter();filter.type='lowpass';filter.frequency.value=item.cutoff;env.gain.value=.0001;filter.connect(env);env.connect(master);if(item.send){const send=context.createGain();send.gain.value=item.send*.22;env.connect(send);send.connect(convolver)}
    let source;if(item.wave==='noise'){source=context.createBufferSource();source.buffer=noiseBuffer;source.loop=true;source.connect(filter)}else{source=context.createOscillator();source.type=item.wave;source.frequency.setValueAtTime(item.frequency,now);if(item.endFrequency)source.frequency.exponentialRampToValueAtTime(Math.max(1,item.endFrequency),now+item.duration);source.connect(filter)}
    env.gain.setValueAtTime(.0001,now);env.gain.exponentialRampToValueAtTime(Math.max(.0002,item.gain),now+.012);env.gain.exponentialRampToValueAtTime(.0001,now+item.duration);voices.add(source);source.onended=()=>{voices.delete(source);try{source.disconnect();filter.disconnect();env.disconnect()}catch{}};source.start(now);source.stop(now+item.duration+.02);made++;
  }catch{}}
    return made>0;
  }
  async function unlock(){if(!active||!ensure())return false;try{if(context.state!=='running')await context.resume();refreshScene();return true}catch{return false}}
  async function setEnabled(value){active=value===true;if(!active){ramp(master?.gain,0,.08);stopAmbient();stopLoop();return false}return unlock()}
  function setVolume(value){volume=cleanAudioSettings({...prefs,volume:Number(value)}).volume;prefs.volume=volume;ramp(master?.gain,active?volume:0,.08);saveAudioSettings(storage,{volume,ambience});return volume}
  function setAmbience(value){ambience=value===true;prefs.ambience=ambience;saveAudioSettings(storage,{volume,ambience});if(scene==='workshop')refreshScene();return ambience}
  function setScene(value,move=movement){scene=['workshop','course','paused','result','off'].includes(value)?value:'off';movement=variantOf(move);refreshScene()}
  async function dispose(){active=false;stopLoop();stopAmbient();for(const node of voices){try{node.stop()}catch{}}voices.clear();try{await context?.close()}catch{}context=null;master=null}
  return {play,unlock,setEnabled,setVolume,setAmbience,setScene,dispose,get enabled(){return active},get volume(){return volume},get ambience(){return ambience},get scene(){return scene},get masterLevel(){return master?.gain.value??0}};
}
