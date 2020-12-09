import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// Shortcut for creating react components which consist of only return
function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  // Funciton for rendering Square component
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  // This function renders html content
  render() {
    return (
      <div>
        <div className="status">{this.props.status}</div>
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
  // Constructor is used to set a default state
  constructor(props) {
    super(props);

    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  // Function which moves game to selected stepNumber
  jumpTo(stepNumber) {
    this.setState({
      stepNumber: stepNumber,
      xIsNext: stepNumber % 2 === 0,
      // It switches this.state.history to selected length
      history: this.state.history.slice(0, stepNumber + 1),
    });
  }

  // It's a method which handles clicking on a square
  handleClick(i) {
    // Get history of correct length
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    // Get last history entry
    const current = history[history.length - 1];

    const squares = current.squares.slice();

    // Check if the game is already finished. If it is end method
    if (calculateWinner(squares) || squares[i]) return;
    // Updates board with new X or Y
    squares[i] = this.state.xIsNext ? "X" : "O";

    this.setState({
      // Merges new entry to history
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      // Increments stepNumber
      stepNumber: this.state.stepNumber + 1,
      // Changes current player
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    // Creates list of moves
    const moves = history.map((_step, move) => {
      // Creates short description of each move
      const desc = move ? "Go to move #" + move : "Go to game start";

      return (
        // Moves are ordered by move number
        <li key={move}>
          {" "}
          {/* Each move has a button with jumpTo function */}
          <button onClick={() => this.jumpTo(move)}>{desc}</button>{" "}
        </li>
      );
    });

    let status;

    // It sets status
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          {/* Renders Board */}
          <Board
            squares={current.squares}
            status={status}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          {/* Renders list of moves */}
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

// Renders the whole page
ReactDOM.render(<Game />, document.getElementById("root"));

// It's function that checks if the game is already finished. It receives current board state
function calculateWinner(squares) {
  // List of winning combinations
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Loop for checking all winning possibilities. If the game is ended returns X or Y
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return squares[a];
  }
  // If the game isn't already ended returns null
  return null;
}
