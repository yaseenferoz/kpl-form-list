import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.css']
})
export class PlayerDetailComponent implements OnInit {
  player: any;
  baseUrl="https://cric-be.onrender.com/api/forms/"
  constructor(private route: ActivatedRoute, 
              private http: HttpClient,
              private location: Location) { }

  ngOnInit(): void {
    const playerId = this.route.snapshot.paramMap.get('id');
    this.http.get<any>(this.baseUrl + playerId)
      .subscribe(player => {
        this.player = player;
      });
  }

  goBack(): void {
    this.location.back();
  }
}
