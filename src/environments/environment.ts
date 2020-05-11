// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    version: 'DEV',        // do not change, see /replace.build.js
    timestamp: '0', // do not change, see /replace.build.js
    production: false,
    logOutAfter: 30 * 60 * 1000,
    settings: {
        // WARNING: Using staging enpoints for dev
        backend1: 'https://idr.staging.myappworx.com/',
        backend2: 'https://idr-auth.staging.myappworx.com/',
        ws: 'ws://idr.staging.myappworx.com/notification/',
        imageUrl: 'https://idr-auth.staging.myappworx.com/'
        // backend1: 'http://127.0.0.1:8004/',
        // backend2: 'http://127.0.0.1:8003/',
        // ws: 'ws://127.0.0.1:8004/notification/',
        // imageUrl: 'http://127.0.0.1:8003/'
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
