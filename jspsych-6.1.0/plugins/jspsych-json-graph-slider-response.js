/**
 * jspsych-image-slider-response
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */


jsPsych.plugins['json-graph-slider-response'] = (function() {

  var plugin = {};


  plugin.info = {
    name: 'json-graph-slider-response',
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
      min: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Min slider',
        default: 0,
        description: 'Sets the minimum value of the slider.'
      },
      max: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Max slider',
        default: 100,
        description: 'Sets the maximum value of the slider',
      },
      start: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: 'Slider starting value',
				default: 50,
				description: 'Sets the starting value of the slider',
			},
      step: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Step',
        default: 1,
        description: 'Sets the step of the slider'
      },
      labels: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name:'Labels',
        default: [],
        array: true,
        description: 'Labels of the slider.',
      },
      slider_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name:'Slider width',
        default: null,
        description: 'Width of the slider in pixels.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        array: false,
        description: 'Label of the button to advance.'
      },
      require_movement: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Require movement',
        default: false,
        description: 'If true, the participant will have to move the slider before continuing.'
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
        console.log(height + "    " +  widthG);
        html = '<div id="mountNode"></div>';
        fetch(trial.stimulus.file)
          .then(response => response.json())
          .then(data => renderBIGraph(data, height, widthG, trial.stimulus.highlight, nodeColor, hNodeColor));
          console.log(height + "    " +  widthG);
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






    html += '<div class="jspsych-json-graph-slider-response-container" style="position:relative; margin: 0 auto 3em auto; ';
    if(trial.slider_width !== null){
      html += 'width:'+trial.slider_width+'px;';
    }
    html += '">';
    html += '<input type="range" value="'+trial.start+'" min="'+trial.min+'" max="'+trial.max+'" step="'+trial.step+'" style="width: 100%;" id="jspsych-json-graph-slider-response-response"></input>';
    html += '<div>'
    for(var j=0; j < trial.labels.length; j++){
      var width = 100/(trial.labels.length-1);
      var left_offset = (j * (100 /(trial.labels.length - 1))) - (width/2);
      html += '<div style="display: inline-block; position: absolute; left:'+left_offset+'%; text-align: center; width: '+width+'%;">';
      html += '<span style="text-align: center; font-size: 80%;">'+trial.labels[j]+'</span>';
      html += '</div>'
    }
    html += '</div>';
    html += '</div>';
    html += '</div>';

    if (trial.prompt !== null){
      html += trial.prompt;
    }

    // add submit button
    html += '<button id="jspsych-json-graph-slider-response-next" class="jspsych-btn" '+ (trial.require_movement ? "disabled" : "") + '>'+trial.button_label+'</button>';

    display_element.innerHTML = html;

    var response = {
      rt: null,
      response: null
    };

    if(trial.require_movement){
      display_element.querySelector('#jspsych-json-graph-slider-response-response').addEventListener('change', function(){
        display_element.querySelector('#jspsych-json-graph-slider-response-next').disabled = false;
      })
    }

    display_element.querySelector('#jspsych-json-graph-slider-response-next').addEventListener('click', function() {
      // measure response time
      var endTime = performance.now();
      response.rt = endTime - startTime;
      response.response = display_element.querySelector('#jspsych-json-graph-slider-response-response').value;

      if(trial.response_ends_trial){
        end_trial();
      } else {
        display_element.querySelector('#jspsych-json-graph-slider-response-next').disabled = true;
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
        display_element.querySelector('#jspsych-json-graph-slider-response-stimulus').style.visibility = 'hidden';
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
