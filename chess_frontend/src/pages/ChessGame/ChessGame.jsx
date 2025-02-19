// white pieces
import wpImage from "../../assets/wp.png"
import wnImage from "../../assets/wn.png"
import wrImage from "../../assets/wr.png"
import wbImage from "../../assets/wb.png"
import wqImage from "../../assets/wq.png"
import wkImage from "../../assets/wk.png"
// black pieces
import bpImage from "../../assets/bp.png"
import bnImage from "../../assets/bn.png"
import bbImage from "../../assets/bb.png"
import brImage from "../../assets/br.png"
import bqImage from "../../assets/bq.png"
import bkImage from "../../assets/bk.png"

import "../ChessGame/ChessGame.css"
import { useState } from "react"

const ChessGame = () => {

    
  let initialBoardDesign = [
    /*
        NOMENCLATURE I USED:
        piece consists of two letters: color + pieceNotation
        color:
            b = black
            w = white
        pieceNotation:
            k = king   (raja)
            q = queen  (rani)
            r = rook   (hathi)
            n = knight (ghoda)
            b = bishop (oont)
            p = pawn   (pyada)
        for eg:
            "bp" = black pawn
            "wn" = white knight
            "  " = empty cell
    */
    ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
    ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
    ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"],
  ]
  let pieceImages = {
    "wp": wpImage, "wn": wnImage, "wr": wrImage, "wb": wbImage, "wq": wqImage, "wk": wkImage, // white pieces
    "bp": bpImage, "bn": bnImage, "bb": bbImage, "br": brImage, "bq": bqImage, "bk": bkImage, // black pieces
  }
  // https://www.chess.com/game/live/106129187351
  let demoMoves;

  let [boardState, setBoardState] = useState(initialBoardDesign);
  let [heldPiece, setHeldPiece] = useState(null);
  let [moves, setMoves] = useState([]);

  let holdThisPiece = (rankIndex, fileIndex, piece) => {
    if(piece != "  ") {
        setHeldPiece({
            "piece": piece,
            "heldFromRankIndex": rankIndex,
            "heldFromFileIndex": fileIndex,
        })
    }
  }
  let allowDrop = (e) => {
    e.preventDefault();
  }
  let dropThisPiece = (rankIndex, fileIndex) => {
    if(heldPiece) {
        // copy existing board state
        let newBoardState = boardState.map(rank => [...rank]) // deep copy

        // move the piece and clear previous cell
        newBoardState[heldPiece.heldFromRankIndex][heldPiece.heldFromFileIndex] = "  ";
        newBoardState[rankIndex][fileIndex] = heldPiece.piece

        // save this state
        setBoardState(newBoardState)
        setHeldPiece(null)
    }
  }

  return (
  <div className="chess-game" >

    
    <div className="chess-board">
        {boardState.map((rank, rankIndex) => (
            <div className="chess-board-rank" key={rankIndex}>
                {rank.map((cell, fileIndex) => {
                    let isDarkCell = (rankIndex+fileIndex) % 2 === 1;
                    return (
                        <div
                            key={fileIndex}
                            className={`chess-board-cell ${isDarkCell ?"dark-cell" :"bright-cell"}`}
                            onDragOver={allowDrop}
                            onDrop={() => dropThisPiece(rankIndex, fileIndex)}
                        >
                            {cell !== "  " && <img
                                className="chess-board-piece"
                                src={pieceImages[cell]}
                                draggable
                                onDragStart={() => holdThisPiece(rankIndex, fileIndex, cell)}
                            />}
                        </div>
                    )
                })}
            </div>
        ))}

    </div>

    <div className="moves-container">
    </div>

  </div>
  )
}

export default ChessGame
