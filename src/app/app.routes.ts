import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./tetris-game/tetris-game.component').then(m => m.TetrisGameComponent)
  },
  {
    path: 'game',
    loadComponent: () => import('./tetris-game/tetris-game.component').then(m => m.TetrisGameComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];