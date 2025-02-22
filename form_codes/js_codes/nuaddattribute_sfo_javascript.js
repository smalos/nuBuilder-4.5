/*
    0|autocomplete|
    1|accesskey|
    2|data-|
    3|maxlength|
    4|placeholder|
    5|spellcheck|
    6|title|
    7|value|
    8|nu-label-position
*/

nuHide('plh_value_select');
nuHide('plh_attribute_name');
nuHideTabs(0);
nuSelectRemoveEmpty('plh_attribute', '-1');
nuAddActionButton('nuAddAttribute', 'Add', 'addAttribute();');

function nuOnMobileViewComplete() {
  const currentTop = $('#plh_value_text').css('top');
  const currentTopLabel = $('#label_plh_value_text').css('top');
  $('#plh_value_select').css('top', currentTop);
  $('#label_plh_value_select').css('top',  currentTopLabel);
}

if (typeObj().val() !== 'input') {
    nuSelectRemoveOption('plh_attribute', '7').val('');
}

function onAttributeChanged(value) {

    nuShow('plh_value_select', value === '0' || value === '5' || value === '8');
    nuShow('plh_value_text', !(value === '0' || value === '5' || value === '8'));
    nuShow('plh_attribute_name', value === '2');
    
    nuSetValue('plh_value_text','');

    if (value === '0') {
        $("#plh_value_select").empty();
        addSelectOption('0', 'on');
        addSelectOption('1', 'off');
    } else if (value === '5') {
        $("#plh_value_select").empty();
        addSelectOption('0', 'true');
        addSelectOption('1', 'false');
    } else if (value === '4') {
        nuSetPlaceholder('plh_value_text', 'Placeholder text');
    } else if (value === '6') {
        nuSetPlaceholder('plh_value_text', 'Tooltip text');
    } else if (value === '2') {
        nuSetPlaceholder('plh_value_text', 'String value');
        $('#plh_attribute_name').trigger("focus");
    } else if (value === '1') {
        nuSetPlaceholder('plh_value_text', 'Single character');
    } else if (value === '3') {
        nuSetPlaceholder('plh_value_text', 'Number value');
    }  else if (value === '7') {
        nuSetPlaceholder('plh_value_text', 'String');
    }  else if (value === '8') {
        $("#plh_value_select").empty();
        addSelectOption('top', 'top');
    } 

}

function addSelectOption(value, text) {
    $('#plh_value_select').append('<option value="' + value + '">' + text + '</option>');
}

function attributesObj() {
    return $("#sob_input_attribute", window.parent.document);
}

function typeObj() {
    return $("#sob_all_type", window.parent.document);
}


function valueObjText() {
    return $('#plh_value_text').is(":visible") ? nuGetValue('plh_value_text') : nuGetValue('plh_value_select', 'text');
}

function addAttribute() {
    
    let v = valueObjText();
    let an = nuGetValue('plh_attribute_name');

    if (v === '') {
        nuMessage(`${nuTranslate('Error')}`, `${nuTranslate("Missing value")}`);
        return;
    }

    if (an === '' && nuGetValue('plh_attribute') == '2') { // data-
        nuMessage(`${nuTranslate('Error')}`, `${nuTranslate("Missing name")}`);
        return;
    }    

    let t = attributesObj();
    let k = nuGetValue('plh_attribute', 'text') + an;
    let kEquals = k + '="';

    if (t.val().includes(kEquals)) {
        nuMessage(`${nuTranslate('Error')}`, `${nuTranslate("The attribute already exists")}`);
        return;
    }

    let kv = kEquals + v + '"';

    if (t.val() === '') {
        t.val(kv).change();
    } else {
        t.val(t.val() + ',' + kv).change();
    }

}