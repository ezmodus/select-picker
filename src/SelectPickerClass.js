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
        selectedCount: 1, // how many allowed to select until replaced by counter
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
    items = [];
    searchString = '';

    constructor(select, i = null) {
        let picker = this;
        this.select = select;
        this.select.dataset['id'] = i;
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
                    this.settings.selectedCount = parseInt(value);
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

        Object.values(select.children).forEach(function(child, i) {
            if(child.nodeName === 'OPTGROUP') {
                let group_name = child.label;
                // check if legend is used
                let legend = child.getElementsByTagName('legend');
                if(legend.length > 0) {
                    group_name = legend[0].innerText; // first legend text
                }
                picker.items.push({
                    'group': true,
                    'label': group_name,
                    'listelem': null,
                    // how many, direct options
                    'total': child.getElementsByTagName('option').length,
                    // tracks for search how many are matched, default total
                    'match': child.getElementsByTagName('option').length,
                    'items': [],
                });
                let last_index = picker.items.length - 1;
                Object.values(child.children).forEach(function(option, i) {
                    if(option.nodeName === 'OPTION') {
                        picker.items[last_index].items.push({
                            'elem': option,
                            'listelem': null, // this is the element what is created into list
                            'visible': true,
                            'initial': option.selected ? true : false,
                            'selected': option.selected ? true : false,
                            'search_value': option.value.toLowerCase(),
                            'search_label': option.text.toLowerCase(),
                            'search_desc': (option.dataset.desc) ? option.dataset.desc.toLowerCase() : '',
                        });
                    }
                });
                return;
            }
            picker.items.push({
                'group': false,
                'label': null,
                'total': 1, // how many, direct options this is always 1
                'match': 1, // tracks for search how many are matched
                'items': [{
                    'elem': child,
                    'listelem': null, // this is the element what is created into list
                    'visible': true,
                    'initial': child.selected ? true : false,
                    'selected': child.selected ? true : false,
                    'search_value': child.value.toLowerCase(),
                    'search_label': child.text.toLowerCase(),
                    'search_desc': (child.dataset.desc) ? child.dataset.desc.toLowerCase() : '',
                }],
            });
        });

        this.render();
        // let testarea = document.createElement('div');
        // testarea.id = picker.select.id + '-testarea';
        // testarea.style.position = 'relative';
        // testarea.style.left = '320px';
        // testarea.style.top = '-30px';
        // picker.dropdown.append(testarea);
        // this.testRender();

        let button = this.button;
        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if(mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
                    let is_disabled = mutation.target.attributes['disabled'] ? true : false;
                    (is_disabled) ? button.classList.add('disabled') : button.classList.remove('disabled');
                }
            });
        });
        observer.observe(select, {
            attributes: true, // configure it to listen to attribute changes
        });
    };

    /** only for debugging */
    testRender() {
        if(!this.dropdown || this.select.id != 'optgroup-single') {
            return;
        }
        let picker = this;
        let testarea = document.getElementById(picker.select.id+'-testarea');
        if(!testarea) {
            return;
        }
        testarea.innerHTML = '';
        testarea.innerText = '';
        picker.items.forEach((data) => {
            if(data.group) {
                let group = document.createElement('div');
                group.innerText = data.label;
                group.style.color = '#000000';
                group.style.fontWeight = 600;
                if(data.match == 0) {
                    group.style.color = '#b7575b';
                }
                testarea.appendChild(group);
                data.items.forEach((item) => {
                    let div = document.createElement('div');
                    div.innerText = item.elem.label;
                    if(item.selected) {
                        div.innerText += ' (selected)';
                    }
                    div.style.paddingLeft = '20px';
                    if(!item.visible) {
                        div.style.color = '#b7575b';
                    }
                    if(item.elem.dataset.desc !== undefined) {
                        let divdesc = document.createElement('div');
                        divdesc.innerText = item.elem.dataset.desc;
                        divdesc.style.color = '#7d7d7d';
                        div.appendChild(divdesc);
                    }
                    testarea.appendChild(div);
                });
            }
            else {
                data.items.forEach((item) => {
                    let div = document.createElement('div');
                    div.innerText = item.elem.label;
                    div.style.color = '#000000';
                    if(item.selected) {
                        div.innerText += ' (selected)';
                    }
                    if(!item.visible) {
                        div.style.color = '#b7575b';
                    }
                    if(item.elem.dataset.desc !== undefined) {
                        let divdesc = document.createElement('div');
                        divdesc.innerText = item.elem.dataset.desc;
                        divdesc.style.color = '#7d7d7d';
                        div.appendChild(divdesc);
                    }
                    testarea.appendChild(div);
                });
            }
        });
    }

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
        let elem = this;
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
        let selected = Object.values(picker.select.options).filter((o) => o.selected);

        picker.items.forEach((data) => {
            data.items.forEach((item) => {
                // if not multiple picker then unselect all which are not element
                if(!picker.settings.multiple) {
                    if(item.listelem === elem) {
                        if(item.selected) {
                            item.elem.selected = null;
                            item.selected = false;
                            item.listelem.classList.remove('selected');
                        }
                        else {
                            item.elem.selected = true;
                            item.selected = true;
                            item.listelem.classList.add('selected');
                        }
                    }
                    else {
                        item.elem.selected = null;
                        item.selected = false;
                        item.listelem.classList.remove('selected');
                    }
                }
                // multi select and select max
                else {
                    if(item.listelem === elem) {
                        // remove selection
                        if(item.selected) {
                            item.elem.selected = null;
                            item.selected = false;
                            item.listelem.classList.remove('selected');
                        }
                        // add selection
                        else {
                            let selectedMax = picker.settings.selectedMax;
                            if(selectedMax !== null && selected.length == selectedMax) {
                                return;
                            }
                            item.elem.selected = true;
                            item.selected = true;
                            item.listelem.classList.add('selected');
                        }
                    }
                }
            });
        });

        picker.select.dispatchEvent(new Event('change'));
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
            let selected = Object.values(picker.select.options).filter((o) => o.selected);
            if(selected.length) {
                picker.items.forEach((data) => {
                    data.items.forEach((i) => {
                        i.selected = false;
                        i.elem.selected = null;
                        i.listelem.classList.remove('selected');
                    });
                });
            }
            picker.changeDropdownButton();
        });
        clear.appendChild(btn);
        return clear;
    };


    createMenuGroup(data) {
        let li = document.createElement('li');
        li.tabIndex = -1;
        li.classList.add('group');

        let span = document.createElement('span');
        span.classList.add('text');
        span.innerHTML = data.label;

        // wrap icon and span under div and set them under a-element
        let wrapper = document.createElement('div');
        wrapper.classList.add('item-wrapper');
        wrapper.append(span);
        li.append(wrapper);
        return li;
    };

    /**
     * Create menu item
     * @param {*} group (picker.items index data)
     * @param {*} data  (picker.items[x].items index)
     * @returns 
     */
    createMenuItem(group, data) {
        let picker = this;
        let li = document.createElement('li');
        li.tabIndex = 0;
        li.classList.add('item');
        if(group.group) {
            li.classList.add('group-item');
        }

        this.handleAriaAttributes(data.elem, li);

        if(data.selected) {
            li.classList.add('selected');
        }
        // handle disabled
        if(data.elem.disabled) {
            li.dataset.disabled = "true";
        }
        // if not disabled add click event to select
        else {
            this.addHandlerSelect(picker, li);
        }
        data.elem.classList.forEach(function(klass) {
            li.classList.add(klass);
        });

        let icon = document.createElement('i');
        icon.classList.add('checkmark');

        let span = document.createElement('span');
        span.classList.add('text');
        span.innerHTML = data.elem.text;

        let a = document.createElement('a');

        // wrap icon and span under div and set them under a-element
        let wrapper = document.createElement('div');
        wrapper.classList.add('item-wrapper');
        wrapper.appendChild(icon);
        wrapper.appendChild(span);
        a.appendChild(wrapper);

        // if item <option> has data-attribute "desc" then
        // create extra text area for that information
        if(data.elem.dataset.desc) {
            let subtext = document.createElement('div');
            subtext.classList.add('subtext');
            subtext.innerHTML = data.elem.dataset.desc;
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
        let group_inclusion = [];
        let group_exclusion = [];
        let inclusion = [];
        let exclusion = [];

        // Go through params, trim them and separate them based on
        // exclusion or inclusion
        for(let i = 0; i < params.length; i++) {
            let string = params[i][0].trim().toLowerCase();
            cleaned_params.push(string);
            if(string.startsWith('--')) {
                if(string.substr(2) !== '') {
                    group_exclusion.push(string.substr(2));
                }
                continue;
            }
            if(string.startsWith('++')) {
                if(string.substr(2) !== '') {
                    group_inclusion.push(string.substr(2));
                }
                continue;
            }
            if(string.startsWith('-')) {
                if(string.substr(1) !== '') {
                    exclusion.push(string.substr(1));
                }
                continue;
            }
            if(string.startsWith('+')) {
                if(string.substr(1) !== '') {
                    inclusion.push(string.substr(1));
                }
                continue;
            }
            // otherwise it is a search term itself
            // and can be added into inclusion
            inclusion.push(string);
        }
        // update the search string for information
        picker.searchString = cleaned_params.join(' ');

        // helper function
        function search_from_item(item, search_array) {
            let search_type = picker.settings.searchFrom;
            let is_found = false;
            search_array.forEach((search_string) => {
                switch(search_type) {
                    case 'both':
                        if(
                            item.search_value.indexOf(search_string) !== -1 ||
                            item.search_label.indexOf(search_string) !== -1 ||
                            item.search_desc.indexOf(search_string) !== -1
                        ) {
                            is_found = true;
                        }
                        break;
                    // values only
                    case 'values':
                        if(item.search_value.indexOf(search_string) !== -1) {
                            is_found = true;
                        }
                        break;
                    default:
                        if(
                            item.search_label.indexOf(search_string) !== -1 ||
                            item.search_desc.indexOf(search_string) !== -1
                        ) {
                            is_found = true;
                        }
                }
            });
            return is_found;
        }
        function search_from_group(data, search_array) {
            if(!data.group || search_array.length === 0) {
                return null;
            }
            let is_found = false;
            let group_name = data.label.toLowerCase().trim();
            search_array.forEach((search_string) => {
                if(group_name.indexOf(search_string) !== -1) {
                    is_found = true;
                }
            });
            return is_found;
        }
        // check data and modify visibility on items based on search
        picker.items.forEach((data) => {
            let is_group_included = search_from_group(data, group_inclusion);
            let is_group_excluded = search_from_group(data, group_exclusion);
            data.items.forEach((i) => {
                if(inclusion.length === 0 && exclusion.length === 0) {
                    i.visible = true;
                    data.match = data.total;
                    return;
                }
                let is_included = search_from_item(i, inclusion);
                let is_excluded = search_from_item(i, exclusion);
                i.visible = true;

                if(is_group_included) {
                    i.visible = true;
                }
                if(!is_included) {
                    i.visible = false;
                }
                if(is_excluded) {
                    i.visible = false;
                }
                if(is_group_excluded) {
                    i.visible = false;
                }
            });
            let viscount = data.items.filter((o) => o.visible === true).length;
            data.match = viscount;
        });
        picker.updateMenu();
        // picker.testRender();
    }

    /** only for debugging */
    updateMenu() {
        let picker = this;
        this.items.forEach((data) => {
            if(data.group) {
                data.listelem.style.display = 'list-item';
                if(data.match == 0) {
                    data.listelem.style.display = 'none';
                }
            }
            data.items.forEach((item) => {
                item.listelem.style.display = 'list-item';
                if(!item.visible) {
                    item.listelem.style.display = 'none';
                }
            });
        });
        let matches = picker.items.filter((o) => o.match > 0).length;
        
        let noresults = picker.menu.querySelector('div.no-results');
        if(matches > 0 || picker.searchString == '') {
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
        ul.classList.add('list');

        picker.items.forEach((data, i) => {
            if(data.group) {
                let li = this.createMenuGroup(data);
                data.listelem = li;
                ul.appendChild(li);
            }
            data.items.forEach((item, j) => {
                let li = this.createMenuItem(data, item);
                // li.dataset.pos = i+'-'+j;
                item.listelem = li;
                ul.appendChild(li);
            });
        });
        menu.appendChild(ul);
        // add placeholder item for no results text
        let noresults = document.createElement('div');
        noresults.classList.add('no-results');
        menu.appendChild(noresults);
        this.menu = menu;
        return menu;
    };

    changeDropdownButton(picker = null) {
        if(picker === null) {
            picker = this;
        }
        let selected = Object.values(picker.select.options).filter((o) => o.selected);
        // if no selection then reset
        if(!selected.length) {
            picker.button.querySelector('span').innerHTML = picker.settings.title;
            picker.button.querySelector('span').innerText = picker.settings.title;
            return;
        }
        // show selection as texts
        if(picker.settings.selectedCount > selected.length -1) {
            let texts = [];
            selected.forEach(function(i) {
                texts.push(i.label);
            });
            let text = texts.join(', ');
            picker.button.querySelector('span').innerHTML = text;
            picker.button.querySelector('span').innerText = text;
            return;
        }
        // otherwise replace with data-count-selected-text
        let text = picker.settings.selectedText.replace('{0}', selected.length);
        picker.button.querySelector('span').innerHTML = text;
        picker.button.querySelector('span').innerText = text;
    }

    /**
     * Reset form changes the selected menu items and button text back to default
     * This is when eg input/button with type "reset" is given.
     * In this reset for select is already happened.
     */
    reset() {
        let picker = this;
        picker.items.forEach((data) => {
            data.items.forEach((i) => {
                i.selected = false;
                i.elem.selected = null;
                i.listelem.classList.remove('selected');
                if(i.initial) {
                    i.selected = true;
                    i.elem.selected = true;
                    i.listelem.classList.add('selected');
                }
            });
        });
        // Reset the button
        picker.changeDropdownButton(picker);
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
        if(li === null) {
            return;
        }
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

module.exports = {ezmodusSelectPicker};
