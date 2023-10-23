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
        isMobile: 'ontouchstart' in window,
        multiple: false,
        size: 1,
        title: 'Select',
        dropdownTick: true,
        selectedMax: null,
        selectedText: '{0} selected',
        menuHeight: 0,
        menuItemHeight: null,
        menuDynamic: null,
        searchShow: false,
        searchFocus: true,
        searchFocusMobile: false,
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
    descs = [];
    searchString = '';

    constructor(select) {
        this.select = select;
        this.settings.multiple = select.multiple;
        this.settings.size = (select.size || undefined) ?? ((parseInt(this.settings.size)) ? 10 : null);
        this.settings.disabled = (select.disabled || undefined) ? true : false;
        if(select.title) {
            this.settings.title = select.title;
        }
        /**
         * Example settings from data attributes
            data-tick="false"
            data-size="8"
            data-search="true"
            data-search-focus="false"
            data-search-focus-mobile="true"
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
                case 'size':
                    this.settings.size = parseInt(value);
                    break;
                case 'tick':
                    this.settings.dropdownTick = (value.toLowerCase() === 'false') ? false : true;
                break;
                case 'search':
                        this.settings.searchShow = (value.toLowerCase() === 'true') ? true : false;
                    break;
                case 'searchFocus':
                        this.settings.searchFocus = (value.toLowerCase() === 'true') ? true : false;
                    break;
                case 'searchFocusMobile':
                        this.settings.searchFocusMobile = (value.toLowerCase() === 'true') ? true : false;
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
                    this.settings.selectedMax = parseInt(value);
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
                case 'dynamic':
                    let castValue = parseInt(value);
                    this.settings.menuDynamic = castValue < 0 ? 0 : castValue > 100 ? 100 : castValue;
                    break;
            }
        });
        if(select.options.length) {
            for(let i = 0; i < select.options.length; i++) {
                // console.log(select.options[i]);
                this.originals[i] = select.options[i].text;
                // used for search
                this.values[i] = select.options[i].value.toLowerCase();
                this.texts[i] = select.options[i].text.toLowerCase();
                this.descs[i] = '';
                if(select.options[i].dataset.desc) {
                    this.descs[i] = select.options[i].dataset.desc.toLowerCase();
                }
            }
        }
        this.render();
    };

    handleAriaAttributes(source, target) {
        Object.entries(source.attributes).forEach(([index, node]) => {
            if(node.nodeName == 'role' || node.nodeName.indexOf('aria-') !== -1) {
                target.setAttribute(node.nodeName, node.value);
            }
        });
    }

    /**
     * Actual event for selecting item
     * To support multiple ways to select
     * @param {*} picker
     * @param {*} item
     */
    selectMenuItem(picker, e) {
        let item = this;
        // Keyboard event
        if(e.type === 'keydown') {
            // if not Space then proceed normally, but do not let
            // rest of the actions happen
            if(e.code !== 'Space') {
                return;
            }
            // Normally space scrolls the menu if scrollbar exists
            // prevent this
            e.preventDefault();
        }
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
            picker.select.options[pos].selected = "";
            if(picker.selectedItems.length) {
                let i = picker.selectedItems.indexOf(pos);
                picker.selectedItems.splice(i, 1);
            }
            picker.select.dispatchEvent(new Event('change'));
        }
        else {
            let selectedMax = picker.settings.selectedMax;
            if(selectedMax !== null && picker.selectedItems.length == selectedMax) {
                return;
            }
            item.classList.add('selected');
            picker.select.options[pos].selected = "selected";
            picker.selectedItems.push(pos);
            picker.select.dispatchEvent(new Event('change'));
        }
        picker.changeDropdownButton();
        // close automatically if not multiple select
        if(!picker.settings.multiple) {
            picker.dropdown.classList.remove('open-menu');
        }
    }

    /**
     * Add event listeners for the menu item
     * @param {*} picker dropdown-element
     * @param {*} item is a-element
     */
    addHandlerSelect(picker, item) {
        item.addEventListener('keydown', this.selectMenuItem.bind(item, picker));
        item.addEventListener('click', this.selectMenuItem.bind(item, picker));
    };

    createDropdownButton(dropdown, select) {
        let picker = this;
        let button = document.createElement('button');
        button.type = 'button';
        button.classList.add('ezmodus-dropdown');
        button.addEventListener('click', function() {
            if(!button.classList.contains('disabled')) {
                dropdown.classList.toggle('open-menu');
            }
            let autofocus = false;
            // check are we on touch based devices
            if(picker.settings.isMobile) {
                if(picker.settings.searchShow && picker.settings.searchFocusMobile) {
                    autofocus = true;
                }
            }
            // otherwise "desktop"
            else {
                if(picker.settings.searchShow && picker.settings.searchFocus) {
                    autofocus = true;
                }
            }
            // if open, search and focus is set, then focus on search
            if(dropdown.classList.contains('open-menu') && autofocus) {
                let search = dropdown.querySelector('input[type="search"]');
                // it takes microseconds to get menu element visible
                // therefore this is a trick to delay focus a little
                setTimeout(() => {
                    search.focus();
                }, 75);
            }
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
    li > div > a > i (checkmark) + span (text)
       > div (subtext if set)
    */
    createMenuItem(picker, index, item) {
        let li = document.createElement('li');
        li.tabIndex = 0;
        li.dataset.pos = index;

        this.handleAriaAttributes(item, li);

        if(item.selected) {
            li.classList.add('selected');
            picker.selectedItems.push(index);
        }
        // handle disabled
        if(item.disabled) {
            li.dataset.disabled = "true";
        }
        // if not disabled add click event to select
        else {
            this.addHandlerSelect(picker, li);
        }
        item.classList.forEach(function(klass) {
            li.classList.add(klass);
        });

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
     * Search from text and hide necessary objects.
     * This has advanced search with RegEx to able
     * to exclude (not) or include (or)
     */
    addHandlerSearch(picker, menu, event) {
        const regex = new RegExp(/.+?(?=\s[+|-])|.+/gm);
        let params = [...this.value.matchAll(regex)];
        let cleaned_params = [];
        let exclusion = [];
        let inclusion = [];
        // Go through params, trim them and separate them based on
        // exclusion or inclusion
        for(let i = 0; i < params.length; i++) {
            let string = params[i][0].trim().toLowerCase();
            cleaned_params.push(string);
            if(string.startsWith('-')) {
                exclusion.push(string.substr(1));
                continue;
            }
            if(string.startsWith('+')) {
                inclusion.push(string.substr(1));
                continue;
            }
            // otherwise it is a search term itself
            // and can be added into inclusion
            inclusion.push(string);
        }
        // update the search string for information
        picker.searchString = cleaned_params.join(' ');

        // go through picker.texts (because values are the same height)
        // and checks based on settings.searchFrom and parsed search
        let indexes = [];
        let searchloc = picker.settings.searchFrom;
        picker.texts.forEach(function(opttext, position) {
            let optvalue = picker.values[position];
            let optdesc = picker.descs[position];
            let is_included, is_exluded = false;
            // go through exlusion first, because it is stronger
            exclusion.forEach((val) => {
                // option value or text
                if(searchloc == 'both') {
                    if(optvalue.indexOf(val) !== -1) {
                        is_exluded = true;
                        return;
                    }
                    if(opttext.indexOf(val) !== -1) {
                        is_exluded = true;
                        return;
                    }
                    if(optdesc !== '' && optdesc.indexOf(val) !== -1) {
                        is_exluded = true;
                        return;
                    }
                }
                // option value only
                if(searchloc == 'values') {
                    if(optvalue.indexOf(val) !== -1) {
                        is_exluded = true;
                        return;
                    }
                }
                // option text (default)
                if(opttext.indexOf(val) !== -1) {
                    is_exluded = true;
                    return;
                }
                if(optdesc !== '' && optdesc.indexOf(val) !== -1) {
                    is_exluded = true;
                    return;
                }
            });
            if(!is_exluded) {
                inclusion.forEach((val) => {
                    // option value or text
                    if(searchloc == 'both') {
                        if(optvalue.indexOf(val) !== -1) {
                            is_included = true;
                            return;
                        }
                        if(opttext.indexOf(val) !== -1) {
                            is_included = true;
                            return;
                        }
                        if(optdesc.indexOf(val) !== -1) {
                            is_included = true;
                            return;
                        }
                    }
                    // option value only
                    if(searchloc == 'values') {
                        if(optvalue.indexOf(val) !== -1) {
                            is_included = true;
                            return;
                        }
                    }
                    // option text (default)
                    if(opttext.indexOf(val) !== -1) {
                        is_included = true;
                        return;
                    }
                    if(optdesc !== '' && optdesc.indexOf(val) !== -1) {
                        is_included = true;
                        return;
                    }
                });
            }
            if(is_included) {
                indexes.push(position);
            }
        });
        // Update menu list items based on search
        // hide those which are not in index list
        menu.querySelectorAll('li').forEach(function(obj) {
            // if nothing to look then make sure all is reseted
            if(!cleaned_params.length) {
                obj.style.display = 'list-item';
                return;
            }
            if(indexes.includes(parseInt(obj.dataset.pos))) {
                obj.style.display = 'list-item';
                return;
            }
            obj.style.display = 'none';
        });
        // results text
        let noresults = menu.querySelector('div.no-results');
        if(indexes.length || picker.searchString == '') {
            noresults.innerHTML = '';
            noresults.innerText = '';
            noresults.style.display = 'none';
        }
        else {
            let msg = picker.settings.searchNoResultsText.replace('{0}', picker.searchString);
            noresults.innerHTML = msg;
            noresults.innerText = msg;
            noresults.style.display = 'block';
        }
    }
    createMenu() {
        let picker = this;
        let select = this.select;
        let menu = document.createElement('div');
        menu.classList.add('ezmodus-menu');
        menu.tabIndex = -1;
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
     * This is just a helper function to return list item's
     * width when studying paddings and margins for element itself and
     * checkmark
     */
    calculateMenuItemStructureWidth() {
        let picker = this;
        let width = 0;
        // get elements
        let ul = picker.menu.querySelector('ul');
        let li = picker.menu.querySelector('li');
        let link = li.querySelector('a');
        let icon = li.querySelector('i');
        let span = li.querySelector('span');

        let styles = [
            'padding-left', 'padding-right',
            'margin-left', 'margin-right',
            'border-left-width', 'border-right-width',
        ];
        styles.forEach(function(value) {
            width += parseInt(
                window.getComputedStyle(ul, null).getPropertyValue(value)
            );
            width += parseInt(
                window.getComputedStyle(li, null).getPropertyValue(value)
            );
            width += parseInt(
                window.getComputedStyle(link, null).getPropertyValue(value)
            );
            width += parseInt(
                window.getComputedStyle(icon, null).getPropertyValue(value)
            );
            width += parseInt(
                window.getComputedStyle(span, null).getPropertyValue(value)
            );
        });
        width += parseInt(
            window.getComputedStyle(icon, null).getPropertyValue('width')
        );
        return width;
    }

    /**
     * Calculates real context of the element without inserting it
     * by using canvas and computed font size and font family.
     *
     * This way text is seen as single line and
     * styling and text wrap has no effect.
     * @param {DOMElement} element
     * @returns {int}
     */
    calculateContextWidth(element) {
        let fsize = window.getComputedStyle(element, null).getPropertyValue('font-size');
        let family = window.getComputedStyle(element, null).getPropertyValue('font-family');
        // create canvas
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        context.font = `${fsize} ${family}`;
        let measure = context.measureText(element.textContent);
        return measure.width;
    };

    /**
     * Calculate dimensions for list items.
     * If size is given then calculate height based on size.
     *
     * If dynamic is given then calculate menu width
     * and if menu item height is given then use it to tweak
     * @param {*} dropdown
     */
    calculateMenuDimensions(dropdown) {
        let picker = this;
        // calculate height for list items
        if(picker.settings.size) {
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
        // calculate dynamic width
        if(picker.settings.menuDynamic) {
            // calculate first extra margins, paddings and rest of the content
            let extraWidth = picker.calculateMenuItemStructureWidth();
            let longestWidth = 0;
            picker.menu.querySelectorAll('li').forEach(function(li) {
                // check which element is the the widthest
                if(longestWidth < li.scrollWidth) {
                    longestWidth = li.scrollWidth;
                }
                // also check text fonts because they may wary
                let text = li.querySelector('.text');
                let width = picker.calculateContextWidth(text);
                // handle possible subtext
                let subtext = li.querySelector('.subtext');
                if(subtext) {
                    let subwidth = picker.calculateContextWidth(subtext);
                    if(width < subwidth) {
                        width = subwidth;
                    }
                }
                // update the longest width from longest item
                if(longestWidth < width) {
                    longestWidth = width;
                }
            });
            let percent = picker.settings.menuDynamic / 100;
            let newWidth = (longestWidth + extraWidth) * percent;
            picker.menu.style.minWidth = newWidth + 'px';
        }
    };

    render() {
        // Create dropdown frame and set the select element under it
        let dropdown = document.createElement('div');
        dropdown.classList.add('ezmodus-select');
        // Set dropdown before select and then add select into it
        this.select.parentNode.insertBefore(dropdown, this.select);
        dropdown.appendChild(this.select);

        // Create dropdown button
        let button = this.createDropdownButton(dropdown, this.select);
        if(this.settings.disabled) {
            button.classList.add('disabled');
        }
        this.handleAriaAttributes(this.select, button);
        this.button = button;

        dropdown.appendChild(this.button);
        dropdown.appendChild(this.createMenu());
        this.changeDropdownButton();
        this.calculateMenuDimensions(dropdown);
        dropdown.addEventListener('focusout', function(e) {
            if(!e.currentTarget.contains(e.relatedTarget)) {
                dropdown.classList.remove('open-menu');
            }
        });
        this.dropdown = dropdown;
    };
};
// pickup all selects with the class and do the transition to new picker
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('select.ezmodus-select-picker').forEach(
        select => new ezmodusSelectPicker(select)
    );
});
