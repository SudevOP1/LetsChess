export function checkForChecks() {
    return false;
};


export function checkForCheckMate() {
    return false;
};


export function calcNotation (
    toRankIndex, toFileIndex, heldPiece, boardState, newBoardState,
    promotionTo = "", shortCastle = false, longCastle = false, enPassant = false
) {
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

function getAvailableRookSquares(boardState, fromFileIndex, fromRankIndex, color) {
    let availableSquares = [];
    // find available squares above
    for(let i=fromRankIndex-1; i>=0; i--) {
        if(boardState[i][fromFileIndex] === "  ") {
            availableSquares.push({ rankIndex: i, fileIndex: fromFileIndex})
        }
        else if(boardState[i][fromFileIndex].charAt(0) !== color) {
            availableSquares.push({ rankIndex: i, fileIndex: fromFileIndex})
            break;
        }
        else {
            break;
        }
    }
    // find available squares below
    for(let i=fromRankIndex+1; i<8; i++) {
        if(boardState[i][fromFileIndex] === "  ") {
            availableSquares.push({ rankIndex: i, fileIndex: fromFileIndex});
        }
        else if(boardState[i][fromFileIndex].charAt(0) !== color) {
            availableSquares.push({ rankIndex: i, fileIndex: fromFileIndex});
            break;
        }
        else {
            break;
        }
    }
    // find available squares to the right
    for(let i=fromFileIndex+1; i<8; i++) {
        if(boardState[fromRankIndex][i] === "  ") {
            availableSquares.push({ rankIndex: fromRankIndex, fileIndex: i});
        }
        else if(boardState[fromRankIndex][i].charAt(0) !== color) {
            availableSquares.push({ rankIndex: fromRankIndex, fileIndex: i});
            break;
        }
        else {
            break;
        }
    }
    // find available squares to the left
    for(let i=fromFileIndex-1; i>=0; i--) {
        if(boardState[fromRankIndex][i] === "  ") {
            availableSquares.push({ rankIndex: fromRankIndex, fileIndex: i});
        }
        else if(boardState[fromRankIndex][i].charAt(0) !== color) {
            availableSquares.push({ rankIndex: fromRankIndex, fileIndex: i});
            break;
        }
        else {
            break;
        }
    }
    return availableSquares;
}

export function isValidMove (toRankIndex, toFileIndex, heldPiece, boardState, newBoardState) {
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

    // return false if piece is moved to same square or out of bounds of board
    if (
        (toRankIndex < 0 || toRankIndex > 7 || toFileIndex < 0 || toFileIndex > 7)
        ||
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
    else if (piece === "n") {
        if(
            boardState[toRankIndex][toFileIndex].charAt(0) !== color
            && (
                (toFileIndex === fromFileIndex + 2 && toRankIndex === fromRankIndex - 1) ||
                (toFileIndex === fromFileIndex + 2 && toRankIndex === fromRankIndex + 1) ||
                (toFileIndex === fromFileIndex - 2 && toRankIndex === fromRankIndex - 1) ||
                (toFileIndex === fromFileIndex - 2 && toRankIndex === fromRankIndex + 1) ||
                (toFileIndex === fromFileIndex + 1 && toRankIndex === fromRankIndex - 2) ||
                (toFileIndex === fromFileIndex + 1 && toRankIndex === fromRankIndex + 2) ||
                (toFileIndex === fromFileIndex - 1 && toRankIndex === fromRankIndex - 2) ||
                (toFileIndex === fromFileIndex - 1 && toRankIndex === fromRankIndex + 2)
            )
        ) {
            notation += "N";
            // capture move
            if(boardState[toRankIndex][toFileIndex] !== "  ") {
                notation += "x";
            }
            notation += toFile;
            notation += toRank;
            isValid = true;
        }
    }

    // white bishop moves (wb) (oont)
    // black bishop moves (bb) (oont)
    else if(piece === "b") {
    }

    // white rook moves (wr)
    // black rook moves (br)
    else if(piece === "r") {
        let availableSquares = getAvailableRookSquares(boardState, fromFileIndex, fromRankIndex, color);
        for(let square of availableSquares) {
            if(square.rankIndex === toRankIndex && square.fileIndex === toFileIndex) {
                notation += "R";
                // capture move
                if(boardState[toRankIndex][toFileIndex] !== "  ") {
                    notation += "x";
                }
                notation += toFile;
                notation += toRank;
                isValid = true;
                break;
            }
        }
    }

    // white queen moves (wq)
    // black queen moves (bq)
    else if(piece === "q") {
    }

    // white king moves (wk)
    // black king moves (bk)
    else if(piece === "k") {
    }

    notation === "" ? null : console.log(notation);
    return isValid;
};
