function htmlParse(str) {
	var parse_list = [{ char: "<" }, { char: ">" }, { char: "/" }];
	var attribute_list = [{ attr: "style" }, { attr: "id" }, { attr: "class" }, { attr: "href" }];
	var char_list = [];
	var html_list = [];
	var parse_html = [];
	str = str.replace(/\s+/g, "");
	for (var i = 0; i < str.length; i++) {
		var char = str.charAt(i);
		switch (char) {
			case parse_list[0].char:
				char_list.push({ char: "<", pos: i });
				break;
			case parse_list[1].char:
				char_list.push({ char: ">", pos: i });
				break;
			case parse_list[2].char:
				char_list.push({ char: "/", pos: i });
				break;
			default:
				break;
		}
	}
	for (var j = 0; j < char_list.length - 1; j++) {
		if (char_list[j].char == parse_list[0].char && char_list[j + 1].char == parse_list[1].char) {
			html_list.push({
				tag: "opening",
				element: str.substring(char_list[j].pos + 1, char_list[j + 1].pos),
				start: char_list[j].pos,
				end: char_list[j + 1].pos,
				level: "",
				content: "",
				attributes: [],
			});
		} else if (char_list[j].char == parse_list[0].char && char_list[j + 1].char == parse_list[2].char) {
			html_list.push({
				tag: "closing",
				element: str.substring(char_list[j].pos + 2, char_list[j + 2].pos),
				start: char_list[j].pos,
				end: char_list[j + 2].pos,
				level: "",
				content: "",
				attributes: [],
			});
		}
	}
	var level = 0;
	html_list[0].level = level;
	for (var k = 0; k < html_list.length - 1; k++) {
		if (html_list[k].tag == "opening" && html_list[k + 1].tag == "opening") {
			level++;
		} else if (html_list[k].tag == "opening" && html_list[k + 1].tag == "closing") {
			html_list[k].content = str.substring(html_list[k].end + 1, html_list[k + 1].start);
		} else if (html_list[k].tag == "closing" && html_list[k + 1].tag == "closing") {
			level--;
		}
		html_list[k + 1].level = level;
	}
	for (var l = 0; l < html_list.length; l++) {
		if (html_list[l].element.search(attribute_list[0].attr) != -1) {
			html_list[l].attributes.push({
				attribute: "style",
				start: html_list[l].element.search(attribute_list[0].attr),
				end: html_list[l].element.search(attribute_list[0].attr) + 5,
				value: "",
			});
		}
		if (html_list[l].element.search(attribute_list[1].attr) != -1) {
			html_list[l].attributes.push({
				attribute: "id",
				start: html_list[l].element.search(attribute_list[1].attr),
				end: html_list[l].element.search(attribute_list[1].attr) + 2,
				value: "",
			});
		}
		if (html_list[l].element.search(attribute_list[2].attr) != -1) {
			html_list[l].attributes.push({
				attribute: "class",
				start: html_list[l].element.search(attribute_list[2].attr),
				end: html_list[l].element.search(attribute_list[2].attr) + 5,
				value: "",
			});
		}
		if (html_list[l].element.search(attribute_list[3].attr) != -1) {
			html_list[l].attributes.push({
				attribute: "href",
				start: html_list[l].element.search(attribute_list[3].attr),
				end: html_list[l].element.search(attribute_list[3].attr) + 4,
				value: "",
			});
		}
		html_list[l].attributes.sort(function (a, b) {
			return a.start - b.start;
		});
		for (var i = 0; i < html_list[l].attributes.length; i++) {
			if (i == 0 && html_list[l].attributes.length == 1) {
				html_list[l].attributes[i].value = html_list[l].element.substring(html_list[l].attributes[i].end + 2, html_list[l].element.length - 1);
			} else if (i != 0 && i == html_list[l].attributes.length - 1) {
				html_list[l].attributes[i].value = html_list[l].element.substring(html_list[l].attributes[i].end + 2, html_list[l].element.length - 1);
			} else {
				html_list[l].attributes[i].value = html_list[l].element.substring(html_list[l].attributes[i].end + 2, html_list[l].attributes[i + 1].start - 1);
			}
		}
		if (html_list[l].attributes.length > 0) {
			//console.log(html_list[l].element.substring(html_list[l].attributes[0].start, html_list[l].element.length));
			html_list[l].element = html_list[l].element.replace(html_list[l].element.substring(html_list[l].attributes[0].start, html_list[l].element.length), "");
		}
	}
	for (var i = 0; i < html_list.length; i++) {
		if (html_list[i].attributes.length > 0) {
			for (var j = 0; j < html_list[i].attributes.length; j++) {
				console.log(html_list[i].element + " ; " + html_list[i].attributes[j].value);
				parse_html.push({
					tag: html_list[i].tag,
					element: html_list[i].element,
					ele_start: html_list[i].start,
					ele_end: html_list[i].end,
					level: html_list[i].level,
					content: html_list[i].content,
					attribute: html_list[i].attributes[j].attribute,
					att_start: html_list[i].attributes[j].start,
					att_end: html_list[i].attributes[j].end,
					value: html_list[i].attributes[j].value,
				});
			}
		} else {
			console.log(html_list[i].element + " ; " + "N/A");
			parse_html.push({
				tag: html_list[i].tag,
				element: html_list[i].element,
				ele_start: html_list[i].start,
				ele_end: html_list[i].end,
				level: html_list[i].level,
				content: html_list[i].content,
				attribute: "N/A",
				att_start: 0,
				att_end: 0,
				value: "N/A",
			});
		}
	}
	text_output.textContent = JSON.stringify(parse_html);
	console.table(char_list);
	console.table(html_list);
	console.table(parse_html);
}

/*
Testing Purposes:

<html style="color:red;">
	<p id="value1">Eric</p>
	<p class="value2" id="value3">Poitras</p>
	<p class="value4" id="value5" style="color:blue;">Poitras</p>
</html>
*/
