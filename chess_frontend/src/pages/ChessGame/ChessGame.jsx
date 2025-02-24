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
  let sampleMoves = {
     // https://www.chess.com/game/live/106129187351
    "moves": [
      "Naxb8=N#", "Naxb8=N#",
      "d4",     "d5",
      "Bf4",    "Nf6",
      "e3",     "g6",
      "Nf3",    "Bg7",
      "Bd3",    "O-O",
      "O-O",    "Bf5",
      "c3",     "Nbd7",
      "Nh4",    "Bg4",
      "f3",     "Bf5",
      "Nxf5",   "gxf5",
      "Bxf5",   "c6",
      "Nd2",    "b6",
      "e4",     "e6",
      "Bg4",    "dxe4",
      "fxe4",   "c5",
      "Be2",    "cxd4",
      "cxd4",   "Rb8",
      "Bxb8",   "Qxb8",
      "Bd3",    "h5",
      "e5",     "Ng4",
      "h3",     "Ne3",
      "Qxh5",   "Nf5",
      "Rxf5",   "exf5",
      "Bxf5",   "f6",
      "Be6+",   "Rf7",
      "Qxf7+",  "Kh7",
      "Bf5+",   "Kh6",
      "Qg6#"
    ]
  }

  let [boardState, setBoardState] = useState(initialBoardDesign);
  let [heldPiece, setHeldPiece] = useState(null);
  // let [moves, setMoves] = useState(sampleMoves["moves"]);
  let [moves, setMoves] = useState([]);


  let checkForChecks = () => {
    return false;
  }
  let checkForCheckMate = () => {
    return false;
  }
  let calcNotation = (
    toRankIndex, toFileIndex, heldPiece, boardState, newBoardState,
    promotionTo="", shortCastle=false, longCastle=false, enPassant=false
  ) => {
    let notation      = "";
    let piece         = heldPiece.piece.charAt(1);
    let color         = heldPiece.piece.charAt(0);
    let fromFile      = String.fromCharCode(97 + heldPiece.heldFromFileIndex); // Convert 0-7 to "a-h"
    let fromRank      = (8 - parseInt(heldPiece.heldFromRankIndex)).toString();
    let toFile        = String.fromCharCode(97 + toFileIndex); // Convert 0-7 to "a-h"
    let toRank        = (8 - toRankIndex).toString();
    let fromFileIndex = heldPiece.heldFromFileIndex;
    let fromRankIndex = heldPiece.heldFromRankIndex;

    // return empty string if piece is moved to same square
    if(toFile === fromFile && parseInt(toRank) === parseInt(fromRank)) {
      return "";  
    }

    // castling move
    if(longCastle) {
      notation = "O-O-O";
    }
    else if(shortCastle) {
      notation = "O-O";
    }
    
    // normal move
    else {

      // append piece
      if(piece !== "p") {
        notation += piece.toUpperCase()
      }

      // append file if enPassant
      if(enPassant) {
        notation += fromFile;
      }

      // append "x" if capture
      if(boardState[toRankIndex][toFileIndex] !== "  ") {
        // also append the fromFile if pawn captures
        if(piece === "p") {
          notation += fromFile;
        }
        notation += "x";
      }

      // append destination square
      notation += toFile;
      notation += toRank;

      // append "=promotionTo" if promotion
      if(promotionTo !== "") {
        notation += "=";
        notation += promotionTo;
      }
    }

    /*
      check for checkmate, if yes append "#"
      if not checkmate,
      check for check, if yes append "+"
    */
    if(checkForCheckMate()) {
      notation += "#"
    } else if(checkForChecks()) {
      notation += "+"
    }

    return notation;
  }
  let isValidMove = (toRankIndex, toFileIndex, heldPiece, boardState, newBoardState) => {
    let piece         = heldPiece.piece.charAt(1);
    let color         = heldPiece.piece.charAt(0);
    let fromFile      = String.fromCharCode(97 + heldPiece.heldFromFileIndex); // Convert 0-7 to "a-h"
    let fromRank      = (8 - parseInt(heldPiece.heldFromRankIndex)).toString();
    let toFile        = String.fromCharCode(97 + toFileIndex); // Convert 0-7 to "a-h"
    let toRank        = (8 - toRankIndex).toString();
    let fromFileIndex = heldPiece.heldFromFileIndex;
    let fromRankIndex = heldPiece.heldFromRankIndex;

    if(toRankIndex < 0 || toRankIndex > 7 || toFileIndex < 0 || toFileIndex > 7) {
      return false;
    }

    // white pawn moves
    if(piece === "p" && color === "w") {
      if(
        // normal move
        ( 
          toRankIndex === fromRankIndex-1 &&
          toFileIndex === fromFileIndex &&
          boardState[toRankIndex][toFileIndex] === "  "
        ) ||
        (fromRankIndex === 6 && toRankIndex === 4)
      ) return true;
      else if(
        // capture move
        (
          (toRankIndex+1 === fromRankIndex && toFileIndex+1 === fromFileIndex) ||
          (toRankIndex+1 === fromRankIndex && toFileIndex-1 === fromFileIndex)
        ) &&
        (boardState[toRankIndex][toFileIndex] !== "  ") &&
        (boardState[toRankIndex][toFileIndex].charAt(0) !== color)
      ) return true;
    }

    // black pawn moves
    else if(piece === "p" && color === "b") {
      if(
        // normal move
        ( 
          toRankIndex === fromRankIndex+1 &&
          toFileIndex === fromFileIndex &&
          boardState[toRankIndex][toFileIndex] === "  "
        ) ||
        (fromRankIndex === 1 && toRankIndex === 3)
      ) return true;
      else if(
        // capture move
        (
          (toRankIndex-1 === fromRankIndex && toFileIndex+1 === fromFileIndex) ||
          (toRankIndex-1 === fromRankIndex && toFileIndex-1 === fromFileIndex)
        ) &&
        (boardState[toRankIndex][toFileIndex] !== "  ") &&
        (boardState[toRankIndex][toFileIndex].charAt(0) !== color)
      ) return true;
    }

    // white bishop (oont)
    else if(piece === "b" && color === "w") {

    }
    return false;
  }


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

      // if valid move, move the piece and clear previous cell
      if(isValidMove(rankIndex, fileIndex, heldPiece, boardState, newBoardState,)) {
        newBoardState[heldPiece.heldFromRankIndex][heldPiece.heldFromFileIndex] = "  ";
        newBoardState[rankIndex][fileIndex] = heldPiece.piece

        // calculate and set move notation
        /*
          TODO: Add logic for following:
          shortCastle
          longCastle
          enPassant
        */
        let promotionTo = "";
        let shortCastle = false;
        let longCastle  = false;
        let enPassant   = false;
        let notation = calcNotation(
          rankIndex, fileIndex, heldPiece, boardState, newBoardState,
          promotionTo, shortCastle, longCastle, enPassant
        );
        if(notation !== "") {
          // console.log(notation);
          let newMoves = [...moves]
          newMoves.push(notation)
          setMoves(newMoves);
        }

        // save this state
        setBoardState(newBoardState)
        setHeldPiece(null)
      }
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
      <h1>Moves</h1>
      {moves.map((move, index) => (
        <div className="moves" key={index}>

          {/* if last move and no pairing, show it in separate row */}
          {index === moves.length-1 && index%2 === 0 && (
            <p className="move">
              <span className="move-number"  >{(index+2)/2}</span>
              <span className="move-content move-by-white">{move}</span>
              <span className="move-content move-by-black"></span>
            </p>
          )}

          {/* regular pairing (white and black move) for even indices */}
          {index % 2 === 0 && index+1 < moves.length && (
            <p className="move">
              <span className="move-number"  >{(index+2)/2}</span>
              <span className="move-content move-by-white">{move}</span>
              <span className="move-content move-by-black">{moves[index + 1]}</span>
            </p>
          )}
        </div>
      ))}

    </div>



  </div>
  )
}

export default ChessGame
