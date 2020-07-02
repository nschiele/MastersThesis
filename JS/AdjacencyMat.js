


            var svg;
            var highlights;
            var nodeColor;

            function adjacency(jsonFileData, hl, node_color) {
                highlights = hl;
                nodeColor = node_color;
                svg = d3.select("svg#AMSVG");
              //console.log(clicked_edges);
            //fetch(GraphJSON)
              //  .then(res => res.json())
                //.then(json => {
                  //  createAdjacencyMatrix(json["nodes"],json["edges"])

				              createAdjacencyMatrix(jsonFileData["nodes"],jsonFileData["edges"]);
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
				.style("fill-opacity", d=> d.weight * .2);


				d3.selectAll("rect.grid").style("fill", nodeColor);

        d3.select("svg").append("text")
          .attr("x", width*(nodes.length/2) + 30)
          .attr("y", 35)
          .text("Target Node");

        d3.select("svg").append("text")
          .attr("transform", "translate(35, "+ (height*(nodes.length/2) + 70) +") rotate(-90)")
          .text("Source Node");


			// d3.select("svg")
			//     .append("g")
			//     .attr("transform","translate(50,45)")
			//     .selectAll("text")
			//     .data(nodes)
			//     .enter()
			//     .append("text")
			//     .attr("x", (d,i) => i * 35 + 17.5)
			//     .text(d => d.id)
			//     .style("text-anchor","middle")
			//     .style("font-size","10px")
			//
			// d3.select("svg")
			//     .append("g").attr("transform","translate(45,50)")
			//     .selectAll("text")
			//     .data(nodes)
			//     .enter()
			//     .append("text")
			//     .attr("y",(d,i) => i * 35 + 17.5)
			//     .text(d => d.id)
			//     .style("text-anchor","end")
			//     .style("font-size","10px")

				// Select a node specifically
				d3.selectAll("rect").style("stroke-width", function(p) {
          //console.log("-AB".split('-'));
          var sp = p.id.split('-');
          for(var h = 0; h < highlights.length; h++){
          var hp = highlights[h].split("-");
          //console.log(highlights[h] + "    " + hp)
          //console.log(hp)
            if(sp[0].localeCompare(hp[0]) === 0 || sp[1].localeCompare(hp[1]) === 0){
              return "4px";
            }
          }
          return "1px";
				  //return p.id.includes('AL') ? "4px" : "1px"
				});

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
