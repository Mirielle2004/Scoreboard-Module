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
         burey:{
         "font-family":"Times New Roman",
         "font-style":"italic",
         "text-shadow": "5px 2px 4px grey",
         "color": "green",
         "background-color":"white",
         "border-radius": "25px"
         },
         dialogTitle:{// dialogs title bar
         "background":"black",
         "color":"white"
         },
         scoreboardContainer:{// scoreboard container dialog
         "background-color":"#97B5F5"
         },
         tableHeader:{// # Name Score Time
         "font-family":"Times New Roman",
         "color": "black"
         },
         scoreRow:{//deprecated, customize each column instead
         "font-family":"Times New Roman",
         "color": "blue"
         },
         scorePosition:{// #
         "font-family":"Times New Roman",
         "color": "blue"
         },
         scoreName:{// name of user
         "font-family":"'Press Start 2P', Times New Roman",
         "font-size":"10px",
         "color": "red"
         },
         scoreValue:{// score value
         "font-family":"Times New Roman",
         "font-size": "15px",
         "color": "green"
         },
         scoreTime:{// time + date
         "font-family":"Times New Roman",
         "font-size":"12px",
         "color": "yellow"
         },
         newScoreContainer:{// submit new score dialog
         "background-color":"#97B5F5"
         },
         scoreYourScoreLabel:{// 'Your Score:' text in new score dialog
         "font-family":"Times New Roman",
         "color": "green"
         },
         scoreValueLabel:{// score value in new score dialog
         "font-family":"Times New Roman",
         "color": "blue",
         "margin-right":"25px"
         },
         scoreErrorLabel:{// error label in new score dialog
         "font-family":"Times New Roman",
         "color": "red"
         },
         scoreboardButtons:{// scoreboard dialog buttons
         "font-family":"Times New Roman",
         "text-shadow": "5px 2px 4px grey",
         "background":"red",
         "color": "white",
         "display":"none" // hide button
         },
         newScoreButtons:{// new score dialog buttons
        "font-family":"Times New Roman",
         "text-shadow": "5px 2px 4px grey",
         "background":"black",
         "color": "white"
         }}}
usage example:

var scoreboard = new Scoreboard(options);
scoreboard.showScoreBoard(); // opens the scoreboard
scoreboard.submitNewScoreDialog(scoreValue); // open score submit dialog (allow entry of name)

*/



var markdown = {
        // Michael Ermishin's Markdown module
	htmlEntitiesMap: {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;',
		' ': '&nbsp;'
	},
		
	markdownToHtml: function(markdownText) {
		var html = this.specToEntities(markdownText);
		html = html.replace(/\n/g, '<br>');
		
		html = html.replace(
			/([^\\]|^)\[url:([^\]]+)\]\(([^)]+)\)/g,
			(_, smb, name, url) => smb + '<a href="' + url + '">' + name + '</a>'
		);
		
		html = html.replace(/([^\\]|^)\*\*(.+?)\*\*/g, (_, smb, content) => smb + '<b>' + content + '</b>');
		html = html.replace(/([^\\]|^)__(.+?)__/g, (_, smb, content) => smb + '<i>' + content + '</i>');
		
		html = html.replace(/\\([\[*_])/g, (_, character) => character);
		
		return html;
	},
	
	specToEntities: function(text) {
		var pattern = new RegExp('[' + Object.keys(this.htmlEntitiesMap).join('') + ']', 'g');
		return text.replace(pattern, k => this.htmlEntitiesMap[k]);
	},
	
	entitiesToSpec: function(text) {
		var entToSpecMap = Object.keys(this.htmlEntitiesMap).reduce(function(obj, key) {
			obj[markdown.htmlEntitiesMap[key]] = key;
			return obj;
		}, {});
		
		var pattern = new RegExp(Object.keys(entToSpecMap).join('|'), 'g');
		return text.replace(pattern, k => entToSpecMap[k]);
	},
	
	htmlToText: html => html.replace(/<\/?[a-z]+[^>]*>/g, ''),

	htmlToMarkdown: function(html)
	{
		var mdText = this.entitiesToSpec(html);

		mdText = mdText.replace(/\\/g, '\\\\');
		mdText = mdText.replace(/\*\*/g, '\\**');
		mdText = mdText.replace(/\_\_/g, '\\__');
		mdText = mdText.replace(/\[[^:\]]+:[^\]]+\](.*?)/g, data => '\\' + data);

		// Simple convertion
		mdText = mdText.replace(/<br>/g, '\n');
		mdText = mdText.replace(/<b>(.*?)<\/b>/g, (_, content) => '**' + content + '**');
		mdText = mdText.replace(/<i>(.*?)<\/i>/g, (_, content) => '__' + content + '__');

		// Convertion of special objects
		mdText = mdText.replace(/<a href="(.*?)">(.*?)<\/a>/g, (_, link, name) => '[url:' + name + '](' + link + ')');

		return mdText;
	}
};

function Scoreboard(options = null){
  var _score = 0;
   
// might need to add to a different div, depends on the code, it must be on topmost layer!

// add container for the scoreboard
  $("body").children().last().prepend("<div id='container_scoreboard' title='Scoreboard'><div id='by_burey'>Scoreboard Module By Burey</div><table id='scoreboard'><tr class='tbl_header'><th>#</th><th>Name</th><th>Score</th><th>Time</th></tr></table></div>");

// add container div for the new score dialog
  $("body").children().last().prepend("<div id='container_submit_score_dialog' title='Submit Your Score!'><input placeholder='Name:' id='name_submit_new_score'><br /><label id='lbl_your_score'>Your Score: </label><label id=lbl_best_score_submit></label><br /><label id='lbl_best_score_name_error'></label></div>");
    
    if(!options){
      // default options: will be used if no options were passed as a paramater
        options={
    // customize the following:
    // syntax is css like, but make sure:
    // key and value are both strings!
         burey:{
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
         scoreRow:{
    //deprecated, customize each column instead
         "font-family":"Times New Roman",
         "color": "blue"
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
         "color": "red"
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
         }
      }
    }
    var applyStyling = function(){
    //change options your own customization
    try{
     $("#by_burey").css(options.burey);
     $(".ui-dialog-titlebar").css(options.dialogTitle);
     $("#container_scoreboard").css(options.scoreboardContainer);
     $(".tbl_header").css(options.tableHeader);
     //$(".score_row").css(options.scoreRow);
     $(".score_pos").css(options.scorePosition);
     $(".score_name").css(options.scoreName);
     $(".score_value").css(options.scoreValue);
     $(".score_time").css(options.scoreTime);
      $("#container_submit_score_dialog").css(options.newScoreContainer);
     $("#lbl_your_score").css(options.scoreYourScoreLabel);
     $("#lbl_best_score_submit").css(options.scoreValueLabel);
     $("#lbl_best_score_name_error").css(options.scoreErrorLabel);
     
     $(".buttons_scoreboard").css(options.scoreboardButtons);
     $(".buttons_new_score").css(options.newScoreButtons);
     
     }catch(err){alert(err);}
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
                name: markdown.htmlToMarkdown(child.val().name),
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
        height:400,
        position:"top",
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
    });
    $('#container_submit_score_dialog').dialog({
        // score submission dialog settings
        modal:true, //Not necessary but dims the page background
        autoOpen:false,
        height:"auto",
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
  });
}
