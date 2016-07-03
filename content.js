// changes results color to red
function changeResultColor() {
    var resultCount = document.getElementsByClassName('result-count-container');
    resultCount[0].style.color = "red"; 
}

var q = document.getElementById('q');
q.addEventListener('keydown', function(event) {
    var results = document.getElementsByClassName('result-count-container');
    var resultContainer = results[0];
    if(event.key === 'Enter') {
        createRefreshButton(resultContainer);
        main();
    }
}, false)

function createRefreshButton(resultContainer) {
    var parentCells = document.getElementsByClassName('col-md-6 col-sm-5');
    var refreshButton = document.querySelector('.refresh-button-container');
    if(!refreshButton) {
        var div = document.createElement('div');
        div.className = 'refresh-button-container';
        div.innerHTML = '<input class="refreshButton" type="button" value="Refresh Ratings" style="background-color: #ba0506; color: #fff"/>';
        div.clicked = false;
        div.addEventListener('click', refresh);
        resultContainer.appendChild(div);
    } else {
        var refreshContainer = document.querySelector('.refresh-button-container');
        refreshContainer.innerHTML = '<input class="refreshButton" type="button" value="Refresh Ratings" style="background-color: #ba0506; color: #fff"/>';
        refreshContainer.clicked = false;
        refreshContainer.addEventListener('click', refresh);
        resultContainer.appendChild(refreshButton);    
    }
}



// as they accumlate, manually add exceptions for name conflicts
var exceptions = {};
<<<<<<< HEAD
   //  exceptions["Anastasios (Tasos) Sidiropoulos"] = "http://www.ratemyprofessors.com/ShowRatings.jsp?tid=2044391";
   // exceptions["Mikhail Belkin"] = "http://www.ratemyprofessors.com/ShowRatings.jsp?tid=864899";
=======
>>>>>>> 5679e0b014208597de11eb58a2d46279cede5dcd
    exceptions["Christine Ann Kiel"] = "Chris Kiel";


function refresh() {
    if (this.clicked == true) {
        this.innerHTML = '<input class="refreshButton" type="button" value="Refresh Ratings" style="background-color: #ba0506; color: #fff"/>';
        this.clicked = false;
    } else {
        this.innerHTML = '<input class="refreshButton" id="processing" type="button" value="Processing" style="background-color: #474747; color: #fff"/>';
        setTimeout(function() {
            var refreshContainer = document.querySelector('.refresh-button-container');
            refreshContainer.clicked = true;
            refreshContainer.innerHTML = '<input class="refreshButton" type="button" value="Ratings Refreshed" style="background-color: #909738; color: #fff" disabled/>';
            main();
        } , 1000); // fix; this is for 'fake' processing info
    }
}

function main() {   

    changeResultColor();

    var cells = document.getElementsByClassName("right ng-binding ng-scope");
    var parentCells = document.getElementsByClassName('col-md-6 col-sm-5');
    //var buttonContainers = document.getElementsByClassName('button-container');
    var length = cells.length;
    var professors = [];

    for (var i=0; i<length; i++)
    {
        var exists = parentCells[i].querySelector('.button-container');
        if(!!exists) {
            // TODO: ???
            console.log('Button exists!');
        } else {
        // create space for popup HTML
        console.log('Creating new ratings button!');
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

                var profSplit = profName.split(" ");
                var profArray = [];   
                if(profSplit.length == 3) {
                    profSplit.splice(1, 1);
                    profArray = swapArrayElements(profSplit, 0, 1);
                } else {
                    profArray = swapArrayElements(profSplit, 0, 1);
                }
            
                var profString = profArray.toString();
                var searchName = profString.replace(/,/g,'+');
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
    var q = document.getElementById('q');
    q.addEventListener('keydown', function(event) {
        var results = document.getElementsByClassName('result-count-container');
        var resultContainer = results[0];
        if(event.key === 'Enter') {
            createRefreshButton(resultContainer);
            main();
        }
    }, false)
}

function openPopup() {
    if (this.clicked == true) { //happens when button was clicked while active
        this.cell.innerHTML = '';
        this.innerHTML = '<input class="ratingButton" type="button" value="Show Rating" />';
        this.clicked = false;
    } else { //happens when button was clicked while inactive
        this.clicked = true;
        this.innerHTML = '<input class="ratingButton" type="button" style="background-color: #26686d; color: #fff;" value="Hide Rating" />';
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
        idk.innerHTML = '<p><a style="color: red !important; text-decoration: underline !important;" href="http://www.ratemyprofessors.com/teacher/create">Add</a> professor!</p>';
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
                idk.innerHTML = '<p><a style="color: red !important; text-decoration: underline !important;" href="http://www.ratemyprofessors.com/teacher/create">Add</a></p><p> professor!</p>';
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
    if (tmp.getElementsByClassName('pfname').length == 0) {
        var emptyPopup = popup;
        emptyPopup.className = 'notFoundPopup';
        var notFound = document.createElement('div');
        var idk = document.createElement('div');
        notFound.className = 'heading';
        idk.className = 'idk';
        notFound.innerText = "Professor not found";
        idk.innerHTML = '<p>Be the first to rate this professors: </p><a href=' + profURL + '/a>';
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
    profNameDiv.innerHTML = proffName + " " + proflName;
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

// helper function
function swapArrayElements(a, x, y) {
  if (a.length === 1) return a;
  a.splice(y, 1, a.splice(x, 1, a[y])[0]);
  return a;
};

// Need MutationObserver to watch for changes in the number of results on 'results' page. When triggered,
// we modify page to include a "show rating" button for each professor, allow user to view RateMyProfessors.com
// ratings
//
// select the target node
var target = document.querySelector('.result-count');    
var mutantCycles = [];
// create an observer instance
var observer = new MutationObserver(function(mutations) {
    // loop through all mutations, keeping track of "results" number as page fully loads
    // before calling main
    var length = mutations.length - 1;
    var mutant = mutations[length];
    mutantCycles.push(getFinalResult(mutant));
    var mutantCyclesLength = mutantCycles.length;
    for(var i=0; i<mutantCyclesLength; i++) {
        console.log(mutantCyclesLength[i]);
    }
    main();
});

// remove this eventually, terribly inelegant 
function getFinalResult(mutant) {
    var tmp = mutant.target.innerText.split(" ");
    var results = parseInt(tmp[0], 10);
    return results;
}

var options = { 'attributes': true, 'childList': true, 'characterData': true, 'subtree': true, 'attributeFiler': ['class'] }
 
// pass in the target node, as well as the observer options
observer.observe(target, options);
//observer.disconnect(); I'm not sure if this mutation obvesrver should ever be diconnected, probably not





