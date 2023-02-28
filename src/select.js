/**
 * Native JS way to pickup all <select> elements which has
 * "ezmodus-select-picker" class.
 * 
 * Hide default select and inject new div structure with dropdown
 */

class ezmodusSelectPicker {

    button = null;
    select = null;
    isMulti = false;
    tick = true;
    size = null;
    max = null;
    selectedItems = [];
    height = 0;
    title = 'Select';
    isSearch = false;
    clearShow = false;
    clearText = 'clear selection';
    selectedCount = 1;
    selectedText = '{0} selected';
    noResultsText = 'No results matched "{0}"';
    searchString = '';
    searchFrom = null;
    originals = [];
    // only used in search and are lowercased
    values = [];
    texts = [];

    constructor(select) {  
        this.select = select;
        this.isMulti = select.multiple;
        this.size = (select.size || undefined) ?? ((this.isMulti) ? 10 : null);
        if(select.title) {
            this.title = select.title;
        }
        if(select.dataset.tick) {
            this.tick = (select.dataset.tick.toLowerCase() === 'false') ? false : true;
        }
        if(select.dataset.maxSelect) {
            this.max = parseInt(select.dataset.maxSelect);
        }
        if(select.dataset.liveSearch) {
            this.isSearch = (select.dataset.liveSearch.toLowerCase() === 'true') ? true : false;
        }
        if(select.dataset.clearShow) {
            this.clearShow = (select.dataset.clearShow.toLowerCase() === 'true') ? true : false;
        }
        if(select.dataset.clearButton) {
            this.clearText = select.dataset.clearButton;
        }
        if(select.dataset.searchFrom) {
            if(select.dataset.searchFrom == 'values') {
                this.searchFrom = 'values';
            }
            else if (select.dataset.searchFrom == 'both') {
                this.searchFrom = 'both';
            }
        }
        if(select.dataset.selectedCount) {
            this.selectedCount = parseInt(select.dataset.selectedCount);
        }
        if(select.dataset.selectedText) {
            this.selectedText = select.dataset.selectedText;
        }
        if(select.dataset.noResultsText) {
            this.noResultsText = select.dataset.noResultsText;
        }
        if(select.options.length) {
            for(let i = 0; i < select.options.length; i++) {
                this.originals[i] = select.options[i].text;
                // used for search
                this.values[i] = select.options[i].value.toLowerCase();
                this.texts[i] = select.options[i].text.toLowerCase();
            }
        }
        this.render();
    };

    /**
     * Add event listener
     * @param {*} select select-element
     * @param {*} item is a-element
     */
    addHandlerSelect(select, item) {
        let picker = this;
        item.addEventListener('click', function(e) {
            let li = item.parentNode;
            let pos = parseInt(li.dataset.pos);
            // if not multi selection then wipe out existing select
            if(!picker.isMulti) {
                let options = picker.select.querySelectorAll('option');
                let items = Array.from(li.parentNode.children);
                picker.selectedItems.forEach(function(i) {
                    options[i].selected = null;
                    items[i].classList.remove('selected');
                    
                });
                picker.selectedItems = [];
            }
            if(li.classList.contains('selected')) {
                li.classList.remove('selected');
                select.options[pos].selected = "";
                if(picker.selectedItems.length) {
                    let i = picker.selectedItems.indexOf(pos);
                    picker.selectedItems.splice(i, 1);
                }
            }
            else { 
                if(picker.max !== null && picker.selectedItems.length == picker.max) {
                    return;
                }
                li.classList.add('selected');
                select.options[pos].selected = "selected";
                picker.selectedItems.push(pos);
            }
            picker.changeDropdownButton();
        });
    };

    createDropdownButton() {
        let button = document.createElement('button');
        button.type = 'button';
        button.classList.add('ezmodus-dropdown');
        let span = document.createElement('span');
        span.classList.add('text');
        span.innerText = this.title;
        button.appendChild(span);
        if(this.tick) {
            let icon = document.createElement('i');
            icon.classList.add('tick');
            button.appendChild(icon);
        }
        return button;
    };

    createClearButton() {
        let picker = this;
        let clear = document.createElement('div');
        clear.classList.add('ezmodus-clear');

        let btn = document.createElement('button');
        btn.type = 'button';
        btn.name = 'clear';
        btn.innerHTML = this.clearText;
        btn.addEventListener('click', function(e) {
            if(picker.selectedItems.length) {
                let options = picker.select.querySelectorAll('option');
                let items = btn.closest('.ezmodus-menu').querySelectorAll('li');
                picker.selectedItems.forEach(function(i) {
                    options[i].selected = null;
                    items[i].classList.remove('selected');
                });
                picker.selectedItems = [];
            }
            picker.changeDropdownButton();
        });
        clear.appendChild(btn);
        return clear;
    };

    /*
    Create menu item with structure
    li > a > span (text) + i (checkmark)
    */
    createMenuItem(picker, index, item) {
        let li = document.createElement('li');
        li.tabIndex = 0;
        li.dataset.pos = index;
        if(item.selected) {
            li.classList.add('selected');
            picker.selectedItems.push(index);
        }

        let span = document.createElement('span');
        span.classList.add('text');
        span.innerHTML = item.text;

        let icon = document.createElement('i');
        icon.classList.add('checkmark');

        let a = document.createElement('a');
        this.addHandlerSelect(picker.select, a);
        a.appendChild(span);
        a.appendChild(icon);

        li.appendChild(a);
        return li;
    };

    /**
     * Search from text and hide necessary objects
     */
    addHandlerSearch(picker, menu, event) {
        let lookfor = '';
        if(this.value) {
            lookfor = this.value.toLowerCase();
        }
        let indexes = [];
        // Depending on data "search from" value look from texts, values or both
        // loop picker items to find out which position it holds
        if(picker.searchFrom == 'both') {
            picker.values.forEach(function(text, position) {
                if(text.indexOf(lookfor) !== -1) {
                    indexes.push(position);
                }
            });
            picker.texts.forEach(function(text, position) {
                if(text.indexOf(lookfor) !== -1 && !indexes.includes(position)) {
                    indexes.push(position);
                }
            });
        }
        else if(picker.searchFrom == 'values') {
            console.log(picker.values);
            picker.values.forEach(function(text, position) {
                if(text.indexOf(lookfor) !== -1) {
                    indexes.push(position);
                }
            });
        }
        // default only in texts
        else {
            picker.texts.forEach(function(text, position) {
                if(text.indexOf(lookfor) !== -1) {
                    indexes.push(position);
                }
            });
        }
        // now hide the elements which are not in index list
        menu.querySelectorAll('li').forEach(function(obj) {
            if(!indexes.includes(parseInt(obj.dataset.pos))) {
                obj.style.display = 'none';
            }
            else {
                obj.style.display = 'list-item';
            }
        });
        // results text
        let noresults = menu.querySelector('div.no-results');
        if(indexes.length) {
            noresults.innerHTML = '';
            noresults.style.display = 'none';
        }
        else {
            let msg = picker.noResultsText.replace('{0}', lookfor);
            noresults.innerHTML = msg;
            noresults.style.display = 'block';
        }
        picker.searchString = lookfor;
    }
    createMenu() {
        let picker = this;
        let select = this.select;
        let menu = document.createElement('div');
        menu.classList.add('ezmodus-menu');
        menu.tabIndex = -1;
        // if search is set then create search div
        // and input under it
        if(this.isSearch) {
            let search = document.createElement('div');
            search.classList.add('ezmodus-search');

            let input = document.createElement('input');
            input.type = 'search';
            input.autocomplete = 'off';
            input.addEventListener('keyup', this.addHandlerSearch.bind(input, picker, menu));
            input.addEventListener('change', this.addHandlerSearch.bind(input, picker, menu));
            search.appendChild(input);
            menu.appendChild(search);
        }
        // add possibility to clear selection
        if(this.isMulti && this.clearShow) {
            let clear = this.createClearButton();
            menu.appendChild(clear);
        }
        // create list of items from the select
        let ul = document.createElement('ul');
        if(select.options.length) {
            for(let i = 0; i < select.options.length; i++) {
                let li = this.createMenuItem(picker, i, select.options[i]);
                ul.appendChild(li);
            }
        }
        menu.appendChild(ul);
        // add placeholder item for no results text
        let noresults = document.createElement('div');
        noresults.classList.add('no-results');
        menu.appendChild(noresults);
        return menu;
    };

    changeDropdownButton() {
        let picker = this;
        // if no selection then reset
        if(!picker.selectedItems.length) {
            picker.button.querySelector('span').innerHTML = picker.title;
            picker.button.querySelector('span').innerText = picker.title;
            return;
        }
        // show selection as texts
        if(picker.selectedCount > picker.selectedItems.length -1) {
            let texts = [];
            picker.selectedItems.forEach(function(i) {
                texts.push(picker.originals[i]);
            });
            let text = texts.join(', ');
            picker.button.querySelector('span').innerHTML = text;
            picker.button.querySelector('span').innerText = text;
            return;
        }
        // otherwise replace with data-count-selected-text
        let text = picker.selectedText.replace('{0}', picker.selectedItems.length);
        picker.button.querySelector('span').innerHTML = text;
        picker.button.querySelector('span').innerText = text;
    }

    /**
     * Calculate height for list items based on select size attribute
     * @param {*} dropdown 
     */
    calculateMenuHeight(dropdown) {
        // calculate height for list items
        if(this.size) {
            let el = null;
            if(el = dropdown.querySelector('li')) {
                this.height += (this.size * el.scrollHeight);
            }
            let menu = dropdown.querySelector('.ezmodus-menu ul');
            menu.style.maxHeight = this.height + 2 + 'px';
        }
    };

    render() {
        // Create dropdown frame and set the select element under it
        let dropdown = document.createElement('div');
        dropdown.classList.add('ezmodus-select');
        // Set dropdown before select and then add select into it
        this.select.parentNode.insertBefore(dropdown, this.select);
        dropdown.appendChild(this.select);
        this.button = this.createDropdownButton();
        dropdown.appendChild(this.button);
        dropdown.appendChild(this.createMenu());
        this.changeDropdownButton();
        this.calculateMenuHeight(dropdown);

    };
};
// pickup all selects with the class and do the transition to new picker
document.querySelectorAll('select.ezmodus-select-picker').forEach(
    select => new ezmodusSelectPicker(select)
);
