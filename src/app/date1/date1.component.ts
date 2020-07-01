import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-date1',
  templateUrl: './date1.component.html',
  styleUrls: ['./date1.component.css']
})
export class Date1Component implements OnInit {

  constructor() { }

  @Input('read-only') readonly: boolean;
  @Input('date-format') dateformat: string;
  @Input('disabled') disabled = false;
  dateModel: any;
  ngOnInit() {
    this.dateModel = '07/07/2020'
  }

  onInputChange(event: any) {
    // if (event.target.value.length > 0) {
    this.dateModel = new Date(event.target.value);
    // } else {
    //   this.dateModel = '';
    // }
  }
  // Set touched on blur
  onBlur() {
    //this.onTouchedCallback();
    //this.onChangeCallback(this.dateModel);
  }
}