var RMPExtension = {
	init: function(){
			// var winDiv = document.getElementById("win0divDERIVED_CLSRCH_SS_TRANSACT_TITLE");
			var search = document.getElementById("CLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH");
			if(search){
			search.addEventListener("click", appendCells, false);
			var checkpoint = "checkpoint";


			var button = document.createElement('button');
        	button.className = 'button';
        	button.innerText = 'Click me...';
        	search.appendChild(button);

		}
	},

	appendCells: function() {
		var cells = document.querySelectorAll("[id^=MTG_INSTR]");
		var length = cells.length - 1;
		var professors = [];

		for(var i=0; i<length; i++)
		{
			var profName = cells[i].innerText;
		//	console.log(profName;)
		}
	}
};

// append prof rating


// select the target node
var target = document.querySelector('#some-id');
 
// create an observer instance
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        //console.log(mutation.type);
        main();
    });
});
 
// configuration of the observer:
var config = { attributes: true, childList: true, characterData: true }
 
// pass in the target node, as well as the observer options
observer.observe(target, config);
 
// later, you can stop observing
observer.disconnect();

// can't do onInit directly here, because the DOM hasn't been loaded for options.html yet
// we just set an event listener for document.DOMContentLoaded - In that handler we can call onInit
// window.addEventListener('DOMContentLoaded', RMPExtension.init, false);

//win0divCLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH
// need to add column header to table row 
// this is the class for the column header PSLEVEL1GRIDCOLUMNHDR
// class="PSLEVEL1GRIDNBONBO"
// id="SSR_CLSRCH_MTG1$scroll$0" // id for table header ?
// id=win0divSSR_CLSRSLT_WRK_GROUPBOX3$0
// id=win0divSSR_CLSRSLT_WRK_GROUPBOX3$1

