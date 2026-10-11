import test from 'node:test';
import assert from 'node:assert/strict';
import {createWorkspaceWriteGate} from './workspace-write-gate.js';

test('peer refusal stays latched after peer work clears and blocks Export-triggered retry', async()=>{
  const gate=createWorkspaceWriteGate();
  let peerActive=true;
  let writes=0;
  let sharedWorkspace='Protected A';
  const attempt=async()=>{
    if(peerActive)return {ok:false,blockedByPeer:true,reason:'peer work'};
    writes++;
    sharedWorkspace='Refused B';
    return {ok:true,raw:sharedWorkspace};
  };

  assert.equal((await gate.run(attempt)).blockedByPeer,true);
  peerActive=false;
  const exportFollowup=await gate.run(attempt);

  assert.equal(exportFollowup.ok,false);
  assert.equal(exportFollowup.priorRefusal.blockedByPeer,true);
  assert.equal(writes,0);
  assert.equal(sharedWorkspace,'Protected A');
});

test('Test 32 ordering keeps the protected revision after both tabs export', async()=>{
  let sharedWorkspace='Protected Work A';
  let tabAActive=true,tabBActive=true;
  let writeCount=0;
  const tabA=createWorkspaceWriteGate(),tabB=createWorkspaceWriteGate();
  const attemptA=async()=>tabBActive
    ?{ok:false,blockedByPeer:true,reason:'peer work'}
    :(writeCount++,sharedWorkspace='Exported A baseline',{ok:true,raw:sharedWorkspace});
  const attemptB=async()=>tabAActive
    ?{ok:false,blockedByPeer:true,reason:'peer work'}
    :(writeCount++,sharedWorkspace='Refused B candidate',{ok:true,raw:sharedWorkspace});

  assert.equal((await tabB.run(attemptB)).blockedByPeer,true);
  tabAActive=false;
  assert.equal((await tabA.run(attemptA)).blockedByPeer,true);
  assert.equal(sharedWorkspace,'Protected Work A');
  assert.equal((await tabB.run(attemptB)).priorRefusal.blockedByPeer,true);
  assert.equal(sharedWorkspace,'Protected Work A');
  assert.equal(writeCount,0);
});

test('stale-revision refusal also blocks all later writes until page recovery', async()=>{
  const gate=createWorkspaceWriteGate();
  let writes=0;
  await gate.run(async()=>({ok:false,conflict:true,reason:'stale revision'}));
  const later=await gate.run(async()=>{writes++;return {ok:true};});
  assert.equal(later.ok,false);
  assert.equal(later.priorRefusal.conflict,true);
  assert.equal(writes,0);
});

test('successful writes remain available and cancelled replacement attempts do not latch', async()=>{
  const gate=createWorkspaceWriteGate();
  assert.equal((await gate.run(async()=>({ok:false,cancelled:true}))).cancelled,true);
  assert.equal((await gate.run(async()=>({ok:true,raw:'saved'}))).ok,true);
  assert.equal(gate.refusal,null);
});

test('only an explicit replacement retry reopens the write gate', async()=>{
  const gate=createWorkspaceWriteGate();
  await gate.run(async()=>({ok:false,blockedByPeer:true}));
  let writes=0;
  assert.equal((await gate.run(async()=>{writes++;return {ok:true};})).ok,false);
  gate.retryExplicitly();
  assert.equal((await gate.run(async()=>{writes++;return {ok:true};})).ok,true);
  assert.equal(writes,1);
});

test('coordination exceptions fail closed and remain latched', async()=>{
  const gate=createWorkspaceWriteGate();
  const first=await gate.run(async()=>{throw Error('lock unavailable');});
  const second=await gate.run(async()=>({ok:true}));
  assert.equal(first.coordinationError,true);
  assert.equal(second.ok,false);
  assert.equal(second.priorRefusal.coordinationError,true);
});
