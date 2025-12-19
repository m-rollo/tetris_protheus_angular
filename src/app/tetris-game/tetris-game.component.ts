import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 20;

const TETROMINOES = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  O: [
    [1, 1],
    [1, 1]
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
  ]
};

const COLORS = {
  I: 'cyan',
  O: 'yellow',
  T: 'purple',
  S: 'green',
  Z: 'red',
  J: 'blue',
  L: 'orange'
};

@Component({
  selector: 'app-tetris-game',
  standalone: true,
  imports: [],
  templateUrl: './tetris-game.component.html',
  styleUrl: './tetris-game.component.css'
})
export class TetrisGameComponent implements AfterViewInit {
  @ViewChild('gameCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private audioContext!: AudioContext;

  score = 0;
  level = 1;
  board: string[][] = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(''));
  currentPiece: { shape: number[][], color: string, x: number, y: number } | null = null;
  dropTimer = 0;
  dropInterval = 1000;

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.audioContext = new AudioContext();
    this.canvas.nativeElement.focus();
    this.startGame();
  }

  startGame() {
    this.spawnPiece();
    this.gameLoop();
  }

  resetGame() {
    this.score = 0;
    this.level = 1;
    this.board = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(''));
    this.currentPiece = null;
    this.dropTimer = 0;
    this.startGame();
  }

  spawnPiece() {
    const types = Object.keys(TETROMINOES);
    const randomType = types[Math.floor(Math.random() * types.length)] as keyof typeof TETROMINOES;
    this.currentPiece = {
      shape: TETROMINOES[randomType],
      color: COLORS[randomType],
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: 0
    };
  }

  gameLoop = () => {
    this.dropTimer += 16;
    if (this.dropTimer >= this.dropInterval) {
      this.dropPiece();
      this.dropTimer = 0;
    }
    this.draw();
    requestAnimationFrame(this.gameLoop);
  };

  dropPiece() {
    if (this.currentPiece && this.isValidMove(this.currentPiece.x, this.currentPiece.y + 1, this.currentPiece.shape)) {
      this.currentPiece.y++;
    } else {
      this.placePiece();
      this.playSound(200, 100);
      this.clearLines();
      this.spawnPiece();
      if (!this.isValidMove(this.currentPiece!.x, this.currentPiece!.y, this.currentPiece!.shape)) {
        this.playSound(100, 500);
        this.resetGame();
      }
    }
  }

  isValidMove(x: number, y: number, shape: number[][]): boolean {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newX = x + col;
          const newY = y + row;
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT || (newY >= 0 && this.board[newY][newX] !== '')) {
            return false;
          }
        }
      }
    }
    return true;
  }

  placePiece() {
    if (!this.currentPiece) return;
    for (let row = 0; row < this.currentPiece.shape.length; row++) {
      for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
        if (this.currentPiece.shape[row][col]) {
          this.board[this.currentPiece.y + row][this.currentPiece.x + col] = this.currentPiece.color;
        }
      }
    }
    this.currentPiece = null;
  }

  clearLines() {
    let linesCleared = 0;
    for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
      if (this.board[row].every(cell => cell !== '')) {
        this.board.splice(row, 1);
        this.board.unshift(Array(BOARD_WIDTH).fill(''));
        this.score += 100;
        linesCleared++;
        row++;
      }
    }
    if (linesCleared > 0) {
      this.playSound(400, 200);
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    for (let row = 0; row < BOARD_HEIGHT; row++) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        if (this.board[row][col] !== '') {
          this.ctx.fillStyle = this.board[row][col];
          this.ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          this.ctx.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
      }
    }
    if (this.currentPiece) {
      this.ctx.fillStyle = this.currentPiece.color;
      for (let row = 0; row < this.currentPiece.shape.length; row++) {
        for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
          if (this.currentPiece.shape[row][col]) {
            this.ctx.fillRect((this.currentPiece.x + col) * BLOCK_SIZE, (this.currentPiece.y + row) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            this.ctx.strokeRect((this.currentPiece.x + col) * BLOCK_SIZE, (this.currentPiece.y + row) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
          }
        }
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    if (!this.currentPiece) return;
    switch (event.key) {
      case 'ArrowLeft':
        if (this.isValidMove(this.currentPiece.x - 1, this.currentPiece.y, this.currentPiece.shape)) {
          this.currentPiece.x--;
        }
        break;
      case 'ArrowRight':
        if (this.isValidMove(this.currentPiece.x + 1, this.currentPiece.y, this.currentPiece.shape)) {
          this.currentPiece.x++;
        }
        break;
      case 'ArrowDown':
        this.dropPiece();
        break;
      case 'ArrowUp':
        this.rotatePiece();
        break;
    }
  }

  rotatePiece() {
    const rotated = this.currentPiece!.shape[0].map((_, index) =>
      this.currentPiece!.shape.map(row => row[index]).reverse()
    );
    if (this.isValidMove(this.currentPiece!.x, this.currentPiece!.y, rotated)) {
      this.currentPiece!.shape = rotated;
    }
  }

  playSound(frequency: number, duration: number) {
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      oscillator.frequency.value = frequency;
      oscillator.type = 'square';
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration / 1000);
    } catch (e) {
      console.log('Audio not supported');
    }
  }

}
