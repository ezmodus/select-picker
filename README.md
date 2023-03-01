# ezmodus select picker

**Improve the select element with this new purely native Javascript written library.**

---

## Preface

I made this project, because I was updating one of my projects to Bootstrap 5 and I was using boostrap-select (https://github.com/snapappointments/bootstrap-select) which states "Now with bootstrap 5 support" on it's readme file (April 2022).

Unfortunately I noticed that this wasn't the case even living in 2023. I already started to refactor my project and didn't want to rollback just because of this. Therefore I decided to to write from scratch native JS version and also without bootstrap.

Because maybe someone else may be in the similar situation I decided to publish this to free use.

It works pretty much the same as bootstrap-select, but this also adds couple of extra features.

- Select with multiple adds a button to able to clear the current selected items.
- With `data-max-select` value able to restrict maximum selection of items.
- With `data-clear-show` and `data-clear-button` able to decide what to show on clear button.
- Able to set search also on option-element values side or both.

---

## Install

```bash
npm install @ezmodus/select-picker --save
```

You can prebuilt javascript and styling or do modifications first by loading from source.

```scss
// from node modules
// from dist (prebuilt, minified)
@import '~ezmodus-select-picker/dist/style.css';

// SCSS
@import '~ezmodus-select-picker/src/_variables.scss';

// change variable settings here
$ezmodus-dropdown-tick-color: 'red';

// load rest of the styling
@import '~ezmodus-select-picker/src/style.scss';
```

```js
// from node modules
// from dist (prebuilt, minified)
import 'ezmodus-select-picker/dist/select';

// from source if you want to modify ezmodusSelectPicker-class
import 'ezmodus-select-picker/src/select';
```

---

## Usage, defaults and modifiers

Simple just add the class `ezmodus-select-picker` to select-element.

```html
<!-- single select -->
<select class="ezmodus-select-picker">...</select>

<!-- multi selection -->
<select class="ezmodus-select-picker" multiple>...</select>

<!-- more settings -->
<select class="ezmodus-select-picker"
    size="6"
    title="Choose car brands"
    data-live-search="true"
    data-count-selected-text="{0} selected"
    data-selected-count="3"
    data-no-results-text="No results"
    data-max-select="3"
    data-clear-show="true"
    data-clear-button="clear my selection"
    data-live-search="true" multiple>
    <!-- my option data -->
</select>
```

These can be modified a lot to give more richer tools to use.

### Variables

| Attribute             | Default                   | Description
|-----------------------|---------------------------|-----------------
| size                  | null / 10                 | How many items are shown when dropdown opens. Single selection all (null), for multiple defaults to 10.
| title                 | Select                    | Text, what to show on when no selection on dropdown
| data-live-search      | false                     | If 'true' then show search input for list items
| data-search-from      | null                      | Search from texts, if "values" then search looks values of "option value", if "both" then look for values or texts
| data-clear-show       | false                     | Only for multiple, but if 'true' then show button before the list to clear/reset existing selections
| data-clear-button     | clear selection           | Default text for the button
| data-max-select       | null                      | Integer, limits maximum select count
| data-selected-count   | 1                         | How many selections are shown until replacement (data-selected-text)
| data-selected-text    | {0} selected              | How many are selected, notice {0} is replacement variable to replace select count, works without it too.
| data-no-results-text  | No results matched "{0}"  | When search does not find anything then this is the message, notice {0} is replacement variable and will be replaced by the search string, works without it too.
| data-tick             | true                      | shows tick on dropdown

---

## Development

Super simple setup

- Run `npm install`
- Run `npm build|watch|production`
- View Demo under `demo/index.html`
