import{b as x,y as l,f as S,_ as W,S as z,t as C,$ as D,d as I,g as E,h as $,E as N,i as X}from"./vendor-tJNv_qKg.js";import{g as w,G as T,a as c,b as o,c as y,A as k,d as R}from"./index-PBFosM17.js";import{f as M,a as Y,H as G,h as U}from"./highscores-table-ahQzHy1X.js";import{I as f}from"./icon-name.enum-0ePiKs41.js";class L extends x{render({entry:t}){return l("div",{class:"c-congratulations"},l("div",{class:"c-congratulations__title"},l("img",{class:"e-icon",src:`icons/${f.Party}.png`})," Congratulations!"),t?l("div",{class:"c-congratulations__text"},"You won in ",l("strong",null,M(t.time))," claiming rank ",l("strong",null,t.rank)," in highscores for difficulty ",l("em",null,Y(t.difficulty)),"."):"")}}class j extends x{render(){const{flagsCount:t,minesCount:i}=S(w);return l("div",{class:"c-flags",title:"Flags / Mines"},l("div",{class:"c-flags__label"},t,"/",i),l("div",{class:"c-flags__icon"},l("img",{class:"e-icon",src:`icons/${f.FlagOnGreen}.png`})))}}function H(e){if(!Array.isArray(e))throw new TypeError(`Expected an array, got ${typeof e}`);e=[...e];for(let t=e.length-1;t>0;t--){const i=Math.floor(Math.random()*(t+1));[e[t],e[i]]=[e[i],e[t]]}return e}function K(e){return e=`${e}`,e.slice(0,1)==="/"}function V(e){return e=`${e}`,e.slice(-1)==="/"}function P(e){return e=`${e}`,K(e)?e.slice(1):e}function B(e){return e=`${e}`,V(e)?e.slice(0,-1):e}function q(e){return e=`${e}`,P(B(e))}function J(...e){const t=e.flat();return t.map((i,s)=>s===0?t.length===1?i:B(i):s===t.length-1?P(i):q(i)).join("/")}var v=(e=>(e[e.Boom=f.Boom]="Boom",e[e.Flag=f.Flag]="Flag",e))(v||{});const F=[{name:v.Boom,src:"icons/boom.png"},{name:v.Flag,src:"icons/flag.png"}];async function Z(e){return new Promise((t,i)=>{const s=new Image;s.addEventListener("error",n=>i(n)),s.addEventListener("load",()=>t({...e,image:s})),s.src=e.src})}const Q=document.head.baseURI,O={};for(let e=0;e<F.length;e++){const{name:t,src:i}=F[e],s=await Z({name:t,src:J(Q,i)});O[s.name]=s}function tt(e){const t=O[e];if(!t)throw new Error(`PaintAsset with name '${e}' not found`);return t}const it={width:10,height:10,x:0,y:0,strokeWidth:1,active:!0,interactive:!0};class _{width;height;x;y;fillStyle;strokeStyle;strokeWidth;active;interactive;onClick;children=[];constructor(t){const{width:i,height:s,x:n,y:h,fillStyle:a,strokeStyle:r,strokeWidth:u,active:g,interactive:d}={...it,...t};this.width=i,this.height=s,this.x=n,this.y=h,this.fillStyle=a,this.strokeStyle=r,this.strokeWidth=u,this.active=!!g,this.interactive=!!d,t.onClick&&(this.onClick=t.onClick)}render(t){if(this.active){if(this.fillStyle||this.strokeStyle){const i=(this.strokeWidth||1)*t.pixelDensity,s=this.x*t.pixelDensity,n=this.y*t.pixelDensity,h=this.width*t.pixelDensity,a=this.height*t.pixelDensity,r=[s,n,h,a];this.fillStyle&&(t.context.fillStyle=this.fillStyle,t.context.fillRect(...r)),this.strokeStyle&&(t.context.strokeStyle=this.strokeStyle,t.context.lineWidth=i,t.context.strokeRect(...r))}for(let i=0;i<this.children.length;i++)this.children[i].render(t,this)}}add(...t){this.children.push(...t)}clear(){this.children=[]}isHitBy(t,i){return t>=this.x&&t<=this.x+this.width&&i>=this.y&&i<=this.y+this.height}}const et={x:0,y:0,fontSize:24,fontFamily:"sans-serif",textAlign:"center",textBaseline:"middle",direction:"ltr"};class st{text;x;y;fontSize;fontFamily;textAlign;textBaseline;direction;fillStyle;strokeStyle;strokeWidth;constructor(t){const{text:i,x:s,y:n,fontSize:h,fontFamily:a,textAlign:r,textBaseline:u,direction:g,fillStyle:d,strokeStyle:b,strokeWidth:p}={...et,...t};this.text=i,this.x=s,this.y=n,this.fontSize=h,this.fontFamily=a,this.textAlign=r,this.textBaseline=u,this.direction=g,this.fillStyle=d,this.strokeStyle=b,this.strokeWidth=p}render(t,i){if(t.context.font=`${this.fontSize*t.pixelDensity}px ${this.fontFamily}`,t.context.textAlign=this.textAlign,t.context.textBaseline=this.textBaseline,t.context.direction=this.direction,this.fillStyle||this.strokeStyle){const s=(this.strokeWidth||1)*t.pixelDensity,n=(i.x+this.x)*t.pixelDensity,h=(i.y+this.y)*t.pixelDensity,a=[this.text,n,h];this.fillStyle&&(t.context.fillStyle=this.fillStyle,t.context.fillText(...a)),this.strokeStyle&&(t.context.strokeStyle=this.strokeStyle,t.context.lineWidth=s,t.context.strokeText(...a))}}}class A{asset;x;y;width;height;constructor(t){typeof t.asset=="string"&&(t.asset=tt(t.asset)),this.asset=t.asset,this.x=t.x||0,this.y=t.y||0,this.width=t.width||this.asset.image.width||0,this.height=t.height||this.asset.image.height||0}render(t,i){const s=(i.x+this.x)*t.pixelDensity,n=(i.y+this.y)*t.pixelDensity,h=this.width*t.pixelDensity,a=this.height*t.pixelDensity;t.context.drawImage(this.asset.image,s,n,h,a)}}class nt{constructor(t,i,s,n){this.x=t,this.y=i,this.size=s,this.posX=this.size*this.x,this.posY=this.size*this.y,this.container=new _({width:this.size,height:this.size,x:this.posX,y:this.posY,onClick:n}),this.updateContainer()}container;posX;posY;mined=!1;covered=!0;flagged=!1;nearbyMines=0;get isMined(){return this.mined}get isCovered(){return this.covered}get isFlagged(){return this.flagged}get hasNearbyMines(){return this.nearbyMines}populate(t,i){this.mined=t,this.nearbyMines=i}uncover(){this.container.interactive=!1,this.covered=!1,this.flagged=!1,this.updateContainer()}toggleFlag(){this.flagged=!this.flagged,this.updateContainer()}updateContainer(){if(this.container.clear(),this.container.fillStyle=this.covered?"#6b8e23":"#f9edcc",this.container.strokeStyle="#ebdfbe",this.covered){this.flagged&&this.container.add(new A({asset:v.Flag,width:this.size*.65,height:this.size*.65,x:(this.size-this.size*.65)/2,y:(this.size-this.size*.65)/2}));return}this.mined?this.container.add(new A({asset:v.Boom,width:this.size,height:this.size})):this.nearbyMines>0&&this.container.add(new st({text:`${this.nearbyMines}`,fillStyle:"black",x:this.size/2,y:this.size/2}))}}const ht={pixelDensity:2,width:320,height:320};class lt{canvas;context;pixelDensity;width;height;children=[];constructor(t){typeof t.canvas=="string"&&(t.canvas=document.querySelector(t.canvas));const{canvas:i,pixelDensity:s,width:n,height:h}={...ht,...t};this.canvas=i,this.pixelDensity=s,this.width=n,this.height=h,this.context=this.canvas.getContext("2d"),this.canvas.width=this.width*this.pixelDensity,this.canvas.height=this.height*this.pixelDensity,this.canvas.style.width=`${this.width}px`,this.canvas.style.height=`${this.height}px`,this.canvas.addEventListener("contextmenu",a=>{a.preventDefault()}),this.canvas.addEventListener("pointerdown",a=>{a.preventDefault();const{x:r,y:u}=this.canvas.getBoundingClientRect(),g=a.clientX-r,d=a.clientY-u,b=[...this.children].reverse();for(let p=0;p<b.length;p++){const m=b[p];if(m.active&&typeof m.onClick=="function"&&m.isHitBy(g,d)){m.interactive&&m.onClick({event:a,container:m,engine:this});break}}})}add(...t){this.children.push(...t)}clear(){this.children=[]}render(){for(let t=0;t<this.children.length;t++)this.children[t].render(this)}}class at{constructor(t,i,s,n,h,a,r,u,g,d){this.view=t,this.tileSize=i,this.tilesX=s,this.tilesY=n,this.minesCount=h,this.firstClick=a,this.setFlagsCount=r,this.unpause=u,this.finish=g,this.close=d,this.initBoard()}paintEngine;width;height;minesIndex;tiles;pauseOverlay;flagsCount;triggeredMinedTile;initBoard(){this.width=this.tilesX*this.tileSize,this.height=this.tilesY*this.tileSize,this.paintEngine?this.paintEngine.clear():this.paintEngine=new lt({canvas:this.view,width:this.width,height:this.height,pixelDensity:2}),this.flagsCount=0,this.tiles=[],this.minesIndex=[],this.triggeredMinedTile=null,this.pauseOverlay=null,this.initTiles()}showPauseOverlay(){this.pauseOverlay||(this.pauseOverlay=new _({fillStyle:"#6b8e23",width:this.width,height:this.height,onClick:()=>this.unpause()}),this.paintEngine.add(this.pauseOverlay)),this.pauseOverlay.active=!0,this.paintEngine.render()}hidePauseOverlay(){this.pauseOverlay&&(this.pauseOverlay.active=!1,this.paintEngine.render())}initTiles(){for(let t=0;t<this.tilesY;t++)for(let i=0;i<this.tilesX;i++){const s=new nt(i,t,this.tileSize,({event:n})=>this.onTileClick(n,i,t));this.tiles.push(s),this.paintEngine.add(s.container)}this.paintEngine.render()}initMines(t,i){let s=[];for(let h=0;h<this.tilesX*this.tilesY;h++)s.push(h<this.minesCount);let n=0;do s=H(s),n++;while(n<1e4&&(s[this.getTileIndex(t,i)]||this.getNearbyTileCoordinates(t,i).some(([h,a])=>s[this.getTileIndex(h,a)])));this.minesIndex=s}populateTiles(){this.tiles.forEach((t,i)=>t.populate(this.minesIndex[i],this.getNearbyTileCoordinates(t.x,t.y).filter(([s,n])=>this.minesIndex[this.getTileIndex(s,n)]).length))}onTileClick(t,i,s){this.minesIndex.length===0&&(this.firstClick(),this.initMines(i,s),this.populateTiles()),t.altKey||t.ctrlKey||t.metaKey||t.shiftKey||t.button>1?this.toggleFlag(i,s):this.uncoverTile(i,s)}getTileIndex(t,i){return i*this.tilesX+t}getNearbyTileCoordinates(t,i){return[[t-1,i-1],[t+0,i-1],[t+1,i-1],[t-1,i+0],[t+1,i+0],[t-1,i+1],[t+0,i+1],[t+1,i+1]].filter(([n,h])=>n>=0&&n<this.tilesX&&h>=0&&h<this.tilesY)}uncoverTile(t,i){const s=this.tiles[this.getTileIndex(t,i)];!s.isCovered||s.isFlagged||(s.uncover(),s.isMined?(this.triggeredMinedTile=s,this.tiles.forEach(n=>{n.isMined&&n.uncover()})):s.hasNearbyMines===0&&this.getNearbyTileCoordinates(t,i).forEach(([n,h])=>this.uncoverTile(n,h)),this.updateBoardState())}toggleFlag(t,i){const s=this.tiles[this.getTileIndex(t,i)];s.isCovered&&(s.toggleFlag(),this.flagsCount=this.tiles.reduce((n,h)=>h.isFlagged?++n:n,0),this.setFlagsCount(this.flagsCount),this.updateBoardState())}isBoardSolved(){return this.tiles.every(t=>t.isMined&&(t.isFlagged||t.isCovered)||!t.isMined&&!t.isFlagged&&!t.isCovered)}updateBoardState(){const t=!!this.triggeredMinedTile,i=!t&&this.isBoardSolved();if(t||i){const s=i?"rgba(0, 255, 0, 0.2)":"rgba(255, 0, 0, 0.2)",n=new _({fillStyle:s,width:this.width,height:this.height,onClick:()=>this.close()});this.paintEngine.add(n),this.finish(i?T.Won:T.Lost)}this.paintEngine.render()}}class ot extends x{viewRef=W();unsubscribeSubject=new z;board;tileSize;tilesX;tilesY;minesCount;constructor(){super(),c.actions$.pipe(C(this.unsubscribeSubject)).subscribe(({name:t,state:i})=>{t===o.Restart?this.board.initBoard():t===o.Pause&&y.isPaused(i)?this.board.showPauseOverlay():t===o.Unpause&&y.isRunning(i)&&this.board.hidePauseOverlay(),y.player(i)||D(k.Home)})}componentDidMount(){this.board=new at(this.viewRef.current,this.tileSize,this.tilesX,this.tilesY,this.minesCount,()=>c.dispatch(o.FirstClick),t=>c.dispatch(o.SetFlagsCount,{flagsCount:t}),()=>c.dispatch(o.Unpause),t=>c.dispatch(o.Finish,{finalStatus:t}),()=>D(k.Home))}componentWillUnmount(){this.unsubscribeSubject.next()}render(){const t=S(w);if(!this.board){const{tileSize:i,tilesX:s,tilesY:n,minesCount:h}=t;this.tileSize=i,this.tilesX=s,this.tilesY=n,this.minesCount=h}return l("div",{class:"c-game-gfx"},l("canvas",{class:"c-game-gfx__canvas",ref:this.viewRef,onContextMenu:this.onRightClick}))}onRightClick=t=>{t.preventDefault()}}class rt extends x{render(){const{finalStatus:t}=S(w),i=t===null?f.Magawa:t===T.Won?f.Party:f.Dead;return l("button",{class:"c-restart",title:"Restart Game",onClick:this.onClick},l("img",{class:"e-icon",src:`icons/${i}.png`}))}onClick=t=>{t.preventDefault(),c.dispatch(o.Restart)}}class ct extends x{timeout;componentWillUnmount(){this.stopTimeout()}render(){const t=S(w),i=y.isPaused(t);y.isFinished(t)||i?this.stopTimeout():this.startTimeout();const n=this.getDuration(t.startedAt,t.pausedAt),h=i?"Continue":"Pause",a=i?f.Zzz:f.Stopwatch;return l("button",{class:"c-timer",title:h,onClick:this.onClick},l("div",{class:"c-timer__icon"},l("img",{class:"e-icon",src:`icons/${a}.png`})),l("div",{class:"c-timer__label"},n))}onClick=t=>{t.preventDefault(),c.dispatch(o.TogglePause)};getDuration(t,i){const n=t?I(i===null?new Date:i,t):0;return M(n,!1)}startTimeout(){this.stopTimeout(),this.timeout=window.setTimeout(()=>{this.forceUpdate()},1e3)}stopTimeout(){this.timeout&&window.clearTimeout(this.timeout)}}class yt extends x{unsubscribeSubject=new z;highscoreSaved=!1;constructor(){super(),c.dispatch(o.Start),E(window,"blur").pipe(C(this.unsubscribeSubject)).subscribe(()=>c.dispatch(o.Pause)),E(document,"keydown").pipe(C(this.unsubscribeSubject),$(t=>t.code==="KeyP"||t.code==="Escape")).subscribe(()=>c.dispatch(o.TogglePause))}componentWillUnmount(){this.unsubscribeSubject.next(),c.dispatch(o.Close)}render(t,{highscores:i,entry:s}){const n=S(w);if(y.isClosed(n))return l("div",null);const h=y.isWon(n),{difficulty:a,startedAt:r,finishedAt:u,player:g}=n;h&&!this.highscoreSaved&&a!==R.Custom&&this.saveHighscore(r,u,g,a);const d=y.width(n);return l("div",{class:"c-game-view"},l("div",{class:"c-game-view__container",style:`width:${d}px; min-width:${d*.5}px`},l("div",{class:"c-game-view__bar"},l("div",{class:"c-game-view__bar-item"},l(ct,null)),l("div",{class:"c-game-view__bar-item"},l(rt,null)),l("div",{class:"c-game-view__bar-item"},l(j,null))),l(ot,null)),h?l(X,null,l(L,{entry:s}),l(G,{list:i?.list,highlight:s?.id})):"",l("div",{className:"e-back-button"},l(N,{href:k.Home,class:"e-back-button__button e-button"},"← Back")))}saveHighscore(t,i,s,n){this.highscoreSaved=!0,U.add(I(i,t),s,n).subscribe(({entry:h,highscores:a})=>{this.setState({highscores:a,entry:h})})}}export{yt as GameView};
//# sourceMappingURL=game-view-xHQS2Puq.js.map
