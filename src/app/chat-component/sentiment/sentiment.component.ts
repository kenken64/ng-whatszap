import { Component, OnInit } from '@angular/core';
import { SentimentService } from '../../services/sentiment.service';

@Component({
  selector: 'app-sentiment',
  templateUrl: './sentiment.component.html',
  styleUrls: ['./sentiment.component.css']
})
export class SentimentComponent implements OnInit {
  displayedColumns: string[] = ['id', 'from', 'text', 'label'];
  dataSource = [];

  constructor(private sentimentSvc: SentimentService) { }

  ngOnInit() {
    this.sentimentSvc.getAllAnalyzedMessages().subscribe((results)=>{
      console.log(results);
      this.dataSource = results;
    })
  }

}
