/*global $:false */
/*global chrome:false*/

/**
 *
 * 
 */

// Professor Name conflicts TODO: manually enter Anastasios (Tasos) Sidiropolous via exceptions
var exceptions = {};

appendOSUprof(exceptions);

//Insert a column with the ratings and corresponding professor pages for each professor from Ratemyprofessor.com

function appendOSUprof(exceptions) {

    // //Insert a column header
    // $('thead').find('tr').each(function() {
    //     $(this).find('th').eq(4).after('<th>Rate My Professor Score(s)</th>');
    // });
    
    // Insert RMP heading
    $('ul.osu-people-directory').find('li').each(function() {
        $(this).find('.km-email').after('<div class="osu-rmp"><br><h4 style="font-size: 14px !important;">Rate My Professory Score(s):</h4></div>');
    });

    //Insert "space" for RMP info for each listed faculty member
    $('.osu-people-directory').find('li').each(function() {

        var professorName = $(this).find('h2').find('a').html();
        if(professorName == null) {
            professorName = "Could not locate professor on webpage";
        } else {

            // Swap first and last name
            var profSplit = professorName.split(" ");
            var profArray = swapArrayElements(profSplit, 0, 1);
            var profString = profArray.toString();

            var URLprofessorName = profString.replace(/,/g,'+');
        }

        if(exceptions[professorName]) {

            findRatings(exceptions[professorName], professorName);
        } else {

            rmpsearch = 'http://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=&schoolID=724&query=PROFESSORNAME';
            rmpsearch = rmpsearch.replace('PROFESSORNAME', URLprofessorName);
        }

        getProfessorExtension(rmpsearch, professorName);
    });
}

/**
* Swap the elements in an array at indexes x and y.
*
* @param (a) The array.
* @param (x) The index of the first element to swap.
* @param (y) The index of the second element to swap.
* @return {Array} A new array with the elements swapped.
*/

function swapArrayElements(a, x, y) {
  if (a.length === 1) return a;
  a.splice(y, 1, a.splice(x, 1, a[y])[0]);
  return a;
};
/*
Given an RMP search page, find the numerical extension that corresponds with the the professor's personal RMP page.
*/
function getProfessorExtension(searchPageURL, professorName){

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
                updateRMPinfo('?','?', professorName);//update RMP cells with empty information
            } else {
                var professorPageURL = 'http://www.ratemyprofessors.com' + professorURLExtension;
                ratings = findRatings(professorPageURL, professorName);
            }
        }
        catch(err) {
            updateRMPinfo('?', '?', professorName);//update RMP cells with empty information
        }       
    });
}

/*
Given the url of a specific professor:
Makes a JSON object containing an overall rating, helpfulness rating, clarity rating, and easiness rating.
Then makes a pass to change RMP cells to update each individual cell of the RMP column with this info.
*/
function findRatings(professorPageURL, professorName){
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
            easiness: -1
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
            // rating.easiness = $(responseXML).find('.rating:eq(0)').html();

            //document.write(responseXML);

            //Check to make sure a result was found
            if (parseInt(rating.overall) > 5 || parseInt(rating.overall) <= 0 || isNaN(rating.overall)){
                rating = '?';
            }

        }
        catch(err) {
            rating = '?';
        }

        //Update the new RMP column cells with the new information.
        updateRMPinfo(professorPageURL, rating, professorName);
    });
}


/*
    Rename function to more appropriately reflect the action
    Most likely will update to have UL with li for RMP rating criteria 
*/
function updateRMPinfo(professorPageURL, rating, professorName){

    $('ul.osu-people-directory').find('li').each(function() {

        // fix this guy right here

        var professorCell = $(this).find('h2').find('a').html();
        // console.log(professorCell);
        // console.log(professorName);

        // TODO: something strange is happening here: professorCell is capturing the pervious professor on the page, and checking
        // against professorName, which has the *correct* prof for whom we are searching. 
        // check professorname var above

        if (professorCell == professorName){

            if (professorPageURL != '?') {

                if (rating != '?' && typeof rating != 'undefined') {

                    $(this).find('h4').after(
                        'Overall: '+ rating.overall +
                        // '\nHelpfulness: '+ rating.helpfulness +
                        // '\nClarity: '+ rating.clarity +
                       // '\nEasiness: '+ rating.easiness +
                        ' \n<a href="' + professorPageURL + "\n" + '" target="_blank">More info</a>');
                } else {
                    $(this).find('h4').after(
                        '<p><a href="' + professorPageURL + '" target="_blank">Be the\nfirst to rate!</a></p>'
                    );
                }
            } else {
                $(this).find('h4').after('<p>No page was found.</p>');
            }
        }
    });
}