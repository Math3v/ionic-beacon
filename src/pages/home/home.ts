import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { IBeacon, IBeaconPluginResult, Beacon, BeaconRegion } from '@ionic-native/ibeacon';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  beaconStatus: string = '';
  beacons: Array<Beacon> = [];

  private beaconRegion: BeaconRegion;

  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private beacon: IBeacon,
    private cd: ChangeDetectorRef
  ) {
    this.platform.ready().then(_ => {
      this.requestBeacon();
      this.beaconRegion = this.beacon.BeaconRegion(
        'testingBeacon', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D'
      );
    });
  }

  requestBeacon() {
    this.beacon.requestWhenInUseAuthorization()
    .then(_ => this.beaconStatus = 'Authorized')
    .catch(e => this.setBeaconError(e));
  }

  startMonitoring() {
    this.initializeObservables()
    .then(_ => this.beacon.startRangingBeaconsInRegion(this.beaconRegion))
    .catch(e => this.setBeaconError(e));
    
  }

  stopMonitoring() {
    this.beacon.stopRangingBeaconsInRegion(this.beaconRegion)
    .then(_ => this.beaconStatus = 'Stopped',
          e => this.setBeaconError(e));
  }

  private setBeaconError(err) {
    this.beaconStatus = JSON.stringify(err);
  }

  private initializeObservables() {
    return this.beacon.isBluetoothEnabled()
    .then(_ => this.beacon.onDomDelegateReady())
    .then(_ => {
      const delegate = this.beacon.Delegate();
  
      delegate.didRangeBeaconsInRegion()
      .subscribe((res: IBeaconPluginResult) => {
        this.beacons = res.beacons;
        this.cd.detectChanges();
      });
    });
  }
}
