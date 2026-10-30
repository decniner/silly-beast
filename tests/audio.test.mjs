import test from 'node:test';
import assert from 'node:assert/strict';
import {AUDIO_KEY,readAudioSettings,saveAudioSettings,soundRecipe,createAudioEngine} from '../audio.mjs';

class Param{constructor(){this.value=0}setValueAtTime(v){this.value=v}linearRampToValueAtTime(v){this.value=v}exponentialRampToValueAtTime(v){this.value=v}cancelScheduledValues(){}setTargetAtTime(v){this.value=v}}
class Node{constructor(){this.gain=new Param();this.frequency=new Param();this.detune=new Param();this.Q=new Param();this.threshold=new Param();this.knee=new Param();this.ratio=new Param();this.attack=new Param();this.release=new Param();this.connections=[];this.started=false;this.stopped=false}connect(x){this.connections.push(x);return x}start(){this.started=true}stop(){this.stopped=true;this.onended?.()}}
class Context{constructor(){this.currentTime=0;this.sampleRate=8000;this.destination=new Node();this.state='suspended';this.nodes=[]}make(){const n=new Node();this.nodes.push(n);return n}createGain(){return this.make()}createDynamicsCompressor(){return this.make()}createConvolver(){return this.make()}createOscillator(){return this.make()}createBiquadFilter(){return this.make()}createBufferSource(){return this.make()}createBuffer(channels,length){return {getChannelData:()=>new Float32Array(length),channels,length}}resume(){this.state='running';return Promise.resolve()}close(){this.state='closed';return Promise.resolve()}}

function memoryStorage(seed={}){const data=new Map(Object.entries(seed));return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),data}}

test('audio preferences use gentle defaults, clamp volume and recover from storage failures',()=>{
 const storage=memoryStorage();
 assert.deepEqual(readAudioSettings(storage),{volume:.55,ambience:true});
 assert.equal(saveAudioSettings(storage,{volume:4,ambience:false}),true);
 assert.deepEqual(JSON.parse(storage.data.get(AUDIO_KEY)),{version:1,settings:{volume:1,ambience:false}});
 assert.deepEqual(readAudioSettings({getItem:()=>'{'}),{volume:.55,ambience:true});
 assert.deepEqual(readAudioSettings(memoryStorage({[AUDIO_KEY]:JSON.stringify({version:1,settings:{volume:-8,ambience:'yes'}})})),{volume:0,ambience:true});
 assert.equal(saveAudioSettings({setItem(){throw Error('quota')}},{volume:.5,ambience:true}),false);
});

test('sound recipes cover player actions with bounded gain and duration',()=>{
 const events=[['tap',{}],['select',{variant:2}],['countdown',{value:3}],['go',{}],['jump',{movement:1}],['bump',{}],['finish',{stars:3}],['roll',{movement:2}]];
 for(const [event,detail] of events){const recipe=soundRecipe(event,detail);assert.ok(recipe.length>0,event);for(const voice of recipe){assert.ok(voice.gain>0&&voice.gain<=.12,`${event} gain`);assert.ok(voice.duration>0&&voice.duration<=1.2,`${event} duration`);assert.ok(voice.frequency>=55&&voice.frequency<=4000,`${event} frequency`)}}
 assert.deepEqual(soundRecipe('missing'),[]);
 assert.notDeepEqual(soundRecipe('roll',{movement:0}),soundRecipe('roll',{movement:2}));
});

test('engine creates audio only after opt-in and ramps the master safely',async()=>{
 let creations=0;const context=new Context();const engine=createAudioEngine({contextFactory:()=>{creations++;return context},settings:{volume:.4,ambience:true}});
 assert.equal(creations,0);assert.equal(engine.play('tap'),false);
 await engine.setEnabled(true);assert.equal(creations,1);assert.equal(engine.enabled,true);
 engine.setVolume(.25);assert.equal(engine.volume,.25);assert.equal(engine.masterLevel,.25);
 await engine.setEnabled(false);assert.equal(engine.masterLevel,0);assert.equal(engine.enabled,false);
 await engine.dispose();assert.equal(context.state,'closed');
});

test('saved-on sound still waits for an explicit audio unlock before creating a context',async()=>{
 let creations=0;const context=new Context();const engine=createAudioEngine({contextFactory:()=>{creations++;return context},settings:{volume:.5,ambience:true},enabled:true});
 engine.setScene('workshop');assert.equal(creations,0);
 assert.equal(await engine.unlock(),true);assert.equal(creations,1);assert.equal(context.state,'running');
 await engine.dispose();
});

test('unsupported Web Audio fails quietly without breaking the caller',async()=>{
 const engine=createAudioEngine({contextFactory:()=>{throw Error('unsupported')}});
 assert.equal(await engine.setEnabled(true),false);assert.equal(engine.play('jump'),false);engine.setScene('workshop');await engine.dispose();
});

test('bursts cannot schedule more than the bounded active voice count',async()=>{
 const context=new Context(),oscillators=[];context.createOscillator=()=>{const n=context.make();n.stop=()=>{n.stopped=true};oscillators.push(n);return n};
 const engine=createAudioEngine({contextFactory:()=>context,enabled:true});await engine.unlock();
 for(let i=0;i<30;i++)engine.play('finish',{stars:3});
 assert.equal(oscillators.filter(n=>n.started).length,24);
 await engine.dispose();
});

test('scene changes keep one locomotion loop and stop it on pause',async()=>{
 const scheduled=[],cancelled=[],storage=memoryStorage();const context=new Context();const engine=createAudioEngine({contextFactory:()=>context,storage,settings:{volume:.5,ambience:true},schedule:fn=>{scheduled.push(fn);return scheduled.length},cancelSchedule:id=>cancelled.push(id)});
 await engine.setEnabled(true);engine.setScene('course',0);engine.setScene('course',0);assert.equal(scheduled.length,1);
 engine.setScene('paused');assert.deepEqual(cancelled,[1]);engine.setScene('workshop');assert.equal(engine.scene,'workshop');
 engine.setVolume(.32);engine.setAmbience(false);assert.deepEqual(JSON.parse(storage.data.get(AUDIO_KEY)),{version:1,settings:{volume:.32,ambience:false}});
 assert.equal(engine.play('jump',{movement:1}),true);assert.ok(context.nodes.some(n=>n.started));
 await engine.dispose();
});
