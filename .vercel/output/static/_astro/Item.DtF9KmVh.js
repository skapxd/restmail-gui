import{u as h,a as e,b as g,g as x,s as c}from"./jsxRuntime.module.DuCvMPnv.js";import{y as l}from"./hooks.module.CXK6tdif.js";import"./preact.module.2HWAOvZb.js";function k(){const r=h(g);return l(()=>{const t=new URLSearchParams(window.location.search).get("email");t&&x(t)},[]),e("ul",{class:"mt-6",children:r.map((t,s)=>e(b,{...t,index:s}))})}function b(r){const{date:t,from:s,headers:p,html:y,messageId:v,priority:w,receivedAt:I,subject:m,text:D,to:R,index:d,receivedDate:j}=r??{},n=new Intl.RelativeTimeFormat("es",{style:"long"}),u=new Date(t)-new Date,a=parseInt(u/1e3),i=parseInt(a/60),o=parseInt(i/60),f=o<0?n.format(o,"hours"):i<0?n.format(i,"minutes"):a<0?n.format(a,"seconds"):"default";return l(()=>{d===0&&c(r)},[]),e("li",{class:"py-5 border-b border-gray-700 px-3 transition hover:bg-indigo-700",onClick:()=>{c(r)},children:[e("div",{class:"flex justify-between items-center",children:[e("h3",{class:"text-lg font-semibold",children:s[0].name}),e("p",{class:"text-md text-gray-400",children:f})]}),e("div",{class:"text-md italic text-gray-400",children:m})]})}export{k as default};
