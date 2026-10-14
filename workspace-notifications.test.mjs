import test from 'node:test';
import assert from 'node:assert/strict';
import {workspaceNotificationPresentation as presentation} from './workspace-notifications.js';

test('normal save and saving use the persistent status, not a duplicate success panel',()=>{
  for(const status of ['saved','saving']) {
    const result=presentation({persistence:{status}});
    assert.equal(result.showPersistenceWarning,false);
    assert.equal(result.operation,'');assert.equal(result.notice,'');
  }
});
test('title application is a compact localized result independent of saving success',()=>{
  for(const status of ['saved','saving','degraded'])for(const locale of ['en','ja']){
    const result=presentation({persistence:{status},locale,lifecycleNotice:'Dataset title applied. E2R JSON Export is a separate step.'});
    assert.equal(result.operation,locale==='ja'?'タイトルを適用しました。':'Title applied.');
    assert.equal(result.notice,'');assert.equal(result.showPersistenceWarning,status==='degraded');
  }
});
test('unknown errors and Export/download confirmation guidance are never classified as success',()=>{
  for(const notice of ['Download could not be handed off: denied','Export blocked: Validator errors remain.','The browser was asked to download the E2R JSON. Check that the download completed.','E2R JSONのダウンロードを確認してください。']){
    const result=presentation({persistence:{status:'degraded'},lifecycleNotice:notice});
    assert.equal(result.showPersistenceWarning,true);assert.equal(result.notice,notice);assert.equal(result.operation,'');
    if(notice.includes('blocked')||notice.includes('could not'))assert.equal(result.noticeRole,'alert');
  }
});
