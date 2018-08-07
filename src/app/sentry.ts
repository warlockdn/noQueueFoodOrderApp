import { IonicErrorHandler } from 'ionic-angular';

import * as Sentry from 'sentry-cordova';

export class SentryIonicErrorHandler extends IonicErrorHandler {
  handleError(error) {
    super.handleError(error);
    try {
      Sentry.captureException(error.originalError || error);
    } catch (e) {
      console.error(e);
    }
  }
}