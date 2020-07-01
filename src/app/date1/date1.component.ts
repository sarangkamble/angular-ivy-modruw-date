import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-date1',
  templateUrl: './date1.component.html',
  styleUrls: ['./date1.component.css']
})
export class Date1Component implements OnInit {

  constructor() { }

  @Input('read-only') readonly: boolean;

  ngOnInit() {
  }

}