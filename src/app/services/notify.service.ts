import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';

@Injectable()
export class NotifyService {
    private readonly notifier: NotifierService;

    constructor(private router: Router, notifierService: NotifierService) {
        this.notifier = notifierService;
    }

    notifyError(err) {
        console.log('err', err);
        if (err.detail === 'Invalid token') {
            return;
        }

        if (isObject(err)) {
            Object.keys(err).forEach(key => {
                if (!key) {
                    return;
                }
                let message = err[key];
                if (Array.isArray(message) && isObject(message[0])) {
                    message = message[0];
                    Object.keys(message).forEach(messageKey => {
                        if (!messageKey) {
                            return;
                        }
                        const subMessage = message[messageKey];
                        this.notifier.notify(
                            'error',
                            `${clearErrorKey(key)}:    ${clearErrorKey(
                                messageKey
                            )}: ${subMessage}`
                        );
                    });
                } else {
                    this.notifier.notify(
                        'error',
                        `${clearErrorKey(key)}: ${message}`
                    );
                }
            });
        } else {
            if (
                (typeof err === 'string' || err instanceof String) &&
                err.length < 100
            ) {
                this.notifier.notify('error', `${err}`);
            } else {
                this.notifier.notify('error', `${'unexpected Error Occurred'}`);
            }
        }

        function isObject(item) {
            return (
                typeof item === 'object' &&
                !Array.isArray(item) &&
                item !== null
            );
        }

        function clearErrorKey(key) {
            key = key.replace(/_|-|\./g, ' ').toLowerCase();
            return key[0].toUpperCase() + key.slice(1);
        }
    }

    success(message) {
        this.notifier.notify('success', message);
    }
}
