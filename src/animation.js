export const TRACKS = { energy: 'Vitalité', organic: 'Organicité', complexity: 'Complexité' };
export const DURATION = 30;
export function easing(t, curve = [0.42, 0, 0.58, 1]) {
  const [x1,y1,x2,y2] = curve;
  const cubic = (u,a,b) => 3*(1-u)**2*u*a + 3*(1-u)*u*u*b + u**3;
  let lo=0,hi=1;
  for(let i=0;i<24;i++){const mid=(lo+hi)/2;if(cubic(mid,x1,x2)<t)lo=mid;else hi=mid;}
  return cubic((lo+hi)/2,y1,y2);
}
export function valueAt(keys, time, fallback) {
  if (!keys?.length) return fallback;
  if(time<=keys[0].time)return keys[0].value;
  for(let i=1;i<keys.length;i++){
    const a=keys[i-1],b=keys[i];
    if(time<=b.time)return a.value+(b.value-a.value)*easing((time-a.time)/(b.time-a.time),a.curve);
  }
  return keys.at(-1).value;
}
export function animatedItem(item,time) {
  const params={...item.params};
  for(const key of Object.keys(TRACKS))params[key]=valueAt(item.animation?.[key],time,params[key]);
  return {...item,params};
}
