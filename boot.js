const fail=message=>{document.querySelector('#loading').hidden=true;document.querySelector('#fatal').hidden=false;document.querySelector('#fatalText').textContent=message};document.querySelector('#reload').onclick=()=>location.reload();
import('./game.js').catch(()=>fail('The workshop could not start. Check your connection and try again. This game needs a browser with WebGL graphics enabled.'));
window.addEventListener('unhandledrejection',()=>{if(!document.querySelector('#loading').hidden)fail('A game asset could not load. Check your connection, then try again.')});
