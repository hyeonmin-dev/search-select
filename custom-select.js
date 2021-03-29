var focus_select = '';

window.onload = function(){
	
	const custom_search = document.getElementsByClassName('custom-search');
	
	for (var i=0; i<custom_search.length; i++) {
		var element = custom_search[i];
		var children = element.getElementsByTagName("option");
		var width = element.offsetWidth;
		
		var list = [];
		for(var j=0; j<children.length; j++){
			var element_child = children[j];
			var item = {"id": element_child.value , "name": element_child.text};
			list.push(item);
		}
		
		setCustomSelect(element, list, width);
	}
}

// 특정영역 밖 클릭 이벤트
document.addEventListener('click', function(e){
	var target = e.target;
	
	if (target != focus_select) {
		showSearchList(focus_select, false);
	}
});

function setCustomSelect (instance, list, width){
	
	var box = document.createElement("span");
	var input = document.createElement("input");
	var ul = document.createElement("ul");	
	
	input.type = "text";
	input.value = instance.options[instance.selectedIndex].text; // set init value
	input.style.width = width + "px";
	input.addEventListener('click', function() { event.stopPropagation(); showSearchList(ul, true); });
	input.addEventListener('keyup', function(e) { searchSearchList(e, ul); });
	
	ul.style.width = width + "px";
	for (var i=0; i<list.length; i++) {
		// add search list item		
		var item = list[i];
		var li = document.createElement("li");
		li.innerText = list[i].name;
		li.dataset.id = list[i].id;
		li.addEventListener('click', function() { event.stopPropagation(); selectSearchList(this); });
		ul.appendChild(li);
	}
	
	box.appendChild(input);
	box.appendChild(ul);
	box.className = "custom-box";
	instance.style.display = "none";
	instance.parentNode.insertBefore(box, instance);
}

function showSearchList (instance, state) {
	
	focus_select.className = '';
	if (state) {
		instance.className = 'active';
	}	
		
	focus_select = instance;
}

// Search
function searchSearchList (e, instance) {
	
	let keycode = e.code;	
	var keywords = e.target.value.split(" ");
	var options  = instance.getElementsByTagName("li");	
	var changedText = "<i>$&</i>";	

	if (keycode == 'ArrowDown' || keycode == 'ArrowUp') {
		setFocusCustomItem(keycode, instance);
		return;
	}
	else if (keycode == 'Enter') {
		selectSearchList(instance.getElementsByClassName("focus")[0]);
		return;
	}
		
	for (var i=0; i<options.length; i++) {
		
		var count = 0;
		var option_name = options[i].innerText;
		for (var j=0; j<keywords.length; j++) {
			
			var keyword = keywords[j];
			if (keyword == "") {
				count++;
				continue;
			}


			if( option_name.match(new RegExp(keyword, "i")) ){
				count++;
			}
		}
		
		if (count == keywords.length) {
			// show
			var regEx = new RegExp( keywords.join('|'), "gi" );
			options[i].innerHTML = option_name.replace(regEx, changedText);
			options[i].className = "";			
		} else {
			// hide
			options[i].className = "off";
		}
	}
}


// Select 
function selectSearchList (instance) {
	
	var id = instance.dataset.id;
	var name = instance.innerText;
	var inp = focus_select.parentNode.getElementsByTagName("input")[0];
	var select = focus_select.parentNode.nextSibling;
	
	select.value = id;
	inp.value = name;	
	focus_select.className = '';
	focus_select.parentNode.nextSibling.onchange();
}


// Function
function setFocusCustomItem (keycode, list) {

	var options_on = [];
	var options_off  = list.getElementsByTagName("li");
	var has_focus = false;
	var focus_idx = 0;
	var count = 0;
	
	for (var i=0; i<options_off.length; i++) {
		var option = options_off[i];
		
		if (!option.classList.contains("off")) {			
			if (option.classList.contains("focus")){
				has_focus = true;
				focus_idx = count;
				option.classList.remove("focus");
			}
			count++;
			options_on.push(option);
		}		
	}
	
	if (keycode == 'ArrowDown' && has_focus) {
		
		focus_idx++;
		if( focus_idx >= options_on.length ) focus_idx = options_on.length - 1;
	}
	else if (keycode == 'ArrowUp' && has_focus) {
		
		focus_idx--;		
		if( focus_idx < 0 ) focus_idx = 0;
	}

	options_on[focus_idx].classList.add("focus");
	list.scroll(0, 22 * focus_idx--);
}


function onChangeEvent() {
	alert("Changed!!");
}