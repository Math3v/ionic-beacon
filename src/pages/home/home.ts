import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { IBeacon, IBeaconPluginResult, Beacon, BeaconRegion } from '@ionic-native/ibeacon';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  beaconStatus: string = '';
  didEnterBeacons: Array<Beacon> = [];
  didRangeBeacons: Array<Beacon> = [];

  private beaconRegion: BeaconRegion;

  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private beacon: IBeacon
  ) {
    this.platform.ready().then(_ => {
      this.requestBeacon();
      this.beaconRegion = this.beacon.BeaconRegion(
        //'testingBeacon', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D'
        'testingBeacon', 'A0E8D710-4317-FA0E-12F6-5FCCB1DD8975'
      );
    });
  }

  requestBeacon() {
    this.beacon.requestAlwaysAuthorization()
    .then(_ => this.beaconStatus = 'Authorized')
    .catch(err => this.setBeaconError(err));
  }

  startMonitoring() {
    this.beaconStatus = 'Initializing...';

    this.beacon.startMonitoringForRegion(this.beaconRegion)
    .then(_ => {
      this.initializeObservables();
      this.beaconStatus = 'Monitoring...';
    }, e => this.beaconStatus = JSON.stringify(e));
  }

  stopMonitoring() {
    this.beacon.stopMonitoringForRegion(this.beaconRegion)
    .then(_ => this.beaconStatus = 'Stopped',
          e => this.beaconStatus = JSON.stringify(e));
  }

  private setBeaconError(err) {
    this.beaconStatus = JSON.stringify(err);
  }

  private initializeObservables() {
    const delegate = this.beacon.Delegate();

    delegate.didEnterRegion()
    .subscribe((res: IBeaconPluginResult) => {
      this.beaconStatus = 'Entered region';
      this.didEnterBeacons = res.beacons;
    });

    delegate.didRangeBeaconsInRegion()
    .subscribe((res: IBeaconPluginResult) => {
      this.beaconStatus = 'Range region';
      this.didRangeBeacons = res.beacons;
    });
  }
}
