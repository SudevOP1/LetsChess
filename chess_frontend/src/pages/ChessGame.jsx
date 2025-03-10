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
import { calcNotation, isValidMove, getAvailableSquares, checkForChecks, checkForCheckMate } from "../utils/ChessGameLogic.js";
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
  // let [moves, setMoves] = useState(sampleMoves["moves"]); // for debugging
  let [moves, setMoves] = useState([]);
  let [highlightedCells, setHighlightedCells] = useState(Array(8).fill(null).map(() => Array(8).fill(false)));


  let holdThisPiece = (rankIndex, fileIndex, piece) => {
    if (piece != "  ") {
      let newHeldPiece = {
        piece: piece,
        heldFromRankIndex: rankIndex,
        heldFromFileIndex: fileIndex,
      }
      setHeldPiece(newHeldPiece);
      
      // highlight the available squares of this piece
      let availableSquares = getAvailableSquares(newHeldPiece, boardState);
      if(availableSquares.length > 0) {
        let newHighlightedCells = Array(8).fill(null).map(() => Array(8).fill(false)); // reset highlighted cells
        for(let square of availableSquares) {
          newHighlightedCells[square.rankIndex][square.fileIndex] = true;
        }
        setHighlightedCells(newHighlightedCells);
      }
    }
  };
  let allowDrop = (e) => {
    e.preventDefault();
  };
  let dropThisPiece = (rankIndex, fileIndex) => {
    if (heldPiece) {
      // copy existing board state
      let newBoardState = boardState.map((rank) => [...rank]); // deep copy
      // reset highlighted cells
      setHighlightedCells(Array(8).fill(null).map(() => Array(8).fill(false)));

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
                    }
                    ${highlightedCells[rankIndex][fileIndex] && (
                      isDarkCell ? "bg-[#d66e65]" : "bg-[#e87b6f]"
                    )}`}
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
