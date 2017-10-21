import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { IBeacon, IBeaconPluginResult, Beacon, BeaconRegion } from '@ionic-native/ibeacon';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  beaconStatus: string = '';
  beaconStatuses: Array<string> = [];
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
        'testingBeacon', 'B9407F30-F5F8-466E-AFF9-25556B57FE6D'
        //'testingBeacon', 'A0E8D710-4317-FA0E-12F6-5FCCB1DD8975'
      );
    });
  }

  requestBeacon() {
    this.beacon.requestAlwaysAuthorization()
    .then(_ => this.beaconStatuses.push('Authorized'))
    .catch(err => this.setBeaconError(err));
  }

  startMonitoring() {
    this.beaconStatuses.push('Initializing');

    this.initializeObservables()
    .then(_ => {
      this.beaconStatuses.push('Obserables ready');
      return this.beacon.startMonitoringForRegion(this.beaconRegion);
    }).then(_ => this.beaconStatuses.push('Monitoring'))
    .catch(e => this.beaconStatuses.push(JSON.stringify(e)));
    
  }

  stopMonitoring() {
    this.beacon.stopMonitoringForRegion(this.beaconRegion)
    .then(_ => this.beaconStatuses.push('Stopped'),
          e => this.beaconStatus = JSON.stringify(e));
  }

  private setBeaconError(err) {
    this.beaconStatus = JSON.stringify(err);
  }

  private initializeObservables() {
    this.beaconStatuses.push('Initializing observables');

    return this.beacon.isBluetoothEnabled()
    .then(_ => {
      this.beaconStatuses.push('Bluetooth Enabled');
      return this.beacon.onDomDelegateReady();
    }).then(_ => {
      this.beaconStatuses.push('Dom Delegate ready');
      const delegate = this.beacon.Delegate();
      this.beaconStatuses.push('Got Delegate');

      delegate.didEnterRegion()
      .subscribe((res: IBeaconPluginResult) => {
        this.beaconStatuses.push('Entered region');
        this.didEnterBeacons.concat( res.beacons );
      });
  
      delegate.didRangeBeaconsInRegion()
      .subscribe((res: IBeaconPluginResult) => {
        this.beaconStatuses.push('Ranged beacon');
        this.didRangeBeacons.concat( res.beacons );
      });
    });
  }
}
