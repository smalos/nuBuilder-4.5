function nuAddDBColumnGetDataType(t, i, selectMultiple) {

    let dt = 'VARCHAR(100)';

    if (t == 'lookup') {
        dt = 'VARCHAR(25)';
    }
    if (t == 'select' && ! selectMultiple) {
        dt = 'VARCHAR(100)';
    }
    if (t == 'select' && selectMultiple) {
        dt = 'VARCHAR(1000)';
    }
    if (t == 'calc') {
        dt = 'DECIMAL(12,4)';
    }
    if (t == 'textarea') {
        dt = 'TEXT';
    }

    if (t == 'input') {
        let dtInput = '';
        if (i == 'date' || i == 'nuDate') {
            dtInput = 'DATE';
        }
        if (i == 'number') {
            dtInput = 'INT';
        }
        if (i == 'nuAutoNumber') {
            dtInput = 'BIGINT UNSIGNED';
        }
        if (i == 'nuNumber') {
            dtInput = 'DECIMAL(12,4)';
        }
        if (i == 'file') {
            dtInput = 'LONGTEXT';
        }
        dt = dtInput != '' ? dtInput: 'VARCHAR(100)';

    }

    return dt;
}


var table = parent.$('#sob_all_table').val();
var id = parent.$('#sob_all_id').val();
var type = parent.$('#sob_all_type').val();
var input = parent.$('#sob_input_type').val();
var selectMultiple = parent.nuGetValue('sob_select_multiple')
var dataType = nuAddDBColumnGetDataType(type, input);

var qry = '`$column` $type NULL DEFAULT NULL';
qry = qry.replace('$column', id);
qry = qry.replace('$type', dataType);

var start = 'ALTER TABLE `$table` ADD'
start = start.replace('$table', table);

$('#sql_query_word').html(start);
$('#sql_query').val(qry);

nuAddActionButton('Run', 'Run', 'nuHasNotBeenEdited(); nuRunPHPHidden("NURUNADDDBCOLUMN")');

$('#sql_query').addClass('sql');
$('.sql').on('dblclick', function() {
    nuOpenAce('SQL', this.id);
});

nuSetProperty('sob_all_table', table);
nuRefreshSelectObject('sql_after_column');