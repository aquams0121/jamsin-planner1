export default function(component) {
  const { parentElement, data, setTriggerValue } = component;

  let bridge = parentElement.__jamsinPlannerBridge;
  if (!bridge) {
    bridge = {
      initialized: false,
      pending: new Map(),
      lastResponseId: null,
      setTriggerValue,
    };
    parentElement.__jamsinPlannerBridge = bridge;
  }
  bridge.setTriggerValue = setTriggerValue;

  const response = data?.ai_response;
  if (response?.id && response.id !== bridge.lastResponseId) {
    bridge.lastResponseId = response.id;
    const pending = bridge.pending.get(response.id);
    if (pending) {
      bridge.pending.delete(response.id);
      if (response.ok) pending.resolve(response.result ?? '');
      else pending.reject(new Error(response.error || 'Gemini API 요청에 실패했습니다.'));
    }
  }

  // The Streamlit component is rerendered whenever Python returns an AI result.
  // Keep the existing DOM and JS state so the original UI/localStorage behavior remains unchanged.
  if (bridge.initialized) return;
  bridge.initialized = true;

const addDays=(n)=>{const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
const students=[{id:'20101',name:'김이박',password:'1234',grade:2,classNo:1,role:'student',choices:{F:'물리',G:'화학',H:'기하',I:'데이터과학',J:'도시의 미래탐구'}}];
const teachers=[{id:'teacher01',name:'김교사',password:'1234',role:'teacher',subjects:['물리'],grades:[2],classes:[1],choiceBlocks:['F']}];
const periodTimes={1:'08:20 ~ 09:10',2:'09:20 ~ 10:10',3:'10:20 ~ 11:10',4:'11:20 ~ 12:10',5:'13:10 ~ 14:00',6:'14:10 ~ 15:00',7:'15:10 ~ 16:00'};
const c=(subject,teacher,room,block=null)=>({subject,teacher,room,block});
const baseTimetable={
 월:[c('화법과 언어','박국어','2-1'),c('미적분','이수학','2-1'),c('영어','최영어','2-1'),c('F 선택수업','선택교사','이동수업','F'),c('G 선택수업','선택교사','이동수업','G'),c('체육','정체육','체육관')],
 화:[c('H 선택수업','선택교사','이동수업','H'),c('화법과 언어','박국어','2-1'),c('영어','최영어','2-1'),c('미적분','이수학','2-1'),c('I 선택수업','선택교사','이동수업','I'),c('한국사','한역사','2-1'),c('자율','담임','2-1')],
 수:[c('미적분','이수학','2-1'),c('J 선택수업','선택교사','이동수업','J'),c('영어','최영어','2-1'),c('F 선택수업','선택교사','이동수업','F'),c('화법과 언어','박국어','2-1'),c('창체','담임','2-1')],
 목:[c('G 선택수업','선택교사','이동수업','G'),c('미적분','이수학','2-1'),c('H 선택수업','선택교사','이동수업','H'),c('영어','최영어','2-1'),c('I 선택수업','선택교사','이동수업','I'),c('한국사','한역사','2-1'),c('체육','정체육','체육관')],
 금:[c('J 선택수업','선택교사','이동수업','J'),c('화법과 언어','박국어','2-1'),c('미적분','이수학','2-1'),c('영어','최영어','2-1'),c('F 선택수업','선택교사','이동수업','F'),c('진로','담임','2-1')]
};
const choiceMeta={물리:{teacher:'김교사',room:'과학실1'},화학:{teacher:'박화학',room:'과학실2'},기하:{teacher:'이수학',room:'수학실'},데이터과학:{teacher:'최정보',room:'컴퓨터실'},'도시의 미래탐구':{teacher:'정사회',room:'사회실'}};
const assessments=[
 {id:'a1',subject:'물리',title:'운동 분석 탐구 보고서',type:'choice',block:'F',grade:2,classNo:null,date:addDays(3),deadline:addDays(3),materials:['계산기','필기구'],method:'보고서 파일 제출',score:20,description:'물체의 운동을 분석하고 관련 물리 개념을 이용하여 탐구 보고서를 작성한다.',teacher:'김교사',registered:addDays(-5),workload:4,checklist:['수행평가 내용 확인','주제 선정','자료 조사','보고서 작성','최종 검토','제출']},
 {id:'a2',subject:'영어',title:'진로 발표 PPT',type:'class',grade:2,classNo:1,date:addDays(5),deadline:addDays(5),materials:['발표 자료'],method:'수업 시간 발표',score:15,description:'관심 진로를 영어로 소개하는 발표를 준비한다.',teacher:'최영어',registered:addDays(-3),workload:3,checklist:['주제 선정','자료 조사','대본 작성','PPT 제작','발표 연습']},
 {id:'a3',subject:'데이터과학',title:'데이터 분석 미니 프로젝트',type:'choice',block:'I',grade:2,classNo:null,date:addDays(9),deadline:addDays(9),materials:['노트북'],method:'프로젝트 파일 제출',score:25,description:'주어진 데이터셋을 분석하고 시각화 결과를 제출한다.',teacher:'최정보',registered:addDays(-2),workload:5,checklist:['주제 확인','데이터 정리','분석','시각화','설명 작성','제출']}
];
const progressRecords=[
 {id:'p1',date:addDays(-1),subject:'물리',type:'choice',block:'F',grade:2,classNo:null,learned:['포물선 운동','수평 방향과 수직 방향 운동'],pages:'72~77쪽',homework:'78쪽 1~3번',materials:['계산기'],notice:'탐구 보고서 수행평가 예정',teacher:'김교사'},
 {id:'p2',date:addDays(-1),subject:'영어',type:'class',grade:2,classNo:1,learned:['발표 표현 정리','도입 문장 연습'],pages:'44~47쪽',homework:'발표 주제 정하기',materials:['영어 교과서'],notice:'다음 주 발표 일정 안내 예정',teacher:'최영어'}
];
const events=[
 {id:'e1',date:addDays(6),type:'exam',title:'영어 단어 시험'},
 {id:'e2',date:addDays(12),type:'school',title:'학교 동아리 발표회'},
 {id:'e3',date:addDays(15),type:'other',title:'진로 상담 신청 마감'}
];


const K={session:'jp_session',studentProgress:'jp_student_progress',teacherAssess:'jp_teacher_assess',teacherProgress:'jp_teacher_progress',teacherEvents:'jp_teacher_events'};
const get=(k,fallback)=>{try{return JSON.parse(localStorage.getItem(k))??fallback}catch{return fallback}};
const set=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const session=()=>get(K.session,null);const saveSession=(v)=>set(K.session,v);const clearSession=()=>localStorage.removeItem(K.session);
const studentProgress=()=>get(K.studentProgress,{});const saveStudentProgress=(v)=>set(K.studentProgress,v);
const storageTeacherAssessments=()=>get(K.teacherAssess,[]);const saveTeacherAssessments=(v)=>set(K.teacherAssess,v);
const storageTeacherProgress=()=>get(K.teacherProgress,[]);const saveTeacherProgress=(v)=>set(K.teacherProgress,v);
const storageTeacherEvents=()=>get(K.teacherEvents,[]);const saveTeacherEvents=(v)=>set(K.teacherEvents,v);
function resetDemo(){Object.values(K).forEach(k=>localStorage.removeItem(k));}
const S={session,saveSession,clearSession,studentProgress,saveStudentProgress,teacherAssessments:storageTeacherAssessments,saveTeacherAssessments,teacherProgress:storageTeacherProgress,saveTeacherProgress,teacherEvents:storageTeacherEvents,saveTeacherEvents,resetDemo};



const days=['월','화','수','목','금'];
function personalTimetable(student){const out={};for(const d of days){out[d]=baseTimetable[d].map(x=>{if(!x.block)return x;const subject=student.choices[x.block];const meta=choiceMeta[subject]||{};return {subject,block:x.block,teacher:meta.teacher||x.teacher,room:meta.room||x.room};});}return out;}
const dday=(date)=>{const t=new Date();t.setHours(0,0,0,0);const d=new Date(date+'T00:00:00');const n=Math.ceil((d-t)/86400000);return n===0?'D-Day':n>0?`D-${n}`:`D+${Math.abs(n)}`};
const urgency=(date)=>{const t=new Date();t.setHours(0,0,0,0);const d=new Date(date+'T00:00:00');const n=Math.ceil((d-t)/86400000);return n<=1?'urgent':n<=3?'soon':n<=7?'week':''};
const fmt=(d)=>new Date(d+'T12:00:00').toLocaleDateString('ko-KR',{month:'long',day:'numeric'});
const todayKey=()=>['일','월','화','수','목','금','토'][new Date().getDay()];
function relevantAssessment(a,s){return a.type==='class'?(a.grade===s.grade&&a.classNo===s.classNo):(s.choices[a.block]===a.subject);}
function relevantProgress(p,s){return p.type==='class'?(p.grade===s.grade&&p.classNo===s.classNo):(s.choices[p.block]===p.subject);}
const periodTimesMap=periodTimes;
const dateInput=(offset=0)=>{const d=new Date();d.setDate(d.getDate()+offset);return d.toISOString().slice(0,10)};
const uid=(prefix='id')=>prefix+Date.now().toString(36)+Math.random().toString(36).slice(2,6);



function request(path, payload) {
  return new Promise((resolve, reject) => {
    const id = (globalThis.crypto?.randomUUID?.() || (`ai_${Date.now()}_${Math.random().toString(36).slice(2)}`));
    bridge.pending.set(id, { resolve, reject });
    bridge.setTriggerValue('ai_request', { id, path, payload });
  });
}

const analyzeAssessmentAI = (text) => request('/api/analyze-assessment', {text});
const recommendTodayAI = (assessments) => request('/api/recommend-today', {assessments});
const planAssessmentsAI = (assessments) => request('/api/plan-assessments', {assessments});
const askSchoolAI = (question, context) => request('/api/school-question', {question, context});






const app=document.querySelector('#app');
let state={user:null,page:'home',assessmentFilter:'전체',selectedAssessment:null,aiMode:null};
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const toast=(msg)=>{const el=document.createElement('div');el.className='toast';el.textContent=msg;document.body.append(el);setTimeout(()=>el.remove(),2200)};

function mergedAssessments(){return [...assessments,...S.teacherAssessments()];}
function mergedProgress(){return [...progressRecords,...S.teacherProgress()];}
function mergedEvents(){return [...events,...S.teacherEvents()];}
function currentStudent(){return students.find(x=>x.id===state.user?.id)}
function currentTeacher(){return teachers.find(x=>x.id===state.user?.id)}
function studentAssessments(st=currentStudent()){return mergedAssessments().filter(a=>relevantAssessment(a,st)).sort((a,b)=>a.deadline.localeCompare(b.deadline));}
function studentProgressRecords(st=currentStudent()){return mergedProgress().filter(p=>relevantProgress(p,st)).sort((a,b)=>b.date.localeCompare(a.date));}
function userProgress(a,st=currentStudent()){const all=S.studentProgress();const k=`${st.id}:${a.id}`;return all[k]||{checked:a.id==='a1'?[0,1]:[]};}
function percent(a,st=currentStudent()){const p=userProgress(a,st);return Math.round((p.checked.length/(a.checklist?.length||1))*100)}
function saveCheck(a,index,checked){const st=currentStudent();const all=S.studentProgress();const k=`${st.id}:${a.id}`;const p=all[k]||{checked:[]};const set=new Set(p.checked);checked?set.add(index):set.delete(index);all[k]={checked:[...set]};S.saveStudentProgress(all);render();}

function aiAssessmentPayload(as=studentAssessments()){
 return as.map(a=>({
  id:a.id,
  title:a.title,
  subject:a.subject,
  block:a.block||null,
  deadline:a.deadline,
  dday:dday(a.deadline),
  score:a.score||0,
  workload:a.workload||3,
  progress:percent(a),
  method:a.method||'',
  materials:a.materials||[],
  unfinished:(a.checklist||[]).filter((_,i)=>!userProgress(a).checked.includes(i))
 }));
}
function aiSchoolContext(){
 const st=currentStudent();
 const tt=personalTimetable(st);
 return {
  student:{id:st.id,name:st.name,grade:st.grade,classNo:st.classNo,choices:st.choices},
  timetable:tt,
  assessments:studentAssessments(st).map(a=>({
   title:a.title,subject:a.subject,block:a.block||null,date:a.date,deadline:a.deadline,
   dday:dday(a.deadline),materials:a.materials,method:a.method,score:a.score,
   description:a.description,teacher:a.teacher,progress:percent(a)
  })),
  classProgress:studentProgressRecords(st).map(p=>({
   date:p.date,subject:p.subject,block:p.block||null,learned:p.learned,pages:p.pages,
   homework:p.homework,materials:p.materials,notice:p.notice,teacher:p.teacher
  })),
  events:mergedEvents(),
  tomorrowMaterials:materialsTomorrow(st)
 };
}
function aiResultBox(text){return `<div class="result-box">${esc(text)}</div>`}
function aiLoading(label='Gemini가 분석 중입니다...'){return `<div class="result-box muted">${label}</div>`}
function aiError(error){return `<div class="result-box">AI 요청에 실패했습니다.\n${esc(error?.message||String(error))}\n\n잠시 후 다시 시도해 주세요.</div>`}

function renderLogin(){
 app.innerHTML=`<div class="login-shell"><div class="login-wrap"><img class="logo" src="data:image/webp;base64,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" alt="학교 로고"><h1 class="login-title">잠신 플래너</h1><div class="login-card"><div class="switch"><button id="studentTab" class="active">학생 로그인</button><button id="teacherTab">교사 로그인</button></div><form id="loginForm" class="form-grid"><div id="studentFields"><input name="studentId" placeholder="학번" value="20101" required><input name="studentName" placeholder="이름" value="김이박" required></div><input name="loginId" class="hidden" placeholder="교사 ID 또는 이름"><input name="password" type="password" placeholder="비밀번호" value="1234" required><button class="btn" type="submit">로그인</button></form><div class="demo-note">데모 계정으로 체험할 수 있습니다.</div></div></div></div>`;
 let mode='student'; const st=document.querySelector('#studentTab'),tt=document.querySelector('#teacherTab'),sf=document.querySelector('#studentFields'),li=document.querySelector('[name=loginId]');
 st.onclick=()=>{mode='student';st.classList.add('active');tt.classList.remove('active');sf.classList.remove('hidden');li.classList.add('hidden')};
 tt.onclick=()=>{mode='teacher';tt.classList.add('active');st.classList.remove('active');sf.classList.add('hidden');li.classList.remove('hidden');li.value='teacher01'};
 document.querySelector('#loginForm').onsubmit=e=>{e.preventDefault();const f=new FormData(e.currentTarget);let u;if(mode==='student'){u=students.find(x=>x.id===f.get('studentId')&&x.name===f.get('studentName')&&x.password===f.get('password'));}else{u=teachers.find(x=>(x.id===f.get('loginId')||x.name===f.get('loginId'))&&x.password===f.get('password'));}if(!u){toast('로그인 정보를 확인해 주세요.');return}state.user={id:u.id,name:u.name,role:u.role};state.page='home';S.saveSession(state.user);render();};
}

const navStudent=[['home','홈'],['timetable','시간표'],['assessments','수행평가'],['progress','수업 진도'],['missed','오늘 놓친 수업'],['calendar','일정'],['ai','AI 도우미'],['my','MY']];
const navTeacher=[['home','홈'],['assessments','수행평가 관리'],['progress','수업 진도 관리'],['calendar','일정/공지'],['my','MY']];
function renderShell(){const nav=state.user.role==='student'?navStudent:navTeacher;app.innerHTML=`<div class="app-shell"><aside class="sidebar"><div class="brand"><img src="data:image/webp;base64,UklGRoQXAABXRUJQVlA4IHgXAABwbQCdASpDAScBPm00l0ikIqIhJHKp2IANiWNu/HyZVOZlmP0H9N7wa9XgPyy/Kf5261/Rvw1ydFc+a75b++/93+9/kB8zf836gvzF/2/cA/ST/Wf2n8fPi69Sv9i9Af9F/wf7U++r6Qf+B6hv98/zPr+eql6Cvlv/uL8MH7k/uv7U3/41jvyP/k+03+5f2D7wPMx9R/h/ym5gUS/5H95v1/+F/Z78wfk/vT+Nv+f6gX4t/J/7j+ZvB4gB/LP57/tv8N7KPvH+P9E/6f1APy64zegJ/Jf8N/2v6/7EmhX6o/ab4EP5r/af+5/g+1v6UZBNqE66ZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmXLj6ePxi9RbcnNwrVjI4o7I6aCLWKrUrcc44QpuQ0/x2UopvdDk//4+D/44ZxPzYbSbwV7PDrzO8zccdZQJ4tfI519E/hQbTlCupx4SPIX/hsB/+lOnSZCh89M4rfNouJjE6TEIbyuYK/fIGxi6VmvqO5EDTlRRKGXKcYqoxePt/70fxxDUe2VN0ApMEXBnU4pDhI3lRMQ/0SAxgNzdeWzxtrwh/4NGVw0/CFEfma7aSKc6UV1ccZhZ0fUQ1r/DmwfKcHh1uniGaxfA8zTEZ08D+I2c4YBw744JUHa44wJo9CGtswRQMWY57ewAwJHcrHSLH43EuEpwhidC4yVF6HnmW0JkUze+KUb4yqtcRtroBGECDn3uDTknNyz9jzxs6YB+32OlslKUO/uwgKIvgHZ6oYVwhDXaL5NchAo4jUGk8Fcs1fw7apgtJD3eEY8+QX/j6keJxJmswcR14M/7Vo//cB0LsVyl63hzmNr5WS7Fg8wvOtCujjtVV796+Vmddks1EQOUuEECFB39DPLjfNP2z7Gz7fxLBKs4JVEUofW8+2FyHrtohy0hsFuNYOzelHEMFng4d716PQQiEmosZkt0xzjzM15PbzxmPfCXflJ1moc5U4LRBjRogXBXDz7p//ab7/w8n9T1uOukgFtChqSjWOCbMqRlm3aMtwzWuGO6pE43MJy/+rpb1qE0G1A1cjkJcAEOs3NwbNCNIgSO1dBbqatgdKBACB+VVVVVVVVVWtVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVCAAD+/5YgAAAAAAAAZhMCFQ9XaJNwdunjaw2HLdZ5LK30F9N5McKEsesCITN0iIP6fhcqMxeM7yiUb1J66aXzLVyf+DmXZ+vATDqCLOB2L8s6zIpkINHFjPkOsi5OwEBj9n6qBNLO4rQf9fN6aeAVEECrgW5EtGfJWzo86lvwsl/s6UgCH+KW/GEPcUc06ghCwYGgGRJnFosqBUAoTKjoHOcHBkFConM3NGUl9tl2SnBEFwcSOetAsZ/358Aflr05aQWl9bqE3b7beOlIxKLWlaIqvHamv2bCmFdGzO8OVWPxT4crr/AfpUYojM00Ahrwupf4uBqjaRYRlz/YqSx56ZcNcU+2Xvlv/XoOI5xQiR3Mz61F95zAsPwr+P4zy08mlFG4Udyhqb+/B+OSB0+wCr75s1BwDhWA/kjeAT2eHngXaTOLwzDAjn6Qn8x7OGoaKNV4wcYRBcTjo32ngmQcx27VIbFjZF/XLvlZEQHgqlBQMBzpheg0mY4OWv8E0NiipbEcULvuOqBGzYJcnnmnONqsMdvBeiZ09j9B+87TfLGoZK4PbePAIsVV7U8k8P9qk+MrfBtzBnG3590VrN9VYxwmVevs/adhE2vWR9LCfYoa7gt2B4XcmUyse6TouSYsMrYYKdIVAcEKUF0C2bJYPqlvsRmmDkaQzhcYHSAmtXGjIrnBhotqUTgzqNKLMfOAg4+MiZyEc0fgouiqwnORxby6z+DEKOlCbVt4luE0jgo9kuoemIkAX/4irq8OQhN0tvQgyJtfHNJsoO+vtfInjqCYz6EqTyfaiReKYhkIKDy+LFeXyIyHk/yfbBgGjzGSR+kQkTUKJsHTvsp5+k0XsxaICz5/wLCAuNZh4aFjLBdaCgF9hS9H5tKLkFAjJ0UliDxLgwqSLmf+2flCPkNiTsWinx9Z4zqlw1/eGF5goZBn9FjNC7F6bsS0MIXINX9D6nBu/JU3GqhIg+VoQ95q9HZcO0NU1wbyBI4GXQvwTA5/KsdkaAgKQxDb8bZRu8s+SHfsLjQn0JNpl4SBuZFtSY2hBQeYG3Mm+/yQqGyXt4Rn63vZA9UtUw+UpjXBvqrfZ1gU8/Qx85R+GTE6bOHpmPKTnNjIICfRPb5P3s4o+P8422qyinMk/pj3lIKfZt3EuQ6JxSi7HaGqsB3df+uUTHe92+h2zQkNEqW10VO/5/XVkqR6Q3Mwyqh2uvwAnwPoijn+/SeB7c1Tfsb45WKmJk6Z0OkikwWzt7jeclrql/oHwq3f51nWFSzGQ5ae9DDyGwEMHwCZa8VDgFGyr0+bRrQViJW9k3kC9OJEoSHSe3tnDjKoPmDChNUd79VHhrIrhDeNf4KdbH2ZrWf3X7qWTE2vUX0PSum29MYjYwESTafLtkHYyRqSiKHZ7Ol8BRYBbCCia9abtfBja/VL7QM1wiqbsZRgyxbFvNwl/eAw4HVkG2O8PP4ZtH1tpbL3S4QbM1Spb/LjYboojYsA8OpCjjLBzQkwX3oJt5K2CRVkJHr41acBmB5JORHwRZzF68mtrK1QXhHP2KEyVOavccG7E6PN6YZli/X51p1mMscZt1Kn1mO3QTpE07O/4gOzqfrJ1fgvrXZGJiWBb4AreG0A/OTf3BRbn6SAiHdf+Do9deZ7Zvj4QHgpdI314mQjz1R/nSIQtL1H48bE0wAx9Z9B/8L2oHXdV3kc20c2c10qE5o4+d46aTlo0DmqiTdYbM+gw6wq7SAUKBaXiNE90zik1+K534QLriNwUxpR/qZRh44u/1nznunpwC1eEpdLZBrCFQiaiqD4V2XY7MsbsmoqmR98wqSIa0Yx5M8YsguBslp2c4O4jf5NHIMKIRI4wjrBV9ZLCy3IlKX/pXwgjuaUmxaVFhxoEusRyY8mMyxouJZWHIn039bTkO7G0B+IiGillf80W1ChCJWS8HB8XKfwDn/7eYbgYQ0E7V9I1VatI7FPnt1IiuUTEND0C7dtd+ZYiWNEEu1DhRaURDVo3Q9O7DOyhXrGcp8/xwqhUl9daN/xs0mAajh3V5Z50YUo6nxdM8mamUZcY7Ow9rLQTsYd72l+LIPYoD2TT+AQE9kAF8zA5d2BbfPGDPiQofYN0VXcuOaBOnOV9obeAFFGg6Yj6SHLNt0veKG1UPK5fDdYPNHfqxmNXH3lLPVk2zvO5DW7DNkaQca7/crADyxAOtCYoGY9Z6FcJQxRvFWGf/Vqc/3H/2NttB6BOyPyZEnLDv/1EH7F/E8dPBNd0EDQNJ41rY9ROgNG2/NckDPWYdfJhMsAzfYo0AhFkwXsdukHrLCShzWwaz5AYcEeKT5HaeCtp/RkzdRjxzy5UcEkX2twbIwwhk/brmvaeFeO9381ZBVAY7CDUGH3iNiEK9xTtbfFPnrVoRRsN0p4cef/9tzqUnNPN61vRSXIVqEBSLcduttnbh/6ILHLQozAihin1V2fujTJX4A6D5tLemBJFXxkDfF1/yQuPofE1AJil4gvB889Aj8qUns2aOVY8mynfstbr6En4myY96z3flhG8miFekcE7JCBqCqxnJGv/18WAwF8bH21CVQr43eCB8cx2jYgVQRoQZF6OpUhco/Q/3p+uLcd3Ew6vHVnN6UTuCqsBZx7qF8QQKizGM2uzNgle3TkyHdGXYz2Hsuer8pkYprId6kW6GHHRg40oKa1wzJd0sUX8NlnxjD8Iy9/SMApKoxacLjt6JN9XMVu5uMk7uN7JJLwK6a/nN9QGW3RY7Uo/6JI5ftsx0yMGhb+eSoakUcoHhY1ITZxRWWOWLaXi8YbSMklhRFSQ1lgIWwBEPFxnEB5ZCU9sWxuWqrG7oWesnlRR6ilGbgqhpNV5OW5r+BtQcYnMRHl4UXwYOYvPIuXx3RSaIRkXPi2bo2pIwADeRJv0H6wOAVhgtImXQzauHuQudfrSzgD+4WzehGGAl9wf995Vcbk9wzesW11gAD10g5H4TkSFsseF3yVIHHc5Flxr2tcU7psuWPk48pmWF9PZWbaAY04jnzibWGBdSLO6irp/NoKNg7TbIHAnPjuKzVWcK4Ew5uz3YS7RvrYXAc0ynpRjEY7jL5uHS3r++1q25EcvGdum3SjF0/uBdtKLQ1v8jE8LpODBCZmX0S/ceNpcjXjSHxstRtoB2jTnBpHWAEGy5u4xCTidsMo3nQQc0AG6R1lsozxNr2HQ+x4f/ZeqwgYRJUwShvPXdm2komD19ltGk+TqnFHwAW7hVHbnoFTcWptjhcOQU3l0LOgD3QmcIATRFNA9k61yOGtZ0r1unXhhiVtgFGLOBVPFGZWGOZ0zTtHULscAzQRLeCxkr3QPyPDR6PjJApvKbkodLfTDQsIjypZv0TCDHrrZ/u0xFFty4kGOnykg91DaRV+oCRF3Mwdwe1O4r0hqJlQxjY9PSFFLgEZfIU04rfvWS7zdzvZyCiBdPDFTbMUjjqMP9w8lUG3jMb3/zmnft8gsUf1NuNffSZ8DMf2UqDEhlW/tOhJG9+DbbFx4NkwIAtg43TLoXisqAwyesYQpgUlh6MfDRjsu5GlaUa+EK+bCORzb6IvADiOvrnSEvmK2BQSrqWGV/oRS82cAdEkA1F9Apc1sJm1VCNfb9qUTVoNbWvLLpugVlDKq+Y+sPKljJfC5i11yj8Zn0GhVP1ziU9EFPt+24A2foM+7e9e8/9rUqrqhu2SwVM2nx/BP05jbnmEcGhrC/kzsVxcTkhgHBQ/R55xbKEoXj0lRPFKLy4J6KKydPCOn6l/+GkQ98nc2Gx+EucJqjhLry5HZXYPF8G+5Dij+PE3U7XzvzqZdLhbDk6nK5s9j+NduG45pazYsS+YfRaXu6XeQ3AsPaZzVKxwJy6dbtBV/dyBKReihn5MP+97m1gZGrHKw0pXYmng4YyRxZKs27PSXJhqeWbiKAX7wOezaT3Fxf982Um0JAyFSCvH3xp8YAzoy+o7kgSE1di3Dav9rCOGSGQHuR7+HW90iey25iKH6Mhy6sTGfxE0FPyIjs6LyN8lhQf8l6dD6iPHtOAmLtxr4WdZACoV8Hbp/3rgda94wA7QhLfWMronVzabu6vq9EXh/QZW1c9fMq7ERybAcaTuGkBfj4Wh4i1j/TGlPixvuixbZbLw892e198/pfxXVkwkfIs+R05Kf1i+w9GCTWtY1xT3NadwrpOzv6apOis9opb75+/mHlFJDaDQO8bjKOQTLBn+0fOFu1Mya+SQVmaj1o5zPF/iAFvE457+m1Z1/+4Y61cnZBUpxLbNzz89lzeppC2gBN7vpJVfk4mdTGVBkYasZv6OSPE9HwkpjioObyoJcvfsCFOhauk4aX1cYBGiMORMqVIhXzvNoUGKb5n8Uy3dOosLHGhlEpzHK4iQM4Cs5dbiRWlKNxL6rfFkILgaumEv11bU5Y+od7KL+rO8VXjmBtyLP4W4eBepWKTvmbet5P/BmBwz54/8t3x1o1f6vczcgweHSkT1es4/ySjScDdjBaPiRy7NPJBTD7EKaOREM++IOn28r/wQ+R5RZeIACcga7q1e/dMO4TyJFiiIHLrJUWGqcshsiTI1+ZDPUnnPNnrjck4XPpZczPFLV+15oEzsRPaHBms3U7X2CE6Bm3RPNzDO83bxxiQlusfdegxDH1BQ2TJcIFC/sqzuI6hXNJbNDy5ElXrUm/wgJJewG0QvvOoIzJ/ED7uxIA8PwaGeTEjeqv/Wlmdduhe98LFgldL4A/5wDGF/HE8xgK4btP1SSWP1ltBtajInBHZrR7w/251JvTQSP7Eddx5nI/jm/qgVFPQgdRDdeATW8XOoOwQX59/aWQFYM2l7NQrt8ENbhOKLPK3lQ4UnndlHJ/aZPDhuov0CnLB/OYGmntz0XS7clxiRF9KfipKKGCEsUa9N392GmVBr/M3YvW6pImVY8rj9OARXMcP6tgVrV+r65OYzuGbxm07mcIOoANlIpo08ao0cMKHuvwkC1KI3cL7Hkio/6L2/L2iOiqERWjZP7Ff7HMbEOndWgohIclkoo9OpHYepft+nLfranPxJcLXywuCjGBH/XpyNMsw5/GTTypiDNf/QQi6yg43b0OYeTE7NZq6ZK44G2T65DX+hoji0XfHnM72WmRb55cKZJ++23PjX2nOH/sJhgWgqWbLcx/Lx4D9Kbj5nS7ys0Vd9/Rv5Y2Dfvv5LkhvAda9kw+FHba9MO6UZMguvp+kvj79X0quFdJ78gO/DJF4SLzpD9LZ6zJNnoAWDRVCBiYkr1xZ6FbhFek6//hFhzbI4I0NzgK1jBl9iCO9F7yLQt3nP7wSgow+ZsvsF0Oh1kSFdq3hT2C5eEo0QcNbesa1FCDfZ1Kas0KnkcD1RWkMEtQV/Kruxe9oS1lA6deHbDl5j1PWBHuZO/YTJDoG8nNzJriOB8u3TSrszvSGoBODzaGVwanT0cNo8oMfiElfDMOhCGABUGLSguCH2sPXhc6TDCRZ8HYKiZKxQfEZuVAIZcsa8/ywnnl/gjTK87fMmROZPmGuQwMtTLzYO5neCYkRJpn7CaXk4l/16CVS/72U28H5lnJOnbKQEOJP+EQFgj0ZDhJfN6X4yexOhsUIGFrKAs0AsJuWnyaCQdEQsrYkGVYRRrvHCnrM9GVZczpOKRDASDWW7Qcd7dwG1w28Ff42MNviS7m0uH+QWNMTlcp2WoZoc2yFsYSJC2s0DEhCoqqnEmuDQFWCCPHLMs+NdthCIKgHR4pRSWFEclz42XD41ty6D01UGYJI23VokQE2M2StAm0jd5sn/nLnB02Mf8YBBc7FliqK909HpmiHnJppVygMuShUn3/LTNBBcdK1YfIcob3qyDFrvdLMdnipknCy/LwHY+r4tfgQIZijoDGzryAw+T53RS+Wq3eo1fRCPFQuov1aAenn3xvYLrSa8X4HXRCv4qj4iUPHbaaEBTIiErR0ePHT4e6r5mQuwVliQbSs9azgS3Q3Bnnp2Viz1IlD1ZuFe5a6yTvbVpZ9q2tenK6xfyy8ikMJiPmnDtEymRm7BH/l5AxaYP55b4P+A3Z8+iZAmWrQB0femhcQZeScJfgpRzwByjKbbk1PSXCjEQ6ik56j4FsWE7NT50NNXMNHybUyutIV2u0Ry0gVqgxhVMgf2LXJy34BZiJYrTRrCkVadKTOTzDzR28yR9PirL1xa70zbKHEOHikH6O2YRq67YoJHqykC15dfqj7mBsdTSqGv1GDssx9AiT/OROwz6bUpWuS09UCk8hNN2tiE3C1tDwmrfzINo0eUFSLgoJqW0idWPt7Jsp96KCbFcywdf0d/2Sd4vXtEURTEJHqw5qOA/NtTYmC37AGolwMGP5dVGxarP4g0cZIQb9A4H/Eeky2dz023V0raEWFva+5jfo50dwkfpgAB0ekbhmicenR8oPBl61rW7ySeadm3/2Z//0NN+YfGjp2J9w2mkrrTS3fv9HSM2VgkwiXB02h8+TJEz/GreNL0IuZwmcbIn/Ast5/ugDyQ7g+PQwxBMKBMnFADKZai8HFYEWOoYh0iYofeDqAzS623LfViCIbvpjeiQAfPF6hjD14mUPli3eJ1kNaAAAG7GDHCUjZrlOUN4eLgGzeCeU/vnaYb7vdlV093r5DtbwXB0l1k+xqkbwgDv7tHjEq+wXo8gJmPjtDN//IWfVvY5+EDLKJ9NI3RijzGyb9e8uvpig2MuZ+dE/O6vCFQVMfyQwBKywauY7j1xZVRwKRtyIh1LDfVs0KBS+JBCduW/48oVrb19mqnD9vB6LP2NU9t9gWK+ssIxOTaZFJ9INIeNv/+Io9t6KS+Xtm3GyGUhlAk3vWlNd+nMfaAAAAAAAAACe3XrOAAAA=="><span>잠신 플래너</span></div><div class="nav">${nav.map(([k,l])=>`<button data-page="${k}" class="${state.page===k?'active':''}">${l}</button>`).join('')}</div><div class="sidebar-bottom"><button class="btn secondary" id="resetBtn" style="width:100%">데모 데이터 초기화</button></div></aside><div class="content"><header class="topbar"><input id="globalSearch" class="search" placeholder="수행평가, 수업 진도, 준비물 검색"><div class="user-chip">${esc(state.user.name)} · ${state.user.role==='student'?'학생':'교사'}</div></header><main id="main" class="main"></main></div></div><nav class="mobile-nav">${nav.slice(0,5).map(([k,l])=>`<button data-page="${k}" class="${state.page===k?'active':''}">${l}</button>`).join('')}</nav>`;
 document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{state.page=b.dataset.page;state.selectedAssessment=null;render()});
 document.querySelector('#resetBtn').onclick=()=>{if(confirm('localStorage에 저장된 데모 변경 데이터를 모두 초기화할까요?')){S.resetDemo();state.user=null;render();}};
 document.querySelector('#globalSearch').onkeydown=e=>{if(e.key==='Enter'){showSearch(e.currentTarget.value)}};
 renderPage();
}
function renderPage(){const main=document.querySelector('#main');if(state.user.role==='teacher'){({home:teacherHome,assessments:teacherAssessmentsPage,progress:teacherProgress,calendar:teacherCalendar,my:myPage}[state.page]||teacherHome)(main);return}({home:studentHome,timetable:timetablePage,assessments:assessmentPage,progress:progressPage,missed:missedPage,calendar:calendarPage,ai:aiPage,my:myPage}[state.page]||studentHome)(main)}

function studentHome(main){const st=currentStudent(),tt=personalTimetable(st),today=todayKey(),as=studentAssessments(st),prs=studentProgressRecords(st);const todayClasses=tt[today]||[];main.innerHTML=`<div class="card hero"><div class="hero-name">${st.id} ${st.name}</div><div>${st.grade}학년 ${st.classNo}반</div><div class="choice-line">${Object.entries(st.choices).map(([k,v])=>`${k} ${v}`).join(' · ')}</div></div><div class="grid two" style="margin-top:16px"><section class="card"><div class="section-title"><h3>오늘 시간표</h3><span class="pill blue">${today}요일</span></div>${todayClasses.length?`<div class="list">${todayClasses.map((x,i)=>`<div class="list-item row space"><div><strong>${i+1}교시 · ${x.subject}</strong><span class="small muted">${x.block?x.block+' · ':''}${x.teacher} · ${x.room}</span></div><span class="tiny muted">${periodTimes[i+1].split(' ~ ')[0]}</span></div>`).join('')}</div>`:'<div class="empty">오늘은 정규 수업이 없습니다.</div>'}</section><section class="card"><div class="section-title"><h3>오늘 해야 할 일</h3><button class="btn ghost" id="todayAi">AI 추천</button></div>${as.slice(0,3).map(a=>`<div class="list-item"><div class="row space"><strong>${a.title}</strong><span class="pill ${urgency(a.deadline)==='urgent'?'red':urgency(a.deadline)==='soon'?'orange':'yellow'}">${dday(a.deadline)}</span></div><div class="small muted">진행률 ${percent(a)}% · ${a.score}점</div><div class="progress" style="margin-top:7px"><span style="width:${percent(a)}%"></span></div></div>`).join('')}</section><section class="card"><h3>다가오는 수행평가</h3><div class="list">${as.slice(0,4).map(a=>`<div class="list-item row space"><div><strong>${a.title}</strong><span class="small muted">${a.subject}${a.block?' · '+a.block:''} · ${fmt(a.deadline)}</span></div><span class="pill">${dday(a.deadline)}</span></div>`).join('')}</div></section><section class="card"><h3>내일 준비물</h3>${materialsTomorrow(st).length?materialsTomorrow(st).map(x=>`<div class="list-item"><strong>${x.subject}${x.block?' · '+x.block:''}</strong><span class="small muted">${x.materials.join(', ')}</span></div>`).join(''):'<div class="empty">등록된 준비물이 없습니다.</div>'}</section><section class="card"><h3>최근 수업 진도</h3>${prs.slice(0,3).map(p=>`<div class="list-item"><strong>${p.subject}${p.block?' · '+p.block:''}</strong><span class="small muted">${fmt(p.date)} · ${p.learned.join(', ')}</span></div>`).join('')}</section><section class="card"><h3>AI 오늘의 추천</h3><div class="result-box">${todayRecommendation(as)}</div></section></div>`;document.querySelector('#todayAi').onclick=()=>{state.page='ai';state.aiMode='today';render()}}
function materialsTomorrow(st){const t=new Date();t.setDate(t.getDate()+1);const dk=['일','월','화','수','목','금','토'][t.getDay()];const subjects=(personalTimetable(st)[dk]||[]).map(x=>x.subject);const out=[];for(const p of studentProgressRecords(st)){if(subjects.includes(p.subject)&&p.materials?.length&&!out.some(x=>x.subject===p.subject))out.push({subject:p.subject,block:p.block,materials:[...new Set(p.materials)]})}for(const a of studentAssessments(st)){if(subjects.includes(a.subject)&&a.materials?.length&&!out.some(x=>x.subject===a.subject))out.push({subject:a.subject,block:a.block,materials:[...new Set(a.materials)]})}return out}
function todayRecommendation(as){if(!as.length)return '현재 등록된 수행평가가 없습니다.';const a=as[0];return `${a.title}의 마감일이 가장 가깝습니다. 현재 진행률은 ${percent(a)}%이므로 오늘은 ${a.checklist.find((_,i)=>!userProgress(a).checked.includes(i))||'최종 검토'}를 우선 진행하는 것을 추천합니다.`}

function timetablePage(main){const st=currentStudent(),tt=personalTimetable(st);main.innerHTML=`<div class="page-head"><div><h1>개인 시간표</h1><p>학급 기본 시간표와 F/G/H/I/J 선택과목을 결합한 개인 시간표입니다.</p></div></div><div class="card timetable-wrap"><table class="timetable"><thead><tr><th class="period-col">교시</th>${days.map(d=>`<th>${d}</th>`).join('')}</tr></thead><tbody>${[1,2,3,4,5,6,7].map(p=>`<tr><th class="period-col">${p}교시<div class="tiny muted">${periodTimes[p].split(' ~ ')[0]}</div></th>${days.map(d=>{const x=tt[d][p-1];return `<td class="class-cell ${!x?'off':''}">${x?`<div class="subject">${esc(x.subject)}</div>${x.block?`<span class="pill blue">${x.block}</span>`:''}<div class="teacher">${esc(x.teacher)}</div><div class="room">${esc(x.room)}</div>`:'수업 없음'}</td>`}).join('')}</tr>`).join('')}</tbody></table></div>`}

function assessmentPage(main){const st=currentStudent(),all=studentAssessments(st);const filtered=state.assessmentFilter==='전체'?all:state.assessmentFilter==='학급 수업'?all.filter(a=>a.type==='class'):all.filter(a=>a.block===state.assessmentFilter);main.innerHTML=`<div class="page-head"><div><h1>수행평가</h1><p>내가 실제로 수강하는 과목의 수행평가만 표시됩니다.</p></div></div><div class="filters">${['전체','학급 수업','F','G','H','I','J'].map(f=>`<button data-filter="${f}" class="${state.assessmentFilter===f?'active':''}">${f}</button>`).join('')}</div><div class="assessment-grid">${filtered.map(a=>assessmentCard(a)).join('')||'<div class="empty">해당 수행평가가 없습니다.</div>'}</div>`;document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{state.assessmentFilter=b.dataset.filter;render()});document.querySelectorAll('[data-assess]').forEach(b=>b.onclick=()=>assessmentDetail(b.dataset.assess))}
function assessmentCard(a){return `<article class="card assessment-card ${urgency(a.deadline)}" data-assess="${a.id}" style="cursor:pointer"><div class="row space"><span class="pill ${a.block?'blue':''}">${a.subject}${a.block?' · '+a.block:''}</span><span class="pill">${dday(a.deadline)}</span></div><h3 style="margin-top:12px">${a.title}</h3><div class="small muted">${fmt(a.deadline)} · ${a.method} · ${a.score}점</div><div class="row space" style="margin-top:12px"><span class="small">진행률 ${percent(a)}%</span><span class="small muted">${a.teacher}</span></div><div class="progress"><span style="width:${percent(a)}%"></span></div></article>`}
function assessmentDetail(id){
 const a=mergedAssessments().find(x=>x.id===id);if(!a)return;
 const p=userProgress(a);
 document.body.insertAdjacentHTML('beforeend',`<div class="modal-backdrop" id="modal"><div class="modal"><div class="modal-head"><h2>${a.title}</h2><button class="icon-btn" id="closeModal">✕</button></div><p>${a.description}</p><div class="grid two"><div class="list-item"><strong>일정</strong>${fmt(a.date)} / 마감 ${fmt(a.deadline)} (${dday(a.deadline)})</div><div class="list-item"><strong>제출</strong>${a.method} · ${a.score}점</div><div class="list-item"><strong>준비물</strong>${a.materials.join(', ')}</div><div class="list-item"><strong>담당 교사</strong>${a.teacher}</div></div><h3 style="margin-top:18px">개인 체크리스트 · ${percent(a)}%</h3><div class="progress"><span style="width:${percent(a)}%"></span></div><div style="margin-top:10px">${a.checklist.map((x,i)=>`<label class="check-row"><input data-check="${i}" type="checkbox" ${p.checked.includes(i)?'checked':''}><span>${x}</span></label>`).join('')}</div><div class="section-title" style="margin-top:18px"><h3>AI 분석</h3><button class="btn ghost" id="detailAiBtn">Gemini로 분석</button></div><div id="detailAiResult" class="result-box">버튼을 누르면 현재 수행평가 정보를 Gemini가 분석합니다.</div></div></div>`);
 document.querySelector('#closeModal').onclick=()=>document.querySelector('#modal').remove();
 document.querySelector('#modal').onclick=e=>{if(e.target.id==='modal')e.currentTarget.remove()};
 document.querySelectorAll('[data-check]').forEach(c=>c.onchange=()=>saveCheck(a,+c.dataset.check,c.checked));
 document.querySelector('#detailAiBtn').onclick=async()=>{
  const result=document.querySelector('#detailAiResult');
  result.textContent='Gemini가 분석 중입니다...';
  const text=`수행평가명: ${a.title}\n과목: ${a.subject}${a.block?` (${a.block} 선택수업)`:''}\n수행평가 설명: ${a.description}\n수행평가 날짜: ${a.date}\n제출 마감일: ${a.deadline}\n준비물: ${a.materials.join(', ')}\n제출 방법: ${a.method}\n배점: ${a.score}점\n담당 교사: ${a.teacher}\n체크리스트: ${a.checklist.join(', ')}`;
  try{result.textContent=await analyzeAssessmentAI(text)}
  catch(error){result.textContent=`AI 요청에 실패했습니다.\n${error.message}\n\n잠시 후 다시 시도해 주세요.`}
 };
}

function progressPage(main){const st=currentStudent(),prs=studentProgressRecords(st);main.innerHTML=`<div class="page-head"><div><h1>수업 진도</h1><p>실제로 수강하는 과목의 진도, 숙제와 준비물을 확인합니다.</p></div></div><div class="list">${prs.map(progressCard).join('')||'<div class="empty">등록된 진도가 없습니다.</div>'}</div>`}
function progressCard(p){return `<article class="card"><div class="row space"><h3>${p.subject}${p.block?' · '+p.block:''}</h3><span class="pill">${fmt(p.date)}</span></div><div class="grid two"><div><strong>오늘 배운 내용</strong><div class="small muted">${p.learned.join('<br>')}</div></div><div><strong>교과서</strong><div class="small muted">${p.pages||'-'}</div></div><div><strong>숙제</strong><div class="small muted">${p.homework||'-'}</div></div><div><strong>다음 시간 준비물</strong><div class="small muted">${p.materials?.join(', ')||'-'}</div></div></div><div class="list-item" style="margin-top:12px"><strong>전달사항</strong><span class="small muted">${p.notice||'없음'}</span></div></article>`}

function missedPage(main){const st=currentStudent();main.innerHTML=`<div class="page-head"><div><h1>오늘 놓친 수업</h1><p>결석·지각한 날짜의 수업 내용, 숙제, 준비물을 한 번에 확인합니다.</p></div><input id="missedDate" type="date" value="${dateInput(-1)}" style="max-width:180px"></div><div id="missedList"></div>`;const draw=()=>{const date=document.querySelector('#missedDate').value,d=new Date(date+'T12:00:00'),dk=['일','월','화','수','목','금','토'][d.getDay()],classes=personalTimetable(st)[dk]||[],prs=studentProgressRecords(st);document.querySelector('#missedList').innerHTML=classes.length?classes.map((c,i)=>{const p=prs.find(x=>x.date===date&&x.subject===c.subject);return `<div class="card" style="margin-bottom:12px"><div class="row space"><h3>${i+1}교시 · ${c.subject}${c.block?' · '+c.block:''}</h3><span class="tiny muted">${periodTimes[i+1]}</span></div>${p?`<div class="grid two"><div><strong>오늘 배운 내용</strong><div class="small muted">${p.learned.join(', ')}</div></div><div><strong>교과서</strong><div class="small muted">${p.pages}</div></div><div><strong>숙제</strong><div class="small muted">${p.homework||'-'}</div></div><div><strong>준비물</strong><div class="small muted">${p.materials?.join(', ')||'-'}</div></div></div><div class="list-item" style="margin-top:10px"><strong>전달사항</strong><span class="small muted">${p.notice||'-'}</span></div>`:`<div class="empty">아직 수업 내용이 등록되지 않았습니다.</div>`}</div>`}).join(''):'<div class="empty">선택한 날짜에는 정규 수업이 없습니다.</div>'};document.querySelector('#missedDate').onchange=draw;draw()}

function calendarPage(main){renderCalendar(main,false)}
function renderCalendar(main,teacher){const all=[...mergedEvents(),...mergedAssessments().map(a=>({id:'cal-'+a.id,date:a.deadline,type:'assessment',title:a.title}))];let cursor=new Date();cursor.setDate(1);const y=cursor.getFullYear(),m=cursor.getMonth();const first=new Date(y,m,1).getDay(),last=new Date(y,m+1,0).getDate();main.innerHTML=`<div class="page-head"><div><h1>${teacher?'일정 / 공지 관리':'학교 일정'}</h1><p>${y}년 ${m+1}월</p></div>${teacher?'<button class="btn" id="addEventBtn">+ 일정 등록</button>':''}</div><div class="calendar-wrap"><div class="calendar">${['일','월','화','수','목','금','토'].map(x=>`<div class="cal-head">${x}</div>`).join('')}${Array(first).fill('<div class="cal-day muted"></div>').join('')}${Array.from({length:last},(_,i)=>{const date=`${y}-${String(m+1).padStart(2,'0')}-${String(i+1).padStart(2,'0')}`;const ev=all.filter(e=>e.date===date);return `<div class="cal-day"><div class="cal-num">${i+1}</div>${ev.slice(0,3).map(e=>`<span class="event-dot ${e.type}">${e.title}</span>`).join('')}</div>`}).join('')}</div></div>`;if(teacher)document.querySelector('#addEventBtn').onclick=eventModal}

function aiPage(main){
 const as=studentAssessments();
 main.innerHTML=`<div class="page-head"><div><h1>AI 도우미</h1><p>Gemini API를 이용해 수행평가 분석과 학업 계획을 도와줍니다.</p></div><span class="pill blue">Gemini 연결</span></div><div class="grid two"><div class="ai-card" data-ai="analyze"><h3>수행평가 분석하기</h3><p class="muted small">안내문을 붙여 넣으면 핵심 내용과 해야 할 일을 실제 AI가 정리합니다.</p></div><div class="ai-card" data-ai="today"><h3>오늘 일정 추천받기</h3><p class="muted small">마감일, 진행률, 배점, 작업량을 기준으로 오늘 할 일을 추천합니다.</p></div><div class="ai-card" data-ai="plan"><h3>수행평가 계획 세우기</h3><p class="muted small">현재 등록된 수행평가를 바탕으로 현실적인 진행 계획을 만듭니다.</p></div><div class="ai-card" data-ai="school"><h3>학교생활 질문하기</h3><p class="muted small">현재 앱의 데모 데이터와 localStorage 데이터만 근거로 답합니다.</p></div></div><div id="aiWork" style="margin-top:16px"></div>`;
 document.querySelectorAll('[data-ai]').forEach(x=>x.onclick=()=>drawAi(x.dataset.ai));
 if(state.aiMode){drawAi(state.aiMode);state.aiMode=null}
}

async function drawAi(mode){
 const box=document.querySelector('#aiWork');
 const as=studentAssessments();

 if(mode==='analyze'){
  box.innerHTML=`<div class="card"><h3>수행평가 안내문 분석</h3><textarea id="aiText" placeholder="수행평가 안내문을 붙여 넣으세요."></textarea><button class="btn" id="runAi" style="margin-top:10px">Gemini로 분석하기</button><div id="aiResult" style="margin-top:12px"></div></div>`;
  document.querySelector('#runAi').onclick=async()=>{
   const text=document.querySelector('#aiText').value.trim();
   const result=document.querySelector('#aiResult');
   if(!text){result.innerHTML=aiResultBox('수행평가 안내문을 먼저 입력해 주세요.');return}
   result.innerHTML=aiLoading();
   try{result.innerHTML=aiResultBox(await analyzeAssessmentAI(text))}
   catch(error){result.innerHTML=aiError(error)}
  };
  return;
 }

 if(mode==='today'){
  box.innerHTML=`<div class="card"><div class="section-title"><h3>오늘 추천</h3><span class="pill blue">Gemini 분석</span></div><div id="aiResult">${aiLoading('현재 수행평가를 분석해 오늘 할 일을 정하는 중입니다...')}</div></div>`;
  try{document.querySelector('#aiResult').innerHTML=aiResultBox(await recommendTodayAI(aiAssessmentPayload(as)))}
  catch(error){document.querySelector('#aiResult').innerHTML=aiError(error)}
  return;
 }

 if(mode==='plan'){
  box.innerHTML=`<div class="card"><div class="section-title"><h3>수행평가 계획</h3><span class="pill blue">Gemini 분석</span></div><div id="aiResult">${aiLoading('마감일과 진행률을 바탕으로 계획을 만드는 중입니다...')}</div></div>`;
  try{document.querySelector('#aiResult').innerHTML=aiResultBox(await planAssessmentsAI(aiAssessmentPayload(as)))}
  catch(error){document.querySelector('#aiResult').innerHTML=aiError(error)}
  return;
 }

 box.innerHTML=`<div class="card"><h3>학교생활 질문</h3><input id="schoolQ" placeholder="예: 물리 수행평가 준비물이 뭐야?"><button class="btn" id="askQ" style="margin-top:10px">Gemini에게 질문하기</button><div id="aiResult" style="margin-top:12px"></div><p class="tiny muted" style="margin-top:10px">Gemini에는 현재 로그인한 학생에게 해당하는 잠신 플래너 데이터만 전달합니다. 앱에 없는 정보는 사실처럼 만들지 않도록 제한합니다.</p></div>`;
 document.querySelector('#askQ').onclick=async()=>{
  const question=document.querySelector('#schoolQ').value.trim();
  const result=document.querySelector('#aiResult');
  if(!question){result.innerHTML=aiResultBox('질문을 입력해 주세요.');return}
  result.innerHTML=aiLoading('잠신 플래너 데이터를 확인해 답변하는 중입니다...');
  try{result.innerHTML=aiResultBox(await askSchoolAI(question,aiSchoolContext()))}
  catch(error){result.innerHTML=aiError(error)}
 };
}

function myPage(main){const u=state.user.role==='student'?currentStudent():currentTeacher();main.innerHTML=`<div class="page-head"><div><h1>MY</h1><p>현재 로그인한 데모 계정 정보입니다.</p></div></div><div class="card" style="max-width:650px">${state.user.role==='student'?`<div class="list"><div class="list-item"><strong>${u.name} · ${u.id}</strong><span class="small muted">${u.grade}학년 ${u.classNo}반</span></div>${Object.entries(u.choices).map(([k,v])=>`<div class="list-item row space"><strong>${k} 선택수업</strong><span>${v}</span></div>`).join('')}</div>`:`<div class="list"><div class="list-item"><strong>${u.name} · ${u.id}</strong></div><div class="list-item">담당 과목: ${u.subjects.join(', ')}</div><div class="list-item">담당 선택수업: ${u.choiceBlocks.join(', ')}</div></div>`}<button class="btn danger" id="logoutBtn" style="margin-top:18px">로그아웃</button></div>`;document.querySelector('#logoutBtn').onclick=()=>{S.clearSession();state.user=null;render()}}

function teacherHome(main){const t=currentTeacher();main.innerHTML=`<div class="card hero"><div class="hero-name">${t.name} 선생님</div><div class="choice-line">담당 과목 ${t.subjects.join(', ')} · 선택수업 ${t.choiceBlocks.join(', ')}</div></div><div class="grid three" style="margin-top:16px"><div class="card"><div class="metric">${S.teacherAssessments().length}</div><div class="muted">추가한 수행평가</div></div><div class="card"><div class="metric">${S.teacherProgress().length}</div><div class="muted">추가한 수업 진도</div></div><div class="card"><div class="metric">${S.teacherEvents().length}</div><div class="muted">추가한 일정/공지</div></div></div><div class="card" style="margin-top:16px"><h3>교사 데모 기능</h3><p class="muted">등록한 정보는 이 브라우저의 localStorage에 저장되며, 로그아웃 후 학생 계정으로 로그인하면 즉시 확인할 수 있습니다.</p></div>`}
function teacherAssessmentCard(a){return `<article class="card assessment-card ${urgency(a.deadline)}" data-assess="${a.id}" style="cursor:pointer"><div class="row space"><span class="pill ${a.block?'blue':''}">${esc(a.subject)}${a.block?' · '+esc(a.block):''}</span><span class="pill">${dday(a.deadline)}</span></div><h3 style="margin-top:12px">${esc(a.title)}</h3><div class="small muted">${fmt(a.deadline)} · ${esc(a.method||'제출 방법 미등록')} · ${a.score||0}점</div><div class="row space" style="margin-top:12px"><span class="small muted">${esc(a.type==='choice'?'선택수업':'학급 수업')}</span><span class="small muted">${esc(a.teacher||'담당 교사 미등록')}</span></div></article>`}
function teacherAssessmentsPage(main){const t=currentTeacher(),own=mergedAssessments().filter(a=>t.subjects.includes(a.subject));main.innerHTML=`<div class="page-head"><div><h1>수행평가 관리</h1><p>담당 과목에 해당하는 수행평가만 관리합니다.</p></div><button class="btn" id="addAssessBtn">+ 수행평가 등록</button></div><div class="assessment-grid">${own.map(a=>teacherAssessmentCard(a)).join('')||'<div class="empty">담당 과목에 등록된 수행평가가 없습니다.</div>'}</div>`;document.querySelector('#addAssessBtn').onclick=assessmentModal;document.querySelectorAll('[data-assess]').forEach(x=>x.onclick=()=>assessmentDetailTeacher(x.dataset.assess))}
function assessmentModal(){document.body.insertAdjacentHTML('beforeend',`<div class="modal-backdrop" id="modal"><form class="modal" id="assessForm"><div class="modal-head"><h2>수행평가 등록</h2><button type="button" class="icon-btn" id="closeModal">✕</button></div><div class="form-cols" style="margin-top:14px"><input name="title" class="full" placeholder="수행평가명" required><input name="subject" value="물리" readonly><select name="block"><option value="F">F 선택수업</option></select><input name="deadline" type="date" value="${dateInput(5)}" required><input name="score" type="number" value="20" placeholder="배점"><input name="materials" placeholder="준비물 (쉼표 구분)" value="계산기, 필기구"><input name="method" placeholder="제출 방법" value="보고서 파일 제출"><textarea name="description" class="full" placeholder="수행평가 설명"></textarea><input name="checklist" class="full" value="내용 확인, 주제 선정, 자료 조사, 작성, 최종 검토, 제출" placeholder="체크리스트 (쉼표 구분)"></div><button class="btn" style="margin-top:14px">저장</button></form></div>`);document.querySelector('#closeModal').onclick=()=>document.querySelector('#modal').remove();document.querySelector('#assessForm').onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.currentTarget));const a={id:uid('ta'),title:f.title,subject:f.subject,type:'choice',block:f.block,grade:2,classNo:null,date:f.deadline,deadline:f.deadline,score:+f.score||0,materials:f.materials.split(',').map(x=>x.trim()).filter(Boolean),method:f.method,description:f.description,teacher:currentTeacher().name,registered:dateInput(0),workload:3,checklist:f.checklist.split(',').map(x=>x.trim()).filter(Boolean)};S.saveTeacherAssessments([...S.teacherAssessments(),a]);document.querySelector('#modal').remove();toast('수행평가를 등록했습니다.');render()}}
function assessmentDetailTeacher(id){const a=mergedAssessments().find(x=>x.id===id);document.body.insertAdjacentHTML('beforeend',`<div class="modal-backdrop" id="modal"><div class="modal"><div class="modal-head"><h2>${a.title}</h2><button class="icon-btn" id="closeModal">✕</button></div><p>${a.description}</p><div class="list-item">${a.subject} · ${a.block||'학급'} · ${fmt(a.deadline)} · ${a.score}점</div><p class="small muted">기본 데모 항목은 원본 데이터 보호를 위해 직접 삭제하지 않습니다. 교사가 추가한 항목은 localStorage에 저장됩니다.</p></div></div>`);document.querySelector('#closeModal').onclick=()=>document.querySelector('#modal').remove()}
function teacherProgress(main){const t=currentTeacher(),own=mergedProgress().filter(p=>t.subjects.includes(p.subject));main.innerHTML=`<div class="page-head"><div><h1>수업 진도 관리</h1><p>수업 진도, 숙제, 준비물, 전달사항을 등록합니다.</p></div><button class="btn" id="addProgressBtn">+ 수업 진도 등록</button></div><div class="list">${own.map(progressCard).join('')}</div>`;document.querySelector('#addProgressBtn').onclick=progressModal}
function progressModal(){document.body.insertAdjacentHTML('beforeend',`<div class="modal-backdrop" id="modal"><form class="modal" id="progressForm"><div class="modal-head"><h2>수업 진도 등록</h2><button type="button" class="icon-btn" id="closeModal">✕</button></div><div class="form-cols" style="margin-top:14px"><input name="date" type="date" value="${dateInput(0)}" required><input name="subject" value="물리" readonly><select name="block"><option value="F">F 선택수업</option></select><input name="pages" placeholder="교과서 페이지"><textarea name="learned" class="full" placeholder="오늘 배운 내용 (줄바꿈 구분)"></textarea><input name="homework" placeholder="숙제"><input name="materials" placeholder="다음 시간 준비물 (쉼표 구분)"><textarea name="notice" class="full" placeholder="전달사항"></textarea></div><button class="btn" style="margin-top:14px">저장</button></form></div>`);document.querySelector('#closeModal').onclick=()=>document.querySelector('#modal').remove();document.querySelector('#progressForm').onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.currentTarget));const p={id:uid('tp'),date:f.date,subject:f.subject,type:'choice',block:f.block,grade:2,classNo:null,learned:f.learned.split('\n').map(x=>x.trim()).filter(Boolean),pages:f.pages,homework:f.homework,materials:f.materials.split(',').map(x=>x.trim()).filter(Boolean),notice:f.notice,teacher:currentTeacher().name};S.saveTeacherProgress([...S.teacherProgress(),p]);document.querySelector('#modal').remove();toast('수업 진도를 등록했습니다.');render()}}
function teacherCalendar(main){renderCalendar(main,true)}
function eventModal(){document.body.insertAdjacentHTML('beforeend',`<div class="modal-backdrop" id="modal"><form class="modal" id="eventForm"><div class="modal-head"><h2>일정 / 공지 등록</h2><button type="button" class="icon-btn" id="closeModal">✕</button></div><div class="form-grid" style="margin-top:14px"><input name="date" type="date" value="${dateInput(2)}"><select name="type"><option value="school">학교 행사</option><option value="exam">시험</option><option value="other">기타 일정</option></select><input name="title" placeholder="일정 또는 공지 제목" required></div><button class="btn" style="margin-top:14px">저장</button></form></div>`);document.querySelector('#closeModal').onclick=()=>document.querySelector('#modal').remove();document.querySelector('#eventForm').onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.currentTarget));S.saveTeacherEvents([...S.teacherEvents(),{id:uid('te'),...f}]);document.querySelector('#modal').remove();toast('일정을 등록했습니다.');render()}}

function showSearch(q){q=q.trim();if(!q)return;const a=mergedAssessments().filter(x=>JSON.stringify(x).includes(q));const p=mergedProgress().filter(x=>JSON.stringify(x).includes(q));const e=mergedEvents().filter(x=>JSON.stringify(x).includes(q));document.body.insertAdjacentHTML('beforeend',`<div class="modal-backdrop" id="modal"><div class="modal"><div class="modal-head"><h2>검색 결과</h2><button class="icon-btn" id="closeModal">✕</button></div><p class="muted">“${esc(q)}” 검색 결과</p><h3>수행평가</h3>${a.map(x=>`<div class="list-item"><strong>${x.title}</strong><span class="small muted">${x.subject} · ${fmt(x.deadline)}</span></div>`).join('')||'<div class="empty">없음</div>'}<h3>수업 진도</h3>${p.map(x=>`<div class="list-item"><strong>${x.subject}</strong><span class="small muted">${x.learned.join(', ')}</span></div>`).join('')||'<div class="empty">없음</div>'}<h3>일정/공지</h3>${e.map(x=>`<div class="list-item"><strong>${x.title}</strong><span class="small muted">${x.date}</span></div>`).join('')||'<div class="empty">없음</div>'}</div></div>`);document.querySelector('#closeModal').onclick=()=>document.querySelector('#modal').remove()}

function render(){state.user=state.user||S.session();state.user?renderShell():renderLogin()}
render();

}
