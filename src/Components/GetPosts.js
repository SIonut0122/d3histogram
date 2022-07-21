import React, {useEffect, useState} from "react";
import {useQuery, gql} from '@apollo/client';
import {LOAD_POSTS} from '../GraphQL/Queries';
import * as d3 from "https://cdn.skypack.dev/d3@7";
import histoIcon from '../images/histogram_img.png';


function GetPosts() {

    // Get data from API using the Apollo useQuery
    const {error, loading, data} = useQuery(LOAD_POSTS);

    const [postsNo, setPostsNo] = useState(0);
    const [errorMsg, setErrorMsg] = useState(false);
    const [isLoading, setIsLoading] = useState(true);



    
   useEffect(() => {
        // if data exists, proceed
        if(data) { 
            // Convert object in order to be changed
            let dPosts = JSON.parse(JSON.stringify(data.allPosts));
            // Create a list of every month in order to be used for further operations
            let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            // Iterate received data and covert every 'createdAt' data into a readable one 
            for(let i in dPosts) {
                let newDate = new Date(+dPosts[i].createdAt);
                // Assign new property 'publishedMonth' depending of the number of the month that was assigned before [ex: monthNames[1] equals 'February'] 
                dPosts[i]['publishedMonth'] = monthNames[newDate.getMonth()];
            }
            
            // Call function to sort and reorder the object by passing received data (dPosts) and monthNames
            sortPosts(dPosts, monthNames);
            // After data is received, set loading to false
            setIsLoading(false);

        } else if (error) {
            // If there is no data, set error boolean to true and console log info
            setErrorMsg(true);
            console.log(`Graphql error ${error}`);

        } else if (loading) {
            // Set loading to true do display message
            setIsLoading(true);
        }
    },[data,isLoading])


  const sortPosts = (dbPosts, monthNames) => {
    // Iterate over sorted months, create new object and assign to for each one 0 value
        let monthlyObject = {};
            for(let i in monthNames) {
                monthlyObject[monthNames[i]] = 0;
            }
    // Loop over data and target every month using as a refference the sorted object (monthlyObject)
            // if the month from the received data exists already inside monthlyObject, increase value by one, otherwise, assign 1 value

        for(let i in dbPosts) {
            if(monthlyObject[dbPosts[i].publishedMonth]) {
                monthlyObject[dbPosts[i].publishedMonth]++;
            } else {
                monthlyObject[dbPosts[i].publishedMonth] = 1;
            }
        }
       
    // Create a new cleaner array of objects to be used easier for the d3 histogram
       let infoArray = [];
    // Loop through monthlyObject using Object.entries, create a new object with 'month' and 'posts' properties and push it into infoArray
        for(const [key,val] of Object.entries(monthlyObject)) {
            let newMonthObj = {};
            newMonthObj['month'] = key;
            newMonthObj['posts'] = val;
            infoArray.push(newMonthObj);
        }
    
    // Pass the infoArray as an argument
      createChart(infoArray);
    }
    

const createChart = (monthsObj) => {
     const height = 500;
     const width = 1000;
     const margin = {top:70, right: 50, bottom: 70, left: 70};

     // Create svg that holds the chart
     const svg = d3.select('#histogram')
     .append('svg')
     .style('background-color', '#f7f7f7')
     .attr('width', width)
     .attr('height', height)
     .append('g')
     .attr('transform', `translate(0, -${margin.bottom-10})`);

     // Create the x scale
     const xScale = d3.scaleBand()
     .domain(monthsObj.map(d => d.month))
     .rangeRound([margin.left, width - margin.right])
     .padding(0.1)

    // Create the y axis scale, scaled from 0 to the max
    const yScale = d3.scaleLinear()
    .domain([0, 30])
    .range([height - margin.bottom, margin.top])

    // Create a scale between colors / those will be different depending by the number of posts
    const barColors = d3.scaleLinear()
    .domain([0,d3.max(monthsObj, d => d.posts)])
    .range(["blue","red"])
    

    // Set the x axis on the bottom.
    svg.append("g")
    .attr('transform', `translate(0,${height-margin.bottom})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("font-family", "Saira")
    .attr("font-weight",200)
    .attr("font-size", 20)
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");

    // Set the y axis on the left
    svg.append("g")
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(yScale));


    // Create the actual bars on the graph, appends a 'rect' for every data element
    const bars = svg
    .selectAll("rect")
    .data(monthsObj)
    .enter().append("rect")
    .attr('x', d => xScale(d.month))
    .attr('y', d => yScale(0))
    .attr('noPosts', d => (d.posts))
    .attr('width', xScale.bandwidth())
    .attr('height', d => yScale(0) - yScale(0))
    .style("padding", "3px")
    .style("margin", "1px")
    .style("width", d => `${d * 10}px`)
    .attr("fill", function(d) {return barColors(d.posts)})
    .attr("stroke", "black")
    .attr("stroke-width", 1)   
    .on("mouseover", function() {
        // Get noPost attribute data and use it to display number of posts on hover
        let getPostValue = d3.select(this).attr("noPosts");
         setPostsNo(getPostValue);
    })

    /* On mouse out, set posts number to 0 to hide 'Number of posts' text*/
    .on("mouseout", function() {setPostsNo(0)}) 
    
    /* Apply animation for every rect */
    svg.selectAll("rect")
    .transition()
    .duration(800)
    .attr('y', d => yScale(d.posts))
    .attr('height', d => yScale(0) - yScale(d.posts))
    .delay(function(d,i){return(i*100)})
    
}





    return (
        <div>
            <div className='display_postsinfo'>
                {/* Logo image */}
                <img src={histoIcon} alt='Histogram logo'/>
                
                {/* Display fetch status */}
                <div className='display_fetchstatus'>Status: 
                    {errorMsg ? (
                        <span style={{color: 'red', marginLeft: '5px'}}>Failed</span>
                    ) : (
                        <span style={{color:'green', marginLeft: '5px'}}>Ok</span>
                    )}
                </div>
                
                {/* Display info about number of posts and loading status */}
                <div>Received posts: 100</div>
                {isLoading && <span>Loading...</span> }

                {/* On hover over the bars, display number of posts */}
                <div className='display_postsnumber'>
                    {postsNo > 0 && 'Number of posts: ' +postsNo}
                </div>
            </div>

            {/* If loading, display loading spinner, otherwise display the histogram*/}
            {isLoading ? (
                <div className='loading_spinner'>
                <div className='load_spin'><div></div><div></div><div></div></div>
                </div>
            ) : (
                <div id='histogram'/>
            )}

        </div>
    )

}

export default GetPosts;