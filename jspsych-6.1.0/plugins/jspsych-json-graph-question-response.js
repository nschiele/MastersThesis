/**
 * jspsych-image-slider-response
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */


jsPsych.plugins['json-graph-question-response'] = (function() {

  var plugin = {};


  plugin.info = {
    name: 'json-graph-question-response',
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
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        array: false,
        description: 'Label of the button to advance.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the slider.'
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
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when user makes a response.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    var height, widthG, nodeColor;
    if(trial.stimulus_width == null){
      widthG = 500;
    } else {
      widthG = trial.stimulus_width;
    }
    if(trial.base_node_color == null){
      nodeColor = "#00ACD9";
    } else {
      nodeColor = trial.base_node_color;
    }
    if(trial.highlight_node_color == null){
      hNodeColor = "#ff0000";
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
          .then(data => renderBIGraph(data, height, widthG, trial.stimulus.highlight, nodeColor, hNodeColor));
        break;
      case 2:
        html = '<svg id="NLSVG" width='+widthG+' height='+height+'></svg> ';
        fetch(trial.stimulus.file)
          .then(response => response.json())
          .then(data => renderNLGraph(data, trial.stimulus.highlight));
        break;
      case 3:
        html = '<svg id="AMSVG" width='+widthG+' height='+height+'></svg>';
        fetch(trial.stimulus.file)
          .then(response => response.json())
          .then(data => adjacency(data, trial.stimulus.highlight, nodeColor, hNodeColor));
        break;
    }




    if (trial.prompt !== null){
      html += trial.prompt;
    }
    html += '<form id="jspsych-graph-question">'
    html += '<input type="number" class="jspsych-survey-number-question" id="#lname" name="lname" min="0" required><p></p>';
    // add submit button
    //html += '<button id="jspsych-json-graph-question-response-next" class="jspsych-btn">'+trial.button_label+'</button>';
    html += '<input type="submit" id="jspsych-json-graph-question-response-next" class="jspsych-btn jspsych-survey-text" value="'+trial.button_label+'"></input>'
    html += '</form>'
    display_element.innerHTML = html;

    var response = {
      rt: null,
      response: null
    };


    display_element.querySelector('#jspsych-graph-question').addEventListener('submit', function(e) {
      // measure response time
      var endTime = performance.now();
      response.rt = endTime - startTime;
      response.response = document.querySelector('input[name="lname"]').value;

      if(trial.response_ends_trial){
        end_trial();
      } else {
        display_element.querySelector('#jspsych-json-graph-question-response-next').disabled = true;
      }

    });

    function end_trial(){

      jsPsych.pluginAPI.clearAllTimeouts();

      // save data
      var trialdata = {
        "rt": response.rt,
        "response": response.response
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trialdata);
    }

    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-json-graph-question-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

    var startTime = performance.now();
  };

  return plugin;
})();
