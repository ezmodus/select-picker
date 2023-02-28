(()=>{class e{button=null;select=null;isMulti=!1;tick=!0;size=null;max=null;selectedItems=[];height=0;title="Select";isSearch=!1;clearShow=!1;clearText="clear selection";selectedCount=1;selectedText="{0} selected";noResultsText='No results matched "{0}"';searchString="";searchFrom=null;originals=[];values=[];texts=[];constructor(e){if(this.select=e,this.isMulti=e.multiple,this.size=(e.size||void 0)??(this.isMulti?10:null),e.title&&(this.title=e.title),e.dataset.tick&&(this.tick="false"!==e.dataset.tick.toLowerCase()),e.dataset.maxSelect&&(this.max=parseInt(e.dataset.maxSelect)),e.dataset.liveSearch&&(this.isSearch="true"===e.dataset.liveSearch.toLowerCase()),e.dataset.clearShow&&(this.clearShow="true"===e.dataset.clearShow.toLowerCase()),e.dataset.clearButton&&(this.clearText=e.dataset.clearButton),e.dataset.searchFrom&&("values"==e.dataset.searchFrom?this.searchFrom="values":"both"==e.dataset.searchFrom&&(this.searchFrom="both")),e.dataset.selectedCount&&(this.selectedCount=parseInt(e.dataset.selectedCount)),e.dataset.selectedText&&(this.selectedText=e.dataset.selectedText),e.dataset.noResultsText&&(this.noResultsText=e.dataset.noResultsText),e.options.length)for(let t=0;t<e.options.length;t++)this.originals[t]=e.options[t].text,this.values[t]=e.options[t].value.toLowerCase(),this.texts[t]=e.options[t].text.toLowerCase();this.render()}addHandlerSelect(e,t){let s=this;t.addEventListener("click",(function(l){let n=t.parentNode,a=parseInt(n.dataset.pos);if(!s.isMulti){let e=s.select.querySelectorAll("option"),t=Array.from(n.parentNode.children);s.selectedItems.forEach((function(s){e[s].selected=null,t[s].classList.remove("selected")})),s.selectedItems=[]}if(n.classList.contains("selected")){if(n.classList.remove("selected"),e.options[a].selected="",s.selectedItems.length){let e=s.selectedItems.indexOf(a);s.selectedItems.splice(e,1)}}else{if(null!==s.max&&s.selectedItems.length==s.max)return;n.classList.add("selected"),e.options[a].selected="selected",s.selectedItems.push(a)}s.changeDropdownButton()}))}createDropdownButton(){let e=document.createElement("button");e.type="button",e.classList.add("ezmodus-dropdown");let t=document.createElement("span");if(t.classList.add("text"),t.innerText=this.title,e.appendChild(t),this.tick){let t=document.createElement("i");t.classList.add("tick"),e.appendChild(t)}return e}createClearButton(){let e=this,t=document.createElement("div");t.classList.add("ezmodus-clear");let s=document.createElement("button");return s.type="button",s.name="clear",s.innerHTML=this.clearText,s.addEventListener("click",(function(t){if(e.selectedItems.length){let t=e.select.querySelectorAll("option"),l=s.closest(".ezmodus-menu").querySelectorAll("li");e.selectedItems.forEach((function(e){t[e].selected=null,l[e].classList.remove("selected")})),e.selectedItems=[]}e.changeDropdownButton()})),t.appendChild(s),t}createMenuItem(e,t,s){let l=document.createElement("li");l.tabIndex=0,l.dataset.pos=t,s.selected&&(l.classList.add("selected"),e.selectedItems.push(t));let n=document.createElement("span");n.classList.add("text"),n.innerHTML=s.text;let a=document.createElement("i");a.classList.add("checkmark");let i=document.createElement("a");return this.addHandlerSelect(e.select,i),i.appendChild(n),i.appendChild(a),l.appendChild(i),l}addHandlerSearch(e,t,s){let l="";this.value&&(l=this.value.toLowerCase());let n=[];"both"==e.searchFrom?(e.values.forEach((function(e,t){-1!==e.indexOf(l)&&n.push(t)})),e.texts.forEach((function(e,t){-1===e.indexOf(l)||n.includes(t)||n.push(t)}))):"values"==e.searchFrom?(console.log(e.values),e.values.forEach((function(e,t){-1!==e.indexOf(l)&&n.push(t)}))):e.texts.forEach((function(e,t){-1!==e.indexOf(l)&&n.push(t)})),t.querySelectorAll("li").forEach((function(e){n.includes(parseInt(e.dataset.pos))?e.style.display="list-item":e.style.display="none"}));let a=t.querySelector("div.no-results");if(n.length)a.innerHTML="",a.style.display="none";else{let t=e.noResultsText.replace("{0}",l);a.innerHTML=t,a.style.display="block"}e.searchString=l}createMenu(){let e=this,t=this.select,s=document.createElement("div");if(s.classList.add("ezmodus-menu"),s.tabIndex=-1,this.isSearch){let t=document.createElement("div");t.classList.add("ezmodus-search");let l=document.createElement("input");l.type="search",l.autocomplete="off",l.addEventListener("keyup",this.addHandlerSearch.bind(l,e,s)),l.addEventListener("change",this.addHandlerSearch.bind(l,e,s)),t.appendChild(l),s.appendChild(t)}if(this.isMulti&&this.clearShow){let e=this.createClearButton();s.appendChild(e)}let l=document.createElement("ul");if(t.options.length)for(let s=0;s<t.options.length;s++){let n=this.createMenuItem(e,s,t.options[s]);l.appendChild(n)}s.appendChild(l);let n=document.createElement("div");return n.classList.add("no-results"),s.appendChild(n),s}changeDropdownButton(){let e=this;if(!e.selectedItems.length)return e.button.querySelector("span").innerHTML=e.title,void(e.button.querySelector("span").innerText=e.title);if(e.selectedCount>e.selectedItems.length-1){let t=[];e.selectedItems.forEach((function(s){t.push(e.originals[s])}));let s=t.join(", ");return e.button.querySelector("span").innerHTML=s,void(e.button.querySelector("span").innerText=s)}let t=e.selectedText.replace("{0}",e.selectedItems.length);e.button.querySelector("span").innerHTML=t,e.button.querySelector("span").innerText=t}calculateMenuHeight(e){if(this.size){let t=null;(t=e.querySelector("li"))&&(this.height+=this.size*t.scrollHeight),e.querySelector(".ezmodus-menu ul").style.maxHeight=this.height+2+"px"}}render(){let e=document.createElement("div");e.classList.add("ezmodus-select"),this.select.parentNode.insertBefore(e,this.select),e.appendChild(this.select),this.button=this.createDropdownButton(),e.appendChild(this.button),e.appendChild(this.createMenu()),this.changeDropdownButton(),this.calculateMenuHeight(e)}}document.querySelectorAll("select.ezmodus-select-picker").forEach((t=>new e(t)))})();