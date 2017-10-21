import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { IBeacon, IBeaconPluginResult, Beacon, BeaconRegion } from '@ionic-native/ibeacon';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  beaconStatus: string = '';
  didEnterBeacons: Array<Beacon> = [];
  didRangeBeacons: Array<Beacon> = [];

  private beaconRegion: BeaconRegion;

  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private beacon: IBeacon
  ) { }

  ngOnInit() {
    this.platform.ready().then(_ => {
      this.requestBeacon();
      this.beaconRegion = this.beacon.BeaconRegion(
       'testingBeacon','A0E8D710-4317-FA0E-12F6-5FCCB1DD8975'
      );
    });
  }

  requestBeacon() {
    this.beacon.requestAlwaysAuthorization()
    .then(_ => this.beaconStatus = 'Authorized')
    .catch(err => this.setBeaconError(err));
  }

  startMonitoring() {
    const delegate = this.beacon.getDelegate();

    delegate.didEnterRegion()
    .subscribe((res: IBeaconPluginResult) => {
      this.didEnterBeacons = res.beacons;
    });

    delegate.didRangeBeaconsInRegion()
    .subscribe((res: IBeaconPluginResult) => {
      this.didRangeBeacons = res.beacons;
    });

    this.beacon.startMonitoringForRegion(this.beaconRegion)
    .then(_ => this.beaconStatus = 'Monitoring...',
          e => this.beaconStatus = JSON.stringify(e));
  }

  stopMonitoring() {
    this.beacon.stopMonitoringForRegion(this.beaconRegion)
    .then(_ => this.beaconStatus = 'Stopped',
          e => this.beaconStatus = JSON.stringify(e));
  }

  private setBeaconError(err) {
    this.beaconStatus = JSON.stringify(err);
  }
}
