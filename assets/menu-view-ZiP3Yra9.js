import{b as h,_ as y,u as g,y as e,$ as C,E as b}from"./vendor-tJNv_qKg.js";import{d as o,e as p,a as _,b as w,A as f}from"./index-PBFosM17.js";import{I as r}from"./icon-name.enum-0ePiKs41.js";class x extends h{difficulties=Object.entries(o).filter(([,i])=>typeof i=="number");refPlayerInput=y();minTilesX;minTilesY;minMinesCount;maxTilesX;maxTilesY;maxMinesCount;constructor(i,s){super(i,s);const t=p[o.Easy];this.minTilesX=t.tilesX,this.minTilesY=t.tilesY,this.minMinesCount=t.minesCount;const n=p[o.Custom];this.maxTilesX=n.tilesX,this.maxTilesY=n.tilesY,this.maxMinesCount=n.minesCount,_.state$.pipe(g(1)).subscribe(({difficulty:a,tilesX:u,tilesY:l,minesCount:c,player:m})=>this.setState({difficulty:a,tilesX:u,tilesY:l,minesCount:c,player:m}))}componentDidMount(){this.refPlayerInput.current?.focus()}render(i,{difficulty:s,tilesX:t,tilesY:n,minesCount:a,player:u}){const l=s!==o.Custom;return e("form",{class:"c-menu-form",onSubmit:this.onSubmit},e("div",{class:"c-menu-form__row"},e("label",{htmlFor:"player",class:"c-menu-form__label e-label"},"Your Name"),e("input",{class:"c-menu-form__input e-input",id:"player",name:"player",type:"text",pattern:"^\\w+$",required:!0,value:u||"",ref:this.refPlayerInput}))," ",e("div",{class:"c-menu-form__row"},e("label",{htmlFor:"difficulty",class:"c-menu-form__label e-label"},"Difficulty"),e("select",{class:"c-menu-form__select e-select",id:"difficulty",name:"difficulty",onChange:this.onChangeDifficulty},this.difficulties.map(([c,m])=>e("option",{value:m,selected:s===m,class:"c-menu-form__option e-option"},c)))),e("div",{class:"c-menu-form__row"},e("label",{htmlFor:"tilesX",class:"c-menu-form__label e-label"},"Width"),e("input",{class:"c-menu-form__input e-input",id:"tilesX",name:"tilesX",type:l?"text":"number",min:this.minTilesX,max:this.maxTilesX,required:!0,value:t,readOnly:l})),e("div",{class:"c-menu-form__row"},e("label",{htmlFor:"tilesY",class:"c-menu-form__label e-label"},"Height"),e("input",{class:"c-menu-form__input e-input",id:"tilesY",name:"tilesY",type:l?"text":"number",min:this.minTilesY,max:this.maxTilesY,required:!0,value:n,readOnly:l})),e("div",{class:"c-menu-form__row"},e("label",{htmlFor:"minesCount",class:"c-menu-form__label e-label"},"Mines"),e("input",{class:"c-menu-form__input e-input",id:"minesCount",name:"minesCount",type:l?"text":"number",min:this.minMinesCount,max:this.maxMinesCount,required:!0,value:a,readOnly:l})),e("button",{class:"c-menu-form__button e-button e-button--block e-button--primary",type:"submit"},"Start Game"))}onSubmit=i=>{i.preventDefault();const s=i.currentTarget;if(s.checkValidity()){const t=new FormData(s);_.dispatch(w.SetSettings,{player:`${t.get("player")}`,difficulty:Number.parseInt(`${t.get("difficulty")}`,10),settings:{tilesX:Number.parseInt(`${t.get("tilesX")}`,10),tilesY:Number.parseInt(`${t.get("tilesY")}`,10),minesCount:Number.parseInt(`${t.get("minesCount")}`,10)}}),C(f.Game)}};onChangeDifficulty=i=>{const s=Number.parseInt(`${i.currentTarget.value}`,10),t=this.refPlayerInput.current?.value;if(s===o.Custom)this.setState(n=>({...n,difficulty:s,player:t}));else{const{tilesX:n,tilesY:a,minesCount:u}=p[s];this.setState({difficulty:s,tilesX:n,tilesY:a,minesCount:u,player:t})}}}class M extends h{render(){return e("div",{class:"c-menu-view"},e("h1",{className:"c-menu-view__title e-title e-title--with-subtitle"},"Magawa ",e("img",{class:"e-icon",src:`icons/${r.Magawa}.png`})),e("p",{className:"e-subtitle"},"A Minesweeper Clone."),e(x,null),e(b,{href:f.Highscores,class:"c-menu-view__button e-button e-button--block"},"Highscores ",e("img",{class:"e-icon",src:`icons/${r.Trophy}.png`})),e(b,{href:f.About,class:"c-menu-view__button e-button e-button--block"},"About ",e("img",{class:"e-icon",src:`icons/${r.Book}.png`})),e("a",{href:"https://www.paypal.com/donate/?hosted_button_id=UHNHNPFVD32U8",target:"_blank",class:"c-menu-view__button e-button e-button--block"},"Donate ",e("img",{class:"e-icon",src:`icons/${r.Money}.png`})))}}export{M as MenuView};
//# sourceMappingURL=menu-view-ZiP3Yra9.js.map
