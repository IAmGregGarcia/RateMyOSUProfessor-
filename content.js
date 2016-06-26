
/**
 *
 * 
 */
function changeResultColor() {
    var resultCount = document.getElementsByClassName('result-count');
    resultCount[0].style.color = "red"; 
    main();
}





//var cells = document.getElementsByClassName('right ng-binding ng-scope');

function main() {
    //changeResultColor();
    
    // var node = document.getElementsByClassName('site-subtitle');
    // var enable = document.createElement('button');
    // enable.id = 'enable-rmp';
    // enable.innerText = "Enable RMP";
    // node[0].appendChild(enable);
    // enable.addEventListener('click', main);
    
    var cells = document.getElementsByClassName("right ng-binding ng-scope");
    var length = cells.length;
    var professors = [];

    for (var i=0; i<length; i++)
    {
        var profName = cells[i].innerText;
        var scoreHeading = document.createElement('div');
        scoreHeading.className = 'score-heading'; 
        scoreHeading.innerText = "RateMyProfessors Score for: " + profName;
        cells[i].appendChild(scoreHeading);
    }
}

// select the target node
var target = document.querySelector('.result-count');
 
// create an observer instance
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        //console.log(mutation.type);   
        //alert("Type of mutation: " + mutations.type);
        var results = document.querySelector('.result-count').innerText;
        console.log(results);
        // getResultsCount(target);
        // alert(results);
        // var check = parseInt(results, 10);
        // var comp = 
        observer.disconnect();
    });
});
 
// function getResultsCount(target) {
//     var temp = target.innerText.split(" ");
//     // var results = parseInt(temp[0], 10);
//     alert(temp[0].toString());
// }
// configuration of the observer:
var options = { 'attributes': true, 'childList': true, 'characterData': true, 'attributeFilter': ['aria-hidden'] }
 
// pass in the target node, as well as the observer options
observer.observe(target, options);
//observer.disconnect();
// later, you can stop observing
// observer.disconnect();


// var queryBar = document.getElementById("q");
// queryBar.addEventListener("keydown", function(event) {
//     if(event.key === 'Enter') {
//         document.addEventListener('DOMContentLoaded', onPageLoad, true);
//     }
// });




