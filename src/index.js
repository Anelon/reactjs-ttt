import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
var games = 0;
var x = "X";
var o = "O";
const lines = [
   [0, 1, 2],
   [3, 4, 5],
   [6, 7, 8],
   [0, 3, 6],
   [1, 4, 7],
   [2, 5, 8],
   [0, 4, 8],
   [2, 4, 6]
];

function Square(props) {
   return (
      <button className="square" id={props.value} onClick={props.onClick}>
         {props.value}
      </button>
   );
}

class Board extends React.Component {
   renderSquare(i) {
      return (
         <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
         />
      );
   }

   render() {
      return (
         <div>
            <div className="board-row">
               {this.renderSquare(0)}
               {this.renderSquare(1)}
               {this.renderSquare(2)}
            </div>
            <div className="board-row">
               {this.renderSquare(3)}
               {this.renderSquare(4)}
               {this.renderSquare(5)}
            </div>
            <div className="board-row">
               {this.renderSquare(6)}
               {this.renderSquare(7)}
               {this.renderSquare(8)}
            </div>
         </div>
      );
   }
}

class Game extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         history: [
            {
               squares: Array(9).fill(null)
            }
         ],
         stepNumber: 0,
         xIsNext: true
      };
   }

   handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
         return;
      }
      squares[i] = x;
      //adjust the set state
      this.setState({
         history: history.concat([
            {
               squares: squares
            }
         ]),
         stepNumber: history.length,
      });
      //run the ai after this 
      if(history.length === 1) {
         //alert(squares);
         if(squares[4] !== x) {
            squares[4] = o;
         } else {
            squares[0] = o;
         } 
      } else {
         squares[lookForWin(squares)] = o;
      }
      //adjust the set state
      this.setState({
         history: history.concat([
            {
               squares: squares
            }
         ]),
         stepNumber: history.length,
      });
   }

   jumpTo(step) {
      this.setState({
         stepNumber: step,
      });
   }

   render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
         const desc = move ?
            'Go to move #' + move :
            'Restart Game';
         return (
            <li key={move}>
               <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
         );
      });

      let status;
      if (winner) {
         status = "Winner: " + winner;
         if (winner === "Draw");//ask to restart
         if (++games > 5) status = "The only way to win is to stop playing";
      } else {
         status = "Next player: " + (this.state.xIsNext ? "Player" : "Computer");
      }

      return (
         <div className="game">
            <div className="game-board">
               <Board
                  squares={current.squares}
                  onClick={i => this.handleClick(i)}
               />
            </div>
            <div className="game-info">
               <div>{status}</div>
               <ol>{moves}</ol>
            </div>
         </div>
      );
   }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
   for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
         return squares[a];
      }
   }
   for (let i = 0; i < 9; i++) {
      //console.log(squares[i]);
      if(!squares[i]) return null;
   }
   return "Draw";
}

function lookForBlock(squares) {
   for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] === x) {
         if (squares[b] === x) {
            if (squares[c]) continue;
            return c;
         }
         if (squares[c] === x) {
            if (squares[b]) continue;
            return b;
         }
      }
      if (squares[b] === x && squares[c] === x) {
         if (squares[a]) continue;
         return a;
      }
   }
   //console.log("No Block");
   //check corners
   if (squares[1] === x && squares[3] === x)
      if (!squares[0]) return 0;
   if (squares[1] === x && squares[5] === x)
      if (!squares[2]) return 2;
   if (squares[7] === x && squares[5] === x)
      if (!squares[8]) return 8;
   if (squares[3] === x && squares[7] === x)
      if (!squares[6]) return 6;
   //console.log("No Corners");
   //edge test
   if ((squares[1] === x || squares[2] === x) &&
      (squares[7] === x || squares[8] === x)) 
      if(!squares[5]) return 5;
   if ((squares[1] === x || squares[0] === x) &&
      (squares[7] === x || squares[6] === x)) 
      if(!squares[3]) return 3;
   if ((squares[3] === x || squares[0] === x) &&
      (squares[5] === x || squares[2] === x)) 
      if(!squares[1]) return 1;
   if ((squares[6] === x || squares[3] === x) &&
      (squares[5] === x || squares[8] === x)) 
      if(!squares[7]) return 7;
   //console.log("No Edge");
   if (!squares[1]) return 1;
   if (!squares[3]) return 3;
   if (!squares[5]) return 5;
   if (!squares[7]) return 7;
   return null;
}

function lookForWin(squares) {
   for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] === o) {
         if (squares[b] === o) {
            if (squares[c]) continue;
            return c;
         }
         if (squares[c] === o) {
            if (squares[b]) continue;
            return b;
         }
      }
      if (squares[b] === o && squares[c] === o) {
         if (squares[a]) continue;
         return a;
      }
   }
   //console.log("Can't Win");
   return lookForBlock(squares);
}
