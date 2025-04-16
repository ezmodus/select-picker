(()=>{var e={646:e=>{e.exports={ezmodusSelectPicker:class{dropdown=null;button=null;select=null;menu=null;settings={isMobile:"ontouchstart"in window,multiple:!1,size:1,title:"Select",dropdownTick:!0,selectedMax:null,selectedText:"{0} selected",menuHeight:0,menuItemHeight:null,menuDynamic:null,searchShow:!1,searchFocus:!0,searchFocusMobile:!1,searchInputPlaceHolder:"Filter...",searchFrom:null,searchNoResultsText:'No results matched "{0}"',clearButtonShow:!1,clearButtonText:"clear selection"};selectedCount=1;selectedItems=[];initial_values=[];initial_indexes=[];optgroups={};originals=[];values=[];texts=[];descs=[];searchString="";constructor(e,t=null){if(this.select=e,this.select.dataset.id=t,this.settings.multiple=e.multiple,this.settings.size=(e.size||void 0)??(parseInt(this.settings.size)?10:null),this.settings.disabled=!!e.disabled,e.title&&(this.settings.title=e.title),Object.entries(e.dataset).forEach((([e,t])=>{switch(e){case"size":this.settings.size=parseInt(t);break;case"tick":this.settings.dropdownTick="false"!==t.toLowerCase();break;case"search":this.settings.searchShow="true"===t.toLowerCase();break;case"searchFocus":this.settings.searchFocus="true"===t.toLowerCase();break;case"searchFocusMobile":this.settings.searchFocusMobile="true"===t.toLowerCase();break;case"searchPlaceholder":this.settings.searchInputPlaceHolder=t;break;case"searchFrom":"values"==t?this.settings.searchFrom="values":"both"==t&&(this.settings.searchFrom="both");break;case"searchNoResults":this.settings.searchNoResultsText=t;break;case"selectedCount":this.selectedCount=parseInt(t);break;case"selectedText":this.settings.selectedText=t;break;case"selectedMax":this.settings.selectedMax=parseInt(t);break;case"clearShow":this.settings.clearButtonShow="true"===t;break;case"clearText":this.settings.clearButtonText=t;break;case"menuItemHeight":this.settings.menuItemHeight=parseInt(t);break;case"dynamic":let e=parseInt(t);this.settings.menuDynamic=e<0?0:e>100?100:e}})),e.options.length)for(let t=0;t<e.options.length;t++){if("OPTGROUP"===e.options[t].parentNode.nodeName){let s=e.options[t].parentNode,n=s.label,i=s.getElementsByTagName("legend");i.length>0&&(n=i[0].innerText),void 0===this.optgroups[n]&&(this.optgroups[n]=[]),this.optgroups[n].push(e.options[t])}e.options[t].selected&&this.initial_values.push(e.options[t].value),this.originals[t]=e.options[t].text,this.values[t]=e.options[t].value.toLowerCase(),this.texts[t]=e.options[t].text.toLowerCase(),this.descs[t]="",e.options[t].dataset.desc&&(this.descs[t]=e.options[t].dataset.desc.toLowerCase())}this.render();let s=this.button;new MutationObserver((function(e){e.forEach((function(e){"attributes"===e.type&&"disabled"===e.attributeName&&(e.target.attributes.disabled?s.classList.add("disabled"):s.classList.remove("disabled"))}))})).observe(e,{attributes:!0})}handleAriaAttributes(e,t){Object.entries(e.attributes).forEach((([e,s])=>{"role"!=s.nodeName&&-1===s.nodeName.indexOf("aria-")||t.setAttribute(s.nodeName,s.value)}))}selectMenuItem(e,t){let s=this;if("keydown"===t.type){if("Space"!==t.code)return;t.preventDefault()}let n=parseInt(s.dataset.pos);if(!e.settings.multiple){let t=e.select.querySelectorAll("option"),n=Array.from(s.parentNode.children);e.selectedItems.forEach((function(e){t[e].selected=null,n[e].classList.remove("selected")})),e.selectedItems=[]}if(s.classList.contains("selected")){if(s.classList.remove("selected"),e.select.options[n].selected="",e.selectedItems.length){let t=e.selectedItems.indexOf(n);e.selectedItems.splice(t,1)}e.select.dispatchEvent(new Event("change"))}else{let t=e.settings.selectedMax;if(null!==t&&e.selectedItems.length==t)return;s.classList.add("selected"),e.select.options[n].selected="selected",e.selectedItems.push(n),e.select.dispatchEvent(new Event("change"))}e.changeDropdownButton(),e.settings.multiple||e.dropdown.classList.remove("open-menu")}addHandlerSelect(e,t){t.addEventListener("keydown",this.selectMenuItem.bind(t,e)),t.addEventListener("click",this.selectMenuItem.bind(t,e))}createDropdownButton(e,t){let s=this,n=document.createElement("button");n.type="button",n.classList.add("ezmodus-dropdown"),n.addEventListener("click",(function(){n.classList.contains("disabled")||e.classList.toggle("open-menu");let t=!1;if(s.settings.isMobile?s.settings.searchShow&&s.settings.searchFocusMobile&&(t=!0):s.settings.searchShow&&s.settings.searchFocus&&(t=!0),e.classList.contains("open-menu")&&t){let t=e.querySelector('input[type="search"]');setTimeout((()=>{t.focus()}),75)}})),t.classList.forEach((function(e){"ezmodus-select-picker"!==e&&n.classList.add(e)}));let i=document.createElement("span");if(i.classList.add("text"),i.innerText=this.title,n.appendChild(i),s.settings.dropdownTick){let e=document.createElement("i");e.classList.add("tick"),n.appendChild(e)}return n}createClearButton(){let e=this,t=document.createElement("div");t.classList.add("ezmodus-clear");let s=document.createElement("button");return s.type="button",s.name="clear",s.innerHTML=e.settings.clearButtonText,s.addEventListener("click",(function(t){if(e.selectedItems.length){let t=e.select.querySelectorAll("option"),n=s.closest(".ezmodus-menu").querySelectorAll("li");e.selectedItems.forEach((function(e){t[e].selected=null,n[e].classList.remove("selected")})),e.selectedItems=[],e.selectedCount=1}e.changeDropdownButton()})),t.appendChild(s),t}createMenuGroup(e,t){let s=document.createElement("li");s.tabIndex=-1,s.classList.add("group");let n=document.createElement("span");n.classList.add("text"),n.innerHTML=t;let i=document.createElement("div");return i.classList.add("item-wrapper"),i.append(n),s.append(i),s}createMenuItem(e,t,s){let n=document.createElement("li");n.tabIndex=0,n.dataset.pos=t,n.classList.add("item"),this.handleAriaAttributes(s,n),s.selected&&(n.classList.add("selected"),e.selectedItems.push(t),e.initial_indexes.push(t)),s.disabled?n.dataset.disabled="true":this.addHandlerSelect(e,n),s.classList.forEach((function(e){n.classList.add(e)}));let i=document.createElement("i");i.classList.add("checkmark");let l=document.createElement("span");l.classList.add("text"),l.innerHTML=s.text;let a=document.createElement("a"),r=document.createElement("div");if(r.classList.add("item-wrapper"),r.appendChild(i),r.appendChild(l),a.appendChild(r),s.dataset.desc){let e=document.createElement("div");e.classList.add("subtext"),e.innerHTML=s.dataset.desc,a.appendChild(e)}return n.appendChild(a),n}addHandlerSearch(e,t,s){const n=new RegExp(/.+?(?=\s[+|-])|.+/gm);let i=[...this.value.matchAll(n)],l=[],a=[],r=[];for(let e=0;e<i.length;e++){let t=i[e][0].trim().toLowerCase();l.push(t),t.startsWith("-")?a.push(t.substr(1)):t.startsWith("+")?r.push(t.substr(1)):r.push(t)}e.searchString=l.join(" ");let c=[],o=e.settings.searchFrom;e.texts.forEach((function(t,s){let n,i=e.values[s],l=e.descs[s],d=!1;a.forEach((e=>{if("both"==o){if(-1!==i.indexOf(e))return void(d=!0);if(-1!==t.indexOf(e))return void(d=!0);if(""!==l&&-1!==l.indexOf(e))return void(d=!0)}("values"!=o||-1===i.indexOf(e))&&-1===t.indexOf(e)&&(""===l||-1===l.indexOf(e))||(d=!0)})),d||r.forEach((e=>{if("both"==o){if(-1!==i.indexOf(e))return void(n=!0);if(-1!==t.indexOf(e))return void(n=!0);if(-1!==l.indexOf(e))return void(n=!0)}("values"!=o||-1===i.indexOf(e))&&-1===t.indexOf(e)&&(""===l||-1===l.indexOf(e))||(n=!0)})),n&&c.push(s)})),t.querySelectorAll("li").forEach((function(e){l.length?c.includes(parseInt(e.dataset.pos))?e.style.display="list-item":e.style.display="none":e.style.display="list-item"}));let d=t.querySelector("div.no-results");if(c.length||""==e.searchString)d.innerHTML="",d.innerText="",d.style.display="none";else{let t=e.settings.searchNoResultsText.replace("{0}",e.searchString);d.innerHTML=t,d.innerText=t,d.style.display="block"}}createMenu(){let e=this,t=this.select,s=document.createElement("div");if(s.classList.add("ezmodus-menu"),s.tabIndex=-1,e.settings.searchShow){let t=document.createElement("div");t.classList.add("ezmodus-search");let n=document.createElement("input");n.type="search",n.autocomplete="off",n.placeholder=e.settings.searchInputPlaceHolder,n.addEventListener("keyup",this.addHandlerSearch.bind(n,e,s)),n.addEventListener("change",this.addHandlerSearch.bind(n,e,s)),t.appendChild(n),s.appendChild(t),s.classList.add("with-search")}if(e.settings.multiple&&e.settings.clearButtonShow){let e=this.createClearButton();s.appendChild(e)}let n=document.createElement("ul");if(t.options.length)if(Object.keys(e.optgroups).length){let t=0;Object.entries(e.optgroups).forEach((([s,i])=>{let l=this.createMenuGroup(e,s);n.appendChild(l);for(let s=0;s<i.length;s++){let l=this.createMenuItem(e,t,i[s]);n.appendChild(l),t++}}))}else for(let s=0;s<t.options.length;s++){let i=this.createMenuItem(e,s,t.options[s]);n.appendChild(i)}s.appendChild(n);let i=document.createElement("div");return i.classList.add("no-results"),s.appendChild(i),this.menu=s,s}changeDropdownButton(e=null){if(null===e&&(e=this),!e.selectedItems.length)return e.button.querySelector("span").innerHTML=e.settings.title,void(e.button.querySelector("span").innerText=e.settings.title);if(e.selectedCount>e.selectedItems.length-1){let t=[];e.selectedItems.forEach((function(s){t.push(e.originals[s])}));let s=t.join(", ");return e.button.querySelector("span").innerHTML=s,void(e.button.querySelector("span").innerText=s)}let t=e.settings.selectedText.replace("{0}",e.selectedItems.length);e.button.querySelector("span").innerHTML=t,e.button.querySelector("span").innerText=t}reset(){let e=this;e.selectedItems=[...e.initial_indexes];for(let e=0;e<this.select.options.length;e++){let t=this.select.options[e];this.initial_values.includes(t.value)?t.selected="selected":t.selected=null}this.menu.querySelectorAll("li").forEach((function(t,s){let n=parseInt(t.dataset.pos);e.initial_indexes.includes(n)?t.selected||t.classList.add("selected"):t.classList.remove("selected")})),e.changeDropdownButton(e)}calculateMenuItemStructureWidth(){let e=0,t=this.menu.querySelector("ul"),s=this.menu.querySelector("li"),n=s.querySelector("a"),i=s.querySelector("i"),l=s.querySelector("span");return["padding-left","padding-right","margin-left","margin-right","border-left-width","border-right-width"].forEach((function(a){e+=parseInt(window.getComputedStyle(t,null).getPropertyValue(a)),e+=parseInt(window.getComputedStyle(s,null).getPropertyValue(a)),e+=parseInt(window.getComputedStyle(n,null).getPropertyValue(a)),e+=parseInt(window.getComputedStyle(i,null).getPropertyValue(a)),e+=parseInt(window.getComputedStyle(l,null).getPropertyValue(a))})),e+=parseInt(window.getComputedStyle(i,null).getPropertyValue("width")),e}calculateContextWidth(e){let t=window.getComputedStyle(e,null).getPropertyValue("font-size"),s=window.getComputedStyle(e,null).getPropertyValue("font-family"),n=document.createElement("canvas").getContext("2d");return n.font=`${t} ${s}`,n.measureText(e.textContent).width}calculateMenuDimensions(e){let t=this;if(t.settings.size){let t=null;if(t=e.querySelector("li")){let e=this.settings.menuItemHeight??31;t.scrollHeight?e=t.scrollHeight:t.offsetHeight?e=t.offsetHeight:t.clientHeight&&(e=t.clientHeight),this.settings.menuHeight+=this.settings.size*e}e.querySelector(".ezmodus-menu ul").style.maxHeight=this.settings.menuHeight+2+"px"}if(t.settings.menuDynamic){let e=t.calculateMenuItemStructureWidth(),s=0;t.menu.querySelectorAll("li").forEach((function(e){s<e.scrollWidth&&(s=e.scrollWidth);let n=e.querySelector(".text"),i=t.calculateContextWidth(n),l=e.querySelector(".subtext");if(l){let e=t.calculateContextWidth(l);i<e&&(i=e)}s<i&&(s=i)}));let n=t.settings.menuDynamic/100,i=(s+e)*n;t.menu.style.minWidth=i+"px"}}render(){let e=document.createElement("div");e.classList.add("ezmodus-select"),this.select.parentNode.insertBefore(e,this.select),e.appendChild(this.select);let t=this.createDropdownButton(e,this.select);this.settings.disabled&&t.classList.add("disabled"),this.handleAriaAttributes(this.select,t),this.button=t,e.appendChild(this.button),e.appendChild(this.createMenu()),this.changeDropdownButton(),this.calculateMenuDimensions(e),e.addEventListener("focusout",(function(t){t.currentTarget.contains(t.relatedTarget)||e.classList.remove("open-menu")})),this.dropdown=e}}}}},t={};const{ezmodusSelectPicker:s}=function s(n){var i=t[n];if(void 0!==i)return i.exports;var l=t[n]={exports:{}};return e[n](l,l.exports,s),l.exports}(646);document.addEventListener("DOMContentLoaded",(function(){let e=[];document.querySelectorAll("select.ezmodus-select-picker").forEach((function(t,n){e.push(new s(t,n))})),document.querySelectorAll('*[type="reset"]').forEach((t=>{t.addEventListener("click",(function(){t.closest("form").querySelectorAll("select.ezmodus-select-picker").forEach((t=>{(picker=e[t.dataset.id])&&picker.reset()}))}))}))}))})();