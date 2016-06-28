
function changeResultColor() {
    var resultCount = document.getElementsByClassName('result-count');
    resultCount[0].style.color = "red"; 
    // main();
}



var exceptions = {};
    exceptions["Anastasios (Tasos) Sidiropoulos"] = "http://www.ratemyprofessors.com/ShowRatings.jsp?tid=2044391";
    exceptions["Mikhail Belkin"] = "http://www.ratemyprofessors.com/ShowRatings.jsp?tid=864899";
    exceptions["Christine Ann Kiel"] = "Chris Kiel";


createRMPHeader = function() {   

    changeResultColor();

    var cells = document.getElementsByClassName("right ng-binding ng-scope");
    var parentCells = document.getElementsByClassName('col-md-6 col-sm-5');
    var length = cells.length;
    var professors = [];

    for (var i=0; i<length; i++)
    {

        // create space for popup HTML
        var popupContainer = document.createElement('div');
        var parentDiv = cells[i].parentNode;
        parentDiv.insertBefore(popupContainer, cells[i]);

        var div = document.createElement('div');
        div.className = 'button-container';
        parentCells[i].appendChild(div);

        var profName = cells[i].innerText;

        if (exceptions[profName]) {
            profName = exceptions[profName];
        }

        if(profName != 'TBA' && profName != 'Staff') {

            var heading = cells[i].getElementsByClassName('score-heading');
            if(heading.length > 0) {
                // TODO: append rating
                console.log('Header exists!');
            } else {

                var profSplit = profName.split(" ");   
                if(profSplit.length == 3) {
                    profSplit.splice(1, 1);
                    var profArray = swapArrayElements(profSplit, 0, 1);
                } else {
                    var profArray = swapArrayElements(profSplit, 0, 1);
                }
            
                var profString = profArray.toString();
                var searchName = profString.replace(/,/g,'+');
                // TODO: get RMP rating for current professor
                // var rating = getFakeProfRating(profName)
                var ul = document.createElement('ul');
                ul.className = 'score-heading'; 
                ul.firstName = profArray[1];
                ul.searchURL = 'http://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=The+Ohio+State+University&schoolID=724&query=' + searchName;
                ul.profURL = '';
                ul.innerHTML = '<input class="ratingButton" type="button" value="Show Rating" />';
                ul.cell = popupContainer; // space for popup HTML we created earlier
                ul.clicked = false;
                ul.addEventListener('click', openPopup);
                div.appendChild(ul);
            }
        }
    }
}

openPopup = function() {
    if (this.clicked == true) { //happens when button was clicked while active
        this.cell.innerHTML = '';
        this.innerHTML = '<input class="ratingButton" type="button" value="Show Rating" />';
        this.clicked = false;
    } else { //happens when button was clicked while inactive
        this.clicked = true;
        this.innerHTML = '<input class="ratingButton" type="button" style="background-color: #b00; color: #fff;" value="Hide Rating" />';
        var popup = document.createElement('div');
        popup.className = 'popup';
        popup.innerText = 'Loading...';
        var firstName = this.firstName;
        this.cell.style.position = 'relative';
        this.cell.appendChild(popup);

        chrome.runtime.sendMessage({
            url: this.searchURL
        }, function(responseText) {
            responseText = responseText.replace('http://blog.ratemyprofessors.com/wp-content/uploads/2015/01/WNOs6.5_RMP_72x72.jpg', '');
            responseText = responseText.replace('/assets/chilis/warm-chili.png', '');
            responseText = responseText.replace('/assets/chilis/cold-chili.png', '');
            processFirstRequest(popup, firstName, responseText);
        });
    }
}

//function that processes first request from ratemyprofessors and makes second request
function processFirstRequest(popup, firstName, responseText) {
    var tmp = document.createElement('div'); //make a temp element so that we can search through its html
    tmp.innerHTML = responseText;
    var foundProfs = tmp.getElementsByClassName('listing PROFESSOR');

    if (foundProfs.length == 0) //if no results were returned, print this message
    {
        var emptyPopup = popup;
        emptyPopup.className = 'notFoundPopup';
        var notFound = document.createElement('div');
        var idk = document.createElement('div');
        notFound.className = 'heading';
        idk.className = 'idk';
        notFound.innerText = "Professor not found";
        idk.innerText = "¯\\_(ツ)_/¯";
        emptyPopup.innerHTML = '';
        emptyPopup.appendChild(notFound);
        emptyPopup.appendChild(idk);
    } else //iterate through the search results and match by first letter of first name to verify identity
    {
        var length = foundProfs.length;

        for (var i = 0; i < length; i++) {
            var tmp = document.createElement('div');
            tmp.innerHTML = foundProfs[i].innerHTML;
            var name = tmp.getElementsByClassName('main')[0].innerText;

            if ((firstName.charAt(0) == name.split(',')[1].charAt(1)) || (firstName == ' ')) {
                break;
            } else if (i == length - 1) {
                var emptyPopup = popup;
                emptyPopup.className = 'notFoundPopup';
                var notFound = document.createElement('div');
                var idk = document.createElement('div');
                notFound.className = 'heading';
                idk.className = 'idk';
                notFound.innerText = "Professor not found";
                idk.innerText = "¯\\_(ツ)_/¯";
                emptyPopup.innerHTML = '';
                emptyPopup.appendChild(notFound);
                emptyPopup.appendChild(idk);
                return 0;
            }
        }

        //get the link for the actual professor page
        var link = tmp.getElementsByTagName('a');
        profURL = 'http://www.ratemyprofessors.com/' + link[0].toString().slice(23); //this is the URL

        chrome.runtime.sendMessage({
            url: this.profURL
        }, function(responseText) {
            //responseText = responseText.replace('http://blog.ratemyprofessors.com/wp-content/uploads/2015/01/WNOs6.5_RMP_72x72.jpg', '');
            responseText = responseText.replace('/assets/chilis/warm-chili.png', '');
            responseText = responseText.replace('/assets/chilis/cold-chili.png', '');
            addContentToPopUp(popup, profURL, responseText);
        });
    }
}

//function that adds content to popup
function addContentToPopUp(popup, profURL, responseText) {
    var tmp = document.createElement('div');
    tmp.innerHTML = responseText;
    
    //check if professor has any reviews
    //if they have no reviews then just display the professor not found popup
    if (tmp.getElementsByClassName('pfname').length == 0)
    {
        var emptyPopup = popup;
        emptyPopup.className = 'notFoundPopup';
        var notFound = document.createElement('div');
        var idk = document.createElement('div');
        notFound.className = 'heading';
        idk.className = 'idk';
        notFound.innerText = "Professor not found";
        idk.innerText = "¯\\_(ツ)_/¯";
        emptyPopup.innerHTML = '';
        emptyPopup.appendChild(notFound);
        emptyPopup.appendChild(idk);
        return;
    }

    var proffName = tmp.getElementsByClassName('pfname')[0].innerText;
    var proflName = tmp.getElementsByClassName('plname')[0].innerText;
    var ratingInfo = tmp.getElementsByClassName('left-breakdown')[0];
    var numRatings = tmp.getElementsByClassName('table-toggle rating-count active')[0].innerText;
    tmp.innerHTML = ratingInfo.innerHTML;

    //get the raw rating data
    var ratings = tmp.getElementsByClassName('grade');

    var scale = " / 5.0";
    var overall = ratings[0];
    var wouldTakeAgain = ratings[1];
    var difficulty = ratings[2];
    tmp.remove();

    //create the ratings divs
    var profNameDiv = document.createElement('div');
    var overallDiv = document.createElement('div');
    var overallTitleDiv = document.createElement('div');
    var overallTextDiv = document.createElement('div');
    var wouldTakeAgainDiv = document.createElement('div');
    var wouldTakeAgainTitleDiv = document.createElement('div');
    var wouldTakeAgainTextDiv = document.createElement('div');
    var difficultyDiv = document.createElement('div');
    var difficultyTitleDiv = document.createElement('div');
    var difficultyTextDiv = document.createElement('div');
    var numRatingsDiv = document.createElement('div');

    //assign class names for styling
    profNameDiv.className = 'heading';
    overallDiv.className = 'overall';
    overallTitleDiv.className = 'title';
    overallTextDiv.className = 'text';
    wouldTakeAgainDiv.className = 'would_take_again';
    wouldTakeAgainTitleDiv.className = 'title';
    wouldTakeAgainTextDiv.className = 'text';
    difficultyDiv.className = 'difficulty';
    difficultyTitleDiv.className = 'title';
    difficultyTextDiv.className = 'text';
    numRatingsDiv.className = 'numRatings';

    //put rating data in divs
    profNameDiv.innerHTML = proffName + " " + proflName;//'<a href="' + profURL + '" target="_blank">' + proffName + " " + proflName + '</a>';
    overallTitleDiv.innerText = 'Overall Quality';
    overallTextDiv.innerText = overall.innerHTML.trim().concat(scale);
    wouldTakeAgainTitleDiv.innerText = 'Would Take Again';
    wouldTakeAgainTextDiv.innerText = wouldTakeAgain.innerHTML.trim();
    difficultyTitleDiv.innerText = 'Difficulty';
    difficultyTextDiv.innerText = difficulty.innerHTML.trim().concat(scale);

    numRatings = numRatings.slice(9).split(' ')[0] //check to see if "ratings" is singular or plural
    if (numRatings == '1') {
        numRatingsDiv.innerHTML = '<a href="' + profURL + '" target="_blank">' + numRatings + ' rating</a>';
    } else {
        numRatingsDiv.innerHTML = '<a href="' + profURL + '" target="_blank">' + numRatings + ' ratings</a>';
    }

    popup.innerHTML = ''; //remove 'loading...' text

    //add divs to popup
    overallTitleDiv.appendChild(overallTextDiv);
    overallDiv.appendChild(overallTitleDiv);
    wouldTakeAgainTitleDiv.appendChild(wouldTakeAgainTextDiv);
    wouldTakeAgainDiv.appendChild(wouldTakeAgainTitleDiv);
    difficultyTitleDiv.appendChild(difficultyTextDiv);
    difficultyDiv.appendChild(difficultyTitleDiv);

    popup.appendChild(profNameDiv);
    popup.appendChild(overallDiv);
    popup.appendChild(wouldTakeAgainDiv);
    popup.appendChild(difficultyDiv);
    popup.appendChild(numRatingsDiv);
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
            return ratings;
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





