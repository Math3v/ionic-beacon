import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
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
  beacons: Array<Beacon> = [];

  private unsubscribe: Function;

  constructor(
    public navCtrl: NavController,
    private beacon: IBeacon
  ) { }

  requestBeacon() {
    this.beacon.requestAlwaysAuthorization()
    .then(_ => this.beaconStatus = 'Authorized')
    .catch(err => this.setBeaconError(err));
  }

  startMonitoring() {
    this.delegate = this.beacon.getDelegate();
    const sub = this.delegate.didRangeBeaconsInRegion()
    .subscribe((result: IBeaconPluginResult) => {
      this.beacons = result.beacons;
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
