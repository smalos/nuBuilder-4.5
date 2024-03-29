nuAddActionButton('nuRuntestemail', nuTranslate('Send'), 'nuRunPHPHidden("NUTESTEMAIL")');

if (parent.$('#nuModal').length > 0) {

    var p = window.parent;h
    $('#set_smtp_from_address').val(p.set_smtp_from_address.value);
    $('#ema_to').val(p.set_smtp_from_address.value);
    $('#set_smtp_from_name').val(p.set_smtp_from_name.value);
    $('#ema_body').val('nuBuilder <b>Email<br> Test');
    $('#ema_subject').val('nuBuilder Test - ' + new Date().toLocaleString());

}


nuSetToolTip('ema_load_data', nuTranslate('Load from Local Storage'));
nuSetToolTip('ema_save_data', nuTranslate('Save to Local Storage'));


function saveDatatoLS() {

    $('input[type=text], textarea').each(function() {
        localStorage.setItem(this.id, $(this).val());
    });

}


function loadDatafromLS() {

    $('input[type="text"], textarea').each(function() {
        var key = $(this).attr('id');

        var value = localStorage.getItem(key);
        if (value || value === '') {
            $(this).val(value);
        } else {
            nuMessage(["There's no Data to load in Local Storage"])
        }

    });
}