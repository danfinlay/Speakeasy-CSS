# Speakeasy CSS

A simple web tool for exploring the world of editing web sites with your voice and hands, not so much with the code necessarily.

[Live Demo](http://flyswatter.github.io/Speakeasy-CSS/public/)

## Usage

Allow the browser to access your microphone.
Drag elements from the left into the workspace on the right.
While those elements are selected, use your voice to edit them!

### Commands
#### Style
Edits the CSS styles of the element

Example:
`style background color red` would set the `background-color` style to `red`.

#### Set text
Sets the text value of the element

Example:
`set text welcome to my site` would edit the element's text content to `welcome to my site`.

## Caveats

Lots of bugs!  Just an experiment, enjoy!

## Editing The Code

Have `node.js` and `browserify`, and maybe even `watchify` installed.

Edit the `client.js` file, and then run `npm run build` to build the javascript.

Simply serve the `/public` folder from a web server, and it should work entirely in the browser!

