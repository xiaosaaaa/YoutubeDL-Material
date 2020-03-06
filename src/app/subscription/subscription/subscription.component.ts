import { Component, OnInit } from '@angular/core';
import { PostsService } from 'app/posts.services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  id = null;
  subscription = null;
  files: any[] = null;

  constructor(private postsService: PostsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    if (this.route.snapshot.paramMap.get('id')) {
      this.id = this.route.snapshot.paramMap.get('id');

      this.getSubscription();
    }
  }

  goBack() {
    this.router.navigate(['/subscriptions']);
  }

  getSubscription() {
    this.postsService.getSubscription(this.id).subscribe(res => {
      this.subscription = res['subscription'];
      console.log(res['files']);
      this.files = res['files'];
    });
  }

  goToFile(name) {
    localStorage.setItem('player_navigator', this.router.url);
    this.router.navigate(['/player', {fileNames: name, type: 'subscription', subscriptionName: this.subscription.name,
                                      subPlaylist: this.subscription.isPlaylist}]);
  }

}
