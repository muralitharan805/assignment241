import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICampaign } from './model/ICamaign';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'campaign-management';
  campaigns: ICampaign[] = [];
  readonly dialog = inject(MatDialog);
  @ViewChild('dialogFormTemplate', { static: true })
  dialogFormTemplate!: TemplateRef<any>;

  @ViewChild('dialogFormTemplateDelete', { static: true })
  dialogFormTemplateDelete!: TemplateRef<any>;

  campaignForm: FormGroup;
  dialogRef!: MatDialogRef<any>;
  constructor(private formBuilder: FormBuilder) {
    this.campaignForm = this.formBuilder.group({
      type: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      schedule: this.formBuilder.array([]),
    });
  }
  get scheduleArray() {
    return this.campaignForm.get('schedule') as FormArray;
  }
  weekdays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  ifEditePress = false;
  selectedCampaignData!: ICampaign;
  ngOnInit() {}

  // open dialog with form
  openCampaignForm(campaignData?: ICampaign): void {
    this.dialogRef = this.dialog.open(this.dialogFormTemplate, {
      width: '700px',
      data: campaignData || null,
    });
  }

  // modify existing campaign table data
  editCampaign(campaignData: ICampaign) {
    console.log('campaignData ', campaignData);
    this.dialogRef = this.dialog.open(this.dialogFormTemplate, {
      width: '700px',
      data: campaignData || null,
    });

    this.dialogRef.afterOpened().subscribe(() => {
      this.campaignForm.patchValue(campaignData);
      this.ifEditePress = true;
      this.selectedCampaignData = campaignData;
    });
  }

  // delete campaign table data
  deleteCampaign(campaignData: ICampaign) {
    console.log('campaignData ', campaignData);
    this.dialogRef = this.dialog.open(this.dialogFormTemplateDelete, {
      width: '700px',
      data: campaignData || null,
    });

    this.dialogRef.afterOpened().subscribe(() => {});
  }
  // add form array
  addSchedule() {
    this.scheduleArray.push(
      this.formBuilder.group({
        day: ['', Validators.required],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
      })
    );
  }

  // remove form array
  removeSchedule(index: number) {
    this.scheduleArray.removeAt(index);
  }

  // save or modify existing data
  save() {
    if (this.campaignForm.invalid) {
      return;
    }
    console.log(this.campaigns);
    if (this.ifEditePress) {
      const index = this.campaigns.findIndex(
        (c) => c.id === this.selectedCampaignData.id
      );

      const getValue = this.campaigns.map((data) => {
        if (data.id === this.selectedCampaignData.id) {
          data = {
            id: this.selectedCampaignData.id,
            ...this.campaignForm.value,
          };
        }
        return data;
      });
      this.campaigns = getValue;
    } else {
      this.campaigns = [
        ...this.campaigns,
        {
          id: this.campaigns.length + 1,
          ...this.campaignForm.value,
        },
      ];
    }
    this.ifEditePress = false;
    this.dialogRef.close();
    this.campaignForm.reset();
    console.log(this.campaigns);
  }

  getScheduleString(data: any) {
    const formattedData = data.reduce((acc: any, curr: any) => {
      const dayKey = curr.day.toLowerCase(); // Normalize day names

      if (!acc[dayKey]) {
        acc[dayKey] = [];
      }

      acc[dayKey].push(`${curr.startTime} - ${curr.endTime}`);
      return acc;
    }, {});

    return Object.entries(formattedData).map(([day, times]: any) => {
      const formattedDay = day.charAt(0).toUpperCase() + day.slice(1); // Capitalize first letter
      return `${formattedDay} - ${times.join(' , ')}`;
    });
  }
}
