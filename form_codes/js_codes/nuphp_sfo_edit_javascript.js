nuHide('sph_code_snippet_select_lookupcode');

// Code Snippets form
nuSetSnippetFormFilter(0, 0, 0, 1); // PHP Code

var recordId = nuRecordId();
var recordIdSuffix = recordId.slice(-2);
var justPHP = window.filter == 'justphp';

window.nuImages = parent.nuImages;

if (isTemplate() && !nuDevMode()) {
    nuDisableAllObjects();
    nuMessage("Unable to save templates. Please clone them to create a new copy and save the cloned version instead.", 2500);
}

if (justPHP) {

    window.nuHelp = 'Functions';

    nuHideTabById('nu5fdf7df2d873dd1'); // Access Levels
    $('#nuCloneButton').remove();

    if (nuIsIframe()) {
        var ev = eventName(recordIdSuffix) ;
        var formInfo = ev == 'After Browse' ? $('#sob_all_label', window.parent.document).val(): 
        $('#nuBreadcrumb0').html(ev + ' - ' + formInfo);
    } else {
       nuSetTitle(recordId);
    }


    nuAttachButtonImage('icon', recordIdSuffix);

    nuSetValue('sph_code', recordId);
    nuSetValue('sph_description', 'System PHP');
    nuSetValue('sph_system', '1');

    nuHide('sph_code');
    nuHide('sph_description');
    nuHide('sph_zzzzsys_form_id');
    nuHide('sph_group');
    nuHide('sph_system');
    nuHide('sph_run');

    setStyles();

    $('.nuSaveButtonEdited').removeClass('nuSaveButtonEdited');



} else {

    window.nuHelp = 'Procedures';

    if (! recordId.startsWith('nu')) {
        nuSetValue('sph_system', '0');
        nuSetValue('sph_hide', '');
    }

    if (!nuIsNewRecord()) {
        nuUpdateAclCount();
        nuAddActionButton('runProcedure', 'Run', 'runProcedure();');
    }


}

$('#sph_php')
.addClass('php')
.on('dblclick', function() {
    nuOpenAce('PHP', this.id);
});

$(function() {
    $('#sph_php').scrollTop(window.scrollTop);
});

nuHasNotBeenEdited();

function eventName(recordIdSuffix) {

    const ev = [];

    ev.BB = 'Before Browse';
    ev.BE = 'Before Edit';
    ev.BS = 'Before Save';
    ev.AS = 'After Save';
    ev.BD = 'Before Delete';
    ev.AD = 'After Delete';
    ev.AB = 'After Browse';

    return ev[recordIdSuffix];

}


function setStyles() {

    $('#label_sph_code_snippet_select_lookup').css({
        'top': '30px', 'left': '740px'
    });

    $('#sph_code_snippet_select_lookupbutton').css({
        'top': '30px', 'left': '845px'
    });

    $('#label_sph_php').css('top', '40px').css('left', '20px');

    $('#wiki').css('left', '670px');

    $('#sph_php')
    .css('padding', '3px 3px 3px 3px')
    .css('top', '60px')
    .css('left', '90px')
    .trigger("focus");

}

function runProcedure() {

    if (sph_run.value == 'window') {
        nuRunPHP(sph_code.value, '', 0);
    } else {
        nuRunPHPHidden(sph_code.value, 0);
    }

}

function nuUpdateAclCount() {

    const l = $("[data-nu-field='slp_zzzzsys_access_id']").length -2;
    const t = l <= 0 ? '': ' (' + l + ')';
    $('#nuTab1').html(nuTranslate('Access Level') + t);

}

function isTemplate() {
    return nuGetValue('sph_template');
}


function onCloneTemplate() {

    let code = sph_code.value;

    if (isTemplate()) {       
        code = code == 'NUSENDWELCOMEEMAIL_Template' ? 'nuSendWelcomeEmail' : code.substring(0, code.length-9);   
        nuSetValue('sph_code', code);
        nuSetValue('sph_group', '');
        nuSetValue('sph_template', false);
        nuEnableAllObjects();
    }

}

function nuOnClone() {

    if (window.filter !== 'justphp') {
        onCloneTemplate();
    }

}

function nuOnSetSaved(v) {
    nuEnable('nurunProcedureButton', v);
}

function nuBeforeSave() {

    if (nuFormType() == 'edit') {
        window.scrollTop = $('#sph_php').scrollTop();
    }

    return true;

}

