# LetsChess


### ♙ Pawn Moves:  
- [x] Move forward **1 space** (except when blocked)
- [x] Move forward **2 spaces** (only on first move)
- [x] **Capture diagonally**
- [ ] **Promotion** (queen, rook, bishop, or knight)
- [x] **Notation**

### ♘ Knight Moves:
- [x] **L-shape**
- [x] **Can jump over pieces**
- [x] **Notation**

### ♖ Rook Moves:
- [x] Moves **vertically**
- [x] Moves **horizontally**
- [x] Cannot jump over pieces
- [x] **Notation**

### ♗ Bishop Moves:
- [x] Moves **diagonally**
- [x] Cannot jump over pieces
- [x] **Notation**

### ♕ Queen Moves:
- [ ] Moves **vertically**
- [ ] Moves **horizontally**
- [ ] Moves **diagonally**
- [ ] Cannot jump over pieces
- [ ] **Notation**

### ♔ King Moves:  
- [ ] Moves **one square** in any direction
- [ ] Cannot move into **check** (an attacked square)
- [ ] **Notation**

### Castling Move:
- [ ] The king moves **two squares** towards a rook
- [ ] The rook **jumps over** the king and lands next to it
- [ ] No pieces between the king and rook
- [ ] The king **cannot be in check, move through check, or land in check**
- [ ] Neither the king nor the rook has moved before
- [ ] **Notation:** O-O or O-O-O

### Special Cases:
- [ ] **En passant**
- [ ] Add file and / or rank from for notation if two Knights can move to same square
- [ ] Add file and / or rank from for notation if two Rooks can move to same square
- [ ] Add file and / or rank from for notation if two Bishops can move to same square

### Additional Rules & Edge cases:
- [ ] Check for **Checks**
- [ ] Check for **Checkmate**
- [ ] **A king must move out of check** (or block/capture the attacking piece).

### 🏳️ Draw Conditions (Game End Scenarios)
- [ ] **Threefold repetition:** same board position occurs three times
- [ ] **50-move rule:** if 50 moves pass without pawn move or capture
- [ ] **Insufficient material**
- [ ] **Stalemate**