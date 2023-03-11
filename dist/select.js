(()=>{class e{dropdown=null;button=null;select=null;menu=null;settings={multiple:!1,size:null,title:"Select",dropdownTick:!0,selectedMax:null,selectedText:"{0} selected",menuHeight:0,menuItemHeight:null,menuDynamic:null,searchShow:!1,searchInputPlaceHolder:"Filter...",searchFrom:null,searchNoResultsText:'No results matched "{0}"',clearButtonShow:!1,clearButtonText:"clear selection"};selectedCount=1;selectedItems=[];originals=[];values=[];texts=[];searchString="";constructor(e){if(this.select=e,this.settings.multiple=e.multiple,this.settings.size=(e.size||void 0)??(parseInt(this.settings.size)?10:null),e.title&&(this.settings.title=e.title),Object.entries(e.dataset).forEach((([e,t])=>{switch(e){case"tick":this.settings.dropdownTick="false"!==t.toLowerCase();break;case"search":this.settings.searchShow="true"===t.toLowerCase();break;case"searchPlaceholder":this.settings.searchInputPlaceHolder=t;break;case"searchFrom":"values"==t?this.settings.searchFrom="values":"both"==t&&(this.settings.searchFrom="both");break;case"searchNoResults":this.settings.searchNoResultsText=t;break;case"selectedCount":this.selectedCount=parseInt(t);break;case"selectedText":this.settings.selectedText=t;break;case"selectedMax":this.selectedMax=parseInt(t);break;case"clearShow":this.settings.clearButtonShow="true"===t;break;case"clearText":this.settings.clearButtonText=t;break;case"menuItemHeight":this.settings.menuItemHeight=parseInt(t);break;case"dynamic":let e=parseInt(t);this.settings.menuDynamic=e<0?0:e>100?100:e}})),e.options.length)for(let t=0;t<e.options.length;t++)this.originals[t]=e.options[t].text,this.values[t]=e.options[t].value.toLowerCase(),this.texts[t]=e.options[t].text.toLowerCase();this.render()}handleAriaAttributes(e,t){Object.entries(e.attributes).forEach((([e,s])=>{"role"!=s.nodeName&&-1===s.nodeName.indexOf("aria-")||t.setAttribute(s.nodeName,s.value)}))}selectMenuItem(e,t){let s=this;if("keydown"===t.type){if("Space"!==t.code)return;t.preventDefault()}let n=parseInt(s.dataset.pos);if(!e.settings.multiple){let t=e.select.querySelectorAll("option"),n=Array.from(s.parentNode.children);e.selectedItems.forEach((function(e){t[e].selected=null,n[e].classList.remove("selected")})),e.selectedItems=[]}if(s.classList.contains("selected")){if(s.classList.remove("selected"),e.select.options[n].selected="",e.selectedItems.length){let t=e.selectedItems.indexOf(n);e.selectedItems.splice(t,1)}}else{let t=e.settings.selectedMax;if(null!==t&&e.selectedItems.length==t)return;s.classList.add("selected"),e.select.options[n].selected="selected",e.selectedItems.push(n)}e.changeDropdownButton(),e.settings.multiple||e.dropdown.classList.remove("open-menu")}addHandlerSelect(e,t){t.addEventListener("keydown",this.selectMenuItem.bind(t,e)),t.addEventListener("click",this.selectMenuItem.bind(t,e))}createDropdownButton(e,t){let s=document.createElement("button");s.type="button",s.classList.add("ezmodus-dropdown"),s.addEventListener("click",(function(){e.classList.toggle("open-menu")})),t.classList.forEach((function(e){"ezmodus-select-picker"!==e&&s.classList.add(e)}));let n=document.createElement("span");if(n.classList.add("text"),n.innerText=this.title,s.appendChild(n),this.settings.dropdownTick){let e=document.createElement("i");e.classList.add("tick"),s.appendChild(e)}return s}createClearButton(){let e=this,t=document.createElement("div");t.classList.add("ezmodus-clear");let s=document.createElement("button");return s.type="button",s.name="clear",s.innerHTML=e.settings.clearButtonText,s.addEventListener("click",(function(t){if(e.selectedItems.length){let t=e.select.querySelectorAll("option"),n=s.closest(".ezmodus-menu").querySelectorAll("li");e.selectedItems.forEach((function(e){t[e].selected=null,n[e].classList.remove("selected")})),e.selectedItems=[]}e.changeDropdownButton()})),t.appendChild(s),t}createMenuItem(e,t,s){let n=document.createElement("li");n.tabIndex=0,n.dataset.pos=t,this.handleAriaAttributes(s,n),s.selected&&(n.classList.add("selected"),e.selectedItems.push(t)),s.disabled?n.dataset.disabled="true":this.addHandlerSelect(e,n),s.classList.forEach((function(e){n.classList.add(e)}));let l=document.createElement("i");l.classList.add("checkmark");let i=document.createElement("span");i.classList.add("text"),i.innerHTML=s.text;let a=document.createElement("a"),r=document.createElement("div");if(r.classList.add("item-wrapper"),r.appendChild(l),r.appendChild(i),a.appendChild(r),s.dataset.desc){let e=document.createElement("div");e.classList.add("subtext"),e.innerHTML=s.dataset.desc,a.appendChild(e)}return n.appendChild(a),n}addHandlerSearch(e,t,s){const n=new RegExp(/.+?(?=\s[+|-])|.+/gm);let l=[...this.value.matchAll(n)],i=[],a=[],r=[];for(let e=0;e<l.length;e++){let t=l[e][0].trim().toLowerCase();i.push(t),t.startsWith("-")?a.push(t.substr(1)):t.startsWith("+")?r.push(t.substr(1)):r.push(t)}e.searchString=i.join(" ");let c=[],d=e.settings.searchFrom;e.texts.forEach((function(t,s){let n,l=e.values[s],i=!1;a.forEach((e=>{if("both"==d){if(-1!==l.indexOf(e))return void(i=!0);if(-1!==t.indexOf(e))return void(i=!0)}("values"!=d||-1===l.indexOf(e))&&-1===t.indexOf(e)||(i=!0)})),i||r.forEach((e=>{if("both"==d){if(-1!==l.indexOf(e))return void(n=!0);if(-1!==t.indexOf(e))return void(n=!0)}("values"!=d||-1===l.indexOf(e))&&-1===t.indexOf(e)||(n=!0)})),n&&c.push(s)})),t.querySelectorAll("li").forEach((function(e){i.length?c.includes(parseInt(e.dataset.pos))?e.style.display="list-item":e.style.display="none":e.style.display="list-item"}));let o=t.querySelector("div.no-results");if(c.length)o.innerHTML="",o.innerText="",o.style.display="none";else{let t=e.settings.searchNoResultsText.replace("{0}",e.searchString);o.innerHTML=t,o.innerText=t,o.style.display="block"}}createMenu(){let e=this,t=this.select,s=document.createElement("div");if(s.classList.add("ezmodus-menu"),s.tabIndex=-1,e.settings.searchShow){let t=document.createElement("div");t.classList.add("ezmodus-search");let n=document.createElement("input");n.type="search",n.autocomplete="off",n.placeholder=e.settings.searchInputPlaceHolder,n.addEventListener("keyup",this.addHandlerSearch.bind(n,e,s)),n.addEventListener("change",this.addHandlerSearch.bind(n,e,s)),t.appendChild(n),s.appendChild(t),s.classList.add("with-search")}if(e.settings.multiple&&e.settings.clearButtonShow){let e=this.createClearButton();s.appendChild(e)}let n=document.createElement("ul");if(t.options.length)for(let s=0;s<t.options.length;s++){let l=this.createMenuItem(e,s,t.options[s]);n.appendChild(l)}s.appendChild(n);let l=document.createElement("div");return l.classList.add("no-results"),s.appendChild(l),this.menu=s,s}changeDropdownButton(){let e=this;if(!e.selectedItems.length)return e.button.querySelector("span").innerHTML=e.settings.title,void(e.button.querySelector("span").innerText=e.settings.title);if(e.selectedCount>e.selectedItems.length-1){let t=[];e.selectedItems.forEach((function(s){t.push(e.originals[s])}));let s=t.join(", ");return e.button.querySelector("span").innerHTML=s,void(e.button.querySelector("span").innerText=s)}let t=e.settings.selectedText.replace("{0}",e.selectedItems.length);e.button.querySelector("span").innerHTML=t,e.button.querySelector("span").innerText=t}calculateMenuItemStructureWidth(){let e=0,t=this.menu.querySelector("li"),s=t.querySelector("a"),n=t.querySelector("i");return["padding-left","padding-right","margin-left","margin-right"].forEach((function(l){e+=parseInt(window.getComputedStyle(t,null).getPropertyValue(l)),e+=parseInt(window.getComputedStyle(s,null).getPropertyValue(l)),e+=parseInt(window.getComputedStyle(n,null).getPropertyValue(l))})),e+=parseInt(window.getComputedStyle(n,null).getPropertyValue("width")),e}calculateContextWidth(e){let t=window.getComputedStyle(e,null).getPropertyValue("font-size"),s=window.getComputedStyle(e,null).getPropertyValue("font-family"),n=document.createElement("canvas").getContext("2d");return n.font=`${t} ${s}`,n.measureText(e.textContent).width}calculateMenuDimensions(e){let t=this;if(t.settings.size){let t=null;if(t=e.querySelector("li")){let e=this.settings.menuItemHeight??31;t.scrollHeight?e=t.scrollHeight:t.offsetHeight?e=t.offsetHeight:t.clientHeight&&(e=t.clientHeight),this.settings.menuHeight+=this.settings.size*e}e.querySelector(".ezmodus-menu ul").style.maxHeight=this.settings.menuHeight+2+"px"}if(t.settings.menuDynamic){let e=t.calculateMenuItemStructureWidth(),s=0;t.menu.querySelectorAll("li").forEach((function(e){let n=e.querySelector(".text"),l=t.calculateContextWidth(n),i=e.querySelector(".subtext");if(i){let e=t.calculateContextWidth(i);l<e&&(l=e)}s<l&&(s=l)}));let n=t.settings.menuDynamic/100,l=(s+e)*n;t.menu.style.minWidth=l+"px"}}render(){let e=document.createElement("div");e.classList.add("ezmodus-select"),this.select.parentNode.insertBefore(e,this.select),e.appendChild(this.select);let t=this.createDropdownButton(e,this.select);this.handleAriaAttributes(this.select,t),this.button=t,e.appendChild(this.button),e.appendChild(this.createMenu()),this.changeDropdownButton(),this.calculateMenuDimensions(e),e.addEventListener("focusout",(function(t){t.currentTarget.contains(t.relatedTarget)||e.classList.remove("open-menu")})),this.dropdown=e}}document.addEventListener("DOMContentLoaded",(function(){document.querySelectorAll("select.ezmodus-select-picker").forEach((t=>new e(t)))}))})();