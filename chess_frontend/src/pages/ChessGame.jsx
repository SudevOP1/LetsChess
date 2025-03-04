// white pieces
import wpImage from "../assets/wp.png";
import wnImage from "../assets/wn.png";
import wrImage from "../assets/wr.png";
import wbImage from "../assets/wb.png";
import wqImage from "../assets/wq.png";
import wkImage from "../assets/wk.png";
// black pieces
import bpImage from "../assets/bp.png";
import bnImage from "../assets/bn.png";
import bbImage from "../assets/bb.png";
import brImage from "../assets/br.png";
import bqImage from "../assets/bq.png";
import bkImage from "../assets/bk.png";

import { useState } from "react";

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
  ];
  let pieceImages = {
    wp: wpImage,
    wn: wnImage,
    wr: wrImage,
    wb: wbImage,
    wq: wqImage,
    wk: wkImage, // white pieces
    bp: bpImage,
    bn: bnImage,
    bb: bbImage,
    br: brImage,
    bq: bqImage,
    bk: bkImage, // black pieces
  };
  let sampleMoves = {
    // https://www.chess.com/game/live/106129187351
    moves: [
      "Naxb8=N#",
      "Naxb8=N#",
      "d4",
      "d5",
      "Bf4",
      "Nf6",
      "e3",
      "g6",
      "Nf3",
      "Bg7",
      "Bd3",
      "O-O",
      "O-O",
      "Bf5",
      "c3",
      "Nbd7",
      "Nh4",
      "Bg4",
      "f3",
      "Bf5",
      "Nxf5",
      "gxf5",
      "Bxf5",
      "c6",
      "Nd2",
      "b6",
      "e4",
      "e6",
      "Bg4",
      "dxe4",
      "fxe4",
      "c5",
      "Be2",
      "cxd4",
      "cxd4",
      "Rb8",
      "Bxb8",
      "Qxb8",
      "Bd3",
      "h5",
      "e5",
      "Ng4",
      "h3",
      "Ne3",
      "Qxh5",
      "Nf5",
      "Rxf5",
      "exf5",
      "Bxf5",
      "f6",
      "Be6+",
      "Rf7",
      "Qxf7+",
      "Kh7",
      "Bf5+",
      "Kh6",
      "Qg6#",
    ],
  };

  let [boardState, setBoardState] = useState(initialBoardDesign);
  let [heldPiece, setHeldPiece] = useState(null);
  // let [moves, setMoves] = useState(sampleMoves["moves"]);
  let [moves, setMoves] = useState([]);

  let checkForChecks = () => {
    return false;
  };
  let checkForCheckMate = () => {
    return false;
  };
  let calcNotation = (
    toRankIndex,
    toFileIndex,
    heldPiece,
    boardState,
    newBoardState,
    promotionTo = "",
    shortCastle = false,
    longCastle = false,
    enPassant = false
  ) => {
    let notation = "";
    let piece = heldPiece.piece.charAt(1);
    let color = heldPiece.piece.charAt(0);
    let fromFile = String.fromCharCode(97 + heldPiece.heldFromFileIndex); // Convert 0-7 to "a-h"
    let fromRank = (8 - parseInt(heldPiece.heldFromRankIndex)).toString();
    let toFile = String.fromCharCode(97 + toFileIndex); // Convert 0-7 to "a-h"
    let toRank = (8 - toRankIndex).toString();
    let fromFileIndex = heldPiece.heldFromFileIndex;
    let fromRankIndex = heldPiece.heldFromRankIndex;

    // return empty string if piece is moved to same square
    if (toFile === fromFile && parseInt(toRank) === parseInt(fromRank)) {
      return "";
    }

    // castling move
    if (longCastle) {
      notation = "O-O-O";
    } else if (shortCastle) {
      notation = "O-O";
    }

    // normal move
    else {
      // append piece
      if (piece !== "p") {
        notation += piece.toUpperCase();
      }

      // append file if enPassant
      if (enPassant) {
        notation += fromFile;
      }

      // append "x" if capture
      if (boardState[toRankIndex][toFileIndex] !== "  ") {
        // also append the fromFile if pawn captures
        if (piece === "p") {
          notation += fromFile;
        }
        notation += "x";
      }

      // append destination square
      notation += toFile;
      notation += toRank;

      // append "=promotionTo" if promotion
      if (promotionTo !== "") {
        notation += "=";
        notation += promotionTo;
      }
    }

    /*
      check for checkmate, if yes append "#"
      if not checkmate,
      check for check, if yes append "+"
    */
    if (checkForCheckMate()) {
      notation += "#";
    } else if (checkForChecks()) {
      notation += "+";
    }

    return notation;
  };
  let isValidMove = (
    toRankIndex,
    toFileIndex,
    heldPiece,
    boardState,
    newBoardState
  ) => {
    let notation = "";
    let isValid = false;
    let piece = heldPiece.piece.charAt(1);
    let color = heldPiece.piece.charAt(0);
    let fromFile = String.fromCharCode(97 + heldPiece.heldFromFileIndex); // Convert 0-7 to "a-h"
    let fromRank = (8 - parseInt(heldPiece.heldFromRankIndex)).toString();
    let toFile = String.fromCharCode(97 + toFileIndex); // Convert 0-7 to "a-h"
    let toRank = (8 - toRankIndex).toString();
    let fromFileIndex = heldPiece.heldFromFileIndex;
    let fromRankIndex = heldPiece.heldFromRankIndex;

    if (
      toRankIndex < 0 ||
      toRankIndex > 7 ||
      toFileIndex < 0 ||
      toFileIndex > 7 ||
      (toFile === fromFile && parseInt(toRank) === parseInt(fromRank))
    ) {
      return false;
    }

    // white pawn moves (wp)
    if (piece === "p" && color === "w") {

      // normal move
      if (
        (
          (toRankIndex === fromRankIndex - 1) ||     // single space
          (fromRankIndex === 6 && toRankIndex === 4) // double space
        ) &&
        toFileIndex === fromFileIndex &&
        boardState[toRankIndex][toFileIndex] === "  "
      ) {
        notation += toFile;
        notation += toRank;
        isValid = true;
      }

      // capture move
      else if (
        (
          (toRankIndex + 1 === fromRankIndex && toFileIndex + 1 === fromFileIndex) ||
          (toRankIndex + 1 === fromRankIndex && toFileIndex - 1 === fromFileIndex)
        ) &&
        boardState[toRankIndex][toFileIndex] !== "  " &&
        boardState[toRankIndex][toFileIndex].charAt(0) !== color
      ) {
        notation += fromFile;
        notation += "x";
        notation += toFile;
        notation += toRank;
        isValid = true;
      }
    }

    // black pawn moves (bp)
    else if (piece === "p" && color === "b") {

      // normal move
      if (
        (
          (toRankIndex === fromRankIndex + 1) ||     // single space
          (fromRankIndex === 1 && toRankIndex === 3) // double space
        ) &&
        toFileIndex === fromFileIndex &&
        boardState[toRankIndex][toFileIndex] === "  "
      ) {
        notation += toFile;
        notation += toRank;
        isValid = true;
      }

      // capture move
      else if (
        (
          (toRankIndex - 1 === fromRankIndex && toFileIndex + 1 === fromFileIndex) ||
          (toRankIndex - 1 === fromRankIndex && toFileIndex - 1 === fromFileIndex)
        ) &&
        boardState[toRankIndex][toFileIndex] !== "  " &&
        boardState[toRankIndex][toFileIndex].charAt(0) !== color
      ) {
        notation += fromFile;
        notation += "x";
        notation += toFile;
        notation += toRank;
        isValid = true;
      }
    }

    // white knight moves (wn) (ghoda)
    // black knight moves (bn) (ghoda)
    // else if (piece === "n") {
    //   if(boardState[toRankIndex][toFileIndex].charAt(0) !== color && (
    //     (toFileIndex === fromFileIndex + 2 && toRankIndex === fromRankIndex - 1) ||
    //     (toFileIndex === fromFileIndex + 2 && toRankIndex === fromRankIndex + 1) ||
    //     (toFileIndex === fromFileIndex - 2 && toRankIndex === fromRankIndex - 1) ||
    //     (toFileIndex === fromFileIndex - 2 && toRankIndex === fromRankIndex + 1) ||
    //     (toFileIndex === fromFileIndex + 1 && toRankIndex === fromRankIndex - 2) ||
    //     (toFileIndex === fromFileIndex + 1 && toRankIndex === fromRankIndex + 2) ||
    //     (toFileIndex === fromFileIndex - 1 && toRankIndex === fromRankIndex - 2) ||
    //     (toFileIndex === fromFileIndex - 1 && toRankIndex === fromRankIndex + 2))
    //   ) {
    //     notation += "N";

    //     let ambiguousKnights = [];
    //     for(let r=0; r<8; r++) {
    //       for(let f=0; f<8; f++) {
    //         if(
    //           boardState[r][f] === piece + color && // same color knight
    //           !(r === fromRankIndex && f === fromFileIndex) // not the current knight
    //         ) {
    //           // check if this knight can also move to (toRankIndex, toFileIndex)
    //           if (
    //             (f+2 === toFileIndex && r-1 === toRankIndex) ||
    //             (f+2 === toFileIndex && r+1 === toRankIndex) ||
    //             (f-2 === toFileIndex && r-1 === toRankIndex) ||
    //             (f-2 === toFileIndex && r+1 === toRankIndex) ||
    //             (f+1 === toFileIndex && r-2 === toRankIndex) ||
    //             (f+1 === toFileIndex && r+2 === toRankIndex) ||
    //             (f-1 === toFileIndex && r-2 === toRankIndex) ||
    //             (f-1 === toFileIndex && r+2 === toRankIndex)
    //           ) {
    //             ambiguousKnights.push({ file: f, rank: r });
    //           }
    //         }
    //       }
    //     }
    //     // Handle notation for ambiguity
    //     if (ambiguousKnights.length > 0) {
    //       let sameFile = ambiguousKnights.some(knight => knight.file === fromFileIndex);
    //       let sameRank = ambiguousKnights.some(knight => knight.rank === fromRankIndex);

    //       if (!sameFile) {
    //         // If knights are on different files, include the file (column)
    //         notation += String.fromCharCode(97 + fromFileIndex); // Convert to 'a'-'h'
    //       } else if (!sameRank) {
    //         // If knights are on the same file but different ranks, include the rank
    //         notation += (8 - fromRankIndex).toString(); // Convert to '1'-'8'
    //       } else {
    //         // If knights share the same file and rank (highly unlikely but possible in bug scenarios), include both
    //         notation += String.fromCharCode(97 + fromFileIndex) + (8 - fromRankIndex);
    //       }
    //     }

    //     if(boardState[toRankIndex][toFileIndex] !== "  ") {
    //       notation += "x"; // capture move
    //     }
    //     notation += toFile;
    //     notation += toRank;
    //     isValid = true;
    //   }
    // }

    
    notation === "" ? null : console.log(notation);
    return isValid;
  };

  let holdThisPiece = (rankIndex, fileIndex, piece) => {
    if (piece != "  ") {
      setHeldPiece({
        piece: piece,
        heldFromRankIndex: rankIndex,
        heldFromFileIndex: fileIndex,
      });
    }
  };
  let allowDrop = (e) => {
    e.preventDefault();
  };
  let dropThisPiece = (rankIndex, fileIndex) => {
    if (heldPiece) {
      // copy existing board state
      let newBoardState = boardState.map((rank) => [...rank]); // deep copy

      // if valid move, move the piece and clear previous cell
      if (
        isValidMove(rankIndex, fileIndex, heldPiece, boardState, newBoardState)
      ) {
        newBoardState[heldPiece.heldFromRankIndex][
          heldPiece.heldFromFileIndex
        ] = "  ";
        newBoardState[rankIndex][fileIndex] = heldPiece.piece;

        // calculate and set move notation
        /*
          TODO: Add logic for following:
          shortCastle
          longCastle
          enPassant
        */
        let promotionTo = "";
        let shortCastle = false;
        let longCastle = false;
        let enPassant = false;
        let notation = calcNotation(
          rankIndex,
          fileIndex,
          heldPiece,
          boardState,
          newBoardState,
          promotionTo,
          shortCastle,
          longCastle,
          enPassant
        );
        if (notation !== "") {
          // console.log(notation);
          let newMoves = [...moves];
          newMoves.push(notation);
          setMoves(newMoves);
        }

        // save this state
        setBoardState(newBoardState);
        setHeldPiece(null);
      }
    }
  };

  return (
    <div className="flex justify-center items-center flex-row gap-12">
      <div className="flex justify-center items-center flex-row gap-12">
        {/* Chess Board */}
        <div className="flex justify-center items-center flex-col w-fit h-fit">
          {boardState.map((rank, rankIndex) => (
            <div
              className="flex justify-center items-center flex-row"
              key={rankIndex}
            >
              {rank.map((cell, fileIndex) => {
                let isDarkCell = (rankIndex + fileIndex) % 2 === 1;
                return (
                  <div
                    key={fileIndex}
                    className={`w-[75px] h-[75px] ${
                      isDarkCell ? "bg-[#88a6ba]" : "bg-[#d1dee3]"
                    }`}
                    onDragOver={allowDrop}
                    onDrop={() => dropThisPiece(rankIndex, fileIndex)}
                  >
                    {cell !== "  " && (
                      <img
                        className="w-full h-full"
                        src={pieceImages[cell]}
                        draggable
                        onDragStart={() =>
                          holdThisPiece(rankIndex, fileIndex, cell)
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Moves Container */}
        <div className="h-[600px] w-[300px] overflow-y-auto border-2 border-gray-500 rounded-[15px] relative scrollbar-hide">
          <h1 className="sticky top-0 bg-white text-center border-b-2 border-gray-500">
            Moves
          </h1>

          {moves.map((move, index) => (
            <div className="flex flex-col w-full" key={index}>
              {/* Last move without pairing */}
              {index === moves.length - 1 && index % 2 === 0 && (
                <p className="flex justify-between items-center px-2 py-1">
                  <span className="font-bold w-[40px] text-right mr-5">
                    {(index + 2) / 2}
                  </span>
                  <span className="font-bold w-[100px] text-left text-blue-500">
                    {move}
                  </span>
                  <span className="font-bold w-[100px] text-left"></span>
                </p>
              )}

              {/* Regular pairing of white and black moves */}
              {index % 2 === 0 && index + 1 < moves.length && (
                <p className="flex justify-between items-center px-2 py-1">
                  <span className="font-bold w-[40px] text-right mr-5">
                    {(index + 2) / 2}
                  </span>
                  <span className="font-bold w-[100px] text-left text-blue-500">
                    {move}
                  </span>
                  <span className="font-bold w-[100px] text-left text-red-500">
                    {moves[index + 1]}
                  </span>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChessGame;
