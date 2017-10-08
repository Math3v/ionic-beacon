import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import {
  IBeacon,
  IBeaconDelegate,
  IBeaconPluginResult,
  Beacon
} from '@ionic-native/ibeacon';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  beaconStatus: string = '';
  delegate: IBeaconDelegate;
  beacons: any = {};

  private unsubscribe: Function;

  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private beacon: IBeacon
  ) {
    this.platform.ready().then(_ => {
      this.requestBeacon()
    })
  }

  requestBeacon() {
    this.beacon.requestWhenInUseAuthorization()
    .then(_ => this.beaconStatus = 'Authorized')
    .catch(err => this.setBeaconError(err));
  }

  startMonitoring() {
    this.delegate = this.beacon.getDelegate();
    const sub = this.delegate.didRangeBeaconsInRegion()
    .subscribe((result: IBeaconPluginResult) => {
      this.beacons = result;
    });

    this.unsubscribe = sub.unsubscribe;
  }

  stopMonitoring() {
    if(this.unsubscribe) {
       this.unsubscribe();
    }
  }

  private setBeaconError(err) {
    this.beaconStatus = JSON.stringify(err);
  }
}
