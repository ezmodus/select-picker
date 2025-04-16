const {ezmodusSelectPicker} = require('./SelectPickerClass');

// pickup all selects with the class and do the transition to new picker
document.addEventListener('DOMContentLoaded', function() {
    let ezmodus_select_pickers = [];
    document.querySelectorAll('select.ezmodus-select-picker').forEach(function(select, i) {
        ezmodus_select_pickers.push(new ezmodusSelectPicker(select, i));
    });
    document.querySelectorAll('*[type="reset"]').forEach(
        (reset) => {
            reset.addEventListener('click', function() {
                // find closest form
                let form = reset.closest('form');
                // find all pickers
                form.querySelectorAll('select.ezmodus-select-picker').forEach(
                    (select) => {
                        if(picker = ezmodus_select_pickers[select.dataset.id]) {
                            picker.reset();
                        }
                    }
                );
            })
        }
    );
});
