import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ICampaign } from './model/ICamaign';
@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor() {}

  private campaigns: ICampaign[] = [];
  private campaignsSubject = new BehaviorSubject<ICampaign[]>([]);

  getCampaigns() {
    return this.campaignsSubject.asObservable();
  }

  addCampaign(campaign: ICampaign) {
    this.campaigns.push({ ...campaign, id: this.campaigns.length + 1 });
    this.campaignsSubject.next(this.campaigns);
  }

  updateCampaign(id: number, updatedCampaign: ICampaign) {
    const index = this.campaigns.findIndex((c) => c.id === id);
    if (index !== -1) {
      this.campaigns[index] = updatedCampaign;
      this.campaignsSubject.next(this.campaigns);
    }
  }
}
