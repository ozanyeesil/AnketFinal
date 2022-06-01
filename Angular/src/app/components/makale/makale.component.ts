import { Cevap } from './../../models/Cevap';
import { Sonuc } from './../../models/Sonuc';
import { Yorum } from './../../models/Yorum';
import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Makale } from 'src/app/models/Makale';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MyAlertService } from 'src/app/services/myAlert.service';

@Component({
  selector: 'app-makale',
  templateUrl: './makale.component.html',
  styleUrls: ['./makale.component.scss']
})
export class MakaleComponent implements OnInit {
  cvpA = 0
  cvpB = 0
  cvpC = 0
  uyeId: number;
  makaleId: number;
  makale: Makale;
  yorumlar: Yorum[];
  cevap: Cevap[];

  dialogRefConfirm: MatDialogRef<ConfirmDialogComponent>;
  constructor(
    public apiServis: ApiService,
    public route: ActivatedRoute,
    public matDialog: MatDialog,
    public alert: MyAlertService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(p => {
      if (p.makaleId) {
        this.makaleId = p.makaleId;
        this.MakaleById();
        this.MakaleYorumListe();
      }
      this.uyeId = parseInt(localStorage.getItem("uid"));
      this.CevapGetir();

    });
  }
  CevapEkle(cvp: number){
    var yeniCevap: Cevap = new Cevap();
    yeniCevap.Cevap1 = cvp
    yeniCevap.MakaleId = this.makaleId
    yeniCevap.UyeId = this.uyeId
    this.apiServis.CevapEkle(yeniCevap).subscribe((d: Cevap) => {
      if(d['mesaj'] == 'Zaten ankete oy verilmiş!'){
        alert('Ankete zaten oy verilmiş')
      }
      else{
        this.cvpA = 0
        this.cvpB = 0
        this.cvpC = 0
        this.CevapGetir()
      }
      
    
    })
  }
  CevapGetir(){
    this.apiServis.Cevap1Liste(this.makaleId).subscribe((d:any) => {
      d.forEach(element => {
        this.cvpA = this.cvpA + 1
      });
    })
    this.apiServis.Cevap2Liste(this.makaleId).subscribe((d:any) => {
      d.forEach(element => {
        this.cvpB = this.cvpB + 1
      });
    })
    this.apiServis.Cevap3Liste(this.makaleId).subscribe((d:any) => {
      d.forEach(element => {
        this.cvpC = this.cvpC + 1
      });
    })
  }

  MakaleById() {
    this.apiServis.MakaleById(this.makaleId).subscribe((d: Makale) => {
      this.makale = d;
      this.MakaleOkunduYap();
    });
  }
  MakaleOkunduYap() {
    this.makale.Okunma += 1;
    this.apiServis.MakaleDuzenle(this.makale).subscribe();
  }

  MakaleYorumListe() {
    this.apiServis.YorumListeBymakaleId(this.makaleId).subscribe((d: Yorum[]) => {
      this.yorumlar = d;
    });
  }

  YorumEkle(yorumMetni: string) {
    var yorum: Yorum = new Yorum();
    var uyeId: number = parseInt(localStorage.getItem("uid"));
    yorum.MakaleId = this.makaleId;
    yorum.UyeId = uyeId;
    yorum.YorumIcerik = yorumMetni;
    yorum.Tarih = new Date();

    this.apiServis.YorumEkle(yorum).subscribe((d: Sonuc) => {
      if (d.islem) {
        this.MakaleYorumListe();
      }
    });
  }
  YorumSil(kayit: Yorum) {
    this.dialogRefConfirm = this.matDialog.open(ConfirmDialogComponent, {
      width: '400px',
    });
    this.dialogRefConfirm.componentInstance.dialogMesaj = kayit.YorumIcerik + " Başlıklı Makale Silinecektir Onaylıyor musunuz?";

    this.dialogRefConfirm.afterClosed().subscribe(d => {
      if (d) {
        this.apiServis.YorumSil(kayit.YorumId).subscribe((s: Sonuc) => {
          this.alert.AlertUygula(s);
          if (s.islem) {
            this.MakaleYorumListe();
          }
        });
      }
    });
  }
}
