
if (window.configImport == '1') {
  configEffectiveMsg();
}

if (set_smtp_username.value == '1') {
  nuHide('set_nuemailtest_button');
}

$(function() {
    $('#set_header').scrollTop(window.scrollTop);
});

$('#set_header').addClass('js');
$('#set_style').addClass('css');

$('.js').on('dblclick', function() {
    nuOpenAce('JavaScript', this.id);
});

$('.css').on('dblclick', function() {
    nuOpenAce('CSS', this.id);
});

$('#nuDeleteButton').remove();
$('#nuCloneButton').remove();


nuSetToolTip('set_denied', nuTranslate('Disallow access to nuBuilder\'s core forms.'), true);

nuHide('set_code_snippet_lookupcode');
nuAttachButtonImage('icon_js', 'JS');
nuAttachButtonImage('icon_css', 'CSS');

nuSetProperty('set_header_current', $('#set_header').val());
nuSetProperty('set_language_current', $('#set_language').val());

// Code Snippets form
nuSetSnippetFormFilter(0, 1, 0, 0);

setConfigDatalist('$nuConfigGlobeadminHome', ['nuhome','nuhomecompact']);
setConfigDatalist('nuEditCloseAfterSave', ['None','AllForms',"UserForms","SystemForms"]);
setConfigDatalist('nuCalendarType', ['nuBuilder','VanillaJS']);

nuSelectAddEnglishOption('set_language');

var d = nuDevMode();
if (!d) {
    nuHideTabById('nu5fe19e93306dd6e'); // dev
}

$('#set_files_version_user').val(nuGetFilesVersion());

function incVersion(i) {
    
    var dbv = $('#' + i).val();
    var dbvSplit = dbv.split("-");
    const major = dbvSplit[0];
    const date = dbvSplit[1].slice(0, -3)
    let build = parseInt(dbv.split(/[. ]+/).pop(), 10);

    let today = nuCurrentDate('yyyy.mm.dd');

    build++;
    if (date !== today) {
        build = 0;
    }

    return major + '-' + today + '.' + nuPad2(build);
}

function inDBVersion() {
    var dbInc = incVersion('set_db_version');
    $('#set_db_version_inc').val(dbInc);
}

function inFilesVersion() {
    var filesInc = incVersion('set_files_version');
    $('#set_files_version_inc').val(filesInc);
}


function selectToValueArray(id) {

    var a = [];
    $('#' + id + ' option:selected').each(function(index) {
        if ($(this).text() !== '') {
            a.push($(this).val())
        }
    });

    return a;

}


function nuBeforeSave() {


    if ($('#set_language').hasClass('nuEdited')) {
        $("#set_languages_included option[value='" + $('#set_language').val() + "']").prop("selected", true);
        $('#set_languages_included').change();
    }

    var v = '';
    if (!$('#set_languages_included').hasClass('nuEdited')) v = '-1';

    if (v === '') {
        var languagesIncluded = selectToValueArray('set_languages_included');
        v = languagesIncluded.length === 0 ? '': JSON.stringify(languagesIncluded);
    }

    nuSetProperty('set_languages_included_json', v);
    window.scrollTop = $('#set_header').scrollTop();

    nuBeforeSaveConfig();

    return true;

}

// Config

function nuAfterSave() {

    configEffectiveMsg();
    
    nuAddCSSStyle(set_style.value);
}

function configEffectiveMsg() {

    if (window.configEffective == '2') {
        nuMessage(nuTranslate('You will need to log in again for the changes to take effect.'));
    } else if (window.configEffective == '3' || window.configImport == '1') {
        nuMessage(nuTranslate('You may need to restart your browser for the changes to take effect.'));
    }

    window.configEffective = '1';
    window.configImport = '0';

}

// Settings:

sfAddFilters();
sfChangeValueObjectTypes();
sfSetDescriptionTitle();
sfStoreInitialValues();

$('#nuCloneButton').remove();
$('#nuDeleteButton').remove();


function nuOnSetSaved(v) {
    if (v === false) {
        nuDisable('button_import');
    }
}

function sfStoreInitialValues() {
    $('[id ^=nuconfigsettings][id $=cfg_value]').each(function() {
        $(this).attr('data-org-value', nuBase64encode(this.value));
    });
}

function onConfigValueChanged(t) {
    let orgValue = nuBase64decode($(t).attr('data-org-value'));
    if (orgValue !== t.value) {
        $(t).addClass('changedCgfValue');
    } else {
        $(t).removeClass('changedCgfValue');
    }
}

function sfSetDescriptionTitle() {

    let fieldArr = nuSubformColumnArray('nuconfigsettings', 'cfg_description');

    for (var i = 0; i < fieldArr.length; i++) {

        var f = $('#nuconfigsettings' + nuPad3(i) + 'cfg_description');
        if (f.val() !== '') {
            f.attr('title', f.val());
        }


    }

}

function sfAddFilters() {

    const OPTION_ALL = '(' + nuTranslate('All') + ')';

    var sfFilter = {};
    sfFilter.nuconfigsettings = {
        'cfg_setting': {
            type: 'search',
            float: 'left'
        },
        'cfg_category': {
            type: 'select',
            blank: false,
            all: OPTION_ALL
        }
    };

    nuSubformAddFilter(sfFilter);

}


function changeObjectTypeToSelectBoolean(i) {

    const el = $('#' + i);

    el.replaceWith($('<select />').attr({
        id: el.attr('id'),
        name: el.attr('name'),
        class: el.attr('class'),
    }));

    let elSelect = $('#' + i);

    elSelect.css({
        top: el.cssNumber('top'),
        left: el.cssNumber('left'),
        width:  el.cssNumber('width'),
        height: el.cssNumber('height'),
        position: 'absolute'
    });

    copyAttributes(el[0], elSelect[0]);

    return elSelect;

}

function copyAttributes(source, target) {

    return Array.from(source.attributes).forEach(attribute => {
        target.setAttribute(
            attribute.nodeName === 'id' ? 'data-id': attribute.nodeName,
            attribute.nodeValue
        );
    });

}


function selectAddBooleanOptions(el, val) {

    el.append("<option value='" + 'true' + "'>" + 'true' + "</option>");
    el.append("<option value='" + 'false' + "'>" + 'false' + "</option>");

    let index = val == 'true' ? 0: (val == 'false' ? 1: -1);

    el.prop('selectedIndex', index);

}

function sfChangeValueObjectTypes() {

    const sfName = 'nuconfigsettings';
    const sf = nuSubformObject(sfName);
    const typeCol = sf.fields.indexOf('cfg_type');

    for (let i = 0; i < sf.rows.length; i++) {

        const el = sfName + nuPad3(i) + 'cfg_value';
        const obj = $('#'+ el);
        const val = obj.val();
        const type = sf.rows[i][typeCol];

        if (type == '2') {
            let selectObj = changeObjectTypeToSelectBoolean(el);
            selectAddBooleanOptions(selectObj, val);

        } else if (type == '3') {
            document.getElementById(el).type = 'number';

        } else if (type == '9') {
            let selectObj = changeObjectTypeToSelectBoolean(el);
            addAceOptions(selectObj, val);
        }

    }
}

function addAceOptions(obj, value) {

    const options = `
        <optgroup label="Bright">
           <option value="chrome">Chrome</option>
           <option value="clouds">Clouds</option>
           <option value="crimson_editor">Crimson Editor</option>
           <option value="dawn">Dawn</option>
           <option value="dreamweaver">Dreamweaver</option>
           <option value="eclipse">Eclipse</option>
           <option value="github">GitHub</option>
           <option value="iplastic">IPlastic</option>
           <option value="solarized_light">Solarized Light</option>
           <option value="textmate">TextMate</option>
           <option value="tomorrow">Tomorrow</option>
           <option value="xcode">XCode</option>
           <option value="kuroir">Kuroir</option>
           <option value="katzenmilch">KatzenMilch</option>
           <option value="sqlserver">SQL Server</option>
        </optgroup>
        <optgroup label="Dark">
           <option value="ambiance">Ambiance</option>
           <option value="chaos">Chaos</option>
           <option value="clouds_midnight">Clouds Midnight</option>
           <option value="dracula">Dracula</option>
           <option value="cobalt">Cobalt</option>
           <option value="gruvbox">Gruvbox</option>
           <option value="gob">Green on Black</option>
           <option value="idle_fingers">idle Fingers</option>
           <option value="kr_theme">krTheme</option>
           <option value="merbivore">Merbivore</option>
           <option value="merbivore_soft">Merbivore Soft</option>
           <option value="mono_industrial">Mono Industrial</option>
           <option value="monokai">Monokai</option>
           <option value="nord_dark">Nord Dark</option>
           <option value="one_dark">One Dark</option>
           <option value="pastel_on_dark">Pastel on dark</option>
           <option value="solarized_dark">Solarized Dark</option>
           <option value="terminal">Terminal</option>
           <option value="tomorrow_night">Tomorrow Night</option>
           <option value="tomorrow_night_blue">Tomorrow Night Blue</option>
           <option value="tomorrow_night_bright">Tomorrow Night Bright</option>
           <option value="tomorrow_night_eighties">Tomorrow Night 80s</option>
           <option value="twilight">Twilight</option>
           <option value="vibrant_ink">Vibrant Ink</option>
           <option value="github_dark">GitHub Dark</option>
        </optgroup>        
    `;

    obj.html(options).val(value);

}

function nuBeforeSaveConfig() {

    window.configEffective = '1';

    $('.nuEdited').each(function() {
        const rowId = this.id.replace('nuconfigsettings', '').slice(0, 3);
        const effective = $('#nuconfigsettings' + rowId + 'cfg_effective').val();

        if (effective == '2' || effective == '3') { // log in again or restart browser
            window.configEffective = effective;
            return false;
        }

    })

}


function setConfigDatalist(cfgItem, arrDatalist) {

 	const input = $('input').filter((i,v) => v.value == cfgItem);
	if (input.length == 1) {
		const valueId = input.attr('id').replace('cfg_setting','cfg_value');
		nuAddDatalist(valueId, arrDatalist);
	}

}

