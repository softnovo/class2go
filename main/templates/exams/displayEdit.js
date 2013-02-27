{% load i18n %}
{% trans "Save" as save_trans %}

window.displayEditQuestion = function(questionMD){
    //This function takes a DOM object of the metadata and displays the question explanation after the
    //question with the corresponding id
    var mySolution = $(questionMD).find('solution');
    var assocQID = $(questionMD).attr('id');
    var explArea = $('#' + assocQID + '-edit');
    if (explArea.length == 0) {
        explArea = document.createElement('div');
        $(explArea).attr('id', assocQID + '-edit');
        $(explArea).addClass('edit');
    }
    $(explArea).empty();
    if ($('#' + assocQID + ' .edit').length == 0) {
        var toggleExplBtn = document.createElement('input');
        $(toggleExplBtn).attr('type','button');
        $(toggleExplBtn).addClass('btn').addClass('edit-button'); 
        $(toggleExplBtn).attr('data-status', 'Show');
        $(toggleExplBtn).attr('value', 'Edit');
        $(toggleExplBtn).click(function() { edit(questionMD); });
    }
    $('div.question#' + assocQID ).append($(explArea));
    $(explArea).before('<div class="clearing-div"></div>').before($(toggleExplBtn));
};


window.edit = function(questionMD) { 
    assocQID = $(questionMD).attr('id'); 
    //Find HTML 
    var editor_value = editor.getValue(); 
    var container = document.createElement('div');
    container.innerHTML = editor_value; 
    var assocHTML = $(container).find('#' + assocQID)[0]; 
    var fieldset = $(assocHTML).find('fieldset'); 
    
    //Find XML 
    var mDOM=$.parseXML(metadata_editor.getValue());
    var assocXML = $(mDOM).find('#' + assocQID)[0]; 
    var response = $(assocXML).find('response')[0]; 
    var answerType = response.getAttribute('answertype'); 
    
    if(answerType == 'multiplechoiceresponse')
    {
        $("#single-choice-entry-question-text")[0].value = $($(assocHTML).find('div.question_text')[0]).find('p')[0].innerText 
        $("#single-choice-entry-correct-points")[0].value = response.getAttribute('correct-points'); 
        $("#single-choice-entry-wrong-points")[0].value = response.getAttribute('wrong-points'); 
        
        var solution = $($(assocXML).find('solution')[0])[0]; 
        var div = $(solution).find('div')[0];
        $("#single-choice-entry-question-explanation")[0].value = $(div).find('p')[0].innerText 
        
        var choices = $(response).find('choice'); 
        var labels = $(fieldset).find('label'); 
        for(var i = 0; i < choices.length; i++)
        {
            var choice = choices[i]; 
            var label = labels[i]; 
            var x = i+1;
            $("#single-choice-entry-answer" + x)[0].value = $(label).find('span')[0].innerText; 
            
            $("#single-choice-entry-value-answer" + x)[0].value = choice.getAttribute('value');     
            $("#single-choice-entry-correctness-answer" + x)[0].value = choice.getAttribute('correct');     
            
            var explanation = $(choice).find('explanation')[0]; 
            $("#single-choice-entry-explanation-answer" + x)[0].value = explanation.innerText;                  
            
        }
  	    $( "#single-choice-entry-edit" )[0].value = assocQID;
  	    $("#add-single-choice-button")[0].textContent = '{{ save_trans }}';          
        $( "#single-choice-form" ).dialog( "open" );	
    } else { 
        $("#numerical-response-question-text")[0].value = $($(assocHTML).find('div.question_text')[0]).find('p')[0].innerText 
        
        var solution = $($(assocXML).find('solution')[0])[0]; 
        var div = $(solution).find('div')[0];
        $("#numerical-response-question-explanation")[0].value = $(div).find('p')[0].innerText 
        
        var responses = $(assocXML).find('response'); 
        var p_elements = $(assocHTML).find('p'); 
        for(var m = 0; m < 3; m++)
        {
            if(m < responses.length) {
                var response = responses[m]; 
                $("#numerical-response-question-correct-points" + (m+1))[0].value = response.getAttribute('correct-points'); 
                $("#numerical-response-question-wrong-points" + (m+1))[0].value = response.getAttribute('wrong-points');
            
                var span_element = $(p_elements[m+1]).find('span')[0]; 
                $("#numerical-response-question-answer" + (m+1))[0].value = span_element.innerText;
                        
                $("#numerical-response-question-actual-answer" + (m+1))[0].value = response.getAttribute('answer');
                var responseparam = $(response).find('responseparam'); 
                if(responseparam)
                {
                    $("#numerical-response-question-tolerance-answer" + (m+1))[0].value = responseparam[0].getAttribute('default');                
                }
            } else {     
                $("#numerical-response-question-correct-points" + (m+1))[0].value = "";
                $("#numerical-response-question-wrong-points" + (m+1))[0].value = ""; 
                $("#numerical-response-question-answer" + (m+1))[0].value = ""; 
                $("#numerical-response-question-actual-answer" + (m+1))[0].value = "";
                $("#numerical-response-question-tolerance-answer" + (m+1))[0].value = "";
            }
        }
        
        $( "#numerical-response-question-edit" )[0].value = assocQID;
        $("#add-numerical-response-button")[0].textContent = '{{ save_trans }}';   
               
        $( "#numerical-response-form" ).dialog( "open" );	
    }
}