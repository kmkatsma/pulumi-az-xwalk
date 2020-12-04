import * as pulumi from '@pulumi/pulumi';

export class AppServiceState {
  url!: pulumi.Output<string>;
  name!: pulumi.Output<string>;
}

export enum AppServiceSize {
  F1 = 'F1',
  B1 = 'B1',
}

export enum AppServiceTier {
  Free = 'Free',
  Basic = 'Basic',
}
