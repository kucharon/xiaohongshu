'use strict';
// Replace these demo presets with approved campaign content and downloadable asset URLs.
const CONTENT={id:'demo-content-01',demo:true,title:'换一种方式，开启今天的早晨',body:'分享熊猫睡眠的任务闹钟，给早晨一点新鲜感。\n\n一起看看任务闹钟的使用方式。\n\n#熊猫睡眠 #任务闹钟',assets:[]};
const $=id=>document.getElementById(id);let state={acquired:false};let timer;
function toast(t){$('toast').textContent=t;$('toast').classList.add('visible');clearTimeout(timer);timer=setTimeout(()=>$('toast').classList.remove('visible'),2800);}
function safeAsset(url){try{const u=new URL(url,location.href);return ['https:','http:'].includes(u.protocol)||/^data:(image|video)\//.test(url);}catch{return false;}}
function render(){
 const item=CONTENT;
 $('before-get').hidden=state.acquired;$('content-package').hidden=!state.acquired;$('submit-button').disabled=!state.acquired;
 $('title-content').textContent=item.title;$('body-content').textContent=item.body;
 $('asset-heading').textContent='配套素材';
 $('submission-summary').textContent=state.acquired?'发布后提交帖子链接，审核通过后领取1个月会员。':'请先获取发布内容，发布后再提交。';
 const list=$('asset-list');list.replaceChildren();
 const assets=item.assets.filter(a=>a&&['image','video'].includes(a.type)&&safeAsset(a.url));
 if(!assets.length){
  const box=document.createElement('div');box.className='asset-empty';const b=document.createElement('b');b.textContent='发布素材待配置';
  const p=document.createElement('p');p.textContent='正式素材接入后，可在这里统一预览并保存。';box.append(b,p);list.append(box);
  
 }else{
  assets.forEach((asset,i)=>{const media=document.createElement(asset.type==='video'?'video':'img');media.src=asset.url;if(asset.type==='video')media.controls=true;else media.alt='发布素材 '+(i+1);
   const a=document.createElement('a');a.className='download';a.href=asset.url;a.download='panda-share-'+(i+1);a.textContent='保存素材 '+(i+1)+' ↓';list.append(media,a);
  });
 }
}
$('get-content').addEventListener('click',()=>{state.acquired=true;render();toast('发布内容已获取');});
async function copy(field){const target=$(field);try{await navigator.clipboard.writeText(target.textContent);toast('已复制');}catch{const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(target);selection.removeAllRanges();selection.addRange(range);toast('内容已选中，请长按复制或按 Ctrl/Cmd+C');}}
$('copy-title').addEventListener('click',()=>copy('title-content'));$('copy-body').addEventListener('click',()=>copy('body-content'));
function error(id,msg){$(id+'-error').textContent=msg;$(id+'-error').hidden=!msg;$(id==='url'?'post-url':'account').setAttribute('aria-invalid',String(!!msg));}
$('post-url').addEventListener('input',()=>error('url',''));$('account').addEventListener('input',()=>error('account',''));
$('submit-form').addEventListener('submit',e=>{e.preventDefault();if(!state.acquired)return;const raw=$('post-url').value.trim(),account=$('account').value.trim();const m=raw.match(/https?:\/\/[^\s<>"“”]+/i);let valid=false;try{valid=!!m&&new URL(m[0]).hostname.includes('.');}catch{}error('url',valid?'':'请填写有效的帖子链接');error('account',account?'':'请填写领取会员的UID或手机号');if(!valid||!account){(!valid?$('post-url'):$('account')).focus();return;}$('submit-form').hidden=true;$('success').hidden=false;$('success').focus();});
$('back-form').addEventListener('click',()=>{$('success').hidden=true;$('submit-form').hidden=false;});render();

function resetPage(){
 state={acquired:false};
 clearTimeout(timer);$('toast').classList.remove('visible');
 $('submit-form').reset();$('post-url').value='';$('account').value='';
 error('url','');error('account','');
 $('submit-form').hidden=false;$('success').hidden=true;
 $('page-submit').hidden=false;
 render();
 requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'instant'}));
}
if('scrollRestoration' in history)history.scrollRestoration='manual';
window.addEventListener('pageshow',resetPage);
