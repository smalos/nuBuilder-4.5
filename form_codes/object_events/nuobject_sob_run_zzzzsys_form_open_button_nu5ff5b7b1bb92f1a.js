var form_id =  $('#sob_run_zzzzsys_form_id').val(); if (form_id !== '') { 	nuForm('nuform',form_id,'','',2);} else { nuMessage([nuTranslate('Select a (Run) Form first.')]); }