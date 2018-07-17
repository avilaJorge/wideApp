import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController } from 'ionic-angular';

import { Tab1Root, Tab2Root, Tab3Root, Tab4Root } from '../';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = Tab1Root;
  tab2Root: any = Tab2Root;
  tab3Root: any = Tab3Root;
  tab4Root: any = Tab4Root;

  tab1Title = " ";
  tab2Title = " ";
  tab3Title = " ";
  tab4Title = " ";

  constructor(public navCtrl: NavController, public translateService: TranslateService) {
    translateService.get(['MapMyWalk', 'Meetup', 'Get It Done', 'TAB3_TITLE']).subscribe(values => {
      this.tab1Title = values['MapMyWalk'];
      this.tab2Title = values['Meetup'];
      this.tab3Title = values['Get It Done'];
      this.tab4Title = values['TAB3_TITLE'];
    });
  }
}
