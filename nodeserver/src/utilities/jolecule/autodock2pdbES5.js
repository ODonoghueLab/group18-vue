#!/usr/bin/env node
'use strict';

var doc = '\nmap_autodock.py [-u UPPER] [-s SKIP] main.pdb\n\n- main.pdb  looks for autodock files for \'main.pdb\' \n            (Ne, Ar, He, Rn, Xe, Kr) i.e.:\n              - \'main.Ar.map\'\n              - \'main.Kr.map\'\n              - \'main.Xe.map\'\n- UPPER     upper cut-off of autodock grid-points (-0.5 is a good one)  \n- SKIP      skips grids (1 - no skip, 2 shows every 2nd grid point, \n            3 shows every 3rd)\n';

var fs = require('fs-extra');
var nopt = require('nopt');
var _ = require('lodash');

function convertMapToFakeWatersPdb(autodockGrid, fakeWatersPdb) {
  var upperCutoff = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
  var element = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "Xe";
  var skip = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
  var output = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "";


  var isCoord = false;
  var vals = [];
  var nX = void 0,
      nY = void 0,
      nZ = void 0;
  var spacing = void 0;
  var center = void 0;
  var dim = void 0;

  console.log("Autodock:", autodockGrid);
  var text = fs.readFileSync(autodockGrid, 'utf8');
  var lines = text.split(/\r?\n/);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = lines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var line = _step.value;

      if (!isCoord) {
        var words = line.split(' ');
        if (words[0] == "SPACING") {
          spacing = parseFloat(words[1]);
          //console.log("Grid-spacing:", spacing);
        } else if (words[0] == "NELEMENTS") {
          dim = _.map(words.slice(1, words.length), _.parseInt);
          //console.log("Grid-dim:", dim);
          nX = dim[0] + 1;
          nY = dim[1] + 1;
          nZ = dim[2] + 1;
          //console.log("Grid-points:", nX * nY * nZ);
        } else if (words[0] == "CENTER") {
          center = _.map(words.slice(1, words.length), parseFloat);
          //console.log("Grid-center:", center);
          isCoord = true;
        }
      } else {
        vals.push(parseFloat(line));
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  //fs.writeFileSync('out.txt', JSON.stringify(vals, null, 2));

  var minV = _.min(vals);
  var maxV = _.max(vals);
  //console.log('E-limits: [' + minV + ', ' + maxV + ']');

  //console.log('Output-pdb: ' + output + "/"+fakeWatersPdb);

  var wstream = fs.createWriteStream(output + "/"+ fakeWatersPdb);
  var iAtom = 0;
  for (var iVal = 0; iVal < vals.length; iVal += 1) {
    var val = vals[iVal];
    if (val > upperCutoff) {
      continue;
    }
    var iX = iVal % nX;
    var iY = (iVal - iX) / nX % nY;
    var iZ = (iVal - iX - iY * nX) / nX / nY;
    if (iX % skip > 0 || iY % skip > 0 || iZ % skip > 0) {
      continue;
    }

    var x = (iX - nX / 2) * spacing + center[0];
    var y = (iY - nY / 2) * spacing + center[1];
    var z = (iZ - nZ / 2) * spacing + center[2];

    var s = "";
    s += "HETATM";
    s += _.padStart(iAtom.toString(), 5, ' ');
    s += " ";
    s += _.padEnd(element, 3, ' ');
    s += "  ";
    s += "XXX";
    s += " ";
    s += _.padStart(iAtom.toString(), 5, ' ');
    s += " ";
    s += "   ";
    s += _.padStart(x.toFixed(3), 8, ' ');
    s += _.padStart(y.toFixed(3), 8, ' ');
    s += _.padStart(z.toFixed(3), 8, ' ');
    s += _.padStart("1.00", 6, ' ');
    s += _.padStart((-val).toFixed(2), 6, ' ');
    s += "          ";
    s += element;

    wstream.write(s + '\n');

    iAtom += 1;
  }
  wstream.end();

  //console.log('N: ' + iAtom + ' (E < ' + upperCutoff + ')');
}

function isFile(f) {
  try {
    return fs.lstatSync(f).isFile() || fs.lstatSync(f).isSymbolicLink();
  } catch (e) {
    return false;
  }
}

var knownOpts = {
  "upper": [Number, null],
  "skip": [Number, null],
  "output": [String,null],
  "element": [String,null]
};
var shortHands = {
  "u": ["--upper"],
  "s": ["--skip"],
  "o": ["--output"],
  "e": ["--element"]
};
var parsed = nopt(knownOpts, shortHands, process.argv, 2);
var remain = parsed.argv.remain;

if (remain.length < 1) {
  console.log(doc);
} else {
  var pdb = remain[0];
  pdb = pdb.replace('.pdb', '');
  var elements = ['Ar', 'Kr', 'Xe', 'He', 'Ne'];
  if (parsed.element){
    elements = [parsed.element];
  }
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = elements[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var element = _step2.value;

      var autodockMap = pdb + '.' + element + '.map';
      if (isFile(autodockMap)) {
        convertMapToFakeWatersPdb(autodockMap, pdb + '.' + element + '.pdb', parsed.upper,  element,  parsed.skip, parsed.output);
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }
}
