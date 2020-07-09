

            const ColorHighlights = false;
            var svg;
            var highlights;
            var hNodeColor, nodeColor;

            function adjacency(jsonFileData, hl, node_color, hl_node_color) {
                highlights = hl;
                nodeColor = node_color;
                hNodeColor = hl_node_color;

                svg = d3.select("svg#AMSVG");
              //console.log(clicked_edges);
            //fetch(GraphJSON)
              //  .then(res => res.json())
                //.then(json => {
                  //  createAdjacencyMatrix(json["nodes"],json["edges"])

				              createAdjacencyMatrix(jsonFileData["nodes"],jsonFileData["edges"]);
			     }

                       //colorChannelA and colorChannelB are ints ranging from 0 to 255
            function colorChannelMixer(colorChannelA, colorChannelB, amountToMix){
                var channelA = colorChannelA*amountToMix;
                var channelB = colorChannelB*(1-amountToMix);
                return parseInt(channelA+channelB);
            }
            //rgbA and rgbB are arrays, amountToMix ranges from 0.0 to 1.0
            //example (red): rgbA = [255,0,0]
            function colorMixer(rgbA, rgbB, amountToMix){
                var r = colorChannelMixer(rgbA[0],rgbB[0],amountToMix);
                var g = colorChannelMixer(rgbA[1],rgbB[1],amountToMix);
                var b = colorChannelMixer(rgbA[2],rgbB[2],amountToMix);
                return "rgb("+r+","+g+","+b+")";
            }
            function hexToRgb(hex) {
              var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
              return result ? [
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16)
              ] : null;
            }




			// var promiseWrapper = (d) => new Promise(resolve => d3.csv(d, (p) => resolve(p)))


			// Promise.all([promiseWrapper("nodelist.csv"),promiseWrapper("edgelist.csv")]).then(resolve => {
			//     createAdjacencyMatrix(resolve[0],resolve[1])
			//  })

			function createAdjacencyMatrix(nodes,edges){
				var mainsvg = document.getElementById('AMSVG');

				var width  = Math.floor((mainsvg.width.baseVal.value - 100)/nodes.length);
				var height = Math.floor((mainsvg.height.baseVal.value - 100)/nodes.length);

				var edgeHash = {};
				edges.forEach(edge =>{
					var id = edge.source + "-" + edge.target
					edgeHash[id] = edge
				})

				var matrix = []
				nodes.forEach((source, a) => {
					nodes.forEach((target, b) => {
						var grid = {id: source.id + "-" + target.id, x: b, y: a, weight: 0};
						if(edgeHash[grid.id]){
							grid.weight = edgeHash[grid.id].weight;
						}
					matrix.push(grid)
					})
				})



			d3.select("svg").append("g")
				.attr("transform","translate(50,50)")
				.attr("id","adjacencyG")
				.selectAll("rect")
				.data(matrix)
				.enter()
				.append("rect")
				.attr("class","grid")
				.attr("width",width)
				.attr("height",height)
				.attr("x", d=> d.x*width)
				.attr("y", d=> d.y*height)
				.style("fill-opacity", function(d){
          var sd = d.id.split('-');
          for(var h = 0; h < highlights.length; h++){

            var hp = highlights[h].split("-");
            //console.log(highlights[h] + "    " + hp)
            //console.log(hp)
              if(d.weight != 0){
                return 1;
              } else  if(sd[0].localeCompare(hp[0]) === 0 || sd[1].localeCompare(hp[1]) === 0) {
                //console.log(hp + "    " + sd + "    " +  h + "    " +  highlights)
                //COLOR VERSION, CHANGE TO POINT 3
                return ColorHighlights ? .3 : 0;
              }
          }
          return 0;

        });


				d3.selectAll("rect.grid").style("fill", nodeColor);

        d3.select("svg").append("text")
          .attr("x", width*(nodes.length/2) + 30)
          .attr("y", 18)
          .text("Target Node");

        d3.select("svg").append("text")
          .attr("transform", "translate(18, "+ (height*(nodes.length/2) + 70) +") rotate(-90)")
          .text("Source Node");







      // Select a node specifically - TEXT VERSION
      d3.select("svg")
          .append("g")
          .attr("transform","translate(50,45)")
          .selectAll("text")
          .data(nodes)
          .enter()
          .append("text")
          .attr("x", (d,i) => i * width + width/2)
          .text(d => d.id)
          .style("text-anchor","middle")
          .style("font-size", function(d){
            console.log(d);
            for(var h = 0; h < highlights.length; h++){
              var hp = highlights[h].split("-");
              if(d.id.localeCompare(hp[1]) === 0){
                return nodes.length == 20 ? "20px" : "12px";
              }
            }
            return "0px";
          })

          d3.select("svg")
    			    .append("g").attr("transform","translate(45,50)")
    			    .selectAll("text")
    			    .data(nodes)
    			    .enter()
    			    .append("text")
    			    .attr("y",(d,i) => i * height + height/1.3)
    			    .text(d => d.id)
    			    .style("text-anchor","end")
              .style("font-size", function(d){
                console.log(d);
                for(var h = 0; h < highlights.length; h++){
                  var hp = highlights[h].split("-");
                  if(d.id.localeCompare(hp[0]) === 0){
                    return nodes.length == 20 ? "20px" : "12px";
                  }
                }
                return "0px";
              })

        //END OF TEXT VERSION

				// Select a node specifically - COLOR VERSION
        if(ColorHighlights){
  				d3.selectAll("rect.grid").style("fill", function(p) {
            //console.log("-AB".split('-'));
            var sp = p.id.split('-');
            for(var h = 0; h < highlights.length; h++){
            var hp = highlights[h].split("-");
            //console.log(highlights[h] + "    " + hp)
            //console.log(hp)

              if(sp[0].localeCompare(hp[0]) === 0 || sp[1].localeCompare(hp[1]) === 0){

                //console.log(p);
                if(p.weight != 0){
                  return colorMixer(hexToRgb(hNodeColor), hexToRgb(nodeColor), .4);
                  //colorMixer(hNodeColor, nodeColor, .9);
                }
                return hNodeColor;
              }
            }
            return nodeColor;
  				  //return p.id.includes('AL') ? "4px" : "1px"
  				});
        }
        //END OF COLOR VERSION


				//Select an edge specifically
				// d3.selectAll("rect").style("stroke-width", function(p) {
				//   return p.id == ('D-K') ? "4px" : "1px"
				// });



				// //Selecting edges
				// d3.selectAll("rect.grid").on("click", highlight);
				// function highlight(d){
				//     clicked_edges.push(d);
				//     d3.select(this).style("fill", "#00ACD9");
				// }



			// d3.selectAll("rect.grid").on("mouseover", gridOver);
			//
			// function gridOver(d) {
			//     d3.selectAll("rect").style("stroke-width", function(p) { return p.x == d.x || p.y == d.y ? "3px" : "1px"});
			// };

			};
