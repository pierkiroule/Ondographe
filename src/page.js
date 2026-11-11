export const FORMATS=[
 ['square','Carré · 1:1',1080,1080,'px'],['a4-portrait','A4 · Portrait',210,297,'mm'],['a4-landscape','A4 · Paysage',297,210,'mm'],
 ['instagram-portrait','Instagram · Portrait',1080,1350,'px'],['story','Story / Reel · 9:16',1080,1920,'px'],['linkedin','LinkedIn · Publication',1200,627,'px'],['linkedin-cover','LinkedIn · Couverture',1584,396,'px'],['banner','Bannière · 3:1',1800,600,'px'],['custom','Personnalisé',1200,800,'px']
];
export function pageFor(item){
 const p=item.page||{format:'square',width:600,height:600,unit:'px'};
 const width=Math.max(1,Math.min(20000,Number(p.width)||600)),height=Math.max(1,Math.min(20000,Number(p.height)||600));
 const factor=600/Math.min(width,height);
 return {...p,width,height,unit:p.unit==='mm'?'mm':'px',w:width*factor,h:height*factor};
}
export function layoutFor(item){const {w,h}=pageFor(item),l=item.layout||{};return {x:w/2+(l.x||0)*w/100,y:h/2+(l.y||0)*h/100,scale:Math.max(.05,(l.scale??100)/100),rotation:l.rotation||0}}
export function motifTransform(item){const l=layoutFor(item);return `translate(${l.x} ${l.y}) rotate(${l.rotation}) scale(${l.scale}) translate(-300 -300)`}
export function toMotif(item,x,y){const l=layoutFor(item),a=-l.rotation*Math.PI/180,dx=x-l.x,dy=y-l.y;return {x:300+(dx*Math.cos(a)-dy*Math.sin(a))/l.scale,y:300+(dx*Math.sin(a)+dy*Math.cos(a))/l.scale}}
