var itemsData = { };
var itemsCurrent = 1;
var host = "http://" + window.location.hostname + "/cgi-bin/webradio/";
var isManageMode;
var isItemChanged;
var encoding = "en";
var ajaxBusy = false;
var curVol; 

$(document).ready(function() {
	loadCurrentVol();

	$("#show_manage_streams_button").click(function() {
		$("#show_manage_streams_button").hide();
		$("#add_stream_block").show();
		$(".manage").show();
	});


	$("#cancel_add_stream_button").click(function() {
		$("#stream_title").val("");
		$("#stream_url").val("");
		$("#add_stream_block").hide();
		$("#show_manage_streams_button").show();
		$(".manage").hide();
	});
	$("#add_stream_button").click(function() {
		addStream();
	});
	loadItemsList("network");
	
	setTimeout('$("#volumeSlider").val(curVol)',2000);
	$("#volumeSlider").change(function(){
		volCntrl($("#volumeSlider").val());
	})
	
	$('#play_stop').on('click', function() {
		var val = $(this).is('.stoped');
		if (!val) {
			$(this).addClass('stoped')
				.attr('src', 'img/play.png');
				sendStopPlay();
		} else {
			$(this).removeClass('stoped')
				.attr('src', 'img/stop.png');
				playCurrentItem();
		}
		
	})

});

function loadItemsList(mode) {
	var url = host + "items.cgi?action=" + mode;

	var action = "curnetwork";
			
	var url2 = host + "items.cgi?action=" + action;
	
	$.get(url, function(items) {
		$.get(url2, function(current) {
			itemsData = parseItemsData(items.trim());
			
			updateItemsList(mode, current.trim(), false, true, true);
			playCurrentItem();
			loadStatus();
		});	
	});
}


function	loadCurrentVol() {
	var url = host + "items.cgi?action=currentvol";

	$.ajax({
	  type: "GET",
	  url: url,
	  success: function(data){
	  		var tmp = data.match(/\d+\%/)[0];
	 
	 	 	curVol = tmp.slice(0,tmp.length-1);
  		}
});
};
	

function playCurrentItem() {
	playItem("network", itemsCurrent);

}


function updateItemsList(mode, currentItem, subtitle, sort, remove) {
	var contentElement = $(".list tbody");
	contentElement.empty();


	var items = itemsData;
	
	if (items && items.length > 0) {
		var itemsCount = items.length;
		itemsCurrent = currentItem;
		
		var id;
		var selected;
		var sortContent = "";
		var removeContent = "";
		var subTitleContent = "";
		var content;
		var title;
		for (item in items) {
			title = items[item].title;
			id = parseInt(item) + 1;
			selected = (id == currentItem);
			if (subtitle) {
				subTitleContent = '<span class="' + mode + '_sublabel">' + items[item].value + '</span>';
			}
			if (sort) {
				sortContent = ((id == itemsCount) ? '<img class="img" src="img/transparent.png">' : '<img class="img" src="img/down.png" onClick="moveItem(\'' + mode + '\', ' + subtitle + ', ' + sort + ', ' + remove + ', ' + id + ',\'down\')">') + ((id == 1) ? '<img class="img" src="img/transparent.png">' : '<img class="img" src="img/up.png" onClick="moveItem(\'' + mode + '\', ' + subtitle + ', ' + sort + ', ' + remove + ', ' + id + ',\'up\')">' );
			}
			if (remove) {
				removeContent = ((itemsCount == 1) ? '' : '<img class="img" src="img/remove.png" onClick="removeItem(\'' + mode + '\', ' + subtitle + ', ' + sort + ', ' + remove + ', ' + id + ')">');
			}

			
				content = '<tr class="list_item' + (selected ? "_selected" : "") + '"><td class="network_label" id="' + mode + '_label' + id + '"'+' onClick="playItem(\'' + mode + '\', ' + id + ')">' + title + '</td>' + '<td class="contrl manage">'+ subTitleContent + sortContent + removeContent +'</td>'+'</tr>';
			
			
			contentElement.append(content);
		
		}
	}
	else {
		contentElement.append('No items');
	}
}


function playItem(mode, id) {
	setSelectedRow(mode, id);
	
	sendPlayItem(id);

	if(!$('#play_stop').is('.stoped')) return; 
	$('#play_stop').removeClass('stoped').attr('src', 'img/stop.png');
	
}

function setSelectedRow(mode, id) {

	$(".list_item_selected").attr("class", "list_item");
	
	var el2 = $("#" + mode + "_label" + id).closest('tr');
	el2.attr("class", "list_item_selected" );
	
}

function removeItem(mode, subtitle, sort, remove, id) {
	itemsData[id - 1] = null;

	var tempList = [];
	var i = 0;
	for (item in itemsData) {
		if (itemsData[item]) {
			tempList[i] = itemsData[item];
			i++;
		}
	}
	itemsData = tempList;
	
	updateItemsList(mode, 1, subtitle, sort, remove);
	
	$(".manage").show();

	sendItemsUpdate(mode, id, "remove");
}

function moveItem(mode, subtitle, sort, remove, id, dir) {
	var tempList = [];
	var i = 1;
	for (var j = 0; j < itemsData.length; j++) {
		tempList[i] = itemsData[j];
		i += 2;
	}
	var oldPosition = (id - 1) * 2 + 1;
	var newPosition = (dir == "down") ? (id - 1) * 2 + 4 : (id - 2) * 2;
	tempList[oldPosition] = null;
	tempList[newPosition] = itemsData[id - 1];
	
	itemsData = [];
	i = 0;
	for (item in tempList) {
		if (tempList[item]) {
			itemsData[i] = tempList[item];
			i++;
		}	
	}
	
	updateItemsList(mode, 1, subtitle, sort, remove);

	$(".manage").show();

	sendItemsUpdate(mode, id, "move");
}

function addStream() {
	var title = $("#stream_title").val();
	var value = $("#stream_url").val();
	title = title.replace('"', '');
	value = value.replace('"', '');
	if (title == "") {
		alert("Invalid title");
		$("#stream_title").focus();
		return;
	}
	if (checkTitle(title)) {
		alert("Item already exists");
		$("#stream_title").focus();
		return;
	}
	if (value == "" || checkURL(value)) {
		alert("Invalid URL");
		$("#stream_url").focus();
		return;
	}
	$("#stream_title").val("");
	$("#stream_url").val("");
	if (!itemsData) {
		itemsData = [ { "title": title, "value": value } ];
	}
	else {
		itemsData[itemsData.length] = { "title": title, "value": value };
	}	
	
	updateItemsList("network", 1, false, true, true);

	$(".manage").show();

	var rforeign = /[^\u0000-\u007f]/;
	encoding = (rforeign.test(title)) ? "ru" : "en";
	sendItemsUpdate("network", itemsData.length, "add");
}

function checkTitle(title) {
	if (!itemsData) {
		return false;
	}
	for (item in itemsData) {
		if (itemsData[item].title == title) {
			return true;
		}
	}
	return false;
}

function checkURL(value) {
	return !(value.substr(0, 7) == "http://" || value.substr(0, 8) == "https://");
}

function sendItemsUpdate(mode, id, action) {
	var url = host + "update.cgi";
	$.post(url, {
				'mode': mode,
				'id': id,
				'action': action,
				'encoding': encoding,
				'current': 1,
				'data': prepareItemsData(itemsData)				
				} );
}

function parseItemsData(items) {
	var output = [];
	var id;
	var item = [];
	var arr = items.split(';');
	if (arr.length > 0) {
		for (id in arr) {
			if (arr[id].length > 1) {
				item = arr[id].split('|');
				output[output.length] = { "title": item[0], "value": item[1] };
			}	
		}
	}
	return output;
}

function prepareItemsData(data) {
	var output = "";
	for (id in data) {
		output += data[id].title + "|" + data[id].value + ";";
	}
	return output;
}
//Остановка воспроизведения
function sendStopPlay() {
	var url = host + "update.cgi";

	$.post(url, {
			'mode' : "stopnetwork"
			});	   
	}

function volCntrl(action) {
	var url = host + "update.cgi";
	if (ajaxBusy == true) return

	$.post(url, {
		'mode' : 'volCntrl',
		'action' : action+'%'
		},
			function(data) {				
				ajaxBusy = false;
				}
		   );
		   ajaxBusy = true; 
	}

function sendPlayItem(current) {
	if (!current) {
		return;
	}
	isItemChanged = true;
	
	var url = host + "update.cgi"
	var mode = "playnetwork";
	itemsCurrent = current;

	$.post(url, {
			'mode' : mode,
			'id': current
			},
			function(data) {
				setTimeout('isItemChanged = false', 2000);
			}
		   ).error(function() { 
				isItemChanged = false; 
		    });	 
}

function playItemByDirection(direction) {
	var total = itemsData.length;
	if (direction == 'next') {
		itemsCurrent++;
	}
	else {
		itemsCurrent--;
	}
	if (itemsCurrent > total) {
		itemsCurrent = 1;
	}
	else if (itemsCurrent < 1) {
		itemsCurrent = total;
	}
	playCurrentItem();
}

function loadStatus() {
	var action = "statusnetwork";
	
	var url = host + "items.cgi?action=" + action;
	$.get(url, function(data) {
		if (!isItemChanged) {
			var arr = data.split(' ');
			var currentNetItem = parseInt(arr[0]);
			if (itemsCurrent != currentNetItem) {
				itemsCurrent = currentNetItem;
				/*setSelectedRow("network", currentNetItem);*/
				currentNetTitle = "n/a";
			}
			var currentNetTitle = decodeURI(arr[1].trim());
			if (currentNetTitle == "") {
				currentNetTitle = "n/a";
			}
			if ($("#network_track_title").html() != "Track: " + currentNetTitle) {
				$("#network_track_title").html("Track: " + currentNetTitle);
			}
			
			if ($('#title').html()!= "WebRadio: "+ $(".list_item_selected .network_label").html()) {
				$('#title').html("WebRadio: "+ $(".list_item_selected .network_label").html());
			}

		}	
		
	});
	setTimeout(loadStatus, 5000);

}