
/**
 *
 * 
 */
function changeResultColor() {
    var resultCount = document.getElementsByClassName('result-count');
    resultCount[0].style.color = "red"; 
    main();
}



var exceptions = {};
    exceptions["Anastasios (Tasos) Sidiropoulos"] = "http://www.ratemyprofessors.com/ShowRatings.jsp?tid=2044391";
    exceptions["Mikhail Belkin"] = "http://www.ratemyprofessors.com/ShowRatings.jsp?tid=864899";


//var cells = document.getElementsByClassName('right ng-binding ng-scope');


    //changeResultColor();
    
    // var node = document.getElementsByClassName('site-subtitle');
    // var enable = document.createElement('button');
    // enable.id = 'enable-rmp';
    // enable.innerText = "Enable RMP";
    // node[0].appendChild(enable);
    // enable.addEventListener('click', main);
createRMPHeader = function() {   
    var cells = document.getElementsByClassName("right ng-binding ng-scope");
    var length = cells.length;
    var professors = [];

    for (var i=0; i<length; i++)
    {
        var profName = cells[i].innerText;
        
        // check if heading exists -- this needs to be reworked, when one changes
        // the filters on search, the header still exists on the cells and therefore
        // DOES NOT trigger the 'create header' mechanism
        var scoreHeading = cells[i].getElementsByClassName('score-heading');
        if(scoreHeading.length > 0) {
            // TODO: append rating
            console.log('Header exists!');
        } else {
            // TODO: get RMP rating for current professor
            var rating = getFakeProfRating(profName)
            var scoreHeading = document.createElement('div');
            scoreHeading.className = 'score-heading'; 
            scoreHeading.innerText = "Rating: " + rating; 
            cells[i].appendChild(scoreHeading);

            // var ratingCell = document.createElement('p');
            // ratingCell.className = 'rmp-rating';
            // ratingCell.innerText = "3.5";
            // scoreHeading.appendChild(ratingCell);
        }
    }
}

getFakeProfRating = function(professor) {
    if(professor === "TBA") {
        rating = "No professor(s) selected";
        return rating;
    } else {
        rating = "3.5";
        return rating;
    }
}

getProfessorRating = function(professorName) {
    if(professorName == null) {
            professorName = "Could not locate professor on webpage";
        } else {

            // check for middle name
            var profSplit = professorName.split(" ");   

            if (profSplit.length == 3) {
                var profArray = swapArrayElements(profSplit, 0, 2);
            } else {
                var profArray = swapArrayElements(profSplit, 0, 1);
            }
            
            var profString = profArray.toString();
            var URLprofessorName = profString.replace(/,/g,'+');
        }

        if(exceptions[professorName]) {

            var rating = findRatings(exceptions[professorName], professorName);
            return rating;
        } else {
            rmpsearch = 'http://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=The+Ohio+State+University&schoolID=724&query=PROFESSORNAME';
            rmpsearch = rmpsearch.replace('PROFESSORNAME', URLprofessorName);
        }

        var rating = getProfessorExtension(rmpsearch, professorName);
        return rating;
}

getProfessorExtension = function(searchPageURL, professorName){

    var xmlRequestInfo = {
        method: 'GET',
        action: 'xhttp',
        url: searchPageURL,
        professorName: professorName
    };

    chrome.runtime.sendMessage(xmlRequestInfo, function(data) {
        var responseXML, professorName, ratings;
        try {

            responseXML = data.responseXML;
            professorName = data.professorName;

            //Find the numerical extension that leads to the specific professor's RMP page.
            var professorURLExtension = $(responseXML).find('.listing:first').find('a:first').attr('href');

            //Check to make sure a result was found
            if (typeof professorURLExtension === 'undefined'){
                var rating = "N/A";
                return rating;
                //updateRMPinfo('?','?', professorName);//update RMP cells with empty information
            } else {
                var professorPageURL = 'http://www.ratemyprofessors.com' + professorURLExtension;
                rating = findRatings(professorPageURL, professorName);
                return rating;
            }
        }
        catch(err) {
            // updateRMPinfo('?', '?', professorName);//update RMP cells with empty information
            console.log('unable to find info')
        }       
    });
}

findRatings = function(professorPageURL, professorName){
    var xmlRequestInfo = {
        method: 'GET',
        action: 'xhttp',
        url: professorPageURL,
        professorName: professorName
    };

    chrome.runtime.sendMessage(xmlRequestInfo, function(data) {

        var rating = {
            overall: -1,
            // helpfulness: -1,
            // clarity: -1,
            //mostRecent: -1
        };
        var professorName, professorPageURL, responseXML;
        try {

            professorName = data.professorName;
            professorPageURL = data.url;
            responseXML = data.responseXML;

            //Find the numerical extension that leads to the specific professor's RMP page.
            rating.overall = $(responseXML).find('.grade').html();
            //rating.helpfulness = $(responseXML).find('.rating:eq(0)').html();
            // rating.clarity = $(responseXML).find('.rating:eq(1)').html();

            //rating.difficulty = $(responseXML).find(":contains('Level of Difficulty'").find('.grade').html();              

            // rating.mostRecent = $(responseXML).find('.rating:eq(1)').html();

            //document.write(responseXML);

            //Check to make sure a result was found
            if (parseInt(rating.overall) > 5 || parseInt(rating.overall) <= 0 || isNaN(rating.overall)){
                rating = '?';
            }

        }
        catch(err) {
            rating = '?';
            return rating;
        }

        //updateRMPinfo(professorPageURL, rating, professorName);
        // return professor rating
        return rating;
    });
}


swapArrayElements = function(a, x, y) {
  if (a.length === 1) return a;
  a.splice(y, 1, a.splice(x, 1, a[y])[0]);
  return a;
};

// select the target node
var target = document.querySelector('.result-count');    
var blobs = [];
// create an observer instance
var observer = new MutationObserver(function(mutations) {
    var length = mutations.length - 1;
    var mutant = mutations[length];
    blobs.push(getFinalResult(mutant));
    var blogLength = blobs.length;
    for(var i=0; i<blogLength; i++) {
        console.log(blobs[i]);
    }
    createRMPHeader();

});

getFinalResult = function(mutant) {
    var tmp = mutant.target.innerText.split(" ");
    var results = parseInt(tmp[0], 10);
    return results;
}
 
// function getResultsCount(target) {
//     var temp = target.innerText.split(" ");
//     // var results = parseInt(temp[0], 10);
//     alert(temp[0].toString());
// }
// configuration of the observer:
var options = { 'attributes': true, 'childList': true, 'characterData': true, 'subtree': true }
 
// pass in the target node, as well as the observer options
observer.observe(target, options);
//observer.disconnect();





