/**
 * jspsych-image-button-response
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["json-graph-response"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'json-graph-response',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.OBJECT,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The data of the graph to be displayed, the type of graph and which nodes to highlight'
      },
      stimulus_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Graph Height',
        default: null,
        description: 'Set the graph height in pixels'
      },
      stimulus_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Graph Width',
        default: null,
        description: 'Set the graph width in pixels'
      },
      base_node_color: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Color of Graph Nodes',
        default: null,
        description: 'Set the color of the graph nodes'
      },
      highlight_node_color: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Color of Specified Nodes',
        default: null,
        description: 'Set the color of specific nodes'
      },
      choices: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Choices',
        default: undefined,
        array: true,
        description: 'The labels for the buttons.'
      },
      button_html: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button HTML',
        default: '<button class="jspsych-btn">%choice%</button>',
        array: true,
        description: 'The html of the button. Can create own style.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed under the button.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.'
      },
      margin_vertical: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin vertical',
        default: '0px',
        description: 'The vertical margin of the button.'
      },
      margin_horizontal: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin horizontal',
        default: '8px',
        description: 'The horizontal margin of the button.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, then trial will end when user responds.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    // display stimulus
    // var html = '<img src="'+trial.stimulus+'" id="jspsych-json-graph-response-stimulus" style="';
    // if(trial.stimulus_height !== null){
    //   html += 'height:'+trial.stimulus_height+'px; '
    //   if(trial.stimulus_width == null && trial.maintain_aspect_ratio){
    //     html += 'width: auto; ';
    //   }
    // }
    // if(trial.stimulus_width !== null){
    //   html += 'width:'+trial.stimulus_width+'px; '
    //   if(trial.stimulus_height == null && trial.maintain_aspect_ratio){
    //     html += 'height: auto; ';
    //   }
    // }
    // html +='"></img>';

    // var html = '<div id="mountNode">'+
    // '</div>'+
    // // ' '+
    // // '<svg id="NLSVG" width="1000" height="1200"></svg> '+
    // // '<script src="JS/libs/g6.min.js"></script> '+
    // // '<script src="JS/libs/jquery-3.1.1.min.js"></script> '+
    // // '<script src="JS/libs/d3.min.js"></script> '+
    // // '<script src="https://d3js.org/d3-dispatch.v1.min.js"></script> '+
    // // '<script src="https://d3js.org/d3-quadtree.v1.min.js"></script> '+
    // // '<script src="https://d3js.org/d3-timer.v1.min.js"></script> '+
    // // '<script src="https://d3js.org/d3-force.v2.min.js"></script> '+
    // // '<script src="JS/AdjacencyMat.js"></script> '+
    // // '<script src="JS/Bipartite.js"></script> '+
    // // '<script src="JS/network_d3-force.js"></script> '+
    // // '<!--<script src="./values.js"></script>--> '+
    // '<script>'+
    //   'var nodeColor = "#00ACD9"; '+
    //   'var Gheight = 400; '+
    //   'var Gwidth = 400; ' +
    //   'var input, file, fr; '+
    //   'file = ' + trial.stimulus[1] + ';'+
    //   'fr = new FileReader(); '+
    //   'fr.onload = receivedText; '+
    //   'fr.readAsText(file); '+
    //   'function receivedText(e) { '+
    //   'let lines = e.target.result; '+
    //   'var newArr = JSON.parse(lines); '+
    //   'console.log("This code is running"); '+
    //   'renderBIGraph(newArr);' +
    //   '} '+
    //   '</script>';



    // <script src="JS/libs/g6.min.js"></script>
    // <script src="JS/libs/jquery-3.1.1.min.js"></script>
    // <script src="JS/libs/d3.min.js"></script>
    //
    // <script src="https://d3js.org/d3-dispatch.v1.min.js"></script>
    // <script src="https://d3js.org/d3-quadtree.v1.min.js"></script>
    // <script src="https://d3js.org/d3-timer.v1.min.js"></script>
    // <script src="https://d3js.org/d3-force.v2.min.js"></script>
    //
    // <script src="JS/AdjacencyMat.js"></script>
    // <script src="JS/Bipartite.js"></script>
    // <script src="JS/network_d3-force.js"></script>


    var height, width, nodeColor;
    if(trial.stimulus_width == null){
      width = 500;
    } else {
      width = trial.stimulus_width;
    }
    if(trial.base_node_color == null){
      nodeColor = "#00ACD9";
    } else {
      nodeColor = trial.base_node_color;
    }
    if(trial.highlight_node_color == null){
      hNodeColor = "red";
    } else {
      hNodeColor = trial.highlight_node_color;
    }
    if(trial.stimulus_height == null){
      height = 500;
    } else {
      height = trial.stimulus_height;
    }



    var html;
    switch(trial.stimulus.type){
      case 1:
        html = '<div id="mountNode"></div>';
        fetch(trial.stimulus.file)
          .then(response => response.json())
          .then(data => renderBIGraph(data, height, width, trial.stimulus.highlight, nodeColor, hNodeColor));
        break;
      case 2:
        html = '<svg id="NLSVG" width='+width+' height='+height+'></svg> ';
        fetch(trial.stimulus.file)
          .then(response => response.json())
          .then(data => renderNLGraph(data, trial.stimulus.highlight));
        break;
      case 3:
        html = '<svg id="AMSVG" width='+width+' height='+height+'></svg>';
        fetch(trial.stimulus.file)
          .then(response => response.json())
          .then(data => adjacency(data, trial.stimulus.highlight, nodeColor));
        break;
    }












    //display buttons
    var buttons = [];
    if (Array.isArray(trial.button_html)) {
      if (trial.button_html.length == trial.choices.length) {
        buttons = trial.button_html;
      } else {
        console.error('Error in json-graph-response plugin. The length of the button_html array does not equal the length of the choices array');
      }
    } else {
      for (var i = 0; i < trial.choices.length; i++) {
        buttons.push(trial.button_html);
      }
    }
    html += '<div id="jspsych-json-graph-response-btngroup">';

    for (var i = 0; i < trial.choices.length; i++) {
      var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
      html += '<div class="jspsych-json-graph-response-button" style="display: inline-block; margin:'+trial.margin_vertical+' '+trial.margin_horizontal+'" id="jspsych-json-graph-response-button-' + i +'" data-choice="'+i+'">'+str+'</div>';
    }
    html += '</div>';

    //show prompt if there is one
    if (trial.prompt !== null) {
      html += trial.prompt;
    }

    display_element.innerHTML = html;

    // start timing
    var start_time = performance.now();

    for (var i = 0; i < trial.choices.length; i++) {
      display_element.querySelector('#jspsych-json-graph-response-button-' + i).addEventListener('click', function(e){
        var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
        after_response(choice);
      });
    }

    // store response
    var response = {
      rt: null,
      button: null
    };

    // function to handle responses by the subject
    function after_response(choice) {

      // measure rt
      var end_time = performance.now();
      var rt = end_time - start_time;
      response.button = choice;
      response.rt = rt;

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      //display_element.querySelector('#jspsych-json-graph-response-stimulus').className += ' responded';

      // disable all the buttons after a response
      var btns = document.querySelectorAll('.jspsych-json-graph-response-button button');
      for(var i=0; i<btns.length; i++){
        //btns[i].removeEventListener('click');
        btns[i].setAttribute('disabled', 'disabled');
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // function to end trial when it is time
    function end_trial() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
        "button_pressed": response.button
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };



    // hide image if timing is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-json-graph-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if time limit is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
