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

  let pieces = {
    // white pieces
    wp: wpImage, wn: wnImage, wr: wrImage, wb: wbImage, wq: wqImage, wk: wkImage,
    // black pieces
    bp: bpImage, bn: bnImage, bb: bbImage, br: brImage, bq: bqImage, bk: bkImage,
  }

  let [boardState, setBoardState] = useState([
    ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
    ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
    ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"],
  ])

  let [heldPiece, setHeldPiece] = useState(null)

  let holdThisPiece = (rowIndex, colIndex, piece) => {
    if(piece != "  ") {
        setHeldPiece({
            "piece": piece,
            "heldFromRowIndex": rowIndex,
            "heldFromColIndex": colIndex,
        })
    }
  }

  let allowDrop = (e) => {
    e.preventDefault();
  }

  let dropThisPiece = (rowIndex, colIndex) => {
    if(heldPiece) {
        // copy existing board state
        let newBoardState = boardState.map(row => [...row]) // deep copy

        // move the piece and clear previous cell
        newBoardState[heldPiece.heldFromRowIndex][heldPiece.heldFromColIndex] = "  ";
        newBoardState[rowIndex][colIndex] = heldPiece.piece

        // save this state
        setBoardState(newBoardState)
        setHeldPiece(null)
    }
  }

  return (
  <div>

    
    <div className="chess-board">
        {boardState.map((row, rowIndex) => (
            <div className="chess-board-row" key={rowIndex}>
                {row.map((cell, colIndex) => {
                    let isDarkCell = (rowIndex+colIndex) % 2 === 1;
                    return (
                        <div
                            key={colIndex}
                            className={`chess-board-cell ${isDarkCell ?"dark-cell" :"bright-cell"}`}
                            onDragOver={allowDrop}
                            onDrop={() => dropThisPiece(rowIndex, colIndex)}
                        >
                            {cell !== "  " && <img
                                className="chess-board-piece"
                                src={pieces[cell]}
                                draggable
                                onDragStart={() => holdThisPiece(rowIndex, colIndex, cell)}
                            />}
                        </div>
                    )
                })}
            </div>
        ))}

    </div>

  </div>
  )
}

export default ChessGame
