





function main() {
    // changeResultColor();
	var cells = document.querySelectorAll('[id^=MTG_INSTR]');
    var length = cells.length -1;
    var professors = [];

    for (var i=0; i<length; i++)
    {
        var profName = cells[i].innerText;
  		console.log(profName);
    }
}