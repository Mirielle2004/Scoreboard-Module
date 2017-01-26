/*
Scoreboard Module by Burey
requires the following scripts/links in HTML head:
        <script src="https://www.gstatic.com/firebasejs/3.6.6/firebase.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
        <script src="https://code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
        <link href="https://code.jquery.com/ui/1.10.4/themes/ui-lightness/jquery-ui.css" rel="stylesheet">
        <!-- THIS FILE MUST BE BELOW THE OTHERS! -->
        <script src="https://raw.githubusercontent.com/bureyburey/Scoreboard-Module/master/scoreboard.js"></script>
requires your own firebase account
see https://code.sololearn.com/Wb3UALD0atIG/ for tutorial
if changing options, DO NOT REMOVE EXISTING options, just leave the {} brackets empty
default options:
var options={
    // customize the following:
    // syntax is like css, but make sure:
    // key and value are both strings!
    "scoreboardWidth":"auto", //recommended
    "scoreboardHeight":"400", // recommended
    "submitDialogWidth":"auto", //recommended
    "submitDialogHeight":"auto", // recommended
         burey:{
    // Scoreboard Module By Burey text
         "font-family":"Times New Roman",
         "font-style":"italic",
         "text-shadow": "5px 2px 4px grey",
         "color": "#9910ff",
         "background-color":"white",
         "border-radius": "25px"
         },
         dialogTitle:{
         // dialogs title bar
         "font-family":"Times New Roman",
         "background":"black",
         "color":"#9910ff"
         },
         scoreboardContainer:{
    // scoreboard container dialog
         "background-color":"black"
         },
         tableHeader:{
    // # Name Score Time
         "font-family":"Times New Roman",
         "color": "#9910ff"
         },
         scorePosition:{
    // #
         "font-family":"Times New Roman",
         "color": "#9910ff"
         },
         scoreName:{
    // name of user
         "font-family":"Times New Roman",
         "color": "#9910ff",
         "word-wrap": "break-word",
         "max-width":"110px"
         },
         scoreValue:{
    // score value
         "font-family":"Times New Roman",
         "font-size": "15px",
         "color": "#9910ff"
         },
         scoreTime:{
    // time + date
         "font-family":"Times New Roman",
         "font-size":"12px",
         "color": "#9910ff"
         },
         newScoreContainer:{
    // submit new score dialog
         "background-color":"black"
         },
         scoreYourScoreLabel:{
    // 'Your Score:' text in new score dialog
         "font-family":"Times New Roman",
         "color": "#9910ff"
         },
         scoreValueLabel:{
    // score value in new score dialog
         "font-family":"Times New Roman",
         "color": "#9910ff",
         "margin-right":"25px"
         },
         scoreErrorLabel:{
    // error label in new score dialog
         "font-family":"Times New Roman",
         "color": "red"
         },
         scoreboardButtons:{
    // scoreboard dialog buttons
         "font-family":"Times New Roman",
         "text-shadow": "5px 2px 4px grey",
         "background":"black",
         "color": "#9910ff",
         "display":"none" // remove button
         },
         newScoreButtons:{
    // new score dialog buttons
        "font-family":"Times New Roman",
         "text-shadow": "5px 2px 4px grey",
         "background":"black",
         "color": "#9910ff"
         },
         loaderOptions:{
     // scoreboard loading animation
        "border-bottom": "16px solid #888",
        "border-top": "16px solid #888",
        "border-right": "16px solid #9910ff",
        "border-left": "16px solid #9910ff",
        "margin-left": "auto",
        "margin-right": "auto"
    }
}
usage example:

var scoreboard = new Scoreboard(options);
scoreboard.showScoreBoard(); // opens the scoreboard
scoreboard.submitNewScoreDialog(scoreValue); // open score submit dialog (allow entry of name)
*/





///////// CODE STARTS HERE /////////
var markdown = {
    // taken from Michael Ermishin's Markdown module
    htmlEntitiesMap: {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
        ' ': '&nbsp;'
    },    
    specToEntities: function(text) {
        var pattern = new RegExp('[' + Object.keys(this.htmlEntitiesMap).join('') + ']', 'g');
        //return text.replace(pattern, k => this.htmlEntitiesMap[k]);
        return text.replace(pattern, function (m) {
            return markdown.htmlEntitiesMap[m];
        });
    }    
};

var optionsMap = {
    // mapping of option name to actual element
    burey:"#by_burey",
    dialogTitle:".ui-dialog-titlebar",
    scoreboardContainer:"#container_scoreboard",
    tableHeader:"#tbl_header",
    scorePosition:".score_pos",
    scoreName:".score_name",
    scoreValue:".score_value",
    scoreTime:".score_time",
    newScoreContainer:"#container_submit_score_dialog",
    scoreYourScoreLabel:"#lbl_your_score",
    scoreValueLabel:"#lbl_best_score_submit",
    scoreErrorLabel:"#lbl_best_score_name_error",
    scoreboardButtons:".buttons_scoreboard",
    newScoreButtons:".buttons_new_score",
    loaderOptions:"#loader"
};

var defaultOptions = {
    // customize the following:
    // syntax is like css, but make sure:
    // key and value are both strings inside each option!
    "scoreboardWidth":"90%", //recommended
    "scoreboardHeight":"400", // recommended
    "submitDialogWidth":"auto", //recommended
    "submitDialogHeight":"auto", // recommended
    burey:{
// Scoreboard Module By Burey text
    "font-family":"Times New Roman",
    "font-style":"italic",
    "text-shadow": "5px 2px 4px grey",
    "color": "green",
    "background-color":"white",
    "border-radius": "25px"
    },
    dialogTitle:{
    // dialogs title bar
    "background":"black",
    "color":"white"
    },
    scoreboardContainer:{
    // scoreboard container dialog
    "background-color":"#97B5F5"
    },
    tableHeader:{
    // # Name Score Time
    "font-family":"Times New Roman",
    "color": "black"
    },
    scorePosition:{
    // #
    "font-family":"Times New Roman",
    "color": "blue"
    },
    scoreName:{
    // name of user
    "font-family":"'Press Start 2P', Times New Roman",
    "font-size":"10px",
    "color": "red",
    "word-wrap": "break-word",
    "max-width":"110px"
    },
    scoreValue:{
    // score value
    "font-family":"Times New Roman",
    "font-size": "15px",
    "color": "green"
    },
    scoreTime:{
    // time + date
    "font-family":"Times New Roman",
    "font-size":"12px",
    "color": "yellow"
    },
    newScoreContainer:{
    // submit new score dialog
    "background-color":"#97B5F5"
    },
    scoreYourScoreLabel:{
    // 'Your Score:' text in new score dialog
    "font-family":"Times New Roman",
    "color": "green"
    },
    scoreValueLabel:{
    // score value in new score dialog
    "font-family":"Times New Roman",
    "color": "blue",
    "margin-right":"25px"
    },
    scoreErrorLabel:{
    // error label in new score dialog
    "font-family":"Times New Roman",
    "color": "red"
    },
    scoreboardButtons:{
    // scoreboard dialog buttons
    "font-family":"Times New Roman",
    "text-shadow": "5px 2px 4px grey",
    "background":"red",
    "color": "white",
    "display":"none" // remove button
    },
    newScoreButtons:{
    // new score dialog buttons
    "font-family":"Times New Roman",
    "text-shadow": "5px 2px 4px grey",
    "background":"black",
    "color": "white"
    },
    loaderOptions:{
    // scoreboard loading animation
        "border-bottom": "25px solid #888",
        "border-top": "25px solid #888",
        "border-right": "25px solid green",
        "border-left": "25px solid green",
        "width": "80px",
        "height": "80px",
        "margin-left": "auto",
        "margin-right": "auto",
        "margin-top": "20px"
    }
}          

function initializeDefaultCSS(){
    // adds default CSS to the scoreboard dialog
    var KeyFrame = {
    // add spin keyframe rule to page
     init: function(){
         if(!KeyFrame.check){
             //set the style and append to head
             var css = $('<style>@keyframes spin{from {transform:rotate(0deg);}to {transform:rotate(360deg);}}</style>').appendTo('head'); //make sure you don't carriage return the css inline statement, or else it'll be error as ILLEGAL
         //so u don't keep appending style to head
         KeyFrame.check = true;
        }
     }
    };
    KeyFrame.init();
    loaderOptions={
        // default loader options
        // set loader colors, size, placement and animation
        "border-bottom": "16px solid #888",
        "border-top": "16px solid #888",
        "border-right": "16px solid #66ccff",
        "border-left": "16px solid #66ccff",
        "border-radius": "70%",
        "width": "50px",
        "height": "50px",
        "animation": "spin 1s linear infinite"
    };
    // apply the default loader options
    $('#loader').css(loaderOptions);
    scoreboardDialogOptions={
        // default scoreboard dialog options
        // makes the "Scoreboard Module By Burey" text static (unscrollable)
         "position": "absolute",
         "left": "10px",
         "top": "0",
         "z-index": "10",
         "width": "90%",
         "padding": "0.5e"
    };
    
    // apply the default scoreboard dialog options
    $('#by_burey').css(scoreboardDialogOptions);
    // add margin to the scoreboard display area
    $('#scoreboard').css({"margin-top":"1.5em"});
}
            
function Scoreboard(options){
  var _score = 0;
// might need to add to a different div, depends on the code, it must be on topmost layer!

// add div container for the scoreboard dialog
  $("body").children().last().prepend("<div id='container_scoreboard' title='Scoreboard'><div id='by_burey'>Scoreboard Module By Burey</div><table id='scoreboard'><tr id='tbl_header'><th>#</th><th>Name</th><th>Score</th><th>Time</th></tr></table><div id='loader'></div></div>");
 try{
 initializeDefaultCSS();
}catch(err){}

// add div container for the new score dialog
  $("body").children().last().prepend("<div id='container_submit_score_dialog' title='Submit Your Score!'><input placeholder='Name:' id='name_submit_new_score'><br /><label id='lbl_your_score'>Your Score: </label><label id=lbl_best_score_submit></label><br /><label id='lbl_best_score_name_error'></label></div>");
    
    if(options === undefined){
      // default options: will be used if no options were passed as a paramater
        options = defaultOptions;
    }
    var applyStyling = function(){
    // apply CSS rules to elements
        for(var option in options){
            try{
                $(optionsMap[option]).css(options[option]);
             }catch(err){}
        }
    }
    
    // force websockets to prevent XMLHttpRequest console log
    firebase.database.INTERNAL.forceWebSockets();
    // get database reference
    var dbRef = firebase.database();
    
    var loadData = function(snapshot){
        // load data from snapshot into a list
        scoresList = [];
        snapshot.forEach(function(child) {
            scoresList.push({
                name: markdown.specToEntities(child.val().name),
                score: child.val().score,
                time: child.val().time
            });
        });
        // refresh the UI
        if(scoresList.length>=0){ 
        refreshUI(scoresList);
        applyStyling();
        }
    }    
        
    var onError = function(err){
        console.log("Firebase 'on' error: "+err);
    }
    
    // add listener to database changes (any changes whatsoever)
    dbRef.ref("scores").orderByChild("score").on("value", loadData, onError);

    Number.prototype.pad = function (n,str){
        return Array(n-String(this).length+1).join(str||'0')+this;
    }
    
    var timeToDateString = function(time,sep){
        // converts time from integer to HH:MM:ss - DD/MM/YYYY format
        var date = new Date(time);
        var dateString = (date.getHours().pad(2)+":"+date.getMinutes().pad(2)+":"+date.getSeconds().pad(2)+sep+date.getDate()+"/"+(date.getMonth()+1)+"/"+(date.getYear()+1900));
        return dateString;
    }
        
    var refreshUI = function(list){
        // clears and re-populates the scoreboard table
        // remove all rows except the headers
        $("#scoreboard").find("tr:gt(0)").remove();
        $('#loader').show();
        // find the table with the id scoreboard
        var scoreTable = $("#scoreboard");  
        // cool crown for top player :)
        var crown = "&#128081;";
        // add scores
        for(i = list.length-1; i >= 0; i--){             
 var newRow = "<tr class='score_row'><td class='score_pos'>"+crown+(list.length-i).toString()+"</td>";
 newRow+="<td class='score_name'>"+list[i].name+"</td>";
 newRow+="<td class='score_value'>"+list[i].score+"</td>";
 newRow+="<td class='score_time'>"+timeToDateString(list[i].time,"\n")+"</td></tr>";
            scoreTable.append(newRow);
            crown = "";
        }
        $('#loader').hide();
    }

    var addScore = function(data){
        // add score to the database
        try{
            dbRef.ref("scores").push({
                name: data.playerName,
                score: data.score,
                time: firebase.database.ServerValue.TIMESTAMP
            });
        }catch(err){ console.log(err); }
    }
        
    this.showScoreBoard = function(){
        // open scoreboard dialog
        $(document).ready(function() {
            $('#container_scoreboard').dialog('open');
        });
    }
    
    this.submitNewScoreDialog = function(score){
    // set the module private score var
    _score = score;
 // open score submission dialog
    $(document).ready(function() {
            $('#container_submit_score_dialog').dialog('open');
        });
    }
     
    var verifyData=function(){
        // verifies submit score dialog data and close the dialog once verified and submitted
        var name = $('#name_submit_new_score').val();
        if(name===''){
            $('#lbl_best_score_name_error').text("Please Enter Name!!!");
        }
        else if(name.length>30){
            $('#lbl_best_score_name_error').text("Name Too Long!!!");
        }
        else{
            var data={playerName:name,score:parseInt(_score)};
            addScore(data);
            $('#lbl_best_score_name_error').text("");
            $('#container_submit_score_dialog').dialog('close');
            $('#tbl_best_scores_container').dialog('open');
        }
    }
     
    $(document).ready(function() {
    // initialize dialogs
    $('#container_scoreboard').dialog({
        // scoreboard dialog settings
        modal:true, //Not necessary but dims the page background
        autoOpen:false,
        width:options.scoreboardWidth,
        height:options.scoreboardHeight,
        position:"top",
        show: {
        effect: "blind",
        duration: 1000
      },
      hide: {
        effect: "slide",
        duration: 1000
      },
        open:function(){
            //$(this).html('');
            },
            buttons:[
            {
                text:'Close',
                'class':'buttons_scoreboard',
                click:function(){
                    $('#container_scoreboard').dialog('close');
                }
            }
            ]
    }).scroll(function() {
        // set the #by_burey div as the top scroll element
    $('#by_burey', this).css({top: $(this).scrollTop()});
});
    $('#container_submit_score_dialog').dialog({
        // score submission dialog settings
        modal:true, //Not necessary but dims the page background
        autoOpen:false,
        width:options.submitDialogWidth,
        height:options.submitDialogHeight,
        show: {
        effect: "slide",
        duration: 1000
      },
      hide: {
        effect: "blind",
        duration: 1000
      },
        open:function(){
            //$(this).html('');
            $('#lbl_best_score_submit').text(String(_score));
            },
            close:function(){
  // function is fired when dialog is closed
            },
            buttons:[
                {
                     text:'Scoreboard',
                    'class':'buttons_new_score',
                    click:function(){
                        $('#container_scoreboard').dialog('open');
                    }
                },
                {
                    text:'Submit',
                    'class':'buttons_new_score',
                    click:function(){
                        verifyData();
                    }
                }
            ]
        }
    );
  applyStyling();
  });
}
