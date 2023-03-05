# Release notes

## 1.0.2

 -  **Distribution files**

    Distribution files were development format, updated to production and minified.

## 1.0.1

- **Fixed dropdown focusout**

    Menu was not closing if no action on menu was first done. Event was set into wrong place and is now on dropdown.

- **`<option>` class extension**

    Support for disabled items `<option disabled>`. This gives menu item new data-attribute: `data-disabled["true"]`

    Support to pass any class name from `<option>` to list item `li`. Gives developer more flexibility to add extra styling for special reasons, example highlighting errors with own class.

    Added SCSS variables to control disabled styling, `$ezmodus-list-item-disabled-color` and `$ezmodus-list-item-disabled-background-color`.

- **Menu**

    Added missing foreground SCSS variable for menu item, `$ezmodus-list-item-color`.

    Added Keyboard event for SPACE. Normally items can be tabbed through, but now with SPACE you can toggle the list items to be selected or not.


- **Updated documentation**

    Seperate release notes.

    Example picture for disabled options and passing option class.

---

[Back to README.md](../README.md)
