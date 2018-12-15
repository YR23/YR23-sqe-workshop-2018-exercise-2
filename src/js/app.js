import $ from 'jquery';
import {ParseDataToTableBig} from './code-analyzer';


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        var args = readArgs($('#args').val());
        var finalJson = ParseDataToTableBig(codeToParse,args);
        var Color = {true:'green',false:'red',null:'white'};
        CreateTableFromJson(finalJson,Color);
        //$('#parsedCode').val(finalJson);
    });
});

function readArgs(val) {
    return val.split('|');
}


function RemoveCurrent(document) {
    document.querySelectorAll('span').forEach(function(a){
        a.remove();
    });
    document.querySelectorAll('br').forEach(function(a){
        a.remove();
    });
}

function CreateTableFromJson(myBooks,Color) {
    $('#texting').find('*').each(function( index, element ) {
        $(element).removeClass();
        $(element).removeAttr();
    });
    RemoveCurrent(document);
    for (var i=0; i< myBooks.length ; i++)
    {
        var h = document.createElement('span');
        var t = document.createTextNode(myBooks[i].text);
        h.style.backgroundColor = Color[myBooks[i].IsGreen];
        h.id = 'texting'+i;
        h.appendChild(t);
        document.body.appendChild(h);
        document.body.appendChild(document.createElement('br'));
    }
}
