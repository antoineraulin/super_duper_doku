(function (global) {
  "use strict";

  // Helper utilities
  var util = {
    extend: function (src, props) {
      props = props || {};
      var p;
      for (p in src) {
        if (!props.hasOwnProperty(p)) {
          props[p] = src[p];
        }
      }
      return props;
    },
    each: function (a, b, c) {
      if ("[object Object]" === Object.prototype.toString.call(a)) {
        for (var d in a) {
          if (Object.prototype.hasOwnProperty.call(a, d)) {
            b.call(c, d, a[d], a);
          }
        }
      } else {
        for (var e = 0, f = a.length; e < f; e++) {
          b.call(c, e, a[e], a);
        }
      }
    },
    isNumber: function (n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    },
    includes: function (a, b) {
      return a.indexOf(b) > -1;
    },
  };

  var defaultConfig = {
    validate_on_insert: false,
    difficulty: "normal",
  };

  function Game(config) {
    this.config = config;

    // Initialize game parameters
    this.cellMatrix = {};
    this.matrix = {};

    this.values = [];

    return this;
  }

  Game.prototype = {
    /**
     * Build the game GUI
     * @returns {HTMLTableElement} Table containing 9x9 input matrix
     */
    buildGUI: function (json) {
      var td, tr;

      this.table = document.createElement("table");
      this.table.classList.add("sudoku-container");

      for (var i = 0; i < 9; i++) {
        tr = document.createElement("tr");
        this.cellMatrix[i] = {};

        for (var j = 0; j < 9; j++) {
          // Build the input
          this.cellMatrix[i][j] = document.createElement("input");
          this.cellMatrix[i][j].maxLength = 1;
          if (json[i][j] != 0) {
            this.cellMatrix[i][j].value = json[i][j];
            this.cellMatrix[i][j].disabled = true;
            // add attribute tabindex=-1 to disable tabbing
            this.cellMatrix[i][j].setAttribute("tabindex", -1);
            // class disabled
            this.cellMatrix[i][j].classList.add("disabled");
            // add data-ms-editor attribute to true
            this.cellMatrix[i][j].setAttribute("data-ms-editor", "true");
          }

          // Using dataset returns strings which means messing around parsing them later
          // Set custom properties instead
          this.cellMatrix[i][j].row = i;
          this.cellMatrix[i][j].col = j;

          td = document.createElement("td");

          td.appendChild(this.cellMatrix[i][j]);

          // Calculate section ID
          var sectIDi = Math.floor(i / 3);
          var sectIDj = Math.floor(j / 3);
          // Set the design for different sections
          if ((sectIDi + sectIDj) % 2 === 0) {
            td.classList.add("sudoku-section-one");
          } else {
            td.classList.add("sudoku-section-two");
          }
          // Build the row
          tr.appendChild(td);
        }
        // Append to table
        this.table.appendChild(tr);
      }

      // Return the GUI table
      return this.table;
    },
  };

  var Sudoku = function (container, settings) {
    this.container = container;

    if (typeof container === "string") {
      this.container = document.querySelector(container);
    }

    this.game = new Game(util.extend(defaultConfig, settings));
  };

  Sudoku.prototype = {
    getGameBoard: async function () {
      var raw = await fetch(url);
      var json = await raw.json();
      return this.game.buildGUI(json);
    },

    newGame: function () {
      var that = this;
      this.reset();

      setTimeout(function () {
        that.start();
      }, 20);
    },
  };

  global.Sudoku = Sudoku;
})(this);

var game = new Sudoku(".container");

async function main() {
  var grid = await game.getGameBoard();
  game.container.appendChild(grid);
}
main();

function tableToArray(table) {
  if (typeof table === "string") {
    table = document.querySelector(table);
  }
  // for each row
  var rows = Array.from(table.querySelectorAll("tr"));
  var array = [];
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var cells = Array.from(row.querySelectorAll("td"));
    var rowArray = [];
    for (var j = 0; j < cells.length; j++) {
      var cell = cells[j];
      var input = cell.querySelector("input");
      rowArray.push(parseInt(input.value === "" ? 0 : input.value));
    }
    array.push(rowArray);
  }
  return array;
}

async function sendToBackend() {
  // J'ai tout cassé, hehe
  alert("C'est cassé ! :(");
  // ! qui à fait ça ?
}
