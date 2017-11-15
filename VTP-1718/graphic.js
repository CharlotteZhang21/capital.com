
function initGraphic(data){

    var data = [
            {
                "time": "10:00",
                "price": 501
                // "up": -20
            }, 
            {
                "time": "10:15",
                "price": 480
                // "up": 30
            }, 
            {
                "time": "10:30", 
                "price": 535
                // "up": -35
            },
            {
                "time": "10:45", 
                "price": 502
                // "up": 43
            },
            {
                "time": "11:00", 
                "price": 540
                // "up": 20
            }, 
            {
                "time": "11:30", 
                "price": 560
                // "up": 40
            }];



    var margin = {top: 20, right: 50, bottom: 30, left: 20},
        width = chart.clientWidth - margin.left - margin.right,
        height = chart.clientHeight - margin.top - margin.bottom,
        barWidth = 20;

    // parse the date / time
    var parseTime = d3.timeParse("%H:%M");

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the line
    var valueline = d3.line()
        .x(function(d) { return x(d.time); })
        .y(function(d) { return y(d.price); });

    var svg = d3.select(chart).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");


    // format the data
    data.forEach(function(d) {
      d.time = parseTime(d.time);
      d.price = +d.price;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.time; }));
    y.domain([7497.0, d3.max(data, function(d) { return (d.price+7000); })]);

    // add the X gridlines
    svg.append("g")           
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(make_x_gridlines(x)
          .tickSize(-height)
          .tickFormat("")
      )

    // add the Y gridlines
    svg.append("g")           
      .attr("class", "grid")
      .attr("transform", "translate(" + width + ", 0)")
      .call(make_y_gridlines(y)
          .tickSize(-width)
          .tickFormat("")
      )

    // add the valueline path.
    svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

    // add the X Axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // add the Y Axis
    svg.append("g")
      .call(d3.axisRight(y))
      .attr("transform", "translate(" + width + ",0)");

      console.log("width : " + width);

    var bars = svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d, i) { return i*(width/6) - barWidth/2})
        .attr("y", function(d, i) { 


            return y(d.price+7000)/3.5 + 100;
            
        })
        .attr("width", barWidth)
        .attr("fill", function(d, i) {
            return get_bar_colour(d, i, data);
            
        })
        .attr("opacity", 0)
        .attr("height", function(d, i) { 
            if(i == (data.length -1)){
                return 40;
            }
            return Math.abs(data[i+1].price - data[i].price);
        })
        .attr("trans", function(d, i){

            if(i!=(data.length-1)) {
                var difference = data[i+1].price - data[i].price;
                if(difference > 0 ){
                    return -difference;
                }
               
            }
            return 0;
        });
    
    var lines = svg.selectAll(".pre")
        .data(data)
        .enter().append("rect")
        .attr("class", "pre")
        .attr("x", function(d, i) {return i*width/6})
        .attr("y", function(d) {
            return y(d.price+7000)/3.5 + 80;
        })
        .attr("width", 2)
        .attr("opacity", 0)
        .attr("height", function(d, i) {
            if(i == (data.length -1)){
                return 40;
            }
            return Math.abs(data[i+1].price - data[i].price)*2.4;
        })
        .attr("fill", function(d, i) {
           return get_bar_colour(d, i, data);
        });

    animation(0, 6, document.getElementById("sellBtn"));

}

var duration = 1;
var delay = 1.2;


var sum =7534;

function animation(startRect, endRect, btn){
    var rects = document.getElementsByClassName("bar");
    var lines = document.getElementsByClassName("pre");
    var finishFlag = false;
    for(var i = startRect; i< endRect; i++){
        if (i == (endRect-1)){
            finishFlag = true;
        }
        // setTimeout(function(){
            //element, vary, duration, dly, finishflag, btn
            showAndMoveBar(rects[i], 0.1, duration, i * delay+0.5, finishFlag, btn);
            //element, duration, dly
            showAndMoveLine(lines[i], duration/2, i * delay);
            // setIntervalX(0.1, 1000, 1000);
        // },500);
        
    }

    

    // pulse()
}

function setIntervalX(vary, dly, repetitions) {

    var sellNumber = document.getElementById("sellNumber");
    var buyNumber = document.getElementById("buyNumber");
    var x = 0;
    var intervalID = window.setInterval(function () {

        sum+=vary;
        sellNumber.innerText = sum.toFixed(2);

       if (++x === repetitions) {
           window.clearInterval(intervalID);
           console.log(x);
       }

    }, delay);
}

// gridlines in x axis function
function make_x_gridlines(x) {       
    return d3.axisBottom(x)
        .ticks(5)
}

// gridlines in y axis function
function make_y_gridlines(y) {       
    return d3.axisRight(y)
        .ticks(5)
}

// bar's current colour function
function get_bar_colour(d, i, data){
    var blue = "#359ACC";
    var red = "#F15761";
    if(i == (data.length-1)){
        return red;
    }else{
        var difference = data[i+1].price - data[i].price;
        if(difference<=0){
            return red;
        }else{
            return blue;
        }

    }
}


// TweenMax animations library
function show(element, duration, dly) {
    element.style.display = "block";
    TweenLite.to(
        element, duration,
        {
            opacity: 1,
            delay: dly,
            ease: Quad.easeInOut,
        });
}

var sum =7534;

function showAndMoveBar(element, varietion, duration, dly, finishFlag, btn) {
    element.style.opacity = "1";
    TweenLite.fromTo(
        element, duration,{
            height:0,
            // transform: translate(0,0)
            y: 0
        },
        {
            height: element.attributes.height.value,
            y: element.attributes.trans.value,
            // transform: "translate(0" + element.attributes.height.value + ")";
            delay: dly,
            ease: Quad.easeOut,
            onComplete: function(){
                if(finishFlag){
                    // pulse(sellBtn, .6);
                    btn.className = "pulse";
                }
                // clearInterval(myInterval);
            }
        });
}

function showAndMoveLine(element, duration, dly) {
    element.style.opacity = "1";
    TweenLite.fromTo(
        element, duration,{
            height:0,
        },
        {
            height: element.attributes.height.value,
            delay: dly,
            ease: Quad.easeOut
        });
}

function up(element, duration, dly) {
    TweenLite.to(
        element, duration,
        {
            delay: dly,
            transform: 'translate3d(0,-2vw,0)',
            ease: Quad.easeInOut,
            onComplete: function () {
                //
            }
        });
}

function hide(element, delay) {
    console.log(delay);
    TweenLite.fromTo(
        element, 1, {
            opacity: 1,
            x: 0
        }, {
            opacity: 0,
            x: 100,
            delay: delay,
            ease: Quad.easeInOut,
            onComplete: function () {
                element.style.display = "none";
            }
        });
}

function zoomOut(e, d) {
    TweenLite.fromTo(
        e, .6, {
            scale: 1.5
        }, {
            scale: 1,
            delay: d,
            ease: Quad.easeInOut,
        });
}

function zoomIn(e, d) {
    TweenLite.fromTo(
        e, .6, {
            scale: 1
        }, {
            scale: 1.5,
            delay: d,
            ease: Quad.easeInOut,
        });
}

function explode(e, d) {
    TweenLite.fromTo(
        e, .6, {
            scale: .5,
            opacity: 0
        }, {
            scale: 1,
            opacity: 1,
            delay: d,
            ease: Expo.easeOut,
            onComplete: function () {
                hide(e, 0);
                zoomIn(e, 0);
            }
        });
}

function moveUp(_e, _x = 125, _y = -400, _d, ani) {
    var tl = new TimelineMax({
        repeat:0,
        onComplete:  function () {
            if(ani) {
                // document.getElementById("cta").classList += " end";
                pulse(_e, _d);
            }
        }
    });

    tl.to(
        _e, _d, {
            y: _y,
            x: _x,
            scale: 1.2,
            delay: .5,
            ease: Expo.easeInOut,
        });
}

function handAni(e, duration, dly) {
    var tl = new TimelineMax({
        repeat: 2,
        repeatDelay: .6,
        delay: dly
    });
    tl.to(
        e, .8, {
            y: 0                    
        });
    tl.to(
        e, .6, {
            y: 10,
            ease: Expo.easeOut
        });
    tl.to(
        e, .4, {
            y: 0,
            ease: Expo.easeOut
        });
    tl.to(
        e, .4, {
            opacity: 0,
            ease: Expo.easeInOut
        });
}


function pulse(e, d){

    TweenMax.to(e, 1, {scale: 1.05, repeat:-1, yoyo:true});
}


function isPortrait(){
    return window.innerHeight > window.innerWidth;
}

function isLandscape() {
    return window.innerWidth > window.innerHeight;
}