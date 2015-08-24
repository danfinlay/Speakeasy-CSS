(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Config needs to be available:
var listenerMap = {
  'dragenter': dragEntered,
  'dragend': dropped,
  'drop': dropped,
  'click': clicked,
};

// Global variables:
var selected, dragTarget, dragSubjectType;

// Setup workspace:
var workspace = document.querySelector('.workspace');
newDragTarget(workspace);

var elements = document.querySelectorAll('html>body>nav>ul>li');
[].forEach.call(elements, function(el) {
  el.addEventListener('dragstart', handleDragStart, false);
  el.addEventListener('drop', dropped);
});

var nondraggables = document.querySelectorAll('html>body>nav, .feedback');
for(var i = 0; i < nondraggables.length; i++){
  nondraggables[i].addEventListener('dragenter', function(ev){
    if (ev.target === dragTarget) return;
    removeHover();
});
}

function handleDragStart(ev) {
  ev.dataTransfer.effectAllowed = "copy";
  dragSubjectType = ev.target.innerText;
}

function newDragTarget (el) {
  registerListenersFor(el);
  selected = el;
}

function registerListenersFor(el) {
 // el.addEventListener('dragenter', dragEntered);
  for (var key in listenerMap) {
    el.addEventListener(key, listenerMap[key]);
  }
}
function unregisterListenersFor(el) {
  for (var key in listenerMap) {
    el.removeEventListener(key, listenerMap[key]);
  }
}

function dragEntered(ev) {
  dragTarget = ev.target;
  hoverOver(dragTarget);
}

function dragLeft(ev){
  removeHover();
}

function dropped(ev) {
  if (ev.target !== dragTarget) return removeHover();
  var newEl = document.createElement(dragSubjectType);
  dragTarget.appendChild(newEl);
  newDragTarget(newEl);
  removeHover();
  newSelection(newEl);
  registerListenersFor(newEl);
  updateCodePreview();
}

function updateCodePreview(){
  var code = document.querySelector('.workspace').innerHTML;
  var formatted = code.split('><').join('>\n<');
  var codeEl = document.querySelector('.code');
  codeEl.innerText = formatted;
}

function removeHover(){
  if (!dragTarget) return;
  dragTarget = null;
  var oldHovered = document.querySelectorAll(".x-hovered-over");
  for (var i = 0; i < oldHovered.length; i++) { 
    oldHovered[i].classList.remove('x-hovered-over');
  }
}

function hoverOver(el) {
  removeHover();
  dragTarget = el;
  el.classList.add('x-hovered-over');
}

function clicked(ev) {
  newSelection(ev.target);
  updateCodePreview();
}

function newSelection(el) {
  removeOldSelections();
  el.classList.add('x-selected-element');
}

function removeOldSelections(){
  var olds = document.querySelectorAll('.x-selected-element');
  for (var i = 0; i < olds.length; i++) {
    olds[i].classList.remove('x-selected-element');
  }
}

window.initAnnyang = initAnnyang;
initAnnyang();
function initAnnyang(){
  if (annyang) {
	  // Let's define our first command. First the text we expect, and then the function it should call
	  var commands = {
	    'style *term': function(term) {
               var parsed;
               // Sometimes already is CSS:
               if (term.match(/.\:./)){
                 var parts = term.split(':');
                 parsed = {
                   key: parts[0], value: parts[1],
                 };
               } else {
		 var parsed = parseCSSTerm(term);
		 console.log("Setting %s to %s", parsed.key,parsed.value);
               }
               if (selected) {
		 selected.style[parsed.key] = parsed.value;
		 updateCodePreview();
	       }
	    },
            'set text *term': function (term) {
              if (selected) {
                selected.innerText = term;
                updateCodePreview();
              }
            },
	  };
	

	  // Add our commands to annyang
	  annyang.addCommands(commands);
	  annyang.start();
	
	  // Start listening. You can call this here, or attach this call to an event, button, etc.
  } else {
	alert("Annyang not loaded");
  }
}

var validSuffixes = ['pixels', 'percent'];
var vendorPrefixes = ['moz', 'webkit'];
var suffixMap = {
  'pixels': 'px',
  'percent': '%',
};
var commonMistakes = {
  'with':'width',
  'heights':'height',
  'heist':'height',
  'pixel':'pixels',
};

function parseCSSTerm (term) {
  var words = cleanse(term.split(' '));
  var key = '', value;
  
  // Two word value
  if (validSuffixes.indexOf(words[words.length - 1]) !== -1) {
    var suffix = words.pop();
    value = words.pop() + suffixMap[suffix];
    
  // One word value
  } else {
    value = words.pop();
  }
  
  // Vendor prefixed:
  if (vendorPrefixes.indexOf(words[0]) !== -1) {
    key = '-';
  }
  key += words.join('-');
  
  return {
    key: key,
    value: value,
  };
}
function cleanse(words) {
  words.forEach(function(word, i){
  for (var key in commonMistakes) {
    if (key === word) {
      console.log("Correcting %s to %s", word, key);
      words[i] = key;
    }
  }
  });
  return words;
}


},{}]},{},[1]);
