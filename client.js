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
console.log(elements);
[].forEach.call(elements, function(el) {
  el.addEventListener('dragstart', handleDragStart, false);
  el.addEventListener('drop', dropped);
});

/*
var nondraggables = document.querySelectorAll('html>body>nav, html>body>.feedback>.code');
[].forEach.call(nondraggables, function(el){
  el.addEventListener('dragleave', removeHover);
});
*/

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
  console.log("Dragged  entered "+ev.target);
  hoverOver(dragTarget);
}

function dragLeft(ev){
  console.log("Dragged  left "+ev.target);
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
  console.log("PARSING "+term);
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

