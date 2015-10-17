
window.onload = function(){
	//start page
	loadPage("main");

	//usuwamy adresy w linkach w menu (byly potrzebne na wypadek wylaczonego js w przegladarce)
	var links = document.getElementById("menu").getElementsByTagName("a");;
	
	for(i=0; i < links.length; i++) {
		links[i].setAttribute("href", "#");
		links[i].setAttribute("target", "");
	}
}

/* AJAX do obslugi menu i asynchronicznego ladownia podstron */
/************************************************************/

var requester;
var page;
	
function processText() {
	if( requester.readyState == 4 )
	if( requester.status == 200 )
	{
		var out = document.getElementById( "content" );
		out.innerHTML = requester.responseText;
		
		fixAjaxResponse();
	}
}

function loadPage(pageName) {
	page = pageName;
	requester = new XMLHttpRequest();
	requester.onreadystatechange=processText;
	requester.open( "GET", "pages/" + pageName + ".html", true );
	requester.send( null );
}

function fixAjaxResponse() {
	switch (page) {
		case "main":
			showMore()
			break; 
		case "contact":
			amendDay();		
			amendYear(); 
			$(document).ready(validateForm()); 
			break; 
		case "equipment":
			loadTable()
			break; 
		case "weather":
			zoom();
			break; 
		case "photo":
			//startGallery();
			gallery.init();
			gallery.RemoveLinks();
			//$(".fancybox").fancybox();
			break; 
		default: 
			//alert("inne");
			break;
	}
}

function amendDay(){
	var select = document.getElementById("day");

	for(var i = 1; i < 32; i++){
		var option = document.createElement("option");
		option.text = i;
		option.value = i;
		select.appendChild(option);
	}
}

function amendYear(){
	var select = document.getElementById("year");
	
	var myDate = new Date();
	var year = myDate.getFullYear();
	for(var i = year; i >= 1920; i--){
		var option = document.createElement("option");
		option.text = i;
		option.value = i;
		select.appendChild(option);
	}
}

/* obsluga funcji Add www z zakladki Form with validation */
/**********************************************************/

i=1;
function addFavourite(){
	i++;
	var kontener = document.getElementById("kontener");
	var newp = document.createElement("p");
	newp.id = "wiersz" + i;
	
	//favourite www - text input
	var newLabelFirst = document.createElement("label");
	var newLabelFirstText = document.createTextNode("Name" + i);
	var newInputFirst = document.createElement("Input");
	newInputFirst.type = "url";
	newInputFirst.id = "name" + i;
	
	//link add
	var link1 = document.createElement("a");
	link1.href="javascript:void(0)";
	link1.addEventListener("click",function() {addFavourite()},false);
	var linkText = document.createTextNode("Add www");
	link1.appendChild(linkText);

	//link delete
	var link = document.createElement("a");
	link.href="javascript:void(0)";
	link.id=i;
	var x = i;
	link.addEventListener("click",function() {removeFavourite(x)},false);
	var linkText = document.createTextNode("Remove");
	link.appendChild(linkText);
	
	newLabelFirst.appendChild(link1);
	newp.appendChild(newLabelFirst);

	newp.appendChild(newInputFirst); 
	newp.appendChild(link);
	kontener.appendChild(newp);
}

function removeFavourite(x) {
		var dousuniecia = document.getElementById("wiersz" + x);
		dousuniecia.parentNode.removeChild(dousuniecia);
}

/* jquery - form validation */
/************************************/

function validateForm () {		
    $('#contactForm').validate({ // initialize the plugin
        rules: {
            username: {
                required: true,
                minlength: 5,
            },
			password: {
				required: true,
				minlength: 5
			},
			confirm_password: {
				required: true,
				minlength: 5,
				equalTo: "#password"
			},
			firstname: {
				required: true,
				minlength: 2
			},
			lastname: {
				required: true,
				minlength: 2
			},
			phone: {
				required: true,
				phone: true
			},
			email: {
                required: true,
                email: true
            },
			zip: {
				required: true,
                zip: true
			}
        },
		messages: {
				firstname: "Please enter your firstname",
				lastname: "Please enter your lastname",
				username: {
					required: "Please enter a username",
					minlength: "Your username must consist of at least 2 characters"
				},
				password: {
					required: "Please provide a password",
					minlength: "Your password must be at least 5 characters long"
				},
				confirm_password: {
					required: "Please provide a password",
					minlength: "Your password must be at least 5 characters long",
					equalTo: "Please enter the same password as above"
				},
				email: "Please enter a valid email address",
				zip: "Please enter a valid postal code",
				phone: "Please enter a valid number",
				terms: "Please accept our policy"
			}
    });
}


/* Zoom effect -  w zakladce weather */
/************************************/

function zoom() {
  var canvas = document.getElementById("canvas");
  canvas.style.width = '100%';
  canvas.style.height = '40%';
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  var context = canvas.getContext("2d");
  var scale = 1;
  var originx = 0;
  var originy = 0;
  var x = 0; // x (top-left) coordinate of image according to canvas top-left corner
  var y = 0; // y (top-left) coordinate of image according to canvas top-left corner
  var w =  600; //canvas.width;
  var h = 490; //canvas.height;
  var img = document.createElement('img');
  img.src = 'http://aga.gjstyl.com/cwiczenia/images/weather.gif';
  window.requestAnimationFrame(draw);

  function draw() {
    context.fillStyle = "gray";
    context.fillRect(originx, originy, canvas.width / scale, canvas.height / scale);
    context.fillStyle = "black";
    //obliczenie jakie duze musi byc zdjecie zeby wypelnilo canvas
    context.drawImage(img, x / scale, y / scale, (canvas.width), (canvas.width * img.height / img.width));
    requestAnimationFrame(draw);
  }

  //zoom effect on mouse wheel

canvas.addEventListener('DOMMouseScroll',handleScroll,false); // Firefox
canvas.addEventListener('mousewheel',    handleScroll,false); 
  
function handleScroll(event) {
  event.preventDefault();
  // cross-browser wheel delta
  var event = window.event || event; // old IE support
  if ('wheelDelta' in event) {
    delta = event.wheelDelta;
  } else { // Firefox
    delta = -40 * event.detail;
  }

  var mousex = event.clientX - canvas.offsetLeft;
  var mousey = event.clientY - canvas.offsetTop;
  var wheel = delta / 120; //n or -n

    var zoom = Math.pow(1 + Math.abs(wheel) / 2, wheel > 0 ? 1 : -1);

    context.translate(
      originx,
      originy
    );
    context.scale(zoom, zoom);
    context.translate(-(mousex / scale + originx - mousex / (scale * zoom)), -(mousey / scale + originy - mousey / (scale * zoom)));

    originx = (mousex / scale + originx - mousex / (scale * zoom));
    originy = (mousey / scale + originy - mousey / (scale * zoom));
    scale *= zoom;
    window.requestAnimationFrame(draw);
  }

  //drag and drop effect
  canvas.onmousedown = function(e) {
    var startX = x - e.clientX;
    var startY = y - e.clientY; 

    canvas.onmousemove = function(e) {
      x = e.clientX + startX;
      y = e.clientY + startY;
		
    };
  }

  canvas.onmouseup = function(e) {
    canvas.onmousemove = null;
  };
}



/* list menu z drag and drop*/
/************************************/

var item;
var target;
var ul;

function dragStart(ev) {
  item = ev.target;
  ul = ev.target.parentNode;
  ev.dataTransfer.effectAllowed = 'move';
  ev.dataTransfer.setData("Text", item.id);
  item.ondrag = function() {
    item.classList.add("placeholder");
  }
  return true;
}

function dragEnter(ev) {
  ev.preventDefault();
  
  if (ev.target.id == "listmenu") return false;

  if(listNumber(ev.target) > listNumber(item)) {
    ul.insertBefore(ev.target, item);
  } else {
    ul.insertBefore(item, ev.target);
  }
  
  return true;
}

function dragOver(ev) {
  return false;
}

function dragEnd(ev) {
  item.classList.remove("placeholder");
  return false;
}

function dragDrop(ev) {
  ev.stopPropagation();
  return false;
}

function listNumber(el)
{
  for(var i = 0; i < ul.children.length; i++)
  {
    if (ul.children[i].getAttribute('id') == el.id) 
    {
     return i;
    }
  }
}

/* photo gallery - slider zdjec */
/************************************/
//var photos;

var gallery = {
	
	init: 	function() {		
				//dodaj zdarzenia do zdjec
				var photos = document.getElementsByClassName('gallery');
				Slide = this.Slide;
		
				for(var i = 0; i < photos.length; i++){
					photos[i].id = 'ph-' + (i + 1);
					photos[i].addEventListener("click", function() {
						Slide(this.id);
						}, false);   
				}
				
				//klawisz esc do wyjscia z pokazu slajdow
				hideSlider = this.hideSlider;
				document.onkeydown = function(evt) {
					evt = evt || window.event;
					if (evt.keyCode == 27) {
						hideSlider();
					}
				}
				
			},	
			
	RemoveLinks: function RemoveLinks () {
				//dodaj link do kasowania zdjec ze slidera
				var links = document.getElementsByClassName('desc');
				for(var i = 0; i < links.length; i++){
						links[i].addEventListener("click", function(e) {
								e.preventDefault();
								var img = this.parentNode.firstElementChild.innerHTML;
								var li = this.parentNode;
								li.innerHTML = '<a class="gray" href="javascript:void(0)">' + img + '</a><div class="desc">Deleted</div>';
								gallery.init();
							}, false);   
					}
			},		
		
	Slide: function Slide (photoID) {
					var n = document.getElementsByClassName('gallery').length;
					//Slide = this.Slide;
					document.getElementById('light').style.display='block';
					document.getElementById('fade').style.display='block';
					
					var current = document.getElementById(photoID);
					var num = parseInt(photoID.substr(3,2));
									
					var next = "'ph-" + (num + 1) + "'";
					var prev = "'ph-" + (num - 1) + "'";
					var prevlink = "";
					var nextlink = "";
					
					
					if(num > 1) {
						prevlink = '<a href="javascript:void(0)" class="back black" onclick = "Slide(' + prev +')"><span class="pointer"></span></a>'
					}
					
					if(num < n) {
						nextlink = '<a href="javascript:void(0)" class="next black" onclick = "Slide(' + next +')"><span class="pointer"></span></a>'
					}
					
										
					document.getElementById('light').innerHTML = current.innerHTML + '<a href = "javascript:void(0)" onclick = "hideSlider()">Close</a>' + prevlink + nextlink;
				},
				
	Hide: function Hide (photoID) {
					var n = document.getElementsByClassName('gallery').length;
					
				},			
	hideSlider: function hideSlider() {
					document.getElementById('light').style.display='none';
					document.getElementById('fade').style.display='none';
				}
						
}


/* tabela z zakladki equipment - dodawanie i usuwanie wierszy, edycja */
/**************************************************************/

function loadTable() {
	
	var table = document.getElementById("myTable");

	if (table != null) {
	  for (var i = 0; i < table.rows.length; i++) {
		for (var j = 0; j < table.rows[i].cells.length - 1; j++) {
		  table.rows[i].cells[j].addEventListener("click", function() {
			editText(this);
		  }, false);
		}
		var n = table.rows[i].cells.length - 1;
		table.rows[i].cells[n].addEventListener("click", function() {
			deleteRow(this);
		  }, false);
	  }
	}
}

function editText(tableCell) {
	var txt = tableCell.innerText || tableCell.textContent;
	tableCell.innerText = tableCell.textContent = "";
	var input = document.createElement("input");
	input.type = "text";
	tableCell.appendChild(input);
	input.value = txt;
	input.focus();
	input.onblur = function() {
		tableCell.innerText = input.value;
		tableCell.textContent = input.value;
	}
}

function leaveCell(tableCell) {
	tableCell.innerText = input.value;
	tableCell.textContent = input.value;
}
	


function newRow() {
	var table = document.getElementById("myTable");
	var i = table.rows.length;
	var row = table.insertRow(i);

	for (var j = 0; j < table.rows[0].cells.length - 1; j++) {
		var cell = row.insertCell(j);
		cell.innerHTML = "new name" + i + j;
		table.rows[i].cells[j].addEventListener("click", function() {
			  editText(this);
			}, false);
	}

	var cell = row.insertCell(row.cells.length);
	cell.innerHTML = "x";
	cell.classList.add("delete_row");
	cell.addEventListener("click", function() {
		deleteRow(this);
		}, false);
}

function deleteRow(r) {
	var i = r.parentNode.rowIndex;
	document.getElementById("myTable").deleteRow(i);
}
  


/* Ukrywanie i pokazywanie calosci tekstu w sekcji tekstowej */
/*************************************************************/

function showMore() {
	var links = document.getElementsByClassName("show-more");
	
	[].forEach.call(links, function(item) {
		item.addEventListener("click", function(e){
			e.preventDefault();
			var post = item.parentNode.previousElementSibling;
			
			if(item.textContent == "Show more") {
				linkText = "Collapse text";
				post.classList.add("showContent");
				post.classList.remove("hideContent");

			} else {
				linkText = "Show more";
				post.classList.remove("showContent");
				post.classList.add("hideContent");
			}
			
			item.textContent = linkText;
		}, false);
	});
}
