import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ProtheusLibCoreModule } from '@totvs/protheus-lib-core';
import { ProAppConfigService } from '@totvs/protheus-lib-core';


import {
  PoMenuItem,
  PoMenuModule,
  PoPageModule,
  PoToolbarModule,
} from '@po-ui/ng-components';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    PoToolbarModule,
    PoMenuModule,
    PoPageModule,
    ProtheusLibCoreModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  //ao carregar a pagina
  constructor(private proAppConfigService: ProAppConfigService, private router: Router) {
    if (!this.proAppConfigService.insideProtheus()) {
      this.proAppConfigService.loadAppConfig();
      sessionStorage.setItem("insideProtheus", "0");
      sessionStorage.setItem("ERPTOKEN", '{"access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InBKd3RQdWJsaWNLZXlGb3IyNTYifQ.eyJpc3MiOiJUT1RWUy1BRFZQTC1GV0pXVCIsInN1YiI6IkFkbWluaXN0cmFkb3IiLCJpYXQiOjE3NjYwNzk1MzEsInVzZXJpZCI6IjAwMDAwMCIsImV4cCI6MTc2NjA4MzEzMSwiZW52SWQiOiIyNDEwIn0.gtj9vUh9VrbgHeDQMQHteeE30zUNopl-_GITWkG7K2tYKwWUWhW1bDaOz6H2IjC5-YnrR5aLOqZWJlGRJ9r_gmijkaWVC9tJStT2K8ESarzYvLYVOZVfyXZwOyNTTOnx-WypDZoLiMLp_NTp2g9UpYouMyJGLNeF9PVDMBqmgpnkWDDQpkLwReWKc9k2Zy77SRytpkCdugDeTPH2GhlrkgGGEMriqOXAObYAfa8pcKLQjTTFiBJ66qcnTrQ591uVcdYCyDktxfTYdPznBiJHMMmH8dXaNJfs5pqZSAgnM9oxlRGp1X-MApvlRmn1ot3swSBTMjK-F1nqV9qeHdO07Q","scope": "default","token_type": "Bearer","expires_in": 3600, "hasMFA": false}');
    }
    else {
      sessionStorage.setItem("insideProtheus", "1");
    }

  }


  readonly menus: Array<PoMenuItem> = [
    { label: 'Sair', action: this.onClick.bind(this), icon: 'po-icon-exit', shortLabel: 'Sair'}
  ];

  private onClick(item: PoMenuItem) {
    if (item.label === 'Jogar') {
      this.router.navigate(['/']);
    } else if (item.label === 'Sair') {
      if (this.proAppConfigService.insideProtheus()) {
        this.proAppConfigService.callAppClose();
      } else {
        alert("Clique não veio do Protheus");
      }
    }
  }
}
