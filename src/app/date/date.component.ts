import { animate, state, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef, Component, ElementRef,
  EventEmitter, forwardRef, Input, OnInit, Output, Renderer2, SimpleChanges, OnChanges,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgModel, Validators } from '@angular/forms';

const noop = () => {
};

@Component({
  selector: 'amexio-date-time-picker',
  templateUrl: './date.component.html',
  animations: [
    trigger('changeState', [
      state('visible', style({
        transform: 'scale(1)',
      })),
      state('hidden', style({
        transform: 'scale(0)',
      })),
      transition('*=>*', animate('200ms')),
    ]),
  ]
})
export class DateComponent {
 
  /*
 Properties
 name : date-format
 datatype : string
 version : 4.0 onwards
 default :
 description : The label of this field
 */
  @Input('date-format') dateformat: string;
  /*
   Properties
   name : date-picker
   datatype : boolean
   version : 4.0 onwards
   default : false
   description : Enable/Disable Date Picker
   */
  @Input('date-picker') datepicker = true;

  @Input() utc = false;

  @Input() timestamp = true;
  @Input() xferDateFormat = '';
  /*
 Properties
 name : has-label
 datatype : boolean
 version : 5.21 onwards
 default : false
 description : Flag to set label
 */
  @Input('has-label') hasLabel = true;
  /*
   Properties
   name : time-picker
   datatype : boolean
   version : 4.0 onwards
   default : false
   description : Enable/Disable Time Picker
   */
  @Input('time-picker') timepicker: boolean;
  /*
   Properties
   name : field-label
   datatype : string
   version : 4.0 onwards
   default :
   description :The label of this field
   */
  @Input('field-label') fieldlabel: string;
  /*
  Properties
  name : field-label
  datatype : string
  version : 5.5.5 onwards
  default :
  description :The label of this field
  */
  @Input('place-holder') placeholder = '';
  /*
   Properties
   name : disabled
   datatype : boolean
   version : 4.1.5 onwards
   default : false
   description : Disable Date/Time Picker field
   */
  @Input('disabled') disabled = false;
  /*
   Properties
   name : read-only
   datatype : boolean
   version : 4.0 onwards
   default : false
   description : Disable Date/Time Picker field
   */
  @Input('read-only') readonly: boolean;
  /*
   Properties
   name : min-date
   datatype : string
   version : 4.2 onwards
   default : none
   description : sets minimum date range
   */
  @Input('min-date') minDate: string;
  /*
   Properties
   name : max-date
   datatype : string
   version : 4.2 onwards
   default : none
   description : sets maximum date range
   */
  @Input('max-date') maxDate: string;
  /*
   Properties
   name : diabled-date
   datatype :  any
   version : 4.2 onwards
   default : none
   description : sets disabled dates range
   */
  @Input('disabled-date') diabledDate: any[] = [];
  /*
   Properties
   name : inline-datepicker
   datatype :  boolean
   version : 4.2 onwards
   default : none
   description : sets inline calender
   */
  @Input('inline-datepicker') inlineDatepicker = false;
  /*
   Properties
   name : dropdown-datepicker
   datatype :  boolean
   version : 4.2 onwards
   default : none
   description : sets dropdown datepicker
   */
  @Input('dropdown-datepicker') dropdownDatepicker = false;
  /*
   Properties
   name : required
   datatype : boolean
   version : 4.0 onwards
   default : false
   description : Flag to allow blank field or not
   */
  @Input() required = false;
  posixUp: boolean;
  positionClass: any;
  /*
   Events
   name : blur
   description : On blur event
   */
  // @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  /*
   Properties
   name : change
   description : On field value change event
   */
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  /*
   Properties
   name : input
   description : On input event field.
   */
  @Output() input: EventEmitter<any> = new EventEmitter<any>();
  /*
   Properties
   name : focus
   description : On field focus event
   */
  // @Output() focus: EventEmitter<any> = new EventEmitter<any>();
  inputtabindex = 0;
  daystabindex = -1;
  showToolTip: boolean;
  drop = false;
  elementId: string;
  daysTitle: any[];
  tempFlag = true;
  curMonth: any;
  hrsArr: any[] = [];
  minArr: any[] = [];
  pickerele: any;
  daysArray: any;
  selectedDate: any;
  hostFlag = false;
  dateModel: any;
  isValid: boolean;
  roundedgeclass: string;
  @Output() isComponentValid: any = new EventEmitter<any>();
  backArrowFlag = false;
  forwardArrowFlag = false;
  hrs: number;
  min: number;
  viewmode: string;
  okispressed = false;
  cancelispressed = false;
  // The internal dataviews model
  private innerValue: any = '';
  // Placeholders for the callbacks which are later provided
  // by the Control Value Accessor
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;
  constructor(private datePipe: DatePipe, public element: ElementRef, private cdf: ChangeDetectorRef, renderer: Renderer2) {
    
    this.viewmode = '1';
    this.hrsArr = [
      { hr: '0' }, { hr: '1' }, { hr: '2' }, { hr: '3' },
      { hr: '4' }, { hr: '5' }, { hr: '6' }, { hr: '7' },
      { hr: '8' }, { hr: '9' }, { hr: '10' }, { hr: '11' },
      { hr: '12' }, { hr: '13' }, { hr: '14' }, { hr: '15' },
      { hr: '16' }, { hr: '17' }, { hr: '18' }, { hr: '19' },
      { hr: '20' }, { hr: '21' }, { hr: '22' }, { hr: '23' },
    ];
    this.minArr = [
      { min: '0' }, { min: '1' }, { min: '2' }, { min: '3' },
      { min: '4' }, { min: '5' }, { min: '6' }, { min: '7' },
      { min: '8' }, { min: '9' }, { min: '10' }, { min: '11' },
      { min: '12' }, { min: '13' }, { min: '14' }, { min: '15' },
      { min: '16' }, { min: '17' }, { min: '18' }, { min: '19' },
      { min: '20' }, { min: '21' }, { min: '22' }, { min: '23' },
      { min: '24' }, { min: '25' }, { min: '26' }, { min: '27' },
      { min: '28' }, { min: '29' }, { min: '30' }, { min: '31' },
      { min: '31' }, { min: '32' }, { min: '33' }, { min: '34' },
      { min: '35' }, { min: '36' }, { min: '37' }, { min: '38' },
      { min: '39' }, { min: '40' }, { min: '41' }, { min: '42' },
      { min: '43' }, { min: '44' }, { min: '45' }, { min: '46' },
      { min: '47' }, { min: '48' }, { min: '49' }, { min: '50' },
      { min: '51' }, { min: '52' }, { min: '53' }, { min: '54' },
      { min: '55' }, { min: '56' }, { min: '57' }, { min: '58' },
      { min: '59' },
    ];
    this.minDate = '';
    this.maxDate = '';
    this.elementId = new Date().getTime() + '';
    this.selectedDate = new Date();
    
    this.daysTitle = [];
    this.daysArray = [];
    this.timepicker = false;
    this.initDaysTitle();
    
  }
 
  ngOnChanges(changes: SimpleChanges): void {
    debugger
    console.log("mau datepicker ngon change called ")
    this.dateModel
    if (changes['dateModel']) {
      this.dateModel = changes.dateModel.currentValue;
      // this.iconClass = this.getIconClass();
    }
    console.log("datepicker after chnge is = ", this.dateModel)
  }
  onHrsMinSelect(event: any) {

    this.showToolTip = true;

    this.selectedDate.setDate(this.selectedDate.getDate());
    this.selectedDate.setMonth(this.selectedDate.getMonth());
    this.selectedDate.setFullYear(this.selectedDate.getFullYear());
    this.selectedDate.setHours(this.hrs);
    this.selectedDate.setMinutes(this.min);
    this.dateModel = new Date(this.selectedDate);

    this.value = this.selectedDate;

    this.onChangeCallback(this.dateModel);
    this.isComponentValid.emit(true);

    this.isValid = true;

    if (this.inlineDatepicker || (this.datepicker && this.timepicker)) {
      this.showToolTip = true;

    } else {
      this.showToolTip = !this.showToolTip;
    }
    this.change.emit(this.dateModel);

  }

  onNgChange() {
    this.change.emit(this.selectedDate);
  }

  private initDaysTitle() {
    this.daysTitle.push({ text: 'Mo' });
    this.daysTitle.push({ text: 'Tu' });
    this.daysTitle.push({ text: 'We' });
    this.daysTitle.push({ text: 'Th' });
    this.daysTitle.push({ text: 'Fr' });
    this.daysTitle.push({ text: 'Sa' });
    this.daysTitle.push({ text: 'Su' });
  }
  validateDateModel() {
    if (this.dateModel && typeof (this.dateModel) === 'string') {
      this.dateModel = new Date(this.dateModel);
    }
  }


  getFullMonthName(recevieddate: Date) {
    const months = ['January', 'Febuary', 'March', 'April', 'May',
      'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const datemonth = recevieddate.getMonth();
    let monthString = '';
    months.forEach((element: any, index: number) => {
      if (datemonth === index) {
        monthString = element;
      }
    });
    return monthString;
  }

  getHalfMonthName(recDate: Date) {
    const mons = ['Jan', 'Feb', 'Mar', 'Apr', 'May',
      'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const datemonth = recDate.getMonth();
    let mString = '';
    mons.forEach((element: any, index: number) => {
      if (datemonth === index) {
        mString = element;
      }
    });
    return mString;

  }
  getFullDayName(receiveddate: Date) {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
      'Thursday', 'Friday', 'Saturday'];
    const day = receiveddate.getDay();
    let dayname = '';
    weekdays.forEach((element: any, index: number) => {
      if (day === index) {
        dayname = element;
      }
    });
    return dayname;
  }


  formatDatePipe() {
    if (this.xferDateFormat.length > 0) {
      this.dateModel = this.datePipe.transform(this.dateModel, this.xferDateFormat);
    } else {
      this.dateModel = this.selectedDate.getFullYear() + '-' +
        ('0' + (this.selectedDate.getMonth() + 1)).slice(-2)
        + '-' + ('0' + this.selectedDate.getDate()).slice(-2);
    }
  }

  resetSelection(dateObj: any) {
    for (const i of this.daysArray) {
      for (const j of i) {
        const day = j;
        if (day.date.getTime() === dateObj.getTime()) {
          day.selected = true;
        } else {
          day.selected = false;
        }
      }
    }
  }
  onInput(event: any) {
    if (event.target.value != null && event.target.value !== '') {
      const timeValue = event.target.value.split(':');
      if (timeValue != null) {
        const hrs = parseInt(timeValue[0].trim(), 10);
        const mins = parseInt(timeValue[1].trim(), 10);
        this.selectedDate.setHours(hrs);
        this.selectedDate.setMinutes(mins);
        this.hrs = hrs;
        this.min = mins;
        this.value = this.selectedDate;
        event.stopPropagation();
      }
    }
  }


  setDateModel() {
    this.dateModel = new Date(this.dateModel);
    this.dateModel = new Date(this.getHalfMonthName(this.dateModel) + ' ' +
      this.dateModel.getDate() + ' ' + this.dateModel.getFullYear() + ' 05:30:00 UTC');
    if (!this.timestamp) {
      this.dateModel = new Date(this.dateModel);

      this.formatDatePipe();

    }
  }

  // this function validates month

  // Set Plus Data
  setPlusData(d: any, max: any, mon: any) {
    if (this.maxDate.length > 0) {
      if (d.getFullYear() === max.getFullYear()) {
        this.setMaxFullYear(d, max, mon);
      } else {
        // logic to chk if year is valid
        if (d.getFullYear() <= max.getFullYear()) {
          d.setMonth(d.getMonth() + mon);
        }
      }
    } else { // outer ends
      d.setMonth(d.getMonth() + mon);
    } // checks if selected date is within minimum range of month
  }

  // Set Max Full Year
  setMaxFullYear(d: any, max: any, mon: any) {
    if ((d.getMonth() !== max.getMonth()) && d.getFullYear() <= max.getFullYear() && d.getMonth() <= max.getMonth()) {
      d.setMonth(d.getMonth() + mon);
    }
  }
  // Set Minus Data
  setMinusData(d: any, min: any, mon: any) {
    if (this.minDate.length > 0) {
      if (d.getFullYear() === min.getFullYear()) {
        this.setMinFullYear(d, min, mon);
      } else {
        d.setMonth(d.getMonth() - mon);
      }
    } else {
      d.setMonth(d.getMonth() - mon);
    }
  }

  // Set Min Full year
  setMinFullYear(d: any, min: any, mon: any) {
    if ((d.getMonth() !== min.getMonth()) && d.getFullYear() >= min.getFullYear() && d.getMonth() >= min.getMonth()) {
      // logic to chk if year is valid
      d.setMonth(d.getMonth() - mon);
    }
  }
 
 

  dateFormatting() {
    if (!this.timestamp) {
      if (this.xferDateFormat.length > 0) {
        this.dateModel = new Date(this.selectedDate);
        this.dateModel = this.datePipe.transform(this.dateModel, this.xferDateFormat);
      } else {
        this.dateModel = this.selectedDate.getFullYear() + '-' +
          ('0' + (this.selectedDate.getMonth() + 1)).slice(-2)
          + '-' + ('0' + this.selectedDate.getDate()).slice(-2);
      }
      this.setDateModel();
      this.onChangeCallback(this.dateModel);
    }
  }

  plus(type: string, event: any) {
    if (type === 'min') {
      if (this.min === 59) {
        this.min = -1;
        this.hrs++;
      }
      this.min++;
    }
    if (type === 'hrs') {
      this.hrs++;
    }
    if (this.hrs === 24) {
      this.hrs = 0;
    }
    this.selectedDate.setHours(this.hrs);
    this.selectedDate.setMinutes(this.min);
    this.value = this.selectedDate;
    this.isValid = true;
    this.isComponentValid.emit(true);
    this.change.emit(this.value);
    event.stopPropagation();
  }
  minus(type: string, event: any) {
    if (type === 'min') {
      if (this.min === 0) {
        this.min = 60;
        this.hrs--;
      }
      this.min--;
    }
    if (type === 'hrs') {
      this.hrs--;
    }
    if (this.hrs === 0) {
      this.hrs = 23;
    }
    this.selectedDate.setHours(this.hrs);
    this.selectedDate.setMinutes(this.min);
    this.value = this.selectedDate;
    this.isValid = true;
    this.isComponentValid.emit(true);
    this.change.emit(this.value);
    event.stopPropagation();
  }
  // get accessor
  get value(): any {
    return this.innerValue;
  }
  // set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
    }
  }
  // Set touched on blur
  onBlur() {
    this.onTouchedCallback();
    this.onChangeCallback(this.dateModel);
  }

  // From ControlValueAccessor interface
  
  setTimeStamp() {
    if (!this.timestamp) {
      this.dateModel = new Date(this.dateModel);

      this.formatDatePipe();

      this.setDateModel();
      this.onChangeCallback(this.dateModel);
    }
  }


  negateisValid() {
    this.isValid = false;
    this.hrs = 0;
    this.min = 0;
  }

  // From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }
  // From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
  onFocus(elem: any) {
  }
  onFocusOut(value: any) {
    if (isNaN(Date.parse(value.value))) {
      this.isValid = false;
      value.value = '';
    } else {

      if (this.utc) {

        const d = new Date(value.value);
        this.value = new Date(this.getHalfMonthName(d) + ' ' + d.getDate() + ' '
          + d.getFullYear() + ' 05:30:00 UTC');
        this.dateModel = d;
        this.setDateModel();

        if (!this.timestamp) {

          this.formatDatePipe();
          this.setDateModel();
          this.onChangeCallback(this.dateModel);

        }
      } else {
        this.value = new Date(value.value);
        if (!this.timestamp) {
          this.dateModel = new Date(this.dateModel);

          this.formatDatePipe();
          this.setDateModel();
          this.onChangeCallback(this.dateModel);
        }
      }
      this.isValid = true;
    }
  }
  // open picker



  setFocus() {
    setTimeout(() => {
      // focus code starts
      this.daysArray.forEach((row: any, index: number) => {
        row.forEach((day: any, innerindex: number) => {
          if (day.selected) {
            document.getElementById(day.id).focus();
          }
        });
      });
    }, 0);
  }
  getListPosition(elementRef: any): boolean {
    const dropdownHeight = 350; // must be same in dropdown.scss
    if (window.innerHeight - (elementRef.getBoundingClientRect().bottom) < dropdownHeight) {
      this.positionClass = {
        top: ((elementRef.getBoundingClientRect().top - dropdownHeight) + elementRef.getBoundingClientRect().height) + 'px',
      };
      return true;
    } else {
      this.positionClass = {
        top: (elementRef.getBoundingClientRect().top + elementRef.getBoundingClientRect().height) + 'px',
      };
      return false;
    }
  }
  onSelect() {
    this.showToolTip = false;
  }
  validateDays(days: any) {
    const max = new Date(this.maxDate);
    const min = new Date(this.minDate);
    // check1: if min max is null return false
    if (this.maxDate.length <= 0 && this.minDate.length <= 0) {
      return false;
    }
    if ((this.maxDate.length > 0 && this.minDate.length <= 0) ||
      (this.maxDate.length > 0 && this.minDate.length > 0)) {
      this.validateMaxDate(days, max);
    }
    if ((this.maxDate.length <= 0 && this.minDate.length > 0) || (this.maxDate.length > 0 && this.minDate.length > 0)) {
      // 3
      if ((days.getDate() < min.getDate() &&
        days.getMonth() === min.getMonth() && days.getFullYear() === min.getFullYear()) ||
        days.getMonth() < min.getMonth() && days.getFullYear() === min.getFullYear()) {
        return true;
        // 4
      }
    }
    this.disableddays(this.diabledDate);
  }

  private validateMaxDate(days: any, max: any) {
    // check if days greater than max return
    // 1
    if ((days.getDate() > max.getDate() &&
      days.getMonth() >= max.getMonth() && days.getFullYear() >= max.getFullYear()) ||
      days.getMonth() > max.getMonth() && days.getFullYear() === max.getFullYear()) {
      return true;
      // 2
    }
  }
  private disableddays(dates: any) {
    if (dates) {
      dates.forEach((element: any) => {
        const From = new Date(element.from);
        const To = new Date(element.to);
        this.daysArray.forEach((element2: any) => {
          element2.forEach((element1: any) => {
            if (element1.date.getFullYear() <= To.getFullYear() && element1.date.getMonth()
              <= To.getMonth() && element1.date.getDate() <= To.getDate() && element1.date.getFullYear() >= From.getFullYear() &&
              element1.date.getMonth() >= From.getMonth() &&
              element1.date.getDate() >= From.getDate()) {
              element1.isDisabled = true;
            }
          });
        });
      });
    }
  }


  cancelDropdown() {
    this.drop = false;
    this.showToolTip = true;
  }

  // this function is obtained by breaking arrowClickBack() for dropdown year back arrow logic for if
  // this function is broken from resetArrowFlag()
  alterBackArrow(element: any, min: any) {
    if (element.year === min.getFullYear()) {
      this.backArrowFlag = true;
    }
  }

  // this function is broken from backArrow() resets Arrow Flag
  
  // this fn is broken from  backArrow() and it resets Year Flag
  
  // this function is broken from forwardArrow()
  private alterBackForwardArrow(element: any) {
    const min = new Date(this.minDate);
    const max = new Date(this.maxDate);
    if (element.year === min.getFullYear()) {
      this.backArrowFlag = true;
    }
    if (element.year === max.getFullYear() ||
      (element.year === min.getFullYear() && element.year === max.getFullYear())) {
      this.forwardArrowFlag = true;
    }
  }
  // this function is obtained by breaking arrowClickForward() for dropdown year forward arrow logic for if
  

  // chk yearlist1 broken from forwardArrow()
  

  // this function is obtained by breaking arrowClickBack() and arrowClickForward()
  // for rechking arrow flags after reinitialization of yrlist1 & 2
  
  // this function is broken from disableYearFlag() , here year flag disable altered to true
  yearFlagDisable(element: any) {
    const min = new Date(this.minDate);
    const max = new Date(this.maxDate);
    if (element.year < min.getFullYear() || element.year > max.getFullYear()) {
      element.disabled = true;
    } // if ends
  }

  

  
  // onInit Method: If min max date is provided
  

  // Method to disable when min max year provided
  disableMinMaxYear(element: any, min: any, max: any) {
    if (element.year < min.getFullYear() || element.year > max.getFullYear()) {
      element.disabled = true;
    }
  }

  // THIS MEHTOD CHECK INPUT IS VALID OR NOT
  checkValidity(): boolean {
    return this.isValid;
  }

  public validate(c: FormControl) {
    return (this.value || !this.required) ? null : {
      jsonParseError: {
        valid: true,
      },
    };
  }



  refactoredRightArrow(ismonthchanged: boolean, month: any, drindex: number, currentindex: number) {
    if (!ismonthchanged) {
      this.refactoredFocus(month, drindex, currentindex);
    } else {
      this.setFocus();
    }
  }

  refactoredFocus(month: any, drindex: number, currentindex: number) {
    let itemid;
    itemid = month[drindex][currentindex];
    document.getElementById(itemid['id']).focus();
  }


  refactoredarrow(ismonthchanged: boolean, month: any, drindex: number, currentindex: number) {
    let itemid;
    if (!ismonthchanged) {
      itemid = month[drindex][currentindex];
      document.getElementById(itemid['id']).focus();
    } else {
      this.setFocus();
    }
  }



  onInputChange(event: any) {
    // if (event.target.value.length > 0) {
    this.dateModel = new Date(event.target.value);
    // } else {
    //   this.dateModel = '';
    // }
  }



 

  setRoundEdge(type: any) {
    if (type === 'round-edge') {
      this.roundedgeclass = 'roundEdgeCommonCss';
    } else if (type === 'classic') {
      this.roundedgeclass = 'classicCommonCss';
    }
  }

}

//  <input tabindex="-1" type="text" #pickerDt
//             (change)="onInputChange($event)"  value="{{dateModel|date:dateformat}}" [attr.disabled]="disabled ? true: null"
//                 [required]="required ? true: null" (blur)="onBlur()"  (focus)="onFocus(rootDiv)" (focusout)="onFocusOut(pickerDt)"
//                 class="input-control" [ngStyle]="{'cursor': readonly ? 'not-allowed':'pointer'}" [attr.placeholder]="placeholder"
//             />