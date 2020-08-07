/*
 * @Author: qiaoxin
 * @Email: qiaoxinfc@gmail.com
 * @Date: 2020-08-06 10:08:12
 * @LastEditors: qiaoxin
 * @LastEditTime: 2020-08-07 17:08:01
 * @Description: svg 路径转换成three.js图形
 */
/* eslint-disable */ 
import * as THREE from 'three';

const DEGS_TO_RADS = Math.PI / 180,
  UNIT_SIZE = 1;

const DIGIT_0 = 48,
  DIGIT_9 = 57,
  COMMA = 44,
  SPACE = 32,
  PERIOD = 46,
  MINUS = 45;

export default function transformSVGPath(pathStr) {
  var paths = [];
  var path = new THREE.Shape();

  var idx = 1,
    len = pathStr.length,
    activeCmd,
    x = 0,
    y = 0,
    nx = 0,
    ny = 0,
    firstX = null,
    firstY = null,
    x1 = 0,
    x2 = 0,
    y1 = 0,
    y2 = 0,
    rx = 0,
    ry = 0,
    xar = 0,
    laf = 0,
    sf = 0,
    cx,
    cy;

  function eatNum() {
    var sidx,
      c,
      isFloat = false,
      s;
    // eat delims
    while (idx < len) {
      c = pathStr.charCodeAt(idx);
      if (c !== COMMA && c !== SPACE) break;
      idx++;
    }
    if (c === MINUS) sidx = idx++;
    else sidx = idx;
    // eat number
    while (idx < len) {
      c = pathStr.charCodeAt(idx);
      if (DIGIT_0 <= c && c <= DIGIT_9) {
        idx++;
        continue;
      } else if (c === PERIOD) {
        idx++;
        isFloat = true;
        continue;
      }

      s = pathStr.substring(sidx, idx);
      return isFloat ? parseFloat(s) : parseInt(s);
    }

    s = pathStr.substring(sidx);
    return isFloat ? parseFloat(s) : parseInt(s);
  }

  function nextIsNum() {
    var c;
    // do permanently eat any delims...
    while (idx < len) {
      c = pathStr.charCodeAt(idx);
      if (c !== COMMA && c !== SPACE) break;
      idx++;
    }
    c = pathStr.charCodeAt(idx);
    return c === MINUS || (DIGIT_0 <= c && c <= DIGIT_9);
  }

  var canRepeat;
  var enteredSub = false;
  var zSeen = false;
  activeCmd = pathStr[0];

  while (idx <= len) {
    canRepeat = true;
    switch (activeCmd) {
      // moveto commands, become lineto's if repeated
      case 'M':
        enteredSub = false;
        x = eatNum();
        y = eatNum();
        path.moveTo(x, y);
        activeCmd = 'L';
        break;
      case 'm':
        x += eatNum();
        y += eatNum();
        path.moveTo(x, y);
        activeCmd = 'l';
        break;
      case 'Z':
      case 'z':
        // z is a special case. This ends a segment and starts
        // a new path. Since the three.js path is continuous
        // we should start a new path here. This also draws a
        // line from the current location to the start location.
        canRepeat = false;
        if (x !== firstX || y !== firstY) path.lineTo(firstX, firstY);

        paths.push(path);

        // reset the elements
        firstX = null;
        firstY = null;

        // avoid x,y being set incorrectly
        enteredSub = true;

        path = new THREE.Shape();

        zSeen = true;

        break;
      // - lines!
      case 'L':
      case 'H':
      case 'V':
        nx = activeCmd === 'V' ? x : eatNum();
        ny = activeCmd === 'H' ? y : eatNum();
        path.lineTo(nx, ny);
        x = nx;
        y = ny;
        break;
      case 'l':
      case 'h':
      case 'v':
        nx = activeCmd === 'v' ? x : x + eatNum();
        ny = activeCmd === 'h' ? y : y + eatNum();
        path.lineTo(nx, ny);
        x = nx;
        y = ny;
        break;
      // - cubic bezier
      case 'C':
        x1 = eatNum();
        y1 = eatNum();
      case 'S':
        if (activeCmd === 'S') {
          x1 = 2 * x - x2;
          y1 = 2 * y - y2;
        }
        x2 = eatNum();
        y2 = eatNum();
        nx = eatNum();
        ny = eatNum();
        path.bezierCurveTo(x1, y1, x2, y2, nx, ny);
        x = nx;
        y = ny;
        break;
      case 'c':
        x1 = x + eatNum();
        y1 = y + eatNum();
      case 's':
        if (activeCmd === 's') {
          x1 = 2 * x - x2;
          y1 = 2 * y - y2;
        }
        x2 = x + eatNum();
        y2 = y + eatNum();
        nx = x + eatNum();
        ny = y + eatNum();
        path.bezierCurveTo(x1, y1, x2, y2, nx, ny);
        x = nx;
        y = ny;
        break;
      // - quadratic bezier
      case 'Q':
        x1 = eatNum();
        y1 = eatNum();
      case 'T':
        if (activeCmd === 'T') {
          x1 = 2 * x - x1;
          y1 = 2 * y - y1;
        }
        nx = eatNum();
        ny = eatNum();
        path.quadraticCurveTo(x1, y1, nx, ny);
        x = nx;
        y = ny;
        break;
      case 'q':
        x1 = x + eatNum();
        y1 = y + eatNum();
      case 't':
        if (activeCmd === 't') {
          x1 = 2 * x - x1;
          y1 = 2 * y - y1;
        }
        nx = x + eatNum();
        ny = y + eatNum();
        path.quadraticCurveTo(x1, y1, nx, ny);
        x = nx;
        y = ny;
        break;
      // - elliptical arc
      case 'A':
        rx = eatNum();
        ry = eatNum();
        xar = eatNum() * DEGS_TO_RADS;
        laf = eatNum();
        sf = eatNum();
        nx = eatNum();
        ny = eatNum();
        if (rx !== ry) {
          console.warn('Forcing elliptical arc to be a circular one :(', rx, ry);
        }
        // SVG implementation notes does all the math for us! woo!
        // http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
        // step1, using x1 as x1'
        x1 = (Math.cos(xar) * (x - nx)) / 2 + (Math.sin(xar) * (y - ny)) / 2;
        y1 = (-Math.sin(xar) * (x - nx)) / 2 + (Math.cos(xar) * (y - ny)) / 2;
        // step 2, using x2 as cx'
        var norm = Math.sqrt((rx * rx * ry * ry - rx * rx * y1 * y1 - ry * ry * x1 * x1) / (rx * rx * y1 * y1 + ry * ry * x1 * x1));
        if (laf === sf) norm = -norm;
        x2 = (norm * rx * y1) / ry;
        y2 = (norm * -ry * x1) / rx;
        // step 3
        cx = Math.cos(xar) * x2 - Math.sin(xar) * y2 + (x + nx) / 2;
        cy = Math.sin(xar) * x2 + Math.cos(xar) * y2 + (y + ny) / 2;

        var u = new THREE.Vector2(1, 0),
          v = new THREE.Vector2((x1 - x2) / rx, (y1 - y2) / ry);
        var startAng = Math.acos(u.dot(v) / u.length() / v.length());
        if (u.x * v.y - u.y * v.x < 0) startAng = -startAng;

        // we can reuse 'v' from start angle as our 'u' for delta angle
        u.x = (-x1 - x2) / rx;
        u.y = (-y1 - y2) / ry;

        var deltaAng = Math.acos(v.dot(u) / v.length() / u.length());
        // This normalization ends up making our curves fail to triangulate...
        if (v.x * u.y - v.y * u.x < 0) deltaAng = -deltaAng;
        if (!sf && deltaAng > 0) deltaAng -= Math.PI * 2;
        if (sf && deltaAng < 0) deltaAng += Math.PI * 2;

        path.absarc(cx, cy, rx, startAng, startAng + deltaAng, sf);
        x = nx;
        y = ny;
        break;

      case ' ':
        // if it's an empty space, just skip it, and see if we can find a real command
        break;

      default:
        throw new Error('weird path command: ' + activeCmd);
    }
    if (firstX === null && !enteredSub) {
      firstX = x;
      firstY = y;
    }

    // just reissue the command
    if (canRepeat && nextIsNum()) continue;
    activeCmd = pathStr[idx++];
  }

  if (zSeen) {
    return paths;
  } else {
    paths.push(path);
    return paths;
  }
}
