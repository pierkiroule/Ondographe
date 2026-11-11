import React from 'react';
export default function Slider({label,value,min,max,step=1,unit='',onChange}){
 const percent=Math.max(0,Math.min(100,(value-min)/(max-min)*100));
 return <label className="range-label slider-control"><span>{label}<output>{Number(value.toFixed(2))}{unit?' '+unit:''}</output></span><input aria-label={label} type="range" min={min} max={max} step={step} value={value} style={{'--range-progress':`${percent}%`}} onChange={e=>onChange(+e.target.value)}/></label>;
}
