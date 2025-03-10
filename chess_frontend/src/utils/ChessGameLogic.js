// Please refer to ChessGame.jsx for nomenclature of pieces that I have used

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

function getAvailableBishopSquares(boardState, fromFileIndex, fromRankIndex, color) {
    let availableSquares = [];
    let i, j;
    // find available squares to the topleft
    i=fromRankIndex-1, j=fromFileIndex-1;
    while(i >= 0 && j >= 0) {
        if(boardState[i][j] === "  ") {
            availableSquares.push({ rankIndex: i, fileIndex: j})
        }
        else if(boardState[i][j].charAt(0) !== color) {
            availableSquares.push({ rankIndex: i, fileIndex: j})
            break;
        }
        else {
            break;
        }
        i--;
        j--;
    }
    // find available squares to the topright
    i=fromRankIndex+1, j=fromFileIndex-1;
    while(i <= 7 && j >= 0) {
        if(boardState[i][j] === "  ") {
            availableSquares.push({ rankIndex: i, fileIndex: j})
        }
        else if(boardState[i][j].charAt(0) !== color) {
            availableSquares.push({ rankIndex: i, fileIndex: j})
            break;
        }
        else {
            break;
        }
        i++;
        j--;
    }
    // find available squares to the bottomleft
    i=fromRankIndex-1, j=fromFileIndex+1;
    while(i >= 0 && j <= 7) {
        if(boardState[i][j] === "  ") {
            availableSquares.push({ rankIndex: i, fileIndex: j})
        }
        else if(boardState[i][j].charAt(0) !== color) {
            availableSquares.push({ rankIndex: i, fileIndex: j})
            break;
        }
        else {
            break;
        }
        i--;
        j++;
    }
    // find available squares to the bottomright
    i=fromRankIndex+1, j=fromFileIndex+1;
    while(i <= 7 && j <= 7) {
        if(boardState[i][j] === "  ") {
            availableSquares.push({ rankIndex: i, fileIndex: j})
        }
        else if(boardState[i][j].charAt(0) !== color) {
            availableSquares.push({ rankIndex: i, fileIndex: j})
            break;
        }
        else {
            break;
        }
        i++;
        j++;
    }
    // console.log(availableSquares);
    return availableSquares;
}

function getAvailableKnightSquares(boardState, fromFileIndex, fromRankIndex, color) {
    let availableSquares = [];
    let directions = [
        [ 1,  2],
        [ 1, -2],
        [-1,  2],
        [-1, -2],
        [ 2,  1],
        [ 2, -1],
        [-2,  1],
        [-2, -1],
    ]
    for(let direction of directions) {
        let toRankIndex = fromRankIndex + direction[0];
        let toFileIndex = fromFileIndex + direction[1];
        if(
            (toRankIndex >= 0 && toRankIndex < 8 && toFileIndex >= 0 && toFileIndex < 8) &&
            (boardState[toRankIndex][toFileIndex].charAt(0) != color)
        ) {
            availableSquares.push({ rankIndex: toRankIndex, fileIndex: toFileIndex });
        }
    }
    return availableSquares;
}

function getAvailableQueenSquares(boardState, fromFileIndex, fromRankIndex, color) {
    let diagonalSquares = getAvailableBishopSquares(boardState, fromFileIndex, fromRankIndex, color);
    let straightMoves = getAvailableRookSquares(boardState, fromFileIndex, fromRankIndex, color);
    let availableSquares = diagonalSquares.concat(straightMoves);
    return availableSquares;
}

function getCheckSquares(heldPiece, boardState, oppColor) {
    let piece         = heldPiece.piece.charAt(1);
    let pieceColor    = heldPiece.piece.charAt(0);
    let fromFileIndex = heldPiece.heldFromFileIndex;
    let fromRankIndex = heldPiece.heldFromRankIndex;
    let checkSquares  = [];

    // pawn check squares
    if(piece === "p") {
        if(pieceColor === "w") {
            if(fromRankIndex > 0) {
                if(fromFileIndex > 0) checkSquares.push({ rankIndex: fromRankIndex-1, fileIndex: fromFileIndex-1 });
                if(fromFileIndex < 7) checkSquares.push({ rankIndex: fromRankIndex-1, fileIndex: fromFileIndex+1 });
            }
        } 
        else if(pieceColor === "b") {
            if(fromRankIndex < 7) {
                if(fromFileIndex > 0) checkSquares.push({ rankIndex: fromRankIndex+1, fileIndex: fromFileIndex-1 });
                if(fromFileIndex < 7) checkSquares.push({ rankIndex: fromRankIndex+1, fileIndex: fromFileIndex+1 });
            }
        }
    }

    // Knight check squares
    else if (piece === "n") {
        checkSquares = checkSquares.concat(getAvailableKnightSquares(boardState, fromFileIndex, fromRankIndex, pieceColor));
    }

    // Bishop check squares
    else if(piece === "b") {
        checkSquares = checkSquares.concat(getAvailableBishopSquares(boardState, fromFileIndex, fromRankIndex, pieceColor));
    }

    // Rook check squares
    else if(piece === "r") {
        checkSquares = checkSquares.concat(getAvailableRookSquares(boardState, fromFileIndex, fromRankIndex, pieceColor));
    }

    // Queen check squares
    else if(piece === "q") {
        checkSquares = checkSquares.concat(getAvailableQueenSquares(boardState, fromFileIndex, fromRankIndex, pieceColor));
    }
    
    return checkSquares;
}

function getAvailableKingSquares(boardState, fromFileIndex, fromRankIndex, kingColor) {
    // Get basic king movement squares
    let kingSquares = [];
    let directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [ 0, -1],          [ 0, 1],
        [ 1, -1], [ 1, 0], [ 1, 1]
    ];
    
    for(let direction of directions) {
        let toRankIndex = fromRankIndex + direction[0];
        let toFileIndex = fromFileIndex + direction[1];

        // Check if square is on board and not occupied by friendly piece
        if(
            toRankIndex >= 0 && toRankIndex < 8 &&
            toFileIndex >= 0 && toFileIndex < 8 &&
            (boardState[toRankIndex][toFileIndex] === "  " || 
             boardState[toRankIndex][toFileIndex].charAt(0) !== kingColor)
        ) {
            kingSquares.push({ rankIndex: toRankIndex, fileIndex: toFileIndex });
        }
    }

    // Find all opponent pieces and their attack squares
    let oppPiecesCheckSquares = [];
    for(let i=0; i<8; i++) {
        for(let j=0; j<8; j++) {
            // Find opponent piece that's not a king
            if(
                boardState[i][j] !== "  " &&
                boardState[i][j].charAt(0) !== kingColor &&
                boardState[i][j].charAt(1) !== "k"
            ) {
                let piece = boardState[i][j];
                let heldPiece = {
                    piece: piece,
                    heldFromRankIndex: i,
                    heldFromFileIndex: j
                };
                
                // Get squares this piece can attack
                let attackSquares = getCheckSquares(heldPiece, boardState, kingColor);
                for(let square of attackSquares) {
                    oppPiecesCheckSquares.push(square);
                }
            }
        }
    }

    // Remove squares that are under attack
    kingSquares = kingSquares.filter(kingSquare =>
        !oppPiecesCheckSquares.some(oppCheckSquare =>
            oppCheckSquare.rankIndex === kingSquare.rankIndex &&
            oppCheckSquare.fileIndex === kingSquare.fileIndex
        )
    );

    return kingSquares;
}

export function isValidMove(toRankIndex, toFileIndex, heldPiece, boardState, newBoardState) {
    let notation      = "";
    let isValid       = false;
    let piece         = heldPiece.piece.charAt(1);
    let color         = heldPiece.piece.charAt(0);
    let fromFile      = String.fromCharCode(97 + heldPiece.heldFromFileIndex); // Convert 0-7 to "a-h"
    let fromRank      = (8 - parseInt(heldPiece.heldFromRankIndex)).toString();
    let toFile        = String.fromCharCode(97 + toFileIndex); // Convert 0-7 to "a-h"
    let toRank        = (8 - toRankIndex).toString();
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
        let availableSquares = getAvailableKnightSquares(boardState, fromFileIndex, fromRankIndex, color);
        for(let square of availableSquares) {
            if(square.rankIndex === toRankIndex && square.fileIndex === toFileIndex) {
                notation += "N";
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

    // white bishop moves (wb) (oont)
    // black bishop moves (bb) (oont)
    else if(piece === "b") {
        let availableSquares = getAvailableBishopSquares(boardState, fromFileIndex, fromRankIndex, color);
        for(let square of availableSquares) {
            if(square.rankIndex === toRankIndex && square.fileIndex === toFileIndex) {
                notation += "B";
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
        let availableSquares = getAvailableQueenSquares(boardState, fromFileIndex, fromRankIndex, color);
        for(let square of availableSquares) {
            if(square.rankIndex === toRankIndex && square.fileIndex === toFileIndex) {
                notation += "Q";
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

    // white king moves (wk)
    // black king moves (bk)
    else if(piece === "k") {
        let availableSquares = getAvailableKingSquares(boardState, fromFileIndex, fromRankIndex, color);
        for(let square of availableSquares) {
            if(square.rankIndex === toRankIndex && square.fileIndex === toFileIndex) {
                notation += "K";
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

    notation === "" ? null : console.log(notation);
    return isValid;
};

export function getAvailableSquares(heldPiece, boardState) {
    let piece = heldPiece.piece.charAt(1);
    let color = heldPiece.piece.charAt(0);
    let fromFileIndex = heldPiece.heldFromFileIndex;
    let fromRankIndex = heldPiece.heldFromRankIndex;

    // white pawn moves (wp)
    if (piece === "p" && color === "w") {
        let availableSquares = [];
        // single space move
        if(boardState[fromRankIndex-1][fromFileIndex] === "  ") {
            availableSquares.push({ rankIndex: fromRankIndex-1, fileIndex: fromFileIndex });
    
            // double space move
            if(fromRankIndex === 6 && boardState[fromRankIndex-2][fromFileIndex] === "  ") {
                availableSquares.push({ rankIndex: fromRankIndex-2, fileIndex: fromFileIndex });
            }
        }
        // left capture move
        if(fromFileIndex > 0 && boardState[fromRankIndex-1][fromFileIndex-1] !== "  " &&
            boardState[fromRankIndex-1][fromFileIndex-1].charAt(0) !== "w") {
            availableSquares.push({ rankIndex: fromRankIndex-1, fileIndex: fromFileIndex-1 });
        }
        // right capture move
        if(fromFileIndex < 7 && boardState[fromRankIndex-1][fromFileIndex+1] !== "  " &&
            boardState[fromRankIndex-1][fromFileIndex+1].charAt(0) !== "w") {
            availableSquares.push({ rankIndex: fromRankIndex-1, fileIndex: fromFileIndex+1 });
        }
        return availableSquares;
    }

    // black pawn moves (bp)
    else if (piece === "p" && color === "b") {
        let availableSquares = [];
        // single space move
        if(boardState[fromRankIndex+1][fromFileIndex] === "  ") {
            availableSquares.push({ rankIndex: fromRankIndex+1, fileIndex: fromFileIndex });
    
            // double space move
            if(fromRankIndex === 1 && boardState[fromRankIndex+2][fromFileIndex] === "  ") {
                availableSquares.push({ rankIndex: fromRankIndex+2, fileIndex: fromFileIndex });
            }
        }
        // left capture move
        if(fromFileIndex > 0 && boardState[fromRankIndex+1][fromFileIndex-1] !== "  " &&
            boardState[fromRankIndex+1][fromFileIndex-1].charAt(0) !== "b") {
            availableSquares.push({ rankIndex: fromRankIndex+1, fileIndex: fromFileIndex-1 });
        }
        // right capture move
        if(fromFileIndex < 7 && boardState[fromRankIndex+1][fromFileIndex+1] !== "  " &&
            boardState[fromRankIndex+1][fromFileIndex+1].charAt(0) !== "b") {
            availableSquares.push({ rankIndex: fromRankIndex+1, fileIndex: fromFileIndex+1 });
        }
        return availableSquares;
    }

    // white knight (wn) (ghoda)
    // black knight (bn) (ghoda)
    else if (piece === "n") {
        return getAvailableKnightSquares(boardState, fromFileIndex, fromRankIndex, color);
    }

    // white bishop (wb) (oont)
    // black bishop (bb) (oont)
    else if(piece === "b") {
        return getAvailableBishopSquares(boardState, fromFileIndex, fromRankIndex, color);
    }

    // white rook (wr)
    // black rook (br)
    else if(piece === "r") {
        return getAvailableRookSquares(boardState, fromFileIndex, fromRankIndex, color);
    }

    // white queen (wq)
    // black queen (bq)
    else if(piece === "q") {
        return getAvailableQueenSquares(boardState, fromFileIndex, fromRankIndex, color);
    }

    // white king (wk)
    // black king (bk)
    if(piece === "k") {
        return getAvailableKingSquares(boardState, fromFileIndex, fromRankIndex, color);
    }

    throw new Error(`Invalid piece: color=${color} piece=${piece}`);
}
