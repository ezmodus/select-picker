/**
 * Native JS way to pickup all <select> elements which has
 * "ezmodus-select-picker" class.
 *
 * Hide default select and inject new div structure with dropdown
 */

class ezmodusSelectPicker {

    // elements
    dropdown = null; // div wrapper (ezmodus-select)
    button = null; // dropdown button (ezmodus-dropdown)
    select = null; // original select element
    menu = null; // div menu (ezmodus-menu)
    // settings
    settings = {
        multiple: false,
        size: null,
        title: 'Select',
        dropdownTick: true,
        selectedMax: null,
        selectedText: '{0} selected',
        menuHeight: 0,
        menuItemHeight: null,
        searchShow: false,
        searchInputPlaceHolder: 'Filter...',
        searchFrom: null,
        searchNoResultsText: 'No results matched "{0}"',
        clearButtonShow: false,
        clearButtonText: 'clear selection',
    };
    selectedCount = 1;
    selectedItems = [];
    // original values without string manipulation
    originals = [];
    // only used in search and are lowercased
    values = [];
    texts = [];
    searchString = '';

    constructor(select) {
        this.select = select;
        this.settings.multiple = select.multiple;
        this.settings.size = (select.size || undefined) ?? ((parseInt(this.settings.size)) ? 10 : null);
        if(select.title) {
            this.settings.title = select.title;
        }
        /**
         * Example settings from data attributes
            data-tick="false"
            data-search="true"
            data-search-from="both"
            data-search-placeholder="Find..."
            data-search-no-results="No results for {0}"
            data-selected-count="5"
            data-selected-text="{0} selected"
            data-selected-max= "5"
            data-clear-show="true"
            data-clear-text="clear"
            data-menu-item-height=""
         */
        Object.entries(select.dataset).forEach(([data, value]) => {
            switch(data) {
                case 'tick':
                    this.settings.dropdownTick = (value.toLowerCase() === 'false') ? false : true;
                break;
                case 'search':
                        this.settings.searchShow = (value.toLowerCase() === 'true') ? true : false;
                    break;
                case 'searchPlaceholder':
                        this.settings.searchInputPlaceHolder = value;
                    break;
                case 'searchFrom':
                    if(value == 'values') {
                        this.settings.searchFrom = 'values';
                    }
                    else if (value == 'both') {
                        this.settings.searchFrom = 'both';
                    }
                    break;
                case 'searchNoResults':
                    this.settings.searchNoResultsText = value;
                    break;
                case 'selectedCount':
                    this.selectedCount = parseInt(value);
                    break;
                case 'selectedText':
                    this.settings.selectedText = value;
                    break;
                case 'selectedMax':
                    this.selectedMax = parseInt(value);
                    break;
                case 'clearShow':
                    this.settings.clearButtonShow = (value === 'true') ? true : false;
                    break;
                case 'clearText':
                    this.settings.clearButtonText = value;
                    break;
                case 'menuItemHeight':
                    this.settings.menuItemHeight = parseInt(value);
                    break;
            }
        });
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
            let pos = parseInt(item.dataset.pos);
            // if not multi selection then wipe out existing select
            if(!picker.settings.multiple) {
                let options = picker.select.querySelectorAll('option');
                let items = Array.from(item.parentNode.children);
                picker.selectedItems.forEach(function(i) {
                    options[i].selected = null;
                    items[i].classList.remove('selected');
                });
                picker.selectedItems = [];
            }
            if(item.classList.contains('selected')) {
                item.classList.remove('selected');
                select.options[pos].selected = "";
                if(picker.selectedItems.length) {
                    let i = picker.selectedItems.indexOf(pos);
                    picker.selectedItems.splice(i, 1);
                }
            }
            else {
                let selectedMax = picker.settings.selectedMax;
                if(selectedMax !== null && picker.selectedItems.length == selectedMax) {
                    return;
                }
                item.classList.add('selected');
                select.options[pos].selected = "selected";
                picker.selectedItems.push(pos);
            }
            picker.changeDropdownButton();
            // close automatically if not multiple select
            if(!picker.settings.multiple) {
                picker.dropdown.classList.remove('open-menu');
            }
        });
    };

    createDropdownButton(dropdown, select) {
        let picker = this;
        let button = document.createElement('button');
        button.type = 'button';
        button.classList.add('ezmodus-dropdown');
        button.addEventListener('click', function() {
            dropdown.classList.toggle('open-menu');
        });
        select.classList.forEach(function(klass) {
            if(klass !== 'ezmodus-select-picker') {
                button.classList.add(klass);
            }
        });
        let span = document.createElement('span');
        span.classList.add('text');
        span.innerText = this.title;
        button.appendChild(span);
        if(picker.settings.dropdownTick) {
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
        btn.innerHTML = picker.settings.clearButtonText;
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
        this.addHandlerSelect(picker.select, li);
        if(item.selected) {
            li.classList.add('selected');
            picker.selectedItems.push(index);
        }

        let icon = document.createElement('i');
        icon.classList.add('checkmark');

        let span = document.createElement('span');
        span.classList.add('text');
        span.innerHTML = item.text;

        let a = document.createElement('a');

        // wrap icon and span under div and set them under a-element
        let wrapper = document.createElement('div');
        wrapper.classList.add('item-wrapper');
        wrapper.appendChild(icon);
        wrapper.appendChild(span);
        a.appendChild(wrapper);

        // if item <option> has data-attribute "desc" then
        // create extra text area for that information
        if(item.dataset.desc) {
            let subtext = document.createElement('div');
            subtext.classList.add('subtext');
            subtext.innerHTML = item.dataset.desc;
            a.appendChild(subtext);
        }
        // append the a-element into li-element
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
        if(picker.settings.searchFrom == 'both') {
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
        else if(picker.settings.searchFrom == 'values') {
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
            let msg = picker.settings.searchNoResultsText.replace('{0}', lookfor);
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
        // add close handler if outside of menu
        menu.addEventListener('focusout', function(e) {
            if(!e.currentTarget.contains(e.relatedTarget)) {
                picker.dropdown.classList.remove('open-menu');
            }
        });
        // if search is set then create search div
        // and input under it
        if(picker.settings.searchShow) {
            let search = document.createElement('div');
            search.classList.add('ezmodus-search');

            let input = document.createElement('input');
            input.type = 'search';
            input.autocomplete = 'off';
            input.placeholder = picker.settings.searchInputPlaceHolder;
            input.addEventListener('keyup', this.addHandlerSearch.bind(input, picker, menu));
            input.addEventListener('change', this.addHandlerSearch.bind(input, picker, menu));
            search.appendChild(input);
            menu.appendChild(search);
            menu.classList.add('with-search');
        }
        // add possibility to clear selection
        if(picker.settings.multiple && picker.settings.clearButtonShow) {
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
        this.menu = menu;
        return menu;
    };

    changeDropdownButton() {
        let picker = this;
        // if no selection then reset
        if(!picker.selectedItems.length) {
            picker.button.querySelector('span').innerHTML = picker.settings.title;
            picker.button.querySelector('span').innerText = picker.settings.title;
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
        let text = picker.settings.selectedText.replace('{0}', picker.selectedItems.length);
        picker.button.querySelector('span').innerHTML = text;
        picker.button.querySelector('span').innerText = text;
    }

    /**
     * Calculate height for list items based on select size attribute
     * and if menu item height is given then use it to tweak
     * @param {*} dropdown
     */
    calculateMenuHeight(dropdown) {
        // calculate height for list items
        if(this.settings.size) {
            let el = null;
            if(el = dropdown.querySelector('li')) {
                let elHeight = this.settings.menuItemHeight ?? 31;
                if(el.scrollHeight) {
                    elHeight = el.scrollHeight;
                } else if(el.offsetHeight) {
                    elHeight = el.offsetHeight;
                } else if(el.clientHeight) {
                    elHeight = el.clientHeight;
                }
                this.settings.menuHeight += (this.settings.size * elHeight);
            }
            let menu = dropdown.querySelector('.ezmodus-menu ul');
            menu.style.maxHeight = this.settings.menuHeight + 2 + 'px';
        }
    };

    render() {
        // Create dropdown frame and set the select element under it
        let dropdown = document.createElement('div');
        dropdown.classList.add('ezmodus-select');
        // Set dropdown before select and then add select into it
        this.select.parentNode.insertBefore(dropdown, this.select);
        dropdown.appendChild(this.select);
        this.button = this.createDropdownButton(dropdown, this.select);
        dropdown.appendChild(this.button);
        dropdown.appendChild(this.createMenu());
        this.changeDropdownButton();
        this.calculateMenuHeight(dropdown);
        this.dropdown = dropdown;
    };
};
// pickup all selects with the class and do the transition to new picker
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('select.ezmodus-select-picker').forEach(
        select => new ezmodusSelectPicker(select)
    );
});
