import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  GlobalMessageService,
  GlobalMessageType,
  RoutingService,
  UserService,
} from '@spartacus/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'cx-update-email',
  templateUrl: './update-email.component.html',
  styleUrls: ['./update-email.component.scss'],
})
export class UpdateEmailComponent implements OnInit, OnDestroy {
  constructor(
    private routingService: RoutingService,
    private globalMessageService: GlobalMessageService,
    private userService: UserService
  ) {}

  private subscription = new Subscription();
  private uid: string;
  isLoading$: Observable<boolean>;
  newUid: string;

  ngOnInit() {
    this.userService.resetUpdateEmailResultState();
    this.subscription.add(
      this.userService.get().subscribe(result => (this.uid = result.uid))
    );
    this.subscription.add(
      this.userService
        .getUpdateEmailResultSuccess()
        .subscribe(success => this.onSuccess(success))
    );
    this.isLoading$ = this.userService.getUpdateEmailResultLoading();
  }

  onCancel(): void {
    this.routingService.go({ route: ['home'] });
  }

  onSubmit({ newUid, password }: { newUid: string; password: string }): void {
    this.newUid = newUid;
    console.table([this.uid, password, newUid]);
    this.userService.updateEmail(this.uid, password, newUid);
  }

  onSuccess(success: boolean): void {
    if (success) {
      this.globalMessageService.add({
        text: `Email address successfully updated to ${this.newUid}`,
        type: GlobalMessageType.MSG_TYPE_CONFIRMATION,
      });
      this.routingService.go({ route: ['home'] });
    }
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.userService.resetUpdateEmailResultState();
  }
}