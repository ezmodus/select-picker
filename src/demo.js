let buttons = document.querySelectorAll('.show-button');

buttons.forEach(function(button) {
    button.addEventListener('click', function() {
        let target = document.getElementById(button.dataset.target);
        target.classList.toggle('hide');

    });
});

let disables = document.querySelectorAll('.toggle-disable');

disables.forEach(function(button) {
    button.addEventListener('click', function() {
        let target = document.getElementById(button.dataset.target);
        target.toggleAttribute('disabled');
    });
});
