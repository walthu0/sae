// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    apiUrl: "http://www.yavirac.edu.ec/ignug/server/",
    //apiUrl: 'http://localhost/proyectos/sae/server/'
    firebase: {
        apiKey: "AIzaSyAEnGCT9CTj6af9436tBi0dnpDhW1a6IjQ",
        authDomain: "chat3-f6358.firebaseapp.com",
        databaseURL: "https://chat3-f6358.firebaseio.com",
        projectId: "chat3-f6358",
        storageBucket: "chat3-f6358.appspot.com",
        messagingSenderId: "169759824186"
    },

    firebase2: {
        apiKey: "AIzaSyBDeg8yxGDjlBdADyeaq480Ic3K3cXW5vM",
        authDomain: "simplefire-7d37f.firebaseapp.com",
        databaseURL: "https://simplefire-7d37f.firebaseio.com",
        projectId: "simplefire-7d37f",
        storageBucket: "simplefire-7d37f.appspot.com",
        messagingSenderId: "277620308641"
    }
};
