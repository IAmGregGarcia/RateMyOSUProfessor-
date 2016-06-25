
/**
 *
 * 
 */
function changeResultColor() {
    var resultCount = document.getElementsByClassName('result-count');
    resultCount[0].style.color = "red"; 
    main();
}


var node = document.getElementsByClassName('site-subtitle');
var enable = document.createElement('button');
enable.id = 'enable-rmp';
enable.innerText = "Enable RMP";
node[0].appendChild(enable);
enable.addEventListener('click', main);


var cells = document.querySelectorAll('[id^=MTG_INSTR]')

MTG_INSTR

function main() {
    changeResultColor();
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

var queryBar = document.getElementById("q");
queryBar.addEventListener("keydown", function(event) {
    if(event.key === 'Enter') {
        document.addEventListener('DOMContentLoaded', onPageLoad, true);
    }
});

function onPageLoad(event) {
    alert('Content has loaded');
}


