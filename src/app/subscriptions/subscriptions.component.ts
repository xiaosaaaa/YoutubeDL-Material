import { Component, OnInit, EventEmitter } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SubscribeDialogComponent } from 'app/dialogs/subscribe-dialog/subscribe-dialog.component';
import { PostsService } from 'app/posts.services';
import { Router } from '@angular/router';
import { SubscriptionInfoDialogComponent } from 'app/dialogs/subscription-info-dialog/subscription-info-dialog.component';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {

  playlist_subscriptions = [];
  channel_subscriptions = [];
  subscriptions = null;

  subscriptions_loading = false;

  constructor(private dialog: MatDialog, private postsService: PostsService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getSubscriptions();
  }

  getSubscriptions() {
    this.subscriptions_loading = true;
    this.subscriptions = [];
    this.channel_subscriptions = [];
    this.playlist_subscriptions = [];
    this.postsService.getAllSubscriptions().subscribe(res => {
    this.subscriptions_loading = false;
      this.subscriptions = res['subscriptions'];

      for (let i = 0; i < this.subscriptions.length; i++) {
        const sub = this.subscriptions[i];

        // parse subscriptions into channels and playlists
        if (sub.isPlaylist) {
          this.playlist_subscriptions.push(sub);
        } else {
          this.channel_subscriptions.push(sub);
        }
      }
    });
  }

  goToSubscription(sub) {
    this.router.navigate(['/subscription', {id: sub.id}]);
  }

  openSubscribeDialog() {
    const dialogRef = this.dialog.open(SubscribeDialogComponent, {
      maxWidth: 500,
      width: '80vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.isPlaylist) {
          this.playlist_subscriptions.push(result);
        } else {
          this.channel_subscriptions.push(result);
        }
      }
    });
  }

  showSubInfo(sub) {
    const unsubbedEmitter = new EventEmitter<any>();
    const dialogRef = this.dialog.open(SubscriptionInfoDialogComponent, {
      data: {
        sub: sub,
        unsubbedEmitter: unsubbedEmitter
      }
    });
    unsubbedEmitter.subscribe(success => {
      if (success) {
        this.openSnackBar(`${sub.name} successfully deleted!`)
        this.getSubscriptions();
      }
    })
  }

  // snackbar helper
  public openSnackBar(message: string, action = '') {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
