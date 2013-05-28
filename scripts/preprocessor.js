// creates Shower slides from generic document markup by adjusting the DOM
//
// expected input is a simple sequence of content elements, with each slide
// being introduced and defined by an HR element with arbitrary attributes:
//
//     <hr id=intro class="slide cover">
//     <h1>Hello World</h1>
//     <ul>
//         <li>foo
//         <li>bar
//         <li>baz
//     </ul>
//
//     <hr class=slide>
//     <h1>Lipsum<h1>
//     <p>lorem ipsum dolor sit amet</p>
//
// Note: If the HR element is followed immediately by an H1 element, the "slide"
// class may be omitted.
//
// TODO:
// * handle document title and Shower caption (generating the former from the latter)
// * turn into Node module for static preprocessing
// * remove jQuery dependency

/*jslint vars: true, browser: true, white: true */
/*global jQuery */

(function($) {

"use strict";

// determine slides
var node = document.body.firstChild;
var nodes, next;
while(node) {
	var el = $(node);
	next = node.nextSibling;

	if(!next || el.hasClass("progress")) { // last slide -- XXX: bad cue?
		wrap(nodes);
		break;
	} else if(el.is("hr.slide") ||
			(el.is("hr") && el.next().is("h1"))) { // new slide
		el.addClass("slide");
		if(nodes) {
			wrap(nodes);
		}
		nodes = [node];
	} else if(nodes) {
		if(node.nodeName.toUpperCase() !== "SCRIPT") { // avoid re-evaluation
			nodes.push(node);
		}
	}

	node = next;
}

// set slide attributes
$(".slide:not(hr)").each(function(i, node) {
	var hr = $("hr.slide:first-child", node);
	if(hr.length) {
		hr.remove();
		transferAttribs(hr[0], node);
	}
	// ensure ID is present
	if(!node.id) {
		node.id = "slide" + (i + 1);
	}
});

// process non-slide directives -- TODO: document
$("hr.pragma").each(function(i, node) {
	var el = $(node);
	var target = el.next();
	el.removeClass("pragma").remove();
	transferAttribs(node, target[0]);
});

// adjust headings
$(".slide").find("h1, h2, h3, h4, h5, h6").wrap("<header />");

// adjust code blocks, wrapping each line in CODE tags -- XXX: theme-specific!?
$(".slide pre:not(:has(code))").each(function(i, node) { // XXX: this doesn't work for Markdown, as that wraps entire code blocks in both PRE and CODE
	var el = $(node);
	var lines = el.html().replace(/^\s+|\s+$/g, "").
			replace(/\r\n|\r/g, "\n").split("\n");
	el.html("<code>" + lines.join("</code>\n<code>") + "</code>");
	el.find("code:empty").html("&nbsp;");
});

// injects container elements for the given set of DOM elements
function wrap(nodes) {
	var slide = $("<section />").insertBefore(nodes[0]).append(nodes);
	slide = slide.wrap("<div />").wrap("<div />").parent().parent(); // XXX: theme-specific!?
	slide.addClass("slide");
}

// copies all attributes from source to target element
function transferAttribs(source, target) {
	var attribs = source.attributes;
	var i;
	for(i = 0; i < attribs.length; i++) {
		var attr = attribs[i];
		target.setAttribute(attr.name, attr.value);
	}
}

}(jQuery));
