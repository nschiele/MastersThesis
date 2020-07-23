function renderBIGraph(jsonFileData, height, width, highlight, base_node_color, highlight_node_color){
		const ColorHighlights = false;
		//console.log(height + "    " +  width);
		var nodeColor = base_node_color;
		var remoteData = jsonFileData;//await response.json();
		//console.log("called render");

        var inc = Math.round((height -40)/remoteData['nodes'].length);

        var bipartiteData = {nodes:[],edges:[]}
        remoteData['nodes'].forEach((item, i) => {
          bipartiteData['nodes'].push({id:item.id+"_s",x:50,y:i*inc+20});
          bipartiteData['nodes'].push({id:item.id+"_t",x:width-50,y:i*inc+20});
        });
        remoteData['edges'].forEach((item, i) => {
          bipartiteData['edges'].push({source:item.source+"_s",target:item.target+"_t"});
        });


		$("#mountNode").empty();

        //const defNodeColor = '#C6E5FF';
        const graph = new G6.Graph({
            container: 'mountNode', // The id of the container
            // The width and height of the graph
            width: width,
            height: height,
            defaultNode: {
                size: 8,
                //color: nodeColor,
                style: {
                    lineWidth: 2,
                    fill: nodeColor,
                },
            },
            // defaultEdge: {
            //     type: 'quadratic', // assign the edges to be quadratic bezier curves
            //     style: {
            //         stroke: '#e2e2e2',
            //     },
            // }
            defaultEdge: {
                type: 'linear',
                style: {
                    stroke: '#000',
                    opacity: .5,
                    // endArrow: {
                    //     // The custom arrow is a path points at (0, 0), and its tail points to the positive direction of x-axis
                    //     path: 'M 0,0 L 2,.675 L 2,-.675 Z d -10',
                    //     // the offset of the arrow, nagtive value means the arrow is moved alone the positive direction of x-axis
                    //     // d: -10
                    //     // styles are supported after v3.4.1
                    //     // styles are supported after v3.4.1
                    //     fill: '#000',
                    //     stroke: '#000',
                    //     lineWidth: 7,
                    //     opacity: 1,
                    //     size: 2
                    //     // ...
                    // }
                }
            },

        });

        //Change one node to a new color
				for (var h = 0; h < highlight.length; h++){
					var change = highlight[h].split("-");
						change[0] = change[0]+"_s";
						change[1] = change[1]+"_t";
					var nodes = bipartiteData.nodes;
					nodes.forEach(node => {
						//if(node.id.localeCompare(change[0]) === 0 ||node.id.localeCompare(change[1]) === 0 ){
							//UNCOMMENT FOR COLOR VERSION
							var newStyle = {lineWidth: 2,fill: ColorHighlights ? highlight_node_color : nodeColor};
							node.style = newStyle;
							//console.log(node.id);
							node.label = node.id.split("_")[0];
							node.labelCfg = {
								offset: 10,
								position: node.id.endsWith('_s')? 'left' : 'right',
								style: (node.id.localeCompare(change[0]) === 0 || node.id.localeCompare(change[1]) === 0) ?  {fill: 'red'} : {fill: 'black'}
							};
						//}
					});
				}





      //   graph.on('node:click', ev => {
      //     clickedCfg = ev.item.defaultCfg;
      //     clicked_node = clickedCfg.id.split('_')[0];
      //     console.log(clickedCfg);
      //     console.log(clicked_node);
      //     nodes.forEach(node => {
      //       //console.log(node.id + ' ' + clicked_node + ' ' + node.id.includes(clicked_node))
      //       if(node.id.includes(clicked_node)){
      //         if(clicked_nodes.includes(clicked_node)){
      //           var newStyle =  {lineWidth: 2,fill: defNodeColor,  };
      //           node.style = newStyle;
      //           clicked_nodes.remove()
      //         }
      //         var newStyle =  {lineWidth: 2,fill: 'green',  };
      //         node.style = newStyle;
      //         console.log(clickedCfg);
      //         graph.render();
      //       }
      //   });
      // });

			console.log(height + "    " +  width);

		graph.data(bipartiteData); // Load the remote data
        graph.render(); // Render the graph


	}
